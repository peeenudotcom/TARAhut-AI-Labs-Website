import type { Metadata } from 'next';
import Link from 'next/link';
import { LabFeedBento } from '@/components/marketing/lab-feed-bento';
import { labFeed } from '@/config/lab-feed';

export const metadata: Metadata = {
  title: 'The Live Lab | TARAhut Student Showcase',
  description:
    'Real-world AI projects built by TARAhut students across every program — hover any tile to see the actual prompt or workflow that shipped it.',
};

// Announcements for the live ticker — short phrases separated by `•`.
// Authored here for now; swap for a real data source once the Lab
// has live signals (new enrolments, project shipments, batch starts).
const TICKER_LINES = [
  'Session 05 progress · 12 students generated 4K brand logos this week',
  'New batch starting Monday in the Kotkapura Lab',
  'Student Arjun just deployed a Custom GPT for a local law firm',
  '500+ graduates across Punjab & online',
  'Ship a real project in weeks — not months',
];

export default function LabFeedPage() {
  const totalProjects = labFeed.length;

  return (
    <main
      className="relative overflow-x-hidden pb-24 text-white"
      style={{
        backgroundColor: '#030406',
        backgroundImage:
          'radial-gradient(circle at 50% -20%, rgba(16,185,129,0.15) 0%, transparent 70%)',
      }}
    >
      {/* Live ticker — emerald-tinted marquee that slides across the
          top of the page below the global nav. Doubled so the CSS
          animation loops seamlessly. Pauses on hover. */}
      <div
        aria-label="Live announcements"
        className="group relative border-b border-white/[0.08] bg-emerald-500/[0.08] py-2.5 backdrop-blur-sm"
      >
        <div className="relative flex overflow-hidden whitespace-nowrap">
          <div
            className="inline-flex shrink-0 items-center gap-8 pr-8 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-300 [animation:lab-ticker_42s_linear_infinite] group-hover:[animation-play-state:paused]"
            style={{ willChange: 'transform' }}
          >
            {[...TICKER_LINES, ...TICKER_LINES].map((line, i) => (
              <span key={i} className="flex items-center gap-8">
                <span
                  aria-hidden
                  className="inline-block size-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]"
                />
                {line}
              </span>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes lab-ticker {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* Hero — centered, sets the promise for the page */}
      <section className="px-5 pb-12 pt-20 text-center sm:pt-24">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-400">
          &gt; The Proof Surface
        </p>
        <h1 className="mx-auto mt-4 max-w-4xl font-['Space_Grotesk',sans-serif] text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
          The <span className="text-emerald-400">Live Lab</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-400 md:text-lg">
          This is where theory turns into reality. Explore the actual projects
          built by TARAhut students across every program — hover any tile to
          see the prompt or workflow behind it.
        </p>
        <p className="mx-auto mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-300/90">
          <span className="inline-block size-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
          {totalProjects} projects · updated weekly
        </p>
      </section>

      {/* Grid + filters */}
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-[1300px]">
          <LabFeedBento />
        </div>
      </section>

      {/* Final CTA — the closer. After the visitor has browsed real
          output, convert the curiosity. Linked to the flagship course
          page; secondary "Try Session 1 free" for hesitant buyers. */}
      <section
        className="px-5 py-20 sm:py-24"
        style={{
          backgroundImage:
            'linear-gradient(to top, rgba(16,185,129,0.12) 0%, transparent 100%)',
        }}
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-400">
            &gt; Your Turn
          </p>
          <h2 className="mt-3 font-['Space_Grotesk',sans-serif] text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            Ready to build your first project?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-gray-400">
            Join the next batch in the Kotkapura Lab or online and move from
            spectator to creator — in weeks, not months.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/courses/master-ai-builder"
              className="rounded-full bg-emerald-500 px-9 py-4 text-sm font-extrabold text-white shadow-[0_0_24px_rgba(16,185,129,0.5)] transition-all hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-[0_0_44px_rgba(16,185,129,0.85)] md:text-base"
            >
              Enroll in the Master AI Journey
            </Link>
            <Link
              href="/learn"
              className="rounded-full border border-white/15 bg-transparent px-7 py-4 text-sm font-semibold text-gray-200 transition-colors hover:border-white/30 hover:bg-white/5 hover:text-white md:text-base"
            >
              Try Session 1 free
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
