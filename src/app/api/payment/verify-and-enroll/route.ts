import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServiceClient } from '@/lib/supabase';
import { courseConfigs } from '@/config/learn-modules';
import { grantCourseAccess } from '@/lib/course-access';
import { hasPriorPurchase } from '@/lib/pricing-quote';
import { getCoursePricing, RETURN_CUSTOMER_PRICE } from '@/config/pricing';
import { validatePromoCode, computeDiscount } from '@/lib/promo';

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      studentName,
      studentEmail,
      studentPhone,
      courseId,
      courseSlug,
      courseTitle,
      amount,
      promoCode,
    } = await req.json();

    // Accept either courseId or courseSlug for backward compat with the two
    // call sites that exist in the codebase.
    const slug: string | undefined = courseId ?? courseSlug;
    if (!slug) {
      return NextResponse.json({ error: 'courseId or courseSlug is required' }, { status: 400 });
    }

    // Verify Razorpay signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    const db = createServiceClient();
    const normalizedEmail = (studentEmail as string).trim().toLowerCase();

    const course = slug ? courseConfigs[slug] : null;
    if (!course) {
      return NextResponse.json({ error: 'Invalid course' }, { status: 400 });
    }

    // Return-customer determination is based on whether the student had any
    // prior active purchase *before* this one landed. Don't infer from the
    // amount charged — a promo code could produce the same number.
    const isReturnCustomer = await hasPriorPurchase(normalizedEmail);

    // 1. Record the purchase
    await db.from('online_purchases').insert({
      student_email: normalizedEmail,
      student_name: studentName,
      student_phone: studentPhone || null,
      amount,
      razorpay_payment_id,
      razorpay_order_id,
      access_type: isReturnCustomer ? 'return_customer' : 'single_course',
      status: 'active',
    });

    // 2. Mirror to the legacy payments table
    await db.from('payments').insert({
      student_name: studentName,
      student_email: normalizedEmail,
      student_phone: studentPhone || null,
      course_slug: slug,
      course_title: courseTitle || course.title,
      amount,
      currency: 'INR',
      razorpay_order_id,
      razorpay_payment_id,
      status: 'paid',
    });

    // 3. Record promo redemption if a code was used on this payment.
    //    Intentionally non-fatal — if we can't log the redemption the
    //    student still paid and still gets access. `basePrice` is the
    //    pre-discount price the student would have paid: 799 if they
    //    already had an active purchase when this payment was created,
    //    else the course's onlinePrice.
    if (promoCode && normalizedEmail) {
      const validation = await validatePromoCode(promoCode, normalizedEmail);
      if (validation.ok) {
        const basePrice = isReturnCustomer
          ? RETURN_CUSTOMER_PRICE
          : getCoursePricing(slug).price;
        const { discountAmount } = computeDiscount(basePrice, validation.discountPercent);
        const { error: redemptionError } = await db.from('promo_redemptions').insert({
          promo_code_id: validation.id,
          student_email: normalizedEmail,
          course_slug: slug,
          discount_percent: validation.discountPercent,
          discount_amount: discountAmount,
          final_amount: amount,
          razorpay_payment_id,
        });
        if (redemptionError) {
          console.error('Promo redemption logging failed post-payment:', redemptionError);
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

    // 4. Invite/find the auth user + enroll + unlock session 1
    const grant = await grantCourseAccess({
      email: normalizedEmail,
      name: studentName,
      phone: studentPhone || null,
      courseSlug: slug,
      razorpayPaymentId: razorpay_payment_id,
    });

    return NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id,
      userInvited: grant.invited,
      message: grant.userId
        ? grant.invited
          ? `Payment successful! We've emailed a sign-in link to set your password for ${course.title}.`
          : `Payment successful! Log in with your existing account to access ${course.title}.`
        : `Payment successful! We will send you access to ${course.title} shortly.`,
    });
  } catch (error) {
    console.error('Payment verify-and-enroll error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
