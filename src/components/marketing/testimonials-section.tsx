'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    quote:
      'I had zero technical background, but after the AI Tools Mastery course, I now use ChatGPT and Canva AI daily at my job. My manager was impressed when I automated our weekly reports. Best investment I have made in my career.',
    name: 'Harpreet Kaur',
    role: 'Marketing Executive, Ludhiana',
    rating: 5,
    color: '#e53935',
  },
  {
    quote:
      'The Python & AI Development course changed my career trajectory. I went from being a BCA fresher with no direction to getting placed at a Chandigarh-based IT company within two months of completing the course. Parveen sir explains everything so clearly.',
    name: 'Arjun Sharma',
    role: 'Software Developer, Chandigarh',
    rating: 5,
    color: '#EF4444',
  },
  {
    quote:
      'As a small business owner, I was skeptical about AI. The AI for Business Leaders course showed me how to use AI for customer service and social media. My business efficiency has improved by at least 40%. Highly recommended for anyone running a business in Punjab.',
    name: 'Gurleen Singh',
    role: 'Business Owner, Jalandhar',
    rating: 5,
    color: '#F59E0B',
  },
  {
    quote:
      'The AI Content Creation course was a game-changer for my freelance career. I can now deliver social media content, blog posts, and even short videos 3x faster than before. My clients are amazed at the quality and turnaround time. Worth every rupee.',
    name: 'Nisha Patel',
    role: 'Freelancer, Amritsar',
    rating: 5,
    color: '#DC2626',
  },
  {
    quote:
      'I enrolled my entire HR team in the AI for Business course. The automation techniques we learned have cut our recruitment screening time by half. The practical approach and real-world examples made it easy for non-tech people like us to adopt AI confidently.',
    name: 'Rajesh Kumar',
    role: 'HR Manager, Ludhiana',
    rating: 5,
    color: '#EF4444',
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
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm font-medium tracking-widest uppercase text-[#e53935]">
          Trusted by students
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
          What Our First Learners Are Experiencing
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[#475569]">
          Real feedback from students who applied AI skills to their work and business.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {displayed.map((t, i) => (
          <motion.div
            key={t.name}
            className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-10 shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            {/* Gradient left border accent */}
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#e53935] to-[#DC2626]" />

            {/* Large quote icon */}
            <span className="block text-5xl font-serif leading-none font-bold bg-gradient-to-r from-[#e53935] to-[#DC2626] bg-clip-text text-transparent select-none">
              &ldquo;
            </span>

            <Stars count={t.rating} />

            <blockquote className="mt-4 text-sm leading-relaxed text-[#475569]">
              {t.quote}
            </blockquote>

            <div className="mt-8 flex items-center gap-3 border-t border-[#E2E8F0] pt-5">
              {/* Avatar initials circle */}
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: t.color }}
              >
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">{t.name}</p>
                <p className="text-xs text-[#64748B]">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* See more / See less toggle */}
      {!showAll && (
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <button
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#e53935] transition-colors hover:text-[#EF4444]"
          >
            See more reviews
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
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#e53935] transition-colors hover:text-[#EF4444]"
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
    </section>
  )
}
