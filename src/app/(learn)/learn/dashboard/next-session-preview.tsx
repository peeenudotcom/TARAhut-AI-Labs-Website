'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Question {
  q: string;
  options: string[];
  answer: number;
}

interface Props {
  sessionNumber: number;
  sessionTitle: string;
  questions: Question[];
}

export function NextSessionPreview({ sessionNumber, sessionTitle, questions }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<(number | null)[]>(questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = selected.every((s) => s !== null);
  const correctCount = selected.filter((s, i) => s === questions[i].answer).length;

  function handleSelect(qIdx: number, optIdx: number) {
    if (submitted) return;
    setSelected((prev) => {
      const next = [...prev];
      next[qIdx] = optIdx;
      return next;
    });
  }

  function handleSubmit() {
    if (!allAnswered) return;
    setSubmitted(true);
  }

  function handleReset() {
    setSelected(questions.map(() => null));
    setSubmitted(false);
  }

  return (
    <div className="rounded-2xl border border-[#1e1e3a] bg-[#0c0c1a] overflow-hidden">
      {/* Header / toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#1e1e3a]/40 transition"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xl shrink-0" aria-hidden>🧠</span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#e2e8f0] truncate">
              Preview your next session
            </p>
            <p className="text-xs text-[#94a3b8] truncate">
              Session {sessionNumber}: {sessionTitle} — 3 quick questions
            </p>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-5 w-5 shrink-0 text-[#94a3b8] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Expandable content */}
      {open && (
        <div className="border-t border-[#1e1e3a] px-6 py-5">
          {submitted ? (
            /* Results state */
            <div className="space-y-4">
              {/* Score banner */}
              <div
                className={`rounded-xl px-5 py-4 text-center ${
                  correctCount === questions.length
                    ? 'bg-[#059669]/20 border border-[#059669]/30'
                    : correctCount === 0
                    ? 'bg-[#ef4444]/10 border border-[#ef4444]/30'
                    : 'bg-[#00f0ff]/10 border border-[#00f0ff]/20'
                }`}
              >
                <p className="text-2xl font-extrabold text-[#e2e8f0]">
                  {correctCount} / {questions.length}
                </p>
                <p className="mt-1 text-sm text-[#94a3b8]">
                  {correctCount === questions.length
                    ? 'Perfect! You are ready for this session.'
                    : correctCount === 0
                    ? 'This session will teach you a lot — dive in!'
                    : 'Good start! The session will fill the gaps.'}
                </p>
              </div>

              {/* Question breakdown */}
              <div className="space-y-3">
                {questions.map((q, qi) => {
                  const userAnswer = selected[qi];
                  const isCorrect = userAnswer === q.answer;
                  return (
                    <div key={qi} className="rounded-xl border border-[#1e1e3a] bg-[#06060e] p-4">
                      <p className="mb-2 text-xs font-semibold text-[#e2e8f0]">
                        Q{qi + 1}. {q.q}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm" aria-hidden>{isCorrect ? '✅' : '❌'}</span>
                        <span className="text-xs text-[#94a3b8]">
                          {isCorrect
                            ? `Correct: ${q.options[q.answer]}`
                            : `You chose "${q.options[userAnswer!]}" — Answer: "${q.options[q.answer]}"`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href={`/learn/session/${sessionNumber}`}
                  className="rounded-xl bg-gradient-to-r from-[#059669] to-[#00f0ff] px-5 py-2.5 text-sm font-bold text-[#06060e] transition hover:opacity-90"
                >
                  Now let&apos;s learn! →
                </Link>
                <button
                  onClick={handleReset}
                  className="rounded-xl border border-[#1e1e3a] px-5 py-2.5 text-sm font-medium text-[#94a3b8] transition hover:border-[#94a3b8] hover:text-[#e2e8f0]"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : (
            /* Quiz state */
            <div className="space-y-5">
              <p className="text-xs text-[#94a3b8]">
                Answer these 3 questions before diving in. No scores saved — just curiosity!
              </p>

              {questions.map((q, qi) => (
                <div key={qi}>
                  <p className="mb-2 text-sm font-semibold text-[#e2e8f0]">
                    {qi + 1}. {q.q}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => (
                      <button
                        key={oi}
                        onClick={() => handleSelect(qi, oi)}
                        className={`w-full rounded-lg border px-4 py-2.5 text-left text-sm transition ${
                          selected[qi] === oi
                            ? 'border-[#00f0ff] bg-[#00f0ff]/10 text-[#e2e8f0] font-medium'
                            : 'border-[#1e1e3a] text-[#94a3b8] hover:border-[#94a3b8] hover:text-[#e2e8f0]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="rounded-xl bg-[#059669] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#059669]/80 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Check my answers →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
