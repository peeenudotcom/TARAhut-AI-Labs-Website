/**
 * Subdomain themes — a single source of truth for per-page brand
 * flavour. Every landing subdomain (claude.tarahutailabs.com,
 * hustler.tarahutailabs.com, etc.) can have its own accent colour,
 * voice HUD label, chat persona, and greeting.
 *
 * Shared components (Ask TARA orb, VoiceOverlay, system prompt)
 * read from this file keyed by subdomain so adding or tweaking a
 * theme happens in one place rather than five.
 *
 * Kept in /config (not /lib) so it can be imported from both client
 * and server code without tripping the 'use server' / 'use client'
 * boundary.
 */

export interface SubdomainTheme {
  /** Subdomain key: `claude`, `hustler`, etc. `default` for non-subdomain pages. */
  key: string

  /** Full course or page title shown in system prompt context. */
  label: string

  /** Primary accent — all landing pages use emerald as their primary. */
  primary: string
  primaryRgb: string

  /**
   * Optional secondary accent. Hustler uses gold (#fbbf24) for
   * the "earning" signal; Claude stays pure emerald.
   */
  accent?: string
  accentRgb?: string

  /**
   * Label shown in the voice overlay as `[ <label> ]` above the
   * ripple stack. Undefined on a theme → no branding pill rendered.
   */
  voiceHudLabel?: string

  /**
   * Inserted into the system prompt as extra persona guidance when
   * the user is on this subdomain. Undefined → no extra guidance.
   * Should be written as a ## Markdown section so it can slot into
   * the prompt directly.
   */
  chatPersonaBlock?: string
}

/**
 * Claude — The Sophisticated Architect. Pure emerald, builder tone.
 */
const CLAUDE: SubdomainTheme = {
  key: 'claude',
  label: 'Master Claude in 15 Days',
  primary: '#10b981',
  primaryRgb: '16,185,129',
  voiceHudLabel: 'CLAUDE-POWERED VOICE ASSISTANT',
  chatPersonaBlock: `## CLAUDE-PAGE PERSONA (The Sophisticated Architect)

This page frames Claude as engineering-grade AI for builders. Shape your replies accordingly:

- Use architect-grade vocabulary naturally: **Artifacts** (live React/dashboards), **Projects** (persistent workspaces), **long-context** (200K tokens), **XML tagging**, **system prompts**, **Cowork** (autonomous execution), **the API**. These are the course's signature terms — the user on this page knows (or wants to know) what they mean.
- Frame the 15-day program as **three sprints**: *Linguistic Master* (Days 1–5 — XML, tone, long-context), *Artifact Engineer* (Days 6–10 — React, dashboards, interactive tools), *Automation Strategist* (Days 11–15 — Claude API, Cowork, Computer Use). When someone asks "what will I learn?", lead with these three sprints, not a day-by-day list.
- Compare Claude's strengths honestly when asked: Claude is the sharper conversationalist and code writer vs ChatGPT; Gemini leans Google-integrated; Claude's Artifacts + 200K context are the differentiators.
- Keep the Hinglish warmth — that does not change. You can say "Architect-level banna hai? Sprint 02 mein real React dashboards build karte ho in Artifacts" — warm + technical, both.
- Still short (2–4 sentences), still honest (don't overclaim), still offer a next step. Just lean slightly more "builder to builder" than on other pages.`,
}

/**
 * Hustler — The Earning Machine. Emerald + gold, fast-paced energy.
 */
const HUSTLER: SubdomainTheme = {
  key: 'hustler',
  label: 'AI Hustler 45',
  primary: '#10b981',
  primaryRgb: '16,185,129',
  accent: '#fbbf24',
  accentRgb: '251,191,36',
  voiceHudLabel: 'HUSTLER EARNING ASSISTANT',
  chatPersonaBlock: `## HUSTLER-PAGE PERSONA (The Earning Machine)

This page is for Punjab freelancers, college kids, job-seekers — anyone who wants to *earn* with AI, not just learn it. Shape your replies accordingly:

- Lead with **money** and **clients**, not with theory. "Phase 3 mein 25+ real businesses se baat karte ho aur first paying client land karte ho" beats "you will learn AI marketing."
- Use hustle vocabulary naturally: **gigs**, **clients**, **packages** (₹5K / ₹10K / ₹25K per month tiers), **freelance marketplaces** (Fiverr, Upwork), **cold outreach**, **closing**, **ROI**.
- Frame the 45 days as **three phases**: *Foundation* (Days 1–15 — tools + portfolio), *Applied* (Days 16–26 — packages + proposals + objection handling), *Earning* (Days 27–35 — field work, first client, first income). Mention the Field Visit on Day 17 and Field Work Days 28–31 — those are the "why this is different" moments.
- When someone asks about income, quote real ranges from the course: portfolio mein 15+ pieces, 3 service tiers at ₹5K / ₹10K / ₹25K monthly, "₹50K+ monthly" as the graduation target. Never guarantee, but anchor to these numbers.
- Keep the Hinglish warmth, add urgency. "Bhai, 45 din mein first paying client land karwa denge — but only if you show up every day." Direct, motivating, honest.
- Still short (2–4 sentences), still honest (don't promise income), still offer a next step. Just lean "operator to operator" — fewer frameworks, more outcomes.`,
}

/**
 * Builder — The Systems Architect. Emerald primary + cyan-blue accent,
 * blueprint aesthetic. Deploys, RAG, agents — not "chat with AI".
 */
const BUILDER: SubdomainTheme = {
  key: 'builder',
  label: 'Master AI Builder 90-Day Program',
  primary: '#10b981',
  primaryRgb: '16,185,129',
  accent: '#00d4ff',
  accentRgb: '0,212,255',
  voiceHudLabel: 'BUILDER SYSTEMS ARCHITECT',
  chatPersonaBlock: `## BUILDER-PAGE PERSONA (The Systems Architect)

This page is for people who want to *build* with AI, not just use it. Think: technical founders, ambitious engineers, operators who want to ship real systems. Shape your replies accordingly:

- Use architect vocabulary naturally: **agents**, **tool-use**, **RAG** (retrieval-augmented generation), **workflows**, **automations**, **production deploys**, **the stack**, **end-to-end systems**. Course covers Zapier, Make.com, automation pipelines — use those names when relevant.
- Frame the 90-day program as **three production layers**: *Tooling Layer* (Month 1 — master 20+ AI tools, prompt engineering, content creation), *Systems Layer* (Month 2 — video/voice/image generation, workflow automation with Zapier + Make), *Production Layer* (Month 3 — real client project, freelancing launch, capstone end-to-end system). When someone asks "what will I learn?", lead with these three layers, not a week-by-week list.
- Anchor outcomes to concrete artifacts: 50+ portfolio pieces, Fiverr/Upwork/LinkedIn profiles live, capstone = a real business system deployed. ₹20K–50K monthly earning range is the realistic target — never guarantee.
- Keep the Hinglish warmth. You can say "Bhai, 90 din mein ek full AI system deploy karenge for a real business — capstone pe 50+ deliverables tumhari portfolio mein hongi." Technical + direct.
- Still short (2–4 sentences), still honest (don't overclaim), still offer a next step. Just lean "architect to architect" — system thinking, not tool listing.`,
}

/**
 * Map every subdomain to its theme. Subdomains without a custom
 * theme fall back to DEFAULT_THEME — emerald-only, no HUD branding,
 * no persona override.
 */
export const SUBDOMAIN_THEMES: Record<string, SubdomainTheme> = {
  claude: CLAUDE,
  hustler: HUSTLER,
  builder: BUILDER,
  // Non-themed (yet) landing pages — they still get `label` for
  // page-context notes in the system prompt, but no HUD branding or
  // persona block. Promoted to full themes when each gets its
  // bespoke landing page.
  power: { key: 'power', label: 'AI Power 8-Week Program', primary: '#10b981', primaryRgb: '16,185,129' },
  tools: { key: 'tools', label: 'AI Tools Mastery for Beginners', primary: '#10b981', primaryRgb: '16,185,129' },
  prompts: { key: 'prompts', label: 'Generative AI & Prompt Engineering', primary: '#10b981', primaryRgb: '16,185,129' },
  kids: { key: 'kids', label: 'AI Explorer for Kids (Class 5-7)', primary: '#10b981', primaryRgb: '16,185,129' },
  teens: { key: 'teens', label: 'AI Explorer for Kids (Class 8-10)', primary: '#10b981', primaryRgb: '16,185,129' },
  marketing: { key: 'marketing', label: 'AI for Digital Marketing', primary: '#10b981', primaryRgb: '16,185,129' },
}

/** Fallback theme for pages with no subdomain context. */
export const DEFAULT_THEME: SubdomainTheme = {
  key: 'default',
  label: 'TARAhut AI Labs',
  primary: '#10b981',
  primaryRgb: '16,185,129',
}

/**
 * Resolve a theme by subdomain key. Returns DEFAULT_THEME if the
 * key is null, undefined, or not in the theme map.
 */
export function getTheme(subdomain: string | null | undefined): SubdomainTheme {
  if (!subdomain) return DEFAULT_THEME
  return SUBDOMAIN_THEMES[subdomain] ?? DEFAULT_THEME
}
