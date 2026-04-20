'use client'

import { useState } from 'react'
import type { Course } from '@/config/courses'

interface Props {
  course: Course
  enrollmentId: string
  completedKeys: string[]
}

export function CourseContent({ course, enrollmentId, completedKeys: initial }: Props) {
  const [completedKeys, setCompletedKeys] = useState(new Set(initial))
  const [loading, setLoading] = useState<string | null>(null)
  const [certLoading, setCertLoading] = useState(false)
  const [certMessage, setCertMessage] = useState('')

  const totalLessons = course.syllabus.reduce(
    (sum, mod) => sum + mod.topics.length,
    0
  )
  const completedCount = completedKeys.size
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
  const isComplete = completedCount === totalLessons && totalLessons > 0

  async function toggleLesson(lessonKey: string) {
    const isCompleted = completedKeys.has(lessonKey)
    setLoading(lessonKey)

    try {
      const res = await fetch('/api/student/progress', {
        method: isCompleted ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId, lessonKey }),
      })

      if (res.ok) {
        setCompletedKeys((prev) => {
          const next = new Set(prev)
          if (isCompleted) {
            next.delete(lessonKey)
          } else {
            next.add(lessonKey)
          }
          return next
        })
      }
    } catch {
      // Silently fail — user can retry
    }

    setLoading(null)
  }

  async function generateCertificate() {
    setCertLoading(true)
    setCertMessage('')

    try {
      const res = await fetch('/api/student/certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseSlug: course.slug }),
      })

      const data = await res.json()

      if (res.ok) {
        setCertMessage('Certificate generated! Check your certificates page.')
        // Redirect to certificates page after a moment
        setTimeout(() => {
          window.location.href = '/dashboard/certificates'
        }, 1500)
      } else {
        setCertMessage(data.error || 'Failed to generate certificate.')
      }
    } catch {
      setCertMessage('Something went wrong. Please try again.')
    }

    setCertLoading(false)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">{course.title}</h1>
        <p className="text-gray-400 mt-1">
          {course.duration} &middot; {course.level} &middot; by {course.instructorName}
        </p>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-gray-400">
              {completedCount} of {totalLessons} lessons
            </span>
            <span className="font-medium text-emerald-400">{progress}%</span>
          </div>
          <div className="h-2.5 bg-white/[0.05] rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Certificate button */}
      {isComplete && (
        <div className="mb-8 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center">
          <p className="text-emerald-800 font-medium mb-3">
            Congratulations! You&apos;ve completed all lessons.
          </p>
          <button
            onClick={generateCertificate}
            disabled={certLoading}
            className="px-6 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
          >
            {certLoading ? 'Generating...' : 'Generate Certificate'}
          </button>
          {certMessage && (
            <p className="mt-3 text-sm text-emerald-300">{certMessage}</p>
          )}
        </div>
      )}

      {/* Modules */}
      <div className="space-y-6">
        {course.syllabus.map((module, moduleIndex) => (
          <div
            key={moduleIndex}
            className="bg-white/[0.03] rounded-xl border border-white/[0.08] overflow-hidden"
          >
            <div className="px-6 py-4 bg-[#020617] border-b border-white/[0.08]">
              <h2 className="font-semibold text-white">
                Module {moduleIndex + 1}: {module.module}
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">
                {module.topics.length} lessons
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {module.topics.map((topic, topicIndex) => {
                const lessonKey = `m${moduleIndex}-l${topicIndex}`
                const isChecked = completedKeys.has(lessonKey)
                const isLoading = loading === lessonKey

                return (
                  <button
                    key={lessonKey}
                    onClick={() => toggleLesson(lessonKey)}
                    disabled={isLoading}
                    className="w-full flex items-center gap-3 px-6 py-3.5 text-left hover:bg-[#020617] transition-colors disabled:opacity-50"
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isChecked
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-white/[0.15]'
                      }`}
                    >
                      {isChecked && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        isChecked
                          ? 'text-gray-500 line-through'
                          : 'text-gray-200'
                      }`}
                    >
                      {topic}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
