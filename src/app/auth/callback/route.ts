import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/learn/dashboard';

  if (!code) {
    console.error('[auth/callback] No code in query params');
    return NextResponse.redirect(new URL('/login?error=no_code', origin));
  }

  // Create the redirect response FIRST so cookies get attached to it
  const response = NextResponse.redirect(new URL(next, origin));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // Read from the request
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write to both the mutable cookie store AND the response object
          // This ensures cookies survive the redirect
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('[auth/callback] Exchange failed:', error.message, error);
    // Include error detail in redirect for debugging
    const errorUrl = new URL('/login', origin);
    errorUrl.searchParams.set('error', 'exchange_failed');
    errorUrl.searchParams.set('reason', error.message);
    return NextResponse.redirect(errorUrl);
  }

  // Session successfully exchanged — cookies are on `response`, redirect to next
  return response;
}
