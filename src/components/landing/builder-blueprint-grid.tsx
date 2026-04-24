'use client'

import { useEffect, useRef } from 'react'

/**
 * Perspective-tilted blueprint grid background for the Builder page.
 * CSS-only — no canvas, no rAF. Uses a fixed-positioned pseudo-floor
 * with a repeating linear-gradient pattern and a rotateX transform
 * to fake 3D depth. Scroll parallax is driven by a single scroll
 * listener that updates one CSS variable (cheap, no layout thrash).
 */
export function BuilderBlueprintGrid({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    let raf: number | null = null
    let pending = false

    const onScroll = () => {
      if (pending) return
      pending = true
      raf = requestAnimationFrame(() => {
        // Offset the grid by a fraction of scrollY so it feels like
        // an infinite floor receding under the viewer.
        const y = window.scrollY * 0.25
        el.style.setProperty('--builder-grid-offset', `${y}px`)
        pending = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      style={
        {
          // The grid lives below the content, tilted backwards. A
          // radial mask fades it toward the horizon so the edges
          // don't look sharply cut off.
          perspective: '1200px',
          // Set initial value so the first paint has a value to read.
          // The scroll handler updates this on each rAF tick.
          '--builder-grid-offset': '0px',
        } as React.CSSProperties
      }
    >
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: '220%',
          height: '200vh',
          transform:
            'rotateX(62deg) translateY(calc(-180px + var(--builder-grid-offset)))',
          transformOrigin: 'center top',
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.13) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.13) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage:
            'radial-gradient(ellipse 60% 50% at 50% 50%, black 0%, rgba(0,0,0,0.7) 45%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 60% 50% at 50% 50%, black 0%, rgba(0,0,0,0.7) 45%, transparent 75%)',
        }}
      />
    </div>
  )
}
