'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { motion } from 'framer-motion'
import type { Course } from '@/config/courses'
import { siteConfig } from '@/config/site'
import { ExitIntentPopup } from '@/components/landing/exit-intent-popup'
import { EnrollmentToast } from '@/components/landing/enrollment-toast'
import { AskTara } from '@/components/chatbot/ask-tara'
import { trackEvent } from '@/components/analytics/meta-pixel'

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type Step = 'form' | 'paying' | 'success'

const ALCHEMIST_STYLES = `
  .alchemist-cursor {
    display: inline-block;
    width: 2px;
    height: 1em;
    background: #10b981;
    margin-left: 2px;
    vertical-align: text-bottom;
    animation: alchemist-blink 0.8s infinite;
  }
  @keyframes alchemist-blink { 50% { opacity: 0; } }
  .alchemist-highlight {
    color: #10b981;
    font-weight: 700;
    text-shadow: 0 0 12px rgba(16, 185, 129, 0.5);
  }
  .alchemist-sys {
    color: #94a3b8;
    font-weight: 600;
  }
  .alchemist-doc-grid {
    background-image: radial-gradient(rgba(226, 232, 240, 0.06) 1px, transparent 1px);
    background-size: 20px 20px;
  }
`

const PROMPT_STAGES = [
  `Write a marketing email for a gym.`,
  `Write a <span class="alchemist-highlight">persuasive</span> marketing email for a <span class="alchemist-highlight">Punjab-based</span> premium gym targeting <span class="alchemist-highlight">busy professionals</span>.`,
  `<span class="alchemist-sys">[Role]</span> Expert copywriter.\n<span class="alchemist-sys">[Framework]</span> PAS (Problem-Agitate-Solve).\n<span class="alchemist-sys">[Task]</span> 200-word <span class="alchemist-highlight">high-conversion</span> email for a <span class="alchemist-highlight">Ludhiana premium gym</span> targeting <span class="alchemist-highlight">busy professionals 28–40</span>.\n<span class="alchemist-sys">[Constraints]</span> One CTA. No fluff.`,
]

function PromptAlchemist() {
  const [stage, setStage] = useState(0)
  const [showTags, setShowTags] = useState(false)
  const textRef = useRef<HTMLSpanElement>(null)
  const timeoutsRef = useRef<number[]>([])

  useEffect(() => {
    const text = PROMPT_STAGES[stage]
    const el = textRef.current
    if (!el) return

    el.innerHTML = ''
    let i = 0

    const type = () => {
      if (!textRef.current) return
      if (i >= text.length) {
        if (stage + 1 < PROMPT_STAGES.length) {
          const t = window.setTimeout(() => setStage(stage + 1), 1800)
          timeoutsRef.current.push(t)
        } else {
          const t = window.setTimeout(() => setShowTags(true), 500)
          timeoutsRef.current.push(t)
        }
        return
      }
      if (text[i] === '<') {
        const end = text.indexOf('>', i)
        if (end === -1) { i++; type(); return }
        textRef.current.innerHTML += text.substring(i, end + 1)
        i = end + 1
        type()
      } else {
        textRef.current.innerHTML += text[i] === '\n' ? '<br/>' : text[i]
        i++
        const t = window.setTimeout(type, 22)
        timeoutsRef.current.push(t)
      }
    }

    const start = window.setTimeout(type, stage === 0 ? 600 : 200)
    timeoutsRef.current.push(start)

    return () => {
      timeoutsRef.current.forEach((t) => window.clearTimeout(t))
      timeoutsRef.current = []
    }
  }, [stage])

  return (
    <div className="w-full max-w-4xl relative">
      <div className="rounded-[32px] border border-emerald-500/20 bg-gradient-to-br from-white/[0.02] via-emerald-500/[0.04] to-white/[0.01] backdrop-blur-xl p-1 md:p-2 shadow-[0_0_60px_rgba(5,150,105,0.12)]">
        <div className="rounded-[28px] bg-black/70 p-6 md:p-10 border border-white/5">
          <div className="flex items-center gap-3 mb-8 opacity-70">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
              Live Prompt Refinement Engine
            </span>
            <span className="ml-auto font-mono text-[10px] text-zinc-600">
              stage {stage + 1}/{PROMPT_STAGES.length}
            </span>
          </div>

          <div className="min-h-[180px] md:min-h-[220px] flex flex-col justify-center">
            <p
              className="text-base md:text-xl leading-relaxed text-zinc-200"
              style={{ fontFamily: 'var(--font-fira-code), ui-monospace, monospace' }}
            >
              <span ref={textRef} />
              <span className="alchemist-cursor" />
            </p>
          </div>

          <div
            className={`mt-8 flex flex-wrap gap-2 transition-opacity duration-700 ${
              showTags ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {['Persona Injection', 'Chain-of-Thought', 'XML Tagging', 'Few-Shot'].map((tag) => (
              <span
                key={tag}
                className="text-[10px] border border-emerald-500/40 bg-emerald-500/5 px-3 py-1.5 rounded text-emerald-400 font-bold uppercase tracking-widest"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StepIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
      {children}
    </div>
  )
}

export function PromptAlchemistLanding({ course }: { course: Course }) {
  const [step, setStep] = useState<Step>('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [paymentId, setPaymentId] = useState('')

  async function handleEnroll(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email) { setError('Name and email are required.'); return }
    setLoading(true)
    setError('')
    trackEvent('Lead', { content_name: course.title, content_category: 'course', value: course.price, currency: 'INR' })
    trackEvent('InitiateCheckout', { content_name: course.title, value: course.price, currency: 'INR' })
    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, courseSlug: course.slug, courseTitle: course.title, amount: course.price }),
      })
      if (!res.ok) throw new Error('Failed to create order')
      const data = await res.json()
      setStep('paying')
      const options = {
        key: data.keyId, amount: data.amount, currency: data.currency,
        name: siteConfig.name, description: course.title, order_id: data.orderId,
        prefill: { name, email, contact: phone }, theme: { color: '#059669' },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...response, courseSlug: course.slug, courseTitle: course.title, studentName: name, studentEmail: email, studentPhone: phone, amount: course.price }),
          })
          if (verifyRes.ok) {
            const d = await verifyRes.json()
            setPaymentId(d.paymentId)
            setStep('success')
            trackEvent('Purchase', { content_name: course.title, value: course.price, currency: 'INR' })
          }
          else { setError('Payment verification failed.'); setStep('form') }
        },
        modal: { ondismiss: () => { setStep('form'); setLoading(false) } },
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch { setError('Something went wrong.'); setStep('form') }
    setLoading(false)
  }

  const savings = (course.originalPrice || 0) - course.price
  const discount = course.originalPrice ? Math.round((savings / course.originalPrice) * 100) : 0
  const freeSessionHref = `/learn/session/1?course=${course.slug}`

  function scrollToEnroll() {
    document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: ALCHEMIST_STYLES }} />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="min-h-screen bg-[#030406] text-white overflow-x-hidden">

        {/* ═══════════ STICKY NAV ═══════════ */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030406]/80 backdrop-blur-md border-b border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <a href="https://tarahutailabs.com" aria-label="TARAhut AI Labs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo-tarahut-white.png" alt="TARAhut AI Labs" className="h-7 sm:h-8 w-auto" />
            </a>
            <button
              onClick={scrollToEnroll}
              className="min-h-12 px-5 sm:px-6 rounded-xl bg-white text-black font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-colors"
            >
              Unlock Vault →
            </button>
          </div>
        </nav>

        {/* ═══════════ HERO — PROMPT ALCHEMIST ═══════════ */}
        <section className="alchemist-doc-grid min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-20 relative">

          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-emerald-500 font-bold tracking-[0.3em] uppercase text-[10px] mb-5"
          >
            Linguistic Intelligence Mastery
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl text-center mb-6 leading-[1.05] font-bold"
            style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
          >
            Master the <span className="text-white">Language</span>
            <br />
            <span className="text-emerald-500 italic">of Machines.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-center max-w-2xl text-base md:text-lg mb-12"
          >
            Go beyond &ldquo;asking.&rdquo; Architect instructions that unlock maximum reasoning —
            on ChatGPT, Claude, Gemini, and beyond.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full flex justify-center"
          >
            <PromptAlchemist />
          </motion.div>

          <p className="mt-6 text-center text-[10px] text-zinc-600 uppercase tracking-widest md:hidden">
            Watch the prompt evolve in real-time.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-12 flex flex-col sm:flex-row gap-4 w-full max-w-md sm:max-w-none sm:w-auto"
          >
            <button
              onClick={scrollToEnroll}
              className="bg-emerald-500 text-black min-h-14 px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-400 transition-colors shadow-[0_0_40px_rgba(5,150,105,0.3)]"
            >
              Unlock the Vault →
            </button>
            <Link
              href={freeSessionHref}
              onClick={() =>
                trackEvent('Lead', {
                  content_name: course.slug,
                  content_category: 'free_session',
                  value: 0,
                  currency: 'INR',
                })
              }
              className="bg-transparent border border-zinc-700 text-zinc-300 min-h-14 px-10 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:border-emerald-500/40 hover:text-white transition-colors text-center flex items-center justify-center"
            >
              Free Demo Session
            </Link>
          </motion.div>

          {course.originalPrice && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="mt-6 text-center"
            >
              <span className="inline-flex items-center gap-2 text-sm text-zinc-500">
                <span className="line-through">₹{course.originalPrice.toLocaleString('en-IN')}</span>
                <span className="text-white font-bold">₹{course.price.toLocaleString('en-IN')}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                  {discount}% OFF
                </span>
              </span>
            </motion.div>
          )}
        </section>

        {/* ═══════════ TRUST BAR ═══════════ */}
        <section className="py-8 border-y border-white/5 bg-black/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <p className="text-center text-[10px] tracking-[0.3em] uppercase text-zinc-600 mb-5">
              Fluent across the frontier models
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 gap-y-4 opacity-60 grayscale">
              {['ChatGPT', 'Claude', 'Gemini', 'Midjourney', 'Perplexity', 'Cursor'].map((m) => (
                <span key={m} className="text-zinc-400 font-bold text-sm sm:text-base tracking-tight">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ PROCESS PATH ═══════════ */}
        <section className="py-16 md:py-24 relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-emerald-500 text-xs font-bold tracking-widest uppercase">The Method</span>
              <h2
                className="text-3xl md:text-4xl font-bold text-white mt-3"
                style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
              >
                From question to instruction.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative">
              <div className="hidden md:block absolute top-7 left-[16%] right-[16%] h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-emerald-500/0" />

              {[
                {
                  num: '01',
                  title: 'Read the Model',
                  desc: 'Learn how tokens, context windows, and temperature actually shape the output.',
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                  ),
                },
                {
                  num: '02',
                  title: 'Architect the Prompt',
                  desc: 'CRISP framework, role injection, XML tags, few-shot — composable building blocks.',
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                    </svg>
                  ),
                },
                {
                  num: '03',
                  title: 'Get Expert Output',
                  desc: 'Consistent, high-signal results. Reusable templates. No more "generic AI" answers.',
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ),
                },
              ].map((s, i) => (
                <motion.div
                  key={s.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative text-center md:text-left"
                >
                  <div className="flex justify-center md:justify-start mb-4">
                    <StepIcon>{s.icon}</StepIcon>
                  </div>
                  <p className="text-xs text-zinc-500 font-mono tracking-wider">{s.num}</p>
                  <h3 className="mt-1 text-xl font-bold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ BENTO GRID ═══════════ */}
        <section className="py-16 md:py-24 relative border-t border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-zinc-400 text-xs font-bold tracking-widest uppercase">The Vault</span>
              <h2
                className="text-3xl md:text-4xl font-bold text-white mt-3"
                style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
              >
                A laboratory for prompts.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-4 md:gap-5 md:h-[520px]">
              {/* Card 1 — big */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="md:col-span-4 md:row-span-1 rounded-3xl p-6 md:p-8 bg-gradient-to-br from-emerald-500/10 via-emerald-500/[0.03] to-transparent border border-emerald-500/20 relative overflow-hidden"
              >
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">CRISP Framework</span>
                <h3
                  className="mt-3 text-2xl md:text-3xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                >
                  Context. Role. Instructions.<br/>Specifics. Parameters.
                </h3>
                <p className="mt-3 text-sm text-zinc-400 max-w-md">
                  The five pieces every expert prompt has. Master them once, apply them forever.
                </p>
              </motion.div>

              {/* Card 2 — tall */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 }}
                className="md:col-span-2 md:row-span-2 rounded-3xl p-6 md:p-8 bg-gradient-to-br from-white/[0.06] to-transparent border border-white/10 relative overflow-hidden flex flex-col"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">Chain-of-Thought</span>
                <h3
                  className="mt-3 text-2xl md:text-3xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                >
                  Make the model<br/>show its work.
                </h3>
                <div className="mt-auto pt-6 space-y-2">
                  {['Step-by-step reasoning', 'Few-shot examples', 'Self-critique loops'].map((x) => (
                    <div key={x} className="flex items-center gap-2 text-sm text-zinc-300">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {x}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="md:col-span-2 md:row-span-1 rounded-3xl p-6 bg-white/[0.03] border border-white/10"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Custom GPTs</span>
                <h3 className="mt-2 text-lg font-bold text-white">Ship your own assistants.</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Specialized AI for one job. Deploy, share, iterate.
                </p>
              </motion.div>

              {/* Card 4 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="md:col-span-2 md:row-span-1 rounded-3xl p-6 bg-white/[0.03] border border-white/10"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">Multi-Modal</span>
                <h3 className="mt-2 text-lg font-bold text-white">Text, image, voice — together.</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Work across modalities in one pipeline.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════ ENROLLMENT ═══════════ */}
        <section id="enroll" className="py-16 md:py-24 relative border-t border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-[#030406] via-[#04221a] to-[#030406]" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px]"
            style={{ background: 'rgba(5,150,105,0.10)' }}
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
                <h2 className="text-2xl font-bold text-white">Vault Unlocked.</h2>
                <p className="text-zinc-400 mt-2 mb-1">Welcome to Prompt Engineering</p>
                <p className="text-xs text-zinc-600 mb-6">Payment ID: {paymentId}</p>
                <p className="text-zinc-400 text-sm mb-6">
                  We&apos;ll WhatsApp you within 2 hours with batch details.
                </p>
                <a
                  href={`https://wa.me/919200882008?text=${encodeURIComponent(`Hi! I just enrolled in Prompt Engineering. Payment ID: ${paymentId}. Please share batch details.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block min-h-12 px-6 py-3 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors"
                >
                  Message on WhatsApp →
                </a>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="text-center mb-8">
                  <h2
                    className="text-3xl md:text-4xl font-bold text-white"
                    style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                  >
                    Unlock the <span className="text-emerald-500 italic">Vault</span>
                  </h2>
                  <p className="text-zinc-500 mt-2 text-sm">Limited seats per cohort</p>
                </div>

                <div id="enroll-form" className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8">
                  <div className="text-center mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-center justify-center gap-3">
                      {course.originalPrice && (
                        <span className="text-xl text-zinc-600 line-through">
                          ₹{course.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span className="text-5xl font-extrabold text-emerald-500">
                        ₹{course.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {savings > 0 && (
                      <span className="inline-block mt-3 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-200 text-xs font-bold">
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
                      className="w-full min-h-12 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:border-emerald-400 focus:outline-none transition-all"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      required
                      className="w-full min-h-12 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:border-emerald-400 focus:outline-none transition-all"
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="WhatsApp Number"
                      className="w-full min-h-12 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:border-emerald-400 focus:outline-none transition-all"
                    />

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <button
                      type="submit"
                      disabled={loading || step === 'paying'}
                      className="w-full min-h-14 py-4 rounded-xl font-bold text-lg text-black bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 shadow-[0_0_30px_rgba(5,150,105,0.3)] transition-all uppercase tracking-widest text-sm"
                    >
                      {loading || step === 'paying'
                        ? '⏳ Processing...'
                        : `Unlock — ₹${course.price.toLocaleString('en-IN')}`}
                    </button>
                  </form>

                  <div className="mt-5 flex items-center justify-center gap-3 text-[11px] text-zinc-600">
                    <span>🔒 Secure</span>
                    <span>•</span>
                    <span>📜 Certificate</span>
                    <span>•</span>
                    <span>💬 Support</span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Link
                    href={freeSessionHref}
                    className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors uppercase tracking-widest"
                  >
                    Or try a free demo session →
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* ═══════════ MINIMAL FOOTER ═══════════ */}
        <footer className="py-8 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
            <p>© {new Date().getFullYear()} {siteConfig.name}</p>
            <div className="flex items-center gap-5">
              <a href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-zinc-400 transition-colors">Terms</a>
            </div>
          </div>
        </footer>
      </div>

      <AskTara />
      <ExitIntentPopup courseTitle={course.title} courseSlug={course.slug} primaryColor="#059669" />
      <EnrollmentToast />
    </>
  )
}
