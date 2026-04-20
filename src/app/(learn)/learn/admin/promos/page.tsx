import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase-server';
import { createServiceClient } from '@/lib/supabase';
import { TRAINER_EMAILS } from '@/config/trainers';
import PromoManager from './PromoManager';

type PromoRow = {
  id: string;
  code: string;
  discount_percent: number;
  max_uses: number | null;
  expires_at: string | null;
  active: boolean;
  notes: string | null;
  created_at: string;
  uses_count: number;
};

export default async function AdminPromosPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !TRAINER_EMAILS.includes((user.email ?? '').toLowerCase())) {
    redirect('/login');
  }

  const db = createServiceClient();

  const { data: promos } = await db
    .from('promo_codes')
    .select('id, code, discount_percent, max_uses, expires_at, active, notes, created_at')
    .order('created_at', { ascending: false });

  const ids = (promos ?? []).map((p) => p.id);
  const usesById: Record<string, number> = {};
  if (ids.length > 0) {
    const { data: redemptions } = await db
      .from('promo_redemptions')
      .select('promo_code_id')
      .in('promo_code_id', ids);
    for (const r of redemptions ?? []) {
      usesById[r.promo_code_id] = (usesById[r.promo_code_id] ?? 0) + 1;
    }
  }

  const rows: PromoRow[] = (promos ?? []).map((p) => ({
    id: p.id,
    code: p.code,
    discount_percent: p.discount_percent,
    max_uses: p.max_uses,
    expires_at: p.expires_at,
    active: p.active,
    notes: p.notes,
    created_at: p.created_at,
    uses_count: usesById[p.id] ?? 0,
  }));

  return (
    <div className="min-h-screen bg-[#020617] text-gray-200">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Promo Codes</h1>
            <p className="mt-1 text-sm text-gray-400">
              Create and manage discount codes for the ₹999 online courses.
            </p>
          </div>
          <Link
            href="/learn/admin"
            className="text-sm font-medium text-emerald-300 transition-colors hover:text-emerald-200"
          >
            ← Back to admin
          </Link>
        </div>

        <PromoManager initialRows={rows} />
      </div>
    </div>
  );
}
