import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';
import { quoteCoursePrice } from '@/lib/pricing-quote';
import { grantCourseAccess } from '@/lib/course-access';

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

    // For a 100%-off code we're about to create a real account and
    // enrollment for this person — name is mandatory so it ends up on
    // their certificate. Partial-discount flows also need a name to
    // prefill Razorpay, so require it up-front.
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'Please enter your full name above before applying a promo code.' },
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

    const quote = await quoteCoursePrice({ courseSlug, email, promoCode: code });

    if (quote.promoError) {
      return NextResponse.json(
        { error: quote.promoErrorMessage ?? 'Invalid promo code.', code: quote.promoError },
        { status: 400 }
      );
    }

    // Partial discount: don't redeem yet — let the client kick off Razorpay.
    // The /api/payment/create-order route will re-validate and atomically
    // record the redemption after payment succeeds.
    if (quote.finalAmount > 0) {
      return NextResponse.json({
        freeUnlock: false,
        discountPercent: quote.discountPercent,
        originalAmount: quote.basePrice,
        discountAmount: quote.discountAmount,
        finalAmount: quote.finalAmount,
        isReturnCustomer: quote.isReturnCustomer,
      });
    }

    // 100% off — redeem immediately. Record the redemption first; the
    // UNIQUE(promo_code_id, student_email) constraint is the source of
    // truth for one-per-user enforcement. If two requests race, one wins.
    if (!quote.promo) {
      return NextResponse.json(
        { error: 'Unable to apply this code. Please try again or contact us.' },
        { status: 400 }
      );
    }

    const db = createServiceClient();
    const normalizedEmail = email.trim().toLowerCase();
    const promoRef = `PROMO_${code.trim().toUpperCase()}`;

    const { error: redemptionError } = await db
      .from('promo_redemptions')
      .insert({
        promo_code_id: quote.promo.id,
        student_email: normalizedEmail,
        course_slug: courseSlug,
        discount_percent: quote.discountPercent,
        discount_amount: quote.discountAmount,
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
      student_email: normalizedEmail,
      student_name: name.trim(),
      student_phone: phone || null,
      amount: 0,
      razorpay_payment_id: promoRef,
      razorpay_order_id: null,
      access_type: 'single_course',
      status: 'active',
    });

    await db.from('payments').insert({
      student_name: name.trim(),
      student_email: normalizedEmail,
      student_phone: phone || null,
      course_slug: courseSlug,
      course_title: courseTitle ?? courseSlug,
      amount: 0,
      currency: 'INR',
      razorpay_order_id: null,
      razorpay_payment_id: promoRef,
      status: 'paid',
    });

    // Grant real access: create/find the auth user, enroll, unlock Session 1.
    // This is what turns "purchase row" into "student can log in and see
    // the course".
    const grant = await grantCourseAccess({
      email: normalizedEmail,
      name: name.trim(),
      phone: phone || null,
      courseSlug,
      razorpayPaymentId: promoRef,
      unlockCodeUsed: promoRef,
    });

    return NextResponse.json({
      freeUnlock: true,
      discountPercent: quote.discountPercent,
      finalAmount: 0,
      userInvited: grant.invited,
      message: grant.invited
        ? "Course unlocked! We've emailed a sign-in link to set your password."
        : 'Course unlocked! Log in with your existing account to access it.',
    });
  } catch (error) {
    console.error('Promo apply error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
