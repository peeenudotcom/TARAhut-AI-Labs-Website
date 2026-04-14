import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { createServerSupabase } from '@/lib/supabase-server';

// DEV ONLY — bypass magic link for testing
export async function GET(request: Request) {
  const admin = createServiceClient();

  // Generate a magic link (doesn't send email)
  const { data, error } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: 'peeenu@gmail.com',
  });

  if (error || !data?.properties?.action_link) {
    return NextResponse.json({ error: error?.message || 'No link generated' }, { status: 500 });
  }

  // Extract the token from the link
  const url = new URL(data.properties.action_link);
  const token_hash = url.searchParams.get('token') || url.hash?.replace('#', '');

  // Verify OTP to create a session
  const supabase = await createServerSupabase();
  const { data: session, error: verifyError } = await supabase.auth.verifyOtp({
    token_hash: data.properties.hashed_token,
    type: 'magiclink',
  });

  if (verifyError) {
    return NextResponse.json({
      error: verifyError.message,
      link: data.properties.action_link,
      hint: 'Try opening this link directly in your browser'
    }, { status: 500 });
  }

  // Redirect to dashboard
  return NextResponse.redirect(new URL('/learn/dashboard', request.url));
}
