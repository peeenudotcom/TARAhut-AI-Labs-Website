'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function InterviewPrepModal({
  open,
  onClose,
  careerPath,
  identity,
}: {
  open: boolean
  onClose: () => void
  careerPath: string
  identity: string
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  // Focus input when opened
  useEffect(() => {
    if (open && started) {
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [open, started])

  async function sendMessage(text: string) {
    const userMsg: Message = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          careerPath,
          identity,
        }),
      })
      const data = await res.json()
      if (res.ok && data.reply) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }])
      } else {
        setMessages([...newMessages, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
      }
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Network error. Please check your connection and try again.' }])
    }
    setLoading(false)
  }

  function handleStart() {
    setStarted(true)
    setMessages([])
    sendMessage('Start the interview. Ask me my first question.')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return
    sendMessage(input.trim())
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  function handleClose() {
    onClose()
    // Reset after animation
    setTimeout(() => {
      setMessages([])
      setStarted(false)
      setInput('')
    }, 300)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 flex flex-col sm:w-full sm:max-w-lg sm:h-[85vh] rounded-2xl bg-white shadow-2xl border border-[#E2E8F0] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0] bg-gradient-to-r from-[#e53935] to-[#DC2626]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Interview Coach</h3>
                  <p className="text-[10px] text-white/70">{careerPath} preparation</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            {!started ? (
              /* Start screen */
              <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FEF2F2] border border-[#FEE2E2] mb-5">
                  <svg className="h-8 w-8 text-[#e53935]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-2">Ready to Practice?</h3>
                <p className="text-sm text-[#64748B] mb-2 max-w-xs">
                  Your AI interview coach will ask you real questions for <span className="font-semibold text-[#e53935]">{careerPath}</span> roles.
                </p>
                <div className="space-y-2 text-xs text-[#94A3B8] mb-6">
                  <p>You answer. AI gives feedback + a score out of 10.</p>
                  <p>Then the next question. Just like a real interview.</p>
                </div>
                <button
                  onClick={handleStart}
                  className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #e53935, #DC2626)', boxShadow: '0 8px 25px rgba(5,150,105,0.3)' }}
                >
                  Start Mock Interview
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            ) : (
              /* Chat area */
              <>
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex',
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                          msg.role === 'user'
                            ? 'bg-[#e53935] text-white rounded-br-md'
                            : 'bg-[#F1F5F9] text-[#0F172A] rounded-bl-md'
                        )}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-[#F1F5F9] rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#94A3B8] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-2 w-2 rounded-full bg-[#94A3B8] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-2 w-2 rounded-full bg-[#94A3B8] animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input area */}
                <form onSubmit={handleSubmit} className="border-t border-[#E2E8F0] px-4 py-3 bg-white">
                  <div className="flex items-end gap-2">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your answer..."
                      rows={1}
                      className="flex-1 resize-none rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#e53935] focus:outline-none focus:ring-2 focus:ring-[#e53935]/20 max-h-24"
                      style={{ minHeight: 40 }}
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || loading}
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all',
                        input.trim() && !loading
                          ? 'bg-[#e53935] text-white hover:bg-[#DC2626]'
                          : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
                      )}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-1.5 text-[10px] text-[#94A3B8] text-center">Press Enter to send. Shift+Enter for new line.</p>
                </form>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
