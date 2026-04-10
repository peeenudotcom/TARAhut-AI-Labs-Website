'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const resources = [
  {
    id: 'prompt-guide',
    title: 'Top 50 AI Prompts for Indian Professionals',
    description: 'Ready-to-use prompts for marketing, HR, sales, customer service, and finance. Save hours every week.',
    icon: '⚡',
    color: 'from-amber-500 to-orange-500',
    badge: 'Most Downloaded',
    badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    pages: '18 pages',
    format: 'PDF',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1_PROMPT_GUIDE_ID',
  },
  {
    id: 'career-roadmap',
    title: 'AI Career Roadmap 2025–2026',
    description: 'Step-by-step guide to building an AI career in India — roles, skills, salary ranges, and top companies hiring.',
    icon: '🗺️',
    color: 'from-blue-500 to-indigo-500',
    badge: 'New',
    badgeColor: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    pages: '24 pages',
    format: 'PDF',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=2_CAREER_ROADMAP_ID',
  },
  {
    id: 'tools-cheatsheet',
    title: 'AI Tools Cheatsheet — 40+ Tools',
    description: 'Every major AI tool categorized by use case: writing, design, video, coding, business, and productivity.',
    icon: '🛠️',
    color: 'from-emerald-500 to-teal-500',
    badge: 'Free',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    pages: '8 pages',
    format: 'PDF',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=3_TOOLS_CHEATSHEET_ID',
  },
  {
    id: 'business-ai',
    title: 'AI for Small Business — Quick Wins Guide',
    description: '10 ways Indian SMEs are using AI right now to cut costs, automate tasks, and win more customers.',
    icon: '💼',
    color: 'from-purple-500 to-pink-500',
    badge: 'Popular',
    badgeColor: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
    pages: '14 pages',
    format: 'PDF',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=4_BUSINESS_AI_ID',
  },
]

function EmailGateModal({
  resource,
  onClose,
  onSuccess,
}: {
  resource: typeof resources[0]
  onClose: () => void
  onSuccess: (url: string) => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, resource: resource.id }),
      })
      if (res.ok) {
        onSuccess(resource.downloadUrl)
      } else {
        const d = await res.json()
        setError(d.error || 'Something went wrong')
      }
    } catch {
      setError('Network error, please try again')
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${resource.color} text-2xl`}>
          {resource.icon}
        </div>
        <h3 className="text-xl font-bold text-[#0F172A]">Get Your Free Resource</h3>
        <p className="mt-1 text-sm text-[#475569]">{resource.title}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm focus:border-[#059669] focus:outline-none focus:ring-2 focus:ring-[#059669]/20"
          />
          <input
            type="email"
            required
            placeholder="Your email address *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm focus:border-[#059669] focus:outline-none focus:ring-2 focus:ring-[#059669]/20"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#059669] py-3 text-sm font-semibold text-white transition-all hover:bg-[#10B981] disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send Me the Free PDF →'}
          </button>
        </form>

        <p className="mt-3 text-center text-xs text-[#94A3B8]">
          We&apos;ll also send you weekly AI tips. Unsubscribe anytime.
        </p>
      </motion.div>
    </div>
  )
}

export default function ResourcesPage() {
  const [activeResource, setActiveResource] = useState<typeof resources[0] | null>(null)
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set())

  function handleDownload(url: string) {
    if (activeResource) {
      setDownloaded((prev) => new Set([...prev, activeResource.id]))
      setActiveResource(null)
      window.open(url, '_blank')
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-24">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-[#059669] mb-4">
            100% Free — No Credit Card
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl">
            Free AI Resources<br />
            <span className="bg-gradient-to-r from-[#059669] to-[#0D9488] bg-clip-text text-transparent">
              for Indian Professionals
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[#475569]">
            Practical guides, cheatsheets, and roadmaps — crafted specifically for India&apos;s working professionals, students, and business owners.
          </p>
          <p className="mt-3 text-sm text-[#64748B]">
            Enter your email once, download everything. No spam, ever.
          </p>
        </motion.div>
      </section>

      {/* Resources Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {resources.map((r, i) => (
            <motion.div
              key={r.id}
              className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              {/* Gradient top border */}
              <div className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${r.color}`} />

              <div className="flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${r.color} text-2xl`}>
                  {r.icon}
                </div>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${r.badgeColor}`}>
                  {r.badge}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-[#0F172A] leading-snug">
                {r.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                {r.description}
              </p>

              <div className="mt-4 flex items-center gap-3 text-xs text-[#64748B]">
                <span className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {r.pages}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {r.format}
                </span>
              </div>

              <button
                onClick={() => setActiveResource(r)}
                className={`mt-5 w-full rounded-xl py-3 text-sm font-semibold transition-all ${
                  downloaded.has(r.id)
                    ? 'bg-emerald-50 text-[#059669] border border-emerald-200'
                    : `bg-gradient-to-r ${r.color} text-white shadow-sm hover:brightness-105`
                }`}
              >
                {downloaded.has(r.id) ? '✓ Downloaded — Download Again' : 'Download Free PDF →'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 rounded-2xl bg-[#0F172A] p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-white">Want More Than PDFs?</h3>
          <p className="mt-2 text-slate-400">Join our AI course and get live training, mentorship, and a certificate.</p>
          <a
            href="https://wa.me/919200882008?text=Hi%2C+I+downloaded+your+AI+resources+and+want+to+know+more+about+courses"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:brightness-110"
          >
            📅 Book a Free Demo Class
          </a>
        </motion.div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {activeResource && (
          <EmailGateModal
            resource={activeResource}
            onClose={() => setActiveResource(null)}
            onSuccess={handleDownload}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
