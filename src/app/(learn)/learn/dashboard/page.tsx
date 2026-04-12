import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { createServerSupabase } from '@/lib/supabase-server';
import { learnModules } from '@/config/learn-modules';
import { CodeEntry } from './code-entry';

export const metadata = {
  title: 'My Learning Dashboard',
};

// ── types ────────────────────────────────────────────────────────────────────

interface UnlockRow { session_number: number }
interface QuizRow   { score: number }
interface AchievementRow { badge_id: string; label: string; icon: string; earned_at: string }

// ── helpers ──────────────────────────────────────────────────────────────────

const BADGE_ICONS: Record<string, string> = {
  first_session: '🎯',
  week_1_complete: '🏆',
  week_2_complete: '🚀',
  week_3_complete: '🎨',
  week_4_complete: '🎓',
  perfect_quiz: '⭐',
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

// ── page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const user = await requireAuth();
  const supabase = await createServerSupabase();

  const [unlocksResult, quizResult, achievementsResult] = await Promise.all([
    supabase
      .from('session_unlocks')
      .select('session_number')
      .eq('user_id', user.id),
    supabase
      .from('quiz_scores')
      .select('score')
      .eq('user_id', user.id),
    supabase
      .from('achievements')
      .select('badge_id, label, icon, earned_at')
      .eq('user_id', user.id),
  ]);

  const unlockedSessions = new Set<number>(
    (unlocksResult.data ?? []).map((r: UnlockRow) => r.session_number)
  );
  // Session 1 is always free
  unlockedSessions.add(1);

  const quizScores: number[] = (quizResult.data ?? []).map((r: QuizRow) => r.score);
  const avgScore =
    quizScores.length > 0
      ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
      : null;

  const achievements: AchievementRow[] = achievementsResult.data ?? [];

  const completedCount = learnModules.filter((m) => unlockedSessions.has(m.session)).length;
  const progressPct = Math.round((completedCount / 16) * 100);

  const displayName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split('@')[0] ??
    'Student';

  return (
    <div className="min-h-screen bg-[#06060e] text-[#e2e8f0]">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-20 border-b border-[#1e1e3a] bg-[#06060e]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/learn" className="text-sm font-semibold text-[#059669] hover:underline">
            ← TARAhut Learning Engine
          </Link>
          <span className="text-sm text-[#94a3b8]">{user.email}</span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* ── Welcome ── */}
        <h1 className="mb-1 text-2xl font-bold text-[#e2e8f0]">
          Welcome back,{' '}
          <span className="bg-gradient-to-r from-[#00f0ff] to-[#059669] bg-clip-text text-transparent">
            {displayName}
          </span>
        </h1>
        <p className="mb-10 text-sm text-[#94a3b8]">
          Keep going — you are making great progress.
        </p>

        {/* ── Code entry ── */}
        <div className="mb-10">
          <CodeEntry />
        </div>

        {/* ── Stats row ── */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Sessions completed"
            value={`${completedCount} / 16`}
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
        </div>

        {/* ── Progress bar ── */}
        <div className="mb-10">
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

        {/* ── Module grid ── */}
        <h2 className="mb-6 text-lg font-bold text-[#e2e8f0]">All Sessions</h2>
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {learnModules.map((mod) => {
            const unlocked = unlockedSessions.has(mod.session);
            return (
              <ModuleCard
                key={mod.session}
                mod={mod}
                unlocked={unlocked}
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
                  key={a.badge_id}
                  className="flex items-center gap-2 rounded-xl border border-[#1e1e3a] bg-[#0c0c1a] px-4 py-3"
                >
                  <span className="text-2xl" role="img" aria-label={a.label}>
                    {BADGE_ICONS[a.badge_id] ?? a.icon ?? '🏅'}
                  </span>
                  <span className="text-sm font-medium text-[#e2e8f0]">{a.label}</span>
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
}: {
  mod: (typeof learnModules)[number];
  unlocked: boolean;
}) {
  if (unlocked) {
    return (
      <Link
        href={`/learn/session/${mod.session}`}
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
        Enter code to unlock
      </span>
    </div>
  );
}
