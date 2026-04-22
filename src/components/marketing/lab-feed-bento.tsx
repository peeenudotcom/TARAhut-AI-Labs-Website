'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { labFeed, type LabFeedTile } from '@/config/lab-feed';

interface Props {
  // Optional course slug to filter the feed to a single course — used
  // when the bento gets embedded on a /courses/[slug] page below the
  // Pulse Path so students see proof tied to THAT specific course.
  // When omitted, renders the full global feed on /lab-feed.
  filterCourseSlug?: string;
  // Hard cap on tiles rendered — useful for the per-course strip (e.g.
  // show first 4). Full feed passes `undefined`.
  limit?: number;
}

// Maps our semantic span names to Tailwind col/row-span classes.
// Desktop is the 4-col bento grid; tablet collapses to 2; mobile to 1
// (all tiles become default-sized). Matches the mockup breakpoints.
const SPAN_CLASS: Record<LabFeedTile['span'], string> = {
  large: 'md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2',
  wide: 'md:col-span-2 lg:col-span-2',
  tall: 'lg:row-span-2',
  default: '',
};

// Public bento grid for the Lab Feed. Tiles auto-sort newest-first so
// the RECENT BUILD pulse always lands on the most recent entry
// without manual ordering in the config.
export function LabFeedBento({ filterCourseSlug, limit }: Props) {
  const tiles = useMemo(() => {
    const filtered = filterCourseSlug
      ? labFeed.filter((t) => t.courseSlug === filterCourseSlug)
      : labFeed;
    const sorted = [...filtered].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return typeof limit === 'number' ? sorted.slice(0, limit) : sorted;
  }, [filterCourseSlug, limit]);

  if (tiles.length === 0) return null;
  const newestId = tiles[0].id;

  return (
    <div className="mx-auto grid max-w-6xl auto-rows-[220px] grid-cols-1 gap-5 md:grid-cols-2 md:auto-rows-[240px] lg:grid-cols-4">
      {tiles.map((tile) => (
        <BentoTile key={tile.id} tile={tile} isNewest={tile.id === newestId} />
      ))}
    </div>
  );
}

function BentoTile({ tile, isNewest }: { tile: LabFeedTile; isNewest: boolean }) {
  const href = tile.courseSlug ? `/courses/${tile.courseSlug}#syllabus` : undefined;

  const inner = (
    <>
      {/* Media layer — image or faded code background */}
      {tile.kind === 'image' && tile.src ? (
        // Plain <img> by design: mirrors the mockup, avoids Next/Image
        // remotePatterns config burden for the Unsplash placeholder
        // URLs. Swap to Next/Image once real student work lands in
        // /public/images/lab-feed/.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={tile.src}
          alt={tile.alt ?? ''}
          className="absolute inset-0 h-full w-full object-cover opacity-70 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
          loading="lazy"
        />
      ) : null}

      {tile.kind === 'code' && tile.codeSnippet ? (
        <div
          aria-hidden
          className="absolute inset-0 flex items-center bg-[#0a0f0d] p-6 font-mono text-[0.7rem] leading-relaxed text-emerald-500 transition-opacity duration-500 group-hover:opacity-60"
          style={{ opacity: 0.4 }}
        >
          <span className="break-all">{tile.codeSnippet}</span>
        </div>
      ) : null}

      {/* HUD overlay — bottom-anchored gradient carrying the tags +
          title + student meta. For code tiles we keep the gradient
          lighter so the snippet stays readable behind it. */}
      <div
        className={`pointer-events-none absolute inset-0 flex flex-col justify-end p-5 md:p-6 ${
          tile.kind === 'image'
            ? 'bg-gradient-to-t from-black/90 via-black/50 to-transparent'
            : 'bg-gradient-to-t from-black/85 via-black/35 to-transparent'
        }`}
      >
        {tile.quote ? (
          <p className="mb-3 text-sm italic leading-relaxed text-white/85">
            &ldquo;{tile.quote}&rdquo;
          </p>
        ) : null}

        <div className="mb-2 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-white px-2 py-0.5 font-mono text-[10px] font-extrabold uppercase tracking-[0.12em] text-black">
            Session {String(tile.session).padStart(2, '0')}
          </span>
          {tile.techTag ? (
            <span className="rounded-md border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-300">
              {tile.techTag}
            </span>
          ) : null}
        </div>

        <h3 className="font-['Space_Grotesk',sans-serif] text-base font-bold leading-tight text-white md:text-lg">
          {tile.title}
        </h3>
        <p className="mt-0.5 text-xs text-white/55">{tile.studentMeta}</p>
      </div>

      {/* RECENT BUILD pulse — top-right, red accent dot. Only renders
          on the newest tile in the feed. Red deliberately breaks the
          emerald palette so it pops as "live" signal, not decoration. */}
      {isNewest ? (
        <div className="pointer-events-none absolute top-4 right-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 backdrop-blur-sm">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-red-500" />
          </span>
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white">
            Recent build
          </span>
        </div>
      ) : null}
    </>
  );

  const className =
    'group relative col-span-1 row-span-1 overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md transition-all duration-500 ease-out hover:-translate-y-1 hover:border-emerald-500/60 hover:shadow-[0_10px_40px_rgba(16,185,129,0.25)] ' +
    SPAN_CLASS[tile.span];

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }
  return <div className={className}>{inner}</div>;
}
