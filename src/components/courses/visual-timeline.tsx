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
}

// Central-line scrollytelling timeline. Each phase fades from 0.25 to 1
// opacity and nudges into place as it enters the viewport. A vertical
// emerald-gradient "progress" bar tracks scroll depth through the
// container. On narrow screens the line snaps to the left edge and
// every card goes full-width — keeps the rhythm without the desktop
// alternating layout.
export function VisualTimeline({ phases }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());
  const [progressPct, setProgressPct] = useState(0);

  useEffect(() => {
    const stepEls = Array.from(
      containerRef.current?.querySelectorAll<HTMLElement>('[data-timeline-step]') ?? []
    );
    if (stepEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleIndices((prev) => {
          const next = new Set(prev);
          for (const entry of entries) {
            const idx = Number(entry.target.getAttribute('data-timeline-step'));
            if (Number.isNaN(idx)) continue;
            if (entry.isIntersecting) next.add(idx);
          }
          return next;
        });
      },
      { threshold: 0.3 }
    );
    stepEls.forEach((el) => observer.observe(el));

    function handleScroll() {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight;
      // Simple linear mapping: container top at viewport mid → 0%,
      // container bottom at viewport mid → 100%. Clamped.
      const total = el.offsetHeight + viewport;
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

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-5xl py-6 sm:py-8">
      {/* Track (light background) */}
      <div
        aria-hidden
        className="absolute top-0 bottom-0 left-5 w-[2px] bg-white/[0.08] sm:left-1/2 sm:-translate-x-1/2"
      />
      {/* Progress (emerald gradient), height driven by scroll */}
      <div
        aria-hidden
        className="absolute top-0 left-5 w-[2px] bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-300/20 shadow-[0_0_14px_rgba(5,150,105,0.45)] sm:left-1/2 sm:-translate-x-1/2"
        style={{ height: `${progressPct}%` }}
      />

      <ol className="relative flex list-none flex-col gap-16 p-0 sm:gap-24">
        {phases.map((phase, i) => {
          const active = visibleIndices.has(i);
          const onLeft = i % 2 === 0;
          return (
            <li
              key={`${phase.module}-${i}`}
              data-timeline-step={i}
              className="relative pl-14 sm:flex sm:items-start sm:justify-between sm:pl-0"
            >
              {/* Node dot on the line */}
              <span
                aria-hidden
                className={`absolute top-6 left-5 z-10 size-4 -translate-x-1/2 rounded-full border-2 transition-all duration-500 sm:left-1/2 ${
                  active
                    ? 'border-emerald-400 bg-emerald-400 shadow-[0_0_14px_rgba(5,150,105,0.7)]'
                    : 'border-emerald-400/40 bg-[#020617]'
                }`}
              />
              <TimelineCard
                phase={phase}
                index={i}
                active={active}
                align={onLeft ? 'left' : 'right'}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function TimelineCard({
  phase,
  index,
  active,
  align,
}: {
  phase: TimelinePhase;
  index: number;
  active: boolean;
  align: 'left' | 'right';
}) {
  // Desktop: alternate left/right at 45% width. Mobile: full width, always
  // to the right of the rail.
  const sideClass =
    align === 'left'
      ? 'sm:mr-auto sm:w-[45%] sm:pr-10 sm:text-right'
      : 'sm:ml-auto sm:w-[45%] sm:pl-10';
  return (
    <div
      className={`el-glass-card transition-all duration-700 ease-out ${sideClass} ${
        active ? 'opacity-100 translate-y-0' : 'translate-y-6 opacity-40'
      } p-6 md:p-7`}
    >
      <div
        className={`mb-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 ${
          align === 'left' ? 'sm:text-right' : ''
        }`}
      >
        {String(index + 1).padStart(2, '0')} · Phase
      </div>
      <h3 className="font-['Space_Grotesk',sans-serif] text-lg font-bold text-white md:text-xl">
        {phase.module}
      </h3>
      <ul
        className={`mt-3 space-y-1.5 text-sm leading-relaxed text-gray-400 ${
          align === 'left' ? 'sm:text-right' : ''
        }`}
      >
        {phase.topics.map((topic, j) => (
          <li key={j}>{topic}</li>
        ))}
      </ul>
    </div>
  );
}
