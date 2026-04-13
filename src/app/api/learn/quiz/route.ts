import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { createServiceClient } from '@/lib/supabase';
import { Resend } from 'resend';
import { renderSessionRecapHtml } from '@/lib/email/session-recap-template';
import { dailyChallenges } from '@/config/daily-challenges';
import { courseConfigs, getCourseConfig } from '@/config/learn-modules';

type AchievementCheck = {
  badge_type: string;
  badge_name: string;
  condition: (scores: { session_number: number; percentage: number }[]) => boolean;
};

const ACHIEVEMENT_CHECKS: AchievementCheck[] = [
  {
    badge_type: 'first-steps',
    badge_name: 'First Steps',
    // Awarded after student's first quiz ever (at least 1 score exists)
    condition: (scores) => scores.length >= 1,
  },
  {
    badge_type: 'prompt-master',
    badge_name: 'Prompt Master',
    condition: (scores) => scores.some((s) => s.session_number === 4 && s.percentage >= 60),
  },
  {
    badge_type: 'ai-creator',
    badge_name: 'AI Creator',
    condition: (scores) => scores.some((s) => s.session_number === 12 && s.percentage >= 60),
  },
  {
    badge_type: 'ai-professional',
    badge_name: 'AI Professional',
    condition: (scores) => scores.some((s) => s.session_number === 16 && s.percentage >= 60),
  },
  {
    badge_type: 'quiz-champion',
    badge_name: 'Quiz Champion',
    condition: (scores) => {
      if (scores.length === 0) return false;
      const avg = scores.reduce((sum, s) => sum + s.percentage, 0) / scores.length;
      return avg >= 90;
    },
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
    const { session, score, total, courseId } = body;
    const COURSE_ID = (courseId && courseId in courseConfigs) ? courseId : 'ai-tools-mastery-beginners';
    const courseConfig = getCourseConfig(COURSE_ID)!;

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

    // Validate session is within bounds for this course
    if (!courseConfig || session < 1 || session > courseConfig.totalSessions) {
      return NextResponse.json({ error: 'Invalid session number.' }, { status: 400 });
    }

    const db = createServiceClient();

    // 2. Validate session is unlocked for this student
    // Session 1 is always free — skip the unlock check
    if (session !== 1) {
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

    // 7. Send session recap email
    try {
      const mod = courseConfig.modules.find((m) => m.session === session);
      const challenge = dailyChallenges.find((c) => c.session === session);
      // Re-read streak to get the current value after the upsert above
      const { data: freshStreak } = await db
        .from('learn_streaks')
        .select('current_streak')
        .eq('student_id', user.id)
        .eq('course_id', COURSE_ID)
        .maybeSingle();

      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'TARAhut AI Labs <hello@tarahutailabs.com>',
        to: user.email!,
        subject: `Session ${session} Complete: ${mod?.title ?? 'Great work!'}`,
        html: renderSessionRecapHtml({
          studentName:
            user.user_metadata?.name ??
            user.email?.split('@')[0] ??
            'Student',
          sessionNumber: session,
          sessionTitle: mod?.title ?? '',
          deliverable: mod?.deliverable ?? '',
          nextChallenge: challenge?.challenge ?? '',
          nextChallengeTime: challenge?.timeEstimate,
          streak: freshStreak?.current_streak ?? 1,
          dashboardUrl: 'https://tarahutailabs.com/learn/dashboard',
        }),
      });
    } catch (emailErr) {
      console.error('Recap email failed:', emailErr);
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
