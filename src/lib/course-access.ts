import { createServiceClient } from '@/lib/supabase';
import { courseConfigs } from '@/config/learn-modules';

export type GrantResult = {
  userId: string | null;
  invited: boolean;
  error?: string;
};

/**
 * Make a student a real, logged-in-able user for the given course:
 * 1. Invite (or find) the Supabase auth user by email
 * 2. Enroll them in the course
 * 3. Unlock session 1 so they can start
 * 4. Backfill user_id on the online_purchases row
 *
 * Safe to call multiple times — all writes use upsert / conflict
 * handling. Returns null userId if the invite fails; purchase is
 * already recorded either way.
 */
export async function grantCourseAccess(params: {
  email: string;
  name: string;
  phone?: string | null;
  courseSlug: string;
  razorpayPaymentId?: string | null;
  unlockCodeUsed?: string;
}): Promise<GrantResult> {
  const { email, name, phone, courseSlug, razorpayPaymentId, unlockCodeUsed } = params;
  const db = createServiceClient();
  const normalizedEmail = email.trim().toLowerCase();

  const course = courseConfigs[courseSlug];
  if (!course) {
    return { userId: null, invited: false, error: `Unknown course slug: ${courseSlug}` };
  }

  // 1. Find or invite the auth user. We look first by an existing
  //    purchase that has a user_id attached (fast path), then fall
  //    back to inviteUserByEmail — which both creates the auth row
  //    AND sends a magic-link confirmation mail. If invite fails
  //    because the user already exists, we list+find them.
  const { data: prior } = await db
    .from('online_purchases')
    .select('user_id')
    .eq('student_email', normalizedEmail)
    .not('user_id', 'is', null)
    .limit(1);

  let userId: string | null = prior?.[0]?.user_id ?? null;
  let invited = false;

  if (!userId) {
    const { data: inviteData, error: inviteError } = await db.auth.admin.inviteUserByEmail(
      normalizedEmail,
      { data: { full_name: name, phone: phone || null } }
    );

    if (inviteError) {
      // Most common failure: user already exists. Look them up.
      const { data } = await db.auth.admin.listUsers();
      const existing = data?.users?.find((u) => u.email?.toLowerCase() === normalizedEmail);
      if (existing) {
        userId = existing.id;
      } else {
        console.error('grantCourseAccess: invite failed and user not found', inviteError);
        return { userId: null, invited: false, error: 'Could not create or locate auth user.' };
      }
    } else {
      userId = inviteData?.user?.id ?? null;
      invited = true;
    }
  }

  if (!userId) {
    return { userId: null, invited: false, error: 'No user id after invite attempt.' };
  }

  // 2. Link user_id onto the online_purchases row for this payment
  if (razorpayPaymentId) {
    await db
      .from('online_purchases')
      .update({ user_id: userId })
      .eq('razorpay_payment_id', razorpayPaymentId);
  }

  // 3. Enroll. Upsert against (student_id, course_id) so retries are idempotent.
  await db.from('learn_enrollments').upsert(
    {
      student_id: userId,
      course_id: course.id,
      enrolled_at: new Date().toISOString(),
    },
    { onConflict: 'student_id,course_id' }
  );

  // 4. Unlock session 1
  await db.from('session_unlocks').upsert(
    {
      student_id: userId,
      course_id: course.id,
      session_number: 1,
      unlocked_at: new Date().toISOString(),
      unlock_code_used: unlockCodeUsed ?? 'ONLINE_PURCHASE',
    },
    { onConflict: 'student_id,course_id,session_number' }
  );

  return { userId, invited };
}
