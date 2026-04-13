import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const client = new Anthropic();

type ToolType =
  | 'ai-tool-finder'
  | 'prompt-score'
  | 'career-roadmap'
  | 'kids-story'
  | 'homework-helper'
  | 'business-ideas'
  | 'first-client-plan'

const prompts: Record<ToolType, (input: string) => string> = {
  'ai-tool-finder': (input) => `A beginner wants to do this: "${input}"

Recommend the single best AI tool for this task and why. Format:

**Best Tool: [Tool Name]**
[One sentence explaining why it's perfect for this task]

**How to start:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Pro tip:** [One insider trick]

Be practical, specific, and beginner-friendly. Focus on free/affordable tools.`,

  'prompt-score': (input) => `Rate this prompt on a scale of 1-10 and explain why:

"${input}"

Format:

**Score: X/10**

**What's good:** [1-2 things]
**What's weak:** [1-2 things]

**Better version:**
[Rewritten prompt using the CRISP framework: Context, Role, Instructions, Specifics, Parameters]

Be direct, specific, and educational. Show exactly what changed and why.`,

  'career-roadmap': (input) => `Someone wrote: "${input}"

Generate a personalized 8-week AI career roadmap for them. Format:

**Your Path: [Suggested AI Career]**
[One sentence why it fits them]

**Week 1-2:** [Focus area + 1 concrete action]
**Week 3-4:** [Focus area + 1 concrete action]
**Week 5-6:** [Focus area + 1 concrete action]
**Week 7-8:** [Focus area + 1 concrete action]

**Expected income by Week 8:** ₹[amount]/month

Be specific to Indian market, use real AI tools, include earning paths.`,

  'kids-story': (input) => `Write a fun, educational short story (150-200 words) for a 10-year-old kid about: "${input}"

Make it:
- Exciting and imaginative
- Age-appropriate (Class 5-7)
- Include a simple moral or fact they'll remember
- Use simple English

Format:
**Title: [Story Title]**

[Story here]

**What you learned:** [One-line takeaway]`,

  'homework-helper': (input) => `A Class 8-10 student asked: "${input}"

Explain the answer in a way they'll actually understand:

**The answer in simple words:**
[2-3 sentences, simple English]

**Think of it like this:**
[A relatable analogy using everyday life]

**Step by step:**
1. [Step]
2. [Step]
3. [Step]

**Remember:** [Key point to remember for exams]

Be patient, encouraging, and use examples from Indian student life.`,

  'business-ideas': (input) => `Someone wrote: "${input}"

Suggest 3 AI-powered business ideas they could build in 90 days that match their interests/skills. For each:

**Idea 1: [Business Name]**
- What it does: [1 sentence]
- Target customer: [who pays]
- Monthly potential: ₹[amount]
- Starting cost: ₹[amount]

**Idea 2: [Business Name]**
[Same structure]

**Idea 3: [Business Name]**
[Same structure]

**My recommendation:** [Which one to start with and why]

Be specific to Indian market, practical, and actionable.`,

  'first-client-plan': (input) => `Someone wrote: "${input}"

Create a 45-day plan to get their FIRST paying client. Format:

**Your Services:**
[2-3 services they can offer based on their skills]

**Days 1-15: Build Your Foundation**
- [Specific action 1]
- [Specific action 2]
- [Specific action 3]

**Days 16-30: Start Outreach**
- [Specific action 1]
- [Specific action 2]
- [Specific action 3]

**Days 31-45: Close First Client**
- [Specific action 1]
- [Specific action 2]
- [Specific action 3]

**First client realistic price:** ₹[amount]
**Where to find first client:** [Specific platform/method]

Be ruthlessly practical, Indian market focused.`,
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { allowed } = rateLimit(`course-tool:${ip}`, { limit: 10, windowMs: 60_000 });
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Try again in a minute.' }, { status: 429 });
    }

    const { tool, input } = await req.json()
    if (!tool || !input || input.length < 3) {
      return NextResponse.json({ error: 'Enter a longer query' }, { status: 400 })
    }
    if (typeof input === 'string' && input.length > 2000) {
      return NextResponse.json({ error: 'Input too long. Maximum 2000 characters.' }, { status: 400 })
    }

    const promptFn = prompts[tool as ToolType]
    if (!promptFn) {
      return NextResponse.json({ error: 'Unknown tool' }, { status: 400 })
    }

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      messages: [{ role: 'user', content: promptFn(input) }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ result: text })
  } catch (error) {
    console.error('Course tool error:', error)
    return NextResponse.json({ error: 'Failed to generate result' }, { status: 500 })
  }
}
