'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { Course } from '@/config/courses';
import { Badge } from '@/components/ui/badge';

const levelColors: Record<string, string> = {
  Beginner: 'bg-emerald-500/15 text-emerald-600',
  Intermediate: 'bg-amber-500/15 text-amber-600',
  Advanced: 'bg-rose-500/15 text-rose-600',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1 text-sm text-[#475569]">
      <svg
        className="h-4 w-4 fill-amber-400 text-amber-400"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      {rating}
    </span>
  );
}

export function CoursesGrid({
  courses,
  categories,
}: {
  courses: Course[];
  categories: string[];
}) {
  const [active, setActive] = useState('All');

  const filtered =
    active === 'All' ? courses : courses.filter((c) => c.category === active);

  const allCategories = ['All', ...categories];

  return (
    <>
      {/* Filter Buttons */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
              active === cat
                ? 'bg-gradient-to-r from-[#059669] to-[#0D9488] text-white shadow-md'
                : 'bg-[#F0FDF4] text-[#475569] hover:bg-[#059669]/10 hover:text-[#0F172A]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((course, i) => (
            <motion.div
              key={course.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link
                href={`/courses/${course.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm transition-all hover:shadow-lg hover:shadow-[#059669]/5 hover:-translate-y-1"
              >
                {/* Thumbnail placeholder */}
                <div className="relative h-48 w-full bg-gradient-to-br from-[#059669]/10 to-[#0D9488]/10">
                  <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-[#059669]/15">
                    {course.category}
                  </div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${levelColors[course.level]}`}
                    >
                      {course.level}
                    </span>
                    {course.isNew && (
                      <span className="inline-block rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                        New
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="secondary" className="w-fit text-xs">
                      {course.category}
                    </Badge>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-[#0F172A] group-hover:text-[#059669] transition-colors">
                    {course.title}
                  </h3>
                  <p className="mb-4 flex-1 text-sm text-[#475569] leading-relaxed line-clamp-3">
                    {course.shortDescription}
                  </p>

                  {/* Meta */}
                  <div className="mb-4 flex items-center gap-4 text-sm text-[#64748B]">
                    <span className="flex items-center gap-1">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {course.duration}
                    </span>
                    {course.batchStartingSoon ? (
                      <span className="flex items-center gap-1 text-amber-600 font-medium">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Batch starting soon
                      </span>
                    ) : course.rating > 0 ? (
                      <StarRating rating={course.rating} />
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-emerald-600">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </span>
                        New Course
                      </span>
                    )}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-[#0F172A]">
                        ₹{course.price.toLocaleString('en-IN')}
                      </span>
                      {course.originalPrice && (
                        <>
                          <span className="text-sm text-[#94A3B8] line-through">
                            ₹{course.originalPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs font-semibold text-green-600">
                            -{Math.round((1 - course.price / course.originalPrice) * 100)}%
                          </span>
                        </>
                      )}
                    </div>
                    <span className="text-sm font-medium text-[#059669] group-hover:underline">
                      View Details &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
