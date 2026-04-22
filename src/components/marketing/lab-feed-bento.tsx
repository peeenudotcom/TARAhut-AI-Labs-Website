'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { labFeed, type LabFeedCategory, type LabFeedTile } from '@/config/lab-feed';

interface Props {
  // Optional per-course filter so the bento can be embedded on a
  // /courses/[slug] page and show only that course's projects.
  // When omitted, renders the full global feed with category pills.
  filterCourseSlug?: string;
  // Hard cap on tiles rendered — useful for the per-course strip.
  limit?: number;
  // When true, render the category filter pills above the grid.
  // Defaults to true on the standalone /lab-feed page; callers that
  // embed the grid contextually (e.g. ProofBridge) can turn it off.
  showFilters?: boolean;
}

interface FilterPill {
  key: LabFeedCategory | 'all';
  label: string;
}

const FILTERS: FilterPill[] = [
  { key: 'all', label: 'All Projects' },
  { key: 'ai-art', label: 'AI Art' },
  { key: 'video', label: 'Video' },
  { key: 'automation', label: 'Automations' },
  { key: 'other', label: 'Research' },
];

// Tailwind v4 arbitrary span classes — generated per semantic span
// name. Auto-fill grid means `large` = 2 rows tall, `wide` = 2 cols
// wide (only at lg+ where there's room). `default` is 1×1.
const SPAN_CLASS: Record<LabFeedTile['span'], string> = {
  large: 'row-span-2',
  wide: 'lg:col-span-2',
  default: '',
};

export function LabFeedBento({
  filterCourseSlug,
  limit,
  showFilters = true,
}: Props) {
  const [activeFilter, setActiveFilter] = useState<LabFeedCategory | 'all'>('all');

  const baseTiles = useMemo(() => {
    const filtered = filterCourseSlug
      ? labFeed.filter((t) => t.courseSlug === filterCourseSlug)
      : labFeed;
    const sorted = [...filtered].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return typeof limit === 'number' ? sorted.slice(0, limit) : sorted;
  }, [filterCourseSlug, limit]);

  const tiles = useMemo(
    () =>
      activeFilter === 'all'
        ? baseTiles
        : baseTiles.filter((t) => t.category === activeFilter),
    [baseTiles, activeFilter]
  );

  // RECENT BUILD pulse always lands on the newest tile in the
  // *unfiltered* base — flipping filters shouldn't move the pulse.
  const newestId = baseTiles[0]?.id;

  // Per-category counts shown in the pills so visitors know at a
  // glance what's behind each filter.
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: baseTiles.length };
    baseTiles.forEach((t) => {
      c[t.category] = (c[t.category] ?? 0) + 1;
    });
    return c;
  }, [baseTiles]);

  if (baseTiles.length === 0) return null;

  return (
    <div className="w-full">
      {showFilters && (
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {FILTERS.filter((f) => (counts[f.key] ?? 0) > 0 || f.key === 'all').map(
            (filter) => {
              const active = activeFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveFilter(filter.key)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all sm:px-5 ${
                    active
                      ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.35)]'
                      : 'border-white/10 bg-white/[0.03] text-white/80 hover:border-emerald-400/40 hover:bg-emerald-500/[0.08] hover:text-emerald-200'
                  }`}
                >
                  {filter.label}
                  <span
                    className={`font-mono text-[10px] tracking-widest ${
                      active ? 'text-emerald-300' : 'text-white/40'
                    }`}
                  >
                    {counts[filter.key] ?? 0}
                  </span>
                </button>
              );
            }
          )}
        </div>
      )}

      {tiles.length === 0 ? (
        <p className="py-12 text-center font-mono text-sm uppercase tracking-widest text-white/40">
          &gt; No projects in this category yet — check back weekly
        </p>
      ) : (
        <div
          className="mx-auto grid w-full auto-rows-[280px] gap-6 sm:auto-rows-[300px]"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}
        >
          {tiles.map((tile) => (
            <BentoTile key={tile.id} tile={tile} isNewest={tile.id === newestId} />
          ))}
        </div>
      )}
    </div>
  );
}

function BentoTile({ tile, isNewest }: { tile: LabFeedTile; isNewest: boolean }) {
  const href = tile.courseSlug ? `/courses/${tile.courseSlug}#syllabus` : undefined;
  const hasReveal = Boolean(tile.reveal);

  const inner = (
    <>
      {/* Session badge — emerald pill, top-left. Sits above every
          other layer so it reads even when the prompt-reveal slides
          up on hover. */}
      <span className="absolute top-5 left-5 z-20 rounded-md bg-emerald-500 px-2.5 py-1 font-mono text-[10px] font-extrabold uppercase tracking-[0.14em] text-black shadow-[0_0_14px_rgba(16,185,129,0.5)]">
        Session {String(tile.session).padStart(2, '0')}
      </span>

      {/* RECENT BUILD chip — red pulse on the newest tile only */}
      {isNewest && (
        <div className="pointer-events-none absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 backdrop-blur-sm">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-red-500" />
          </span>
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white">
            Recent
          </span>
        </div>
      )}

      {/* Media layer — image or faded code background */}
      {tile.kind === 'image' && tile.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={tile.src}
          alt={tile.alt ?? ''}
          className="absolute inset-0 h-full w-full object-cover opacity-70 transition-all duration-500 group-hover:scale-[1.04] group-hover:saturate-[1.1] group-hover:opacity-100"
          loading="lazy"
        />
      ) : null}

      {tile.kind === 'code' && tile.codeSnippet ? (
        <div
          aria-hidden
          className="absolute inset-0 flex items-center bg-[#0a0f0d] p-6 font-mono text-xs leading-relaxed text-emerald-500/70 transition-opacity duration-500"
        >
          <span className="break-all">{tile.codeSnippet}</span>
        </div>
      ) : null}

      {/* HUD overlay — bottom-anchored gradient carrying the title,
          student meta, and quote (if present). Hidden on hover when
          a reveal panel exists so the reveal can take focus. */}
      <div
        className={`pointer-events-none absolute inset-0 flex flex-col justify-end p-6 transition-opacity duration-300 ${
          tile.kind === 'image'
            ? 'bg-gradient-to-t from-black/90 via-black/45 to-transparent'
            : 'bg-gradient-to-t from-black/85 via-black/30 to-transparent'
        } ${hasReveal ? 'group-hover:opacity-0' : ''}`}
      >
        {tile.quote && !hasReveal ? (
          <p className="mb-3 text-sm italic leading-relaxed text-white/85">
            &ldquo;{tile.quote}&rdquo;
          </p>
        ) : null}

        {tile.techTag && (
          <span className="mb-2 inline-flex w-fit items-center rounded-md border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-300">
            {tile.techTag}
          </span>
        )}

        <h3 className="font-['Space_Grotesk',sans-serif] text-xl font-bold leading-tight text-white">
          {tile.title}
        </h3>
        <p className="mt-0.5 text-xs text-white/60">{tile.studentMeta}</p>
      </div>

      {/* Prompt-Reveal panel — slides up from bottom on hover. The
          signature interaction: the gallery becomes a teaching tool.
          Emerald fill + black monospace so it reads as a terminal
          readout the student would actually use. */}
      {hasReveal && tile.reveal && (
        <div className="pointer-events-none absolute inset-0 z-10 flex translate-y-full flex-col justify-center bg-emerald-500/95 p-6 text-black transition-transform duration-500 ease-out group-hover:translate-y-0">
          <p className="mb-3 font-mono text-[10px] font-extrabold uppercase tracking-[0.22em] text-emerald-950">
            {tile.reveal.label}
          </p>
          <p className="font-mono text-[13px] font-semibold leading-relaxed text-emerald-950">
            {tile.reveal.body}
          </p>
        </div>
      )}
    </>
  );

  const className = `group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md transition-all duration-500 ease-out hover:scale-[1.02] hover:border-emerald-400/60 hover:shadow-[0_15px_40px_rgba(16,185,129,0.25)] ${SPAN_CLASS[tile.span]}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }
  return <div className={className}>{inner}</div>;
}
