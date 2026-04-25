'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Pick = { emoji: string; label: string; word: string }

const STEPS: { title: string; picks: Pick[] }[] = [
  {
    title: 'Pick a hero',
    picks: [
      { emoji: '🦁', label: 'Lion',   word: 'a brave little lion' },
      { emoji: '🚀', label: 'Pilot',  word: 'a curious space pilot' },
      { emoji: '🌳', label: 'Tree',   word: 'a talking magic tree' },
      { emoji: '🤖', label: 'Robot',  word: 'a tiny friendly robot' },
    ],
  },
  {
    title: 'Pick a world',
    picks: [
      { emoji: '🌌', label: 'Space',  word: 'the floating city of stars' },
      { emoji: '🌊', label: 'Ocean',  word: 'a glowing underwater kingdom' },
      { emoji: '🌲', label: 'Forest', word: 'a whispering emerald forest' },
      { emoji: '🏔️', label: 'Mountain', word: 'a cloud-tall secret mountain' },
    ],
  },
  {
    title: 'Pick a surprise',
    picks: [
      { emoji: '🔑', label: 'Key',    word: 'a key that opens anything' },
      { emoji: '🗺️', label: 'Map',    word: 'a map that redraws itself' },
      { emoji: '💎', label: 'Crystal', word: 'a humming emerald crystal' },
      { emoji: '🪄', label: 'Wand',   word: 'a wand that answers questions' },
    ],
  },
]

/**
 * Build a charming, kid-safe story from three picks. Deterministic
 * (no AI call, no risk of weird output), instant, always appropriate.
 * If the kid wants a different story, they just re-pick and generate.
 */
function buildStory(p: [Pick, Pick, Pick]): string {
  const [hero, world, surprise] = p
  return `One quiet morning in ${world.word}, ${hero.word} found ${surprise.word}. "This is amazing!" they whispered. A friendly voice from the trees said, "If you listen closely, I'll teach you how to use it." And together they wrote the very first chapter of a grand, gentle adventure — one question at a time. ✨`
}

export function KidsImaginationMachine() {
  const [picks, setPicks] = useState<(Pick | null)[]>([null, null, null])
  const [story, setStory] = useState<string | null>(null)
  const [typing, setTyping] = useState(false)
  const [revealed, setRevealed] = useState('')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const complete = picks.every((p) => p !== null)

  function selectPick(stepIndex: number, pick: Pick) {
    setPicks((prev) => {
      const next = [...prev]
      next[stepIndex] = pick
      return next
    })
    // If the story was already shown, clear it so the kid can see
    // the new picks flash before pressing the button again.
    if (story) {
      setStory(null)
      setRevealed('')
    }
  }

  function generate() {
    if (!complete) return
    const full = buildStory(picks as [Pick, Pick, Pick])
    setStory(full)
    setTyping(true)
    setRevealed('')

    // Fake-streaming typewriter so the kid feels the AI "thinking".
    // Pure setTimeout chain — lightweight, pausable via cleanup.
    let i = 0
    const step = () => {
      i++
      setRevealed(full.slice(0, i))
      if (i < full.length) {
        timerRef.current = setTimeout(step, 16)
      } else {
        setTyping(false)
      }
    }
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(step, 250)
  }

  function resetMachine() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setPicks([null, null, null])
    setStory(null)
    setRevealed('')
    setTyping(false)
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Halo */}
      <div
        aria-hidden
        className="absolute -inset-8 rounded-[48px] blur-3xl opacity-70 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(34,211,238,0.22), rgba(16,185,129,0.1) 55%, rgba(0,0,0,0) 80%)',
        }}
      />

      <div
        className="relative rounded-[36px] border-2 backdrop-blur-md bg-white/[0.03] p-5 sm:p-7 shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
        style={{ borderColor: 'rgba(34,211,238,0.25)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span
              className="text-lg sm:text-xl font-black"
              style={{
                fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
                color: '#22d3ee',
                textShadow: '0 0 18px rgba(34,211,238,0.4)',
              }}
            >
              ✨ Imagination Machine
            </span>
          </div>
          {complete && story && (
            <button
              onClick={resetMachine}
              className="text-[11px] text-cyan-300/80 hover:text-cyan-200 font-bold tracking-wider uppercase transition-colors"
            >
              ↻ try again
            </button>
          )}
        </div>

        {/* Steps */}
        <div className="space-y-5">
          {STEPS.map((s, stepIdx) => (
            <div key={s.title}>
              <div className="flex items-center gap-2 mb-2.5">
                <span
                  className="flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-black text-black"
                  style={{ background: '#22d3ee' }}
                >
                  {stepIdx + 1}
                </span>
                <span className="text-sm sm:text-base font-bold text-white/90">{s.title}</span>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {s.picks.map((p) => {
                  const active = picks[stepIdx]?.label === p.label
                  return (
                    <button
                      key={p.label}
                      onClick={() => selectPick(stepIdx, p)}
                      aria-pressed={active}
                      className="flex flex-col items-center justify-center gap-1 rounded-3xl border-2 border-dashed p-2 sm:p-3 transition-transform"
                      style={{
                        borderColor: active ? '#22d3ee' : 'rgba(255,255,255,0.15)',
                        background: active ? 'rgba(34,211,238,0.18)' : 'rgba(255,255,255,0.03)',
                        color: active ? 'white' : 'rgba(255,255,255,0.85)',
                        transform: active ? 'scale(1.06)' : 'scale(1)',
                        boxShadow: active ? '0 8px 28px rgba(34,211,238,0.28)' : 'none',
                      }}
                    >
                      <span className="text-2xl sm:text-3xl leading-none select-none">
                        {p.emoji}
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold tracking-wide">{p.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Result area */}
        <div className="mt-6 min-h-[88px] rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-4 sm:p-5 flex items-center justify-center text-center">
          <AnimatePresence mode="wait">
            {!story && !complete && (
              <motion.p
                key="prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-gray-400"
              >
                Pick all three and press the button — your story will appear right here.
              </motion.p>
            )}
            {!story && complete && (
              <motion.p
                key="ready"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-cyan-300 font-semibold"
              >
                Ready! Tap the button below. ✨
              </motion.p>
            )}
            {story && (
              <motion.p
                key="story"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm sm:text-base text-white/95 leading-relaxed italic"
                style={{ fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' }}
              >
                &ldquo;{revealed}
                {typing && (
                  <motion.span
                    aria-hidden
                    className="ml-1 inline-block"
                    animate={{ scale: [0.6, 1.1, 0.8], rotate: [0, 12, -8, 0] }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    ✨
                  </motion.span>
                )}
                &rdquo;
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Big bouncy button */}
        <motion.button
          whileHover={{ scale: complete ? 1.05 : 1 }}
          whileTap={{ scale: complete ? 0.92 : 1 }}
          onClick={generate}
          disabled={!complete}
          className="mt-5 w-full py-4 rounded-full font-black text-lg text-black tracking-widest uppercase disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden"
          style={{
            background: complete
              ? 'linear-gradient(90deg, #22d3ee 0%, #10b981 100%)'
              : 'rgba(255,255,255,0.1)',
            boxShadow: complete ? '0 10px 36px rgba(34,211,238,0.35)' : 'none',
            color: complete ? '#0a1220' : 'rgba(255,255,255,0.5)',
            fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
          }}
        >
          {typing ? 'Making magic…' : 'Create with AI ✨'}
        </motion.button>
      </div>
    </div>
  )
}
