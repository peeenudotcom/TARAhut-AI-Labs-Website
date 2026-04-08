import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { courses } from '@/config/courses';

function generateVerificationId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'UPL-';
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseSlug } = await req.json();

    if (!courseSlug) {
      return NextResponse.json({ error: 'Course slug required' }, { status: 400 });
    }

    const course = courses.find((c) => c.slug === courseSlug);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check enrollment
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('student_id', user.id)
      .eq('course_id', courseSlug)
      .single();

    if (!enrollment) {
      return NextResponse.json({ error: 'Not enrolled in this course' }, { status: 403 });
    }

    // Check if all lessons are complete
    const { data: completions } = await supabase
      .from('lesson_completions')
      .select('lesson_key')
      .eq('enrollment_id', enrollment.id);

    const totalLessons = course.syllabus.reduce(
      (sum, mod) => sum + mod.topics.length,
      0
    );
    const completedCount = completions?.length ?? 0;

    if (completedCount < totalLessons) {
      return NextResponse.json(
        { error: `Complete all lessons first. ${completedCount}/${totalLessons} done.` },
        { status: 400 }
      );
    }

    // Check if certificate already exists (idempotent)
    const { data: existing } = await supabase
      .from('certificates')
      .select('id, verification_id')
      .eq('student_id', user.id)
      .eq('course_id', courseSlug)
      .single();

    if (existing) {
      return NextResponse.json({
        certificateId: existing.id,
        verificationId: existing.verification_id,
      });
    }

    // Get student profile name or email
    const { data: profile } = await supabase
      .from('student_profiles')
      .select('name')
      .eq('id', user.id)
      .single();

    const studentName = profile?.name ?? user.email ?? 'Student';
    const verificationId = generateVerificationId();

    // Create certificate
    const { data: cert, error } = await supabase
      .from('certificates')
      .insert({
        student_id: user.id,
        course_id: courseSlug,
        verification_id: verificationId,
        student_name: studentName,
        course_title: course.title,
      })
      .select('id, verification_id')
      .single();

    if (error) {
      console.error('Certificate insert error:', error);
      throw new Error('Failed to create certificate');
    }

    // Mark enrollment as completed
    await supabase
      .from('enrollments')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', enrollment.id);

    return NextResponse.json({
      certificateId: cert.id,
      verificationId: cert.verification_id,
    });
  } catch (error) {
    console.error('Certificate API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}
