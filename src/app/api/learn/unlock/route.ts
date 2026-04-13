import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { createServiceClient } from '@/lib/supabase';
import { courseConfigs } from '@/config/learn-modules';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit: 5 unlock attempts per 10 minutes per authenticated user
    const { allowed } = rateLimit(`unlock:${user.id}`, { limit: 5, windowMs: 600_000 });
    if (!allowed) {
      return NextResponse.json({ error: 'Too many attempts. Please wait 10 minutes.' }, { status: 429 });
    }

    const body = await req.json();
    const { code, courseId } = body;
    const COURSE_ID = (courseId && courseId in courseConfigs) ? courseId : 'ai-tools-mastery-beginners';

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const db = createServiceClient();

    // 2. Find matching active, non-expired daily code
    const { data: codes, error: codeError } = await db
      .from('daily_codes')
      .select('*')
      .eq('code', code.trim())
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .order('generated_at', { ascending: false })
      .limit(1);

    if (codeError) {
      console.error('Code lookup error:', codeError);
    }

    const dailyCode = codes?.[0] ?? null;

    if (!dailyCode) {
      console.error('No matching code found. Input:', code.trim(), 'Active codes count:', codes?.length);
      return NextResponse.json(
        { error: 'Invalid or expired code. Please check with your trainer.' },
        { status: 400 }
      );
    }

    // 3. Check student has an active enrollment
    const { data: enrollment, error: enrollError } = await db
      .from('learn_enrollments')
      .select('id, batch_id')
      .eq('student_id', user.id)
      .eq('course_id', COURSE_ID)
      .is('completed_at', null)
      .single();

    if (enrollError || !enrollment) {
      return NextResponse.json(
        { error: 'You are not enrolled in this course.' },
        { status: 403 }
      );
    }

    // Validate that the code belongs to the student's batch
    if (dailyCode.batch_id !== enrollment.batch_id) {
      return NextResponse.json(
        { error: 'This code is not valid for your batch.' },
        { status: 403 }
      );
    }

    // 4. Check if session is already unlocked for this student
    const { data: existingUnlock } = await db
      .from('session_unlocks')
      .select('id')
      .eq('student_id', user.id)
      .eq('course_id', COURSE_ID)
      .eq('session_number', dailyCode.session_number)
      .single();

    if (existingUnlock) {
      return NextResponse.json({
        success: true,
        alreadyUnlocked: true,
        sessionNumber: dailyCode.session_number,
        message: `Session ${dailyCode.session_number} was already unlocked.`,
      });
    }

    // 5. Insert session unlock record
    const { error: unlockError } = await db
      .from('session_unlocks')
      .insert({
        student_id: user.id,
        course_id: COURSE_ID,
        session_number: dailyCode.session_number,
        unlock_code_used: code.trim(),
      });

    if (unlockError) {
      console.error('Session unlock insert error:', unlockError);
      return NextResponse.json(
        { error: 'Failed to unlock session. Please try again.' },
        { status: 500 }
      );
    }

    // 6. Update streak
    const today = new Date().toISOString().split('T')[0];
    const { data: streak } = await db
      .from('learn_streaks')
      .select('*')
      .eq('student_id', user.id)
      .eq('course_id', COURSE_ID)
      .maybeSingle();

    if (!streak) {
      await db.from('learn_streaks').insert({
        student_id: user.id,
        course_id: COURSE_ID,
        current_streak: 1,
        longest_streak: 1,
        last_activity_date: today,
      });
    } else if (streak.last_activity_date !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newStreak = streak.last_activity_date === yesterday ? streak.current_streak + 1 : 1;
      const longest = Math.max(newStreak, streak.longest_streak);
      await db
        .from('learn_streaks')
        .update({ current_streak: newStreak, longest_streak: longest, last_activity_date: today })
        .eq('id', streak.id);
    }

    // 7. Return success
    return NextResponse.json({
      success: true,
      sessionNumber: dailyCode.session_number,
      message: `Session ${dailyCode.session_number} unlocked successfully!`,
    });
  } catch (error) {
    console.error('Unlock API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
