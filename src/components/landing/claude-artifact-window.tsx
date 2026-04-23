'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CODE = `// Claude is architecting...
export default function Dashboard() {
  return (
    <Card className="p-6 bg-emerald-50">
      <Chart data={revenue} />
      <Metric label="Active" value={2480} />
      <ExportButton />
    </Card>
  )
}`

type Phase = 'typing' | 'rendered'

export function ClaudeArtifactWindow() {
  const [typed, setTyped] = useState('')
  const [phase, setPhase] = useState<Phase>('typing')
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      setTyped(CODE)
      setPhase('rendered')
      return
    }

    let cancelled = false

    function clearAll() {
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []
    }

    function schedule(fn: () => void, ms: number) {
      const id = setTimeout(() => {
        if (!cancelled) fn()
      }, ms)
      timeoutsRef.current.push(id)
    }

    function runCycle() {
      setPhase('typing')
      setTyped('')

      let i = 0
      function typeNext() {
        if (cancelled) return
        if (i <= CODE.length) {
          setTyped(CODE.slice(0, i))
          i++
          schedule(typeNext, 22)
        } else {
          schedule(() => setPhase('rendered'), 500)
          schedule(runCycle, 6500)
        }
      }
      typeNext()
    }

    runCycle()

    return () => {
      cancelled = true
      clearAll()
    }
  }, [])

  return (
    <div className="relative w-full max-w-[520px] mx-auto">
      {/* Ambient emerald halo behind window */}
      <div
        aria-hidden
        className="absolute -inset-10 rounded-[32px] blur-3xl opacity-70"
        style={{ background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.22), rgba(16,185,129,0) 70%)' }}
      />

      <div className="relative rounded-2xl border border-emerald-500/25 bg-[#0a0a0a] shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col aspect-[5/6]">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/60 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          <span
            className="ml-auto text-[10px] tracking-wider text-gray-500"
            style={{ fontFamily: 'var(--font-fira-code), ui-monospace, monospace' }}
          >
            artifact_v2.tsx
          </span>
        </div>

        {/* Content stack */}
        <div className="relative flex-1 overflow-hidden">
          {/* Code layer */}
          <motion.pre
            animate={{ opacity: phase === 'typing' ? 1 : 0.12 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 p-5 md:p-6 text-[11px] md:text-[12px] leading-[1.7] text-emerald-400 whitespace-pre-wrap m-0"
            style={{ fontFamily: 'var(--font-fira-code), ui-monospace, monospace' }}
          >
            {typed}
            {phase === 'typing' && (
              <span className="inline-block w-[6px] h-[1em] bg-emerald-400 align-middle animate-pulse ml-0.5" />
            )}
          </motion.pre>

          {/* Rendered artifact layer */}
          <AnimatePresence>
            {phase === 'rendered' && (
              <motion.div
                key="rendered"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="absolute inset-0 p-5 md:p-6 flex flex-col gap-3 bg-gradient-to-b from-black/40 to-[#0a0a0a]/60 backdrop-blur-[2px]"
              >
                {/* Mock top row */}
                <div className="flex items-center justify-between">
                  <div className="h-2.5 w-28 rounded-full bg-emerald-500/80" />
                  <div className="h-2 w-10 rounded-full bg-emerald-500/35" />
                </div>

                {/* Mock chart */}
                <div className="rounded-lg bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 border border-emerald-500/25 p-3 h-[38%] flex items-end gap-1.5">
                  {[40, 65, 50, 80, 55, 90, 70, 60].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.1 + i * 0.05, duration: 0.45, ease: 'easeOut' }}
                      className="flex-1 rounded-sm bg-emerald-500/70"
                    />
                  ))}
                </div>

                {/* Mock metric tiles */}
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { l: 'ACTIVE', v: '2,480' },
                    { l: 'REVENUE', v: '₹12.4L' },
                  ].map((t) => (
                    <div key={t.l} className="rounded-lg border border-emerald-500/20 bg-white/[0.02] p-3">
                      <div
                        className="text-[9px] tracking-widest text-emerald-300/70"
                        style={{ fontFamily: 'var(--font-fira-code), ui-monospace, monospace' }}
                      >
                        {t.l}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-white">{t.v}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[10px] tracking-widest text-emerald-400/90 uppercase"
                    style={{ fontFamily: 'var(--font-fira-code), ui-monospace, monospace' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    component rendered
                  </span>
                  <div className="h-6 w-20 rounded bg-emerald-500/70" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
