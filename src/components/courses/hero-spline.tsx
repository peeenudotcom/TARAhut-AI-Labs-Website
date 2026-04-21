'use client';

import { createElement, useEffect, useState } from 'react';
import Script from 'next/script';

interface Props {
  url: string;
}

// 3D hero background powered by Spline's web component viewer. Wraps the
// raw <spline-viewer> custom element so the page.tsx can treat it as a
// normal React component.
//
// Why it's deferred:
// - WebGL + a ~1MB .splinecode file are expensive on low-end Androids,
//   and the hero is already visually strong without it. We gate on
//   (min-width: 768px) so phones render the static background only.
// - prefers-reduced-motion users skip entirely — an animated 3D scene
//   is the opposite of "reduce motion".
// - The viewer script loads with next/script strategy="lazyOnload" so
//   it doesn't block the main bundle or LCP. Scene appears a second or
//   two after the text, which is fine for a decorative background.
export function HeroSpline({ url }: Props) {
  const [canRender, setCanRender] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    // SSR skipped — both checks require window.
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
        strategy="lazyOnload"
        onLoad={() => setScriptReady(true)}
        onReady={() => setScriptReady(true)}
      />
      {scriptReady && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-60"
        >
          {/* createElement bypasses the JSX intrinsic-element check for
              the custom <spline-viewer> tag without polluting global JSX
              types. Props map to HTML attributes on the custom element. */}
          {createElement('spline-viewer', {
            url,
            'events-target': 'global',
            'loading-anim': 'off',
            style: { width: '100%', height: '100%' },
          })}
        </div>
      )}
    </>
  );
}
