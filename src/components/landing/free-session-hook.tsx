'use client';

import Link from 'next/link';
import { trackEvent } from '@/components/analytics/meta-pixel';

interface Props {
  courseSlug: string;
  // Label override for cases where the surrounding copy needs a different tone
  // ("Start Session 1 Free", "Take the first lesson", etc.). Defaults to
  // "Try Session 1 Free".
  label?: string;
  // First free session number. 1 matches the current isFree flag pattern in
  // learn-modules.ts; exposed as a prop so a future course with a later free
  // session doesn't need a fork of this component.
  freeSessionNumber?: number;
  className?: string;
}

export function FreeSessionHook({
  courseSlug,
  label = 'Try Session 1 Free',
  freeSessionNumber = 1,
  className = '',
}: Props) {
  // AI Tools Mastery is the implicit default course across the learn routes,
  // so its ?course= param is omitted to keep URLs clean. All other courses
  // carry the slug so the dashboard and next-session logic know which course
  // the student is on.
  const courseParam =
    courseSlug === 'ai-tools-mastery-beginners' ? '' : `?course=${courseSlug}`;

  return (
    <Link
      href={`/learn/session/${freeSessionNumber}${courseParam}`}
      onClick={() =>
        trackEvent('Lead', {
          content_name: courseSlug,
          content_category: 'free_session',
          value: 0,
          currency: 'INR',
        })
      }
      className={`el-cta-hook ${className}`.trim()}
    >
      {label}
      <svg
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
          clipRule="evenodd"
        />
      </svg>
    </Link>
  );
}
