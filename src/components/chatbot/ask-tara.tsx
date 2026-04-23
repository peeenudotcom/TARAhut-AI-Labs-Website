'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { siteConfig } from '@/config/site'
import { ThoughtTrace } from './thought-trace'

// Landing-page subdomain → short display name for the greeting
const SUBDOMAIN_LABELS: Record<string, string> = {
  claude: 'Master Claude 15 Days',
  builder: 'Master AI Builder 90-Day',
  hustler: 'AI Hustler 45',
  power: 'AI Power 8-Week',
  tools: 'AI Tools Mastery',
  prompts: 'Prompt Engineering',
  kids: 'AI Explorer for Kids',
  teens: 'AI Explorer for Teens',
  marketing: 'AI for Digital Marketing',
}

function detectSubdomain(): string | null {
  if (typeof window === 'undefined') return null
  const host = window.location.host.toLowerCase()
  const parts = host.split('.')
  // claude.tarahutailabs.com → "claude"
  if (parts.length >= 3 && parts[0] in SUBDOMAIN_LABELS) {
    return parts[0]
  }
  return null
}

const WHATSAPP_HREF = `https://wa.me/${siteConfig.contact.phone.replace(/\D/g, '')}?text=${encodeURIComponent('Hi TARAhut! I was on your website and want to chat with your team.')}`

// Convert AI SDK UIMessage parts[] to a plain text string for rendering
function messageText(parts: Array<{ type: string; text?: string }>): string {
  return parts
    .filter((p) => p.type === 'text')
    .map((p) => p.text ?? '')
    .join('')
}

// Minimal markdown renderer — handles **bold**, *italic*, links, line breaks.
// Not a full markdown parser, but enough for chat bot output.
function renderMessage(text: string): React.ReactNode {
  const lines = text.split('\n')
  return lines.map((line, i) => (
    <span key={i}>
      {renderLine(line)}
      {i < lines.length - 1 && <br />}
    </span>
  ))
}

function renderLine(line: string): React.ReactNode {
  // Match **bold** first
  const parts: React.ReactNode[] = []
  let remaining = line
  let key = 0

  const regex = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)|\*([^*]+)\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(remaining)) !== null) {
    if (match.index > lastIndex) {
      parts.push(remaining.slice(lastIndex, match.index))
    }
    if (match[1]) {
      parts.push(<strong key={key++}>{match[1]}</strong>)
    } else if (match[2] && match[3]) {
      parts.push(
        <a
          key={key++}
          href={match[3]}
          target={match[3].startsWith('http') ? '_blank' : undefined}
          rel="noopener noreferrer"
          className="text-emerald-400 underline hover:text-emerald-300"
        >
          {match[2]}
        </a>
      )
    } else if (match[4]) {
      parts.push(<em key={key++}>{match[4]}</em>)
    }
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < remaining.length) {
    parts.push(remaining.slice(lastIndex))
  }
  return parts.length > 0 ? parts : line
}

export function AskTara() {
  const [open, setOpen] = useState(false)
  const [subdomain, setSubdomain] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  // Viewport detection so we can pick desktop morph (panel at corner)
  // vs mobile morph (bottom sheet) animation targets without trying
  // to animate vw/vh values through framer-motion.
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  // Boot sequence — emerald terminal trace plays the first time the
  // chat opens this page-session. Subsequent opens skip the boot so
  // returning users get straight to the greeting.
  const [bootDone, setBootDone] = useState(false)
  useEffect(() => {
    if (!open || bootDone) return
    const t = window.setTimeout(() => setBootDone(true), 1400)
    return () => window.clearTimeout(t)
  }, [open, bootDone])

  // Memoize transport so it doesn't recreate on every render
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        prepareSendMessagesRequest: ({ messages, id }) => ({
          body: { messages, id, subdomain },
        }),
      }),
    [subdomain]
  )

  const { messages, sendMessage, status, error } = useChat({
    transport,
  })

  const isLoading = status === 'streaming' || status === 'submitted'
  // Trace only shows during "submitted" — the wait for the first
  // streamed token. Once streaming starts, the partial message
  // replaces the trace so we don't stack two bubbles.
  const isThinking = status === 'submitted'

  // Detect landing-page subdomain once on mount
  useEffect(() => {
    setSubdomain(detectSubdomain())
  }, [])

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const landingCourseName = subdomain ? SUBDOMAIN_LABELS[subdomain] : null

  const greeting = landingCourseName
    ? `Hi! I'm Tara 👋 I see you're checking out **${landingCourseName}**. Kuch bhi poochh sakte ho — price, batch dates, kya seekhoge, kuch bhi. Main yahaan hoon!`
    : `Hi there! I'm **Tara** 👋 Ask me anything about TARAhut AI Labs — courses, pricing, batch info, or which course is right for you. Main friendly ho, promise. 😊`

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
  }

  return (
    <>
      {/* Floating button (closed state) — styled as a "tenth planet"
          that escaped the galaxy. Liquid blob morphs its border-radius
          continuously, the outer halo pulses in sync with the sun's
          distort cadence (~2.5s) to create a visual bridge between the
          curriculum and the assistant. A monospace label floats to the
          left like an orbital tag on hover. */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="ask-tara-fab"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            // On exit (when window opens) the orb scales UP and fades —
            // looks like it's expanding outward into the chat window
            // rather than just disappearing.
            exit={{ opacity: 0, scale: 1.6, transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } }}
            transition={{ delay: 1.5, type: 'spring', stiffness: 200, damping: 20 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="group fixed bottom-6 right-6 z-50"
            aria-label="Chat with Ask TARA"
          >
            {/* Orbital label — mirrors the monospace hover labels on
                the galaxy planets; appears on hover, sits to the left
                like a trailing planet tag. */}
            <div className="pointer-events-none absolute right-[88px] top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="whitespace-nowrap rounded border border-emerald-400/40 bg-black/80 px-2.5 py-1.5 font-mono text-[10px] font-medium uppercase tracking-widest text-white/95 shadow-[0_0_14px_rgba(16,185,129,0.55)]">
                Ask TARA
              </span>
            </div>

            {/* Outer emerald halo — pulses at the sun's cadence. */}
            <motion.span
              aria-hidden
              className="absolute -inset-4 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(16,185,129,0.55) 0%, rgba(16,185,129,0.15) 40%, transparent 70%)',
                filter: 'blur(14px)',
              }}
              animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0.95, 0.55] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Liquid blob container — morphs border-radius on a slow
                cycle so the silhouette is never static. Scale pulse is
                separately synced to the sun. */}
            <motion.div
              className="relative flex h-16 w-16 items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 ring-2 ring-emerald-300/40 shadow-[0_0_32px_rgba(16,185,129,0.65)]"
              animate={{
                borderRadius: [
                  '62% 38% 36% 64% / 55% 44% 56% 45%',
                  '44% 56% 60% 40% / 66% 34% 58% 42%',
                  '54% 46% 44% 56% / 38% 62% 35% 65%',
                  '62% 38% 36% 64% / 55% 44% 56% 45%',
                ],
                scale: [1, 1.04, 1],
              }}
              transition={{
                borderRadius: { duration: 11, repeat: Infinity, ease: 'easeInOut' },
                scale: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              <motion.img
                src="/images/chatbot/ask-tara.jpg"
                alt="Ask TARA"
                className="h-full w-full object-cover"
                style={{ objectPosition: 'center 30%' }}
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Emerald emission rim — subtle inner glow on the planet edge */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  boxShadow: 'inset 0 0 18px rgba(16,185,129,0.55)',
                }}
              />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window — true geometric morph from the orb. The HUD
          starts at the orb's exact size + circular shape, then
          animates width / height / borderRadius simultaneously so it
          visually IS the orb expanding into a panel, not a separate
          element materialising. Mobile uses bottom-sheet end values
          (full-width, 80vh, top-rounded only). */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="ask-tara-window"
            initial={{
              width: 64,
              height: 64,
              borderRadius: 32,
              bottom: 24,
              right: 24,
              opacity: 0,
            }}
            animate={
              isMobile
                ? {
                    width: '100vw',
                    height: '85vh',
                    borderTopLeftRadius: 28,
                    borderTopRightRadius: 28,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    bottom: 0,
                    right: 0,
                    opacity: 1,
                  }
                : {
                    width: 400,
                    height: Math.min(640, typeof window !== 'undefined' ? window.innerHeight * 0.8 : 640),
                    borderRadius: 28,
                    bottom: 24,
                    right: 24,
                    opacity: 1,
                  }
            }
            exit={{
              width: 64,
              height: 64,
              borderRadius: 32,
              bottom: 24,
              right: 24,
              opacity: 0,
              transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
            }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="fixed z-50 flex flex-col overflow-hidden bg-[#0a0f1f] border border-emerald-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(5,150,105,0.18)]"
          >
            {/* Laser scanline — fires top→bottom across the freshly
                opened HUD. Triggers after the morph completes
                (delay 0.55s) so it reads as "neural activation" once
                the panel is at full size. */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-0 right-0 z-[60] h-px bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.9)]"
              style={{ animation: 'tara-scan 0.85s ease-in-out 0.55s 1 forwards', top: 0, opacity: 0 }}
            />
            <style>{`
              @keyframes tara-scan {
                0%   { top: 0;    opacity: 1; }
                90%  { opacity: 0.85; }
                100% { top: 100%; opacity: 0; }
              }
            `}</style>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-emerald-950 to-teal-950 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 rounded-full overflow-hidden ring-2 ring-emerald-400/40 shadow-lg shadow-emerald-500/30">
                  {/* Pulsing glow behind avatar */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 -z-10"
                    animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.15, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.img
                    src="/images/chatbot/ask-tara.jpg"
                    alt="Ask TARA"
                    className="h-full w-full object-cover"
                    style={{ objectPosition: 'center 30%' }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0a0f1f] bg-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Ask TARA</p>
                  <p className="text-[10px] text-emerald-300">TARAhut AI Labs · Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-[#25D366] hover:bg-[#1eba57] px-3 py-1.5 text-[11px] font-bold text-white transition-colors hidden sm:inline-block"
                  title="Chat on WhatsApp instead"
                >
                  💬 WhatsApp
                </a>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label="Close chat"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-5 py-5 space-y-4 scroll-smooth bg-[#0a0f1f]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 10%, rgba(16,185,129,0.08), transparent 50%), radial-gradient(circle at 80% 90%, rgba(20,184,166,0.06), transparent 50%)',
              }}
            >
              {/* Boot sequence — terminal trace plays once per session
                  the first time the chat opens. Sets the "this is a
                  real system, not a chatbot" tone before TARA's warm
                  greeting fades in. */}
              <AnimatePresence mode="wait">
                {!bootDone ? (
                  <motion.div
                    key="boot"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }}
                    className="rounded-2xl border border-emerald-500/30 bg-black/45 px-4 py-3 font-mono text-[11px] leading-relaxed text-emerald-300 shadow-[inset_0_0_12px_rgba(16,185,129,0.15)]"
                  >
                    <BootTraceLines />
                  </motion.div>
                ) : (
                  <motion.div
                    key="greeting"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="flex gap-3"
                  >
                    <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden ring-1 ring-emerald-400/40 shadow-md">
                      <img
                        src="/images/chatbot/ask-tara.jpg"
                        alt="Ask TARA"
                        className="h-full w-full object-cover"
                        style={{ objectPosition: 'center 30%' }}
                      />
                    </div>
                    <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 px-4 py-3 text-sm text-gray-100 leading-relaxed">
                      {renderMessage(greeting)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Real conversation */}
              {messages.map((m) => {
                const content = messageText(m.parts as Array<{ type: string; text?: string }>)
                if (!content.trim()) return null
                return (
                  <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
                    {m.role === 'assistant' && (
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-sm shadow-md">
                        ✨
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'rounded-2xl rounded-tr-sm bg-emerald-500 text-white'
                          : 'rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 text-gray-100'
                      }`}
                    >
                      {renderMessage(content)}
                    </div>
                  </div>
                )
              })}

              {/* Thought Trace — emerald terminal log that reveals
                  TARA's reasoning steps while we wait for the first
                  streamed token. Exits the moment streaming begins
                  so the real message takes over without stacking. */}
              <AnimatePresence>
                {isThinking && (
                  <motion.div
                    key="thought-trace"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ThoughtTrace
                      lastUserMessage={
                        [...messages]
                          .reverse()
                          .find((m) => m.role === 'user')
                          ? messageText(
                              ([...messages].reverse().find((m) => m.role === 'user')!.parts as Array<{
                                type: string
                                text?: string
                              }>)
                            )
                          : ''
                      }
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              {error && (
                <div className="rounded-2xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs text-red-300">
                  Something went wrong. Please try again or{' '}
                  <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="underline font-semibold">
                    WhatsApp us
                  </a>
                  .
                </div>
              )}

              {/* Quick actions when no messages yet */}
              {messages.length === 0 && !isLoading && (
                <div className="pt-2 space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 px-1">
                    Quick questions
                  </p>
                  {[
                    'What courses do you offer?',
                    'How much do courses cost?',
                    'Can I actually earn after this?',
                    'Is it online or offline?',
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        sendMessage({ text: q })
                      }}
                      className="block w-full text-left text-xs text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-2.5 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="border-t border-white/10 bg-[#0a0f1f] px-4 py-3 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                disabled={isLoading}
                className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-400/50 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-transform disabled:opacity-40 disabled:hover:scale-100"
                aria-label="Send message"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>

            {/* Footer hint */}
            <div className="px-4 pb-3 bg-[#0a0f1f]">
              <p className="text-center text-[10px] text-gray-600">
                AI-powered · Not 100% accurate · For urgent help,{' '}
                <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">
                  WhatsApp us
                </a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Boot sequence — emerald terminal trace that runs once when the
// chat first opens in a session. Sets the "this is a real system,
// not a popup" tone before the warm Hinglish greeting fades in.
const BOOT_LINES: { tag: string; body: string; delay: number }[] = [
  { tag: 'SYSTEM',  body: 'INITIALIZING NEURAL LINK…',         delay: 0   },
  { tag: 'DB',      body: 'FETCHING 16-SESSION KNOWLEDGE BASE',delay: 320 },
  { tag: 'CONTEXT', body: 'Punjab routing · Hinglish mode',    delay: 640 },
  { tag: 'STATUS',  body: 'ONLINE ✓',                          delay: 960 },
]

function BootTraceLines() {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    const timers = BOOT_LINES.map((line, i) =>
      window.setTimeout(() => setShown((s) => Math.max(s, i + 1)), line.delay)
    )
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [])
  return (
    <ul className="flex flex-col gap-1.5 min-h-[1.5rem]">
      <style>{`
        @keyframes tara-boot-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tara-boot-blink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.25; }
        }
      `}</style>
      {BOOT_LINES.slice(0, shown).map((line, i) => {
        const active = i === shown - 1 && shown < BOOT_LINES.length
        return (
          <li
            key={line.tag}
            className="flex items-start gap-2"
            style={{ animation: 'tara-boot-in 0.32s cubic-bezier(0.16, 1, 0.3, 1) both' }}
          >
            <span
              className={`mt-[3px] inline-block size-1.5 rounded-full ${
                active ? 'bg-emerald-300' : 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
              }`}
              style={active ? { animation: 'tara-boot-blink 0.6s ease-in-out infinite' } : undefined}
            />
            <span className="flex-1">
              <span className="font-bold text-emerald-400">[{line.tag}]</span>{' '}
              <span className="text-emerald-200/90">{line.body}</span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}
