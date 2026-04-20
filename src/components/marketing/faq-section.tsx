'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { homepageFaqs, allFaqs } from '@/config/faqs'

export function FaqSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Animated gradient orbs — emerald theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[5%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[130px]"
          style={{ background: 'rgba(16, 185, 129, 0.10)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[10%] left-[-10%] w-[550px] h-[550px] rounded-full blur-[140px]"
          style={{ background: 'rgba(13, 148, 136, 0.08)' }}
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

      <div className="relative mx-auto max-w-3xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-white/[0.03] backdrop-blur px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#059669] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#059669]" />
            </span>
            <p className="text-xs font-semibold tracking-widest uppercase text-emerald-400">
              Got Questions?
            </p>
          </div>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Frequently Asked{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Questions</span>
              <motion.span
                className="absolute bottom-1 left-0 right-0 h-3 bg-gradient-to-r from-[#10b981]/30 to-[#14b8a6]/30 rounded"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
                style={{ originX: 0 }}
              />
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
            The most common questions we get from students and parents. Scroll for more.
          </p>
        </motion.div>

        {/* FAQ accordion */}
        <motion.div
          className="mt-14 rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-4 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Accordion>
            {homepageFaqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold text-white hover:text-emerald-400 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* See all CTA */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-transparent px-5 py-2.5 text-sm font-semibold text-emerald-400 transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-300"
          >
            See all {allFaqs.length} questions
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="mt-3 text-xs text-gray-500">
            Can&apos;t find what you&apos;re looking for?{' '}
            <Link href="/contact" className="text-emerald-400 hover:underline">
              Contact us
            </Link>
            {' '}or{' '}
            <a
              href="https://wa.me/919200882008?text=Hi%2C+I+have+a+question+about+TARAhut+AI+Labs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline"
            >
              WhatsApp us
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
