'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface BuyCtaProps {
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  totalSessions: number;
}

export function BuyCtaBar({ courseId, courseTitle, courseSlug, totalSessions }: BuyCtaProps) {
  return (
    <div className="shrink-0 border-t border-[#059669]/30 bg-gradient-to-r from-[#059669]/10 via-[#0c0c1a] to-[#059669]/10 px-4 py-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <span className="text-xl hidden sm:block">🎯</span>
          <div>
            <p className="text-sm font-bold text-white">
              Loved this free session? Get all {totalSessions} sessions for just <span className="text-[#fbbf24]">₹999</span>
            </p>
            <p className="text-xs text-[#94a3b8]">
              Complete sessions one by one. Earn your certificate.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/learn/course/${courseSlug}`}
            className="rounded-lg bg-[#059669] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#059669]/25 transition hover:bg-[#047857] hover:scale-[1.02] active:scale-95 whitespace-nowrap"
          >
            Buy Course — ₹999
          </Link>
          <a
            href={`https://wa.me/919200882008?text=Hi%2C+I+tried+the+free+session+of+${encodeURIComponent(courseTitle)}+and+want+to+enroll`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-[#25D366]/40 px-4 py-2.5 text-sm font-semibold text-[#25D366] transition hover:bg-[#25D366]/10 whitespace-nowrap"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export function BuyPopup({ courseId, courseTitle, courseSlug, totalSessions }: BuyCtaProps) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
    const key = `buy-popup-${courseId}`;
    if (sessionStorage.getItem(key)) {
      setDismissed(true);
      return;
    }

    // Show popup after 90 seconds of viewing
    const timer = setTimeout(() => {
      setShow(true);
    }, 90000);

    // Also show on scroll to bottom of iframe area
    const handleScroll = () => {
      if (window.scrollY > 500 && !show) {
        setShow(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [courseId, show]);

  function dismiss() {
    setShow(false);
    setDismissed(true);
    sessionStorage.setItem(`buy-popup-${courseId}`, '1');
  }

  if (!show || dismissed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md rounded-2xl border border-[#1e1e3a] bg-[#0c0c1a] p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-[#94a3b8] hover:text-white transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <span className="text-4xl mb-4 block">🚀</span>
          <h3 className="text-xl font-bold text-white mb-2">
            You&apos;re learning fast!
          </h3>
          <p className="text-sm text-[#94a3b8] mb-2">
            This was your free Session 1 of <span className="text-white font-semibold">{courseTitle}</span>.
          </p>
          <p className="text-sm text-[#94a3b8] mb-6">
            There are <span className="text-[#00f0ff] font-bold">{totalSessions - 1} more sessions</span> waiting
            — with quizzes, projects, and a certificate at the end.
          </p>

          {/* Price */}
          <div className="rounded-xl bg-[#059669]/10 border border-[#059669]/30 p-4 mb-6">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-3xl font-extrabold text-white">₹999</span>
              <span className="text-sm text-[#94a3b8] line-through">₹2,999</span>
            </div>
            <p className="text-xs text-[#059669] mt-1">
              Full course · {totalSessions} sessions · Certificate included
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href={`/learn/course/${courseSlug}`}
              className="w-full rounded-xl bg-[#059669] py-3.5 text-base font-bold text-white shadow-lg shadow-[#059669]/25 transition hover:bg-[#047857] active:scale-95 block text-center"
            >
              Buy Full Course — ₹999
            </Link>
            <button
              onClick={dismiss}
              className="text-sm text-[#94a3b8] hover:text-white transition"
            >
              I&apos;ll continue the free session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
