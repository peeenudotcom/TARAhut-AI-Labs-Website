'use client';

import { useEffect, useRef, useState } from 'react';

// Mirrors the shape of Course.syllabus in src/config/courses.ts. Kept
// narrow so this component can be reused by other pages that source
// timeline data differently (e.g. a future schoolCourse variant).
export interface TimelinePhase {
  module: string;
  topics: string[];
}

interface Props {
  phases: TimelinePhase[];
  // Optional injection slot — when this predicate returns a node for a
  // given session (passed the topic title and the global session
  // number), that node renders immediately AFTER the matching session
  // card. Used by the AI Tools Mastery page to drop the Live AI
  // Playground next to the prompt-engineering session.
  renderAfterSession?: (session: { sessionNumber: number; title: string }) => React.ReactNode;
}

// Pull a sprint label + title out of a module string like
// "Week 1: AI Foundations & Prompt Engineering" → { label: "Week 01",
// title: "AI Foundations & Prompt Engineering" }. Falls back to a
// generic "Sprint NN" if the module doesn't carry a prefix we
// recognise.
function parseSprint(
  module: string,
  index: number
): { label: string; title: string } {
  // Accept singular + plural forms ("Week", "Weeks") and a broader set
  // of timebox words ("Month" for the 90-day programs, "Sprint" for
  // agile-style modules). The regex intentionally requires a
  // numeral — modules without numbers fall through to the generic
  // "Sprint NN" fallback.
  const match = module.match(/^(Weeks?|Modules?|Phases?|Days?|Sprints?|Months?)\s+\d+\s*[:—-]\s*(.*)$/i);
  const padded = String(index + 1).padStart(2, '0');
  if (match) {
    // Normalize plural → singular so labels always read "Week 01",
    // never "Weeks 01" when the raw text was "Weeks 1–3:".
    const singular = match[1].replace(/s$/i, '');
    const kind = singular.charAt(0).toUpperCase() + singular.slice(1).toLowerCase();
    return { label: `${kind} ${padded}`, title: match[2].trim() };
  }
  return { label: `Sprint ${padded}`, title: module };
}

// Pulse Path syllabus — a vertical emerald path running down the
// middle (desktop) or left edge (mobile) that lights up as the user
// scrolls. Each course phase renders as a "Sprint" header anchored on
// the path; each topic under that phase becomes a "Session" card
// revealing (opacity + slight translate) when it enters the viewport.
// The path's glow height is driven off scroll position so the user
// feels the progress bar racing ahead of them as they go.
export function VisualTimeline({ phases, renderAfterSession }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const [progressPct, setProgressPct] = useState(0);

  useEffect(() => {
    const cardEls = Array.from(
      containerRef.current?.querySelectorAll<HTMLElement>('[data-session-id]') ?? []
    );
    if (cardEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleIds((prev) => {
          const next = new Set(prev);
          for (const entry of entries) {
            const id = entry.target.getAttribute('data-session-id');
            if (!id) continue;
            if (entry.isIntersecting) next.add(id);
          }
          return next;
        });
      },
      { threshold: 0.18 }
    );
    cardEls.forEach((el) => observer.observe(el));

    function handleScroll() {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight;
      // Start progress when the container top hits viewport-mid; fill
      // as the bottom of the container clears the viewport-mid.
      const total = el.offsetHeight + viewport * 0.3;
      const scrolled = viewport - rect.top;
      const pct = Math.max(0, Math.min(100, (scrolled / total) * 100));
      setProgressPct(pct);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [phases.length]);

  if (phases.length === 0) return null;

  // Running counter so sessions number continuously across sprints
  // (Session 01 → 16 for a 4-week × 4-session course).
  let globalSessionIdx = 0;

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-5xl py-4 sm:py-8">
      {/* Track — dim baseline line, anchored to the left rail on all
          breakpoints so the session cards get the full width to the
          right to breathe. */}
      <div
        aria-hidden
        className="absolute top-0 bottom-0 left-6 w-[2px] bg-white/[0.06]"
      />
      {/* Progress — emerald glow that grows as user scrolls */}
      <div
        aria-hidden
        className="absolute top-0 left-6 w-[2px] bg-gradient-to-b from-emerald-300 via-emerald-500 to-emerald-500/30 shadow-[0_0_18px_rgba(16,185,129,0.7)] transition-[height] duration-300 ease-out"
        style={{ height: `${progressPct}%` }}
      />

      <div className="relative flex flex-col gap-16 sm:gap-24">
        {phases.map((phase, phaseIdx) => {
          const { label, title } = parseSprint(phase.module, phaseIdx);
          return (
            <section key={`${phase.module}-${phaseIdx}`} className="relative">
              {/* Sprint header — dot anchored to the left path, label
                  and title flowing to the right. */}
              <div className="relative mb-6 pl-16 sm:mb-10">
                <span
                  aria-hidden
                  className="absolute top-1/2 left-6 z-10 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-400 bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.8)]"
                />
                <div
                  data-session-id={`sprint-${phaseIdx}`}
                  className={`inline-block transition-all duration-700 ease-out ${
                    visibleIds.has(`sprint-${phaseIdx}`)
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-3 opacity-40'
                  }`}
                >
                  <span className="inline-flex items-center rounded-full bg-emerald-500 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                    {label}
                  </span>
                  <h3 className="mt-3 font-['Space_Grotesk',sans-serif] text-xl font-bold leading-tight text-white md:text-2xl">
                    {title}
                  </h3>
                </div>
              </div>

              {/* Session grid — full-width to the right of the path.
                  Single column on mobile, 2-col from sm+ so cards get
                  breathing room. */}
              {(() => {
                // Collect the sessions for this phase up front so we can
                // (a) render the grid, and (b) check whether any session
                // in this phase has an inject node to drop in below the
                // grid (full-width).
                const phaseSessions = phase.topics.map((topic, topicIdx) => {
                  globalSessionIdx += 1;
                  return {
                    topic,
                    topicIdx,
                    sessionNumber: globalSessionIdx,
                    inject:
                      renderAfterSession?.({
                        sessionNumber: globalSessionIdx,
                        title: topic,
                      }) ?? null,
                  };
                });
                const firstInject = phaseSessions.find((s) => s.inject)?.inject;

                return (
                  <>
                    <div className="grid gap-4 pl-16 sm:grid-cols-2 sm:gap-6">
                      {phaseSessions.map(({ topic, topicIdx, sessionNumber }) => {
                        const sessionNum = String(sessionNumber).padStart(2, '0');
                        const id = `s-${phaseIdx}-${topicIdx}`;
                        const active = visibleIds.has(id);
                        return (
                          <article
                            key={id}
                            data-session-id={id}
                            className={`relative overflow-hidden rounded-2xl border bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-700 ease-out md:p-6 ${
                              active
                                ? 'translate-y-0 border-emerald-500/30 opacity-100 shadow-[0_0_24px_rgba(16,185,129,0.12)]'
                                : 'translate-y-5 border-white/[0.08] opacity-35'
                            }`}
                          >
                            <span
                              aria-hidden
                              className={`absolute top-0 left-0 h-full w-[3px] transition-opacity duration-500 ${
                                active ? 'bg-emerald-400 opacity-100' : 'opacity-0'
                              }`}
                            />
                            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-400">
                              Session {sessionNum}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-gray-200 md:text-[0.95rem]">
                              {topic}
                            </p>
                          </article>
                        );
                      })}
                    </div>
                    {firstInject && (
                      <div className="mt-2 pl-16">{firstInject}</div>
                    )}
                  </>
                );
              })()}
            </section>
          );
        })}

        {/* Finish checkpoint — dot on the left rail, copy to the right.
            The title is deliberately oversized with an emerald glow so
            the path has a definitive landing beat. */}
        <div className="relative pl-16">
          <span
            aria-hidden
            className="absolute top-1/2 left-6 z-10 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-300 bg-emerald-400 shadow-[0_0_32px_rgba(16,185,129,0.95)]"
          />
          <div
            data-session-id="finish"
            className={`inline-block transition-all duration-700 ease-out ${
              visibleIds.has('finish') ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-40'
            }`}
          >
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-300">
              &gt; Journey Complete
            </p>
            <p
              className="mt-2 font-['Space_Grotesk',sans-serif] text-3xl font-bold leading-tight text-white md:text-4xl"
              style={{
                textShadow:
                  '0 0 24px rgba(16,185,129,0.75), 0 0 48px rgba(16,185,129,0.35)',
              }}
            >
              You&apos;re AI-fluent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
