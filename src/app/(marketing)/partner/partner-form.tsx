'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman & Nicobar Islands', 'Chandigarh', 'Dadra & Nagar Haveli and Daman & Diu',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

const investmentRanges = [
  'Below ₹5 Lakhs',
  '₹5 – ₹10 Lakhs',
  '₹10 – ₹20 Lakhs',
  '₹20 – ₹50 Lakhs',
  'Above ₹50 Lakhs',
];

export function PartnerForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', investment: '', floorArea: '',
    state: '', city: '', comments: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Send enquiry via WhatsApp to admin
    const msg = encodeURIComponent(
      `*New Partner Enquiry – TARAhut AI Labs*\n\n` +
      `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n` +
      `Investment: ${form.investment}\nFloor Area: ${form.floorArea || 'N/A'} sq ft\n` +
      `Location: ${form.city}, ${form.state}\nComments: ${form.comments || 'None'}`
    );
    window.open(`https://wa.me/919200882008?text=${msg}`, '_blank');
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center rounded-xl border border-[#E2E8F0] bg-white p-12 text-center"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-[#059669]">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-[#0F172A]">Enquiry Submitted!</h3>
        <p className="text-[#475569]">
          Thank you for your interest in becoming an TARAhut AI Labs partner. Our team will contact you within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 text-sm font-medium text-[#059669] hover:underline"
        >
          Submit another enquiry
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
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name" name="name" required placeholder="Your full name"
            value={form.name} onChange={handleChange}
            className="h-10 border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder:text-[#94A3B8]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Mobile Number *</Label>
          <Input
            id="phone" name="phone" type="tel" required placeholder="+91 99154 24411"
            value={form.phone} onChange={handleChange}
            className="h-10 border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder:text-[#94A3B8]"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email ID *</Label>
          <Input
            id="email" name="email" type="email" required placeholder="you@example.com"
            value={form.email} onChange={handleChange}
            className="h-10 border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder:text-[#94A3B8]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="investment">Investment Capacity *</Label>
          <select
            id="investment" name="investment" required
            value={form.investment} onChange={handleChange}
            className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 text-sm text-[#0F172A] outline-none transition-colors focus-visible:border-[#059669] focus-visible:ring-3 focus-visible:ring-[#059669]/50"
          >
            <option value="">How much can you invest?</option>
            {investmentRanges.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="floorArea">Floor Area (sq ft)</Label>
          <Input
            id="floorArea" name="floorArea" type="number" placeholder="e.g. 500"
            value={form.floorArea} onChange={handleChange}
            className="h-10 border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder:text-[#94A3B8]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <select
            id="state" name="state" required
            value={form.state} onChange={handleChange}
            className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 text-sm text-[#0F172A] outline-none transition-colors focus-visible:border-[#059669] focus-visible:ring-3 focus-visible:ring-[#059669]/50"
          >
            <option value="">Select State</option>
            {indianStates.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">City *</Label>
        <Input
          id="city" name="city" required placeholder="Your city"
          value={form.city} onChange={handleChange}
          className="h-10 border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder:text-[#94A3B8]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments">Comments (optional)</Label>
        <textarea
          id="comments" name="comments" rows={4}
          placeholder="Tell us about your background, experience, or any questions..."
          value={form.comments} onChange={handleChange}
          className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-[#94A3B8] focus-visible:border-[#059669] focus-visible:ring-3 focus-visible:ring-[#059669]/50"
        />
      </div>

      <button
        type="submit"
        className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#059669] to-[#0D9488] px-8 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Submit Enquiry
      </button>

      <p className="text-center text-xs text-[#94A3B8]">
        By submitting, you agree to be contacted by our partnership team.
      </p>
    </motion.form>
  );
}
