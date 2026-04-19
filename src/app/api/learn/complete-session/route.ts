import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { getUser } from '@/lib/auth';
import { courseConfigs } from '@/config/learn-modules';

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { courseId, sessionNumber, quizScore } = await req.json();

    if (!courseId || !sessionNumber) {
      return NextResponse.json({ error: 'Missing courseId or sessionNumber' }, { status: 400 });
    }

    const course = courseConfigs[courseId];
    if (!course) {
      return NextResponse.json({ error: 'Invalid course' }, { status: 400 });
    }

    const supabase = await createServerSupabase();

    // 1. Mark session as completed
    await supabase.from('session_completions').upsert(
      {
        student_id: user.id,
        course_id: courseId,
        session_number: sessionNumber,
        quiz_score: quizScore || null,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'student_id,course_id,session_number' }
    );

    // 2. Save quiz score if provided
    if (quizScore !== undefined) {
      await supabase.from('quiz_scores').upsert(
        {
          student_id: user.id,
          course_id: courseId,
          session_number: sessionNumber,
          score: quizScore,
          total: 8,
          percentage: Math.round((quizScore / 8) * 100),
          completed_at: new Date().toISOString(),
        },
        { onConflict: 'student_id,course_id,session_number' }
      );
    }

    // 3. Unlock next session (if there is one)
    const nextSession = sessionNumber + 1;
    let courseCompleted = false;
    let certificateNumber = null;

    if (nextSession <= course.totalSessions) {
      await supabase.from('session_unlocks').upsert(
        {
          student_id: user.id,
          course_id: courseId,
          session_number: nextSession,
          unlocked_at: new Date().toISOString(),
          unlock_code_used: 'AUTO_SEQUENTIAL',
        },
        { onConflict: 'student_id,course_id,session_number' }
      );
    }

    // 4. Check if ALL sessions are now completed
    const { data: completions } = await supabase
      .from('session_completions')
      .select('session_number')
      .eq('student_id', user.id)
      .eq('course_id', courseId);

    const completedSessions = new Set(completions?.map(c => c.session_number) || []);

    if (completedSessions.size >= course.totalSessions) {
      courseCompleted = true;

      // Generate certificate
      const certNum = `TAR-${courseId.slice(0, 4).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

      const { data: existingCert } = await supabase
        .from('certificates')
        .select('certificate_number')
        .eq('student_id', user.id)
        .eq('course_id', courseId)
        .limit(1);

      if (!existingCert?.length) {
        // Get student name
        const { data: { user: fullUser } } = await supabase.auth.getUser();
        const studentName = fullUser?.user_metadata?.name || fullUser?.email || 'Student';

        await supabase.from('certificates').insert({
          student_id: user.id,
          student_name: studentName,
          course_id: courseId,
          course_title: course.title,
          certificate_number: certNum,
        });

        certificateNumber = certNum;
      } else {
        certificateNumber = existingCert[0].certificate_number;
      }

      // Mark enrollment as completed
      await supabase
        .from('learn_enrollments')
        .update({ completed_at: new Date().toISOString() })
        .eq('student_id', user.id)
        .eq('course_id', courseId);
    }

    return NextResponse.json({
      success: true,
      nextSessionUnlocked: nextSession <= course.totalSessions ? nextSession : null,
      courseCompleted,
      certificateNumber,
      completedCount: completedSessions.size,
      totalSessions: course.totalSessions,
    });
  } catch (error) {
    console.error('Complete session error:', error);
    return NextResponse.json(
      { error: 'Failed to complete session' },
      { status: 500 }
    );
  }
}
