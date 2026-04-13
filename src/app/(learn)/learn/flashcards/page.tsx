import { requireAuth } from '@/lib/auth';
import { createServerSupabase } from '@/lib/supabase-server';
import { sessionFlashcards } from '@/config/flashcards';
import { learnModules } from '@/config/learn-modules';
import Link from 'next/link';
import { FlashcardsDeck } from './flashcards-deck';

export const metadata = {
  title: 'Flashcards — TARAhut Learning Engine',
};

interface UnlockRow { session_number: number }

export default async function FlashcardsPage() {
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

  // Build flashcards only for unlocked sessions that have flashcard data
  const availableSessionNumbers = Array.from(unlockedSessions)
    .filter((s) => sessionFlashcards[s] !== undefined)
    .sort((a, b) => a - b);

  // Map session number → title for the filter dropdown
  const sessionTitles: Record<number, string> = {};
  for (const mod of learnModules) {
    sessionTitles[mod.session] = mod.title;
  }

  return (
    <div className="min-h-screen bg-[#06060e] text-[#e2e8f0]">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-[#1e1e3a] bg-[#06060e]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/learn/dashboard" className="text-sm font-semibold text-[#059669] hover:underline">
            ← Dashboard
          </Link>
          <span className="text-sm text-[#94a3b8]">Spaced Repetition Flashcards</span>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#059669]">
            Learning Tool
          </p>
          <h1 className="mb-3 text-3xl font-extrabold text-[#e2e8f0]">Flashcards</h1>
          <p className="text-sm text-[#94a3b8]">
            Review key concepts from your unlocked sessions. Click a card to reveal the answer.
          </p>
        </div>

        {availableSessionNumbers.length === 0 ? (
          <div className="rounded-2xl border border-[#1e1e3a] bg-[#0c0c1a] p-10 text-center">
            <p className="text-4xl mb-4">📚</p>
            <p className="text-[#e2e8f0] font-semibold mb-2">No flashcards yet</p>
            <p className="text-sm text-[#94a3b8] mb-6">
              Complete sessions to unlock flashcards for review.
            </p>
            <Link
              href="/learn/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-[#059669] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#047857]"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <FlashcardsDeck
            availableSessions={availableSessionNumbers}
            sessionTitles={sessionTitles}
            flashcards={sessionFlashcards}
          />
        )}
      </div>
    </div>
  );
}
