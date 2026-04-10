'use client'

import React, { useState, useEffect } from 'react'
import Script from 'next/script'
import { motion } from 'framer-motion'
import type { Course } from '@/config/courses'
import { siteConfig } from '@/config/site'

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type Step = 'form' | 'paying' | 'success'

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const end = value
    const duration = 1500
    const step = Math.ceil(end / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [value])
  return <>{count.toLocaleString('en-IN')}{suffix}</>
}

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
      if (res.ok) { setResult(data.result); setTried(true) }
      else setResult('Something went wrong. Try again.')
    } catch { setResult('Network error. Try again.') }
    setLoading(false)
  }

  return (
    <section className="py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0d1424] to-[#020617]" />
      {/* Colored glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[150px]" style={{ background: 'rgba(79,70,229,0.08)' }} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/15 border border-violet-400/25 text-xs font-semibold text-violet-300 mb-4">
            <span className="text-base">⚡</span> LIVE DEMO — Try it now, no signup
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Your Prompts Are{' '}
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Weak</span>
          </h2>
          <p className="text-gray-400 mt-3 text-sm md:text-base">
            Paste any prompt you&apos;d normally give ChatGPT or Claude. Watch it transform using the CRISP framework you&apos;ll learn in this course.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm"
        >
          {/* Example chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs text-gray-500">Try:</span>
            {examplePrompts.map((ex) => (
              <button
                key={ex}
                onClick={() => setInput(ex)}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:border-violet-400/30 hover:text-violet-300 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleImprove() }}
              placeholder="Type your prompt here..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-[#020617] border border-white/10 text-white placeholder-gray-600 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400/30 transition-all resize-none text-sm"
            />
          </div>

          <button
            onClick={handleImprove}
            disabled={loading || input.trim().length < 5}
            className="group w-full mt-3 py-3 rounded-xl font-semibold text-sm text-white relative overflow-hidden disabled:opacity-40"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-fuchsia-500 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" className="opacity-75" />
                  </svg>
                  AI is rewriting...
                </>
              ) : (
                <>⚡ Improve My Prompt</>
              )}
            </span>
          </button>

          {/* Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5"
            >
              {/* Before */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold uppercase">Before</span>
                  <span className="text-xs text-gray-600">Your prompt</span>
                </div>
                <div className="px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/10 text-sm text-gray-400 italic">
                  &ldquo;{input}&rdquo;
                </div>
              </div>

              {/* After */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">After — CRISP Framework</span>
                </div>
                <div className="px-4 py-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {result}
                </div>
              </div>

              {/* Hook */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-5 p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-emerald-500/10 border border-white/10 text-center"
              >
                <p className="text-white font-semibold text-sm">
                  That took 5 seconds. Imagine what you&apos;ll do after {' '}
                  <span className="text-emerald-400">15 days of training.</span>
                </p>
                <a
                  href="#enroll"
                  onClick={(e) => { e.preventDefault(); document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="inline-block mt-3 px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-sm hover:scale-105 transition-transform"
                >
                  Start Learning →
                </a>
              </motion.div>
            </motion.div>
          )}

          {!tried && !loading && !result && (
            <p className="text-center text-xs text-gray-600 mt-3">
              Free. No signup. See the difference instantly.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export function LandingPageContent({ course }: { course: Course }) {
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
          if (verifyRes.ok) { const d = await verifyRes.json(); setPaymentId(d.paymentId); setStep('success') }
          else { setError('Payment verification failed. Contact us on WhatsApp.'); setStep('form') }
        },
        modal: { ondismiss: () => { setStep('form'); setLoading(false) } },
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch { setError('Something went wrong. Please try again.'); setStep('form') }
    setLoading(false)
  }

  const savings = (course.originalPrice || 0) - course.price
  const discount = course.originalPrice ? Math.round((savings / course.originalPrice) * 100) : 0

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="min-h-screen bg-[#020617] overflow-hidden">

        {/* ═══════════ HERO ═══════════ */}
        <section className="relative min-h-[90vh] md:min-h-[85vh] flex items-center">
          {/* Animated gradient orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[150px] animate-pulse" style={{ background: 'rgba(16,185,129,0.15)' }} />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[130px] animate-pulse" style={{ background: 'rgba(79,70,229,0.12)', animationDelay: '1s' }} />
            <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full blur-[100px] animate-pulse" style={{ background: 'rgba(236,72,153,0.08)', animationDelay: '2s' }} />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 w-full">
            {/* Top badge */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 text-sm">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-300 font-medium">Punjab&apos;s #1 AI Training Lab</span>
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                <span className="text-white" style={{ fontFamily: 'var(--font-display), Georgia, serif' }}>Learn Claude AI</span>
                <br />
                <span className="text-lg sm:text-xl md:text-2xl font-light italic text-gray-400 tracking-wide" style={{ fontFamily: 'var(--font-display), Georgia, serif' }}>
                  in Just
                </span>
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-display), Georgia, serif' }}>
                  15 Days
                </span>
              </h1>
              <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-300 font-medium">
                The Smarter Alternative to ChatGPT
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Offline Training with Real-World Use Cases
              </p>
            </motion.div>

            {/* Claude facts — builds urgency */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-10 flex justify-center gap-3 sm:gap-5 flex-wrap">
              {[
                { value: 200, suffix: 'M+', label: 'Claude Users Worldwide', color: 'from-violet-400 to-violet-600' },
                { value: 1, suffix: '#', label: 'Rated AI for Coding & Writing', color: 'from-amber-400 to-orange-500' },
                { value: 15, suffix: '', label: 'Days to Master It', color: 'from-cyan-400 to-blue-500' },
              ].map((stat) => (
                <div key={stat.label} className="text-center px-4 sm:px-5 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm min-w-[90px]">
                  <div className={`text-xl sm:text-2xl font-bold bg-gradient-to-b ${stat.color} bg-clip-text text-transparent`}>
                    {stat.suffix === '#' ? (
                      <><span className="text-amber-400">#</span><AnimatedNumber value={stat.value} /></>
                    ) : (
                      <><AnimatedNumber value={stat.value} />{stat.suffix}</>
                    )}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#enroll"
                onClick={(e) => { e.preventDefault(); document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="group relative px-8 py-4 rounded-2xl font-semibold text-lg text-black overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  Enroll Now — ₹{course.price.toLocaleString('en-IN')}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </a>
              {course.originalPrice && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="line-through text-gray-600">₹{course.originalPrice.toLocaleString('en-IN')}</span>
                  <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-bold text-xs animate-pulse">
                    {discount}% OFF
                  </span>
                </div>
              )}
            </motion.div>

            {/* Tools strip */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-12 flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
              {course.tools.slice(0, 8).map((tool) => (
                <span key={tool} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400 hover:border-emerald-400/30 hover:text-emerald-300 transition-colors">
                  {tool}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </section>

        {/* ═══════════ PUNJABI HOOK + WHO IS THIS FOR ═══════════ */}
        <section className="py-14 md:py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617] to-[#0a1628]" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
            {/* Punjabi hook */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <div className="inline-block px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/20">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-amber-300" style={{ fontFamily: 'var(--font-display), Georgia, serif' }}>
                  &ldquo;YouTube pe sab free hai...&rdquo;
                </p>
                <p className="text-sm sm:text-base text-amber-100/70 mt-1">
                  ...phir log AI se kama kyu nahi pa rahe?
                </p>
              </div>
            </motion.div>

            {/* Who is this for */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
              <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase">This Program Is For</span>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { emoji: '🎓', title: 'Students', subtitle: '12th pass / College', color: 'from-violet-500/20 to-purple-500/20', border: 'border-violet-400/20' },
                { emoji: '💼', title: 'Freelancers & Job Seekers', subtitle: 'Want to earn with AI', color: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-400/20' },
                { emoji: '🏪', title: 'Business Owners', subtitle: 'Automate & grow', color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-400/20' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`text-center p-5 rounded-2xl bg-gradient-to-br ${item.color} border ${item.border} backdrop-blur-sm`}
                >
                  <span className="text-3xl">{item.emoji}</span>
                  <h3 className="text-white font-bold mt-2 text-sm">{item.title}</h3>
                  <p className="text-gray-400 text-xs mt-1">{item.subtitle}</p>
                </motion.div>
              ))}
            </div>

            {/* Before / After */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* Header */}
                <div className="text-center pb-2">
                  <span className="px-4 py-1.5 rounded-full bg-red-500/15 text-red-400 text-xs font-bold uppercase">Before</span>
                </div>
                <div className="text-center pb-2">
                  <span className="px-4 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold uppercase">After This Course</span>
                </div>
                {/* Rows */}
                {[
                  { before: '😵 AI se confused', after: '🚀 AI se kaam karwa raha hai' },
                  { before: '📱 Reels scroll karta hai', after: '🎬 Reels bana raha hai' },
                  { before: '🔍 Job search', after: '💰 Income create' },
                ].map((row, i) => (
                  <React.Fragment key={i}>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                      className="p-3 sm:p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-sm text-gray-400"
                    >
                      {row.before}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                      className="p-3 sm:p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-sm text-white font-medium"
                    >
                      {row.after}
                    </motion.div>
                  </React.Fragment>
                ))}
              </div>
            </motion.div>

            {/* Differentiators */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 flex flex-wrap justify-center gap-3">
              {[
                { icon: '⚡', text: 'In-class execution' },
                { icon: '🔥', text: 'Live projects' },
                { icon: '🚫', text: 'No boring lectures' },
              ].map((d) => (
                <span key={d.text} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 font-medium">
                  <span>{d.icon}</span> {d.text}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════ TRY IT — Interactive Prompt Improver ═══════════ */}
        <PromptImproverSection />

        {/* ═══════════ WHAT YOU'LL LEARN — Visual Cards ═══════════ */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0a1628] to-[#020617]" />
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
              <span className="text-emerald-400 text-sm font-semibold tracking-wider uppercase">Why this course?</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">
                What You&apos;ll Walk Away With
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {course.learningOutcomes.slice(0, 6).map((outcome, i) => {
                const icons = ['🚀', '🧠', '⚡', '🎯', '💡', '🏆']
                const gradients = [
                  'from-emerald-500/20 to-teal-500/20',
                  'from-violet-500/20 to-purple-500/20',
                  'from-amber-500/20 to-orange-500/20',
                  'from-cyan-500/20 to-blue-500/20',
                  'from-pink-500/20 to-rose-500/20',
                  'from-lime-500/20 to-green-500/20',
                ]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className={`p-5 md:p-6 rounded-2xl bg-gradient-to-br ${gradients[i]} border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all hover:scale-[1.02]`}
                  >
                    <span className="text-2xl">{icons[i]}</span>
                    <p className="mt-3 text-sm md:text-base text-gray-200 font-medium leading-relaxed">
                      {outcome}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ═══════════ SYLLABUS — Timeline Style ═══════════ */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-[#0B1120]" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
              <span className="text-violet-400 text-sm font-semibold tracking-wider uppercase">Your Journey</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">
                {course.duration} Roadmap
              </h2>
            </motion.div>

            <div className="space-y-6">
              {course.syllabus.map((mod, i) => {
                const colors = ['emerald', 'violet', 'amber', 'cyan', 'pink']
                const c = colors[i % colors.length]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-8 md:pl-12"
                  >
                    {/* Timeline line */}
                    {i < course.syllabus.length - 1 && (
                      <div className={`absolute left-[13px] md:left-[21px] top-10 bottom-[-24px] w-0.5 bg-${c}-500/20`} />
                    )}
                    {/* Timeline dot */}
                    <div className={`absolute left-0 md:left-2 top-1 w-7 h-7 rounded-full bg-${c}-500/20 border-2 border-${c}-400 flex items-center justify-center`}>
                      <span className="text-xs font-bold text-white">{i + 1}</span>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 hover:border-white/20 transition-colors">
                      <h3 className="font-bold text-white text-base md:text-lg">{mod.module}</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {mod.topics.map((topic, j) => (
                          <span key={j} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-gray-400 border border-white/5">
                            {topic.length > 60 ? topic.slice(0, 57) + '...' : topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ═══════════ HOW YOU WILL EARN ═══════════ */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-[#020617]" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10">
              <span className="text-amber-400 text-sm font-semibold tracking-wider uppercase">Start Earning Early</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">
                How You Will{' '}
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Earn</span>
              </h2>
              <p className="text-gray-500 mt-2 text-sm">Don&apos;t wait till the last module. You can start earning from Week 2.</p>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  emoji: '💻',
                  title: 'Freelancing',
                  amount: '₹5K — ₹50K/mo',
                  examples: ['Prompt writing for businesses', 'AI content creation', 'Social media management'],
                  color: 'from-emerald-500/20 to-teal-500/20',
                  border: 'border-emerald-400/20',
                  amountColor: 'text-emerald-400',
                },
                {
                  emoji: '🎬',
                  title: 'Content Creation',
                  amount: '₹10K — ₹1L/mo',
                  examples: ['AI-powered YouTube channel', 'Instagram Reels with AI', 'Blog writing with AI tools'],
                  color: 'from-violet-500/20 to-purple-500/20',
                  border: 'border-violet-400/20',
                  amountColor: 'text-violet-400',
                },
                {
                  emoji: '🏢',
                  title: 'Business Services',
                  amount: '₹15K — ₹2L/mo',
                  examples: ['AI automation for local shops', 'Marketing for small businesses', 'AI consulting & training'],
                  color: 'from-amber-500/20 to-orange-500/20',
                  border: 'border-amber-400/20',
                  amountColor: 'text-amber-400',
                },
              ].map((path, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-5 rounded-2xl bg-gradient-to-br ${path.color} border ${path.border} backdrop-blur-sm`}
                >
                  <span className="text-3xl">{path.emoji}</span>
                  <h3 className="text-white font-bold mt-3">{path.title}</h3>
                  <p className={`${path.amountColor} font-bold text-lg mt-1`}>{path.amount}</p>
                  <ul className="mt-3 space-y-1.5">
                    {path.examples.map((ex, j) => (
                      <li key={j} className="text-xs text-gray-400 flex items-start gap-1.5">
                        <span className="text-gray-600 mt-0.5">•</span>{ex}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ WHAT YOU GET — Value Stack ═══════════ */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-[#0B1120]" />
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10">
              <span className="text-pink-400 text-sm font-semibold tracking-wider uppercase">Everything Included</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">
                What You{' '}
                <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Get</span>
              </h2>
            </motion.div>

            <div className="space-y-3">
              {[
                { icon: '📝', item: '100+ Prompt Library', desc: 'Tested prompts for every use case — business, content, marketing, coding' },
                { icon: '🎬', item: 'Reel Scripts & Templates', desc: 'Ready-to-use video scripts that you can customize and post' },
                { icon: '🎨', item: 'Canva Templates Pack', desc: 'Professional social media templates with your branding' },
                { icon: '💬', item: 'Client Message Templates', desc: 'Cold outreach, follow-up, proposal, and closing messages' },
                { icon: '📁', item: 'Portfolio Framework', desc: 'Step-by-step guide to build a portfolio that gets clients' },
                { icon: '📜', item: 'Verified Certificate', desc: 'LinkedIn-shareable certificate with unique verification ID' },
                { icon: '👥', item: 'Community Access', desc: 'WhatsApp group with alumni, job leads, and ongoing support' },
                { icon: '🎯', item: '15 Days of Live Training', desc: 'In-class, hands-on, with real projects — not pre-recorded videos' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-colors"
                >
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{item.item}</h3>
                    <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                  </div>
                  <span className="ml-auto text-emerald-400 shrink-0">✓</span>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-6 text-center">
              <p className="text-gray-500 text-xs">
                Total value: <span className="line-through">₹25,000+</span>{' '}
                <span className="text-white font-bold">All included in ₹{course.price.toLocaleString('en-IN')}</span>
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══════════ SOCIAL PROOF ═══════════ */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-[#020617]" />
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
              <span className="text-amber-400 text-sm font-semibold tracking-wider uppercase">Real Results</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">
                Students Love It
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
              {[
                { name: 'Raman K.', role: 'Business Owner', text: 'Learned more in 15 days than months of YouTube videos. The hands-on approach is next level.', emoji: '🏪', rating: 5 },
                { name: 'Priya S.', role: 'Marketing Pro', text: 'CRISP framework changed everything. My productivity went up 3x. My boss noticed.', emoji: '💼', rating: 5 },
                { name: 'Arjun M.', role: 'Freelancer', text: 'Started earning ₹25K/month within a week of completing. Best investment I made.', emoji: '💻', rating: 5 },
              ].map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-amber-400/20 transition-all"
                >
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <span key={j} className="text-amber-400 text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-lg">
                      {t.emoji}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{t.name}</p>
                      <p className="text-gray-500 text-xs">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ ENROLLMENT FORM ═══════════ */}
        <section id="enroll" className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0a1628] to-[#020617]" />
          {/* Glow behind form */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px]" style={{ background: 'rgba(16,185,129,0.08)' }} />

          <div className="relative z-10 max-w-md mx-auto px-4 sm:px-6">
            {step === 'success' ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 backdrop-blur-md border border-emerald-400/30 rounded-3xl p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🎉</span>
                </div>
                <h2 className="text-2xl font-bold text-white">You&apos;re In!</h2>
                <p className="text-gray-400 mt-2 mb-1">Welcome to {course.title}</p>
                <p className="text-xs text-gray-600 mb-6">Payment ID: {paymentId}</p>
                <p className="text-gray-400 text-sm mb-6">
                  We&apos;ll WhatsApp you within 2 hours with batch details.
                </p>
                <a
                  href={`https://wa.me/919200882008?text=${encodeURIComponent(`Hi! I just enrolled in "${course.title}". Payment ID: ${paymentId}. Please share batch details.`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-block px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
                >
                  Message on WhatsApp →
                </a>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    Start Your AI Journey
                  </h2>
                  <p className="text-gray-500 mt-2 text-sm">Limited seats per batch</p>
                </div>

                <div id="enroll-form" className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8">
                  {/* Price hero */}
                  <div className="text-center mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-center justify-center gap-3">
                      {course.originalPrice && (
                        <span className="text-xl text-gray-600 line-through">₹{course.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                      <span className="text-5xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
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
                    <div>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Full Name" required
                        className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/30 transition-all" />
                    </div>
                    <div>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required
                        className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/30 transition-all" />
                    </div>
                    <div>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="WhatsApp Number"
                        className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/30 transition-all" />
                    </div>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <button type="submit" disabled={loading || step === 'paying'}
                      className="group w-full py-4 rounded-xl font-bold text-lg text-black relative overflow-hidden disabled:opacity-50">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400" />
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="relative">
                        {loading || step === 'paying' ? '⏳ Processing...' : `Enroll Now — ₹${course.price.toLocaleString('en-IN')}`}
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
                    <a href={`https://wa.me/919200882008?text=${encodeURIComponent(`Hi, I have a question about "${course.title}"`)}`}
                      target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-emerald-400 transition-colors">
                      Have questions? Chat with us →
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* ═══════════ FAQ — Compact ═══════════ */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-[#0B1120]" />
          <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Quick Answers</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { q: 'Any experience needed?', a: 'Nope. Complete beginners welcome.' },
                { q: 'Online or offline?', a: 'Offline in Kotkapura, Punjab.' },
                { q: 'Do I get a certificate?', a: 'Yes. Verified + LinkedIn-shareable.' },
                { q: 'What if I miss a class?', a: 'Recorded sessions + notes provided.' },
              ].map((faq, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="font-semibold text-white text-sm">{faq.q}</h3>
                  <p className="mt-1 text-gray-400 text-xs">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ FINAL CTA ═══════════ */}
        <section className="py-20 relative text-center">
          <div className="absolute inset-0 bg-[#020617]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[150px]" style={{ background: 'rgba(16,185,129,0.1)' }} />
          <div className="relative z-10 px-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">
              Don&apos;t Think.<br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Just Start.</span>
            </h2>
            <p className="mt-4 text-gray-500 text-sm">
              {siteConfig.stats.studentsCount} students already did.
            </p>
            <a href="#enroll" onClick={(e) => { e.preventDefault(); document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="inline-block mt-8 px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_10px_40px_rgba(16,185,129,0.3)]">
              Enroll Now →
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 pb-24 md:pb-6 border-t border-white/5 text-center">
          <p className="text-xs text-gray-600">
            {siteConfig.name} &middot; {siteConfig.contact.address} &middot; {siteConfig.contact.phone}
          </p>
        </footer>

        {/* Mobile sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#020617]/95 backdrop-blur-md border-t border-white/10 px-4 py-3 flex items-center justify-between">
          <div>
            {course.originalPrice && <span className="text-xs text-gray-600 line-through mr-1">₹{course.originalPrice.toLocaleString('en-IN')}</span>}
            <span className="text-lg font-bold text-white">₹{course.price.toLocaleString('en-IN')}</span>
          </div>
          <a href="#enroll" onClick={(e) => { e.preventDefault(); document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-sm">
            Enroll Now
          </a>
        </div>
      </div>
    </>
  )
}
