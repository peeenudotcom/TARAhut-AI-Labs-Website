import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { createServerSupabase } from '@/lib/supabase-server';
import { learnModules } from '@/config/learn-modules';

export const metadata = {
  title: 'My Portfolio — TARAhut Learning Engine',
};

interface UnlockRow { session_number: number }

export default async function PortfolioPage() {
  const user = await requireAuth();
  const supabase = await createServerSupabase();

  const { data: unlocksData } = await supabase
    .from('session_unlocks')
    .select('session_number')
    .eq('student_id', user.id);

  const unlockedSessions = new Set<number>(
    (unlocksData ?? []).map((r: UnlockRow) => r.session_number)
  );
  // Session 1 is always free
  unlockedSessions.add(1);

  const completedCount = learnModules.filter((m) => unlockedSessions.has(m.session)).length;

  // Find the Session 13 portfolio website — the live Bolt.new site
  const session13Unlocked = unlockedSessions.has(13);

  return (
    <div className="min-h-screen bg-[#06060e] text-[#e2e8f0]">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-[#1e1e3a] bg-[#06060e]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/learn/dashboard" className="text-sm font-semibold text-[#059669] hover:underline">
            ← Dashboard
          </Link>
          <span className="text-sm text-[#94a3b8]">{user.email}</span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-[#e2e8f0]">My Portfolio</h1>
          <p className="mt-1 text-sm text-[#94a3b8]">
            Everything you have built on your AI journey.
          </p>
        </div>

        {/* Count badge */}
        <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-[#059669]/40 bg-[#059669]/10 px-4 py-2 text-sm font-semibold text-[#059669]">
          <span>Your Portfolio: {completedCount} of 16 items</span>
          {completedCount === 16 && <span>🎓</span>}
        </div>

        {/* Portfolio grid */}
        <div className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {learnModules.map((mod) => {
            const isCompleted = unlockedSessions.has(mod.session);
            return (
              <PortfolioCard
                key={mod.session}
                session={mod.session}
                title={mod.title}
                deliverable={mod.deliverable}
                isCompleted={isCompleted}
              />
            );
          })}
        </div>

        {/* Share CTA */}
        <div className="rounded-2xl border border-[#1e1e3a] bg-[#0c0c1a] p-8 text-center">
          <p className="mb-1 text-lg font-bold text-[#e2e8f0]">Share Your Portfolio</p>
          <p className="mb-6 text-sm text-[#94a3b8]">
            {session13Unlocked
              ? 'You built your portfolio website in Session 13. Time to share it with the world!'
              : 'Complete Session 13 to build and publish your live portfolio website with Bolt.new.'}
          </p>
          {session13Unlocked ? (
            <Link
              href="/learn/session/13"
              className="inline-block rounded-xl bg-gradient-to-r from-[#059669] to-[#00f0ff] px-6 py-3 text-sm font-bold text-[#06060e] transition hover:opacity-90"
            >
              Open Session 13 — Get Your Portfolio Link →
            </Link>
          ) : (
            <Link
              href="/learn/dashboard"
              className="inline-block rounded-xl border border-[#059669]/40 px-6 py-3 text-sm font-semibold text-[#059669] transition hover:border-[#059669] hover:bg-[#059669]/10"
            >
              Keep Learning to Unlock →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PortfolioCard({
  session,
  title,
  deliverable,
  isCompleted,
}: {
  session: number;
  title: string;
  deliverable: string;
  isCompleted: boolean;
}) {
  if (isCompleted) {
    return (
      <Link
        href={`/learn/session/${session}`}
        className="group flex flex-col rounded-xl border-2 border-[#059669]/30 bg-[#0c0c1a] p-5 transition hover:border-[#059669] hover:shadow-lg hover:shadow-[#059669]/10"
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <span className="text-xs font-medium text-[#94a3b8]">Session {session}</span>
          <span className="shrink-0 text-base" aria-label="Completed">
            ✅
          </span>
        </div>
        <h3 className="mb-2 text-sm font-bold text-[#e2e8f0] group-hover:text-[#059669] transition">
          {title}
        </h3>
        <p className="mb-4 flex-1 text-xs leading-relaxed text-[#94a3b8]">
          <span className="font-medium text-[#00f0ff]">Built: </span>
          {deliverable}
        </p>
        <span className="mt-auto inline-block rounded-lg bg-[#059669]/20 px-3 py-1.5 text-xs font-semibold text-[#059669]">
          Revisit →
        </span>
      </Link>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border border-[#1e1e3a] bg-[#0c0c1a] p-5 opacity-50">
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-[#94a3b8]">Session {session}</span>
        <span className="shrink-0 text-base" aria-label="Locked">
          🔒
        </span>
      </div>
      <h3 className="mb-2 text-sm font-bold text-[#e2e8f0]">{title}</h3>
      <p className="mb-4 flex-1 text-xs leading-relaxed text-[#94a3b8] blur-[3px] select-none">
        {deliverable}
      </p>
      <span className="mt-auto inline-block rounded-lg border border-[#1e1e3a] px-3 py-1.5 text-xs font-semibold text-[#94a3b8]">
        Locked
      </span>
    </div>
  );
}
