'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { motion } from 'framer-motion'
import type { Course } from '@/config/courses'
import { siteConfig } from '@/config/site'
import { getOnlineCourseLink } from '@/lib/course-mapping'
import { ExitIntentPopup } from './exit-intent-popup'
import { EnrollmentToast } from './enrollment-toast'
import { FreeSessionHook } from './free-session-hook'
import { AskTara } from '@/components/chatbot/ask-tara'
import { trackEvent } from '@/components/analytics/meta-pixel'

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type Step = 'form' | 'paying' | 'success'

export interface ThemeColors {
  primary: string // e.g. '#10b981' - hex color
  primaryRgb: string // e.g. '16,185,129'
  gradientFrom: string
  gradientVia: string
  gradientTo: string
}

export interface AudienceCard {
  emoji: string
  title: string
  subtitle: string
}

export interface BeforeAfterRow {
  before: string
  after: string
}

export interface StatCard {
  value: number
  suffix: string
  label: string
  prefix?: string
}

export interface LearningCard {
  icon: string
  title: string
  desc: string
}

export interface IncomePath {
  emoji: string
  title: string
  amount: string
  examples: string[]
}

export interface ValueItem {
  icon: string
  item: string
  desc: string
}

export interface CourseLandingProps {
  course: Course
  theme: ThemeColors
  trustBadge: string
  hook: {
    punjabi: string
    translation: string
  }
  headlineWhite: string
  headlineGradient: string
  subtitle: string
  subSubtitle: string
  stats: StatCard[]
  audience: AudienceCard[]
  audienceLabel: string
  beforeAfter: BeforeAfterRow[]
  differentiators: { icon: string; text: string }[]
  learnCards: LearningCard[]
  learnTitle: string
  learnSubtitle: string
  incomePaths: IncomePath[]
  valueItems: ValueItem[]
  totalValue: string
  finalCtaText: string
  finalCtaGradient: string
  children?: React.ReactNode
}

export function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
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

export function CourseLandingShared(props: CourseLandingProps) {
  const {
    course, theme, trustBadge, hook, headlineWhite, headlineGradient, subtitle, subSubtitle,
    stats, audience, audienceLabel, beforeAfter, differentiators, learnCards, learnTitle,
    learnSubtitle, incomePaths, valueItems, totalValue, finalCtaText, finalCtaGradient, children,
  } = props

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
    // Meta Pixel: lead captured, checkout starting
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
        prefill: { name, email, contact: phone }, theme: { color: theme.primary },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...response, courseSlug: course.slug, courseTitle: course.title, studentName: name, studentEmail: email, studentPhone: phone, amount: course.price }),
          })
          if (verifyRes.ok) {
            const d = await verifyRes.json()
            setPaymentId(d.paymentId)
            setStep('success')
            // Meta Pixel: successful purchase
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
  const onlineLink = getOnlineCourseLink(course.slug)

  // Inline style helpers using theme
  const primaryBg = (opacity: number) => ({ backgroundColor: `rgba(${theme.primaryRgb},${opacity})` })
  const primaryBorder = (opacity: number) => ({ borderColor: `rgba(${theme.primaryRgb},${opacity})` })
  const primaryText = { color: theme.primary }
  const gradient = { backgroundImage: `linear-gradient(to right, ${theme.gradientFrom}, ${theme.gradientVia}, ${theme.gradientTo})` }
  const gradientFromTo = { backgroundImage: `linear-gradient(to right, ${theme.gradientFrom}, ${theme.gradientTo})` }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="min-h-screen bg-[#020617] overflow-hidden">
        {/* HERO */}
        <section className="relative min-h-[90vh] md:min-h-[85vh] flex items-center">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[150px] animate-pulse" style={{ background: `rgba(${theme.primaryRgb},0.15)` }} />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[130px] animate-pulse" style={{ background: `rgba(${theme.primaryRgb},0.10)`, animationDelay: '1s' }} />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 w-full">
            {/* Logo */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo-tarahut-white.png" alt="TARAhut AI Labs" className="h-8 sm:h-10 w-auto" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm" style={primaryBorder(0.3)}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.primary }} />
                <span className="font-medium" style={primaryText}>{trustBadge}</span>
              </span>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]" style={{ fontFamily: 'var(--font-display), Georgia, serif' }}>
                <span className="text-white">{headlineWhite}</span>
                <br />
                <span className="bg-clip-text text-transparent" style={gradient}>
                  {headlineGradient}
                </span>
              </h1>
              <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-300 font-medium">{subtitle}</p>
              <p className="mt-2 text-sm text-gray-500">{subSubtitle}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-10 flex justify-center gap-3 sm:gap-5 flex-wrap">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center px-4 sm:px-5 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm min-w-[100px]">
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {stat.prefix}<AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Primary conversion hook — the free-session entry point is the
                  highest-intent first touch and skips any price question up
                  front. Keeps the secondary "Explore Syllabus" scroll link
                  for visitors who want to see what they'd be committing to
                  before clicking through. */}
              <FreeSessionHook courseSlug={course.slug} />
              <a
                href="#enroll"
                onClick={(e) => { e.preventDefault(); document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="px-8 py-4 rounded-2xl border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
              >
                Explore Syllabus →
              </a>
            </motion.div>

            {course.originalPrice && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-6 text-center">
                <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                  <span className="line-through">₹{course.originalPrice.toLocaleString('en-IN')}</span>
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold text-xs animate-pulse">{discount}% OFF</span>
                </span>
              </motion.div>
            )}
          </div>
        </section>

        {/* HOOK + AUDIENCE + BEFORE/AFTER */}
        <section className="py-14 md:py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617] to-[#0a1628]" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <div className="inline-block px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/20">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-amber-300" style={{ fontFamily: 'var(--font-display), Georgia, serif' }}>
                  &ldquo;{hook.punjabi}&rdquo;
                </p>
                <p className="text-sm sm:text-base text-amber-100/70 mt-1">{hook.translation}</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
              <span className="text-sm font-semibold tracking-wider uppercase" style={primaryText}>{audienceLabel}</span>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-4">
              {audience.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-colors"
                >
                  <span className="text-3xl">{item.emoji}</span>
                  <h3 className="text-white font-bold mt-2 text-sm">{item.title}</h3>
                  <p className="text-gray-400 text-xs mt-1">{item.subtitle}</p>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="text-center pb-2">
                  <span className="px-4 py-1.5 rounded-full bg-red-500/15 text-red-400 text-xs font-bold uppercase">Before</span>
                </div>
                <div className="text-center pb-2">
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase" style={{ ...primaryBg(0.15), ...primaryText }}>After</span>
                </div>
                {beforeAfter.map((row, i) => (
                  <React.Fragment key={i}>
                    <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.1 }}
                      className="p-3 sm:p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-sm text-gray-400">
                      {row.before}
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.1 }}
                      className="p-3 sm:p-4 rounded-xl border text-sm text-white font-medium"
                      style={{ ...primaryBg(0.05), ...primaryBorder(0.1) }}>
                      {row.after}
                    </motion.div>
                  </React.Fragment>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 flex flex-wrap justify-center gap-3">
              {differentiators.map((d) => (
                <span key={d.text} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 font-medium">
                  <span>{d.icon}</span> {d.text}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* UNIQUE INTERACTIVE TOOL (children) */}
        <div id="try-tool">{children}</div>

        {/* WHAT YOU'LL LEARN */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0a1628] to-[#020617]" />
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
              <span className="text-sm font-semibold tracking-wider uppercase" style={primaryText}>{learnSubtitle}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">{learnTitle}</h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {learnCards.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="el-glass-card p-5 md:p-6"
                >
                  <span className="text-3xl">{item.icon}</span>
                  <h3 className="mt-3 text-white font-bold text-base">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SYLLABUS */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-[#0B1120]" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
              <span className="text-sm font-semibold tracking-wider uppercase" style={primaryText}>Your Journey</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">{course.duration} Roadmap</h2>
            </motion.div>
            <div className="space-y-6">
              {course.syllabus.map((mod, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="relative pl-8 md:pl-12">
                  {i < course.syllabus.length - 1 && (
                    <div className="absolute left-[13px] md:left-[21px] top-10 bottom-[-24px] w-0.5" style={primaryBg(0.2)} />
                  )}
                  <div className="absolute left-0 md:left-2 top-1 w-7 h-7 rounded-full border-2 flex items-center justify-center"
                    style={{ ...primaryBg(0.2), borderColor: theme.primary }}>
                    <span className="text-xs font-bold text-white">{i + 1}</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6">
                    <h3 className="font-bold text-white text-base md:text-lg">{mod.module}</h3>
                    <div className="mt-3 space-y-1.5">
                      {mod.topics.slice(0, 3).map((topic, j) => (
                        <p key={j} className="text-xs md:text-sm text-gray-400 flex items-start gap-2">
                          <span className="mt-0.5" style={primaryText}>▸</span>
                          {topic.length > 100 ? topic.slice(0, 97) + '...' : topic}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW YOU WILL EARN */}
        {incomePaths.length > 0 && (
          <section className="py-16 md:py-24 relative">
            <div className="absolute inset-0 bg-[#020617]" />
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10">
                <span className="text-amber-400 text-sm font-semibold tracking-wider uppercase">Real Earnings</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">How You&apos;ll Earn</h2>
              </motion.div>
              <div className="grid sm:grid-cols-3 gap-4">
                {incomePaths.map((path, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <span className="text-3xl">{path.emoji}</span>
                    <h3 className="text-white font-bold mt-3">{path.title}</h3>
                    <p className="text-emerald-400 font-bold text-lg mt-1">{path.amount}</p>
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
        )}

        {/* WHAT YOU GET */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-[#0B1120]" />
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10">
              <span className="text-sm font-semibold tracking-wider uppercase" style={primaryText}>Everything Included</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">What You Get</h2>
            </motion.div>
            <div className="space-y-3">
              {valueItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="el-glass-card-subtle flex items-start gap-4 p-4"
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
                Total value: <span className="line-through">{totalValue}</span>{' '}
                <span className="text-white font-bold">All included in ₹{course.price.toLocaleString('en-IN')}</span>
              </p>
            </motion.div>
          </div>
        </section>

        {/* ENROLLMENT FORM */}
        <section id="enroll" className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0a1628] to-[#020617]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px]" style={{ background: `rgba(${theme.primaryRgb},0.08)` }} />

          <div className="relative z-10 max-w-md mx-auto px-4 sm:px-6">
            {step === 'success' ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 backdrop-blur-md rounded-3xl p-8 text-center border"
                style={primaryBorder(0.3)}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={primaryBg(0.2)}>
                  <span className="text-4xl">🎉</span>
                </div>
                <h2 className="text-2xl font-bold text-white">You&apos;re In!</h2>
                <p className="text-gray-400 mt-2 mb-1">Welcome to {course.title}</p>
                <p className="text-xs text-gray-600 mb-6">Payment ID: {paymentId}</p>
                <p className="text-gray-400 text-sm mb-6">We&apos;ll WhatsApp you within 2 hours with batch details.</p>
                <a href={`https://wa.me/919200882008?text=${encodeURIComponent(`Hi! I just enrolled in "${course.title}". Payment ID: ${paymentId}. Please share batch details.`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-block px-6 py-3 rounded-xl text-white font-medium transition-opacity hover:opacity-90"
                  style={{ backgroundColor: theme.primary }}>
                  Message on WhatsApp →
                </a>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Start Your Journey</h2>
                  <p className="text-gray-500 mt-2 text-sm">Limited seats per batch</p>
                </div>
                <div className="el-glass-card p-6 sm:p-8" style={{ borderRadius: '1.5rem' }}>
                  <div className="text-center mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-center justify-center gap-3">
                      {course.originalPrice && (
                        <span className="text-xl text-gray-600 line-through">₹{course.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                      <span className="text-5xl font-extrabold bg-clip-text text-transparent" style={gradientFromTo}>
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
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Full Name" required
                      className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none"
                      onFocus={(e) => { e.currentTarget.style.borderColor = theme.primary }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }} />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required
                      className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none"
                      onFocus={(e) => { e.currentTarget.style.borderColor = theme.primary }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }} />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="WhatsApp Number"
                      className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none"
                      onFocus={(e) => { e.currentTarget.style.borderColor = theme.primary }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }} />
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    <button type="submit" disabled={loading || step === 'paying'}
                      className="w-full py-4 rounded-xl font-bold text-lg text-white relative overflow-hidden disabled:opacity-50">
                      <div className="absolute inset-0" style={gradient} />
                      <span className="relative">
                        {loading || step === 'paying' ? '⏳ Processing...' : `Enroll Now — ₹${course.price.toLocaleString('en-IN')}`}
                      </span>
                    </button>
                  </form>
                  <div className="mt-5 flex items-center justify-center gap-3 text-[11px] text-gray-600">
                    <span>🔒 Secure</span><span>•</span><span>📜 Certificate</span><span>•</span><span>💬 Support</span>
                  </div>
                  <div className="mt-4 text-center">
                    <a href={`https://wa.me/919200882008?text=${encodeURIComponent(`Hi, I have a question about "${course.title}"`)}`}
                      target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-white transition-colors">
                      Have questions? Chat with us →
                    </a>
                  </div>
                </div>

                {/* Self-paced online alternative — cheaper path for students
                    who can't (or don't want to) commit to the offline batch. */}
                {onlineLink && (
                  <Link
                    href={onlineLink.href}
                    className="group mt-4 flex items-center justify-between gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 px-5 py-3.5 text-sm text-cyan-200 transition hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-100"
                  >
                    <span>
                      <span className="font-semibold">Prefer self-paced online?</span>{' '}
                      Get it for ₹{onlineLink.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-base transition-transform group-hover:translate-x-0.5">→</span>
                  </Link>
                )}
              </motion.div>
            )}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 relative text-center">
          <div className="absolute inset-0 bg-[#020617]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[150px]" style={{ background: `rgba(${theme.primaryRgb},0.1)` }} />
          <div className="relative z-10 px-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">
              {finalCtaText}<br />
              <span className="bg-clip-text text-transparent" style={gradientFromTo}>
                {finalCtaGradient}
              </span>
            </h2>
            <a href="#enroll" onClick={(e) => { e.preventDefault(); document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="inline-block mt-8 px-10 py-4 rounded-2xl text-white font-bold text-lg hover:scale-105 transition-transform"
              style={{ ...gradientFromTo, boxShadow: `0 10px 40px rgba(${theme.primaryRgb},0.3)` }}>
              Enroll Now →
            </a>
          </div>
        </section>

        <footer className="py-6 pb-24 md:pb-6 border-t border-white/5 text-center">
          <p className="text-xs text-gray-600">{siteConfig.name} &middot; {siteConfig.contact.address} &middot; {siteConfig.contact.phone}</p>
        </footer>

        {/* Mobile sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#020617]/95 backdrop-blur-md border-t border-white/10 px-4 py-3 flex items-center justify-between">
          <div>
            {course.originalPrice && <span className="text-xs text-gray-600 line-through mr-1">₹{course.originalPrice.toLocaleString('en-IN')}</span>}
            <span className="text-lg font-bold text-white">₹{course.price.toLocaleString('en-IN')}</span>
          </div>
          <a href="#enroll" onClick={(e) => { e.preventDefault(); document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="px-6 py-2.5 rounded-xl text-white font-bold text-sm"
            style={gradientFromTo}>
            Enroll Now
          </a>
        </div>
      </div>

      {/* Conversion boosters */}
      <AskTara />
      <ExitIntentPopup courseTitle={course.title} courseSlug={course.slug} primaryColor={theme.primary} />
      <EnrollmentToast />
    </>
  )
}
