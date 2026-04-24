'use client'

import { useEffect, useRef, useState } from 'react'

const BLUE = '#00d4ff'
const EMERALD = '#10b981'

/**
 * The "Exploded Core" — three stacked layers that separate on
 * scroll, like an engineering blueprint. Top = UI, middle = agent
 * logic, bottom = data + RAG. Tilts on mouse move for desktop,
 * stable on mobile. Respects prefers-reduced-motion.
 *
 * Built with CSS 3D transforms — no R3F, no canvas. The blueprint
 * aesthetic reads "engineered product", not "fancy demo."
 */
export function BuilderExplodedCore() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [separation, setSeparation] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      // Static "fully exploded" render so the metaphor is still
      // legible without motion. Intentional one-shot state set on
      // mount — the lint rule fires on any setState in an effect,
      // but we specifically need client-only media-query detection.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSeparation(1)
      return
    }

    const el = rootRef.current
    if (!el) return

    let rafScroll: number | null = null
    let pendingScroll = false

    const onScroll = () => {
      if (pendingScroll) return
      pendingScroll = true
      rafScroll = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight
        // 0 when the core is centred in the viewport, ramps up to
        // ~1 as it scrolls out — so the layers visibly separate
        // as the user moves down the page.
        const center = rect.top + rect.height / 2
        const delta = (vh / 2 - center) / vh
        const normalized = Math.max(0, Math.min(1, -delta * 1.8))
        setSeparation(normalized)
        pendingScroll = false
      })
    }

    let rafMove: number | null = null
    let pendingMove = false
    let pendingEvent: { x: number; y: number } | null = null

    const onMouseMove = (e: MouseEvent) => {
      pendingEvent = { x: e.clientX, y: e.clientY }
      if (pendingMove) return
      pendingMove = true
      rafMove = requestAnimationFrame(() => {
        if (!pendingEvent) return
        const { x, y } = pendingEvent
        // Map mouse position to [-1, 1] across the viewport, clamp
        // rotation to ±12° so the core never flips onto its edge.
        const nx = (x / window.innerWidth) * 2 - 1
        const ny = (y / window.innerHeight) * 2 - 1
        setTilt({ x: nx * 12, y: -ny * 12 })
        pendingMove = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    // Run once on mount so initial position is correct.
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouseMove)
      if (rafScroll) cancelAnimationFrame(rafScroll)
      if (rafMove) cancelAnimationFrame(rafMove)
    }
  }, [])

  // Layer offsets grow with separation. "separation = 0" → layers
  // perfectly stacked; "separation = 1" → top pulls up, bottom
  // pushes down. Units in px.
  const topOffset = -separation * 64
  const bottomOffset = separation * 64

  const layers = [
    {
      label: '01 · INTERFACE LAYER',
      sub: 'UI · Conversation · Tool calls',
      color: BLUE,
      rgb: '0,212,255',
      offset: topOffset,
      zIndex: 30,
    },
    {
      label: '02 · AGENTIC BRAIN',
      sub: 'Prompts · Routing · Memory',
      color: EMERALD,
      rgb: '16,185,129',
      offset: 0,
      zIndex: 20,
    },
    {
      label: '03 · DATABASE + RAG',
      sub: 'Retrieval · Embeddings · Storage',
      color: '#ffffff',
      rgb: '255,255,255',
      offset: bottomOffset,
      zIndex: 10,
    },
  ]

  return (
    <div
      ref={rootRef}
      className="relative w-full max-w-[420px] sm:max-w-[460px] mx-auto aspect-square"
      style={{ perspective: '1400px' }}
    >
      {/* Blue halo — subtle, behind the stack */}
      <div
        aria-hidden
        className="absolute -inset-10 rounded-[32px] blur-3xl opacity-70"
        style={{
          background: `radial-gradient(ellipse at center, rgba(0,212,255,0.2), rgba(16,185,129,0.1) 50%, rgba(0,0,0,0) 75%)`,
        }}
      />

      <div
        className="relative w-full h-full"
        style={{
          transform: `rotateX(${20 + tilt.y * 0.2}deg) rotateY(${tilt.x * 0.3}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out',
        }}
      >
        {layers.map((layer) => (
          <div
            key={layer.label}
            className="absolute inset-0 rounded-2xl border-2 flex flex-col justify-between p-4 sm:p-5 backdrop-blur-sm"
            style={{
              borderColor: layer.color,
              background: `linear-gradient(145deg, rgba(${layer.rgb},0.04) 0%, rgba(${layer.rgb},0.08) 100%)`,
              boxShadow: `0 0 30px rgba(${layer.rgb},0.25), inset 0 0 40px rgba(${layer.rgb},0.04)`,
              transform: `translate3d(0, ${layer.offset}px, 0)`,
              transition: 'transform 0.45s cubic-bezier(0.19, 1, 0.22, 1)',
              zIndex: layer.zIndex,
            }}
          >
            {/* Top row — label + corner brackets */}
            <div className="flex items-start justify-between">
              <div>
                <div
                  className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em]"
                  style={{
                    fontFamily: 'var(--font-fira-code), ui-monospace, monospace',
                    color: layer.color,
                  }}
                >
                  {layer.label}
                </div>
                <div
                  className="text-[9px] sm:text-[10px] text-white/50 mt-1 tracking-wide"
                  style={{ fontFamily: 'var(--font-fira-code), ui-monospace, monospace' }}
                >
                  {layer.sub}
                </div>
              </div>
              {/* Corner tick marks — classic engineering drawing */}
              <div className="flex gap-1">
                <div className="w-2 h-2 border-t border-r" style={{ borderColor: layer.color }} />
              </div>
            </div>

            {/* Schematic pattern inside each layer — quick visual
                differentiator so the 3 layers don't feel interchangeable */}
            <LayerDecoration tier={layer.label[1]} color={layer.color} />

            {/* Bottom-right corner tick */}
            <div className="flex justify-end">
              <div className="w-2 h-2 border-b border-r" style={{ borderColor: layer.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LayerDecoration({ tier, color }: { tier: string; color: string }) {
  // tier 1 = UI (boxes), tier 2 = agent (circuit-like dots+lines),
  // tier 3 = data (horizontal bars). Pure SVG, stays sharp at any size.
  if (tier === '1') {
    return (
      <div className="flex items-center justify-center gap-2 my-2">
        <div className="h-8 w-20 rounded border" style={{ borderColor: color, opacity: 0.5 }} />
        <div className="h-8 w-12 rounded border" style={{ borderColor: color, opacity: 0.35 }} />
        <div className="h-8 w-16 rounded border" style={{ borderColor: color, opacity: 0.5 }} />
      </div>
    )
  }
  if (tier === '2') {
    return (
      <svg viewBox="0 0 200 60" className="my-2 w-full">
        <g fill="none" stroke={color} strokeWidth={1.2} opacity={0.65}>
          <circle cx="24" cy="30" r="5" />
          <circle cx="100" cy="16" r="4" />
          <circle cx="100" cy="44" r="4" />
          <circle cx="176" cy="30" r="5" />
          <path d="M29 30 L95 16 M29 30 L95 44 M105 16 L171 30 M105 44 L171 30" />
          <path d="M100 20 L100 40" strokeDasharray="2 3" opacity={0.5} />
        </g>
      </svg>
    )
  }
  // tier 3 — data
  return (
    <div className="flex flex-col gap-1.5 my-2">
      {[0.9, 0.65, 0.8, 0.45].map((w, i) => (
        <div
          key={i}
          className="h-1.5 rounded-full"
          style={{ width: `${w * 100}%`, background: color, opacity: 0.35 }}
        />
      ))}
    </div>
  )
}
