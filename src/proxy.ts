import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Map of landing-page subdomains → internal /lp/[slug] paths.
// Adding a new subdomain here is half the work — you also need to add the
// domain in Vercel project settings and a CNAME record in GoDaddy DNS.
const SUBDOMAIN_MAP: Record<string, string> = {
  'claude': '/lp/master-claude-15-days',
  'builder': '/lp/master-ai-builder',
  'hustler': '/lp/ai-hustler-45',
  'power': '/lp/ai-power-8-week-program',
  'tools': '/lp/ai-tools-mastery-beginners',
  'prompts': '/lp/generative-ai-prompt-engineering',
  'kids': '/lp/ai-explorer-school-kids-junior',
  'teens': '/lp/ai-explorer-school-kids-senior',
  'marketing': '/lp/ai-digital-marketing',
};

const ROOT_DOMAINS = new Set([
  'tarahutailabs.com',
  'www.tarahutailabs.com',
  'tarahut-ai-labs-website.vercel.app',
  'localhost',
  'localhost:3000',
]);

export async function proxy(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const url = request.nextUrl;

  // Block direct access to learning module HTML files
  // Only allow iframe access (from the session viewer page)
  if (url.pathname.startsWith('/learn/session-') && url.pathname.endsWith('.html')) {
    const fetchDest = request.headers.get('sec-fetch-dest');
    if (fetchDest !== 'iframe') {
      return NextResponse.redirect(new URL('/learn', request.url));
    }
  }

  // Supabase magic link fix: Supabase sometimes redirects auth codes to the
  // root path (/?code=...) instead of /auth/callback?code=... depending on
  // email template settings. Catch it and forward to the callback route
  // so the session exchange actually happens.
  if (url.pathname === '/' && url.searchParams.has('code')) {
    const callbackUrl = url.clone();
    callbackUrl.pathname = '/auth/callback';
    return NextResponse.redirect(callbackUrl);
  }

  // Subdomain rewrite: claude.tarahutailabs.com/ → /lp/master-claude-15-days
  if (!ROOT_DOMAINS.has(host)) {
    const subdomain = host.split('.')[0];
    const target = SUBDOMAIN_MAP[subdomain];
    if (target && url.pathname === '/') {
      const rewriteUrl = url.clone();
      rewriteUrl.pathname = target;
      return NextResponse.rewrite(rewriteUrl);
    }
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  // Auth logic runs on dashboard, admin, and login routes
  const needsAuth =
    url.pathname.startsWith('/dashboard') ||
    url.pathname.startsWith('/admin') ||
    url.pathname === '/login';

  if (!needsAuth) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh the auth token on every request
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect /dashboard and /admin routes — redirect to login if not authenticated
  if ((url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/admin')) && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', url.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from login page
  if (url.pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  // Match everything except static assets — we need to inspect host on all requests
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|api/|.*\\.).*)',
  ],
};
