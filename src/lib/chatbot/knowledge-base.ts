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
