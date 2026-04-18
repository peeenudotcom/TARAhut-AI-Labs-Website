'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { Course } from '@/config/courses';
import { CourseCover, hasCourseCover } from '@/components/marketing/course-cover';

const levelColors: Record<string, string> = {
  Beginner: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Intermediate: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Advanced: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
};

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
      {/* Filter Pills */}
      <div className="mb-12 flex flex-wrap justify-center gap-3">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 border ${
              active === cat
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400/50 shadow-lg shadow-emerald-500/25'
                : 'bg-white/[0.04] text-gray-400 border-white/10 hover:bg-white/[0.08] hover:text-white hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((course, i) => (
            <motion.div
              key={course.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                href={`/courses/${course.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1"
              >
                {/* Card header with cover artwork */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  {hasCourseCover(course.slug) ? (
                    <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.04]">
                      <CourseCover slug={course.slug} />
                    </div>
                  ) : (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      {/* Dark overlay for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D1225] via-black/40 to-black/20" />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2 z-10">
                        <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold border ${levelColors[course.level]}`}>
                          {course.level}
                        </span>
                        {course.isNew && (
                          <span className="inline-block rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-white shadow-md shadow-emerald-500/30">
                            New
                          </span>
                        )}
                      </div>

                      {/* Duration pill */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-sm px-3 py-1 text-[11px] font-medium text-gray-300 border border-white/10">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {course.duration}
                        </span>
                      </div>

                      {/* Bottom gradient fade into card body */}
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0D1225] to-transparent" />
                    </>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col px-5 pb-5 pt-1">
                  {/* Category tag */}
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-gray-400 border border-white/[0.06]">
                      {course.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="mb-4 flex-1 text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {course.shortDescription}
                  </p>

                  {/* Status badge */}
                  <div className="mb-4">
                    {course.batchStartingSoon ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Batch starting soon
                      </span>
                    ) : course.rating > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                        <svg className="h-3.5 w-3.5 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {course.rating}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </span>
                        New · First Batch Open
                      </span>
                    )}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-white">
                        ₹{course.price.toLocaleString('en-IN')}
                      </span>
                      {course.originalPrice && (
                        <>
                          <span className="text-sm text-gray-600 line-through">
                            ₹{course.originalPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                            -{Math.round((1 - course.price / course.originalPrice) * 100)}%
                          </span>
                        </>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-sm font-medium text-emerald-400 group-hover:gap-2 transition-all">
                      Details
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
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
