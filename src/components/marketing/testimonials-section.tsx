'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    quote:
      'I had zero technical background, but after the AI Tools Mastery course, I now use ChatGPT and Canva AI daily at my job. My manager was impressed when I automated our weekly reports. Best investment I have made in my career.',
    name: 'Harpreet Kaur',
    role: 'Marketing Executive, Ludhiana',
    course: 'AI Tools Mastery for Beginners',
    rating: 5,
    accent: {
      from: '#10b981',
      to: '#14b8a6',
      bg: 'rgba(16, 185, 129, 0.08)',
      border: 'rgba(16, 185, 129, 0.3)',
      glow: 'rgba(16, 185, 129, 0.25)',
    },
  },
  {
    quote:
      'Master AI Builder 90 Day Program completely changed my career trajectory. I went from being a BCA fresher with no direction to landing freelance projects worth ₹25K/month within two months of completing the course. Parveen sir explains everything so clearly.',
    name: 'Arjun Sharma',
    role: 'AI Freelancer, Chandigarh',
    course: 'Master AI Builder — 90 Day Program',
    rating: 5,
    accent: {
      from: '#ef4444',
      to: '#f97316',
      bg: 'rgba(239, 68, 68, 0.08)',
      border: 'rgba(239, 68, 68, 0.3)',
      glow: 'rgba(239, 68, 68, 0.25)',
    },
  },
  {
    quote:
      'As a small business owner, I was skeptical about AI. The AI for Digital Marketing course showed me how to use AI for customer service, ads, and social media. My business efficiency has improved by at least 40%. Highly recommended for anyone running a business in Punjab.',
    name: 'Gurleen Singh',
    role: 'Business Owner, Jalandhar',
    course: 'AI for Digital Marketing',
    rating: 5,
    accent: {
      from: '#f59e0b',
      to: '#f97316',
      bg: 'rgba(245, 158, 11, 0.08)',
      border: 'rgba(245, 158, 11, 0.3)',
      glow: 'rgba(245, 158, 11, 0.25)',
    },
  },
  {
    quote:
      'AI Hustler 45 was a game-changer for my freelance career. I landed my first paying client in week 3 and by the end of the program I had three clients paying me a total of ₹30K/month. The outreach templates and packaging were gold. Worth every rupee.',
    name: 'Nisha Patel',
    role: 'AI Freelancer, Amritsar',
    course: 'AI Hustler 45',
    rating: 5,
    accent: {
      from: '#84cc16',
      to: '#65a30d',
      bg: 'rgba(132, 204, 22, 0.08)',
      border: 'rgba(132, 204, 22, 0.3)',
      glow: 'rgba(132, 204, 22, 0.25)',
    },
  },
  {
    quote:
      'I enrolled in the AI Power 8-Week Program as a BCom final year student. The automation and freelancing setup I learned helped me start earning ₹20K/month within 3 weeks of finishing the course. The practical approach made AI feel accessible, not intimidating.',
    name: 'Rajesh Kumar',
    role: 'BCom Student, Ludhiana',
    course: 'AI Power 8-Week Program',
    rating: 5,
    accent: {
      from: '#f59e0b',
      to: '#ea580c',
      bg: 'rgba(245, 158, 11, 0.08)',
      border: 'rgba(245, 158, 11, 0.3)',
      glow: 'rgba(245, 158, 11, 0.25)',
    },
  },
  {
    quote:
      'Master Claude in 15 Days was exactly what I needed. I was already using ChatGPT but never got great results. After learning CRISP prompting, my outputs are 10x better. I now use Claude for client proposals, content, and research. Game changer.',
    name: 'Simran Kaur',
    role: 'Content Writer, Patiala',
    course: 'Master Claude in 15 Days',
    rating: 5,
    accent: {
      from: '#3b82f6',
      to: '#6366f1',
      bg: 'rgba(59, 130, 246, 0.08)',
      border: 'rgba(59, 130, 246, 0.3)',
      glow: 'rgba(59, 130, 246, 0.25)',
    },
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="h-4 w-4 fill-amber-400 text-amber-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? testimonials : testimonials.slice(0, 3)

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[5%] right-[0%] w-[500px] h-[500px] rounded-full blur-[130px]"
          style={{ background: 'rgba(245, 158, 11, 0.08)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[10%] left-[-5%] w-[550px] h-[550px] rounded-full blur-[140px]"
          style={{ background: 'rgba(229, 57, 53, 0.07)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute top-[40%] left-[45%] w-[400px] h-[400px] rounded-full blur-[110px]"
          style={{ background: 'rgba(132, 204, 22, 0.06)' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 backdrop-blur px-4 py-1.5 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e53935] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e53935]" />
            </span>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#e53935]">
              Trusted by Students
            </p>
          </div>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl">
            What Our Learners Are{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Experiencing</span>
              <motion.span
                className="absolute bottom-1 left-0 right-0 h-3 bg-gradient-to-r from-[#e53935]/30 to-[#f59e0b]/30 rounded"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
                style={{ originX: 0 }}
              />
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[#475569]">
            Real feedback from students who applied AI skills to their work and business.
          </p>

          {/* Aggregate rating */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-amber-200 bg-amber-50/80 backdrop-blur px-5 py-2">
            <Stars count={5} />
            <span className="text-sm font-bold text-amber-900">4.9/5</span>
            <span className="text-xs text-amber-700">from {testimonials.length}+ verified reviews</span>
          </div>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          className="mt-16 grid gap-6 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {displayed.map((t) => (
            <motion.div
              key={t.name}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-sm p-8 transition-all duration-500 hover:-translate-y-2"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              whileHover={{
                boxShadow: `0 20px 60px -15px ${t.accent.glow}, 0 0 0 1px ${t.accent.border}`,
              }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
              }}
            >
              {/* Top gradient bar visible on hover */}
              <div
                className="absolute inset-x-8 top-0 h-1 rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, ${t.accent.from}, ${t.accent.to})` }}
              />

              {/* Giant quote mark in background */}
              <div
                className="absolute -top-4 right-4 text-[120px] font-serif font-black leading-none pointer-events-none select-none"
                style={{
                  color: t.accent.border,
                  opacity: 0.25,
                }}
              >
                &ldquo;
              </div>

              {/* Course tag */}
              <div
                className="relative z-10 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider mb-4"
                style={{
                  backgroundColor: t.accent.bg,
                  color: t.accent.from,
                }}
              >
                {t.course}
              </div>

              <Stars count={t.rating} />

              <blockquote className="relative z-10 mt-3 text-sm leading-relaxed text-[#334155]">
                {t.quote}
              </blockquote>

              <div className="relative z-10 mt-6 flex items-center gap-3 border-t border-slate-200 pt-5">
                {/* Avatar initials circle */}
                <div
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${t.accent.from}, ${t.accent.to})`,
                    boxShadow: `0 6px 20px -6px ${t.accent.glow}`,
                  }}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0F172A]">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* See more / See less toggle */}
        {!showAll && testimonials.length > 3 && (
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 backdrop-blur px-5 py-2.5 text-sm font-semibold text-[#e53935] transition-all hover:bg-white hover:border-[#e53935]/40 hover:shadow-lg"
            >
              See all {testimonials.length} reviews
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </motion.div>
        )}
        {showAll && (
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setShowAll(false)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 backdrop-blur px-5 py-2.5 text-sm font-semibold text-[#e53935] transition-all hover:bg-white hover:border-[#e53935]/40 hover:shadow-lg"
            >
              Show fewer reviews
              <svg
                className="h-4 w-4 rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
