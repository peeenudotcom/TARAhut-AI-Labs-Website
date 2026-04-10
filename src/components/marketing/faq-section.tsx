'use client'

import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'Do I need any technical background to join AI courses?',
    answer:
      'Not at all. Our beginner courses like AI Tools Mastery are designed for people with zero technical background. We start from the basics and gradually build your skills through hands-on practice. All you need is a laptop and curiosity.',
  },
  {
    question: 'Are the classes online or offline?',
    answer:
      'We offer both options. We have offline batches in Kotkapura, Punjab, as well as live online sessions that you can join from anywhere. Recorded sessions are also available for revision.',
  },
  {
    question: 'What is the course fee and are there EMI options?',
    answer:
      'Our courses range from INR 4,999 to INR 14,999 depending on the program. We offer flexible EMI options and early-bird discounts. Contact us for current offers and payment plans.',
  },
  {
    question: 'Will I get a certificate after completing the course?',
    answer:
      'Yes, you will receive an industry-recognized completion certificate from TARAhut AI Labs after successfully completing the course and submitting all required projects.',
  },
  {
    question: 'Do you provide placement assistance?',
    answer:
      'Yes, we have an 85% placement rate. We provide resume building with AI tools, mock interviews, LinkedIn profile optimization, and direct referrals to our hiring partners across Punjab and remote-first companies.',
  },
  {
    question: 'How long are the courses and what is the time commitment?',
    answer:
      'Course durations range from 3 to 12 weeks. Most courses require 6-8 hours per week, including live sessions and practice assignments. Weekend batches are available for working professionals.',
  },
  {
    question: 'Can I switch between online and offline batches?',
    answer:
      'Yes, we offer flexible batch switching. If you start with an offline batch and need to switch to online (or vice versa), just let us know at least one week in advance and we will accommodate you.',
  },
  {
    question: 'What makes TARAhut AI Labs different from other institutes?',
    answer:
      'We focus exclusively on AI skills with a project-based curriculum. Our instructors are industry practitioners, not just academics. Every course includes real-world projects, and we update our curriculum monthly to include the latest AI tools and techniques.',
  },
  {
    question: 'Can I earn after this course?',
    answer:
      'Yes — and that is the whole point. Our courses are designed with income in mind. Students have gone on to freelance on platforms like Fiverr and Upwork, get hired at companies that need AI skills, or use AI to grow their own business. The skills you learn have immediate market value.',
  },
  {
    question: 'Is this suitable for non-technical students?',
    answer:
      'Absolutely. Most of our students come from non-technical backgrounds — commerce, arts, business, and general graduates. Our beginner courses require no coding knowledge. We start from the basics and build up your skills through hands-on practice with real tools.',
  },
  {
    question: 'How can I start my own AI training center?',
    answer:
      'TARAhut AI Labs offers a partnership model for entrepreneurs who want to run their own AI training center. We provide the curriculum, trainer support, branding, and operational system. You bring the space and the drive. Fill out the partnership enquiry form on our Partner page or contact us on WhatsApp to learn more.',
  },
]

export function FaqSection() {
  return (
    <section className="bg-[#F8FAFC]">
      <div className="mx-auto max-w-3xl px-6 py-24 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-medium tracking-widest uppercase text-[#e53935]">
            Got questions?
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Accordion>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base font-medium text-[#0F172A]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-[#475569] leading-relaxed">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
