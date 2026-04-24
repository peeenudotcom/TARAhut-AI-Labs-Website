'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Task = {
  id: string
  icon: string
  label: string
  hours: number
  delegate: string
}

const TASKS: Task[] = [
  { id: 'inbox',  icon: '✉️', label: 'Client inbox triage',       hours: 4, delegate: 'ChatGPT + Gmail sweep' },
  { id: 'market', icon: '📊', label: 'Market & research brief',    hours: 6, delegate: 'Perplexity + Claude digest' },
  { id: 'report', icon: '📝', label: 'Weekly report drafting',     hours: 3, delegate: 'Claude + Gamma template' },
  { id: 'mins',   icon: '📅', label: 'Meeting prep + minutes',     hours: 2, delegate: 'Fireflies + ChatGPT recap' },
  { id: 'deck',   icon: '🎯', label: 'Internal decks + SOPs',      hours: 3, delegate: 'Gamma AI + prompt library' },
]

const TOTAL_HOURS = TASKS.reduce((n, t) => n + t.hours, 0)

export function PowerTaskEraser() {
  const [erased, setErased] = useState<Set<string>>(new Set())
  const [scannerTargetId, setScannerTargetId] = useState<string | null>(null)
  const [displayHours, setDisplayHours] = useState(0)
  const rafRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<Record<string, HTMLLIElement | null>>({})

  const totalReclaimed = TASKS.filter((t) => erased.has(t.id)).reduce((n, t) => n + t.hours, 0)
  const allErased = erased.size === TASKS.length

  // Smoothly ramp the displayed counter toward the real reclaimed total
  useEffect(() => {
    const start = displayHours
    const delta = totalReclaimed - start
    if (delta === 0) return
    const startTime = performance.now()
    const duration = 450

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      const eased = 1 - (1 - t) * (1 - t)
      setDisplayHours(Math.round((start + delta * eased) * 10) / 10)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalReclaimed])

  function toggle(task: Task) {
    setErased((prev) => {
      const next = new Set(prev)
      if (next.has(task.id)) next.delete(task.id)
      else next.add(task.id)
      return next
    })
    setScannerTargetId(task.id)
  }

  function reset() {
    setErased(new Set())
    setScannerTargetId(null)
  }

  // Compute scanner position from the active row's offset within the container.
  const scannerTop = (() => {
    if (!scannerTargetId || !containerRef.current) return 0
    const row = rowRefs.current[scannerTargetId]
    if (!row) return 0
    const containerRect = containerRef.current.getBoundingClientRect()
    const rowRect = row.getBoundingClientRect()
    return rowRect.top - containerRect.top
  })()
  const scannerHeight = (() => {
    if (!scannerTargetId) return 0
    const row = rowRefs.current[scannerTargetId]
    return row ? row.offsetHeight : 0
  })()

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Outer panel */}
      <div
        ref={containerRef}
        className="relative rounded-3xl border bg-white/[0.02] backdrop-blur-md overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
        style={{ borderColor: 'rgba(226,232,240,0.12)' }}
      >
        {/* Scanner bar — emerald line that snaps to the row under the cursor */}
        <AnimatePresence>
          {scannerTargetId && (
            <motion.div
              key={scannerTargetId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 w-[3px] pointer-events-none z-10"
              style={{
                top: scannerTop,
                height: scannerHeight,
                background: '#10b981',
                boxShadow: '0 0 16px rgba(16,185,129,0.85)',
                transition: 'top 0.35s cubic-bezier(0.19, 1, 0.22, 1), height 0.35s cubic-bezier(0.19, 1, 0.22, 1)',
              }}
            />
          )}
        </AnimatePresence>

        {/* Header strip */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] sm:text-[11px] font-bold tracking-[0.3em] text-gray-300/70 uppercase"
            >
              Daily Task Load
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] uppercase transition-colors"
              style={{ color: displayHours > 0 ? '#10b981' : 'rgba(226,232,240,0.5)' }}
            >
              Reclaimed
            </span>
            <span
              className="tabular-nums text-lg sm:text-xl font-bold"
              style={{
                fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
                color: displayHours > 0 ? '#10b981' : 'rgba(226,232,240,0.95)',
                textShadow: displayHours > 0 ? '0 0 18px rgba(16,185,129,0.45)' : 'none',
              }}
            >
              {displayHours.toFixed(1).replace(/\.0$/, '')}h
            </span>
          </div>
        </div>

        {/* Task rows */}
        <ul className="divide-y divide-white/[0.05]">
          {TASKS.map((task) => {
            const isErased = erased.has(task.id)
            return (
              <li
                key={task.id}
                ref={(el) => {
                  rowRefs.current[task.id] = el
                }}
                onClick={() => toggle(task)}
                onMouseEnter={() => !isErased && setScannerTargetId(task.id)}
                className="group relative flex items-center gap-3 sm:gap-4 px-5 sm:px-6 py-4 cursor-pointer transition-colors hover:bg-white/[0.02]"
              >
                {/* Checkbox-style indicator */}
                <span
                  className="flex items-center justify-center w-5 h-5 rounded border text-[11px] shrink-0 transition-all"
                  style={{
                    borderColor: isErased ? '#10b981' : 'rgba(226,232,240,0.3)',
                    background: isErased ? '#10b981' : 'transparent',
                    color: isErased ? '#030507' : 'transparent',
                  }}
                >
                  ✓
                </span>
                <span className="text-base leading-none shrink-0" aria-hidden>
                  {task.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm sm:text-base font-medium transition-all"
                    style={{
                      color: isErased ? 'rgba(226,232,240,0.4)' : 'rgba(226,232,240,0.95)',
                      textDecoration: isErased ? 'line-through' : 'none',
                    }}
                  >
                    {task.label}
                  </div>
                  <div
                    className="text-[10px] sm:text-[11px] mt-0.5 tracking-wide transition-colors"
                    style={{
                      color: isErased ? 'rgba(16,185,129,0.8)' : 'rgba(226,232,240,0.45)',
                      fontFamily: 'var(--font-fira-code), ui-monospace, monospace',
                    }}
                  >
                    {isErased ? `↳ delegated · ${task.delegate}` : task.delegate}
                  </div>
                </div>
                <div
                  className="text-xs sm:text-sm font-bold tabular-nums shrink-0 transition-colors"
                  style={{
                    color: isErased ? '#10b981' : 'rgba(226,232,240,0.55)',
                    fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
                  }}
                >
                  −{task.hours}h
                </div>
              </li>
            )
          })}
        </ul>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-white/[0.06] flex items-center justify-between text-[10px] sm:text-[11px] tracking-[0.22em] uppercase">
          {allErased ? (
            <span className="text-emerald-400 font-bold">
              ✓ {TOTAL_HOURS}h reclaimed — every week
            </span>
          ) : (
            <span className="text-gray-500">Tap tasks · apply AI workflow</span>
          )}
          {erased.size > 0 && (
            <button
              onClick={reset}
              className="text-gray-500 hover:text-white transition-colors font-bold tracking-[0.2em]"
            >
              ↻ reset
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
