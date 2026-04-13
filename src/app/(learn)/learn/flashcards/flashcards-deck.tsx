'use client';

import { useState, useMemo } from 'react';
import type { Flashcard } from '@/config/flashcards';

interface Props {
  availableSessions: number[];
  sessionTitles: Record<number, string>;
  flashcards: Record<number, Flashcard[]>;
}

export function FlashcardsDeck({ availableSessions, sessionTitles, flashcards }: Props) {
  const [filterSession, setFilterSession] = useState<'all' | number>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const deck = useMemo<Flashcard[]>(() => {
    if (filterSession === 'all') {
      return availableSessions.flatMap((s) => flashcards[s] ?? []);
    }
    return flashcards[filterSession] ?? [];
  }, [filterSession, availableSessions, flashcards]);

  const total = deck.length;
  const card = deck[currentIndex] ?? null;

  function handleFilterChange(value: string) {
    setFilterSession(value === 'all' ? 'all' : Number(value));
    setCurrentIndex(0);
    setFlipped(false);
  }

  function handlePrev() {
    setCurrentIndex((i) => (i > 0 ? i - 1 : total - 1));
    setFlipped(false);
  }

  function handleNext() {
    setCurrentIndex((i) => (i < total - 1 ? i + 1 : 0));
    setFlipped(false);
  }

  function handleFlip() {
    setFlipped((v) => !v);
  }

  return (
    <div>
      {/* Filter */}
      <div className="mb-6 flex items-center gap-3">
        <label htmlFor="session-filter" className="text-sm font-medium text-[#94a3b8] shrink-0">
          Filter by session:
        </label>
        <select
          id="session-filter"
          value={filterSession === 'all' ? 'all' : String(filterSession)}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="flex-1 rounded-lg border border-[#1e1e3a] bg-[#0c0c1a] px-3 py-2 text-sm text-[#e2e8f0] focus:border-[#00f0ff] focus:outline-none transition"
        >
          <option value="all">All Sessions ({availableSessions.length * 5} cards)</option>
          {availableSessions.map((s) => (
            <option key={s} value={String(s)}>
              Session {s}: {sessionTitles[s]} (5 cards)
            </option>
          ))}
        </select>
      </div>

      {/* Progress */}
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="font-medium text-[#e2e8f0]">
          Card {total > 0 ? currentIndex + 1 : 0} of {total}
        </span>
        <span className="text-xs text-[#94a3b8]">
          {flipped ? 'Showing answer' : 'Click card to reveal'}
        </span>
      </div>
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-[#1e1e3a]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#059669] to-[#00f0ff] transition-all duration-300"
          style={{ width: total > 0 ? `${((currentIndex + 1) / total) * 100}%` : '0%' }}
        />
      </div>

      {/* Card */}
      {card ? (
        <div
          className="relative mb-6 cursor-pointer"
          style={{ perspective: '1000px' }}
          onClick={handleFlip}
        >
          <div
            className="relative w-full transition-transform duration-500"
            style={{
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              minHeight: '240px',
            }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-[#1e1e3a] bg-[#0c0c1a] p-8 text-center"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#00f0ff]">
                Question
              </p>
              <p className="text-xl font-bold leading-snug text-[#e2e8f0]">{card.front}</p>
              <p className="mt-6 text-xs text-[#94a3b8]">Tap to reveal answer</p>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-[#059669]/40 bg-[#0c0c1a] p-8 text-center"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#059669]">
                Answer
              </p>
              <p className="text-base leading-relaxed text-[#e2e8f0]">{card.back}</p>
              <p className="mt-6 text-xs text-[#94a3b8]">Tap to flip back</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 flex min-h-[240px] items-center justify-center rounded-2xl border border-[#1e1e3a] bg-[#0c0c1a]">
          <p className="text-sm text-[#94a3b8]">No cards available.</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          disabled={total === 0}
          className="flex items-center gap-2 rounded-xl border border-[#1e1e3a] px-5 py-2.5 text-sm font-medium text-[#94a3b8] transition hover:border-[#94a3b8] hover:text-[#e2e8f0] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
          Previous
        </button>

        <button
          onClick={handleFlip}
          disabled={total === 0}
          className="rounded-xl bg-[#1e1e3a] px-5 py-2.5 text-sm font-medium text-[#e2e8f0] transition hover:bg-[#2a2a4a] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {flipped ? 'Show Question' : 'Reveal Answer'}
        </button>

        <button
          onClick={handleNext}
          disabled={total === 0}
          className="flex items-center gap-2 rounded-xl border border-[#1e1e3a] px-5 py-2.5 text-sm font-medium text-[#94a3b8] transition hover:border-[#94a3b8] hover:text-[#e2e8f0] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="mt-6 text-center text-xs text-[#4a5568]">
        {total} card{total !== 1 ? 's' : ''} available from {filterSession === 'all' ? `${availableSessions.length} session${availableSessions.length !== 1 ? 's' : ''}` : `Session ${filterSession}`}
      </p>
    </div>
  );
}
