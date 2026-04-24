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
import { KidsFriendlyRobot } from '@/components/landing/kids-friendly-robot'
import { KidsImaginationMachine } from '@/components/landing/kids-imagination-machine'

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

type Step = 'form' | 'paying' | 'success'

const DISPLAY = 'var(--font-space-grotesk), system-ui, sans-serif'
const CYAN = '#22d3ee'
const CYAN_RGB = '34,211,238'

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
// The 4 Chapters (narrative, backed by courses.ts syllabus)
// ─────────────────────────────────────────────────────────────

const CHAPTERS = [
  {
    number: '01',
    emoji: '👋',
    title: 'Meet AI',
    subtitle: 'Week 1',
    body:
      'Say hi to ChatGPT and friends. Learn how AI thinks, where it lives, and the simple rules to stay safe and smart online.',
    color: '#22d3ee',
  },
  {
    number: '02',
    emoji: '📚',
    title: 'Homework Hero',
    subtitle: 'Week 2',
    body:
      'Turn AI into a study buddy. Ask great questions, get clear answers, and write stories that sparkle — with AI cheering you on.',
    color: '#10b981',
  },
  {
    number: '03',
    emoji: '🎨',
    title: 'Art Studio',
    subtitle: 'Week 3',
    body:
      'Paint with AI. Make posters, presentations, birthday cards, and tiny comic books. Canva AI + your imagination = magic.',
    color: '#f472b6',
  },
  {
    number: '04',
    emoji: '🔬',
    title: 'Mini Scientist',
    subtitle: 'Week 4',
    body:
      'Solve a real problem with AI. Science fair projects, quiz games, and a little showcase where every kid gets to say "I built this."',
    color: '#fbbf24',
  },
]

// ─────────────────────────────────────────────────────────────
// Parent trust rows — the quiet reassurance layer
// ─────────────────────────────────────────────────────────────

const PARENT_TRUST = [
  { icon: '🛡️', title: 'Always supervised', text: 'Every session is offline in the Kotkapura lab with a teacher in the room. No unsupervised AI access.' },
  { icon: '📱', title: 'Zero extra screen time at home', text: 'Hands-on in class only. No homework apps, no random website logins.' },
  { icon: '📨', title: 'Weekly parent updates', text: 'A short WhatsApp message every week showing exactly what your child made.' },
  { icon: '🧠', title: 'Confidence, not just tools', text: 'We teach the thinking — how to ask, question, and build. The tools are just the brush.' },
]

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

export function KidsLandingContent({ course }: { course: Course }) {
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
        theme: { color: CYAN },
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

      <div className="min-h-screen bg-[#030712] text-white overflow-hidden relative">
        {/* ═══════════ HERO ═══════════ */}
        <section className="relative min-h-[94vh] flex items-center overflow-hidden">
          {/* Bubble background */}
          <div
            aria-hidden
            className="absolute top-[8%] left-[-6%] w-[380px] h-[380px] rounded-full blur-3xl opacity-70 pointer-events-none"
            style={{ background: `rgba(16,185,129,0.14)` }}
          />
          <div
            aria-hidden
            className="absolute bottom-[2%] right-[-8%] w-[480px] h-[480px] rounded-full blur-3xl opacity-70 pointer-events-none"
            style={{ background: `rgba(${CYAN_RGB},0.14)` }}
          />
          <div
            aria-hidden
            className="absolute top-[40%] left-[55%] w-[260px] h-[260px] rounded-full blur-3xl opacity-50 pointer-events-none"
            style={{ background: 'rgba(244,114,182,0.08)' }}
          />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
            <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:gap-y-6 lg:items-center">
              {/* HEAD — logo + playful label + headline */}
              <div className="order-1 lg:order-none lg:col-start-1 lg:row-start-1 lg:self-end text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 sm:mb-8 flex justify-center lg:justify-start"
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
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 text-[11px] sm:text-xs font-bold tracking-[0.18em]"
                  style={{
                    color: CYAN,
                    borderColor: `rgba(${CYAN_RGB},0.4)`,
                    background: `rgba(${CYAN_RGB},0.08)`,
                  }}
                >
                  <span>🚀</span>
                  CLASS 5–7 · THE PLAYFUL LAB
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-4 sm:mt-5 text-4xl sm:text-5xl lg:text-[5rem] font-bold leading-[1.02] tracking-tight text-white"
                  style={{ fontFamily: DISPLAY }}
                >
                  Start Your
                  <br />
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(90deg, ${CYAN} 0%, #10b981 100%)`,
                      filter: `drop-shadow(0 0 20px rgba(${CYAN_RGB},0.35))`,
                    }}
                  >
                    AI Adventure.
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mt-4 sm:mt-5 text-base sm:text-lg text-gray-300 max-w-lg lg:max-w-xl mx-auto lg:mx-0 leading-relaxed"
                >
                  A 4-week AI lab for young creators. Tell stories with robots, paint with
                  pixels, and build a mini science project — all offline, all supervised,
                  all fun.
                </motion.p>

                {/* The robot — floats between head and body on mobile */}
                <div className="lg:hidden my-8 flex justify-center">
                  <KidsFriendlyRobot className="w-40 h-40" />
                </div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="mt-6 sm:mt-8 grid grid-cols-3 gap-2.5 sm:gap-3 max-w-md mx-auto lg:mx-0"
                >
                  {[
                    { value: 4, suffix: ' Weeks', label: 'Adventure' },
                    { value: 10, suffix: '+', label: 'AI Tools' },
                    { value: 1, suffix: '', label: 'Mini Project' },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-2xl border-2 backdrop-blur-sm px-2.5 py-3 text-center"
                      style={{
                        borderColor: `rgba(${CYAN_RGB},0.2)`,
                        background: `rgba(${CYAN_RGB},0.04)`,
                      }}
                    >
                      <div
                        className="text-lg sm:text-xl font-bold tabular-nums"
                        style={{ fontFamily: DISPLAY, color: CYAN }}
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
                  transition={{ delay: 0.35 }}
                  className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:items-center justify-center lg:justify-start"
                >
                  <motion.a
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.94 }}
                    href="#enroll"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full font-black text-base text-black"
                    style={{
                      background: `linear-gradient(90deg, ${CYAN} 0%, #10b981 100%)`,
                      boxShadow: `0 10px 40px rgba(${CYAN_RGB},0.35)`,
                    }}
                  >
                    <span className="relative">Reserve My Seat 🎟️</span>
                  </motion.a>

                  <a
                    href="#chapters"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById('chapters')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-4 rounded-full border-2 border-white/15 text-base sm:text-sm font-semibold text-gray-200 hover:border-cyan-400/40 hover:text-cyan-300 transition-colors"
                  >
                    Peek inside the lab
                  </a>

                  {course.originalPrice && (
                    <span className="inline-flex items-center gap-2 text-xs text-gray-500 justify-center sm:justify-start">
                      <span className="line-through">₹{course.originalPrice.toLocaleString('en-IN')}</span>
                      <span
                        className="px-2 py-0.5 rounded-full font-bold"
                        style={{ background: `rgba(${CYAN_RGB},0.18)`, color: CYAN }}
                      >
                        {discount}% OFF
                      </span>
                    </span>
                  )}
                </motion.div>
              </div>

              {/* RIGHT — Robot (desktop) + Imagination Machine stacked */}
              <div className="order-2 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center relative flex flex-col items-center gap-6 lg:gap-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="hidden lg:block"
                >
                  <KidsFriendlyRobot className="w-44 h-44" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.55 }}
                  className="w-full"
                >
                  <KidsImaginationMachine />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ 4 CHAPTERS ═══════════ */}
        <section id="chapters" className="relative py-20 md:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#050f1e] to-[#030712]" />
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14 md:mb-20"
            >
              <span
                className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase"
                style={{ color: CYAN }}
              >
                The 4-Week Journey
              </span>
              <h2
                className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.1]"
                style={{ fontFamily: DISPLAY }}
              >
                4 Chapters. <span className="text-gray-500">1 Curious Kid.</span>
                <br />
                All kinds of magic.
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
              {CHAPTERS.map((ch, i) => (
                <motion.div
                  key={ch.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative rounded-3xl border-2 p-6 md:p-7 bg-white/[0.03] backdrop-blur-sm overflow-hidden"
                  style={{ borderColor: `${ch.color}40` }}
                >
                  {/* Soft corner glow keyed to the chapter colour */}
                  <div
                    aria-hidden
                    className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-60"
                    style={{ background: `${ch.color}25` }}
                  />

                  <div className="relative flex items-start gap-4">
                    <div
                      className="flex items-center justify-center w-14 h-14 rounded-2xl text-3xl shrink-0"
                      style={{ background: `${ch.color}18`, border: `2px solid ${ch.color}55` }}
                    >
                      {ch.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-black tracking-[0.22em]"
                          style={{ color: ch.color }}
                        >
                          CH · {ch.number}
                        </span>
                        <span className="text-[10px] text-gray-500">· {ch.subtitle}</span>
                      </div>
                      <h3
                        className="mt-1 text-xl sm:text-2xl font-bold text-white"
                        style={{ fontFamily: DISPLAY }}
                      >
                        {ch.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-400 leading-relaxed">{ch.body}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ PARENT TRUST ═══════════ */}
        <section className="relative py-16 md:py-24">
          <div className="absolute inset-0 bg-[#030712]" />
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span
                className="text-[11px] font-bold tracking-[0.2em] uppercase"
                style={{ color: '#10b981' }}
              >
                A Note for Parents
              </span>
              <h2
                className="mt-3 text-3xl md:text-4xl font-bold text-white"
                style={{ fontFamily: DISPLAY }}
              >
                Safe. Structured. Supervised.
              </h2>
              <p className="text-gray-400 text-sm md:text-base mt-3 max-w-xl mx-auto">
                Everything we do is designed to build your child&apos;s confidence with
                technology — without the risks that come with unsupervised AI at home.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
              {PARENT_TRUST.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-4 p-5 rounded-2xl border-2 border-white/10 bg-white/[0.02]"
                >
                  <div className="text-2xl shrink-0 mt-0.5">{item.icon}</div>
                  <div>
                    <h3 className="text-white font-bold text-base" style={{ fontFamily: DISPLAY }}>
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-400 leading-relaxed">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ WHAT YOUR CHILD SHIPS ═══════════ */}
        <section className="py-16 md:py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#050f1e] to-[#030712]" />
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: CYAN }}>
                By Week 4
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3" style={{ fontFamily: DISPLAY }}>
                What your child walks away with
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
              {[
                { icon: '📖', title: 'A Story Book', text: 'Their own AI-made storybook — characters, settings, illustrations.' },
                { icon: '🖼️', title: 'An Art Gallery', text: 'A folder of AI posters, cards, and presentations to share with family.' },
                { icon: '🏆', title: 'A Showcase Project', text: 'A mini science/AI project — the thing they\'ll proudly say "I built this!" about.' },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-5 md:p-6 rounded-3xl border-2 bg-white/[0.03] hover:border-cyan-400/40 transition-colors"
                  style={{ borderColor: 'rgba(255,255,255,0.1)' }}
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
          <div className="absolute inset-0 bg-[#030712]" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px]"
            style={{ background: `rgba(${CYAN_RGB},0.1)` }}
          />

          <div className="relative z-10 max-w-md mx-auto px-4 sm:px-6">
            {step === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 backdrop-blur-md border-2 rounded-[32px] p-8 text-center"
                style={{ borderColor: `rgba(${CYAN_RGB},0.3)` }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: `rgba(${CYAN_RGB},0.2)` }}
                >
                  <span className="text-4xl">🎉</span>
                </div>
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: DISPLAY }}>
                  Seat reserved!
                </h2>
                <p className="text-gray-400 mt-2 mb-1">Welcome to {course.title}</p>
                <p className="text-xs text-gray-600 mb-6">Payment ID: {paymentId}</p>
                <p className="text-gray-400 text-sm mb-6">
                  We&apos;ll WhatsApp you within 2 hours with batch details and the welcome pack.
                </p>
                <a
                  href={`https://wa.me/919200882008?text=${encodeURIComponent(
                    `Hi! My child just enrolled in "${course.title}". Payment ID: ${paymentId}. Please share batch details.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
                >
                  Message on WhatsApp →
                </a>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: DISPLAY }}>
                    Reserve Your Seat
                  </h2>
                  <p className="text-gray-500 mt-2 text-sm">Small batches · limited seats</p>
                </div>

                <div className="bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-[32px] p-6 sm:p-8">
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
                          background: `linear-gradient(90deg, ${CYAN}, #10b981)`,
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
                          background: `rgba(${CYAN_RGB},0.12)`,
                          borderColor: `rgba(${CYAN_RGB},0.3)`,
                          color: CYAN,
                        }}
                      >
                        🎟️ Save ₹{savings.toLocaleString('en-IN')} — {discount}% OFF
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleEnroll} className="space-y-4">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Parent Full Name"
                      required
                      className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border-2 border-white/10 text-white placeholder-gray-600 focus:border-[#22d3ee] focus:outline-none focus:ring-2 focus:ring-[#22d3ee]/30 transition-all"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Parent Email Address"
                      required
                      className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border-2 border-white/10 text-white placeholder-gray-600 focus:border-[#22d3ee] focus:outline-none focus:ring-2 focus:ring-[#22d3ee]/30 transition-all"
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="WhatsApp Number"
                      className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border-2 border-white/10 text-white placeholder-gray-600 focus:border-[#22d3ee] focus:outline-none focus:ring-2 focus:ring-[#22d3ee]/30 transition-all"
                    />

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      disabled={loading || step === 'paying'}
                      className="w-full py-4 rounded-2xl font-black text-lg text-black disabled:opacity-50"
                      style={{
                        background: `linear-gradient(90deg, ${CYAN} 0%, #10b981 100%)`,
                        boxShadow: `0 8px 30px rgba(${CYAN_RGB},0.35)`,
                      }}
                    >
                      {loading || step === 'paying'
                        ? '⏳ Processing...'
                        : `Reserve Seat — ₹${course.price.toLocaleString('en-IN')}`}
                    </motion.button>
                  </form>

                  <div className="mt-5 flex items-center justify-center gap-3 text-[11px] text-gray-600">
                    <span>🔒 Secure</span>
                    <span>·</span>
                    <span>🛡️ Supervised</span>
                    <span>·</span>
                    <span>💬 Parent Support</span>
                  </div>

                  <div className="mt-4 text-center">
                    <a
                      href={`https://wa.me/919200882008?text=${encodeURIComponent(`Hi, I have a question about "${course.title}" for my child.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-500 hover:text-cyan-300 transition-colors"
                    >
                      Questions? Chat with us →
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* ═══════════ FAQ ═══════════ */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-[#050f1e]" />
          <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-white text-center mb-8" style={{ fontFamily: DISPLAY }}>
              Parent Questions
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { q: 'Is this safe for a Class 5 kid?', a: 'Yes. Always supervised in the Kotkapura lab.' },
                { q: 'Online or offline?', a: 'Offline only, in person, teacher-led.' },
                { q: 'How long per day?', a: '60-75 minute sessions, 3 days a week.' },
                { q: 'No prior tech needed?', a: 'None. We start from the very basics.' },
              ].map((faq) => (
                <div key={faq.q} className="p-4 rounded-2xl bg-white/5 border-2 border-white/10">
                  <h3 className="font-semibold text-white text-sm">{faq.q}</h3>
                  <p className="mt-1 text-gray-400 text-xs">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ FINAL CTA ═══════════ */}
        <section className="py-20 relative text-center">
          <div className="absolute inset-0 bg-[#030712]" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[150px]"
            style={{ background: `rgba(${CYAN_RGB},0.12)` }}
          />
          <div className="relative z-10 px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white" style={{ fontFamily: DISPLAY }}>
              The future is
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(90deg, ${CYAN}, #10b981)` }}
              >
                already curious about them.
              </span>
            </h2>
            <p className="mt-4 text-gray-500 text-sm">
              Four weeks. One safe, structured lab. A lifetime of &ldquo;I built this.&rdquo;
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#enroll"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-block mt-8 px-10 py-4 rounded-full text-black font-black text-lg"
              style={{
                background: `linear-gradient(90deg, ${CYAN} 0%, #10b981 100%)`,
                boxShadow: `0 10px 40px rgba(${CYAN_RGB},0.35)`,
              }}
            >
              Reserve My Seat 🎟️
            </motion.a>
          </div>
        </section>

        <footer className="py-6 pb-24 md:pb-6 border-t border-white/5 text-center">
          <p className="text-xs text-gray-600">
            {siteConfig.name} &middot; {siteConfig.contact.address} &middot; {siteConfig.contact.phone}
          </p>
        </footer>

        {/* Mobile sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#030712]/95 backdrop-blur-md border-t-2 border-cyan-400/20 px-4 py-3 flex items-center justify-between">
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
            style={{ background: `linear-gradient(90deg, ${CYAN}, #10b981)` }}
          >
            Reserve Seat
          </a>
        </div>
      </div>

      <AskTara />
      <ExitIntentPopup courseTitle={course.title} courseSlug={course.slug} primaryColor={CYAN} />
      <EnrollmentToast />
    </>
  )
}
