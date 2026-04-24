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
import { PowerTaskEraser } from '@/components/landing/power-task-eraser'

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

type Step = 'form' | 'paying' | 'success'

const DISPLAY = 'var(--font-space-grotesk), system-ui, sans-serif'
const MONO = 'var(--font-fira-code), ui-monospace, monospace'
const SILVER = '#e2e8f0'
const SILVER_RGB = '226,232,240'

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const end = value
    const duration = 1100
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
// The 8-week executive module list
// ─────────────────────────────────────────────────────────────

const MODULES = [
  { w: '01', title: 'Foundations · Soch Badlo',     outcome: 'Write 20 professional prompts for your field' },
  { w: '02', title: 'Academics & Research',          outcome: 'Research like a PhD — briefs, SOPs, IELTS prep' },
  { w: '03', title: 'Content & Social Presence',     outcome: '1-week content calendar shipped, AI-made' },
  { w: '04', title: 'Business & Money',              outcome: 'AI playbook for a real local business' },
  { w: '05', title: 'Workflow Automation',           outcome: 'First end-to-end AI pipeline running' },
  { w: '06', title: 'Presentations & Reports',       outcome: 'Board-ready decks in minutes, not days' },
  { w: '07', title: 'Personal Brand & Freelancing',  outcome: 'Live Fiverr/Upwork/LinkedIn profiles' },
  { w: '08', title: 'Capstone Deploy',               outcome: 'One real project delivered. Portfolio locked.' },
]

// ─────────────────────────────────────────────────────────────
// ROI data — concrete numbers, no fluff
// ─────────────────────────────────────────────────────────────

const ROI_ROWS = [
  { metric: '18h', label: 'Reclaimed per work-week',  note: 'Email · reports · research · decks' },
  { metric: '4',   label: 'Portfolio projects',        note: 'Deployable from week 4' },
  { metric: '15+', label: 'AI tools in your stack',    note: 'Plus ₹0-cost alternatives' },
  { metric: '₹20–50K', label: 'Freelancing range',  note: 'Month 3 of disciplined practice' },
]

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

export function PowerLandingContent({ course }: { course: Course }) {
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
        theme: { color: '#10b981' },
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
        {/* ═══════════ HERO ═══════════ */}
        <section className="relative min-h-[94vh] flex items-center overflow-hidden">
          {/* Quiet executive grid — 80px, low opacity. Minimalist by default. */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(${SILVER} 1px, transparent 1px),
                linear-gradient(90deg, ${SILVER} 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
            }}
          />

          {/* Minimal emerald hint — only one orb, unobtrusive */}
          <div
            aria-hidden
            className="absolute -bottom-40 -right-32 w-[520px] h-[520px] rounded-full blur-[140px] opacity-50 pointer-events-none"
            style={{ background: 'rgba(16,185,129,0.12)' }}
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
                  className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-bold tracking-[0.32em]"
                  style={{ color: '#10b981' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10b981' }} />
                  EXECUTIVE PERFORMANCE LAB
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-4 sm:mt-5 text-4xl sm:text-5xl lg:text-[5rem] font-bold leading-[1.02] tracking-tight"
                  style={{ fontFamily: DISPLAY }}
                >
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: 'linear-gradient(to bottom, #ffffff 0%, #94a3b8 100%)' }}
                  >
                    Erase the
                  </span>
                  <br />
                  <span className="text-white">Inefficiency.</span>
                </motion.h1>
              </div>

              {/* TASK ERASER — above the fold on mobile, right column on desktop */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.22, duration: 0.5 }}
                className="order-2 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center relative flex justify-center lg:justify-end"
              >
                <PowerTaskEraser />
              </motion.div>

              {/* BODY */}
              <div className="order-3 lg:order-none lg:col-start-1 lg:row-start-2 lg:self-start">
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-base sm:text-lg text-gray-400 max-w-xl leading-relaxed"
                >
                  Master the professional AI stack in <span className="text-white">8 weeks</span>. Deploy custom workflows
                  that reclaim <span className="text-white">20+ hours</span> of your work week. Built for people whose
                  time has a price.
                </motion.p>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 sm:mt-8 grid grid-cols-3 gap-2.5 sm:gap-3 max-w-lg"
                >
                  {[
                    { value: 8,  suffix: '',   label: 'Weeks' },
                    { value: 15, suffix: '+',  label: 'AI Tools' },
                    { value: 4,  suffix: '',   label: 'Projects' },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-lg border backdrop-blur-sm px-2.5 sm:px-3 py-3 text-center"
                      style={{
                        borderColor: `rgba(${SILVER_RGB},0.1)`,
                        background: `rgba(${SILVER_RGB},0.02)`,
                      }}
                    >
                      <div
                        className="text-lg sm:text-2xl font-bold tabular-nums"
                        style={{
                          fontFamily: DISPLAY,
                          background: 'linear-gradient(to bottom, #ffffff 0%, #94a3b8 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        <AnimatedNumber value={s.value} suffix={s.suffix} />
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5 tracking-[0.22em] uppercase">{s.label}</div>
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
                    className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm tracking-[0.15em] uppercase text-black bg-white hover:bg-emerald-500 hover:text-white transition-colors shadow-[0_10px_40px_rgba(226,232,240,0.12)]"
                  >
                    <span>Upgrade My Workflow</span>
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>

                  <a
                    href="#roadmap"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-4 rounded-full border text-sm font-bold tracking-[0.15em] uppercase text-gray-300 hover:border-emerald-400/40 hover:text-emerald-300 transition-colors"
                    style={{ borderColor: `rgba(${SILVER_RGB},0.15)` }}
                  >
                    View Roadmap
                  </a>

                  {course.originalPrice && (
                    <span className="inline-flex items-center gap-2 text-xs text-gray-500">
                      <span className="line-through">₹{course.originalPrice.toLocaleString('en-IN')}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-bold">
                        {discount}% OFF
                      </span>
                    </span>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ ROI PANEL — the numbers section ═══════════ */}
        <section className="relative py-16 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-[#030507] via-[#050a0f] to-[#030507]" />
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <span
                className="text-[10px] sm:text-[11px] font-bold tracking-[0.32em] text-emerald-400 uppercase"
              >
                The Receipts
              </span>
              <h2
                className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold text-white"
                style={{ fontFamily: DISPLAY }}
              >
                What the 8 weeks compound into
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {ROI_ROWS.map((row, i) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl p-5 border"
                  style={{
                    borderColor: `rgba(${SILVER_RGB},0.1)`,
                    background: `rgba(${SILVER_RGB},0.02)`,
                  }}
                >
                  <div
                    className="text-3xl sm:text-4xl font-bold tabular-nums"
                    style={{
                      fontFamily: DISPLAY,
                      background: 'linear-gradient(to bottom, #ffffff 0%, #94a3b8 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {row.metric}
                  </div>
                  <div className="mt-2 text-[10px] tracking-[0.22em] uppercase text-emerald-400 font-bold">
                    {row.label}
                  </div>
                  <div className="mt-1 text-[11px] text-gray-500 leading-relaxed">{row.note}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ 8-WEEK ROADMAP ═══════════ */}
        <section id="roadmap" className="relative py-20 md:py-28">
          <div className="absolute inset-0 bg-[#030507]" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <span
                className="text-[10px] sm:text-[11px] font-bold tracking-[0.32em] text-emerald-400 uppercase"
              >
                The 8-Week Roadmap
              </span>
              <h2
                className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-white"
                style={{ fontFamily: DISPLAY }}
              >
                One shipped <span className="text-gray-500">deliverable</span>
                <br />
                per week.
              </h2>
            </motion.div>

            <div className="border-l-2 border-white/[0.06] pl-0">
              {MODULES.map((m, i) => (
                <motion.div
                  key={m.w}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: i * 0.04 }}
                  className="relative flex items-start gap-5 sm:gap-6 py-5 border-b border-white/[0.06] last:border-b-0 pl-6 sm:pl-8 -ml-px"
                >
                  {/* Week tick on the vertical rule */}
                  <div
                    className="absolute left-0 top-6 w-3 h-3 rounded-full -translate-x-[7px]"
                    style={{
                      background: '#030507',
                      border: '2px solid rgba(16,185,129,0.65)',
                      boxShadow: '0 0 10px rgba(16,185,129,0.4)',
                    }}
                  />
                  {/* Week number */}
                  <div
                    className="text-3xl sm:text-4xl font-bold tabular-nums shrink-0 w-14 sm:w-20"
                    style={{
                      fontFamily: DISPLAY,
                      background: 'linear-gradient(to bottom, #ffffff 0%, #94a3b8 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {m.w}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-base sm:text-lg font-bold text-white"
                      style={{ fontFamily: DISPLAY }}
                    >
                      {m.title}
                    </div>
                    <div className="mt-1 text-sm text-gray-400 leading-relaxed">{m.outcome}</div>
                  </div>
                  <div className="hidden sm:block shrink-0 text-[10px] text-emerald-400/70 tracking-[0.28em] uppercase pt-1" style={{ fontFamily: MONO }}>
                    ship
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ WHO THIS IS FOR ═══════════ */}
        <section className="py-16 md:py-20 relative">
          <div className="absolute inset-0 bg-[#050a0f]" />
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.32em] text-emerald-400 uppercase">
                Who sits in this room
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: DISPLAY }}>
                Two audiences. <span className="text-gray-500">One standard.</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {[
                {
                  title: 'The working professional',
                  points: [
                    'Salaried role, full inbox, short calendar',
                    'Wants 15–20 hours back a week',
                    'Week 4 (Business) + Week 5 (Automation) hit hardest',
                  ],
                },
                {
                  title: 'The ambitious student',
                  points: [
                    'BBA · B.Com · BA · IELTS aspirants',
                    'Wants portfolio + first paying client by Week 8',
                    'Week 2 (Research/SOP) + Week 7 (Freelancing) land first',
                  ],
                },
              ].map((col, i) => (
                <motion.div
                  key={col.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-6 md:p-7 rounded-2xl border"
                  style={{
                    borderColor: `rgba(${SILVER_RGB},0.1)`,
                    background: `rgba(${SILVER_RGB},0.015)`,
                  }}
                >
                  <h3 className="text-lg sm:text-xl font-bold text-white" style={{ fontFamily: DISPLAY }}>
                    {col.title}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {col.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-gray-300">
                        <span className="text-emerald-400 mt-0.5">›</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ ENROLL ═══════════ */}
        <section id="enroll" className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-[#030507]" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px]"
            style={{ background: 'rgba(16,185,129,0.08)' }}
          />

          <div className="relative z-10 max-w-md mx-auto px-4 sm:px-6">
            {step === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 backdrop-blur-md border rounded-2xl p-8 text-center"
                style={{ borderColor: 'rgba(16,185,129,0.3)' }}
              >
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-emerald-500/20">
                  <span className="text-4xl">✅</span>
                </div>
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: DISPLAY }}>
                  Seat Secured.
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
                  <span className="text-[10px] tracking-[0.32em] text-emerald-400 font-bold uppercase">
                    Cohort enrolment
                  </span>
                  <h2 className="mt-2 text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: DISPLAY }}>
                    Secure Your Seat
                  </h2>
                  <p className="text-gray-500 mt-2 text-sm">Limited · Monday start · WhatsApp onboarding</p>
                </div>

                <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8">
                  <div className="text-center mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-center justify-center gap-3">
                      {course.originalPrice && (
                        <span className="text-xl text-gray-600 line-through">
                          ₹{course.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span
                        className="text-5xl font-extrabold tabular-nums"
                        style={{
                          fontFamily: DISPLAY,
                          background: 'linear-gradient(to bottom, #ffffff 0%, #94a3b8 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        ₹{course.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {savings > 0 && (
                      <span className="inline-block mt-3 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-[0.18em] uppercase">
                        Save ₹{savings.toLocaleString('en-IN')} · {discount}% off
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleEnroll} className="space-y-4">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/30 transition-all"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Work Email"
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
                      className="w-full py-4 rounded-xl font-bold text-sm tracking-[0.18em] uppercase text-black bg-white hover:bg-emerald-500 hover:text-white transition-colors disabled:opacity-50"
                    >
                      {loading || step === 'paying'
                        ? 'Processing...'
                        : `Secure Seat · ₹${course.price.toLocaleString('en-IN')}`}
                    </button>
                  </form>

                  <div className="mt-5 flex items-center justify-center gap-3 text-[11px] text-gray-600">
                    <span>🔒 Secure</span>
                    <span>·</span>
                    <span>📜 Certificate</span>
                    <span>·</span>
                    <span>💬 WhatsApp Onboarding</span>
                  </div>

                  <div className="mt-4 text-center">
                    <a
                      href={`https://wa.me/919200882008?text=${encodeURIComponent(`Hi, I have a question about "${course.title}"`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-500 hover:text-emerald-300 transition-colors"
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
          <div className="absolute inset-0 bg-[#050a0f]" />
          <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-white text-center mb-8" style={{ fontFamily: DISPLAY }}>
              Quick Answers
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { q: 'Time commitment?', a: '~5 hours per week. Evening batches available.' },
                { q: 'Online or offline?', a: 'Offline in Kotkapura. Hands-on labs.' },
                { q: 'Any coding?', a: 'None. No-code only.' },
                { q: 'Miss a session?', a: 'Recording + notes on WhatsApp within 24h.' },
              ].map((faq) => (
                <div key={faq.q} className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
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
            style={{ background: 'rgba(16,185,129,0.1)' }}
          />
          <div className="relative z-10 px-4">
            <h2 className="text-3xl md:text-5xl font-bold" style={{ fontFamily: DISPLAY }}>
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(to bottom, #ffffff 0%, #94a3b8 100%)' }}
              >
                Your calendar won&apos;t clear itself.
              </span>
              <br />
              <span className="text-white">Eight weeks will.</span>
            </h2>
            <p className="mt-4 text-gray-500 text-sm tracking-[0.18em] uppercase">
              Monday start · limited cohort
            </p>
            <a
              href="#enroll"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-block mt-8 px-10 py-4 rounded-full text-black font-bold text-sm tracking-[0.18em] uppercase bg-white hover:bg-emerald-500 hover:text-white transition-colors shadow-[0_10px_40px_rgba(226,232,240,0.12)]"
            >
              Upgrade My Workflow
            </a>
          </div>
        </section>

        <footer className="py-6 pb-24 md:pb-6 border-t border-white/5 text-center">
          <p className="text-xs text-gray-600">
            {siteConfig.name} &middot; {siteConfig.contact.address} &middot; {siteConfig.contact.phone}
          </p>
        </footer>

        {/* Mobile sticky — executive-style split: stats strip above, compact CTA below */}
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#030507]/95 backdrop-blur-md border-t border-white/10">
          <div className="flex items-center justify-between px-4 py-1.5 border-b border-white/[0.05] text-[9px] tracking-[0.22em] uppercase">
            <span className="text-emerald-400 font-bold">ROI · 18h/wk</span>
            <span className="text-gray-700">·</span>
            <span className="text-gray-300 font-bold">Monday batch</span>
            <span className="text-gray-700">·</span>
            <span className="text-emerald-400 font-bold">Limited</span>
          </div>
          <div className="px-4 py-2.5 flex items-center justify-between">
            <div>
              {course.originalPrice && (
                <span className="text-xs text-gray-600 line-through mr-1">
                  ₹{course.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-lg font-bold text-white tabular-nums">
                ₹{course.price.toLocaleString('en-IN')}
              </span>
            </div>
            <a
              href="#enroll"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="px-5 py-2 rounded-full text-black font-bold text-[11px] tracking-[0.18em] uppercase bg-white"
            >
              Secure Seat
            </a>
          </div>
        </div>
      </div>

      <AskTara />
      <ExitIntentPopup courseTitle={course.title} courseSlug={course.slug} primaryColor="#10b981" />
      <EnrollmentToast />
    </>
  )
}
