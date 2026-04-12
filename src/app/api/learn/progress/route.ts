import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { createServiceClient } from '@/lib/supabase';

const COURSE_ID = 'ai-tools-mastery-beginners';

export async function GET(_req: NextRequest) {
  try {
    // 1. Authenticate user
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = createServiceClient();

    // Fetch all data in parallel
    const [unlocksResult, scoresResult, achievementsResult] = await Promise.all([
      db
        .from('session_unlocks')
        .select('session_number, unlocked_at')
        .eq('student_id', user.id)
        .eq('course_id', COURSE_ID)
        .order('session_number', { ascending: true }),
      db
        .from('quiz_scores')
        .select('session_number, score, total, percentage, completed_at')
        .eq('student_id', user.id)
        .eq('course_id', COURSE_ID),
      db
        .from('achievements')
        .select('badge_type, badge_name, earned_at')
        .eq('student_id', user.id),
    ]);

    const unlocks = unlocksResult.data ?? [];
    const scores = scoresResult.data ?? [];
    const achievements = achievementsResult.data ?? [];

    // Build unlocked session numbers array
    const unlocked = unlocks.map((u) => u.session_number);

    // Build quiz scores map keyed by session number
    const quizScores: Record<string, { score: number; total: number; percentage: number }> = {};
    for (const s of scores) {
      quizScores[String(s.session_number)] = {
        score: s.score,
        total: s.total,
        percentage: s.percentage,
      };
    }

    // Calculate quiz average across all scored sessions
    const quizAverage =
      scores.length > 0
        ? Math.round(scores.reduce((sum, s) => sum + s.percentage, 0) / scores.length)
        : 0;

    return NextResponse.json({
      unlocked,
      quizScores,
      achievements: achievements.map((a) => a.badge_type),
      totalCompleted: unlocked.length,
      quizAverage,
    });
  } catch (error) {
    console.error('Progress API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
