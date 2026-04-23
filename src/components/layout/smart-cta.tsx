'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { siteConfig } from '@/config/site'

// SmartCta — context-aware header button. Watches the page for any
// element marked with `data-cta="<variant-id>"` and swaps its label,
// icon, and link to match whichever marked section is most visible.
// Falls back to the default ("Book Free Demo" → WhatsApp) when no
// marked section is on screen.
//
// Each variant's micro-decision lives in one place (CTA_VARIANTS) so
// adding a new contextual prompt is a single dictionary entry. The
// page just needs `data-cta="that-id"` on whatever section should
// trigger it.

type CtaIconKind = 'demo' | 'play' | 'tag' | 'unlock' | 'roadmap'

interface CtaVariant {
  id: string
  label: string
  href: string
  external?: boolean
  icon?: CtaIconKind
}

const WHATSAPP_DEMO_HREF = `https://wa.me/${siteConfig.contact.phone.replace(
  /\D/g,
  ''
)}?text=${encodeURIComponent(
  'Hi, I want to book a free demo class at TARAhut AI Labs.'
)}`

const CTA_VARIANTS: Record<string, CtaVariant> = {
  default: {
    id: 'default',
    label: 'Book Free Demo',
    href: WHATSAPP_DEMO_HREF,
    external: true,
    icon: 'demo',
  },
  'free-session': {
    id: 'free-session',
    label: 'Unlock Session 1 Free',
    href: '/learn',
    icon: 'unlock',
  },
  'video-samples': {
    id: 'video-samples',
    label: 'See AI Video Samples',
    href: '/lab-feed',
    icon: 'play',
  },
  'discount': {
    id: 'discount',
    label: 'Claim 80% Discount',
    href: '/learn',
    icon: 'tag',
  },
  'roadmap': {
    id: 'roadmap',
    label: 'Get Your AI Roadmap',
    href: '/start',
    icon: 'roadmap',
  },
}

const RESERVED = new Set(['', 'default'])

export function SmartCta() {
  const [activeId, setActiveId] = useState<string>('default')
  // intersectionRatio per observed element so we can always pick the
  // "most visible" CTA-tagged section, not just the most recent.
  const ratiosRef = useRef<Map<Element, number>>(new Map())
  const pulseControls = useAnimationControls()

  useEffect(() => {
    if (typeof window === 'undefined') return

    function pickActive() {
      let best: { id: string; ratio: number } | null = null
      ratiosRef.current.forEach((ratio, el) => {
        const id = el.getAttribute('data-cta')
        if (!id || RESERVED.has(id) || !CTA_VARIANTS[id]) return
        if (!best || ratio > best.ratio) best = { id, ratio }
      })
      const next: string = best ? (best as { id: string }).id : 'default'
      setActiveId((prev) => (prev === next ? prev : next))
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0) {
            ratiosRef.current.set(e.target, e.intersectionRatio)
          } else {
            ratiosRef.current.delete(e.target)
          }
        })
        pickActive()
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] }
    )

    // Initial scan + a MutationObserver so sections that mount later
    // (e.g. a client-side page transition) also register.
    function attach(root: ParentNode) {
      root.querySelectorAll('[data-cta]').forEach((el) => observer.observe(el))
    }
    attach(document)

    const mo = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return
          const el = n as Element
          if (el.matches?.('[data-cta]')) observer.observe(el)
          attach(el)
        })
      })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mo.disconnect()
    }
  }, [])

  // Pulse the border once whenever the variant changes — draws the
  // visitor's eye to the new offer in the header.
  useEffect(() => {
    pulseControls.start({
      boxShadow: [
        '0 6px 20px -6px rgba(16,185,129,0.5)',
        '0 0 0 4px rgba(16,185,129,0.55), 0 10px 30px -6px rgba(16,185,129,0.7)',
        '0 6px 20px -6px rgba(16,185,129,0.5)',
      ],
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
    })
  }, [activeId, pulseControls])

  const variant = CTA_VARIANTS[activeId] ?? CTA_VARIANTS.default

  // Inner content is the same for both internal/external variants.
  const inner = (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={variant.id}
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -18, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-1.5 whitespace-nowrap"
      >
        <CtaIcon variant={variant.icon} />
        {variant.label}
      </motion.span>
    </AnimatePresence>
  )

  // motion.a / motion.link handles `layout` so the button width
  // animates smoothly when the label length changes, instead of
  // jittering between sizes.
  const baseClass =
    'group/cta relative inline-flex h-9 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 px-4 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:from-emerald-400 hover:to-emerald-500 active:scale-[0.97]'

  if (variant.external) {
    return (
      <motion.a
        layout
        animate={pulseControls}
        href={variant.href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
        transition={{ layout: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
        style={{ minWidth: 168 }}
      >
        {inner}
      </motion.a>
    )
  }

  return (
    <motion.span
      layout
      animate={pulseControls}
      className="inline-flex"
      transition={{ layout: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
      style={{ minWidth: 168, borderRadius: 8 }}
    >
      <Link href={variant.href} className={baseClass + ' w-full'}>
        {inner}
      </Link>
    </motion.span>
  )
}

function CtaIcon({ variant }: { variant: CtaIconKind | undefined }) {
  if (!variant) return null
  const className = 'size-3.5 shrink-0 drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]'
  switch (variant) {
    case 'play':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
      )
    case 'tag':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12V6a2 2 0 0 0-2-2h-6L3 13l8 8 9-9Z" />
          <circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'unlock':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 11V8a4 4 0 0 0-8 0M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z" />
        </svg>
      )
    case 'roadmap':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6Zm6-3v15m6-12v15" />
        </svg>
      )
    case 'demo':
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.326 0-4.48-.742-6.24-2.004l-.436-.326-2.65.889.889-2.65-.326-.436A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
      )
  }
}
