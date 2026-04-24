'use client';

import { useEffect, useMemo, useState } from 'react';

interface Props {
  // The last user message — we extract a 1-3 word intent from it
  // and splice it into the "ANALYZING GOAL" trace line so the UI
  // feels tailored to this specific query.
  lastUserMessage: string;
}

// Minimal stopword-ish filter. We don't need a real NLP stack — we
// just want to pull a short phrase out of the user's last message
// to make the "analyzing goal" trace line feel specific rather than
// generic.
const NOISE = new Set([
  'a', 'an', 'the', 'is', 'are', 'am', 'was', 'were', 'be', 'been',
  'being', 'i', 'me', 'my', 'we', 'us', 'our', 'you', 'your',
  'to', 'of', 'in', 'on', 'at', 'for', 'with', 'and', 'or', 'but',
  'so', 'if', 'then', 'how', 'what', 'which', 'who', 'why', 'can',
  'could', 'would', 'should', 'do', 'does', 'did', 'get', 'have',
  'has', 'had', 'want', 'need', 'like', 'make', 'help', 'tell',
  'kya', 'hai', 'hun', 'ho', 'ka', 'ki', 'ke', 'main', 'mera',
  'meri', 'aap', 'hum',
]);

function extractIntent(raw: string): string {
  if (!raw) return 'Discovery';
  const tokens = raw
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !NOISE.has(w));
  const keywords = tokens.slice(0, 4).join(' ');
  if (!keywords) return 'Discovery';
  return keywords.slice(0, 48).toUpperCase();
}

// Each trace step carries its own dwell time (ms). Early steps are
// snappy (parse / load) because they'd really happen fast in a real
// RAG pipeline; the matching + composing steps take longer so the
// reveal feels like actual reasoning.
interface Step {
  tag: string;
  body: string;
  dwellMs: number;
}

function buildSteps(intent: string): Step[] {
  return [
    { tag: 'PARSE_INPUT',   body: 'Listening to your question…',        dwellMs: 280 },
    { tag: 'ANALYZE_GOAL',  body: `Goal → ${intent}`,                   dwellMs: 420 },
    { tag: 'LOAD_BRAIN',    body: 'Pulling TARAhut syllabus + FAQs',    dwellMs: 360 },
    { tag: 'MATCH_INTENT',  body: 'Matching intent → syllabus map',     dwellMs: 520 },
    { tag: 'WEIGHT_SESSIONS', body: 'Weighting sessions by your goal', dwellMs: 480 },
    { tag: 'COMPOSE',       body: 'Composing response in Hinglish…',    dwellMs: 440 },
  ];
}

// Max trace lines visible at once. On small phones (iPhone SE ~320px,
// older Pixels) the stack can push the chat bubble off-screen — cap
// at 3 and let earlier lines slide out.
const MAX_VISIBLE = 3;

// Thought Trace — terminal-style live log of what TARA is doing
// while the chat response streams. Replaces the generic 3-dot
// typing indicator with something that signals "this is actual
// reasoning over a syllabus, not autocomplete." The steps cycle
// if the real response takes longer than the sequence itself.
export function ThoughtTrace({ lastUserMessage }: Props) {
  const intent = useMemo(() => extractIntent(lastUserMessage), [lastUserMessage]);
  const steps = useMemo(() => buildSteps(intent), [intent]);

  // Start at zero and reveal the first step on the next tick so it
  // fades in like every subsequent step — the old behaviour had step
  // 01 appearing instantly at mount, which read as "pop" rather than
  // "reasoning."
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= steps.length) return;
    const delay = visibleCount === 0 ? 180 : (steps[visibleCount - 1]?.dwellMs ?? 400);
    const t = window.setTimeout(() => {
      setVisibleCount((c) => Math.min(c + 1, steps.length));
    }, delay);
    return () => window.clearTimeout(t);
  }, [visibleCount, steps]);

  return (
    <div className="flex gap-3">
      {/* Avatar slot mirrors the assistant's message avatar so the
          trace sits in its lane rather than full-width. */}
      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-sm shadow-md">
        ✨
      </div>
      <div className="relative max-w-[85%] min-w-0 flex-1 overflow-hidden rounded-2xl rounded-tl-sm border border-emerald-500/30 bg-black/45 px-4 py-3 font-mono text-[11px] leading-relaxed text-emerald-300 shadow-[inset_0_0_12px_rgba(16,185,129,0.15)]">
        {/* Scanline effect — thin emerald line slides down the panel
            every ~2s. CSS-only, GPU-friendly. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent"
          style={{ animation: 'trace-scan 2s linear infinite' }}
        />
        <style>{`
          @keyframes trace-scan {
            0%   { transform: translateY(0); opacity: 0.6; }
            80%  { opacity: 0.9; }
            100% { transform: translateY(140px); opacity: 0; }
          }
          @keyframes trace-blink {
            0%, 100% { opacity: 1; }
            50%      { opacity: 0.25; }
          }
          @keyframes trace-step-in {
            from { opacity: 0; transform: translateY(4px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <ul className="flex flex-col gap-1.5 min-h-[1.5rem]">
          {/* Sliding window — show at most MAX_VISIBLE (3) lines so the
              trace never pushes the chat bubble off narrow phones. The
              most recent is at the bottom; earlier lines drop off. */}
          {steps
            .slice(Math.max(0, visibleCount - MAX_VISIBLE), visibleCount)
            .map((s, idx) => {
              const i = Math.max(0, visibleCount - MAX_VISIBLE) + idx;
              const active = i === visibleCount - 1 && visibleCount < steps.length;
              const done = !active;
              return (
              <li
                key={s.tag}
                className="flex items-start gap-2"
                style={{ animation: 'trace-step-in 0.32s cubic-bezier(0.16, 1, 0.3, 1) both' }}
              >
                <span
                  className={`mt-[3px] inline-block size-1.5 rounded-full ${
                    done
                      ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                      : 'bg-emerald-300'
                  }`}
                  style={active ? { animation: 'trace-blink 0.6s ease-in-out infinite' } : undefined}
                />
                <span className="flex-1">
                  <span className="font-bold text-emerald-400">
                    [{s.tag}]
                  </span>{' '}
                  <span className="text-emerald-200/90">{s.body}</span>
                  {active && (
                    <span
                      aria-hidden
                      className="ml-1 inline-block h-[0.9em] w-1.5 translate-y-[1px] bg-emerald-300"
                      style={{ animation: 'trace-blink 0.8s steps(2, start) infinite' }}
                    />
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
