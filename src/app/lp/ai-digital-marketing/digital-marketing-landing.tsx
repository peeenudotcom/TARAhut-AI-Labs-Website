'use client'

import React, { useState } from 'react'
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

const VIRAL_STYLES = `
  @keyframes viral-pulse {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  .viral-heatmap-node {
    position: absolute;
    background: radial-gradient(circle, rgba(217, 70, 239, 0.85) 0%, transparent 70%);
    width: 100px;
    height: 100px;
    border-radius: 50%;
    pointer-events: none;
    mix-blend-mode: screen;
    animation: viral-pulse 2s infinite;
  }
  .viral-magenta-glow {
    text-shadow: 0 0 20px rgba(217, 70, 239, 0.4);
  }
`

// ─── SHARED PIECES ───

function IgMockup() {
  return (
    <div className="w-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-fuchsia-500 via-pink-500 to-amber-400 p-[2px]">
            <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-sm">🥤</div>
          </div>
          <div className="leading-tight">
            <p className="text-xs font-semibold text-white">ludhiana_cafe</p>
            <p className="text-[10px] text-zinc-500">Sponsored · Ad</p>
          </div>
        </div>
        <span className="text-zinc-500 text-lg">⋯</span>
      </div>
      {/* Body */}
      <div className="aspect-square flex flex-col items-center justify-center gap-3 p-8 bg-gradient-to-br from-zinc-900 to-black text-center">
        <span className="text-6xl md:text-7xl">🥤🍔</span>
        <p className="text-white font-extrabold text-2xl md:text-3xl leading-tight">BUY 1<br/>GET 1 FREE</p>
        <p className="text-zinc-400 text-xs md:text-sm">Weekend only · Model Town</p>
      </div>
      {/* Actions */}
      <div className="px-4 py-3 border-t border-white/5">
        <div className="flex gap-4 mb-2 text-xl">
          <span>♡</span><span>💬</span><span>↗</span>
        </div>
        <p className="text-xs text-zinc-400">
          <span className="font-semibold text-white">ludhiana_cafe</span> Fresh burgers, cold drinks, and a killer weekend deal.
        </p>
        <p className="text-xs text-sky-400 mt-1">#ludhianafood #weekendvibes #burgers</p>
      </div>
    </div>
  )
}

function StepIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400">
      {children}
    </div>
  )
}

// ─── MAIN ───

export function DigitalMarketingLanding({ course }: { course: Course }) {
  const [step, setStep] = useState<Step>('form')
  const [showHeatmap, setShowHeatmap] = useState(false)
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
        prefill: { name, email, contact: phone }, theme: { color: '#d946ef' },
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

  function scrollToEnroll() {
    document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: VIRAL_STYLES }} />
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
              className="min-h-12 px-5 sm:px-6 rounded-full bg-fuchsia-500 text-black font-bold text-sm hover:bg-fuchsia-400 transition-colors shadow-[0_0_20px_rgba(217,70,239,0.35)]"
            >
              Get Started →
            </button>
          </div>
        </nav>

        {/* ═══════════ HERO — VIRAL ENGINE ═══════════ */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-20 relative">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(#d946ef 1px, transparent 1px), linear-gradient(90deg, #d946ef 1px, transparent 1px)',
              backgroundSize: '100px 100px',
            }}
          />

          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 text-fuchsia-500 font-bold tracking-widest uppercase text-sm mb-4 viral-magenta-glow"
          >
            Data-Driven Creativity
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative z-10 text-5xl md:text-7xl lg:text-8xl text-center mb-6 leading-[1.05] font-bold"
            style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
          >
            Scale Ads <span className="text-fuchsia-500">3×</span>
            <br />
            <span className="text-emerald-500">with AI That Predicts Viral.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 text-zinc-400 text-center max-w-2xl text-base md:text-lg mb-12"
          >
            See where eyes land before you spend ₹1 on ads.
            Master the attention triggers that turn scrolls into sales.
          </motion.p>

          {/* VIRAL COMPARISON SLIDER */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative z-10 w-full max-w-md md:max-w-xl"
          >
            <h3 className="text-center mb-6 text-zinc-500 uppercase text-xs tracking-widest">
              Toggle AI Attention Heatmap
            </h3>

            <div className="rounded-3xl overflow-hidden relative shadow-2xl border border-fuchsia-500/20 bg-white/[0.03] backdrop-blur-sm">
              <div className={`transition-all duration-500 ${showHeatmap ? '' : 'grayscale opacity-40'}`}>
                <IgMockup />
              </div>

              {/* Heatmap overlay */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${showHeatmap ? 'opacity-100' : 'opacity-0'}`}
                aria-hidden={!showHeatmap}
              >
                <div className="viral-heatmap-node" style={{ top: '32%', left: '28%' }} />
                <div className="viral-heatmap-node" style={{ top: '42%', left: '54%', width: 160, height: 160 }} />
                <div className="viral-heatmap-node" style={{ top: '82%', left: '18%' }} />
              </div>

              {/* Toggle — 48px min for tap target */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setShowHeatmap((v) => !v)}
                  className={`min-h-12 px-7 rounded-full font-bold shadow-xl hover:scale-105 transition-transform ${
                    showHeatmap ? 'bg-fuchsia-500 text-black' : 'bg-white text-black'
                  }`}
                >
                  {showHeatmap ? 'Hide Analysis' : 'Show AI Analysis'}
                </button>
              </div>

              {/* Labels */}
              <div className="absolute bottom-3 left-3 bg-black/70 px-3 py-1 rounded-lg text-[10px] font-bold text-white">
                BEFORE: LOW ATTENTION
              </div>
              <div
                className={`absolute bottom-3 right-3 bg-fuchsia-500 px-3 py-1 rounded-lg text-[10px] font-bold text-black transition-opacity ${
                  showHeatmap ? 'opacity-100' : 'opacity-0'
                }`}
              >
                AI-OPTIMIZED · 89%
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-zinc-500 md:hidden">
              Tap to see where people look first.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            onClick={scrollToEnroll}
            className="relative z-10 mt-12 bg-fuchsia-500 text-black px-10 md:px-12 min-h-14 md:min-h-16 rounded-full font-black text-lg md:text-xl shadow-[0_0_40px_rgba(217,70,239,0.35)] hover:scale-105 transition-transform w-full max-w-sm"
          >
            GET THE VIRAL BLUEPRINT
          </motion.button>

          {course.originalPrice && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="relative z-10 mt-6 text-center"
            >
              <span className="inline-flex items-center gap-2 text-sm text-zinc-500">
                <span className="line-through">₹{course.originalPrice.toLocaleString('en-IN')}</span>
                <span className="text-white font-bold">₹{course.price.toLocaleString('en-IN')}</span>
                <span className="px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 font-bold text-xs">
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
              Trained on the tools that run the ad world
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 gap-y-4 opacity-60 grayscale">
              {['Meta', 'Google Ads', 'Instagram', 'ChatGPT', 'Claude', 'Canva'].map((brand) => (
                <span key={brand} className="text-zinc-400 font-bold text-sm sm:text-base tracking-tight">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ PROCESS PATH ═══════════ */}
        <section className="py-16 md:py-24 relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-fuchsia-500 text-xs font-bold tracking-widest uppercase">How It Works</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                Three steps to growth.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative">
              {/* Connector line (desktop) */}
              <div className="hidden md:block absolute top-7 left-[16%] right-[16%] h-px bg-gradient-to-r from-fuchsia-500/0 via-fuchsia-500/40 to-fuchsia-500/0" />

              {[
                {
                  num: '01',
                  title: 'Connect Data',
                  desc: 'Plug in your business, audience, and existing content. AI reads the signal.',
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>
                    </svg>
                  ),
                },
                {
                  num: '02',
                  title: 'AI Analyzes',
                  desc: 'Attention heatmaps, viral pattern matching, and audience prediction — in seconds.',
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/>
                    </svg>
                  ),
                },
                {
                  num: '03',
                  title: 'Growth Happens',
                  desc: 'Ship campaigns that convert. Track ROI. Scale what works.',
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
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
              <span className="text-emerald-500 text-xs font-bold tracking-widest uppercase">The Stack</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                An AI lab for marketers.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-4 md:gap-5 md:h-[520px]">
              {/* Card 1 — big */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="md:col-span-4 md:row-span-1 rounded-3xl p-6 md:p-8 bg-gradient-to-br from-fuchsia-500/10 via-fuchsia-500/[0.03] to-transparent border border-fuchsia-500/20 relative overflow-hidden"
              >
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-fuchsia-500/10 blur-3xl rounded-full" />
                <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-400">Attention Prediction</span>
                <h3 className="mt-3 text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                  See the heatmap before you post.
                </h3>
                <p className="mt-3 text-sm text-zinc-400 max-w-md">
                  Score every creative 0–100 on attention. Iterate before ad spend, not after.
                </p>
              </motion.div>

              {/* Card 2 — tall */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 }}
                className="md:col-span-2 md:row-span-2 rounded-3xl p-6 md:p-8 bg-gradient-to-br from-emerald-500/10 via-emerald-500/[0.03] to-transparent border border-emerald-500/20 relative overflow-hidden flex flex-col"
              >
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">AI Copywriting</span>
                <h3 className="mt-3 text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                  Hook, body, CTA —<br/>drafted in 10 seconds.
                </h3>
                <div className="mt-auto pt-6 space-y-2">
                  {['Meta ad variants', 'WhatsApp broadcasts', 'Landing page hero'].map((x) => (
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
                <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-400">Viral Trends</span>
                <h3 className="mt-2 text-lg font-bold text-white">Reads Reels, Shorts, TikTok daily.</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Know what&rsquo;s about to trend before your competitors do.
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
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Auto-Targeting</span>
                <h3 className="mt-2 text-lg font-bold text-white">Meta + Google audience builder.</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Interests, lookalikes, geo — structured for you.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════ ENROLLMENT ═══════════ */}
        <section id="enroll" className="py-16 md:py-24 relative border-t border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-[#030406] via-[#1a0820] to-[#030406]" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px]"
            style={{ background: 'rgba(217,70,239,0.08)' }}
          />

          <div className="relative z-10 max-w-md mx-auto px-4 sm:px-6">
            {step === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 backdrop-blur-md border border-fuchsia-400/30 rounded-3xl p-8 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-fuchsia-500/20 flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🎉</span>
                </div>
                <h2 className="text-2xl font-bold text-white">You&apos;re In!</h2>
                <p className="text-zinc-400 mt-2 mb-1">Welcome to AI for Digital Marketing</p>
                <p className="text-xs text-zinc-600 mb-6">Payment ID: {paymentId}</p>
                <p className="text-zinc-400 text-sm mb-6">
                  We&apos;ll WhatsApp you within 2 hours with batch details.
                </p>
                <a
                  href={`https://wa.me/919200882008?text=${encodeURIComponent(`Hi! I just enrolled in AI for Digital Marketing. Payment ID: ${paymentId}. Please share batch details.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block min-h-12 px-6 py-3 rounded-xl bg-fuchsia-500 text-black font-bold hover:bg-fuchsia-400 transition-colors"
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
                    Claim the <span className="text-fuchsia-500">Viral Blueprint</span>
                  </h2>
                  <p className="text-zinc-500 mt-2 text-sm">Limited seats per batch</p>
                </div>

                <div id="enroll-form" className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8">
                  <div className="text-center mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-center justify-center gap-3">
                      {course.originalPrice && (
                        <span className="text-xl text-zinc-600 line-through">
                          ₹{course.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span className="text-5xl font-extrabold text-fuchsia-500 viral-magenta-glow">
                        ₹{course.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {savings > 0 && (
                      <span className="inline-block mt-3 px-4 py-1.5 rounded-full bg-fuchsia-500/15 border border-fuchsia-400/30 text-fuchsia-200 text-xs font-bold">
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
                      className="w-full min-h-12 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:border-fuchsia-400 focus:outline-none transition-all"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      required
                      className="w-full min-h-12 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:border-fuchsia-400 focus:outline-none transition-all"
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="WhatsApp Number"
                      className="w-full min-h-12 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:border-fuchsia-400 focus:outline-none transition-all"
                    />

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <button
                      type="submit"
                      disabled={loading || step === 'paying'}
                      className="w-full min-h-14 py-4 rounded-xl font-bold text-lg text-black bg-fuchsia-500 hover:bg-fuchsia-400 disabled:opacity-50 shadow-[0_0_30px_rgba(217,70,239,0.3)] transition-all"
                    >
                      {loading || step === 'paying'
                        ? '⏳ Processing...'
                        : `Enroll Now — ₹${course.price.toLocaleString('en-IN')}`}
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

      {/* Conversion boosters */}
      <AskTara />
      <ExitIntentPopup courseTitle={course.title} courseSlug={course.slug} primaryColor="#d946ef" />
      <EnrollmentToast />
    </>
  )
}
