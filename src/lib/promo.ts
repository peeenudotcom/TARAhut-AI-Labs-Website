import { createServiceClient } from '@/lib/supabase';

export type PromoError =
  | 'invalid_code'
  | 'inactive'
  | 'expired'
  | 'exhausted'
  | 'already_used';

export type PromoValidation =
  | { ok: true; id: string; discountPercent: number }
  | { ok: false; error: PromoError };

/**
 * Look up a promo code and validate it against expiry, active flag, max uses,
 * and whether this email has already redeemed it. Returns server-authoritative
 * discount percent — never trust client-sent values.
 */
export async function validatePromoCode(
  code: string,
  email: string
): Promise<PromoValidation> {
  const db = createServiceClient();

  const { data: promo } = await db
    .from('promo_codes')
    .select('id, discount_percent, max_uses, expires_at, active')
    .eq('code', code.trim().toUpperCase())
    .maybeSingle();

  if (!promo) return { ok: false, error: 'invalid_code' };
  if (!promo.active) return { ok: false, error: 'inactive' };
  if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
    return { ok: false, error: 'expired' };
  }

  if (promo.max_uses != null) {
    const { count } = await db
      .from('promo_redemptions')
      .select('id', { count: 'exact', head: true })
      .eq('promo_code_id', promo.id);
    if ((count ?? 0) >= promo.max_uses) return { ok: false, error: 'exhausted' };
  }

  const { count: userUsageCount } = await db
    .from('promo_redemptions')
    .select('id', { count: 'exact', head: true })
    .eq('promo_code_id', promo.id)
    .eq('student_email', email.trim().toLowerCase());
  if ((userUsageCount ?? 0) > 0) return { ok: false, error: 'already_used' };

  return { ok: true, id: promo.id, discountPercent: promo.discount_percent };
}

export function errorMessage(error: PromoError): string {
  switch (error) {
    case 'invalid_code':
      return 'Invalid promo code.';
    case 'inactive':
      return 'This promo code is no longer active.';
    case 'expired':
      return 'This promo code has expired.';
    case 'exhausted':
      return 'This promo code has reached its usage limit.';
    case 'already_used':
      return 'You have already used this promo code.';
  }
}

export function computeDiscount(
  originalAmount: number,
  discountPercent: number
): { discountAmount: number; finalAmount: number } {
  const discountAmount = Math.floor((originalAmount * discountPercent) / 100);
  const finalAmount = Math.max(0, originalAmount - discountAmount);
  return { discountAmount, finalAmount };
}
