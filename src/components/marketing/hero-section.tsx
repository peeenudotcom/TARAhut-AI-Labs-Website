'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Award, MapPin } from 'lucide-react'

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden min-h-screen flex items-center"
      style={{ backgroundColor: '#020617' }}
    >
      {/* 🌌 Background Glow */}
      <div className="absolute inset-0">
        <div
          className="absolute top-[-20%] left-[10%] w-[700px] h-[700px] rounded-full blur-[140px]"
          style={{ background: 'rgba(16,185,129,0.14)' }}
        />
        <div
          className="absolute bottom-[-20%] right-[5%] w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: 'rgba(13,148,136,0.10)' }}
        />
      </div>

      {/* 🌐 Grid Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right,rgba(255,255,255,0.06) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.06) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* 🎯 Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:py-16 lg:py-20 w-full">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-12 items-center">

          {/* LEFT — Copy and CTAs (from v1) */}
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6
                              rounded-full bg-white/5 border border-emerald-400/20
                              backdrop-blur-md text-sm text-emerald-300">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                🇮🇳 First Offline AI Labs of Punjab
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.05]"
            >
              Learn AI Skills{' '}
              <span className="block mt-2">
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                  That Actually Pay
                </span>
              </span>
            </motion.h1>

            <motion.p
              className="mt-6 text-base md:text-lg text-gray-400 leading-relaxed max-w-xl mx-auto md:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              Master ChatGPT, Claude, Canva AI &amp; Automation at Punjab&apos;s first dedicated
              offline AI training center — hands-on projects, real outcomes, no fluff.
            </motion.p>

            <motion.p
              className="mt-3 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              No coding required &nbsp;•&nbsp; Beginner friendly &nbsp;•&nbsp; Real projects
            </motion.p>

            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-5 py-2
                              rounded-full bg-emerald-500/10 border border-emerald-400/20
                              text-sm text-emerald-300">
                📍 Offline AI Training in Kotkapura (Punjab)
              </span>
            </motion.div>

            <motion.div
              className="mt-8 flex justify-center md:justify-start gap-4 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
            >
              <Link
                href="/learn"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
              >
                🚀 Try a Free AI Lesson
              </Link>
              <Link
                href="/learn"
                className="inline-flex flex-col items-center justify-center rounded-lg border border-amber-400/40 bg-transparent px-6 py-3 text-sm font-semibold text-amber-300 transition-colors hover:border-amber-400/60 hover:bg-amber-400/10 hover:text-amber-200"
              >
                Buy Any Online Course at ₹999/-
                <span className="mt-0.5 text-[10px] font-normal text-amber-300/60">(Limited Time Offer)</span>
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-transparent px-6 py-3 text-sm font-semibold text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                Explore Programs →
              </Link>
            </motion.div>

            <motion.div
              className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.75 }}
            >
              <span className="text-gray-500 font-medium">Tools you&apos;ll master:</span>
              {['ChatGPT', 'Claude', 'Canva AI', 'Midjourney', 'Python', '10+ more'].map((tool) => (
                <span
                  key={tool}
                  className="rounded-full bg-white/[0.05] border border-white/10 px-3 py-1 text-xs font-medium text-gray-400"
                >
                  {tool}
                </span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Founder portrait (from v3) */}
          <div className="relative flex items-center justify-center md:justify-end">
            <div className="relative group w-full max-w-[360px] md:max-w-[420px] lg:max-w-[460px]">
              <div
                className="absolute -inset-1 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(153,247,255,0.2), rgba(140,243,243,0.2))',
                }}
              />

              <div
                className="relative rounded-2xl overflow-hidden p-2 transform rotate-2"
                style={{
                  background: 'rgba(29,39,46,0.5)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/parveen-sukhija.jpg"
                  alt="Parveen Sukhija — Founder, TARAhut AI Labs"
                  className="w-full h-auto max-h-[70vh] rounded-lg object-cover filter grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
                  style={{ objectPosition: 'center 18%', aspectRatio: '4 / 5' }}
                />
              </div>

              <div
                className="absolute -top-6 -right-6 p-4 rounded-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500"
                style={{
                  background: 'rgba(29,39,46,0.5)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 20px 40px -10px rgba(153,247,255,0.1)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(153,247,255,0.2)', color: '#99f7ff' }}
                  >
                    <Award className="w-5 h-5" strokeWidth={2.25} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white leading-none">25+ Years</p>
                    <p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: '#a5acb3' }}>
                      Experience
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="absolute -bottom-8 -left-8 p-4 rounded-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500"
                style={{
                  background: 'rgba(29,39,46,0.5)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 20px 40px -10px rgba(6,182,212,0.15)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(140,243,243,0.2)', color: '#8cf3f3' }}
                  >
                    <MapPin className="w-5 h-5" strokeWidth={2.25} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white leading-none">Punjab, India</p>
                    <p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: '#a5acb3' }}>
                      HQ Center
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="absolute bottom-6 right-6 px-4 py-2 rounded-lg"
                style={{
                  background: 'rgba(29,39,46,0.7)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <p className="text-sm font-bold" style={{ color: '#99f7ff' }}>
                  Parveen Sukhija
                </p>
                <p className="text-[10px] uppercase text-slate-300">
                  Founder, TARAhut AI Labs
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
