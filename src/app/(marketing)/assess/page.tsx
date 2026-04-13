'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AssessLandingPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden min-h-[85vh] flex items-center"
        style={{ backgroundColor: '#020617' }}
      >
        <div className="absolute inset-0">
          <div
            className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[120px]"
            style={{ background: 'rgba(16,185,129,0.10)' }}
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right,rgba(255,255,255,0.06) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.06) 1px,transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-28 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm text-gray-300">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Free AI Assessment — Takes 2 minutes
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-semibold tracking-tight text-white leading-tight"
          >
            Find Out Which Parts of{' '}
            <span className="text-emerald-300 block mt-2">
              Your Business AI Can Automate
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg md:text-xl text-gray-400 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            Answer 8 quick questions about your business. Our AI analyzes your
            workflow and gives you a personalized report with the top 3
            automations that will save you the most time.
          </motion.p>

          <motion.p
            className="mt-3 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            No signup required &nbsp;•&nbsp; 100% free &nbsp;•&nbsp; Personalized AI report
          </motion.p>

          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            <Link
              href="/assess/quiz"
              className="inline-block px-10 py-4 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 text-black font-medium shadow-[0_10px_40px_rgba(16,185,129,0.35)] hover:scale-105 hover:shadow-[0_20px_60px_rgba(16,185,129,0.5)] transition-all duration-300 text-lg"
            >
              Start Free Assessment →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[#0A0F1C]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-white mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Answer 8 Questions',
                desc: 'Tell us about your business, team size, and biggest time sinks. Takes under 2 minutes.',
              },
              {
                step: '2',
                title: 'AI Analyzes Your Business',
                desc: 'Our AI maps your workflow against 100+ automation patterns used by businesses like yours.',
              },
              {
                step: '3',
                title: 'Get Your Report',
                desc: 'Receive a personalized report with the top 3 AI automations, estimated time saved, and exact tools to use.',
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Number(item.step) * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/assess/quiz"
              className="inline-block px-8 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
            >
              Take the Assessment →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
