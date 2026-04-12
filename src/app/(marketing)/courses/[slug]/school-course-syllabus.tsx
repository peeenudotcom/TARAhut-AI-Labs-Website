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
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-400">
                {mod.module}
              </span>
              <span className="text-white font-medium">{mod.title}</span>
              <span className="ml-auto text-xs text-gray-500 font-normal">
                {mod.sessions} session{mod.sessions !== 1 ? 's' : ''}
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="ml-10 space-y-4">
              {/* Topics */}
              <ul className="space-y-2">
                {mod.topics.map((topic, j) => (
                  <li key={j} className="flex items-center gap-2 text-gray-400">
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500/40" />
                    {topic}
                  </li>
                ))}
              </ul>

              {/* Activity */}
              {mod.activity && (
                <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 px-4 py-3">
                  <p className="text-xs font-semibold text-blue-400 mb-1">Activity</p>
                  <p className="text-sm text-blue-300">{mod.activity}</p>
                </div>
              )}

              {/* Outcome */}
              {mod.outcome && (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3">
                  <p className="text-xs font-semibold text-emerald-400 mb-1">Outcome</p>
                  <p className="text-sm text-emerald-300">{mod.outcome}</p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
