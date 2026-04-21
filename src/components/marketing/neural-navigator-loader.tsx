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
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#020617] sm:h-[520px] lg:h-[560px]">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/8 via-transparent to-teal-500/6" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="size-3 animate-pulse rounded-full bg-emerald-400/70" />
      </div>
      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-[10px] uppercase tracking-widest text-white/40 sm:text-xs">
        Loading navigator…
      </p>
    </div>
  );
}

function StaticFallback() {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#020617] sm:h-[520px] lg:h-[560px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(5,150,105,0.18),transparent_60%)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
        <p className="font-['Space_Grotesk',sans-serif] text-lg font-bold text-white sm:text-xl">
          9 courses · 142 sessions
        </p>
        <p className="max-w-[240px] text-sm text-white/60">
          Pick a course to start learning for ₹999 online or in Punjab.
        </p>
      </div>
    </div>
  );
}

// Client gate: small viewports and reduced-motion users skip the WebGL
// scene entirely (bandwidth + battery + accessibility). They get a static
// decorative fallback that communicates the same info without spinning
// up a GPU context.
export function NeuralNavigatorLoader() {
  const [state, setState] = useState<'pending' | 'canvas' | 'fallback'>('pending');

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const bigScreen = window.matchMedia('(min-width: 768px)').matches;
    setState(reduceMotion || !bigScreen ? 'fallback' : 'canvas');
  }, []);

  if (state === 'pending') return <NavigatorSkeleton />;
  if (state === 'fallback') return <StaticFallback />;
  return <NeuralNavigator />;
}
