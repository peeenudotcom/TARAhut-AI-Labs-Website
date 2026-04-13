import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUser } from '@/lib/auth';
import { createServerSupabase } from '@/lib/supabase-server';
import { learnModules } from '@/config/learn-modules';

// ── types ─────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ n: string }>;
}

// ── helpers ───────────────────────────────────────────────────────────────────

function padSession(n: number) {
  return String(n).padStart(2, '0');
}

// ── page ──────────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props) {
  const { n } = await params;
  const sessionNum = parseInt(n, 10);
  const mod = learnModules.find((m) => m.session === sessionNum);
  return {
    title: mod ? `Session ${sessionNum}: ${mod.title}` : 'Session not found',
  };
}

export default async function SessionPage({ params }: Props) {
  const { n } = await params;
  const sessionNum = parseInt(n, 10);

  // Validate session number
  const mod = learnModules.find((m) => m.session === sessionNum);
  if (!mod || sessionNum < 1 || sessionNum > 16) {
    redirect('/learn');
  }

  // Session 1 is always free — no auth required
  const isFreeSession = mod.isFree;

  const user = await getUser();

  // Non-free sessions require auth
  if (!isFreeSession && !user) {
    redirect('/login');
  }

  let isUnlocked = isFreeSession; // session 1 always unlocked

  if (!isUnlocked && user) {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from('session_unlocks')
      .select('session_number')
      .eq('student_id', user.id)
      .eq('session_number', sessionNum)
      .maybeSingle();

    isUnlocked = !!data;
  }

  if (!isUnlocked) {
    redirect('/learn/dashboard');
  }

  const displayName =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split('@')[0] ??
    'Guest';

  const sessionFile = `/learn/session-${padSession(sessionNum)}.html`;
  const prevSession = sessionNum > 1 ? sessionNum - 1 : null;
  const nextSession = sessionNum < 16 ? sessionNum + 1 : null;

  return (
    <div
      className="flex h-screen flex-col bg-[#06060e]"
    >
      {/* ── Top bar ── */}
      <header className="flex shrink-0 items-center justify-between border-b border-[#1e1e3a] bg-[#0c0c1a] px-4 py-3">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href={user ? '/learn/dashboard' : '/learn'}
            className="shrink-0 text-sm font-semibold text-[#059669] hover:underline"
          >
            ← Dashboard
          </Link>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-bold text-[#e2e8f0]">
              Session {sessionNum}: {mod.title}
            </p>
            <p className="text-xs text-[#94a3b8]">{mod.description}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {/* Prev / Next navigation */}
          {prevSession && (
            <Link
              href={`/learn/session/${prevSession}`}
              className="rounded-lg border border-[#1e1e3a] px-3 py-1.5 text-xs font-medium text-[#94a3b8] transition hover:border-[#059669] hover:text-[#059669]"
            >
              ← Prev
            </Link>
          )}
          {nextSession && (
            <Link
              href={`/learn/session/${nextSession}`}
              className="rounded-lg border border-[#1e1e3a] px-3 py-1.5 text-xs font-medium text-[#94a3b8] transition hover:border-[#059669] hover:text-[#059669]"
            >
              Next →
            </Link>
          )}

          {/* Student name badge */}
          {user && (
            <span className="hidden rounded-full bg-[#059669]/10 px-3 py-1 text-xs font-semibold text-[#059669] sm:inline-block">
              {displayName}
            </span>
          )}
        </div>
      </header>

      {/* ── Content area with watermark ── */}
      <div className="relative flex-1 overflow-hidden">
        {/* Watermark overlay */}
        {user && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center select-none"
          >
            <p
              className="rotate-[-35deg] text-4xl font-black tracking-widest text-white/[0.04] sm:text-6xl"
              style={{ userSelect: 'none' }}
            >
              {displayName}
            </p>
          </div>
        )}

        {/* Module iframe */}
        <iframe
          src={sessionFile}
          title={`Session ${sessionNum}: ${mod.title}`}
          className="h-full w-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* ── Bottom tools row ── */}
      {mod.tools.length > 0 && (
        <footer className="shrink-0 border-t border-[#1e1e3a] bg-[#0c0c1a] px-4 py-2">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="shrink-0 text-xs text-[#94a3b8]">Tools used:</span>
            {mod.tools.map((tool) => (
              <span
                key={tool}
                className="shrink-0 rounded-full border border-[#1e1e3a] px-2.5 py-1 text-xs text-[#94a3b8]"
              >
                {tool}
              </span>
            ))}
          </div>
        </footer>
      )}
    </div>
  );
}
