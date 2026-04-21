'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { siteConfig } from '@/config/site'

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
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
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

      {/* Chat window (open state) */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="ask-tara-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed z-50 flex flex-col bg-[#0a0f1f] border border-white/10 shadow-2xl shadow-black/50
                       inset-x-0 bottom-0 top-0 md:inset-auto md:bottom-6 md:right-6
                       md:h-[640px] md:max-h-[80vh] md:w-[400px] md:rounded-3xl overflow-hidden"
          >
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
              {/* Greeting (always shown as first message) */}
              <div className="flex gap-3">
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
              </div>

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

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-sm shadow-md">
                    ✨
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

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
