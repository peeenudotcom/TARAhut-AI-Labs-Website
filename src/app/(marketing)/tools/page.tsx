'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// ─── Tool definitions ────────────────────────────────────────────────────────

const tools = [
  {
    id: 'prompt-improver',
    icon: '⚡',
    gradient: 'linear-gradient(to right, #f59e0b, #f97316)',
    bgLight: '#fffbeb',
    borderLight: '#fef3c7',
    title: 'AI Prompt Improver',
    subtitle: 'Turn weak prompts into powerful ones',
    placeholder: 'e.g. "Write a marketing email for my bakery"',
    label: 'Your basic prompt',
    cta: 'Improve My Prompt',
    outputLabel: 'Improved Prompt',
    hint: 'Paste any ChatGPT / Claude prompt and get a vastly better version instantly.',
    usageCount: '3,841',
  },
  {
    id: 'course-recommender',
    icon: '🎯',
    gradient: 'linear-gradient(to right, #3b82f6, #6366f1)',
    bgLight: '#eff6ff',
    borderLight: '#dbeafe',
    title: 'AI Course Finder',
    subtitle: 'Find your perfect course in 10 seconds',
    placeholder: 'e.g. "I am a 25-year-old marketing executive in Ludhiana. I want to use AI to grow my career. I have no coding background."',
    label: 'Tell us about yourself',
    cta: 'Find My Course',
    outputLabel: 'Your Recommendation',
    hint: "Describe your background, goals, and current skill level. We'll match you to the right course.",
    usageCount: '2,190',
  },
  {
    id: 'bio-writer',
    icon: '✍️',
    gradient: 'linear-gradient(to right, #a855f7, #ec4899)',
    bgLight: '#faf5ff',
    borderLight: '#f3e8ff',
    title: 'AI LinkedIn Bio Writer',
    subtitle: 'Get a professional bio in seconds',
    placeholder: 'e.g. "Software developer, 3 years experience, works at TCS, specializes in Python, recently started learning AI tools, from Chandigarh"',
    label: 'Your background & role',
    cta: 'Write My Bio',
    outputLabel: 'Your LinkedIn Bio',
    hint: "Share your role, experience, skills, and what you're working towards. We'll craft a compelling bio.",
    usageCount: '1,627',
  },
]

// ─── How it works steps ───────────────────────────────────────────────────────

const steps = [
  { step: '01', icon: '🛠️', title: 'Try the Tools', desc: 'Experience AI doing real work in seconds' },
  { step: '02', icon: '🧠', title: 'Understand Your Gap', desc: 'See what you could do with the right training' },
  { step: '03', icon: '🎯', title: 'Pick Your Course', desc: 'We match you to exactly what you need' },
  { step: '04', icon: '🚀', title: 'Build Real Projects', desc: 'Apply skills that employers actually want' },
]

// ─── Who is it for ────────────────────────────────────────────────────────────

const audiences = [
  {
    icon: '🎒',
    title: 'Students (Class 10–12)',
    desc: 'Explore AI early and build future-ready skills before college',
    borderColor: '#fde68a',
    bgColor: 'rgba(255,251,235,0.5)',
    iconBg: '#fef3c7',
    href: '/courses#beginner',
  },
  {
    icon: '🎓',
    title: 'College Students',
    desc: 'Add AI to your resume and stand out in campus placements',
    borderColor: '#bfdbfe',
    bgColor: 'rgba(239,246,255,0.5)',
    iconBg: '#dbeafe',
    href: '/courses#beginner',
  },
  {
    icon: '💼',
    title: 'Working Professionals',
    desc: 'Save hours every week and become the AI expert in your team',
    borderColor: '#e9d5ff',
    bgColor: 'rgba(250,245,255,0.5)',
    iconBg: '#f3e8ff',
    href: '/courses#professional',
  },
  {
    icon: '🏪',
    title: 'Business Owners',
    desc: 'Automate tasks, cut costs, and grow faster with AI tools',
    borderColor: '#a7f3d0',
    bgColor: 'rgba(236,253,245,0.5)',
    iconBg: '#d1fae5',
    href: '/courses#business',
  },
]

// ─── Micro CTA (shown after tool output) ─────────────────────────────────────

function MicroCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mt-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4"
    >
      <p className="text-xs font-medium text-[#475569]">
        Want to use this skill in real projects?
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href="/courses"
          className="inline-flex items-center rounded-lg bg-[#059669] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#10B981]"
        >
          Explore AI Career Programs →
        </Link>
        <a
          href="https://wa.me/919200882008?text=Hi%2C+I+just+tried+your+AI+tools.+Can+you+suggest+the+right+course+for+me%3F"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-xs font-semibold text-[#475569] transition-all hover:border-[#059669] hover:text-[#059669]"
        >
          Get My AI Learning Plan
        </a>
      </div>
    </motion.div>
  )
}

// ─── Tool card ────────────────────────────────────────────────────────────────

function ToolCard({ tool }: { tool: typeof tools[0] }) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleRun() {
    if (!input.trim() || input.trim().length < 10) {
      setError('Please enter at least 10 characters')
      return
    }
    setLoading(true)
    setOutput('')
    setError('')
    try {
      const res = await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: tool.id, input }),
      })
      const data = await res.json()
      if (res.ok) {
        setOutput(data.output)
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch {
      setError('Network error, please try again')
    }
    setLoading(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleRun()
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col rounded-2xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      {/* Coloured header */}
      <div className="p-6" style={{ background: tool.gradient }}>
        <div className="flex items-start justify-between">
          <span className="text-3xl">{tool.icon}</span>
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold text-white/90">
            {tool.usageCount} uses
          </span>
        </div>
        <h3 className="mt-3 text-xl font-bold text-white">{tool.title}</h3>
        <p className="text-sm text-white/80">{tool.subtitle}</p>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="mb-3 text-xs text-[#64748B]">
          {tool.hint}{' '}
          <span className="text-[#94A3B8]">Press ⌘+Enter to run.</span>
        </p>

        <label className="mb-1.5 block text-sm font-medium text-[#0F172A]">
          {tool.label}
        </label>
        <textarea
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tool.placeholder}
          className="w-full resize-none rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#059669] focus:outline-none focus:ring-2 focus:ring-[#059669]/20"
        />

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

        <button
          onClick={handleRun}
          disabled={loading}
          className="mt-3 w-full rounded-xl py-3 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-105 disabled:opacity-60"
          style={{ background: tool.gradient }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              AI is thinking…
            </span>
          ) : tool.cta}
        </button>

        {/* Output + micro CTA */}
        <AnimatePresence>
          {output && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-[#0F172A]">{tool.outputLabel}</p>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] px-3 py-1 text-xs font-medium text-[#64748B] transition-colors hover:border-[#059669] hover:text-[#059669]"
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
              <div
                className="rounded-xl border p-4 text-sm leading-relaxed text-[#0F172A] whitespace-pre-wrap"
                style={{ backgroundColor: tool.bgLight, borderColor: tool.borderLight }}
              >
                {output}
              </div>

              {/* ① Micro CTA — post-output nudge */}
              <MicroCTA />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-24">

      {/* ── Hero ── */}
      <section className="mx-auto max-w-7xl px-6 pt-4 pb-10 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-[#059669] mb-4">
            Powered by Claude AI · Free, no login
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl">
            Experience AI.<br />
            <span className="bg-gradient-to-r from-[#059669] to-[#0D9488] bg-clip-text text-transparent">
              Then Master It.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[#475569]">
            These tools are part of our AI Skill System. Try them now — then learn how to use AI like this every single day.
          </p>
        </motion.div>
      </section>

      {/* ── How It Works ── */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <motion.div
          className="rounded-2xl border border-[#E2E8F0] bg-white px-6 py-10 md:px-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-[#059669]">How it works</p>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-4">
            {steps.map((s, i) => (
              <div key={s.step} className="relative flex flex-col items-center text-center">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute top-7 left-[calc(50%+28px)] hidden h-px w-[calc(100%-56px)] md:block" style={{ background: 'linear-gradient(to right, #CBD5E1, transparent)' }} />
                )}
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] text-2xl shadow-sm">
                  {s.icon}
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#059669] text-[10px] font-bold text-white">
                    {s.step}
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold text-[#0F172A]">{s.title}</p>
                <p className="mt-1 text-xs text-[#64748B]">{s.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Tools Grid ── */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <ToolCard tool={tool} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Why These Tools Exist ── */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <motion.div
          className="rounded-2xl border border-[#E2E8F0] bg-white p-10 md:p-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#059669]">Our philosophy</p>
            <h2 className="mt-3 flex items-center gap-3 text-2xl font-bold text-[#0F172A]">
              Why These Tools Exist
              <span className="inline-flex gap-1.5">
                {['⚡', '🎯', '✍️'].map((icon, i) => (
                  <span
                    key={i}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-base"
                  >
                    {icon}
                  </span>
                ))}
              </span>
            </h2>
            <p className="mt-4 max-w-2xl text-[#475569] leading-relaxed">
              These tools are part of our <span className="font-semibold text-[#0F172A]">AI Skill System</span> — designed to help you move from beginner to job-ready. Instead of learning theory first, you experience AI doing real work, then master the skill step-by-step in our courses.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {['Experience first', 'Learn the why', 'Build with confidence'].map((tag) => (
                <span key={tag} className="inline-flex items-center rounded-full border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-1 text-xs font-medium text-[#059669]">
                  ✓ {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Who Is This For ── */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-[#0F172A]">Who Is This For?</h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                href={a.href}
                className="audience-card block rounded-2xl border p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                style={{ borderColor: a.borderColor, backgroundColor: a.bgColor }}
              >
                <div
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-2xl"
                  style={{ backgroundColor: a.iconBg }}
                >
                  {a.icon}
                </div>
                <h3 className="mt-4 text-sm font-bold text-[#0F172A]">{a.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#475569]">{a.desc}</p>
                <p className="audience-card-link mt-3 text-xs font-medium text-[#059669]">
                  View programs →
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── ④ Bottom direction CTA ── */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <motion.div
          className="rounded-2xl bg-[#0F172A] px-8 py-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Next step</p>
          <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
            You&apos;ve tried the tools.<br />
            <span className="text-slate-300 font-normal">Now learn how to use them professionally.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-slate-500">
            Our structured AI programs take you from "I tried this once" to "I use AI every day at work."
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#0F172A] shadow-sm transition-all hover:bg-slate-100"
            >
              Explore AI Career Programs →
            </Link>
            <a
              href="https://wa.me/919200882008?text=Hi%2C+I+just+tried+your+AI+tools.+Can+you+suggest+the+right+course+for+me%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              Ask on WhatsApp
            </a>
          </div>
          <p className="mt-6 text-xs text-slate-500">
            Trusted by students, professionals, and business owners to learn practical AI skills.
          </p>
        </motion.div>
      </section>

    </main>
  )
}
