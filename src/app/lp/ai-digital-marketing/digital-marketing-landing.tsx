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

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type Step = 'form' | 'paying' | 'success'

interface AdCampaign {
  headline: string
  primary_text: string
  cta: string
  target_audience: string
  hashtags: string[]
  best_platform: string
  estimated_reach: string
}

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

// ═══════════ AI AD CAMPAIGN GENERATOR ═══════════
const exampleBusinesses = [
  'Sweet shop in Ludhiana',
  'Yoga studio for women',
  'Mobile accessories store',
  'Online coaching for IELTS',
  'Homemade Punjabi snacks delivery',
]

function AdCampaignGenerator() {
  const [business, setBusiness] = useState('')
  const [campaign, setCampaign] = useState<AdCampaign | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate() {
    if (!business.trim() || business.trim().length < 3) return
    setLoading(true)
    setCampaign(null)
    setError('')
    try {
      const res = await fetch('/api/ad-campaign-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business }),
      })
      const data = await res.json()
      if (res.ok) setCampaign(data.result)
      else setError(data.error || 'Something went wrong')
    } catch { setError('Network error') }
    setLoading(false)
  }

  return (
    <section className="py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#1a0f2e] to-[#020617]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[150px]" style={{ background: 'rgba(236,72,153,0.1)' }} />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/30 text-xs font-bold text-pink-300 mb-4">
            🔥 FREE AI TOOL — No signup required
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">
            Watch AI Create a Complete<br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Ad Campaign in 15 Seconds
            </span>
          </h2>
          <p className="text-gray-400 mt-4 text-base md:text-lg max-w-xl mx-auto">
            Type your business. AI generates a complete Facebook/Instagram ad — headline, copy, CTA, targeting, hashtags. Ready to run.
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
            {exampleBusinesses.map((ex) => (
              <button
                key={ex}
                onClick={() => setBusiness(ex)}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:border-pink-400/30 hover:text-pink-300 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleGenerate() }}
              placeholder="e.g. 'Clothing store in Ludhiana'"
              className="flex-1 px-4 py-3 rounded-xl bg-[#020617] border border-white/10 text-white placeholder-gray-600 focus:border-pink-400 focus:outline-none transition-colors text-sm"
            />
            <button
              onClick={handleGenerate}
              disabled={loading || business.trim().length < 3}
              className="group px-6 py-3 rounded-xl font-bold text-sm text-white relative overflow-hidden disabled:opacity-40 shrink-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-fuchsia-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative">
                {loading ? '✨ Generating...' : '✨ Generate'}
              </span>
            </button>
          </div>

          {error && <p className="mt-3 text-red-400 text-sm text-center">{error}</p>}

          {/* Instagram Ad Preview */}
          {campaign && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              {/* Ad mockup */}
              <div className="mx-auto max-w-sm bg-white rounded-2xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-yellow-500 p-0.5">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-gray-800">
                        🏪
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">your_business</p>
                      <p className="text-[10px] text-gray-500">Sponsored &middot; Ad</p>
                    </div>
                  </div>
                  <span className="text-gray-400 text-lg">⋯</span>
                </div>
                {/* Image placeholder */}
                <div className="aspect-square bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 flex items-center justify-center p-6">
                  <p className="text-white font-bold text-xl text-center leading-tight">
                    {campaign.headline}
                  </p>
                </div>
                {/* Actions */}
                <div className="p-3 border-b border-gray-100">
                  <div className="flex gap-3 mb-2">
                    <span className="text-xl">♡</span>
                    <span className="text-xl">💬</span>
                    <span className="text-xl">✈</span>
                  </div>
                  <p className="text-xs text-gray-900">
                    <span className="font-semibold">your_business</span>{' '}
                    <span className="text-gray-700">{campaign.primary_text}</span>
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {campaign.hashtags.map((h) => `#${h}`).join(' ')}
                  </p>
                </div>
                {/* CTA button */}
                <div className="p-3 bg-gray-50">
                  <button className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold">
                    {campaign.cta}
                  </button>
                </div>
              </div>

              {/* Campaign details */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Best Platform</p>
                  <p className="text-sm text-white font-semibold mt-1">{campaign.best_platform}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Estimated Reach</p>
                  <p className="text-sm text-white font-semibold mt-1">{campaign.estimated_reach}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 col-span-2">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Target Audience</p>
                  <p className="text-sm text-white mt-1">{campaign.target_audience}</p>
                </div>
              </div>

              {/* Hook */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-5 p-5 rounded-xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 border border-white/10 text-center"
              >
                <p className="text-white font-bold text-sm md:text-base">
                  AI just created a complete ad in 15 seconds.
                </p>
                <p className="text-gray-300 text-sm mt-2">
                  Imagine running campaigns like this for{' '}
                  <span className="text-pink-400 font-bold">10 clients × ₹5,000/month</span>
                  <br />
                  <span className="text-emerald-400 font-bold text-lg">= ₹50,000/month income.</span>
                </p>
                <a
                  href="#enroll"
                  onClick={(e) => { e.preventDefault(); document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="inline-block mt-4 px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-sm hover:scale-105 transition-transform"
                >
                  Learn This in 12 Weeks →
                </a>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

// ═══════════ MAIN LANDING PAGE ═══════════
export function DigitalMarketingLanding({ course }: { course: Course }) {
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
        prefill: { name, email, contact: phone }, theme: { color: '#db2777' },
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

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="min-h-screen bg-[#020617] overflow-hidden">
        {/* ═══════════ HERO ═══════════ */}
        <section className="relative min-h-[90vh] md:min-h-[85vh] flex items-center">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[150px] animate-pulse" style={{ background: 'rgba(236,72,153,0.15)' }} />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[130px] animate-pulse" style={{ background: 'rgba(139,92,246,0.12)', animationDelay: '1s' }} />
            <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full blur-[100px] animate-pulse" style={{ background: 'rgba(6,182,212,0.08)', animationDelay: '2s' }} />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 w-full">
            {/* Logo */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo-tarahut-white.png" alt="TARAhut AI Labs" className="h-8 sm:h-10 w-auto" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/30 text-sm">
                <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
                <span className="text-pink-300 font-medium">🔥 Just Launched · First Batch Open</span>
              </span>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]" style={{ fontFamily: 'var(--font-display), Georgia, serif' }}>
                <span className="text-white">AI for Digital</span>
                <br />
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Marketing
                </span>
              </h1>
              <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-300 font-medium">
                Earn ₹20K–₹1L/month as a Freelance Marketer
              </p>
              <p className="mt-2 text-sm text-gray-500">
                12 Weeks · Hands-on Live Projects · Real Clients by Week 10
              </p>
            </motion.div>

            {/* Marketing stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-10 flex justify-center gap-3 sm:gap-5 flex-wrap">
              {[
                { value: 50, suffix: 'K/mo', label: 'Avg Freelancer Income', color: 'from-pink-400 to-pink-600' },
                { value: 800, suffix: 'M+', label: 'Meta Users in India', color: 'from-purple-400 to-purple-600' },
                { value: 12, suffix: ' Weeks', label: 'To Earning-Ready', color: 'from-cyan-400 to-blue-500' },
              ].map((stat) => (
                <div key={stat.label} className="text-center px-4 sm:px-5 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm min-w-[100px]">
                  <div className={`text-xl sm:text-2xl font-bold bg-gradient-to-b ${stat.color} bg-clip-text text-transparent`}>
                    {stat.suffix.startsWith('K') && '₹'}<AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#try-tool"
                onClick={(e) => { e.preventDefault(); document.getElementById('try-tool')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="group relative px-8 py-4 rounded-2xl font-semibold text-lg text-white overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-fuchsia-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-2">
                  ✨ Try Our Free AI Tool
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </a>
              <a
                href="#enroll"
                onClick={(e) => { e.preventDefault(); document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="px-8 py-4 rounded-2xl border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
              >
                Enroll Now → ₹{course.price.toLocaleString('en-IN')}
              </a>
            </motion.div>

            {course.originalPrice && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-6 text-center">
                <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                  <span className="line-through">₹{course.originalPrice.toLocaleString('en-IN')}</span>
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold text-xs animate-pulse">
                    {discount}% OFF — Only Today
                  </span>
                </span>
              </motion.div>
            )}
          </div>

          <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </section>

        {/* ═══════════ PUNJABI HOOK + WHO IS THIS FOR ═══════════ */}
        <section className="py-14 md:py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617] to-[#1a0f2e]" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <div className="inline-block px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/20">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-amber-300" style={{ fontFamily: 'var(--font-display), Georgia, serif' }}>
                  &ldquo;Degree hai, par job nahi...&rdquo;
                </p>
                <p className="text-sm sm:text-base text-amber-100/70 mt-1">
                  ...kyun na khud ka marketing business shuru karein?
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
              <span className="text-pink-400 text-sm font-semibold tracking-wider uppercase">Perfect For</span>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { emoji: '🎓', title: 'Fresh Graduates', subtitle: 'BCom, BBA, BA, MBA', color: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-400/20' },
                { emoji: '💼', title: 'Working Pros', subtitle: 'Want side income', color: 'from-purple-500/20 to-indigo-500/20', border: 'border-purple-400/20' },
                { emoji: '🏢', title: 'Agency Dreamers', subtitle: 'Start your own agency', color: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-400/20' },
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
                <div className="text-center pb-2">
                  <span className="px-4 py-1.5 rounded-full bg-red-500/15 text-red-400 text-xs font-bold uppercase">Before</span>
                </div>
                <div className="text-center pb-2">
                  <span className="px-4 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold uppercase">After 12 Weeks</span>
                </div>
                {[
                  { before: '😵 Job ke liye bhatak raha', after: '💼 Apna agency chala raha' },
                  { before: '📱 Sirf Instagram scroll', after: '🎯 Instagram se clients mila raha' },
                  { before: '💰 Income: ₹0', after: '💸 Income: ₹50K+/month' },
                  { before: '🤷 Marketing ka zero knowledge', after: '🧠 Meta ads, SEO, funnels master' },
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
                { icon: '🎯', text: 'Real client projects' },
                { icon: '💸', text: 'Live Meta ads (₹500 budget)' },
                { icon: '🏆', text: 'Portfolio by Week 12' },
                { icon: '🤝', text: 'Alumni network' },
              ].map((d) => (
                <span key={d.text} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 font-medium">
                  <span>{d.icon}</span> {d.text}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════ AI AD CAMPAIGN GENERATOR (THE WOW TOOL) ═══════════ */}
        <div id="try-tool">
          <AdCampaignGenerator />
        </div>

        {/* ═══════════ WHAT YOU'LL LEARN ═══════════ */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0a1628] to-[#020617]" />
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
              <span className="text-pink-400 text-sm font-semibold tracking-wider uppercase">The Complete Toolkit</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">
                Skills That Get You Paid
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[
                { icon: '📝', title: 'AI Copywriting', desc: 'Write viral captions, ad copy, emails, landing pages in minutes using Claude + ChatGPT' },
                { icon: '🎨', title: 'Visual Design', desc: 'Canva AI, Midjourney, Adobe Firefly — create brand kits, reels, posters without a designer' },
                { icon: '🎬', title: 'Video Content', desc: 'HeyGen avatars, CapCut AI, ElevenLabs voices — batch-create video content for clients' },
                { icon: '🎯', title: 'Meta Ads', desc: 'Facebook & Instagram advertising. Run real ₹500 budget ads and get real results' },
                { icon: '🌐', title: 'Local SEO', desc: 'Google My Business, local keywords, ranking strategies for Punjab businesses' },
                { icon: '💼', title: 'Client Acquisition', desc: 'Cold outreach, proposals, pricing, contracts — everything you need to close deals' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-5 md:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-400/30 transition-all hover:scale-[1.02]"
                >
                  <span className="text-3xl">{item.icon}</span>
                  <h3 className="mt-3 text-white font-bold text-base">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ INCOME CALCULATOR ═══════════ */}
        <section className="py-16 md:py-20 relative">
          <div className="absolute inset-0 bg-[#0B1120]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[150px]" style={{ background: 'rgba(16,185,129,0.08)' }} />
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10">
              <span className="text-emerald-400 text-sm font-semibold tracking-wider uppercase">Your New Income</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">
                Do The Math
              </h2>
              <p className="text-gray-400 mt-2 text-sm">Simple math. Real numbers. No hype.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-400/20 rounded-2xl p-6 md:p-8">
              <div className="space-y-4">
                {[
                  { label: '3 clients × ₹5,000/month', calc: '₹15,000', sub: 'Just 3 small businesses' },
                  { label: '5 clients × ₹10,000/month', calc: '₹50,000', sub: 'Growing agency' },
                  { label: '10 clients × ₹15,000/month', calc: '₹1,50,000', sub: 'Full-time agency' },
                ].map((row, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div>
                      <p className="text-white font-semibold text-sm md:text-base">{row.label}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{row.sub}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-bold text-xl md:text-2xl">{row.calc}</p>
                      <p className="text-[10px] text-gray-600">/month</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="mt-6 text-center text-gray-400 text-sm">
                Course investment: <span className="line-through text-gray-600">₹{course.originalPrice?.toLocaleString('en-IN')}</span>{' '}
                <span className="text-white font-bold">₹{course.price.toLocaleString('en-IN')}</span>
                <br />
                <span className="text-emerald-400 text-xs">ROI in less than 1 month with just 2 clients.</span>
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══════════ SYLLABUS ═══════════ */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-[#020617]" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
              <span className="text-purple-400 text-sm font-semibold tracking-wider uppercase">12-Week Roadmap</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">From Zero to Agency</h2>
            </motion.div>

            <div className="space-y-6">
              {course.syllabus.map((mod, i) => {
                const colors = ['pink', 'purple', 'cyan', 'emerald']
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
                    {i < course.syllabus.length - 1 && (
                      <div className={`absolute left-[13px] md:left-[21px] top-10 bottom-[-24px] w-0.5 bg-${c}-500/20`} />
                    )}
                    <div className={`absolute left-0 md:left-2 top-1 w-7 h-7 rounded-full bg-${c}-500/20 border-2 border-${c}-400 flex items-center justify-center`}>
                      <span className="text-xs font-bold text-white">{i + 1}</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6">
                      <h3 className="font-bold text-white text-base md:text-lg">{mod.module}</h3>
                      <div className="mt-3 space-y-1.5">
                        {mod.topics.slice(0, 3).map((topic, j) => (
                          <p key={j} className="text-xs md:text-sm text-gray-400 flex items-start gap-2">
                            <span className={`text-${c}-400 mt-0.5`}>▸</span>
                            {topic.length > 100 ? topic.slice(0, 97) + '...' : topic}
                          </p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ═══════════ WHAT YOU GET ═══════════ */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-[#0B1120]" />
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10">
              <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase">Everything You Need</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">
                What You{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Get</span>
              </h2>
            </motion.div>

            <div className="space-y-3">
              {[
                { icon: '📝', item: '500+ Ad Copy Templates', desc: 'Proven ad copy for every industry — just swap the business name' },
                { icon: '🎨', item: 'Canva Pro Brand Kit', desc: 'Logo, colors, fonts, reusable templates for social media' },
                { icon: '💼', item: 'Client Proposal Templates', desc: 'Winning proposals, contracts, SOWs, pricing sheets' },
                { icon: '💬', item: 'Cold Outreach Scripts', desc: 'WhatsApp, Instagram DM, LinkedIn scripts that convert' },
                { icon: '📊', item: 'Client Dashboard Templates', desc: 'Monthly reports that impress clients and justify your rates' },
                { icon: '🎯', item: 'Meta Ads Playbook', desc: 'Step-by-step guides for every ad objective and industry' },
                { icon: '🌐', item: 'Portfolio Website', desc: 'Step-by-step guide to build a portfolio site that gets clients' },
                { icon: '👥', item: 'Alumni Community', desc: 'WhatsApp group for ongoing support, job leads, and collabs' },
                { icon: '📜', item: 'Verified Certificate', desc: 'LinkedIn-shareable certificate with unique verification' },
                { icon: '🎯', item: '12 Weeks Live Training', desc: 'Real projects, real clients, real results — not pre-recorded' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
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
                Total value: <span className="line-through">₹65,000+</span>{' '}
                <span className="text-white font-bold">All included in ₹{course.price.toLocaleString('en-IN')}</span>
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══════════ ENROLLMENT FORM ═══════════ */}
        <section id="enroll" className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#1a0f2e] to-[#020617]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px]" style={{ background: 'rgba(236,72,153,0.08)' }} />

          <div className="relative z-10 max-w-md mx-auto px-4 sm:px-6">
            {step === 'success' ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 backdrop-blur-md border border-pink-400/30 rounded-3xl p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🎉</span>
                </div>
                <h2 className="text-2xl font-bold text-white">You&apos;re In!</h2>
                <p className="text-gray-400 mt-2 mb-1">Welcome to AI for Digital Marketing</p>
                <p className="text-xs text-gray-600 mb-6">Payment ID: {paymentId}</p>
                <p className="text-gray-400 text-sm mb-6">
                  We&apos;ll WhatsApp you within 2 hours with batch details.
                </p>
                <a
                  href={`https://wa.me/919200882008?text=${encodeURIComponent(`Hi! I just enrolled in AI for Digital Marketing. Payment ID: ${paymentId}. Please share batch details.`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-block px-6 py-3 rounded-xl bg-pink-600 text-white font-medium hover:bg-pink-700 transition-colors"
                >
                  Message on WhatsApp →
                </a>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    Start Earning in{' '}
                    <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">12 Weeks</span>
                  </h2>
                  <p className="text-gray-500 mt-2 text-sm">Limited seats per batch</p>
                </div>

                <div id="enroll-form" className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8">
                  <div className="text-center mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-center justify-center gap-3">
                      {course.originalPrice && (
                        <span className="text-xl text-gray-600 line-through">₹{course.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                      <span className="text-5xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
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
                      className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-pink-400 focus:outline-none transition-all" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required
                      className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-pink-400 focus:outline-none transition-all" />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="WhatsApp Number"
                      className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-pink-400 focus:outline-none transition-all" />

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <button type="submit" disabled={loading || step === 'paying'}
                      className="group w-full py-4 rounded-xl font-bold text-lg text-white relative overflow-hidden disabled:opacity-50">
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-fuchsia-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                    <span>💬 Support</span>
                  </div>

                  <div className="mt-4 text-center">
                    <a href={`https://wa.me/919200882008?text=${encodeURIComponent(`Hi, I have a question about AI for Digital Marketing course`)}`}
                      target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-pink-400 transition-colors">
                      Have questions? Chat with us →
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* ═══════════ FINAL CTA ═══════════ */}
        <section className="py-20 relative text-center">
          <div className="absolute inset-0 bg-[#020617]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[150px]" style={{ background: 'rgba(236,72,153,0.1)' }} />
          <div className="relative z-10 px-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">
              Your First Client Is{' '}
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">10 Weeks Away.</span>
            </h2>
            <p className="mt-4 text-gray-500 text-sm">Stop scrolling. Start earning.</p>
            <a href="#enroll" onClick={(e) => { e.preventDefault(); document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="inline-block mt-8 px-10 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-bold text-lg hover:scale-105 transition-transform shadow-[0_10px_40px_rgba(236,72,153,0.3)]">
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
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#020617]/95 backdrop-blur-md border-t border-white/10 px-4 py-3 flex items-center justify-between">
          <div>
            {course.originalPrice && <span className="text-xs text-gray-600 line-through mr-1">₹{course.originalPrice.toLocaleString('en-IN')}</span>}
            <span className="text-lg font-bold text-white">₹{course.price.toLocaleString('en-IN')}</span>
          </div>
          <a href="#enroll" onClick={(e) => { e.preventDefault(); document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-sm">
            Enroll Now
          </a>
        </div>
      </div>

      {/* Conversion boosters */}
      <AskTara />
      <ExitIntentPopup courseTitle={course.title} courseSlug={course.slug} primaryColor="#ec4899" />
      <EnrollmentToast />
    </>
  )
}
