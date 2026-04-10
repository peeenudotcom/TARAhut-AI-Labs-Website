'use client'

import { motion } from 'framer-motion'

function Particle({ x, y, delay, size }: { x: string; y: string; delay: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-white/10"
      style={{ width: size, height: size, left: x, top: y }}
      animate={{ y: [0, -24, 0], opacity: [0.2, 0.6, 0.2] }}
      transition={{ duration: 3 + delay, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

const trustBadges = [
  { icon: '✅', label: 'Beginner Friendly' },
  { icon: '🛠️', label: 'Real Projects' },
  { icon: '🏫', label: 'Offline + Online' },
  { icon: '💳', label: 'EMI Available' },
  { icon: '🛡️', label: '7-Day Money Back' },
]

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0A0F1E] via-[#0F2027] to-[#0A0F1E]">
      {/* Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[100px]" />
      </div>

      {/* Particles */}
      <Particle x="8%" y="20%" delay={0} size={6} />
      <Particle x="88%" y="30%" delay={0.5} size={8} />
      <Particle x="22%" y="70%" delay={1} size={4} />
      <Particle x="72%" y="15%" delay={1.5} size={7} />
      <Particle x="50%" y="80%" delay={0.8} size={5} />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400 mb-6">
            April 2026 Batch
          </span>

          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Start Your AI Journey —{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              or Build a Business with It
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-400">
            Learn practical AI skills you can apply immediately — to earn, grow, or build something of your own.
          </p>

          <p className="mt-3 text-sm text-gray-500">
            No coding required &nbsp;•&nbsp; Beginner friendly &nbsp;•&nbsp; Start from scratch
          </p>

          {/* Urgency */}
          <motion.div
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-yellow-500/10 border border-yellow-400/20 px-4 py-2 text-sm font-semibold text-yellow-400"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ⚡ Founding Batch for April 2026 — Limited Seats
          </motion.div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://wa.me/919200882008?text=Hi%2C+I+want+to+book+a+free+demo+class+at+TARAhut+AI+Labs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-9 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:brightness-110 hover:-translate-y-0.5"
            >
              📅 Book Free Demo Class
            </a>
            <a
              href="/partner"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:-translate-y-0.5"
            >
              Start AI Center →
            </a>
          </div>

          {/* Audience line */}
          <p className="mt-5 text-sm text-slate-600">
            For Students &nbsp;•&nbsp; For Business Owners &nbsp;•&nbsp; For Future Partners
          </p>

          {/* Phone */}
          <p className="mt-6 text-sm text-slate-500">
            Prefer talking? Call us directly:{' '}
            <a href="tel:+919200882008" className="font-semibold text-white transition-colors hover:text-emerald-400">
              +91-9200882008
            </a>
          </p>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {trustBadges.map((b) => (
              <div key={b.label} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400">
                <span>{b.icon}</span>
                {b.label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
