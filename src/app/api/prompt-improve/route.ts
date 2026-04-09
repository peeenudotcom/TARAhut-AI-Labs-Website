import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic();

// Simple rate limit
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60000 })
    return false
  }
  entry.count++
  return entry.count > 5 // 5 per minute
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests. Try again in a minute.' }, { status: 429 })
    }

    const { prompt } = await req.json()
    if (!prompt || prompt.length < 5) {
      return NextResponse.json({ error: 'Enter a longer prompt' }, { status: 400 })
    }

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `You are a prompt engineering expert using the CRISP framework (Context, Role, Instructions, Specifics, Parameters).

A beginner wrote this prompt: "${prompt}"

Do two things:
1. Rewrite it using the CRISP framework to make it 10x better. Label it "IMPROVED PROMPT:"
2. In ONE short sentence, explain what made the original weak. Label it "WHY:"

Keep the improved prompt under 80 words. Be practical, not academic. Use simple English.`
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ result: text })
  } catch (error) {
    console.error('Prompt improve error:', error)
    return NextResponse.json({ error: 'Failed to improve prompt' }, { status: 500 })
  }
}
