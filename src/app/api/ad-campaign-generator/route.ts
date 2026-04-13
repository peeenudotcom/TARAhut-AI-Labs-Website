import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { allowed } = rateLimit(`ad-campaign:${ip}`, { limit: 5, windowMs: 60_000 });
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Try again in a minute.' }, { status: 429 });
    }

    const { business } = await req.json()
    if (!business || business.length < 3) {
      return NextResponse.json({ error: 'Describe your business' }, { status: 400 })
    }
    if (typeof business === 'string' && business.length > 2000) {
      return NextResponse.json({ error: 'Input too long. Maximum 2000 characters.' }, { status: 400 })
    }

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      messages: [{
        role: 'user',
        content: `You are a world-class digital marketing expert. A small business owner described their business: "${business}"

Generate a complete Facebook/Instagram ad campaign for them. Return ONLY valid JSON with this exact structure (no markdown, no code fences):

{
  "headline": "Scroll-stopping headline under 40 chars",
  "primary_text": "Ad body copy, 2-3 compelling sentences that hook readers and create urgency. Must sound human, not salesy.",
  "cta": "One of: Shop Now, Book Now, Learn More, Sign Up, Get Offer, Call Now, Order Now, Get Quote",
  "target_audience": "Specific targeting: age range, interests, location. Example: 'Women 25-45 in Punjab, interested in fashion & beauty'",
  "hashtags": ["5-8 relevant trending hashtags without the # symbol"],
  "best_platform": "Facebook, Instagram, or Both",
  "estimated_reach": "Realistic reach estimate like '5K-15K people' based on typical ₹500 budget"
}

Make it specific to their business, region-aware (Punjab/India context), and actionable. Use Hindi/Punjabi words where natural for emotional impact.`
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    try {
      const parsed = JSON.parse(text)
      return NextResponse.json({ result: parsed })
    } catch {
      return NextResponse.json({ error: 'AI response parsing failed. Try again.' }, { status: 500 })
    }
  } catch (error) {
    console.error('Ad campaign error:', error)
    return NextResponse.json({ error: 'Failed to generate campaign' }, { status: 500 })
  }
}
