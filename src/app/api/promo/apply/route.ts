import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';
import {
  validatePromoCode,
  computeDiscount,
  errorMessage,
} from '@/lib/promo';

// The single price every online course sells for today.
const COURSE_PRICE = 999;

export async function POST(req: NextRequest) {
  try {
    const {
      code,
      email,
      name,
      phone,
      courseSlug,
      courseTitle,
    } = await req.json();

    if (!code || !email || !courseSlug) {
      return NextResponse.json(
        { error: 'code, email, and courseSlug are required.' },
        { status: 400 }
      );
    }

    // Rate-limit per email: 10 apply attempts per 10 minutes. Prevents
    // someone guessing codes by hammering the endpoint.
    const rlKey = `promo:${email.trim().toLowerCase()}`;
    const { allowed } = rateLimit(rlKey, { limit: 10, windowMs: 600_000 });
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many attempts. Please wait 10 minutes.' },
        { status: 429 }
      );
    }

    const validation = await validatePromoCode(code, email);
    if (!validation.ok) {
      return NextResponse.json(
        { error: errorMessage(validation.error), code: validation.error },
        { status: 400 }
      );
    }

    const { discountAmount, finalAmount } = computeDiscount(
      COURSE_PRICE,
      validation.discountPercent
    );

    // Partial discount: don't redeem yet — let the client kick off Razorpay.
    // The /api/payment/create-order route will re-validate and atomically
    // record the redemption after payment succeeds.
    if (finalAmount > 0) {
      return NextResponse.json({
        freeUnlock: false,
        discountPercent: validation.discountPercent,
        originalAmount: COURSE_PRICE,
        discountAmount,
        finalAmount,
      });
    }

    // 100% off — redeem immediately. Record the redemption first; the
    // UNIQUE(promo_code_id, student_email) constraint is the source of
    // truth for one-per-user enforcement. If two requests race, one wins.
    const db = createServiceClient();

    const { error: redemptionError } = await db
      .from('promo_redemptions')
      .insert({
        promo_code_id: validation.id,
        student_email: email.trim().toLowerCase(),
        course_slug: courseSlug,
        discount_percent: validation.discountPercent,
        discount_amount: discountAmount,
        final_amount: 0,
      });

    if (redemptionError) {
      // Most likely the UNIQUE constraint tripped — treat as already-used.
      console.error('Promo redemption insert error:', redemptionError);
      return NextResponse.json(
        { error: 'Unable to apply this code. Please try again or contact us.' },
        { status: 400 }
      );
    }

    // Record the free "purchase" so it shows up alongside paid enrollments.
    await db.from('online_purchases').insert({
      student_email: email.trim().toLowerCase(),
      student_name: name ?? email,
      student_phone: phone || null,
      amount: 0,
      razorpay_payment_id: `PROMO_${code.trim().toUpperCase()}`,
      razorpay_order_id: null,
      access_type: 'single_course',
      status: 'active',
    });

    await db.from('payments').insert({
      student_name: name ?? email,
      student_email: email.trim().toLowerCase(),
      student_phone: phone || null,
      course_slug: courseSlug,
      course_title: courseTitle ?? courseSlug,
      amount: 0,
      currency: 'INR',
      razorpay_order_id: null,
      razorpay_payment_id: `PROMO_${code.trim().toUpperCase()}`,
      status: 'paid',
    });

    return NextResponse.json({
      freeUnlock: true,
      discountPercent: validation.discountPercent,
      finalAmount: 0,
      message:
        "Course unlocked! We'll email your access details shortly.",
    });
  } catch (error) {
    console.error('Promo apply error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
