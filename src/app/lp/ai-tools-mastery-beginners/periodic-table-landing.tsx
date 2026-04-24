'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { motion, AnimatePresence } from 'framer-motion'
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

type Category = 'llm' | 'img' | 'vid' | 'auto'

type Element = {
  n: string
  sym: string
  name: string
  category: Category
  session: number
  by: string
  desc: string
}

// Tool list derived from the Tools Mastery curriculum in
// src/config/learn-modules.ts + a few bonus frontier tools covered
// in the Capstone sprint.
const ELEMENTS: Element[] = [
  // LLMs
  { n: '01', sym: 'Gp', name: 'ChatGPT',     category: 'llm', session: 1,  by: 'OpenAI',    desc: 'The foundation of modern conversational AI. Writing, research, coding.' },
  { n: '02', sym: 'Cl', name: 'Claude',      category: 'llm', session: 1,  by: 'Anthropic', desc: 'Best-in-class reasoning and artifacts. Long-context analysis.' },
  { n: '03', sym: 'Gm', name: 'Gemini',      category: 'llm', session: 1,  by: 'Google',    desc: 'Google’s multimodal model. Deep integration with Drive, Gmail, Search.' },
  { n: '04', sym: 'Px', name: 'Perplexity',  category: 'llm', session: 7,  by: 'Perplexity',desc: 'Answer engine — LLMs + real-time web search with citations.' },
  { n: '05', sym: 'Nb', name: 'NotebookLM',  category: 'llm', session: 7,  by: 'Google',    desc: 'Upload sources, get grounded answers + podcast-style audio overviews.' },

  // Image
  { n: '06', sym: 'Mj', name: 'Midjourney',  category: 'img', session: 9,  by: 'Midjourney',desc: 'High-end photorealistic and stylized image generation.' },
  { n: '07', sym: 'Id', name: 'Ideogram',    category: 'img', session: 9,  by: 'Ideogram',  desc: 'Best-in-class text rendering inside images. Posters, logos, signage.' },
  { n: '08', sym: 'Cv', name: 'Canva AI',    category: 'img', session: 8,  by: 'Canva',     desc: 'AI-assisted layout, Magic Design, one-click brand kits.' },
  { n: '09', sym: 'Ga', name: 'Gamma',       category: 'img', session: 8,  by: 'Gamma',     desc: 'AI presentation builder — decks, docs, pages from a single prompt.' },
  { n: '10', sym: 'Ff', name: 'Firefly',     category: 'img', session: 9,  by: 'Adobe',     desc: 'Commercially-safe generative imagery. Generative Fill, Expand.' },
  { n: '11', sym: 'De', name: 'DALL·E',      category: 'img', session: 9,  by: 'OpenAI',    desc: 'Natural-language image generation inside ChatGPT.' },

  // Video + Audio
  { n: '12', sym: 'Hg', name: 'HeyGen',      category: 'vid', session: 10, by: 'HeyGen',    desc: 'Talking avatars and full video clones. One upload, endless takes.' },
  { n: '13', sym: 'Cc', name: 'CapCut AI',   category: 'vid', session: 10, by: 'ByteDance', desc: 'AI edits, auto-captions, voice clones — built for vertical video.' },
  { n: '14', sym: 'El', name: 'ElevenLabs',  category: 'vid', session: 11, by: 'ElevenLabs',desc: 'Studio-grade AI voice cloning and multilingual TTS.' },
  { n: '15', sym: 'Rw', name: 'Runway',      category: 'vid', session: 10, by: 'Runway',    desc: 'Text-to-video, motion brush, advanced video AI toolkit.' },

  // Build / Automation
  { n: '16', sym: 'Bn', name: 'Bolt.new',    category: 'auto',session: 13, by: 'StackBlitz',desc: 'Ship full-stack apps from a prompt. Browser-based dev env.' },
  { n: '17', sym: 'Lv', name: 'Lovable',     category: 'auto',session: 13, by: 'Lovable',   desc: 'AI app builder for non-coders. Real React output, real deploys.' },
  { n: '18', sym: 'Cu', name: 'Cursor',      category: 'auto',session: 13, by: 'Cursor',    desc: 'AI-first code editor. Refactor, explain, ship — from your IDE.' },
  { n: '19', sym: 'V0', name: 'v0',          category: 'auto',session: 13, by: 'Vercel',    desc: 'UI generation from prompts or screenshots. shadcn-native.' },
  { n: '20', sym: 'Mk', name: 'Make',        category: 'auto',session: 14, by: 'Make.com',  desc: 'Visual workflow automation. Chain tools without code.' },
]

const CATEGORY_META: Record<Category, { label: string; accent: string; dotClass: string; borderClass: string }> = {
  llm:  { label: 'LLMs',          accent: '#38bdf8', dotClass: 'bg-sky-400',     borderClass: 'border-t-sky-400' },
  img:  { label: 'Image & Design',accent: '#d946ef', dotClass: 'bg-fuchsia-500', borderClass: 'border-t-fuchsia-500' },
  vid:  { label: 'Video & Voice', accent: '#facc15', dotClass: 'bg-yellow-400',  borderClass: 'border-t-yellow-400' },
  auto: { label: 'Build',         accent: '#10b981', dotClass: 'bg-emerald-500', borderClass: 'border-t-emerald-500' },
}

const LAB_STYLES = `
  .lab-grid-bg {
    background-image: radial-gradient(rgba(226, 232, 240, 0.06) 1px, transparent 1px);
    background-size: 20px 20px;
  }
`

export function PeriodicTableLanding({ course }: { course: Course }) {
  const [step, setStep] = useState<Step>('form')
  const [selected, setSelected] = useState<Element | null>(null)
  const [filter, setFilter] = useState<Category | 'all'>('all')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [paymentId, setPaymentId] = useState('')

  // Close the HUD on Esc
  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

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
  const freeSessionHref = `/learn/session/1`

  function scrollToEnroll() {
    document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })
  }

  const filtered = filter === 'all' ? ELEMENTS : ELEMENTS.filter((el) => el.category === filter)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: LAB_STYLES }} />
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
              className="min-h-12 px-5 sm:px-6 rounded-xl bg-emerald-500 text-black font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-emerald-400 transition-colors"
            >
              Enroll →
            </button>
          </div>
        </nav>

        {/* ═══════════ HERO ═══════════ */}
        <section className="lab-grid-bg relative px-6 pt-28 pb-16 md:pb-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <span className="text-emerald-500 font-bold tracking-[0.3em] uppercase text-[10px] mb-5 block">
                Discovery Hub · 16 Sessions
              </span>
              <h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6"
                style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
              >
                The Periodic Table
                <br />
                <span className="text-emerald-500">of AI Elements.</span>
              </h1>
              <p className="text-zinc-400 max-w-2xl mx-auto text-base md:text-lg">
                Every tool that matters in 2026, mapped to the session that teaches it.
                Tap an element to see its properties.
              </p>
            </motion.div>

            {/* Category legend / filter */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-2"
            >
              <button
                onClick={() => setFilter('all')}
                className={`min-h-10 px-4 rounded-full text-xs font-bold uppercase tracking-widest border transition-colors ${
                  filter === 'all' ? 'bg-white text-black border-white' : 'border-white/20 text-zinc-400 hover:border-white/40'
                }`}
              >
                All {ELEMENTS.length}
              </button>
              {(Object.keys(CATEGORY_META) as Category[]).map((c) => {
                const count = ELEMENTS.filter((el) => el.category === c).length
                const meta = CATEGORY_META[c]
                const active = filter === c
                return (
                  <button
                    key={c}
                    onClick={() => setFilter(c)}
                    className={`min-h-10 px-4 rounded-full text-xs font-bold uppercase tracking-widest border transition-colors flex items-center gap-2 ${
                      active ? 'bg-white/10 border-white/50 text-white' : 'border-white/20 text-zinc-400 hover:border-white/40'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${meta.dotClass}`} />
                    {meta.label} · {count}
                  </button>
                )
              })}
            </motion.div>

            {/* Periodic Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10"
            >
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
                {filtered.map((el) => {
                  const meta = CATEGORY_META[el.category]
                  const isSelected = selected?.sym === el.sym
                  return (
                    <button
                      key={el.sym}
                      onClick={() => setSelected(el)}
                      className={`relative aspect-square rounded-2xl border bg-white/[0.03] p-3 flex flex-col justify-between text-left transition-all hover:scale-[1.06] hover:-translate-y-0.5 ${meta.borderClass} border-t-[3px] ${
                        isSelected ? 'border-white bg-white/[0.08] scale-[1.04]' : 'border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/[0.05] hover:shadow-[0_0_20px_rgba(5,150,105,0.2)]'
                      }`}
                      style={{ zIndex: isSelected ? 5 : 1 }}
                    >
                      <span className="text-[10px] font-mono text-zinc-600 absolute top-2 right-2.5">{el.n}</span>
                      <span
                        className="text-2xl md:text-3xl font-bold"
                        style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                      >
                        {el.sym}
                      </span>
                      <span className="text-[10px] md:text-xs text-zinc-400 font-semibold truncate">{el.name}</span>
                    </button>
                  )
                })}
              </div>
              <p className="mt-5 text-center text-[10px] text-zinc-600 uppercase tracking-widest">
                Tap any element · {ELEMENTS.length} tools across {Object.keys(CATEGORY_META).length} categories
              </p>
            </motion.div>

            {/* Hero CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={scrollToEnroll}
                className="bg-emerald-500 text-black min-h-14 px-10 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-400 transition-colors shadow-[0_0_40px_rgba(5,150,105,0.3)]"
              >
                Unlock the Full Lab →
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
                className="bg-transparent border border-zinc-700 text-zinc-300 min-h-14 px-10 rounded-xl font-bold text-sm uppercase tracking-widest hover:border-emerald-500/40 hover:text-white transition-colors text-center flex items-center justify-center"
              >
                Try Session 1 Free
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
          </div>
        </section>

        {/* ═══════════ HUD — ELEMENT DETAIL ═══════════ */}
        <AnimatePresence>
          {selected && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelected(null)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
              />
              <motion.div
                initial={{ y: 120, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 120, opacity: 0 }}
                transition={{ type: 'spring', damping: 22, stiffness: 260 }}
                className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-zinc-950/95 backdrop-blur-xl border border-emerald-500/40 rounded-3xl p-6 z-[70] shadow-[0_0_60px_rgba(5,150,105,0.3)]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-xl border-t-[3px] border-white/10 bg-white/[0.05] flex flex-col items-center justify-center"
                      style={{ borderTopColor: CATEGORY_META[selected.category].accent }}
                    >
                      <span
                        className="text-xl font-bold"
                        style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                      >
                        {selected.sym}
                      </span>
                    </div>
                    <div>
                      <span
                        className="text-[10px] font-black uppercase tracking-widest text-black px-3 py-1 rounded-full"
                        style={{ backgroundColor: CATEGORY_META[selected.category].accent }}
                      >
                        Session {String(selected.session).padStart(2, '0')}
                      </span>
                      <h3
                        className="text-2xl font-bold mt-1"
                        style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                      >
                        {selected.name}
                      </h3>
                      <p className="text-[11px] text-zinc-500">by {selected.by} · {CATEGORY_META[selected.category].label}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    aria-label="Close"
                    className="text-zinc-500 hover:text-white min-w-8 min-h-8 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed mb-5">{selected.desc}</p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => { setSelected(null); scrollToEnroll() }}
                    className="flex-1 min-h-12 px-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-colors"
                  >
                    Enroll in Session {selected.session}
                  </button>
                  <Link
                    href={freeSessionHref}
                    className="flex-1 min-h-12 px-5 border border-zinc-700 text-zinc-300 hover:text-white hover:border-emerald-500/40 font-bold text-xs uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center"
                  >
                    Try Session 1 Free
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ═══════════ TRUST BAR ═══════════ */}
        <section className="py-8 border-y border-white/5 bg-black/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <p className="text-center text-[10px] tracking-[0.3em] uppercase text-zinc-600 mb-5">
              Trained on the entire frontier stack
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 gap-y-4 opacity-60 grayscale">
              {['OpenAI', 'Anthropic', 'Google', 'Meta', 'Adobe', 'Canva'].map((m) => (
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
              <span className="text-emerald-500 text-xs font-bold tracking-widest uppercase">The Curriculum</span>
              <h2
                className="text-3xl md:text-4xl font-bold text-white mt-3"
                style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
              >
                From discovery to portfolio in 16 sessions.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative">
              <div className="hidden md:block absolute top-7 left-[16%] right-[16%] h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-emerald-500/0" />

              {[
                {
                  num: '01',
                  title: 'Discover',
                  desc: 'Meet every element. Learn what each tool is best at, what it fails at, and when to reach for which.',
                },
                {
                  num: '02',
                  title: 'Combine',
                  desc: 'Chain tools into workflows. Prompt → draft → image → voice → video, all in one pipeline.',
                },
                {
                  num: '03',
                  title: 'Ship',
                  desc: 'Capstone project. Real portfolio. AI-powered deliverable you can hand a client on Day 31.',
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
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold">
                      {s.num}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">{s.title}</h3>
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
              <span className="text-zinc-400 text-xs font-bold tracking-widest uppercase">The Lab</span>
              <h2
                className="text-3xl md:text-4xl font-bold text-white mt-3"
                style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
              >
                Not a course. A working lab.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-4 md:gap-5 md:h-[520px]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="md:col-span-4 md:row-span-1 rounded-3xl p-6 md:p-8 bg-gradient-to-br from-emerald-500/10 via-emerald-500/[0.03] to-transparent border border-emerald-500/20 relative overflow-hidden"
              >
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Guided Labs</span>
                <h3
                  className="mt-3 text-2xl md:text-3xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                >
                  Every session ends with something real.
                </h3>
                <p className="mt-3 text-sm text-zinc-400 max-w-md">
                  A reel. A deck. A landing page. A voice clone of your own brand.
                  Not homework, artifacts you can actually use.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 }}
                className="md:col-span-2 md:row-span-2 rounded-3xl p-6 md:p-8 bg-gradient-to-br from-white/[0.06] to-transparent border border-white/10 relative overflow-hidden flex flex-col"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">Prompt Playbook</span>
                <h3
                  className="mt-3 text-2xl md:text-3xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                >
                  200+ battle-tested prompts.
                </h3>
                <div className="mt-auto pt-6 space-y-2">
                  {['Writing · email, copy, docs', 'Research · analyst-grade', 'Design · brand + visual', 'Automation · zero-to-workflow'].map((x) => (
                    <div key={x} className="flex items-center gap-2 text-sm text-zinc-300">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {x}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="md:col-span-2 md:row-span-1 rounded-3xl p-6 bg-white/[0.03] border border-white/10"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Live Q&amp;A</span>
                <h3 className="mt-2 text-lg font-bold text-white">Ask TARA anything, anytime.</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Course-aware mentor that remembers where you are in the curriculum.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="md:col-span-2 md:row-span-1 rounded-3xl p-6 bg-white/[0.03] border border-white/10"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">Portfolio Capstone</span>
                <h3 className="mt-2 text-lg font-bold text-white">Ship. Screenshot. Apply.</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  End with work on a real brief — yours or a partner&rsquo;s.
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
                <h2 className="text-2xl font-bold text-white">Lab Access Granted.</h2>
                <p className="text-zinc-400 mt-2 mb-1">Welcome to AI Tools Mastery</p>
                <p className="text-xs text-zinc-600 mb-6">Payment ID: {paymentId}</p>
                <p className="text-zinc-400 text-sm mb-6">
                  We&apos;ll WhatsApp you within 2 hours with batch details.
                </p>
                <a
                  href={`https://wa.me/919200882008?text=${encodeURIComponent(`Hi! I just enrolled in AI Tools Mastery. Payment ID: ${paymentId}. Please share batch details.`)}`}
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
                    Unlock the <span className="text-emerald-500">Full Lab</span>
                  </h2>
                  <p className="text-zinc-500 mt-2 text-sm">16 sessions · 20 tools · Live mentor</p>
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

                <div className="mt-6 text-center">
                  <Link
                    href={freeSessionHref}
                    className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors uppercase tracking-widest"
                  >
                    Or try session 1 free →
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* ═══════════ FOOTER ═══════════ */}
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
