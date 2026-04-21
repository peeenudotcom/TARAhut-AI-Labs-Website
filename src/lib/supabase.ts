import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

// All clients read env lazily. A top-level createClient() call crashes at
// module eval when NEXT_PUBLIC_SUPABASE_URL is missing (e.g. preview builds
// without the var set), which breaks page data collection for any page that
// transitively imports this module. Deferring the reads fixes that.

let _legacyClient: SupabaseClient | null = null;

// Legacy public-read client. Used by marketing pages that read public data
// without any auth context. Prefer createBrowserSupabase / createServerSupabase
// in new code.
export function getSupabase(): SupabaseClient {
  if (!_legacyClient) {
    _legacyClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _legacyClient;
}

// Service role client for admin operations (bypasses RLS).
// ONLY use in API routes / server-side code. Never import in client components.
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Browser client for client components (auth-aware, uses cookies).
export function createBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  read_time: string;
  source_url: string | null;
  source_title: string | null;
  published: boolean;
  created_at: string;
};
