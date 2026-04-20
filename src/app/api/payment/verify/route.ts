import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServiceClient } from '@/lib/supabase';
import { validatePromoCode, computeDiscount } from '@/lib/promo';

const COURSE_PRICE = 999;

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseSlug,
      courseTitle,
      studentName,
      studentEmail,
      studentPhone,
      amount,
      promoCode,
    } = await req.json();

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Payment verified — save to Supabase
    const db = createServiceClient();
    await db.from('payments').insert({
      student_name: studentName,
      student_email: studentEmail,
      student_phone: studentPhone || null,
      course_slug: courseSlug,
      course_title: courseTitle,
      amount,
      currency: 'INR',
      razorpay_order_id,
      razorpay_payment_id,
      status: 'paid',
    });

    // If the student used a promo code, record the redemption. This is
    // the moment the code is "consumed" — one-per-user enforcement kicks
    // in via the UNIQUE(promo_code_id, student_email) constraint.
    if (promoCode && studentEmail) {
      const validation = await validatePromoCode(promoCode, studentEmail);
      if (validation.ok) {
        const { discountAmount } = computeDiscount(COURSE_PRICE, validation.discountPercent);
        const { error } = await db.from('promo_redemptions').insert({
          promo_code_id: validation.id,
          student_email: studentEmail.trim().toLowerCase(),
          course_slug: courseSlug,
          discount_percent: validation.discountPercent,
          discount_amount: discountAmount,
          final_amount: amount,
          razorpay_payment_id,
        });
        // We don't fail the whole request if redemption logging fails —
        // the student already paid, they should get access. Just log it.
        if (error) {
          console.error('Promo redemption logging failed post-payment:', error);
        }
      } else {
        console.error(
          'Promo re-validation failed at verify time:',
          validation.error,
          'for payment',
          razorpay_payment_id
        );
      }
    }

    return NextResponse.json({ success: true, paymentId: razorpay_payment_id });
  } catch (error) {
    console.error('Payment verify error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
