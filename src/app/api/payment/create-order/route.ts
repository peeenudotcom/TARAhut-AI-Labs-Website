import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createServiceClient } from '@/lib/supabase';
import { validatePromoCode, computeDiscount, errorMessage } from '@/lib/promo';

// Single price for every online course. Server-authoritative — never
// compute pricing from client input.
const COURSE_PRICE = 999;

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, courseSlug, courseTitle, promoCode } = await req.json();

    if (!name || !email || !courseSlug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Compute final amount server-side. If a promo is supplied, re-validate
    // it here — never trust the client to tell us the discount.
    let finalAmount = COURSE_PRICE;
    let validatedPromoId: string | null = null;
    let discountPercent = 0;

    if (promoCode) {
      const validation = await validatePromoCode(promoCode, email);
      if (!validation.ok) {
        return NextResponse.json(
          { error: errorMessage(validation.error), code: validation.error },
          { status: 400 }
        );
      }
      const computed = computeDiscount(COURSE_PRICE, validation.discountPercent);
      finalAmount = computed.finalAmount;
      validatedPromoId = validation.id;
      discountPercent = validation.discountPercent;

      // 100%-off codes should go through /api/promo/apply, not here. Block
      // to avoid a Razorpay call with amount=0 (which Razorpay rejects).
      if (finalAmount <= 0) {
        return NextResponse.json(
          { error: 'This code fully covers the course — please use the free unlock flow.' },
          { status: 400 }
        );
      }
    }

    // Save lead to Supabase first (never lose a lead)
    const db = createServiceClient();
    await db.from('leads').insert({
      name,
      email,
      phone: phone || null,
      course_interest: courseSlug,
      message: `Landing page enrollment: ${courseTitle}`,
      source: 'landing_page',
    });

    // Create Razorpay order with the server-computed amount
    const order = await getRazorpay().orders.create({
      amount: finalAmount * 100, // Razorpay expects paise
      currency: 'INR',
      receipt: `upl_${Date.now()}`,
      notes: {
        course_slug: courseSlug,
        course_title: courseTitle,
        student_name: name,
        student_email: email,
        student_phone: phone || '',
        // Stash the validated promo so /api/payment/verify can record the
        // redemption atomically after Razorpay confirms payment.
        promo_code_id: validatedPromoId ?? '',
        promo_code: promoCode ? String(promoCode).trim().toUpperCase() : '',
        promo_discount_percent: String(discountPercent),
        original_amount: String(COURSE_PRICE),
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      finalAmount,
      originalAmount: COURSE_PRICE,
      discountPercent,
    });
  } catch (error) {
    console.error('Payment order error:', error);
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    return NextResponse.json(
      { error: `Payment failed: ${message}` },
      { status: 500 }
    );
  }
}
