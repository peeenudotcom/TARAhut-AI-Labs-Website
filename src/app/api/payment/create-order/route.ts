import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createServiceClient } from '@/lib/supabase';
import { quoteCoursePrice } from '@/lib/pricing-quote';

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

    // Authoritative price: pricing config + server-validated promo.
    // Never trust a client-supplied amount.
    const quote = await quoteCoursePrice({ courseSlug, email, promoCode });

    if (quote.promoError) {
      return NextResponse.json(
        { error: quote.promoErrorMessage ?? 'Invalid promo code.', code: quote.promoError },
        { status: 400 }
      );
    }

    // 100%-off codes should go through /api/promo/apply, not here. Block
    // to avoid a Razorpay call with amount=0 (which Razorpay rejects).
    if (quote.finalAmount <= 0) {
      return NextResponse.json(
        { error: 'This code fully covers the course — please use the free unlock flow.' },
        { status: 400 }
      );
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
      amount: quote.finalAmount * 100, // Razorpay expects paise
      currency: 'INR',
      receipt: `upl_${Date.now()}`,
      notes: {
        course_slug: courseSlug,
        course_title: courseTitle,
        student_name: name,
        student_email: email,
        student_phone: phone || '',
        // Stash the validated promo + base price so verify-and-enroll can
        // record the redemption atomically after Razorpay confirms payment.
        promo_code_id: quote.promo?.id ?? '',
        promo_code: quote.promo?.code ?? '',
        promo_discount_percent: String(quote.discountPercent),
        original_amount: String(quote.basePrice),
        is_return_customer: String(quote.isReturnCustomer),
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      finalAmount: quote.finalAmount,
      originalAmount: quote.basePrice,
      discountPercent: quote.discountPercent,
      isReturnCustomer: quote.isReturnCustomer,
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
