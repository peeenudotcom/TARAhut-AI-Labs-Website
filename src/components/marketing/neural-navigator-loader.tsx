'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic-import so three + @react-three/fiber + @react-three/drei
// (~350KB gzipped combined) stay out of the initial bundle. SSR is
// disabled because <Canvas> mounts a WebGL context on window.
const NeuralNavigator = dynamic(
  () => import('./neural-navigator').then((m) => m.NeuralNavigator),
  {
    ssr: false,
    loading: () => <NavigatorSkeleton />,
  }
);

function NavigatorSkeleton() {
  return (
    <div className="relative h-[460px] w-full sm:h-[560px] lg:h-[600px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-12"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.28) 0%, rgba(13,148,136,0.14) 35%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />
      <div className="relative h-full w-full overflow-hidden rounded-3xl border border-emerald-400/5 bg-[#020617]/60 backdrop-blur-sm">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-3 animate-pulse rounded-full bg-emerald-400/70" />
        </div>
        <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-center font-mono text-[11px] uppercase tracking-widest text-white/60 sm:text-xs">
          Booting galaxy…
        </p>
      </div>
    </div>
  );
}

function StaticFallback() {
  return (
    <div className="relative h-[460px] w-full sm:h-[560px] lg:h-[600px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-12"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.30) 0%, rgba(13,148,136,0.15) 35%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />
      <div className="relative h-full w-full overflow-hidden rounded-3xl border border-emerald-400/5 bg-[#020617]/60 backdrop-blur-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(16,185,129,0.22),transparent_55%)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
          <p className="font-['Space_Grotesk',sans-serif] text-lg font-bold text-white sm:text-xl">
            9 courses · 142 sessions
          </p>
          <p className="max-w-[240px] text-sm text-white/60">
            Pick a course to start learning for ₹999 online or in Punjab.
          </p>
        </div>
      </div>
    </div>
  );
}

// Client gate: reduced-motion users skip the WebGL scene (accessibility
// — they asked for less animation). Everyone else — including mobile
// — gets the galaxy, because it's the centerpiece of the hero and
// hiding it on phones was killing the conversion hook.
export function NeuralNavigatorLoader() {
  const [state, setState] = useState<'pending' | 'canvas' | 'fallback'>('pending');

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    setState(reduceMotion ? 'fallback' : 'canvas');
  }, []);

  if (state === 'pending') return <NavigatorSkeleton />;
  if (state === 'fallback') return <StaticFallback />;
  return <NeuralNavigator />;
}
