import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createServiceClient } from '@/lib/supabase';

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, courseSlug, courseTitle, amount } = await req.json();

    if (!name || !email || !courseSlug || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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

    // Create Razorpay order
    const order = await getRazorpay().orders.create({
      amount: amount * 100, // Razorpay expects paise
      currency: 'INR',
      receipt: `upl_${Date.now()}`,
      notes: {
        course_slug: courseSlug,
        course_title: courseTitle,
        student_name: name,
        student_email: email,
        student_phone: phone || '',
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
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
