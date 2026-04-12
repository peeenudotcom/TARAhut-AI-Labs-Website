'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export function CodeEntry() {
  const [digits, setDigits] = useState(['', '', '', '']);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  // Single ref holding all four input elements — avoids conditional/array hook calls
  const inputRefs = useRef<Array<HTMLInputElement | null>>([null, null, null, null]);
  const router = useRouter();

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 4) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/learn/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (res.ok && data.session) {
        setStatus('success');
        setMessage(`Session ${data.session} unlocked!`);
        setDigits(['', '', '', '']);
        setTimeout(() => {
          router.refresh();
          setStatus('idle');
          setMessage('');
          inputRefs.current[0]?.focus();
        }, 2000);
      } else {
        setStatus('error');
        setMessage(data.error ?? 'Invalid code');
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 3000);
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  }

  const isFilled = digits.every((d) => d !== '');

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-4 rounded-2xl border border-[#1e1e3a] bg-[#0c0c1a] p-6"
    >
      <p className="text-sm font-semibold uppercase tracking-widest text-[#00f0ff]">
        Enter today's unlock code
      </p>

      <div className="flex gap-3">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            autoFocus={i === 0}
            className="h-14 w-12 rounded-xl border-2 border-[#1e1e3a] bg-[#06060e] text-center text-2xl font-bold text-[#e2e8f0] caret-[#00f0ff] outline-none transition focus:border-[#00f0ff] focus:shadow-[0_0_0_3px_rgba(0,240,255,0.15)]"
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={!isFilled || status === 'loading'}
        className="w-full max-w-[220px] rounded-xl bg-[#059669] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#059669]/20 transition hover:bg-[#047857] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'loading' ? 'Checking…' : 'Unlock Session'}
      </button>

      {status === 'success' && message && (
        <p className="flex items-center gap-2 text-sm font-semibold text-[#059669]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
          {message}
        </p>
      )}
      {status === 'error' && message && (
        <p className="flex items-center gap-2 text-sm font-semibold text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
          {message}
        </p>
      )}
    </form>
  );
}
