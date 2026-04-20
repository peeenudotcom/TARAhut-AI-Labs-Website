import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { EmailOtpType } from '@supabase/supabase-js';

const VALID_OTP_TYPES: EmailOtpType[] = [
  'signup',
  'invite',
  'magiclink',
  'recovery',
  'email_change',
  'email',
];

/**
 * Auth callback handles three kinds of email links:
 *
 *  1. token_hash + type  — preferred. Works across any browser because the
 *     token itself carries verification context. Used by invites, recovery,
 *     and newer magic-link emails.
 *  2. code                — PKCE flow. Requires the code_verifier to still
 *     be in this browser's storage, so fails if the email is opened in a
 *     different browser than the one that initiated sign-in.
 *  3. neither             — invalid, bounce back to /login.
 *
 * If token_hash is present we use it. Falls back to code. This fixes the
 * classic "exchange_failed / PKCE code verifier not found" error.
 */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/learn/dashboard';

  if (!code && !tokenHash) {
    console.error('[auth/callback] No code or token_hash in query params');
    return NextResponse.redirect(new URL('/login?error=no_code', origin));
  }

  // Build the redirect response up-front so we can attach session cookies to it.
  const response = NextResponse.redirect(new URL(next, origin));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 1. Token hash flow — cross-browser safe
  if (tokenHash && type && VALID_OTP_TYPES.includes(type)) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (error) {
      console.error('[auth/callback] verifyOtp failed:', error.message);
      const errorUrl = new URL('/login', origin);
      errorUrl.searchParams.set('error', 'exchange_failed');
      errorUrl.searchParams.set('reason', error.message);
      return NextResponse.redirect(errorUrl);
    }

    return response;
  }

  // 2. PKCE code flow — same-browser only
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[auth/callback] exchangeCodeForSession failed:', error.message);
      const errorUrl = new URL('/login', origin);
      errorUrl.searchParams.set('error', 'exchange_failed');
      errorUrl.searchParams.set('reason', error.message);
      return NextResponse.redirect(errorUrl);
    }

    return response;
  }

  return NextResponse.redirect(new URL('/login?error=no_code', origin));
}
