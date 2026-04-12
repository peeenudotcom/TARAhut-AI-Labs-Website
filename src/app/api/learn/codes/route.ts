import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { createServiceClient } from '@/lib/supabase';

// Simple trainer authorization — add trainer emails here
const TRAINER_EMAILS = [
  'hello@tarahutailabs.com',
  'peeenu@gmail.com',
];

function isTrainer(email: string | undefined): boolean {
  if (!email) return false;
  return TRAINER_EMAILS.includes(email.toLowerCase());
}

function generateCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export async function GET(_req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !isTrainer(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = createServiceClient();

    // Return all active, non-expired codes (across all batches for this trainer)
    const { data: codes, error } = await db
      .from('daily_codes')
      .select('id, batch_id, session_number, code, generated_at, expires_at, status')
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .eq('generated_by', user.id)
      .order('generated_at', { ascending: false });

    if (error) {
      console.error('Fetch codes error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch codes.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ codes: codes ?? [] });
  } catch (error) {
    console.error('Codes GET error:', error);
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !isTrainer(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { batch_id, session_number } = body;

    if (!batch_id || typeof session_number !== 'number') {
      return NextResponse.json(
        { error: 'batch_id and session_number are required.' },
        { status: 400 }
      );
    }

    if (session_number < 1 || session_number > 16) {
      return NextResponse.json(
        { error: 'session_number must be between 1 and 16.' },
        { status: 400 }
      );
    }

    const db = createServiceClient();

    // Expire any existing active codes for this batch + session
    await db
      .from('daily_codes')
      .update({ status: 'expired' })
      .eq('batch_id', batch_id)
      .eq('session_number', session_number)
      .eq('status', 'active');

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const { data: newCode, error: insertError } = await db
      .from('daily_codes')
      .insert({
        batch_id,
        session_number,
        code,
        expires_at: expiresAt,
        generated_by: user.id,
        status: 'active',
      })
      .select('id, code, session_number, expires_at')
      .single();

    if (insertError) {
      console.error('Code insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to generate code.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      code: newCode,
    });
  } catch (error) {
    console.error('Codes POST error:', error);
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
