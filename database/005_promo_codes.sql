-- Promo codes for online course purchases
-- Run this in Supabase SQL Editor

-- A promo code is created by an admin/trainer. Each code has a discount
-- percentage (1–100). Optional expiry date. Optional max total uses.
-- When a student applies the code at checkout on a course detail page,
-- the discount applies to the course's price (₹999 today).
-- If the discounted amount is 0 (100% off), the course is unlocked
-- directly — no Razorpay round-trip.
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_percent INTEGER NOT NULL CHECK (discount_percent BETWEEN 1 AND 100),
  max_uses INTEGER,                       -- NULL = unlimited
  expires_at TIMESTAMPTZ,                 -- NULL = no expiry
  active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One redemption row per (promo_code, student_email). The UNIQUE
-- constraint is what enforces "one-time per user per code" — the
-- API relies on insert failing when a user tries to reuse a code.
CREATE TABLE IF NOT EXISTS promo_redemptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  promo_code_id UUID NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE,
  student_email TEXT NOT NULL,
  course_slug TEXT NOT NULL,
  discount_percent INTEGER NOT NULL,
  discount_amount INTEGER NOT NULL,       -- rupees the student saved
  final_amount INTEGER NOT NULL,          -- rupees actually charged (0 for 100% off)
  razorpay_payment_id TEXT,               -- NULL for free unlocks
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (promo_code_id, student_email)
);

CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_active ON promo_codes(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_promo_redemptions_code ON promo_redemptions(promo_code_id);
CREATE INDEX IF NOT EXISTS idx_promo_redemptions_email ON promo_redemptions(student_email);

ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_redemptions ENABLE ROW LEVEL SECURITY;

-- Only the service role (server routes) reads/writes promos — no direct
-- client access. Admins use /learn/admin/promos which goes through the
-- API with trainer gating.
DROP POLICY IF EXISTS "Service role manages promo_codes" ON promo_codes;
CREATE POLICY "Service role manages promo_codes"
  ON promo_codes FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role manages promo_redemptions" ON promo_redemptions;
CREATE POLICY "Service role manages promo_redemptions"
  ON promo_redemptions FOR ALL USING (auth.role() = 'service_role');
