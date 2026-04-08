import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { enrollmentId, lessonKey } = await req.json();

    if (!enrollmentId || !lessonKey) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Verify the enrollment belongs to this user
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('id', enrollmentId)
      .eq('student_id', user.id)
      .single();

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    // Upsert completion (idempotent)
    const { error } = await supabase
      .from('lesson_completions')
      .upsert(
        { enrollment_id: enrollmentId, lesson_key: lessonKey },
        { onConflict: 'enrollment_id,lesson_key' }
      );

    if (error) {
      console.error('Progress update error:', error);
      throw new Error('Failed to update progress');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Progress API error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { enrollmentId, lessonKey } = await req.json();

    if (!enrollmentId || !lessonKey) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Verify ownership
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('id', enrollmentId)
      .eq('student_id', user.id)
      .single();

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    await supabase
      .from('lesson_completions')
      .delete()
      .eq('enrollment_id', enrollmentId)
      .eq('lesson_key', lessonKey);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Progress delete error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
