-- Learn Artifacts — student-generated AI outputs from in-lesson playgrounds.
-- One row per (student, prompt) submission. Used to:
--   1. Show "Your first AI conversation" card on the dashboard.
--   2. Cap each student to N generations per session per day (cost guard).
--
-- Run this in your Supabase SQL editor.

CREATE TABLE IF NOT EXISTS learn_artifacts (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id       TEXT NOT NULL DEFAULT 'ai-tools-mastery-beginners',
  session_number  INTEGER NOT NULL CHECK (session_number BETWEEN 1 AND 16),
  prompt          TEXT NOT NULL,
  response        TEXT NOT NULL,
  model           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS learn_artifacts_student_session_created_idx
  ON learn_artifacts (student_id, session_number, created_at DESC);

ALTER TABLE learn_artifacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "students read own artifacts" ON learn_artifacts;
CREATE POLICY "students read own artifacts"
  ON learn_artifacts FOR SELECT
  USING (student_id = auth.uid());

DROP POLICY IF EXISTS "students insert own artifacts" ON learn_artifacts;
CREATE POLICY "students insert own artifacts"
  ON learn_artifacts FOR INSERT
  WITH CHECK (student_id = auth.uid());
