import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { allowed } = rateLimit(`prompt-improve:${ip}`, { limit: 10, windowMs: 60_000 });
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Try again in a minute.' }, { status: 429 });
    }

    const { prompt } = await req.json()
    if (!prompt || prompt.length < 5) {
      return NextResponse.json({ error: 'Enter a longer prompt' }, { status: 400 })
    }
    if (typeof prompt === 'string' && prompt.length > 2000) {
      return NextResponse.json({ error: 'Input too long. Maximum 2000 characters.' }, { status: 400 })
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
