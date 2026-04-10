'use client'

import { motion } from 'framer-motion'

const perks = [
  { icon: '🤖', title: 'Daily AI News', desc: 'Curated AI tools and updates every morning' },
  { icon: '💬', title: 'Peer Learning', desc: 'Ask questions, share wins, get answers fast' },
  { icon: '🎁', title: 'Exclusive Resources', desc: 'Free templates, prompts, and cheatsheets' },
  { icon: '🔔', title: 'Batch Alerts', desc: 'First to know when new batches open' },
]

export function CommunitySection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <motion.div
        className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#022C22] via-[#064E3B] to-[#B91C1C] p-8 md:p-14"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-16">
          {/* Left */}
          <div className="flex-1 text-center md:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm font-medium text-red-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400"></span>
              </span>
              2,100+ members active now
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Join Our Free<br />
              <span className="bg-gradient-to-r from-red-400 to-teal-300 bg-clip-text text-transparent">
                AI WhatsApp Community
              </span>
            </h2>

            <p className="mt-4 max-w-md text-slate-300 md:mx-0 mx-auto">
              India&apos;s most active AI learners community. Get daily tips, free resources, and connect with people using AI to grow their careers and businesses.
            </p>

            <a
              href="https://chat.whatsapp.com/uplrn-community"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#25D366] px-8 py-4 text-base font-bold text-white shadow-xl shadow-[#25D366]/30 transition-all hover:brightness-110 hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Join Free WhatsApp Community
            </a>

            <p className="mt-3 text-xs text-slate-500">Free forever. No selling. Just learning together.</p>
          </div>

          {/* Right — perks grid */}
          <div className="grid w-full grid-cols-2 gap-4 md:w-auto md:min-w-[340px]">
            {perks.map((p, i) => (
              <motion.div
                key={p.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <span className="text-2xl">{p.icon}</span>
                <p className="mt-2 text-sm font-semibold text-white">{p.title}</p>
                <p className="mt-1 text-xs text-slate-400">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
