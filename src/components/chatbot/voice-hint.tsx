'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'tara_voice_hint_count'
const MAX_SHOWS = 3
const VISIBLE_MS = 5000

interface Props {
  // Hide the pill the moment the user actually presses the orb.
  // Wired from the parent so a single hold counts across both
  // mouse and touch events.
  dismissed: boolean
}

// VoiceHint — the floating "🎙️ Hold to Speak" pill that teaches
// mobile and desktop users that the orb has a long-press voice
// gesture. Shows for the first 3 visits per device, fades after
// 5 seconds OR on first interaction (whichever comes first).
//
// Hidden on browsers without SpeechRecognition — handled at the
// parent level by only mounting this component when voice is
// supported.
export function VoiceHint({ dismissed }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    let count = 0
    try {
      count = parseInt(window.localStorage.getItem(STORAGE_KEY) ?? '0', 10)
    } catch {
      // localStorage can throw in private mode — show the hint anyway.
    }
    if (Number.isNaN(count)) count = 0
    if (count >= MAX_SHOWS) return // user has seen it enough times

    // Bump the counter immediately so this visit is registered even
    // if the user closes the tab before the 5s timer elapses.
    try {
      window.localStorage.setItem(STORAGE_KEY, String(count + 1))
    } catch {
      // ignore
    }

    // Reveal on a small delay so the orb's own entrance animation
    // (1.5s spring) lands first — pill appears as if greeting the
    // already-visible orb.
    const showTimer = window.setTimeout(() => setVisible(true), 1700)
    const hideTimer = window.setTimeout(
      () => setVisible(false),
      1700 + VISIBLE_MS
    )
    return () => {
      window.clearTimeout(showTimer)
      window.clearTimeout(hideTimer)
    }
  }, [])

  // Parent signals the user actually engaged with the orb — drop the
  // pill instantly so it doesn't linger over an active hold.
  useEffect(() => {
    if (dismissed) setVisible(false)
  }, [dismissed])

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          key="voice-hint"
          initial={{ opacity: 0, y: 8, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.96 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute bottom-[88px] right-0 z-[55] flex justify-end pr-2"
          aria-hidden
        >
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/55 bg-black/85 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.55)] backdrop-blur-md">
            <span className="text-[13px]" aria-hidden>🎙️</span>
            <span>Hold to Speak</span>
            {/* Tail pointing at the orb */}
            <span
              aria-hidden
              className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 border-r border-b border-emerald-400/55 bg-black/85"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
