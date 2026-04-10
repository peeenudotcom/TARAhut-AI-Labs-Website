import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 leads per IP per 10 minutes
    const ip = getClientIp(req);
    const limit = rateLimit(`leads:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a few minutes.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, phone, courseInterest, message, website } = body;

    // Honeypot: bots often fill all fields
    if (website) {
      return NextResponse.json({ success: true });
    }

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required.' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const db = createServiceClient();

    const { error } = await db.from('leads').insert({
      name,
      email,
      phone: phone || null,
      course_interest: courseInterest || null,
      message: message || null,
      source: 'contact_form',
    });

    if (error) {
      console.error('Lead insert error:', error);
      throw new Error('Failed to save lead');
    }

    // Also add to subscribers
    await db
      .from('subscribers')
      .upsert({ email, name }, { onConflict: 'email' })
      .select();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Leads API error:', error);
    return NextResponse.json(
      { error: 'Failed to submit. Please try again.' },
      { status: 500 }
    );
  }
}
