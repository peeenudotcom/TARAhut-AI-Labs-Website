import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { createServiceClient } from '@/lib/supabase';

const COURSE_ID = 'ai-tools-mastery-beginners';

type AchievementCheck = {
  badge_type: string;
  badge_name: string;
  condition: (scores: { session_number: number; percentage: number }[]) => boolean;
};

const ACHIEVEMENT_CHECKS: AchievementCheck[] = [
  {
    badge_type: 'quiz-champion',
    badge_name: 'Quiz Champion',
    condition: (scores) => {
      if (scores.length === 0) return false;
      const avg = scores.reduce((sum, s) => sum + s.percentage, 0) / scores.length;
      return avg >= 90;
    },
  },
  {
    badge_type: 'prompt-master',
    badge_name: 'Prompt Master',
    condition: (scores) => scores.some((s) => s.session_number === 4),
  },
  {
    badge_type: 'ai-creator',
    badge_name: 'AI Creator',
    condition: (scores) => scores.some((s) => s.session_number === 12),
  },
  {
    badge_type: 'ai-professional',
    badge_name: 'AI Professional',
    condition: (scores) => scores.some((s) => s.session_number === 16),
  },
];

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { session, score, total } = body;

    if (
      typeof session !== 'number' ||
      typeof score !== 'number' ||
      typeof total !== 'number' ||
      total <= 0
    ) {
      return NextResponse.json(
        { error: 'Invalid quiz data. session, score, and total are required.' },
        { status: 400 }
      );
    }

    const db = createServiceClient();

    // 2. Validate session is unlocked for this student
    const { data: unlock, error: unlockError } = await db
      .from('session_unlocks')
      .select('id')
      .eq('student_id', user.id)
      .eq('course_id', COURSE_ID)
      .eq('session_number', session)
      .single();

    if (unlockError || !unlock) {
      return NextResponse.json(
        { error: 'This session is not unlocked yet.' },
        { status: 403 }
      );
    }

    const percentage = Math.round((score / total) * 100);

    // 3. Upsert quiz score
    const { error: upsertError } = await db
      .from('quiz_scores')
      .upsert(
        {
          student_id: user.id,
          course_id: COURSE_ID,
          session_number: session,
          score,
          total,
          percentage,
          completed_at: new Date().toISOString(),
        },
        { onConflict: 'student_id,course_id,session_number' }
      );

    if (upsertError) {
      console.error('Quiz score upsert error:', upsertError);
      return NextResponse.json(
        { error: 'Failed to save quiz score. Please try again.' },
        { status: 500 }
      );
    }

    // 4. Fetch all quiz scores for this student to check achievements
    const { data: allScores } = await db
      .from('quiz_scores')
      .select('session_number, percentage')
      .eq('student_id', user.id)
      .eq('course_id', COURSE_ID);

    const scores = allScores ?? [];

    // 5. Fetch already-earned achievements
    const { data: existingAchievements } = await db
      .from('achievements')
      .select('badge_type')
      .eq('student_id', user.id);

    const earnedTypes = new Set((existingAchievements ?? []).map((a) => a.badge_type));

    // Determine newly earned achievements
    const newAchievements = ACHIEVEMENT_CHECKS.filter(
      (check) => !earnedTypes.has(check.badge_type) && check.condition(scores)
    );

    // Insert new achievements
    if (newAchievements.length > 0) {
      await db.from('achievements').insert(
        newAchievements.map((a) => ({
          student_id: user.id,
          badge_type: a.badge_type,
          badge_name: a.badge_name,
        }))
      );
    }

    return NextResponse.json({
      success: true,
      score,
      total,
      percentage,
      newAchievements: newAchievements.map((a) => ({
        badge_type: a.badge_type,
        badge_name: a.badge_name,
      })),
    });
  } catch (error) {
    console.error('Quiz API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
