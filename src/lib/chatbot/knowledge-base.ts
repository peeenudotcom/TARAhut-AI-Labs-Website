// Ask TARA's knowledge base — auto-generated from existing site configs.
// When courses, pricing, or FAQs change, the bot automatically knows the new info.
// This keeps the bot grounded in real data and prevents hallucinations.

import { courses } from '@/config/courses'
import { faqCategories } from '@/config/faqs'
import { siteConfig } from '@/config/site'
import { renderSemanticSessions } from './semantic-sessions'

export function buildKnowledgeBase(): string {
  const sections: string[] = []

  // ==================== ABOUT TARAHUT ====================
  sections.push(`# ABOUT ${siteConfig.name.toUpperCase()}

${siteConfig.description}

**Full Address:** ${siteConfig.contact.fullAddress}
**Phone / WhatsApp:** ${siteConfig.contact.phone}
**Email:** ${siteConfig.contact.email}
**Website:** ${siteConfig.url}

**Google Maps:** https://www.google.com/maps/search/?api=1&query=${siteConfig.contact.googleMapsQuery}

TARAhut AI Labs is a practical, hands-on AI training center located at **Railway Road, Mehta Chowk, Kotkapura, Punjab 151204**. We teach students, freelancers, parents, and business owners how to use AI tools like ChatGPT, Claude, Canva AI, Midjourney, Python, and more — without requiring coding knowledge for most courses. Our focus is income outcomes (freelancing, jobs, business growth), not just theory.

When someone asks "where are you?", "what's the address?", "how do I find you?", "can you share location?", or anything similar — ALWAYS give the full address:
**Railway Road, Mehta Chowk, Kotkapura, Punjab 151204, India**

Then offer: "Want me to share the Google Maps link? Or WhatsApp us at +91 92008-82008 and we'll send the exact pin directly to your phone."

TARAhut is an umbrella brand that includes TARAhut AI Labs (AI training) and TARAhut Visa (visa consultancy). For visa-related questions, recommend contacting us on WhatsApp since the visa team handles those directly.`)

  // ==================== FOUNDER & TEAM ====================
  // TARA needs to confidently answer "who is the founder" / "who runs
  // this place" / "tell me about Parveen". Without this section the
  // bot deflects to WhatsApp, which kills the trust moment when a
  // curious visitor is checking credibility.
  sections.push(`# FOUNDER & TEAM

## Parveen Sukhija — Founder & Lead Instructor

**Parveen Sukhija** founded TARAhut AI Labs. He has 25+ years of experience across IT, digital marketing, and education — building products, running teams, and teaching. After watching the AI revolution unfold from tier-1 boardrooms, he came back to Kotkapura with one question: *"Why should a student in Punjab wait five years for what a student in Bangalore has today?"*

TARAhut AI Labs is his answer to that question. Every curriculum, every session, every tool choice is calibrated against one bar: *"Will this help a student earn or build within 90 days?"* The result is a program that's less theory, more output — and a lab that's always running live projects alongside the teaching.

His mission line, in his own words: *"The next decade will reward people who use AI with intent, not people who fear it. Our job is to put that intent within reach."*

**Quick stats about Parveen:**
- 25+ years in technology (IT, digital marketing, education)
- Designed all 9 of TARAhut's current courses
- Founded the Kotkapura HQ lab — first cohorts running now
- Based in Kotkapura, Punjab — runs the lab in person

**More about him on the About page:** ${siteConfig.url}/about

## Liky Prusty — Master Trainer

**Liky Prusty** is TARAhut's Master Trainer. Specialty: hands-on AI + curriculum lead. Liky leads the live training sessions in the Kotkapura lab and ensures every student walks away with a real project, not just a certificate.

## When students ask "who is the founder?" / "who runs this?" / "who's behind TARAhut?"

Answer confidently and with warmth. Lead with Parveen's name + the 25-year credential + the Kotkapura origin story. Mention that he designs every course himself. End with a soft offer: "Want to meet him? He's at the lab most days — ya WhatsApp pe baat kar sakte hain." Or point them to ${siteConfig.url}/about for the full story + his photo.

NEVER say "I don't have that info" about the founder. The full bio is right above this paragraph.`)

  // ==================== TARAHUT TOOLS & PAGES ====================
  // Free tools and key pages on the site that TARA should know about
  // and route students to. Without this section TARA shrugs at
  // "what is Lab Feed?" or "what is the Career Architect?" — both
  // are flagship features she should be promoting, not asking about.
  sections.push(`# TARAHUT TOOLS & FLAGSHIP PAGES

## 🪐 The Live Lab Feed — ${siteConfig.url}/lab-feed

A public bento-grid gallery of real student projects from the Kotkapura lab and online batches. Updated weekly. Each tile shows:
- A real output (logo, ad video, no-code site, AI workflow, etc.)
- The student's name and batch/location
- The exact session number where the technique was taught
- The tech tag (Midjourney, HeyGen, Make.com, Bolt.new, etc.)
- Hover any tile → an emerald panel slides up showing the actual prompt or workflow that produced the output

Why it matters: it's the proof surface. When someone asks "can I really do this?" or "what do students actually build?" — point them here.

When students ask **"what is Lab Feed?"** answer like: "It's our public showcase of real student projects — the actual logos, ads, websites, and workflows graduates have shipped from the lab. Each tile shows which session taught the technique, and you can hover to see the prompt that built it. Take a look: ${siteConfig.url}/lab-feed"

## 🎯 The AI Career Architect — ${siteConfig.url}/start

A 3-step interactive diagnostic that designs a custom course path for the visitor:
1. Who are you? (Student / Biz Owner / Freelancer / Professional)
2. What's your goal? (Save Time / Make Money / Get a Job / Scale)
3. Name + WhatsApp

After answering, TARA's "thinking" animation runs (~3s), then a personalized roadmap reveal: a primary recommended course + 2 alternatives + 3 highlighted sessions from the primary course. Final CTA generates a real PDF roadmap and opens WhatsApp pre-filled with the student's profile.

When someone is undecided across multiple courses, route them here. It's also the page to share on social media for cold traffic.

When students ask **"how do I pick a course?"** or **"which course is right for me?"** answer like: "Try the AI Career Architect — it asks you 3 quick questions and TARA matches you to the right course with a downloadable PDF roadmap. Takes 90 seconds: ${siteConfig.url}/start"

## ✨ The Emerald Prompt Vault — ${siteConfig.url}/tools/prompts

Free searchable library of 25+ production prompts tuned for Punjab workflows. Categories: Legal, Real Estate, Retail & Dhaba, Content, Automation, Agriculture. Every prompt includes:
- The full prompt text with {{placeholder}} variables
- A "TARA Tip" explaining why the prompt structure works
- One-click Copy button
- A nudge back to the AI Tools Mastery session that teaches the underlying logic

Why it matters: it's the daily-utility hook. Even non-students come back to grab prompts, which keeps TARAhut top-of-mind when they're ready to upgrade to a paid course.

When students ask **"do you have free resources?"** or **"can I get prompts for my [legal/real estate/dhaba/farm/content] business?"** answer like: "Yes — the Emerald Prompt Vault has 25+ ready-to-use prompts for Punjab businesses. Free to copy, each one with TARA's notes on why it works: ${siteConfig.url}/tools/prompts"

## Other key pages

- **All courses overview:** ${siteConfig.url}/courses
- **Try Session 1 free:** ${siteConfig.url}/learn
- **About + founder story:** ${siteConfig.url}/about
- **FAQ:** ${siteConfig.url}/faq
- **Contact:** ${siteConfig.url}/contact

NEVER say "I'm not sure what that refers to" about Lab Feed, Career Architect, or Prompt Vault — they are TARAhut's flagship free tools and the bot should promote them, not deflect.`)

  // ==================== COURSES ====================
  sections.push(`# COURSES WE OFFER

We currently have ${courses.length} courses. Here's every course with full details:`)

  courses.forEach((course, i) => {
    const priceText = course.originalPrice
      ? `₹${course.price.toLocaleString('en-IN')} (originally ₹${course.originalPrice.toLocaleString('en-IN')})`
      : `₹${course.price.toLocaleString('en-IN')}`

    const syllabusText = course.syllabus && course.syllabus.length > 0
      ? `\n\n**Syllabus:**\n${course.syllabus.slice(0, 6).map((s) => `- ${s.module}`).join('\n')}`
      : ''

    const outcomesText = course.learningOutcomes && course.learningOutcomes.length > 0
      ? `\n\n**What you'll learn:**\n${course.learningOutcomes.slice(0, 5).map((o: string) => `- ${o}`).join('\n')}`
      : ''

    const toolsText = course.tools && course.tools.length > 0
      ? `\n\n**Tools covered:** ${course.tools.join(', ')}`
      : ''

    sections.push(`## ${i + 1}. ${course.title}

**Price:** ${priceText}
**Duration:** ${course.duration}
**Level:** ${course.level}
**Category:** ${course.category}
**Page:** ${siteConfig.url}/courses/${course.slug}

${course.shortDescription}${syllabusText}${outcomesText}${toolsText}`)
  })

  // ==================== SEMANTIC SESSION MAP ====================
  // Enriched 16-session map for the flagship AI Tools Mastery course.
  // TARA uses the tags to match user intent ("save time on social
  // media" → Session 06 Canva AI) instead of keyword-matching titles.
  sections.push(renderSemanticSessions())

  // ==================== FAQ ====================
  sections.push(`# FREQUENTLY ASKED QUESTIONS

These are official answers to common questions. When users ask about any of these topics, use these answers verbatim or paraphrase in Hinglish tone:`)

  faqCategories.forEach((category) => {
    sections.push(`## ${category.emoji} ${category.name}`)
    category.faqs.forEach((faq) => {
      sections.push(`**Q: ${faq.question}**\nA: ${faq.answer}`)
    })
  })

  // ==================== WHAT TARAHUT DOES NOT DO ====================
  sections.push(`# WHAT TARAHUT DOES NOT DO (set expectations honestly)

TARAhut is a private training center, NOT:
- A government-accredited university or college
- A degree-granting institution
- A guaranteed job placement agency (we provide placement ASSISTANCE, not guarantees)
- A free service (we are a paid training center, with honest pricing)
- A substitute for formal college education

Our certificates are TARAhut-verified and digitally shareable on LinkedIn, but are NOT affiliated with any university or government body. What matters more than accreditation is the portfolio of real projects students build during each course.`)

  // ==================== BRAND POSITIONING ====================
  sections.push(`# HOW TO POSITION TARAHUT

When explaining what makes TARAhut different:
- Practical and hands-on, not theoretical
- Real projects, not just slides
- Focus on income outcomes (freelancing, jobs, business)
- **All classes are held OFFLINE at our center in Kotkapura, Punjab** — we do NOT offer online classes. In-person training gives better outcomes.
- Instructors who actually use AI to build things
- Honest pricing, clear refund policy, no overclaims

When explaining who TARAhut is NOT for:
- People who want a free course (we are paid)
- People who want a government degree (we issue our own verifiable certificates)
- People who expect guaranteed placements (we assist, but outcomes depend on effort)
- People who refuse to practice (our courses require hands-on work)`)

  return sections.join('\n\n---\n\n')
}
