import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUser } from '@/lib/auth';
import { createServerSupabase } from '@/lib/supabase-server';
import { getCourseConfig } from '@/config/learn-modules';
import { SessionViewer } from './session-viewer';

// ── types ─────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ n: string }>;
  searchParams: Promise<{ course?: string }>;
}

// ── helpers ───────────────────────────────────────────────────────────────────

function padSession(n: number) {
  return String(n).padStart(2, '0');
}

// ── page ──────────────────────────────────────────────────────────────────────

export async function generateMetadata({ params, searchParams }: Props) {
  const { n } = await params;
  const { course } = await searchParams;
  const courseId = course || 'ai-tools-mastery-beginners';
  const config = getCourseConfig(courseId);
  const sessionNum = parseInt(n, 10);
  const mod = config?.modules.find((m) => m.session === sessionNum);
  return {
    title: mod ? `Session ${sessionNum}: ${mod.title}` : 'Session not found',
  };
}

export default async function SessionPage({ params, searchParams }: Props) {
  const { n } = await params;
  const { course } = await searchParams;
  const courseId = course || 'ai-tools-mastery-beginners';
  const config = getCourseConfig(courseId);

  if (!config) {
    redirect('/learn');
  }

  const sessionNum = parseInt(n, 10);

  // Validate session number
  const mod = config.modules.find((m) => m.session === sessionNum);
  if (!mod || sessionNum < 1 || sessionNum > config.totalSessions) {
    redirect('/learn');
  }

  // Session 1 is always free — no auth required
  const isFreeSession = mod.isFree;

  const user = await getUser();

  // Non-free sessions require auth
  if (!isFreeSession && !user) {
    // DEV BYPASS — remove before production
    if (process.env.NODE_ENV !== 'development') {
      redirect('/login');
    }
  }

  let isUnlocked = isFreeSession; // session 1 always unlocked

  // DEV BYPASS — unlock all sessions in development
  if (process.env.NODE_ENV === 'development') {
    isUnlocked = true;
  }

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

  const sessionFile = `/learn/${config.filePrefix}-${padSession(sessionNum)}.html`;
  const prevSession = sessionNum > 1 ? sessionNum - 1 : null;
  const nextSession = sessionNum < config.totalSessions ? sessionNum + 1 : null;
  const courseParam = courseId !== 'ai-tools-mastery-beginners' ? `?course=${courseId}` : '';

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
              href={`/learn/session/${prevSession}${courseParam}`}
              className="rounded-lg border border-[#1e1e3a] px-3 py-1.5 text-xs font-medium text-[#94a3b8] transition hover:border-[#059669] hover:text-[#059669]"
            >
              ← Prev
            </Link>
          )}
          {nextSession && (
            <Link
              href={`/learn/session/${nextSession}${courseParam}`}
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
      <SessionViewer
        sessionFile={sessionFile}
        sessionTitle={`Session ${sessionNum}: ${mod.title}`}
        watermarkName={displayName}
      />

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
