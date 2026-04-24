'use client'

import { useEffect, useRef, useState } from 'react'

const LINES: { kind: 'prompt' | 'system' | 'success' | 'muted'; text: string }[] = [
  { kind: 'prompt',  text: '> initializing builder.sh' },
  { kind: 'muted',   text: '  target: automate_legal_workflows' },
  { kind: 'system',  text: '>> deploying claude-sonnet-4-6 agent' },
  { kind: 'muted',   text: '  tools: [rag, web_search, code_exec]' },
  { kind: 'system',  text: '>> indexing 4,210 documents → embeddings' },
  { kind: 'success', text: '>> agent live · 16 sessions mapped' },
  { kind: 'muted',   text: '  avg latency 840ms · p95 1.8s' },
  { kind: 'prompt',  text: '> ready for production_' },
]

const KIND_COLOR: Record<typeof LINES[number]['kind'], string> = {
  prompt:  '#00d4ff',
  muted:   'rgba(255,255,255,0.45)',
  system:  '#ffffff',
  success: '#10b981',
}

/**
 * Fake terminal that types itself out line by line, loops. Pure
 * typography theatre — the lines aren't real output, they're a
 * visual that says "this is a platform for builders who live in
 * terminals." Kept short (7 lines) so it loops cleanly every ~15s.
 */
export function BuilderNeuralTerminal() {
  const [shown, setShown] = useState<string[]>([])
  const [typing, setTyping] = useState<string>('')
  const [lineIndex, setLineIndex] = useState(0)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      // Render fully without animation.
      setShown(LINES.map((l) => l.text))
      setTyping('')
      return
    }

    let cancelled = false

    function schedule(fn: () => void, ms: number) {
      const id = setTimeout(() => {
        if (!cancelled) fn()
      }, ms)
      timeoutsRef.current.push(id)
    }

    function typeLine(idx: number) {
      if (cancelled) return
      if (idx >= LINES.length) {
        // Hold the completed terminal for a beat, then loop.
        schedule(() => {
          setShown([])
          setTyping('')
          setLineIndex(0)
          typeLine(0)
        }, 3500)
        return
      }
      const full = LINES[idx].text
      let i = 0
      const step = () => {
        if (cancelled) return
        if (i <= full.length) {
          setTyping(full.slice(0, i))
          i++
          schedule(step, 18)
        } else {
          setShown((prev) => [...prev, full])
          setTyping('')
          setLineIndex(idx + 1)
          schedule(() => typeLine(idx + 1), 280)
        }
      }
      step()
    }

    typeLine(0)
    return () => {
      cancelled = true
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []
    }
  }, [])

  return (
    <div
      className="relative w-full max-w-2xl mx-auto rounded-2xl border border-[#00d4ff]/20 bg-[#030a12]/85 backdrop-blur-md overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.55),_0_0_40px_rgba(0,212,255,0.12)]"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/40">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        <span
          className="ml-auto text-[10px] tracking-wider text-gray-500"
          style={{ fontFamily: 'var(--font-fira-code), ui-monospace, monospace' }}
        >
          neural_terminal ~ builder.sh
        </span>
      </div>

      {/* Body */}
      <div
        className="px-5 sm:px-6 py-5 text-[12px] sm:text-[13px] leading-[1.7] min-h-[200px]"
        style={{ fontFamily: 'var(--font-fira-code), ui-monospace, monospace' }}
      >
        {shown.map((line, i) => (
          <div key={i} style={{ color: KIND_COLOR[LINES[i].kind] }}>
            {line}
          </div>
        ))}
        {lineIndex < LINES.length && (
          <div style={{ color: KIND_COLOR[LINES[lineIndex].kind] }}>
            {typing}
            <span className="inline-block w-[7px] h-[1em] align-middle ml-0.5 bg-[#00d4ff] animate-pulse" />
          </div>
        )}
      </div>
    </div>
  )
}
