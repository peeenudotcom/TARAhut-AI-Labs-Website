'use client'

import { motion } from 'framer-motion'
import type { AssessmentReport } from '@/config/assessment'

interface ReportData {
  id: string
  report_content: AssessmentReport
  assessments: {
    name: string
    email: string
    industry: string
    team_size: string
  }
}

export function ReportContent({ report }: { report: ReportData }) {
  const content = report.report_content
  const assessment = report.assessments
  const whatsappMessage = encodeURIComponent(
    `Hi, I just completed the AI Assessment at TARAhut AI Labs. My name is ${assessment.name} and I'm in the ${assessment.industry} industry. I'd like to book a free consultation to discuss my report.`
  )

  return (
    <>
      {/* Header */}
      <section
        className="relative overflow-hidden py-20"
        style={{ backgroundColor: '#020617' }}
      >
        <div className="absolute inset-0">
          <div
            className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[120px]"
            style={{ background: 'rgba(16,185,129,0.10)' }}
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-sm text-emerald-300">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Report Generated
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-semibold text-white"
          >
            Your AI Automation Report
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-gray-400 text-lg"
          >
            Personalized for {assessment.name} &middot; {assessment.industry} &middot; Team of {assessment.team_size}
          </motion.p>
        </div>
      </section>

      {/* Summary */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl border border-slate-200 p-8"
          >
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              Overview
            </h2>
            <p className="text-slate-700 leading-relaxed">{content.summary}</p>
            {content.hindi_summary && (
              <p className="mt-4 text-slate-500 leading-relaxed text-sm border-t border-slate-100 pt-4">
                {content.hindi_summary}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8">
            Top 3 AI Automations for Your Business
          </h2>
          <div className="space-y-6">
            {content.recommendations?.map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {rec.title}
                    </h3>
                    <p className="mt-2 text-slate-600 leading-relaxed">
                      {rec.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {rec.estimated_time_saved}
                      </span>
                      {rec.tools?.map((tool) => (
                        <span
                          key={tool}
                          className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Step + CTA */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          {content.next_step && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                Your Next Step
              </h2>
              <p className="text-slate-700 leading-relaxed">
                {content.next_step}
              </p>
            </div>
          )}

          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-semibold mb-3">
              Want help implementing these automations?
            </h2>
            <p className="text-emerald-100 mb-6">
              Book a free 15-minute consultation with our AI trainer. We&apos;ll
              walk through your report and create a custom action plan.
            </p>
            <a
              href={`https://wa.me/919200882008?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 rounded-xl bg-white text-emerald-700 font-medium hover:bg-emerald-50 transition-colors shadow-lg"
            >
              Book Free Consultation on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
