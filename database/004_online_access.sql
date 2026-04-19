-- Online all-access purchases
-- Run this in Supabase SQL Editor

-- Track online purchases (₹999 all-access or ₹799 return customer)
CREATE TABLE IF NOT EXISTS online_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_email TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_phone TEXT,
  user_id UUID REFERENCES auth.users(id),
  amount INTEGER NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  access_type TEXT DEFAULT 'single_course' CHECK (access_type IN ('single_course', 'return_customer')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Track session completions (student finished viewing + quiz)
CREATE TABLE IF NOT EXISTS session_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES auth.users(id),
  course_id TEXT NOT NULL,
  session_number INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  quiz_score INTEGER,
  UNIQUE(student_id, course_id, session_number)
);

-- Track course certificates
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES auth.users(id),
  student_name TEXT NOT NULL,
  course_id TEXT NOT NULL,
  course_title TEXT NOT NULL,
  certificate_number TEXT NOT NULL UNIQUE,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- RLS
ALTER TABLE online_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages purchases"
  ON online_purchases FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Students read own purchases"
  ON online_purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Students read own completions"
  ON session_completions FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Service role manages completions"
  ON session_completions FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Students read own certificates"
  ON certificates FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Service role manages certificates"
  ON certificates FOR ALL USING (auth.role() = 'service_role');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_online_purchases_email ON online_purchases(student_email);
CREATE INDEX IF NOT EXISTS idx_session_completions_student ON session_completions(student_id, course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_student ON certificates(student_id);

-- Remove the session_number constraint from session_unlocks (some courses have >16 sessions)
ALTER TABLE session_unlocks DROP CONSTRAINT IF EXISTS session_unlocks_session_number_check;
ALTER TABLE session_unlocks ADD CONSTRAINT session_unlocks_session_number_check CHECK (session_number BETWEEN 1 AND 100);
