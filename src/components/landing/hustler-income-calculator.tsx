'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Interactive "Income Multiplier" hook for the Hustler page.
 * Slider 1-10 hrs/day → projected monthly income using marketplace
 * average rates (~₹7,500/hr of AI-productive work per month).
 *
 * Disclaimer copy is intentional: never promise; always cite
 * "marketplace average" so legal-safe.
 */
export function HustlerIncomeCalculator() {
  const [hours, setHours] = useState(2)
  const [displayIncome, setDisplayIncome] = useState(0)
  const rafRef = useRef<number | null>(null)

  const targetIncome = hours * 7500
  const workMultiplier = (hours * 2.5).toFixed(1)

  // Animate the ₹ number toward the target whenever the slider moves.
  // Feels way snappier than a hard jump — earnings "tick up" as you
  // drag, which is the whole point of the multiplier hook.
  useEffect(() => {
    const start = displayIncome
    const delta = targetIncome - start
    if (delta === 0) return
    const startTime = performance.now()
    const duration = 400

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      // easeOutQuad
      const eased = 1 - (1 - t) * (1 - t)
      setDisplayIncome(Math.round(start + delta * eased))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // displayIncome is intentionally excluded — we only re-trigger when
    // the target changes (user moves the slider). Including it would
    // restart the animation on every frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetIncome])

  const percent = ((hours - 1) / 9) * 100

  return (
    <div className="relative w-full max-w-[540px] mx-auto">
      {/* Ambient gold halo behind the calculator — the "this is money" signal */}
      <div
        aria-hidden
        className="absolute -inset-10 rounded-[32px] blur-3xl opacity-60"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(251,191,36,0.28), rgba(16,185,129,0.12) 50%, rgba(0,0,0,0) 75%)',
        }}
      />

      <div className="relative rounded-2xl border border-emerald-500/25 bg-[#0a0a0a]/90 shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden backdrop-blur-sm">
        {/* Header row */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/5 bg-black/40">
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: '#fbbf24' }}
            />
            <span
              className="text-[10px] sm:text-[11px] font-bold tracking-[0.24em] uppercase"
              style={{
                fontFamily: 'var(--font-fira-code), ui-monospace, monospace',
                color: '#fbbf24',
              }}
            >
              AI Income Multiplier
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] text-gray-500" style={{ fontFamily: 'var(--font-fira-code), ui-monospace, monospace' }}>
            live
          </span>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Slider section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="hustler-hours" className="text-[11px] font-bold tracking-widest uppercase text-gray-400">
                Daily hours available
              </label>
              <span
                className="text-sm font-bold"
                style={{ color: '#fbbf24', fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' }}
              >
                {hours} {hours === 1 ? 'hour' : 'hours'}
              </span>
            </div>

            <input
              id="hustler-hours"
              type="range"
              min={1}
              max={10}
              step={1}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#fbbf24] [&::-webkit-slider-thumb]:shadow-[0_0_18px_rgba(251,191,36,0.7)] [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#fbbf24] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-[0_0_18px_rgba(251,191,36,0.7)] [&::-moz-range-thumb]:cursor-grab"
              style={{
                background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${percent}%, rgba(255,255,255,0.08) ${percent}%, rgba(255,255,255,0.08) 100%)`,
              }}
              aria-label="Daily hours available"
            />

            <div className="flex justify-between mt-2 text-[10px] text-gray-600 font-mono">
              <span>1</span>
              <span>10</span>
            </div>
          </div>

          {/* Multiplier strip */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="text-[10px] tracking-widest uppercase text-emerald-400/80" style={{ fontFamily: 'var(--font-fira-code), ui-monospace, monospace' }}>
              AI leverage
            </div>
            <motion.div
              key={workMultiplier}
              initial={{ scale: 0.92, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="ml-auto text-lg font-bold text-emerald-300"
              style={{ fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' }}
            >
              {workMultiplier}× output
            </motion.div>
          </div>

          {/* Main income readout */}
          <div className="rounded-2xl p-5 border border-[#fbbf24]/30 bg-gradient-to-br from-[#fbbf24]/10 via-emerald-500/5 to-black/30">
            <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.24em] uppercase text-[#fbbf24]/80">
              Monthly earning potential
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span
                className="text-4xl sm:text-5xl font-extrabold text-white tabular-nums"
                style={{
                  fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
                  textShadow: '0 0 24px rgba(251,191,36,0.4)',
                }}
              >
                ₹{displayIncome.toLocaleString('en-IN')}
              </span>
              <span className="text-xl text-gray-500">*</span>
            </div>
            <p className="mt-3 text-[10px] sm:text-[11px] text-emerald-400/70 leading-relaxed">
              * Average freelance marketplace rates for AI-assisted work. Real earnings
              depend on effort, client fit, and how fast you ship.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
