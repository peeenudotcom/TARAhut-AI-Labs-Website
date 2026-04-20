'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

export default function PromoManager({ initialRows }: { initialRows: PromoRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);

  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('100');
  const [maxUses, setMaxUses] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          discount_percent: Number(discount),
          max_uses: maxUses.trim() ? Number(maxUses) : null,
          expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
          notes: notes.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to create promo.');
        setSubmitting(false);
        return;
      }
      setRows([data.promo, ...rows]);
      setCode('');
      setDiscount('100');
      setMaxUses('');
      setExpiresAt('');
      setNotes('');
    } catch {
      setError('Something went wrong.');
    }
    setSubmitting(false);
  }

  async function toggleActive(id: string, active: boolean) {
    const res = await fetch('/api/admin/promos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, active }),
    });
    if (res.ok) {
      setRows(rows.map((r) => (r.id === id ? { ...r, active } : r)));
      router.refresh();
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      {/* Create form */}
      <form
        onSubmit={handleCreate}
        className="h-fit rounded-xl border border-white/[0.08] bg-white/[0.03] p-5"
      >
        <h2 className="text-sm font-semibold text-white">Create a new code</h2>
        <p className="mt-1 text-xs text-gray-400">
          Valid on any of the 9 online courses (₹999 each). One use per email.
        </p>

        <div className="mt-5 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-400">Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              placeholder="e.g. LAUNCH100"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm uppercase tracking-wider text-white placeholder:text-gray-500 focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/10"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400">Discount %</label>
            <input
              type="number"
              min={1}
              max={100}
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/10"
            />
            <p className="mt-1 text-[11px] text-gray-500">100 = fully free unlock (skips Razorpay)</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400">Max uses (optional)</label>
            <input
              type="number"
              min={1}
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              placeholder="Leave empty for unlimited"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/10"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400">Expires at (optional)</label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/10"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Diwali campaign"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/10"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-60"
          >
            {submitting ? 'Creating…' : 'Create code'}
          </button>
        </div>
      </form>

      {/* List */}
      <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <h2 className="text-sm font-semibold text-white">All codes</h2>
          <span className="text-xs text-gray-500">{rows.length} total</span>
        </div>

        {rows.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            No codes yet. Create one on the left.
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {rows.map((row) => {
              const expired = row.expires_at ? new Date(row.expires_at) < new Date() : false;
              const exhausted = row.max_uses != null && row.uses_count >= row.max_uses;
              const status = !row.active
                ? { label: 'Inactive', color: 'text-gray-500' }
                : expired
                ? { label: 'Expired', color: 'text-amber-300' }
                : exhausted
                ? { label: 'Exhausted', color: 'text-amber-300' }
                : { label: 'Active', color: 'text-emerald-300' };

              return (
                <div key={row.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold uppercase tracking-wider text-white">
                        {row.code}
                      </span>
                      <span className={`text-xs font-medium ${status.color}`}>· {status.label}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {row.discount_percent}% off ·{' '}
                      {row.uses_count}
                      {row.max_uses != null ? `/${row.max_uses}` : ''} used
                      {row.expires_at && ` · expires ${new Date(row.expires_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}`}
                    </p>
                    {row.notes && (
                      <p className="mt-0.5 text-xs text-gray-500">{row.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleActive(row.id, !row.active)}
                    className="shrink-0 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-white/[0.05] hover:text-white"
                  >
                    {row.active ? 'Deactivate' : 'Reactivate'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
