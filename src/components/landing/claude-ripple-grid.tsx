'use client'

import { useEffect, useRef } from 'react'

/**
 * Mouse-reactive "liquid" grid. Canvas-based. Respects prefers-reduced-motion.
 * Skips the per-frame animation on narrow screens to save battery.
 */
export function ClaudeRippleGrid({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const narrow = window.matchMedia('(max-width: 640px)').matches

    const SPACING = narrow ? 56 : 60
    const STEP = narrow ? 16 : 12
    const INFLUENCE = 160
    const MAX_OFFSET = 22

    let dpr = 1
    let w = 0
    let h = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width
      h = rect.height
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      ctx.lineWidth = 1

      // Vertical lines
      for (let x = 0; x <= w + SPACING; x += SPACING) {
        ctx.beginPath()
        for (let y = 0; y <= h; y += STEP) {
          const dx = x - mx
          const dy = y - my
          const d = Math.sqrt(dx * dx + dy * dy)
          let ox = 0
          if (d < INFLUENCE) {
            const f = (1 - d / INFLUENCE) ** 2
            ox = (dx / (d || 1)) * MAX_OFFSET * f
          }
          const px = x + ox
          if (y === 0) ctx.moveTo(px, y)
          else ctx.lineTo(px, y)
        }
        const nearest = Math.min(Math.abs(x - mx), INFLUENCE)
        const alpha = 0.045 + (1 - nearest / INFLUENCE) * 0.18
        ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = 0; y <= h + SPACING; y += SPACING) {
        ctx.beginPath()
        for (let x = 0; x <= w; x += STEP) {
          const dx = x - mx
          const dy = y - my
          const d = Math.sqrt(dx * dx + dy * dy)
          let oy = 0
          if (d < INFLUENCE) {
            const f = (1 - d / INFLUENCE) ** 2
            oy = (dy / (d || 1)) * MAX_OFFSET * f
          }
          const py = y + oy
          if (x === 0) ctx.moveTo(x, py)
          else ctx.lineTo(x, py)
        }
        const nearest = Math.min(Math.abs(y - my), INFLUENCE)
        const alpha = 0.045 + (1 - nearest / INFLUENCE) * 0.18
        ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`
        ctx.stroke()
      }

      if (!reducedMotion) rafRef.current = requestAnimationFrame(draw)
    }

    if (reducedMotion) {
      // Single static render; no mouse tracking.
      mouseRef.current = { x: -9999, y: -9999 }
      draw()
    } else {
      rafRef.current = requestAnimationFrame(draw)
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    if (!reducedMotion) {
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerleave', onLeave)
    }

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ display: 'block' }}
    />
  )
}
