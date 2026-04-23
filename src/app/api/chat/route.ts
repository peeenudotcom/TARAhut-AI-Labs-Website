import { NextRequest, NextResponse } from 'next/server'
import { streamText, convertToModelMessages, type UIMessage } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { buildSystemPrompt } from '@/lib/chatbot/system-prompt'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const maxDuration = 60

interface ChatRequest {
  messages: UIMessage[]
  subdomain?: string | null
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 20 messages per IP per 10 minutes
    // Prevents abuse and runaway Claude API costs
    const ip = getClientIp(req)
    const limit = rateLimit(`chat:${ip}`, { limit: 20, windowMs: 10 * 60 * 1000 })
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error:
            'Too many messages. Please wait a few minutes or WhatsApp us directly at +91 92008-82008.',
        },
        { status: 429 }
      )
    }

    const body = (await req.json()) as ChatRequest
    const { messages, subdomain } = body

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'messages array is required' }, { status: 400 })
    }

    // Validate last user message length (UIMessage uses parts, not content)
    const lastMsg = [...messages].reverse().find((m) => m.role === 'user')
    if (lastMsg) {
      const textContent = lastMsg.parts
        .filter((p) => p.type === 'text')
        .map((p) => (p as { type: 'text'; text: string }).text)
        .join('')
      if (textContent.length > 2000) {
        return NextResponse.json({ error: 'Message too long. Maximum 2000 characters.' }, { status: 400 })
      }
    }

    // Cap history to last 20 messages to keep token usage bounded
    const trimmedMessages = messages.slice(-20)

    // Build the system prompt with page context. ~8-10K tokens once
    // the knowledge base, semantic session map, and reasoning rules
    // are inlined — too expensive to re-process on every "what's the
    // address?" so we mark it as ephemeral cache (5-min TTL). After
    // the first request in a window, subsequent requests pay ~10% of
    // the input-token cost AND respond several × faster.
    const systemPrompt = buildSystemPrompt({ subdomain })

    const modelMessages = await convertToModelMessages(trimmedMessages)

    const result = streamText({
      // Anthropic native model ID format (hyphens, with date) — matches what /api/assess
      // and /api/course-tool use. Do NOT use "claude-haiku-4.5" — that's Vercel AI Gateway
      // slug format and fails against the direct Anthropic provider.
      model: anthropic('claude-haiku-4-5-20251001'),
      messages: [
        // System prompt as a leading system message with cacheControl
        // so Anthropic caches the heavy KB. The `system` field doesn't
        // accept providerOptions, so we promote the system prompt
        // into the messages array to attach the cache breakpoint.
        {
          role: 'system',
          content: systemPrompt,
          providerOptions: {
            anthropic: { cacheControl: { type: 'ephemeral' } },
          },
        },
        ...modelMessages,
      ],
      maxOutputTokens: 800,
      temperature: 0.7,
      onError: ({ error }) => {
        console.error('[Ask TARA] streamText error:', error)
      },
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('[Ask TARA] Chat API error:', error)
    const message = error instanceof Error ? error.message : 'Chat failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
