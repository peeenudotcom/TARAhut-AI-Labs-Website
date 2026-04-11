import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase'
import { requireAdmin, AdminAuthError } from '@/lib/admin'
import { renderNewsletterHtml } from '@/lib/email/newsletter-template'
import { siteConfig } from '@/config/site'

function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY is not set')
  return new Resend(apiKey)
}

// Simple chunking helper — Resend limits batches to ~1000 recipients per request.
// We use BCC to hide recipient list from each other.
function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

interface SendRequest {
  subject: string
  html: string           // body fragment from Claude generator
  testEmail?: string     // if present, only send to this email (for testing)
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()

    const body = (await req.json()) as SendRequest
    const { subject, html, testEmail } = body

    if (!subject?.trim() || !html?.trim()) {
      return NextResponse.json({ error: 'Subject and html are required' }, { status: 400 })
    }

    const resend = getResend()
    const db = createServiceClient()
    const fromAddress = process.env.NEWSLETTER_FROM_ADDRESS || 'TARAhut AI Labs <insights@tarahutailabs.com>'
    const replyToAddress = process.env.NEWSLETTER_REPLY_TO || siteConfig.contact.email

    // TEST MODE — send to a single address only
    if (testEmail) {
      const unsubscribeUrl = `${siteConfig.url}/unsubscribe/test`
      const fullHtml = renderNewsletterHtml({ subject, bodyHtml: html, unsubscribeUrl })

      const result = await resend.emails.send({
        from: fromAddress,
        replyTo: replyToAddress,
        to: [testEmail],
        subject: `[TEST] ${subject}`,
        html: fullHtml,
      })

      if (result.error) {
        console.error('Resend test error:', result.error)
        return NextResponse.json({ error: result.error.message }, { status: 500 })
      }

      return NextResponse.json({ ok: true, mode: 'test', sentTo: testEmail })
    }

    // LIVE SEND — fetch all active subscribers
    const { data: subscribers, error: fetchError } = await db
      .from('subscribers')
      .select('email, unsubscribe_token, active')
      .eq('active', true)

    if (fetchError) {
      console.error('Fetch subscribers error:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: 'No active subscribers' }, { status: 400 })
    }

    // Log the issue as draft first so we have a record if send fails partway
    const { data: issueRow, error: issueError } = await db
      .from('newsletter_issues')
      .insert({
        subject,
        content_html: html,
        content_markdown: html,
        status: 'draft',
      })
      .select()
      .single()

    if (issueError || !issueRow) {
      console.error('Log issue error:', issueError)
      return NextResponse.json({ error: 'Failed to log newsletter issue' }, { status: 500 })
    }

    // Send one email per subscriber (each gets their own unsubscribe link)
    // Resend allows batching via resend.batch.send — up to 100 per batch
    let sent = 0
    let failed = 0
    const errors: string[] = []

    const batches = chunk(subscribers, 50)
    for (const batch of batches) {
      const emails = batch.map((sub) => {
        const unsubscribeUrl = `${siteConfig.url}/unsubscribe/${sub.unsubscribe_token}`
        return {
          from: fromAddress,
          replyTo: replyToAddress,
          to: [sub.email as string],
          subject,
          html: renderNewsletterHtml({ subject, bodyHtml: html, unsubscribeUrl }),
          headers: {
            'List-Unsubscribe': `<${unsubscribeUrl}>, <mailto:${replyToAddress}?subject=unsubscribe>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        }
      })

      try {
        const result = await resend.batch.send(emails)
        if (result.error) {
          failed += batch.length
          errors.push(result.error.message)
        } else {
          sent += batch.length
        }
      } catch (err) {
        failed += batch.length
        errors.push(err instanceof Error ? err.message : String(err))
      }
    }

    // Mark issue as sent with final count
    await db
      .from('newsletter_issues')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        sent_to_count: sent,
      })
      .eq('id', issueRow.id)

    return NextResponse.json({
      ok: true,
      mode: 'live',
      sent,
      failed,
      total: subscribers.length,
      issueId: issueRow.id,
      errors: errors.slice(0, 3),
    })
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('Newsletter send error:', error)
    const message = error instanceof Error ? error.message : 'Send failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
