'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
        setName('')
      } else {
        const d = await res.json()
        setError(d.error || 'Something went wrong')
        setStatus('error')
      }
    } catch {
      setError('Network error, please try again')
      setStatus('error')
    }
  }

  return (
    <section className="bg-gradient-to-br from-[#FEF2F2] to-[#FEF2F2] border-y border-[#FEE2E2]">
      <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Icon */}
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e53935] shadow-lg shadow-red-500/25">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <p className="text-sm font-medium tracking-widest uppercase text-[#e53935]">Stay Ahead</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
            Weekly AI Insights — Free
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#475569]">
            Every Monday: one practical AI tip, one new tool breakdown, and one real use case from Indian businesses. No fluff, just actionable insights.
          </p>

          {/* Social proof */}
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#64748B]">
            <div className="flex -space-x-2">
              {['H', 'A', 'G', 'R'].map((l, i) => (
                <div key={i} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white"
                  style={{ backgroundColor: ['#e53935', '#EF4444', '#F59E0B', '#EF4444'][i] }}>
                  {l}
                </div>
              ))}
            </div>
            <span>Join <strong className="text-[#0F172A]">200+</strong> professionals already subscribed</span>
          </div>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#e53935] px-8 py-4 text-white shadow-lg shadow-red-500/25"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-semibold">You&apos;re in! Check your inbox for a welcome email.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 rounded-xl border border-[#FEE2E2] bg-white px-4 py-3 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#e53935] focus:outline-none focus:ring-2 focus:ring-[#e53935]/20"
              />
              <input
                type="email"
                required
                placeholder="Your email address *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-xl border border-[#FEE2E2] bg-white px-4 py-3 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#e53935] focus:outline-none focus:ring-2 focus:ring-[#e53935]/20"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="rounded-xl bg-[#e53935] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#EF4444] disabled:opacity-60"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe Free →'}
              </button>
            </form>
          )}

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          <p className="mt-4 text-xs text-[#94A3B8]">No spam. Unsubscribe anytime. We respect your privacy.</p>
        </motion.div>
      </div>
    </section>
  )
}
