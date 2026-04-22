import type { Metadata } from 'next';
import { LabFeedBento } from '@/components/marketing/lab-feed-bento';
import { labFeed } from '@/config/lab-feed';

export const metadata: Metadata = {
  title: 'The Live Lab Feed · TARAhut AI Labs',
  description:
    'Real-world AI applications built by TARAhut students across Punjab during their 16-session transformation. Updated weekly.',
};

// Public gallery of student outputs. Same dark + emerald-grid
// treatment as the hero so /lab-feed reads as part of the same
// universe, not a separate page.
export default function LabFeedPage() {
  const totalProjects = labFeed.length;
  const locations = new Set(
    labFeed.map((t) => (t.studentMeta.toLowerCase().includes('kotkapura') ? 'kotkapura' : 'online'))
  );

  return (
    <main
      className="relative min-h-screen overflow-hidden pb-24 pt-20 text-white md:pt-28"
      style={{ backgroundColor: '#020617' }}
    >
      {/* Emerald radial glow — mirrors the hero so the page feels like
          the same "lab" opening a new room, not a separate site. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute top-[-10%] left-[10%] h-[700px] w-[700px] rounded-full blur-[140px]"
          style={{ background: 'rgba(16,185,129,0.14)' }}
        />
        <div
          className="absolute bottom-[-10%] right-[5%] h-[500px] w-[500px] rounded-full blur-[120px]"
          style={{ background: 'rgba(13,148,136,0.10)' }}
        />
      </div>

      {/* Lab grid overlay — same 40px cell size as the hero grid so
          the continuity reads even as the user scrolls this page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <header className="mb-12 text-center md:mb-16">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-400">
            &gt; The Proof Surface
          </p>
          <h1 className="mt-3 font-['Space_Grotesk',sans-serif] text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            The <span className="text-emerald-400">Live Lab</span> Feed
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-gray-400 md:text-base">
            Real-world AI applications built by TARAhut students across Punjab during their 16-session transformation. Every tile is a real project, tagged with the session where the tool was first introduced.
          </p>

          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-300/90">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block size-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
              {totalProjects} projects · updated weekly
            </span>
            <span className="text-white/20">·</span>
            <span>
              {locations.has('kotkapura') ? 'Kotkapura Lab + ' : ''}Online
            </span>
          </div>
        </header>

        <LabFeedBento />

        {/* Footer CTA — nudges the user from "look at the proof" to
            "book a seat" or "jump into the galaxy" after they've
            browsed. */}
        <div className="mt-16 text-center md:mt-20">
          <p className="mx-auto max-w-xl font-['Space_Grotesk',sans-serif] text-xl font-bold leading-snug text-white md:text-2xl">
            Your project could be on this grid in 8 weeks.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/#galaxy"
              className="rounded-lg bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(16,185,129,0.5)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_36px_rgba(16,185,129,0.8)]"
            >
              Pick your course →
            </a>
            <a
              href="/learn"
              className="rounded-lg border border-white/15 bg-transparent px-6 py-3 text-sm font-semibold text-gray-200 transition-colors hover:border-white/30 hover:bg-white/5 hover:text-white"
            >
              Try Session 1 free
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
