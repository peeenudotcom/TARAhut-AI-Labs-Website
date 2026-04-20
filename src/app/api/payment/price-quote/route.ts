import { NextRequest, NextResponse } from 'next/server';
import { quoteCoursePrice } from '@/lib/pricing-quote';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const { courseSlug, email, promoCode } = await req.json();

    if (!courseSlug || typeof courseSlug !== 'string') {
      return NextResponse.json(
        { error: 'courseSlug is required' },
        { status: 400 }
      );
    }

    // Light rate limit per email to discourage using this as a promo
    // oracle. validatePromoCode already enforces per-user uniqueness
    // at redemption time, but quoting is read-only and cheap so we
    // just cap it modestly here.
    if (email && typeof email === 'string') {
      const { allowed } = rateLimit(`quote:${email.trim().toLowerCase()}`, {
        limit: 30,
        windowMs: 600_000,
      });
      if (!allowed) {
        return NextResponse.json(
          { error: 'Too many quote requests. Please wait a few minutes.' },
          { status: 429 }
        );
      }
    }

    const quote = await quoteCoursePrice({
      courseSlug,
      email: typeof email === 'string' ? email : null,
      promoCode: typeof promoCode === 'string' ? promoCode : null,
    });

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Price quote error:', error);
    return NextResponse.json(
      { error: 'Failed to quote price' },
      { status: 500 }
    );
  }
}
