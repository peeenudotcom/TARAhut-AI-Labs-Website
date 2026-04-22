'use client';

import { useEffect, useState } from 'react';

// Floating "back to top" button — appears after the user has scrolled
// past the fold. Long course pages (Pulse Path + Tools + outcomes +
// enrollment) run several viewports deep so a quick trip home is a
// real need, not ornament. Parked above the WhatsApp button at
// bottom-left so the bottom-right Ask TARA orb keeps its prominence.
const SHOW_THRESHOLD_PX = 500;

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > SHOW_THRESHOLD_PX);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function goTop() {
    // Respect reduced-motion preference — jump instantly instead of
    // smooth-scrolling for users who asked for less animation.
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label="Back to top"
      className={`fixed bottom-24 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/40 bg-[#020617]/80 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.35)] backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-emerald-300/70 hover:text-emerald-200 hover:shadow-[0_0_28px_rgba(16,185,129,0.6)] focus:outline-none focus-visible:border-emerald-300 ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
