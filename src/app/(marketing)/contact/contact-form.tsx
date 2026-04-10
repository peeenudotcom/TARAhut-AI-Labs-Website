'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { courses } from '@/config/courses';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          courseInterest: formData.get('course'),
          message: formData.get('message'),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center rounded-xl border border-[#E2E8F0] bg-white p-12 text-center"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 text-[#e53935]">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-[#0F172A]">
          Message Sent!
        </h3>
        <p className="text-[#475569]">
          Thank you for reaching out. We will get back to you within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 text-sm font-medium text-[#e53935] hover:underline"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Your name"
            required
            className="h-10 border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder:text-[#94A3B8]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="h-10 border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder:text-[#94A3B8]"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+91 99154 24411"
            className="h-10 border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder:text-[#94A3B8]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="course">Course Interest</Label>
          <select
            id="course"
            name="course"
            className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 text-sm text-[#0F172A] outline-none transition-colors focus-visible:border-[#e53935] focus-visible:ring-3 focus-visible:ring-[#e53935]/50"
          >
            <option value="">Select a course (optional)</option>
            {courses.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Tell us how we can help you..."
          className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-[#94A3B8] focus-visible:border-[#e53935] focus-visible:ring-3 focus-visible:ring-[#e53935]/50"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#e53935] to-[#DC2626] px-8 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </motion.form>
  );
}
