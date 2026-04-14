import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase-server';

export async function getSession() {
  const supabase = await createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    // DEV BYPASS — remove before production
    if (process.env.NODE_ENV === 'development') {
      return { id: 'dev-user', email: 'peeenu@gmail.com' } as any;
    }
    redirect('/login');
  }
  return user;
}
