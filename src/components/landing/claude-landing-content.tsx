'use client'

import React, { useState, useEffect } from 'react'
import Script from 'next/script'
import { motion } from 'framer-motion'
import type { Course } from '@/config/courses'
import { siteConfig } from '@/config/site'
import { ExitIntentPopup } from '@/components/landing/exit-intent-popup'
import { EnrollmentToast } from '@/components/landing/enrollment-toast'
import { AskTara } from '@/components/chatbot/ask-tara'
import { trackEvent } from '@/components/analytics/meta-pixel'
import { ClaudeRippleGrid } from '@/components/landing/claude-ripple-grid'
import { ClaudeArtifactWindow } from '@/components/landing/claude-artifact-window'

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

type Step = 'form' | 'paying' | 'success'

const MONO = 'var(--font-fira-code), ui-monospace, monospace'
const DISPLAY = 'var(--font-space-grotesk), system-ui, sans-serif'

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const end = value
    const duration = 1500
    const step = Math.ceil(end / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [value])
  return (
    <>
      {count.toLocaleString('en-IN')}
      {suffix}
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// Sprint mockups (three artifact previews for the journey section)
// ─────────────────────────────────────────────────────────────

function DashboardMockup() {
  return (
    <div className="relative rounded-2xl border border-emerald-500/20 bg-black/60 p-4 overflow-hidden">
      <div className="flex items-center gap-1.5 mb-3">
        <span className="w-2 h-2 rounded-full bg-[#ff5f56]" />
        <span className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
        <span className="w-2 h-2 rounded-full bg-[#27c93f]" />
        <span className="ml-auto text-[9px] tracking-wider text-gray-600" style={{ fontFamily: MONO }}>
          long_context.xml
        </span>
      </div>
      <div className="space-y-2 text-[10px] leading-relaxed" style={{ fontFamily: MONO }}>
        <div className="text-emerald-400/90">&lt;instructions&gt;</div>
        <div className="pl-4 text-gray-400">You are a senior strategist.</div>
        <div className="pl-4 text-gray-400">Tone: precise, no fluff.</div>
        <div className="text-emerald-400/90">&lt;/instructions&gt;</div>
        <div className="text-emerald-400/90">&lt;context&gt;</div>
        <div className="pl-4 text-gray-500">200K tokens of market data…</div>
        <div className="text-emerald-400/90">&lt;/context&gt;</div>
      </div>
    </div>
  )
}

function CalculatorMockup() {
  return (
    <div className="relative rounded-2xl border border-emerald-500/25 bg-black/60 p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] tracking-widest text-emerald-300/80 uppercase" style={{ fontFamily: MONO }}>
          artifact · live
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      </div>
      <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 mb-2 text-right">
        <div className="text-[10px] text-emerald-300/70">EMI</div>
        <div className="text-lg font-semibold text-white" style={{ fontFamily: DISPLAY }}>
          ₹42,180
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {['7', '8', '9', '4', '5', '6', '1', '2', '3'].map((k) => (
          <div
            key={k}
            className="aspect-square rounded-md bg-white/[0.03] border border-white/5 flex items-center justify-center text-xs text-gray-300"
          >
            {k}
          </div>
        ))}
      </div>
    </div>
  )
}

function ReportMockup() {
  return (
    <div className="relative rounded-2xl border border-emerald-500/25 bg-black/60 p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="h-2 w-20 rounded-full bg-emerald-500/70" />
        <span className="text-[9px] text-gray-500" style={{ fontFamily: MONO }}>
          automated_report.pdf
        </span>
      </div>
      <div className="space-y-2">
        <div className="h-1.5 w-full rounded bg-white/10" />
        <div className="h-1.5 w-5/6 rounded bg-white/10" />
        <div className="h-1.5 w-4/6 rounded bg-white/10" />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {[55, 80, 35].map((h, i) => (
          <div key={i} className="rounded-md bg-emerald-500/10 border border-emerald-500/20 h-12 flex items-end p-1">
            <div
              className="w-full rounded-sm bg-emerald-500/70"
              style={{ height: `${h}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[9px] tracking-widest text-emerald-400/80 uppercase" style={{ fontFamily: MONO }}>
        <span className="w-1 h-1 rounded-full bg-emerald-400" />
        dispatched via api
      </div>
    </div>
  )
}

const SPRINTS = [
  {
    days: 'Days 1 — 5',
    title: 'The Linguistic Master',
    tag: 'SPRINT 01',
    subtitle: 'XML Tagging · Tone · Long-Context Reasoning',
    body:
      'Build the foundation. Master how Claude reads structure — XML tags, system prompts, 200K-token context windows — so every output lands on intent.',
    bullets: [
      'CRISP framework applied to XML-structured prompts',
      'Tone, persona, and constitutional constraints',
      'Long-context research over books, codebases, and PDFs',
    ],
    mockup: <DashboardMockup />,
  },
  {
    days: 'Days 6 — 10',
    title: 'The Artifact Engineer',
    tag: 'SPRINT 02',
    subtitle: 'React Components · Dashboards · Interactive Tools',
    body:
      'Turn prompts into products. Use Claude Artifacts to ship React components, live dashboards, and interactive calculators — with zero local setup.',
    bullets: [
      'Build a real working dashboard in Artifacts',
      'Ship a live EMI / pricing calculator to a client',
      'Iterate on interactive tools with multi-turn critique',
    ],
    mockup: <CalculatorMockup />,
  },
  {
    days: 'Days 11 — 15',
    title: 'The Automation Strategist',
    tag: 'SPRINT 03',
    subtitle: 'Claude API · Cowork · Computer Use',
    body:
      'Wire Claude into the world. Hit the API, let Cowork run tasks autonomously, and orchestrate end-to-end workflows that run while you sleep.',
    bullets: [
      'Claude API fundamentals — calls, streaming, tools',
      'Cowork & Dispatch for autonomous task execution',
      'Capstone: a full-stack agent for a real business problem',
    ],
    mockup: <ReportMockup />,
  },
]

// ─────────────────────────────────────────────────────────────
// Prompt improver (kept from shared template — high conversion)
// ─────────────────────────────────────────────────────────────

const examplePrompts = [
  'Write me an email asking for a raise',
  'Help me prepare for a job interview',
  'Create a social media post for my shop',
  'Explain machine learning simply',
  'Write a resume summary for me',
]

function PromptImproverSection() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [tried, setTried] = useState(false)

  async function handleImprove() {
    if (!input.trim() || input.trim().length < 5) return
    setLoading(true)
    setResult('')
    try {
      const res = await fetch('/api/prompt-improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      })
      const data = await res.json()
      if (res.ok) {
        setResult(data.result)
        setTried(true)
      } else setResult('Something went wrong. Try again.')
    } catch {
      setResult('Network error. Try again.')
    }
    setLoading(false)
  }

  return (
    <section className="py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0b1224] to-[#020617]" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[150px]"
        style={{ background: 'rgba(16,185,129,0.08)' }}
      />
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/25 text-xs font-semibold text-emerald-300 mb-4">
            <span className="text-base">⚡</span> LIVE DEMO — Try it now, no signup
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white" style={{ fontFamily: DISPLAY }}>
            Your Prompts Are{' '}
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Weak</span>
          </h2>
          <p className="text-gray-400 mt-3 text-sm md:text-base">
            Paste any prompt. Watch it transform using the CRISP framework you&apos;ll master in this course.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm"
        >
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs text-gray-500">Try:</span>
            {examplePrompts.map((ex) => (
              <button
                key={ex}
                onClick={() => setInput(ex)}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:border-emerald-400/30 hover:text-emerald-300 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleImprove()
            }}
            placeholder="Type your prompt here..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-[#020617] border border-white/10 text-white placeholder-gray-600 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/30 transition-all resize-none text-sm"
          />

          <button
            onClick={handleImprove}
            disabled={loading || input.trim().length < 5}
            className="group w-full mt-3 py-3 rounded-xl font-semibold text-sm text-black relative overflow-hidden disabled:opacity-40"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center justify-center gap-2">
              {loading ? 'AI is rewriting...' : '⚡ Improve My Prompt'}
            </span>
          </button>

          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
              <div className="mb-3">
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold uppercase">Before</span>
                <div className="mt-2 px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/10 text-sm text-gray-400 italic">
                  &ldquo;{input}&rdquo;
                </div>
              </div>
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                  After — CRISP Framework
                </span>
                <div className="mt-2 px-4 py-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {result}
                </div>
              </div>
              <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-white/10 text-center">
                <p className="text-white font-semibold text-sm">
                  That took 5 seconds. Imagine what you&apos;ll do after{' '}
                  <span className="text-emerald-400">15 days of training.</span>
                </p>
                <a
                  href="#enroll"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="inline-block mt-3 px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-sm hover:scale-105 transition-transform"
                >
                  Start Learning →
                </a>
              </div>
            </motion.div>
          )}

          {!tried && !loading && !result && (
            <p className="text-center text-xs text-gray-600 mt-3">Free. No signup. See the difference instantly.</p>
          )}
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

export function ClaudeLandingContent({ course }: { course: Course }) {
  const [step, setStep] = useState<Step>('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [paymentId, setPaymentId] = useState('')

  async function handleEnroll(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email) {
      setError('Name and email are required.')
      return
    }
    setLoading(true)
    setError('')
    trackEvent('Lead', { content_name: course.title, content_category: 'course', value: course.price, currency: 'INR' })
    trackEvent('InitiateCheckout', { content_name: course.title, value: course.price, currency: 'INR' })
    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          courseSlug: course.slug,
          courseTitle: course.title,
          amount: course.price,
        }),
      })
      if (!res.ok) throw new Error('Failed to create order')
      const data = await res.json()
      setStep('paying')
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: siteConfig.name,
        description: course.title,
        order_id: data.orderId,
        prefill: { name, email, contact: phone },
        theme: { color: '#059669' },
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              courseSlug: course.slug,
              courseTitle: course.title,
              studentName: name,
              studentEmail: email,
              studentPhone: phone,
              amount: course.price,
            }),
          })
          if (verifyRes.ok) {
            const d = await verifyRes.json()
            setPaymentId(d.paymentId)
            setStep('success')
            trackEvent('Purchase', { content_name: course.title, value: course.price, currency: 'INR' })
          } else {
            setError('Payment verification failed. Contact us on WhatsApp.')
            setStep('form')
          }
        },
        modal: {
          ondismiss: () => {
            setStep('form')
            setLoading(false)
          },
        },
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch {
      setError('Something went wrong. Please try again.')
      setStep('form')
    }
    setLoading(false)
  }

  const savings = (course.originalPrice || 0) - course.price
  const discount = course.originalPrice ? Math.round((savings / course.originalPrice) * 100) : 0

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="min-h-screen bg-[#030507] text-white overflow-hidden">
        {/* ═══════════ HERO — Artifact Workspace ═══════════ */}
        <section className="relative min-h-[94vh] flex items-center overflow-hidden">
          {/* Ripple grid background (full section) */}
          <div className="absolute inset-0">
            <ClaudeRippleGrid className="w-full h-full" />
          </div>

          {/* Ambient orbs for depth */}
          <div
            aria-hidden
            className="absolute -top-40 -left-32 w-[640px] h-[640px] rounded-full blur-[160px] opacity-80 pointer-events-none"
            style={{ background: 'rgba(16,185,129,0.18)' }}
          />
          <div
            aria-hidden
            className="absolute -bottom-40 -right-24 w-[520px] h-[520px] rounded-full blur-[140px] opacity-70 pointer-events-none"
            style={{ background: 'rgba(5,150,105,0.14)' }}
          />

          {/* Subtle vertical divider between copy + artifact (desktop only) */}
          <div
            aria-hidden
            className="hidden md:block absolute left-1/2 top-[12%] bottom-[12%] w-px bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent pointer-events-none"
          />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
            {/*
              Mobile: flex column with explicit ordering — headline block,
              then the Artifact Window (above the fold), then subtitle +
              stats + CTAs. Desktop (lg+): 2-col grid where the artifact
              spans both rows in the right column and the copy fills the
              left column top-to-bottom.
            */}
            <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:gap-y-6 lg:items-center">
              {/* HEAD — logo + label + headline */}
              <div className="order-1 lg:order-none lg:col-start-1 lg:row-start-1 lg:self-end">
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 sm:mb-8"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/logo-tarahut-white.png"
                    alt="TARAhut AI Labs"
                    className="h-7 sm:h-9 w-auto"
                  />
                </motion.div>

                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold tracking-[0.2em] text-emerald-400"
                  style={{ fontFamily: MONO }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  THE SOPHISTICATED ARCHITECT
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-4 sm:mt-5 text-4xl sm:text-5xl lg:text-[5.5rem] font-bold leading-[1.02] tracking-tight text-white"
                  style={{ fontFamily: DISPLAY }}
                >
                  Master{' '}
                  <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    Claude
                  </span>
                  <br />
                  in 15 Days.
                </motion.h1>
              </div>

              {/* ARTIFACT — above the fold on mobile, spans both rows on desktop */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="order-2 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center relative flex justify-center lg:justify-end"
              >
                <ClaudeArtifactWindow />
              </motion.div>

              {/* BODY — subtitle + stats + CTAs */}
              <div className="order-3 lg:order-none lg:col-start-1 lg:row-start-2 lg:self-start">
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-base sm:text-lg text-gray-300/90 max-w-xl leading-relaxed"
                >
                  Go beyond basic chat. Master <span className="text-white">Long-Context</span>,{' '}
                  <span className="text-white">XML Tagging</span>, and the 2026{' '}
                  <span className="text-white">Artifacts</span> workflow to build full-stack tools with zero code.
                </motion.p>

                {/* Stats strip */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 sm:mt-8 grid grid-cols-3 gap-2.5 sm:gap-3 max-w-lg"
                >
                  {[
                    { value: 200, suffix: 'M+', label: 'Claude Users' },
                    { value: 200, suffix: 'K', label: 'Token Context' },
                    { value: 15, suffix: '', label: 'Days to Master' },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm px-2.5 sm:px-3 py-3 text-center"
                    >
                      <div
                        className="text-lg sm:text-2xl font-bold bg-gradient-to-b from-emerald-300 to-teal-500 bg-clip-text text-transparent"
                        style={{ fontFamily: DISPLAY }}
                      >
                        <AnimatedNumber value={s.value} suffix={s.suffix} />
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5 tracking-wide">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </motion.div>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:items-center"
                >
                  <a
                    href="#enroll"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full font-bold text-base text-black overflow-hidden shadow-[0_10px_40px_rgba(16,185,129,0.35)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400" />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative">Join the Cohort</span>
                    <svg
                      className="relative w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>

                  <a
                    href="#sprints"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById('sprints')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-4 rounded-full border border-white/15 text-base sm:text-sm font-semibold text-gray-200 hover:border-emerald-400/40 hover:text-emerald-300 transition-colors"
                  >
                    See Artifact Demos
                  </a>

                  {course.originalPrice && (
                    <span className="inline-flex items-center gap-2 text-xs text-gray-500">
                      <span className="line-through">₹{course.originalPrice.toLocaleString('en-IN')}</span>
                      <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-300 font-bold">
                        {discount}% OFF
                      </span>
                    </span>
                  )}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </section>

        {/* ═══════════ THE 15-DAY ARCHITECT JOURNEY ═══════════ */}
        <section id="sprints" className="relative py-20 md:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-[#030507] via-[#050d16] to-[#030507]" />
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16 md:mb-20"
            >
              <span
                className="text-emerald-400 text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase"
                style={{ fontFamily: MONO }}
              >
                THE ARCHITECT JOURNEY
              </span>
              <h2
                className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.1]"
                style={{ fontFamily: DISPLAY }}
              >
                15 Days. <span className="text-gray-500">3 Sprints.</span>
                <br />
                One Sophisticated Operator.
              </h2>
              <p className="mt-4 text-sm md:text-base text-gray-400 max-w-xl mx-auto">
                Every day compounds. Every sprint unlocks a new capability. You leave ready to ship.
              </p>
            </motion.div>

            <div className="space-y-16 md:space-y-24">
              {SPRINTS.map((sprint, i) => (
                <motion.div
                  key={sprint.tag}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6 }}
                  className={`grid md:grid-cols-5 gap-8 md:gap-12 items-center ${
                    i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''
                  }`}
                >
                  {/* Copy */}
                  <div className="md:col-span-3">
                    <div
                      className="text-[10px] sm:text-[11px] font-bold tracking-[0.3em] text-emerald-400/90"
                      style={{ fontFamily: MONO }}
                    >
                      {sprint.tag} · {sprint.days}
                    </div>
                    <h3
                      className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight"
                      style={{ fontFamily: DISPLAY }}
                    >
                      {sprint.title}
                    </h3>
                    <p className="mt-2 text-sm md:text-base text-emerald-300/90">{sprint.subtitle}</p>
                    <p className="mt-4 text-sm md:text-base text-gray-400 leading-relaxed max-w-xl">{sprint.body}</p>
                    <ul className="mt-5 space-y-2.5">
                      {sprint.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-sm text-gray-300">
                          <span
                            aria-hidden
                            className="mt-[7px] w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"
                          />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Mockup */}
                  <div className="md:col-span-2 relative">
                    <div
                      aria-hidden
                      className="absolute -inset-6 rounded-3xl blur-3xl opacity-60"
                      style={{
                        background:
                          'radial-gradient(ellipse at center, rgba(16,185,129,0.22), rgba(16,185,129,0) 70%)',
                      }}
                    />
                    <div className="relative">{sprint.mockup}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ LIVE DEMO ═══════════ */}
        <PromptImproverSection />

        {/* ═══════════ WHAT YOU'LL WALK AWAY WITH ═══════════ */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-[#030507]" />
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-emerald-400 text-[11px] font-bold tracking-[0.25em] uppercase" style={{ fontFamily: MONO }}>
                15 DAYS FROM NOW
              </span>
              <h2
                className="text-3xl md:text-4xl font-bold text-white mt-3"
                style={{ fontFamily: DISPLAY }}
              >
                What You&apos;ll Walk Away With
              </h2>
              <p className="text-gray-400 text-sm mt-3 max-w-xl mx-auto">
                Concrete skills and artifacts — not just a completion certificate.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
              {[
                {
                  icon: '🧠',
                  title: 'CRISP Mastery',
                  text: 'The 5-part prompt framework used to get 10x better outputs than beginners.',
                },
                {
                  icon: '📦',
                  title: '10+ Real Artifacts',
                  text: 'Working dashboards, tools, and React components you can show clients.',
                },
                {
                  icon: '🔧',
                  title: 'Full Claude Toolkit',
                  text: 'Chat, Projects, Artifacts, Cowork, and the API — every feature, real use.',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-emerald-400/30 transition-all"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="text-white font-bold text-base mb-2" style={{ fontFamily: DISPLAY }}>
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ ENROLLMENT ═══════════ */}
        <section id="enroll" className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#030507] via-[#061024] to-[#030507]" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px]"
            style={{ background: 'rgba(16,185,129,0.1)' }}
          />

          <div className="relative z-10 max-w-md mx-auto px-4 sm:px-6">
            {step === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 backdrop-blur-md border border-emerald-400/30 rounded-3xl p-8 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🎉</span>
                </div>
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: DISPLAY }}>
                  You&apos;re In!
                </h2>
                <p className="text-gray-400 mt-2 mb-1">Welcome to {course.title}</p>
                <p className="text-xs text-gray-600 mb-6">Payment ID: {paymentId}</p>
                <p className="text-gray-400 text-sm mb-6">
                  We&apos;ll WhatsApp you within 2 hours with batch details.
                </p>
                <a
                  href={`https://wa.me/919200882008?text=${encodeURIComponent(
                    `Hi! I just enrolled in "${course.title}". Payment ID: ${paymentId}. Please share batch details.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
                >
                  Message on WhatsApp →
                </a>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: DISPLAY }}>
                    Start Your Architect Journey
                  </h2>
                  <p className="text-gray-500 mt-2 text-sm">Limited seats per batch</p>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8">
                  <div className="text-center mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-center justify-center gap-3">
                      {course.originalPrice && (
                        <span className="text-xl text-gray-600 line-through">
                          ₹{course.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span
                        className="text-5xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"
                        style={{ fontFamily: DISPLAY }}
                      >
                        ₹{course.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {savings > 0 && (
                      <span className="inline-block mt-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-400/30 text-red-300 text-xs font-bold">
                        🔥 Save ₹{savings.toLocaleString('en-IN')} — {discount}% OFF
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleEnroll} className="space-y-4">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Full Name"
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/30 transition-all"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/30 transition-all"
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="WhatsApp Number"
                      className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/30 transition-all"
                    />

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <button
                      type="submit"
                      disabled={loading || step === 'paying'}
                      className="group w-full py-4 rounded-xl font-bold text-lg text-black relative overflow-hidden disabled:opacity-50"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400" />
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="relative">
                        {loading || step === 'paying'
                          ? '⏳ Processing...'
                          : `Enroll Now — ₹${course.price.toLocaleString('en-IN')}`}
                      </span>
                    </button>
                  </form>

                  <div className="mt-5 flex items-center justify-center gap-3 text-[11px] text-gray-600">
                    <span>🔒 Secure</span>
                    <span>•</span>
                    <span>📜 Certificate</span>
                    <span>•</span>
                    <span>💬 WhatsApp Support</span>
                  </div>

                  <div className="mt-4 text-center">
                    <a
                      href={`https://wa.me/919200882008?text=${encodeURIComponent(
                        `Hi, I have a question about "${course.title}"`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-500 hover:text-emerald-400 transition-colors"
                    >
                      Have questions? Chat with us →
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* ═══════════ FAQ ═══════════ */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-[#050d16]" />
          <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
            <h2
              className="text-2xl font-bold text-white text-center mb-8"
              style={{ fontFamily: DISPLAY }}
            >
              Quick Answers
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { q: 'Any experience needed?', a: 'Nope. Complete beginners welcome.' },
                { q: 'Online or offline?', a: 'Offline in Kotkapura, Punjab.' },
                { q: 'Do I get a certificate?', a: 'Yes. Verified + LinkedIn-shareable.' },
                { q: 'What if I miss a class?', a: 'Recorded sessions + notes provided.' },
              ].map((faq) => (
                <div key={faq.q} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="font-semibold text-white text-sm">{faq.q}</h3>
                  <p className="mt-1 text-gray-400 text-xs">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ FINAL CTA ═══════════ */}
        <section className="py-20 relative text-center">
          <div className="absolute inset-0 bg-[#030507]" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[150px]"
            style={{ background: 'rgba(16,185,129,0.12)' }}
          />
          <div className="relative z-10 px-4">
            <h2
              className="text-3xl md:text-5xl font-bold text-white"
              style={{ fontFamily: DISPLAY }}
            >
              Don&apos;t Think.
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Just Architect.
              </span>
            </h2>
            <p className="mt-4 text-gray-500 text-sm">
              Just launched · Be among the first Master Claude students.
            </p>
            <a
              href="#enroll"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-block mt-8 px-10 py-4 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_10px_40px_rgba(16,185,129,0.35)]"
            >
              Enroll Now →
            </a>
          </div>
        </section>

        <footer className="py-6 pb-24 md:pb-6 border-t border-white/5 text-center">
          <p className="text-xs text-gray-600">
            {siteConfig.name} &middot; {siteConfig.contact.address} &middot; {siteConfig.contact.phone}
          </p>
        </footer>

        {/* Mobile sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#030507]/95 backdrop-blur-md border-t border-white/10 px-4 py-3 flex items-center justify-between">
          <div>
            {course.originalPrice && (
              <span className="text-xs text-gray-600 line-through mr-1">
                ₹{course.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-lg font-bold text-white">₹{course.price.toLocaleString('en-IN')}</span>
          </div>
          <a
            href="#enroll"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-sm"
          >
            Enroll Now
          </a>
        </div>
      </div>

      {/*
        mobileBottomClass="bottom-24" lifts the orb above the mobile sticky
        Enroll CTA bar (~64px tall) so the safe zone stays clear. Desktop
        unaffected — orb stays at md:bottom-6.
      */}
      <AskTara mobileBottomClass="bottom-24" />
      <ExitIntentPopup courseTitle={course.title} courseSlug={course.slug} primaryColor="#10b981" />
      <EnrollmentToast />
    </>
  )
}
