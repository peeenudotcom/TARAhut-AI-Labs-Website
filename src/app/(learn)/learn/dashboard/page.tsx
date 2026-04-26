import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { createServerSupabase } from '@/lib/supabase-server';
import { learnModules, getCourseConfig, courseConfigs } from '@/config/learn-modules';
import { dailyChallenges } from '@/config/daily-challenges';
import { CodeEntry } from './code-entry';
import { NextSessionPreview } from './next-session-preview';
import { ShareProgress } from './share-progress';
import { PeerPair } from './peer-pair';
import { TeachBack } from './teach-back';
import { FirstConversationCard } from './first-conversation-card';

export const metadata = {
  title: 'My Learning Dashboard',
};

// ── types ────────────────────────────────────────────────────────────────────

interface EnrollmentRow { course_id: string; enrolled_at: string }
interface UnlockRow { session_number: number }
interface QuizRow   { score: number; session_number: number; percentage: number }
interface AchievementRow { badge_type: string; badge_name: string; earned_at: string }
interface StreakRow {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
}

// ── helpers ──────────────────────────────────────────────────────────────────

const BADGE_ICONS: Record<string, string> = {
  'first-steps': '🎯',
  'prompt-master': '⚡',
  'ai-creator': '🎨',
  'ai-professional': '🎓',
  'quiz-champion': '🏆',
};

// Earnings brackets based on sessions completed
const EARNINGS_MAP: Record<number, { min: number; max: number; skills: string }> = {
  0:  { min: 0,     max: 0,     skills: '' },
  4:  { min: 5000,  max: 10000, skills: 'AI content writing, prompt engineering' },
  8:  { min: 10000, max: 20000, skills: 'research, presentations, design' },
  12: { min: 15000, max: 30000, skills: 'video, audio, brand kits' },
  16: { min: 20000, max: 40000, skills: 'websites, freelancing, full portfolio' },
};

function getEarningsBracket(completedCount: number) {
  const bracket = ([16, 12, 8, 4, 0] as const).find((b) => completedCount >= b) ?? 0;
  return EARNINGS_MAP[bracket];
}

function formatCurrency(n: number) {
  if (n >= 1000) return `₹${n / 1000}K`;
  return `₹${n}`;
}

// ── page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ course?: string }>;
}) {
  const user = await requireAuth();
  const supabase = await createServerSupabase();
  const resolvedParams = searchParams ? await searchParams : {};
  const requestedCourse = resolvedParams.course;

  // Detect enrolled courses (most recent active enrollment first)
  const { data: enrollmentRows } = await supabase
    .from('learn_enrollments')
    .select('course_id, enrolled_at')
    .eq('student_id', user.id)
    .is('completed_at', null)
    .order('enrolled_at', { ascending: false });

  const enrollments: EnrollmentRow[] = enrollmentRows ?? [];
  // Active course = requested via query param (if enrolled) or most recent enrollment
  const enrolledIds = new Set(enrollments.map((e) => e.course_id));
  const activeCourseId =
    (requestedCourse && enrolledIds.has(requestedCourse) ? requestedCourse : null) ??
    enrollments[0]?.course_id ??
    'ai-tools-mastery-beginners';
  const courseConfig = getCourseConfig(activeCourseId) ?? getCourseConfig('ai-tools-mastery-beginners')!;
  const activeModules = courseConfig.modules;
  const allCourseIds = enrollments.map((e) => e.course_id).filter((id) => id in courseConfigs);

  const [unlocksResult, quizResult, achievementsResult, streakResult, purchaseResult, certificateResult, firstArtifactResult] = await Promise.all([
    supabase
      .from('session_unlocks')
      .select('session_number')
      .eq('student_id', user.id)
      .eq('course_id', activeCourseId),
    supabase
      .from('quiz_scores')
      .select('score, session_number, percentage')
      .eq('student_id', user.id)
      .eq('course_id', activeCourseId)
      .order('session_number', { ascending: false }),
    supabase
      .from('achievements')
      .select('badge_type, badge_name, earned_at')
      .eq('student_id', user.id),
    supabase
      .from('learn_streaks')
      .select('current_streak, longest_streak, last_activity_date')
      .eq('student_id', user.id)
      .eq('course_id', activeCourseId)
      .maybeSingle(),
    // Did this student buy this course online (paid or promo-unlocked)?
    // If so we skip the trainer-code flow and let them progress on their own.
    supabase
      .from('online_purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .limit(1),
    // Has a certificate already been issued for this course?
    supabase
      .from('certificates')
      .select('certificate_number, issued_at')
      .eq('student_id', user.id)
      .eq('course_id', activeCourseId)
      .maybeSingle(),
    // Earliest live-playground artifact for Session 1 — drives the
    // "Your first AI conversation" card. We pull oldest, not newest,
    // because the *first* conversation is the emotional anchor.
    supabase
      .from('learn_artifacts')
      .select('prompt, response, created_at')
      .eq('student_id', user.id)
      .eq('course_id', activeCourseId)
      .eq('session_number', 1)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  const firstArtifact = firstArtifactResult.data;

  const isOnlinePurchaser = (purchaseResult.data?.length ?? 0) > 0;
  const certificate = certificateResult.data;

  const unlockedSessions = new Set<number>(
    (unlocksResult.data ?? []).map((r: UnlockRow) => r.session_number)
  );
  // Session 1 is always free
  unlockedSessions.add(1);

  // Student has neither bought online NOR been unlocked by a trainer for any
  // session beyond the free first one. They are stuck — the current UI only
  // offered them a trainer code input without ever telling them where to get
  // a code from. Surface the buy path first, then offer the code flow.
  const unlockedBeyondFree = [...unlockedSessions].some((n) => n > 1);
  const hasNoAccessYet = !isOnlinePurchaser && !unlockedBeyondFree && !certificate;

  const quizRows: QuizRow[] = quizResult.data ?? [];
  const avgScore =
    quizRows.length > 0
      ? Math.round(quizRows.reduce((sum, r) => sum + r.percentage, 0) / quizRows.length)
      : null;

  // Most recently completed session (highest session_number with a quiz score)
  const lastCompletedSession = quizRows.length > 0 ? quizRows[0].session_number : null;

  const achievements: AchievementRow[] = achievementsResult.data ?? [];
  const streak: StreakRow | null = streakResult.data ?? null;

  const completedCount = activeModules.filter((m) => unlockedSessions.has(m.session)).length;
  const progressPct = Math.round((completedCount / courseConfig.totalSessions) * 100);

  const displayName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split('@')[0] ??
    'Student';

  // Earnings
  const earnings = getEarningsBracket(completedCount);

  // Next locked session (for the preview quiz)
  const nextLockedModule = activeModules.find((m) => !unlockedSessions.has(m.session)) ?? null;

  // Today's challenge — based on last completed session
  const todayChallenge =
    lastCompletedSession !== null
      ? dailyChallenges.find((c) => c.session === lastCompletedSession) ?? null
      : null;

  return (
    <div className="min-h-screen bg-[#06060e] text-[#e2e8f0]">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-20 border-b border-[#1e1e3a] bg-[#06060e]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/learn" className="text-sm font-semibold text-[#059669] hover:underline">
            ← TARAhut Learning Engine
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/learn/flashcards"
              className="text-sm font-semibold text-[#94a3b8] transition hover:text-[#00f0ff]"
            >
              Flashcards
            </Link>
            <Link
              href="/learn/portfolio"
              className="text-sm font-semibold text-[#94a3b8] transition hover:text-[#00f0ff]"
            >
              My Portfolio
            </Link>
            <span className="text-sm text-[#94a3b8]">{user.email}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* ── Welcome ── */}
        <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="mb-1 text-2xl font-bold text-[#e2e8f0]">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-[#00f0ff] to-[#059669] bg-clip-text text-transparent">
                {displayName}
              </span>
            </h1>
            <p className="text-sm text-[#94a3b8]">
              Keep going — you are making great progress.
            </p>
          </div>
          <ShareProgress
            studentName={displayName}
            completedCount={completedCount}
            totalSessions={courseConfig.totalSessions}
            quizAverage={avgScore}
            streak={streak?.current_streak ?? 0}
          />
        </div>

        {/* ── Certificate celebration (shown when course is complete) ── */}
        {certificate && (
          <div className="mb-10 rounded-2xl border border-[#059669]/40 bg-gradient-to-br from-[#059669]/10 to-[#00f0ff]/5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl" aria-hidden>🎓</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#059669]">
                    Course Complete
                  </p>
                  <p className="mt-0.5 text-xl font-bold text-white">
                    Congratulations, {displayName}!
                  </p>
                  <p className="mt-0.5 text-sm text-[#94a3b8]">
                    Your certificate is ready. Issued{' '}
                    {new Date(certificate.issued_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}.
                  </p>
                </div>
              </div>
              <Link
                href={`/learn/certificate/${activeCourseId}`}
                className="inline-flex items-center gap-2 rounded-lg bg-[#059669] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#047857]"
              >
                View certificate →
              </Link>
            </div>
          </div>
        )}

        {/* ── No-access state: student is logged in but has neither bought
             online nor been unlocked by a trainer yet. Show a clear dual
             path (buy vs enter trainer code) so they aren't stuck staring
             at an empty code-entry input wondering where the code comes
             from. ── */}
        {hasNoAccessYet && (
          <div className="mb-10 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8">
            <h2 className="mb-2 text-xl font-bold text-white">
              You don&apos;t have course access yet
            </h2>
            <p className="mb-6 text-sm text-[#94a3b8]">
              Pick one of the paths below to start learning:
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Online path */}
              <div className="rounded-xl border border-[#059669]/30 bg-[#059669]/5 p-5">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#059669]">
                  Option 1 · Buy online
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">
                  Get a course for ₹999
                </h3>
                <p className="mb-4 text-sm text-[#94a3b8]">
                  Instant access. Complete sessions at your own pace. Certificate when you finish.
                </p>
                <Link
                  href="/learn"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#059669] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#047857]"
                >
                  Browse courses → ₹999
                </Link>
              </div>

              {/* Offline path */}
              <div className="rounded-xl border border-white/[0.08] bg-[#06060e] p-5">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                  Option 2 · Enrolled at a TARAhut centre?
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">
                  Enter today&apos;s trainer code
                </h3>
                <p className="mb-4 text-sm text-[#94a3b8]">
                  Ask your trainer for today&apos;s 6-digit code to unlock your next session.
                </p>
                <CodeEntry />
              </div>
            </div>
          </div>
        )}

        {/* Code entry only — for offline students already mid-course. */}
        {!hasNoAccessYet && !isOnlinePurchaser && !certificate && (
          <div className="mb-10">
            <CodeEntry />
          </div>
        )}

        {/* ── Stats row (4 cards) ── */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="Sessions completed"
            value={`${completedCount} / ${courseConfig.totalSessions}`}
            accent="#059669"
          />
          <StatCard
            label="Quiz average"
            value={avgScore !== null ? `${avgScore}%` : '—'}
            accent="#00f0ff"
          />
          <StatCard
            label="Badges earned"
            value={String(achievements.length)}
            accent="#a78bfa"
          />
          {/* Streak card */}
          <div className="rounded-xl border border-[#1e1e3a] bg-[#0c0c1a] p-5">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
              Daily streak
            </p>
            {streak && streak.current_streak > 0 ? (
              <>
                <p className="text-3xl font-extrabold" style={{ color: '#f97316' }}>
                  🔥 {streak.current_streak}
                </p>
                <p className="mt-0.5 text-xs text-[#94a3b8]">
                  {streak.current_streak === 1 ? '1 day streak' : `${streak.current_streak} day streak`}
                </p>
                <p className="text-xs text-[#94a3b8]">
                  Best: {streak.longest_streak} day{streak.longest_streak !== 1 ? 's' : ''}
                </p>
              </>
            ) : (
              <>
                <p className="text-xl font-extrabold text-[#f97316]">🔥 0</p>
                <p className="mt-0.5 text-xs text-[#94a3b8]">Start your streak today!</p>
              </>
            )}
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-[#e2e8f0]">Overall progress</span>
            <span className="text-[#94a3b8]">{progressPct}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#1e1e3a]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#059669] to-[#00f0ff] transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* ── Your first AI conversation (live-playground artifact) ── */}
        {firstArtifact && (
          <FirstConversationCard
            prompt={firstArtifact.prompt}
            response={firstArtifact.response}
            createdAt={firstArtifact.created_at}
          />
        )}

        {/* ── Today's Challenge ── */}
        {todayChallenge && (
          <div className="mb-10 rounded-2xl border border-[#a78bfa]/20 bg-[#0c0c1a] p-6">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="text-lg" aria-hidden>🎯</span>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#a78bfa]">
                Today&apos;s Challenge — Session {todayChallenge.session}
              </p>
              <span className="ml-auto rounded-full bg-[#a78bfa]/10 px-3 py-1 text-xs font-semibold text-[#a78bfa]">
                {todayChallenge.tool}
              </span>
            </div>
            <p className="mb-1 text-base font-bold text-[#e2e8f0]">{todayChallenge.title}</p>
            <p className="mb-4 text-sm leading-relaxed text-[#94a3b8]">{todayChallenge.challenge}</p>
            <p className="text-xs font-medium text-[#a78bfa]">⏱ {todayChallenge.timeEstimate}</p>
          </div>
        )}

        {/* ── Earnings potential card ── */}
        <div className="mb-10 rounded-2xl border border-[#1e1e3a] bg-[#0c0c1a] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                💰 Earning Potential
              </p>
              {earnings.min > 0 ? (
                <>
                  <p className="text-2xl font-extrabold text-[#e2e8f0]">
                    {formatCurrency(earnings.min)} – {formatCurrency(earnings.max)}
                    <span className="ml-1 text-base font-semibold text-[#94a3b8]">/month</span>
                  </p>
                  <p className="mt-1 text-sm text-[#94a3b8]">
                    With your current skills:{' '}
                    <span className="text-[#00f0ff] capitalize">{earnings.skills}</span>
                  </p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-extrabold text-[#94a3b8]">— / month</p>
                  <p className="mt-1 text-sm text-[#94a3b8]">
                    Complete your first 4 sessions to see your earning potential.
                  </p>
                </>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-[#94a3b8]">Next milestone</p>
              {completedCount < 16 ? (
                <p className="mt-0.5 text-sm font-semibold text-[#059669]">
                  {completedCount < 4
                    ? `${4 - completedCount} session${4 - completedCount !== 1 ? 's' : ''} to ₹5K–₹10K/mo`
                    : completedCount < 8
                    ? `${8 - completedCount} session${8 - completedCount !== 1 ? 's' : ''} to ₹10K–₹20K/mo`
                    : completedCount < 12
                    ? `${12 - completedCount} session${12 - completedCount !== 1 ? 's' : ''} to ₹15K–₹30K/mo`
                    : `${16 - completedCount} session${16 - completedCount !== 1 ? 's' : ''} to ₹20K–₹40K/mo`}
                </p>
              ) : (
                <p className="mt-0.5 text-sm font-semibold text-[#059669]">
                  Full potential unlocked! 🎓
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Next session preview quiz ── */}
        {nextLockedModule && (
          <div className="mb-10">
            <NextSessionPreview
              sessionNumber={nextLockedModule.session}
              sessionTitle={nextLockedModule.title}
              questions={nextLockedModule.previewQuestions}
            />
          </div>
        )}

        {/* ── Peer Pair + Teach Back (shown when at least 1 session completed) ── */}
        {lastCompletedSession !== null && (() => {
          const mod = activeModules.find((m) => m.session === lastCompletedSession);
          if (!mod) return null;
          return (
            <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <PeerPair
                lastCompletedSession={lastCompletedSession}
                sessionTitle={mod.title}
              />
              <TeachBack
                lastCompletedSession={lastCompletedSession}
                sessionTitle={mod.title}
              />
            </div>
          );
        })()}

        {/* ── Module grid ── */}
        {/* ── Course switcher (shown when enrolled in multiple courses) ── */}
        {allCourseIds.length > 1 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">My courses:</span>
            {allCourseIds.map((id) => {
              const cfg = getCourseConfig(id);
              if (!cfg) return null;
              return (
                <Link
                  key={id}
                  href={`/learn/dashboard?course=${id}`}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    id === activeCourseId
                      ? 'bg-[#059669] text-white'
                      : 'border border-[#1e1e3a] text-[#94a3b8] hover:border-[#059669] hover:text-[#059669]'
                  }`}
                >
                  {cfg.title}
                </Link>
              );
            })}
          </div>
        )}

        <h2 className="mb-6 text-lg font-bold text-[#e2e8f0]">All Sessions</h2>
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {activeModules.map((mod) => {
            const unlocked = unlockedSessions.has(mod.session);
            return (
              <ModuleCard
                key={mod.session}
                mod={mod}
                unlocked={unlocked}
                courseId={activeCourseId}
                isOnlinePurchaser={isOnlinePurchaser}
              />
            );
          })}
        </div>

        {/* ── Achievements ── */}
        {achievements.length > 0 && (
          <section>
            <h2 className="mb-4 text-lg font-bold text-[#e2e8f0]">Achievements</h2>
            <div className="flex flex-wrap gap-3">
              {achievements.map((a) => (
                <div
                  key={a.badge_type}
                  className="flex items-center gap-2 rounded-xl border border-[#1e1e3a] bg-[#0c0c1a] px-4 py-3"
                >
                  <span className="text-2xl" role="img" aria-label={a.badge_name}>
                    {BADGE_ICONS[a.badge_type] ?? '🏅'}
                  </span>
                  <span className="text-sm font-medium text-[#e2e8f0]">{a.badge_name}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// ── sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-[#1e1e3a] bg-[#0c0c1a] p-5">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
        {label}
      </p>
      <p className="text-3xl font-extrabold" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}

function ModuleCard({
  mod,
  unlocked,
  courseId,
  isOnlinePurchaser,
}: {
  mod: (typeof learnModules)[number];
  unlocked: boolean;
  courseId: string;
  isOnlinePurchaser: boolean;
}) {
  const courseParam = courseId !== 'ai-tools-mastery-beginners' ? `?course=${courseId}` : '';
  if (unlocked) {
    return (
      <Link
        href={`/learn/session/${mod.session}${courseParam}`}
        className="group flex flex-col rounded-xl border-2 border-[#00f0ff]/40 bg-[#0c0c1a] p-5 transition hover:border-[#00f0ff] hover:shadow-lg hover:shadow-[#00f0ff]/10"
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-[#94a3b8]">Session {mod.session}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 text-[#059669]"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h3 className="mb-1 text-sm font-bold text-[#e2e8f0] group-hover:text-[#00f0ff] transition">
          {mod.title}
        </h3>
        <p className="mb-4 text-xs leading-relaxed text-[#94a3b8]">{mod.description}</p>
        <span className="mt-auto inline-block rounded-lg bg-[#059669]/20 px-3 py-1.5 text-xs font-semibold text-[#059669]">
          {mod.isFree ? 'Start' : 'Continue'} →
        </span>
      </Link>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border border-[#1e1e3a] bg-[#0c0c1a] p-5 opacity-60">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-[#94a3b8]">Session {mod.session}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-4 w-4 text-[#94a3b8]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      </div>
      <h3 className="mb-1 text-sm font-bold text-[#e2e8f0]">{mod.title}</h3>
      <p className="mb-4 text-xs leading-relaxed text-[#94a3b8]">{mod.description}</p>
      <span className="mt-auto inline-block rounded-lg border border-[#1e1e3a] px-3 py-1.5 text-xs font-semibold text-[#94a3b8]">
        {isOnlinePurchaser
          ? `Complete Session ${mod.session - 1} to unlock`
          : 'Enter code to unlock'}
      </span>
    </div>
  );
}
