import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { createServiceClient } from '@/lib/supabase';
import { TRAINER_EMAILS } from '@/config/trainers';

function isTrainer(email: string | undefined): boolean {
  if (!email) return false;
  return TRAINER_EMAILS.includes(email.toLowerCase());
}

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isTrainer(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = createServiceClient();

  const { data: promos, error } = await db
    .from('promo_codes')
    .select('id, code, discount_percent, max_uses, expires_at, active, notes, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Promos GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch promos.' }, { status: 500 });
  }

  // For each code, compute uses_count from redemptions
  const ids = (promos ?? []).map((p) => p.id);
  const usesById: Record<string, number> = {};
  if (ids.length > 0) {
    const { data: redemptions } = await db
      .from('promo_redemptions')
      .select('promo_code_id')
      .in('promo_code_id', ids);
    for (const r of redemptions ?? []) {
      usesById[r.promo_code_id] = (usesById[r.promo_code_id] ?? 0) + 1;
    }
  }

  const enriched = (promos ?? []).map((p) => ({
    ...p,
    uses_count: usesById[p.id] ?? 0,
  }));

  return NextResponse.json({ promos: enriched });
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isTrainer(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { code, discount_percent, max_uses, expires_at, notes } = body;

  if (typeof code !== 'string' || !code.trim()) {
    return NextResponse.json({ error: 'Code is required.' }, { status: 400 });
  }
  const percent = Number(discount_percent);
  if (!Number.isInteger(percent) || percent < 1 || percent > 100) {
    return NextResponse.json(
      { error: 'discount_percent must be an integer between 1 and 100.' },
      { status: 400 }
    );
  }

  const normalizedCode = code.trim().toUpperCase();
  const maxUsesValue = max_uses == null || max_uses === '' ? null : Number(max_uses);
  if (maxUsesValue != null && (!Number.isInteger(maxUsesValue) || maxUsesValue < 1)) {
    return NextResponse.json(
      { error: 'max_uses must be a positive integer or empty.' },
      { status: 400 }
    );
  }

  const expiresAtValue = expires_at ? new Date(expires_at).toISOString() : null;

  const db = createServiceClient();
  const { data, error } = await db
    .from('promo_codes')
    .insert({
      code: normalizedCode,
      discount_percent: percent,
      max_uses: maxUsesValue,
      expires_at: expiresAtValue,
      active: true,
      notes: notes ?? null,
      created_by: user.id,
    })
    .select('id, code, discount_percent, max_uses, expires_at, active, notes, created_at')
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: `Promo code "${normalizedCode}" already exists.` },
        { status: 400 }
      );
    }
    console.error('Promo insert error:', error);
    return NextResponse.json({ error: 'Failed to create promo.' }, { status: 500 });
  }

  return NextResponse.json({ promo: { ...data, uses_count: 0 } });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isTrainer(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, active } = await req.json();
  if (typeof id !== 'string' || typeof active !== 'boolean') {
    return NextResponse.json(
      { error: 'id and active (boolean) are required.' },
      { status: 400 }
    );
  }

  const db = createServiceClient();
  const { error } = await db.from('promo_codes').update({ active }).eq('id', id);
  if (error) {
    console.error('Promo update error:', error);
    return NextResponse.json({ error: 'Failed to update promo.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
