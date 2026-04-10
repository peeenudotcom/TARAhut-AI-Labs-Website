'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const tools = [
  {
    name: 'ChatGPT',
    color: '#10A37F',
    bg: '#10A37F15',
    logo: 'https://cdn.simpleicons.org/openai/10A37F',
    useCase: 'Writing, research, coding, analysis & automation',
  },
  {
    name: 'Claude',
    color: '#D97706',
    bg: '#D9770615',
    logo: 'https://cdn.simpleicons.org/anthropic/D97706',
    useCase: 'Long documents, complex reasoning & safe AI outputs',
  },
  {
    name: 'Canva AI',
    color: '#00C4CC',
    bg: '#00C4CC15',
    logo: 'https://cdn.simpleicons.org/canva/00C4CC',
    useCase: 'Social media graphics, presentations & brand kits',
  },
  {
    name: 'Midjourney',
    color: '#4F46E5',
    bg: '#4F46E510',
    logo: 'https://cdn.simpleicons.org/midjourney/4F46E5',
    useCase: 'Hyper-realistic AI image generation for any project',
  },
  {
    name: 'Python',
    color: '#3776AB',
    bg: '#3776AB15',
    logo: 'https://cdn.simpleicons.org/python/3776AB',
    useCase: 'Build AI apps, automate tasks & analyse data',
  },
  {
    name: 'Notion AI',
    color: '#000000',
    bg: '#00000010',
    logo: 'https://cdn.simpleicons.org/notion/000000',
    useCase: 'AI-powered docs, project management & wikis',
  },
  {
    name: 'Perplexity',
    color: '#20808D',
    bg: '#20808D15',
    logo: 'https://cdn.simpleicons.org/perplexity/20808D',
    useCase: 'AI-powered search with cited sources in seconds',
  },
  {
    name: 'ElevenLabs',
    color: '#111827',
    bg: '#11182710',
    logo: 'https://cdn.simpleicons.org/elevenlabs/111827',
    useCase: 'Clone voices & create studio-quality AI audio',
  },
  {
    name: 'HeyGen',
    color: '#7C3AED',
    bg: '#7C3AED15',
    logoText: 'H',
    useCase: 'Create AI avatar videos without a camera or studio',
  },
  {
    name: 'Gamma',
    color: '#EC4899',
    bg: '#EC489915',
    logoText: 'γ',
    useCase: 'AI-generated presentations, one-pagers & docs',
  },
]

function ToolCard({ tool }: { tool: typeof tools[0] }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative group flex flex-col items-center gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-6 transition-all duration-200 hover:shadow-lg hover:shadow-[#e53935]/5 hover:scale-[1.04] hover:border-[#e53935]/30 cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-110"
        style={{ backgroundColor: tool.bg }}
      >
        {'logo' in tool && tool.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tool.logo}
            alt={tool.name}
            style={{ width: '28px', height: '28px', objectFit: 'contain' }}
          />
        ) : (
          <span className="text-2xl font-bold" style={{ color: tool.color }}>
            {tool.logoText}
          </span>
        )}
      </div>
      <span className="text-sm font-medium text-[#0F172A]">{tool.name}</span>

      {/* Tooltip */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.15 }}
          className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 w-52 rounded-xl border border-[#E2E8F0] bg-[#0F172A] px-3 py-2 text-center text-xs text-slate-300 shadow-xl pointer-events-none"
        >
          {tool.useCase}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rotate-45 rounded-sm bg-[#0F172A] border-r border-b border-[#E2E8F0]" />
        </motion.div>
      )}
    </div>
  )
}

export function ToolsShowcase() {
  return (
    <section className="bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold tracking-widest uppercase text-red-600">
            Industry-standard tools
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
            AI Tools You&apos;ll Master
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#475569]">
            These are the exact tools used in freelancing, jobs, and modern businesses.
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[#94A3B8]">
            Hover any tool to see its use case.
          </p>
        </motion.div>

        <motion.div
          className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07 } },
          }}
        >
          {tools.map((tool) => (
            <motion.div
              key={tool.name}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
              }}
            >
              <ToolCard tool={tool} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
