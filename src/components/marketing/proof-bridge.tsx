import Link from 'next/link';
import { labFeed } from '@/config/lab-feed';

interface Props {
  // Optional per-course filter so the bridge can preferentially show
  // projects built in THIS course's sessions. Falls back to the full
  // feed if the filter returns nothing so the strip is never empty.
  courseSlug?: string;
}

// Proof Bridge — the connective tissue between "here is what you'll
// learn" (syllabus) and "here is what you can buy" (enrollment).
// Appears right after the Pulse Path finale. The psychological job
// it does: when a reader finishes the 16 sessions their brain asks
// "can I actually do this?" — the bridge answers with real output.
//
// Layout: full-width emerald-glow banner with a horizontally
// auto-scrolling marquee of student project thumbnails and a single
// dominant CTA into the full /lab-feed page. The marquee pauses on
// hover so the reader can scan individual tiles.
export function ProofBridge({ courseSlug }: Props) {
  const courseProjects = courseSlug
    ? labFeed.filter((t) => t.courseSlug === courseSlug)
    : [];
  // Prefer course-specific proof but fall back to the global feed so
  // the bridge never renders empty — better a generic proof than no
  // proof at all.
  const source = courseProjects.length >= 3 ? courseProjects : labFeed;
  // Only image tiles in the marquee — code tiles don't carry the
  // "can I see what it looks like" visceral proof the strip needs.
  const images = source.filter((t) => t.kind === 'image' && t.src).slice(0, 8);

  if (images.length === 0) return null;

  // Duplicate the list so the CSS marquee loop is seamless — the
  // second copy slides in as the first slides out.
  const loop = [...images, ...images];

  return (
    <section className="relative my-20 overflow-hidden py-16 sm:my-24 sm:py-20">
      {/* Emerald aura — matches the hero + galaxy so the bridge reads
          as the same universe, just a different room. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.18) 0%, rgba(13,148,136,0.08) 40%, transparent 75%)',
        }}
      />
      {/* Lab grid overlay, faded at the edges so it fades into the
          page rather than slamming a boundary. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(16,185,129,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.06) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          maskImage:
            'radial-gradient(ellipse at 50% 50%, black 40%, transparent 85%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at 50% 50%, black 40%, transparent 85%)',
        }}
      />

      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-400">
          &gt; The Proof
        </p>
        <h2 className="mt-3 font-['Space_Grotesk',sans-serif] text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
          Yes — you can actually build this.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/65 md:text-base">
          Real outputs from students who sat in the same 16 sessions, in Kotkapura and online. Updated weekly.
        </p>
      </div>

      {/* Marquee strip — auto-scrolling thumbnails. Pauses on hover
          via the group-hover affordance. */}
      <div className="group relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]">
        <div
          className="flex min-w-max gap-5 pr-5 [animation:proof-marquee_48s_linear_infinite] group-hover:[animation-play-state:paused]"
          style={{ willChange: 'transform' }}
        >
          {loop.map((tile, i) => (
            <ProofThumb key={`${tile.id}-${i}`} tile={tile} />
          ))}
        </div>

        {/* Marquee keyframes — scoped so they don't pollute globals. */}
        <style>{`
          @keyframes proof-marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      <div className="mt-10 text-center sm:mt-12">
        <Link
          href="/lab-feed"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_24px_rgba(16,185,129,0.45)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_36px_rgba(16,185,129,0.75)] md:text-base"
        >
          Explore the Live Lab Feed
          <span aria-hidden>→</span>
        </Link>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300/80">
          {labFeed.length}+ projects · {labFeed.length} this month
        </p>
      </div>
    </section>
  );
}

function ProofThumb({
  tile,
}: {
  tile: (typeof labFeed)[number];
}) {
  if (tile.kind !== 'image' || !tile.src) return null;
  return (
    <div className="relative h-48 w-72 flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/50 hover:shadow-[0_10px_30px_rgba(16,185,129,0.25)] sm:h-56 sm:w-80">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tile.src}
        alt={tile.alt ?? ''}
        className="h-full w-full object-cover opacity-80"
        loading="lazy"
      />
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4">
        <div className="mb-1.5 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-white px-1.5 py-0.5 font-mono text-[9px] font-extrabold uppercase tracking-[0.12em] text-black">
            Session {String(tile.session).padStart(2, '0')}
          </span>
          {tile.techTag ? (
            <span className="rounded-md border border-emerald-400/30 bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-300">
              {tile.techTag}
            </span>
          ) : null}
        </div>
        <p className="line-clamp-2 font-['Space_Grotesk',sans-serif] text-sm font-bold leading-tight text-white">
          {tile.title}
        </p>
      </div>
    </div>
  );
}
