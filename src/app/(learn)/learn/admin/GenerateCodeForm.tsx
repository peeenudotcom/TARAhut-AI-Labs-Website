'use client';

import { useState } from 'react';

export default function GenerateCodeForm({ batchId }: { batchId: string }) {
  const [sessionNumber, setSessionNumber] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ code: string; session_number: number; expires_at: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/learn/codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batch_id: batchId, session_number: sessionNumber }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Failed to generate code.');
        return;
      }

      setResult(data.code);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleGenerate} className="flex items-end gap-4">
        <div>
          <label
            htmlFor="session-select"
            className="block text-sm text-slate-600 mb-1.5 font-medium"
          >
            Session Number
          </label>
          <select
            id="session-select"
            value={sessionNumber}
            onChange={(e) => setSessionNumber(Number(e.target.value))}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {Array.from({ length: 16 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                Session {n}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Generating...' : 'Generate Code'}
        </button>
      </form>

      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}

      {result && (
        <div className="mt-4 inline-flex items-center gap-4 bg-emerald-50 border border-emerald-200 rounded-xl px-6 py-4">
          <div>
            <p className="text-xs text-emerald-600 font-medium">Session {result.session_number} Code</p>
            <p className="font-mono text-4xl font-bold tracking-widest text-emerald-700 mt-0.5">
              {result.code}
            </p>
          </div>
          <div className="text-xs text-slate-400 self-end pb-1">
            Expires{' '}
            {new Date(result.expires_at).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      )}
    </div>
  );
}
