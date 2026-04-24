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
import { BuilderBlueprintGrid } from '@/components/landing/builder-blueprint-grid'
import { BuilderExplodedCore } from '@/components/landing/builder-exploded-core'
import { BuilderNeuralTerminal } from '@/components/landing/builder-neural-terminal'

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

type Step = 'form' | 'paying' | 'success'

const MONO = 'var(--font-fira-code), ui-monospace, monospace'
const DISPLAY = 'var(--font-space-grotesk), system-ui, sans-serif'
const BLUE = '#00d4ff'
const BLUE_RGB = '0,212,255'

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const end = value
    const duration = 1200
    const step = Math.max(1, Math.ceil(end / (duration / 16)))
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
// Three production layers (narrative)
// ─────────────────────────────────────────────────────────────

const LAYERS = [
  {
    tag: 'LAYER 01',
    window: 'Month 1 · Weeks 1—4',
    title: 'Tooling Layer',
    subtitle: '20+ AI tools · CRISP prompt engineering · content systems',
    body:
      'Month one is pure tooling. ChatGPT, Claude, Gemini, Perplexity, Canva AI — you stop being a tourist and start being an operator. Every week ends with shipped artifacts.',
    receipts: [
      { k: 'AI tools', v: '20+' },
      { k: 'Prompt templates', v: '30+' },
      { k: 'Brand kits', v: 'Week 4' },
    ],
  },
  {
    tag: 'LAYER 02',
    window: 'Month 2 · Weeks 5—8',
    title: 'Systems Layer',
    subtitle: 'Video · voice · image generation · Zapier + Make automations',
    body:
      'Month two, you compose systems. HeyGen avatars, ElevenLabs voice, Leonardo + Ideogram imagery, then Zapier and Make.com to wire them into end-to-end pipelines that run without you.',
    receipts: [
      { k: 'Portfolio pieces', v: '50+' },
      { k: 'Automation runs', v: '∞' },
      { k: 'Languages', v: 'EN·HI·PA' },
    ],
  },
  {
    tag: 'LAYER 03',
    window: 'Month 3 · Weeks 9—12',
    title: 'Production Layer',
    subtitle: 'Real client build · freelancing launch · capstone deploy',
    body:
      'Month three, you ship to production. Real business, real engagement, real invoice. Fiverr / Upwork / LinkedIn profiles go live. Capstone = a full AI system deployed for an actual client. Graduation on Day 90.',
    receipts: [
      { k: 'Live profiles', v: '3' },
      { k: 'Capstone', v: 'Day 90' },
      { k: 'Earning', v: '₹20–50K/mo*' },
    ],
  },
]

// ─────────────────────────────────────────────────────────────
// Prompt improver — reused, styled with Builder blue accent
// ─────────────────────────────────────────────────────────────

const examplePrompts = [
  'Build a content workflow for a clothing brand',
  'Design a RAG system for legal docs',
  'Automate WhatsApp replies for a clinic',
  'Create an AI pipeline for a real estate agent',
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
      <div className="absolute inset-0 bg-gradient-to-b from-[#030507] via-[#05101c] to-[#030507]" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[150px]"
        style={{ background: `rgba(${BLUE_RGB},0.08)` }}
      />
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold mb-4"
            style={{
              borderColor: `rgba(${BLUE_RGB},0.3)`,
              background: `rgba(${BLUE_RGB},0.1)`,
              color: BLUE,
              fontFamily: MONO,
            }}
          >
            <span>⚡</span> LIVE DEMO — /dev/prompt_rewriter
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white" style={{ fontFamily: DISPLAY }}>
            Your Spec is{' '}
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Underdefined</span>
          </h2>
          <p className="text-gray-400 mt-3 text-sm md:text-base">
            Drop a rough build idea. Watch it compile into a proper system spec using the CRISP framework.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm"
        >
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs text-gray-500" style={{ fontFamily: MONO }}>$ try:</span>
            {examplePrompts.map((ex) => (
              <button
                key={ex}
                onClick={() => setInput(ex)}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-[#00d4ff] hover:border-[#00d4ff]/30 transition-colors"
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
            placeholder="Type your build idea here..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-[#020617] border border-white/10 text-white placeholder-gray-600 focus:border-[#00d4ff] focus:outline-none focus:ring-1 focus:ring-[#00d4ff]/30 transition-all resize-none text-sm"
            style={{ fontFamily: MONO }}
          />

          <button
            onClick={handleImprove}
            disabled={loading || input.trim().length < 5}
            className="group w-full mt-3 py-3 rounded-xl font-semibold text-sm text-black relative overflow-hidden disabled:opacity-40"
            style={{ background: `linear-gradient(90deg, ${BLUE} 0%, #22d3ee 100%)` }}
          >
            <span className="relative flex items-center justify-center gap-2" style={{ fontFamily: MONO }}>
              {loading ? '$ compiling spec...' : '$ compile_spec'}
            </span>
          </button>

          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
              <div className="mb-3">
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold uppercase" style={{ fontFamily: MONO }}>
                  Before
                </span>
                <div className="mt-2 px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/10 text-sm text-gray-400 italic">
                  &ldquo;{input}&rdquo;
                </div>
              </div>
              <div>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                  style={{ background: `rgba(${BLUE_RGB},0.2)`, color: BLUE, fontFamily: MONO }}
                >
                  After — CRISP Spec
                </span>
                <div className="mt-2 px-4 py-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {result}
                </div>
              </div>
              <div
                className="mt-5 p-4 rounded-xl border border-white/10 text-center"
                style={{ background: `linear-gradient(90deg, rgba(${BLUE_RGB},0.1) 0%, rgba(16,185,129,0.1) 100%)` }}
              >
                <p className="text-white font-semibold text-sm">
                  That&apos;s 5 seconds. 90 days builds the operator who writes these on reflex.
                </p>
                <a
                  href="#enroll"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="inline-block mt-3 px-6 py-2 rounded-lg text-black font-bold text-sm hover:scale-105 transition-transform"
                  style={{ background: BLUE }}
                >
                  Deploy My Career →
                </a>
              </div>
            </motion.div>
          )}

          {!tried && !loading && !result && (
            <p className="text-center text-xs text-gray-600 mt-3" style={{ fontFamily: MONO }}>
              # free · no signup · see the diff
            </p>
          )}
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

export function BuilderLandingContent({ course }: { course: Course }) {
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
        theme: { color: BLUE },
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

      <div className="min-h-screen bg-[#030507] text-white overflow-hidden relative">
        {/* ═══════════ HERO — Blueprint + Exploded Core ═══════════ */}
        <section className="relative min-h-[94vh] flex items-center overflow-hidden">
          {/* Blueprint grid — fixed perspective floor */}
          <BuilderBlueprintGrid className="absolute inset-0 overflow-hidden" />

          {/* Ambient orbs */}
          <div
            aria-hidden
            className="absolute -top-40 -left-24 w-[560px] h-[560px] rounded-full blur-[160px] opacity-70 pointer-events-none"
            style={{ background: `rgba(${BLUE_RGB},0.12)` }}
          />
          <div
            aria-hidden
            className="absolute -bottom-40 -right-20 w-[520px] h-[520px] rounded-full blur-[140px] opacity-70 pointer-events-none"
            style={{ background: 'rgba(16,185,129,0.16)' }}
          />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
            <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:gap-y-6 lg:items-center">
              {/* HEAD */}
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
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] sm:text-xs font-bold tracking-[0.22em]"
                  style={{
                    fontFamily: MONO,
                    color: BLUE,
                    borderColor: `rgba(${BLUE_RGB},0.35)`,
                    background: `rgba(${BLUE_RGB},0.06)`,
                    textShadow: `0 0 14px rgba(${BLUE_RGB},0.4)`,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: BLUE }} />
                  SYSTEMS ARCHITECT TIER
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-4 sm:mt-5 text-4xl sm:text-5xl lg:text-[5rem] font-bold leading-[1.02] tracking-tight text-white"
                  style={{ fontFamily: DISPLAY }}
                >
                  Stop Talking.
                  <br />
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(90deg, ${BLUE} 0%, #10b981 100%)` }}
                  >
                    Start Deploying.
                  </span>
                </motion.h1>
              </div>

              {/* EXPLODED CORE — above fold on mobile, right column on desktop */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="order-2 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center relative flex justify-center lg:justify-end"
              >
                <BuilderExplodedCore />
              </motion.div>

              {/* BODY */}
              <div className="order-3 lg:order-none lg:col-start-1 lg:row-start-2 lg:self-start">
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-base sm:text-lg text-gray-300/90 max-w-xl leading-relaxed"
                >
                  The <span className="text-white">Master Architect program</span>. Build custom agents, no-code apps, and
                  RAG-powered systems for real businesses — <span className="text-white">90 days</span>, 20+ tools, 50+ portfolio artifacts,
                  one capstone deploy.
                </motion.p>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 sm:mt-8 grid grid-cols-3 gap-2.5 sm:gap-3 max-w-lg"
                >
                  {[
                    { value: 90, suffix: '', label: 'Day Build' },
                    { value: 20, suffix: '+', label: 'AI Tools' },
                    { value: 50, suffix: '+', label: 'Artifacts' },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl border backdrop-blur-sm px-2.5 sm:px-3 py-3 text-center"
                      style={{
                        borderColor: `rgba(${BLUE_RGB},0.2)`,
                        background: `rgba(${BLUE_RGB},0.02)`,
                      }}
                    >
                      <div
                        className="text-lg sm:text-2xl font-bold tabular-nums"
                        style={{ fontFamily: DISPLAY, color: BLUE }}
                      >
                        <AnimatedNumber value={s.value} suffix={s.suffix} />
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5 tracking-wide">{s.label}</div>
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
                    className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full font-black text-base text-black overflow-hidden hover:scale-[1.02] transition-transform"
                    style={{
                      background: 'white',
                      boxShadow: `0 10px 44px rgba(${BLUE_RGB},0.3)`,
                    }}
                  >
                    <span className="relative tracking-wide" style={{ fontFamily: MONO }}>DEPLOY MY CAREER</span>
                    <svg
                      className="relative w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>

                  <a
                    href="#layers"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById('layers')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-4 rounded-full border text-base sm:text-sm font-semibold text-gray-200 transition-colors"
                    style={{
                      borderColor: 'rgba(255,255,255,0.18)',
                      fontFamily: MONO,
                    }}
                  >
                    $ view_blueprint
                  </a>

                  {course.originalPrice && (
                    <span className="inline-flex items-center gap-2 text-xs text-gray-500">
                      <span className="line-through">₹{course.originalPrice.toLocaleString('en-IN')}</span>
                      <span
                        className="px-2 py-0.5 rounded-full font-bold"
                        style={{ background: `rgba(${BLUE_RGB},0.18)`, color: BLUE }}
                      >
                        {discount}% OFF
                      </span>
                    </span>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ NEURAL TERMINAL — the "speaking dev's language" moment ═══════════ */}
        <section className="relative py-16 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-[#030507] via-[#05101c] to-[#030507]" />
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <span
                className="text-[11px] font-bold tracking-[0.28em] uppercase"
                style={{ fontFamily: MONO, color: BLUE }}
              >
                $ neural_terminal
              </span>
              <h2
                className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-[1.1]"
                style={{ fontFamily: DISPLAY }}
              >
                You won&apos;t just <em className="not-italic" style={{ color: BLUE }}>use</em> agents.
                <br className="hidden sm:inline" /> You&apos;ll deploy them.
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <BuilderNeuralTerminal />
            </motion.div>
          </div>
        </section>

        {/* ═══════════ THE 3 LAYERS ═══════════ */}
        <section id="layers" className="relative py-20 md:py-28">
          <div className="absolute inset-0 bg-[#030507]" />
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14 md:mb-20"
            >
              <span
                className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase"
                style={{ fontFamily: MONO, color: BLUE }}
              >
                THE 90-DAY BLUEPRINT
              </span>
              <h2
                className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.1]"
                style={{ fontFamily: DISPLAY }}
              >
                90 Days. <span className="text-gray-500">3 Layers.</span>
                <br />
                One Production System.
              </h2>
              <p className="mt-4 text-sm md:text-base text-gray-400 max-w-xl mx-auto">
                Every layer ships before the next one starts. No layer is theory — each one ends with
                artifacts on your laptop.
              </p>
            </motion.div>

            <div className="space-y-10 md:space-y-16">
              {LAYERS.map((layer) => (
                <motion.div
                  key={layer.tag}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.55 }}
                  className="relative grid md:grid-cols-5 gap-6 md:gap-10 p-6 md:p-8 rounded-2xl border bg-white/[0.02] hover:border-[#00d4ff]/30 transition-colors"
                  style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                >
                  {/* Tag + body */}
                  <div className="md:col-span-3">
                    <div
                      className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-bold tracking-[0.28em]"
                      style={{ fontFamily: MONO, color: BLUE }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: BLUE }} />
                      {layer.tag} · {layer.window}
                    </div>
                    <h3
                      className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight"
                      style={{ fontFamily: DISPLAY }}
                    >
                      {layer.title}
                    </h3>
                    <p className="mt-2 text-sm md:text-base text-emerald-300/90">{layer.subtitle}</p>
                    <p className="mt-4 text-sm md:text-base text-gray-400 leading-relaxed max-w-2xl">
                      {layer.body}
                    </p>
                  </div>

                  {/* Receipts */}
                  <div className="md:col-span-2 grid grid-cols-3 gap-2">
                    {layer.receipts.map((r) => (
                      <div
                        key={r.k}
                        className="rounded-lg border px-2 py-3 text-center"
                        style={{
                          borderColor: `rgba(${BLUE_RGB},0.2)`,
                          background: `rgba(${BLUE_RGB},0.03)`,
                        }}
                      >
                        <div
                          className="text-sm sm:text-base font-bold"
                          style={{ fontFamily: DISPLAY, color: BLUE }}
                        >
                          {r.v}
                        </div>
                        <div className="mt-1 text-[9px] tracking-wider uppercase text-gray-500" style={{ fontFamily: MONO }}>
                          {r.k}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <PromptImproverSection />

        {/* ═══════════ WHAT YOU SHIP ═══════════ */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-[#030507]" />
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase" style={{ fontFamily: MONO, color: BLUE }}>
                DAY 90 · OUTPUTS
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3" style={{ fontFamily: DISPLAY }}>
                What you ship
              </h2>
              <p className="text-gray-400 text-sm mt-3 max-w-xl mx-auto">
                No &ldquo;completion certificate&rdquo; language. Only artifacts that live somewhere a client can click.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
              {[
                {
                  icon: '🧩',
                  title: '50+ Portfolio Artifacts',
                  text: 'Content, designs, videos, voiceovers, automations — each one deployable and screenshot-ready.',
                },
                {
                  icon: '🚀',
                  title: 'Live Freelancing Profiles',
                  text: 'Fiverr + Upwork + LinkedIn active with service packages priced ₹5K, ₹10K, ₹25K/mo.',
                },
                {
                  icon: '🏗️',
                  title: 'Capstone Production System',
                  text: 'An end-to-end AI solution deployed for a real business. Invoice, not homework.',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border transition-all"
                  style={{
                    borderColor: 'rgba(255,255,255,0.08)',
                  }}
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

        {/* ═══════════ ENROLL ═══════════ */}
        <section id="enroll" className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#030507] via-[#05101c] to-[#030507]" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px]"
            style={{ background: `rgba(${BLUE_RGB},0.08)` }}
          />

          <div className="relative z-10 max-w-md mx-auto px-4 sm:px-6">
            {step === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 backdrop-blur-md border rounded-3xl p-8 text-center"
                style={{ borderColor: `rgba(${BLUE_RGB},0.3)` }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: `rgba(${BLUE_RGB},0.2)` }}
                >
                  <span className="text-4xl">🚀</span>
                </div>
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: DISPLAY }}>
                  Deployed.
                </h2>
                <p className="text-gray-400 mt-2 mb-1">Welcome to {course.title}</p>
                <p className="text-xs text-gray-600 mb-6" style={{ fontFamily: MONO }}>
                  payment_id: {paymentId}
                </p>
                <p className="text-gray-400 text-sm mb-6">We&apos;ll WhatsApp you within 2 hours with batch details.</p>
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
                    Commission Your Seat
                  </h2>
                  <p className="text-gray-500 mt-2 text-sm" style={{ fontFamily: MONO }}>
                    # cohort_capacity_limited
                  </p>
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
                        className="text-5xl font-extrabold"
                        style={{
                          fontFamily: DISPLAY,
                          background: `linear-gradient(90deg, ${BLUE}, #10b981)`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        ₹{course.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {savings > 0 && (
                      <span
                        className="inline-block mt-3 px-4 py-1.5 rounded-full border text-xs font-bold"
                        style={{
                          background: `linear-gradient(90deg, rgba(${BLUE_RGB},0.2) 0%, rgba(239,68,68,0.2) 100%)`,
                          borderColor: `rgba(${BLUE_RGB},0.3)`,
                          color: BLUE,
                        }}
                      >
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
                      className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-[#00d4ff] focus:outline-none focus:ring-1 focus:ring-[#00d4ff]/30 transition-all"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-[#00d4ff] focus:outline-none focus:ring-1 focus:ring-[#00d4ff]/30 transition-all"
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="WhatsApp Number"
                      className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-[#00d4ff] focus:outline-none focus:ring-1 focus:ring-[#00d4ff]/30 transition-all"
                    />

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <button
                      type="submit"
                      disabled={loading || step === 'paying'}
                      className="w-full py-4 rounded-xl font-black text-lg text-black relative overflow-hidden disabled:opacity-50 hover:scale-[1.01] transition-transform"
                      style={{
                        background: 'white',
                        boxShadow: `0 8px 30px rgba(${BLUE_RGB},0.35)`,
                        fontFamily: MONO,
                      }}
                    >
                      {loading || step === 'paying'
                        ? '$ processing...'
                        : `DEPLOY — ₹${course.price.toLocaleString('en-IN')}`}
                    </button>
                  </form>

                  <div className="mt-5 flex items-center justify-center gap-3 text-[11px] text-gray-600" style={{ fontFamily: MONO }}>
                    <span>🔒 secure</span>
                    <span>·</span>
                    <span>📜 cert</span>
                    <span>·</span>
                    <span>💬 wa_support</span>
                  </div>

                  <div className="mt-4 text-center">
                    <a
                      href={`https://wa.me/919200882008?text=${encodeURIComponent(`Hi, I have a question about "${course.title}"`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-500 hover:text-[#00d4ff] transition-colors"
                    >
                      $ ask_question →
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* ═══════════ FAQ ═══════════ */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-[#060a12]" />
          <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-white text-center mb-8" style={{ fontFamily: DISPLAY }}>
              Quick Answers
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { q: 'Do I need to code?', a: 'No. Every system is built no-code. Zapier, Make, AI tools.' },
                { q: 'Online or offline?', a: 'Offline in Kotkapura, Punjab. Hands-on labs.' },
                { q: 'Is 90 days really needed?', a: 'For portfolio depth + capstone deploy — yes.' },
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
            style={{ background: `rgba(${BLUE_RGB},0.12)` }}
          />
          <div className="relative z-10 px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white" style={{ fontFamily: DISPLAY }}>
              Ship Something
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(90deg, ${BLUE}, #10b981)` }}
              >
                You Can Point At.
              </span>
            </h2>
            <p className="mt-4 text-gray-500 text-sm" style={{ fontFamily: MONO }}>
              # 90_days · # capstone_deploy · # real_business
            </p>
            <a
              href="#enroll"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-block mt-8 px-10 py-4 rounded-full text-black font-black text-lg hover:scale-105 transition-transform"
              style={{
                background: 'white',
                boxShadow: `0 10px 40px rgba(${BLUE_RGB},0.35)`,
                fontFamily: MONO,
              }}
            >
              DEPLOY MY CAREER →
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
            className="px-6 py-2.5 rounded-full text-black font-bold text-sm"
            style={{ background: 'white', fontFamily: MONO }}
          >
            Deploy
          </a>
        </div>
      </div>

      <AskTara />
      <ExitIntentPopup courseTitle={course.title} courseSlug={course.slug} primaryColor={BLUE} />
      <EnrollmentToast />
    </>
  )
}
