'use client';

import type { SchoolCourseModule } from '@/config/school-courses';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

export function SchoolCourseSyllabus({ syllabus }: { syllabus: SchoolCourseModule[] }) {
  return (
    <Accordion>
      {syllabus.map((mod) => (
        <AccordionItem key={mod.module} value={`module-${mod.module}`}>
          <AccordionTrigger>
            <span className="flex items-center gap-3">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#e53935]/15 text-xs font-bold text-[#e53935]">
                {mod.module}
              </span>
              <span>{mod.title}</span>
              <span className="ml-auto text-xs text-[#94A3B8] font-normal">
                {mod.sessions} session{mod.sessions !== 1 ? 's' : ''}
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="ml-10 space-y-4">
              {/* Topics */}
              <ul className="space-y-2">
                {mod.topics.map((topic, j) => (
                  <li key={j} className="flex items-center gap-2 text-[#475569]">
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#e53935]/40" />
                    {topic}
                  </li>
                ))}
              </ul>

              {/* Activity */}
              {mod.activity && (
                <div className="rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] px-4 py-3">
                  <p className="text-xs font-semibold text-[#1E40AF] mb-1">Activity</p>
                  <p className="text-sm text-[#3B82F6]">{mod.activity}</p>
                </div>
              )}

              {/* Outcome */}
              {mod.outcome && (
                <div className="rounded-lg bg-[#FEF2F2] border border-[#FEE2E2] px-4 py-3">
                  <p className="text-xs font-semibold text-[#B91C1C] mb-1">Outcome</p>
                  <p className="text-sm text-[#e53935]">{mod.outcome}</p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
