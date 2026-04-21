'use client';

import { createElement, useEffect, useState } from 'react';
import Script from 'next/script';

interface Props {
  url: string;
}

// 3D hero background powered by Spline's web component viewer.
//
// Loading strategy:
// - The custom <spline-viewer> tag is always rendered once the component
//   mounts. When the viewer script finishes loading, the browser upgrades
//   the element in place — no state gating required. Relying on the
//   Script onLoad callback was flaky for type="module" scripts in
//   next/script.
// - The script loads with strategy="afterInteractive" so it fires after
//   hydration but before idle, keeping the scene visible on first
//   interaction without blocking LCP.
//
// Gated on:
// - prefers-reduced-motion → return null (accessibility).
// - (min-width: 768px) → return null (low-end Android WebGL cost vs
//   decorative win is a bad trade).
//
// Scene URL must be publicly accessible — in Spline, set Export → Web →
// Public access before copying the URL, otherwise you get HTTP 403 and
// a silent blank hero.
export function HeroSpline({ url }: Props) {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const bigScreen = window.matchMedia('(min-width: 768px)').matches;
    if (!reduceMotion && bigScreen) setCanRender(true);
  }, []);

  if (!canRender) return null;

  return (
    <>
      <Script
        src="https://unpkg.com/@splinetool/viewer@1.9.3/build/spline-viewer.js"
        type="module"
        strategy="afterInteractive"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-60"
      >
        {createElement('spline-viewer', {
          url,
          'events-target': 'global',
          'loading-anim': 'off',
          style: {
            display: 'block',
            width: '100%',
            height: '100%',
          },
        })}
      </div>
    </>
  );
}
