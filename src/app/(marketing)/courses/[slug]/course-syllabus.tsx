'use client';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

export function CourseSyllabus({
  syllabus,
}: {
  syllabus: { module: string; topics: string[] }[];
}) {
  return (
    <Accordion>
      {syllabus.map((mod, i) => (
        <AccordionItem key={i} value={`module-${i}`}>
          <AccordionTrigger>
            <span className="flex items-center gap-3">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-400">
                {i + 1}
              </span>
              <span className="text-white font-medium">{mod.module}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="ml-10 space-y-2">
              {mod.topics.map((topic, j) => (
                <li
                  key={j}
                  className="flex items-center gap-2 text-gray-400"
                >
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500/40" />
                  {topic}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
