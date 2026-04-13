import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PROMPTS: Record<string, (input: string) => string> = {
  'prompt-improver': (input) =>
    `You are an expert prompt engineer. Improve the following AI prompt to make it more specific, clear, and effective. Return ONLY the improved prompt — no explanations, no markdown headers, just the improved prompt text.\n\nOriginal prompt: ${input}`,

  'course-recommender': (input) =>
    `You are a course advisor at TARAhut AI Labs, an AI education company in Kotkapura, India. Based on the student's answers below, recommend the single best course for them and explain why in 3-4 sentences. Keep it friendly and motivating.\n\nStudent answers:\n${input}\n\nOur courses:\n1. AI Tools Mastery for Beginners — ChatGPT, Claude, Canva AI, 10+ tools, 6 weeks, ₹7,999\n2. AI for Digital Marketing — AI-powered SEO, ads, content, social media, 8 weeks, ₹9,999\n3. AI Explorer for School Kids (Junior, ages 10-14) — Scratch AI, basic ML, fun projects, 4 weeks, ₹4,999\n4. AI Explorer for School Kids (Senior, ages 15-18) — Python basics, ChatGPT, AI projects, 6 weeks, ₹6,999\n5. Generative AI & Prompt Engineering — Advanced Claude/GPT prompting, image gen, automation, 10 weeks, ₹14,999\n\nRespond in this format:\n**Recommended Course:** [course name]\n**Why this is perfect for you:** [3-4 sentence explanation]\n**Starting Price:** [price]\n**Next Step:** [one action they should take]`,

  'bio-writer': (input) =>
    `Write a professional LinkedIn bio (under 200 words) for this person. Make it confident, specific, and achievement-focused. Use first person. Do NOT use generic filler phrases like "passionate about" or "results-driven".\n\nDetails: ${input}\n\nReturn ONLY the bio text, no extra commentary.`,
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const { allowed } = rateLimit(`tools:${ip}`, { limit: 10, windowMs: 60_000 })
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Try again in a minute.' }, { status: 429 })
    }

    const { tool, input } = await req.json()

    if (!tool || !input || typeof input !== 'string') {
      return NextResponse.json({ error: 'tool and input are required' }, { status: 400 })
    }

    if (!PROMPTS[tool]) {
      return NextResponse.json({ error: 'Unknown tool' }, { status: 400 })
    }

    if (input.trim().length < 10) {
      return NextResponse.json({ error: 'Input too short' }, { status: 400 })
    }

    if (typeof input === 'string' && input.length > 2000) {
      return NextResponse.json({ error: 'Input too long (max 2000 chars)' }, { status: 400 })
    }

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      messages: [{ role: 'user', content: PROMPTS[tool](input) }],
    })

    const output = (response.content[0] as { text: string }).text.trim()
    return NextResponse.json({ output })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('AI Tools error:', message)
    return NextResponse.json({ error: 'AI tool failed, please try again' }, { status: 500 })
  }
}
