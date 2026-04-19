import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServiceClient } from '@/lib/supabase';
import { courseConfigs } from '@/config/learn-modules';

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      studentName,
      studentEmail,
      studentPhone,
      amount,
    } = await req.json();

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
    const isReturnCustomer = amount === 799;

    // 1. Save online purchase
    await db.from('online_purchases').insert({
      student_email: studentEmail,
      student_name: studentName,
      student_phone: studentPhone || null,
      amount,
      razorpay_payment_id,
      razorpay_order_id,
      access_type: isReturnCustomer ? 'return_customer' : 'all_access',
      status: 'active',
    });

    // 2. Also save to payments table for backward compat
    await db.from('payments').insert({
      student_name: studentName,
      student_email: studentEmail,
      student_phone: studentPhone || null,
      course_slug: 'all-access',
      course_title: isReturnCustomer ? 'All Access (Return Customer)' : 'All Access Pass',
      amount,
      currency: 'INR',
      razorpay_order_id,
      razorpay_payment_id,
      status: 'paid',
    });

    // 3. Create Supabase auth user (or find existing) via magic link
    //    We'll send them a magic link to set up their account
    const { data: existingUsers } = await db
      .from('online_purchases')
      .select('user_id')
      .eq('student_email', studentEmail)
      .not('user_id', 'is', null)
      .limit(1);

    let userId = existingUsers?.[0]?.user_id;

    if (!userId) {
      // Invite the user — this creates an auth.users entry and sends a magic link
      const { data: inviteData, error: inviteError } = await db.auth.admin.inviteUserByEmail(
        studentEmail,
        { data: { name: studentName, phone: studentPhone } }
      );

      if (inviteError) {
        // User might already exist — try to find them
        const { data: { users } } = await db.auth.admin.listUsers();
        const existing = users?.find(u => u.email === studentEmail);
        if (existing) {
          userId = existing.id;
        } else {
          console.error('Failed to create user:', inviteError);
          // Continue anyway — purchase is saved, we can manually link later
        }
      } else {
        userId = inviteData?.user?.id;
      }

      // Link user_id back to purchase
      if (userId) {
        await db.from('online_purchases')
          .update({ user_id: userId })
          .eq('razorpay_payment_id', razorpay_payment_id);
      }
    }

    // 4. Enroll in ALL courses + unlock session 1 of each
    if (userId) {
      const allCourses = Object.values(courseConfigs);

      for (const course of allCourses) {
        // Enroll (upsert to avoid duplicates)
        await db.from('learn_enrollments').upsert(
          {
            student_id: userId,
            course_id: course.id,
            enrolled_at: new Date().toISOString(),
          },
          { onConflict: 'student_id,course_id' }
        );

        // Unlock session 1
        await db.from('session_unlocks').upsert(
          {
            student_id: userId,
            course_id: course.id,
            session_number: 1,
            unlocked_at: new Date().toISOString(),
            unlock_code_used: 'ONLINE_PURCHASE',
          },
          { onConflict: 'student_id,course_id,session_number' }
        );
      }
    }

    return NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id,
      message: userId
        ? 'Payment successful! Check your email for login access.'
        : 'Payment successful! We will send you access details shortly.',
    });
  } catch (error) {
    console.error('Payment verify-and-enroll error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
