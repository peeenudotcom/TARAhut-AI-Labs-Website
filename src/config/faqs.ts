// Centralized FAQ data — used by both /faq page and homepage FAQ section
// When adding new questions, keep them grounded in what TARAhut actually offers.
// Avoid overclaims (no fake stats, no "industry-recognized" if not actually accredited).

export interface Faq {
  question: string
  answer: string
}

export interface FaqCategory {
  id: string
  name: string
  emoji: string
  faqs: Faq[]
}

export const faqCategories: FaqCategory[] = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    emoji: '🚀',
    faqs: [
      {
        question: 'Do I need any technical background to join?',
        answer:
          'Not at all. Our beginner courses like AI Tools Mastery and AI Power are designed for people with zero technical background. We start from the basics and gradually build your skills through hands-on practice. All you need is a laptop and curiosity.',
      },
      {
        question: 'Is this suitable for non-technical students?',
        answer:
          'Absolutely. Most of our students come from non-technical backgrounds — BCom, BBA, BA, arts, humanities, and general graduates. Our beginner courses require zero coding knowledge. We build your skills step by step through real projects.',
      },
      {
        question: 'What do I need to get started?',
        answer:
          'A laptop or desktop (Windows or Mac), stable internet connection, and a Gmail account. That\'s it. For offline batches in Kotkapura, you can also use our center computers during class hours.',
      },
      {
        question: 'Are there age limits for your courses?',
        answer:
          'Our adult courses are for 16 years and above. For younger learners, we offer dedicated AI Explorer programs for kids (Class 5-7 and Class 8-10). There is no upper age limit — we welcome students of all ages who want to learn.',
      },
      {
        question: 'How do I enroll in a course?',
        answer:
          'Browse our courses page, pick the course that fits your goals, and click Enroll. You\'ll fill a quick form with your details and complete payment via Razorpay (UPI, cards, net banking, wallets all accepted). You get instant confirmation via email and WhatsApp.',
      },
    ],
  },
  {
    id: 'courses',
    name: 'Courses & Curriculum',
    emoji: '📚',
    faqs: [
      {
        question: 'What courses do you currently offer?',
        answer:
          'We offer 9 courses: AI Tools Mastery for Beginners, Generative AI & Prompt Engineering, AI for Digital Marketing, AI Power 8-Week Program, Master Claude in 15 Days, Master AI Builder 90-Day Program, AI Hustler 45, and two AI Explorer programs for school kids (Class 5-7 and Class 8-10).',
      },
      {
        question: 'How long are the courses?',
        answer:
          'Duration varies by course. Short programs like Master Claude in 15 Days run for 2 weeks. AI Power is 8 weeks. AI Hustler is 45 days. Master AI Builder is 90 days. Kids summer programs are 4 weeks. Each course page shows the exact duration.',
      },
      {
        question: 'What is the time commitment per week?',
        answer:
          'Most courses require 5-8 hours per week at our Kotkapura center plus practice assignments you do at home. For intensive programs like AI Hustler 45, expect 3 hours daily. Weekend-friendly batches are available for working professionals.',
      },
      {
        question: 'What AI tools will I learn?',
        answer:
          'Depending on the course: ChatGPT, Claude, Canva AI, Midjourney, Python, Notion AI, Perplexity, ElevenLabs, HeyGen, Gamma, and more. You\'ll use free tiers for most tools — we don\'t require paid subscriptions to learn.',
      },
      {
        question: 'What happens if I miss a class?',
        answer:
          'Reach out to your instructor and we\'ll help you catch up. For most courses, instructors share a summary of what was covered and any homework. For the most important topics, instructors run quick catch-up sessions for students who miss classes.',
      },
      {
        question: 'Do I get access to materials after completing the course?',
        answer:
          'Yes. You get lifetime access to all course materials, prompt libraries, and templates through the student portal. Come back anytime to revise.',
      },
    ],
  },
  {
    id: 'location',
    name: 'Classes & Location',
    emoji: '📍',
    faqs: [
      {
        question: 'Where are classes held?',
        answer:
          'All our classes are held **offline at our center in Kotkapura, Punjab**. We believe hands-on, in-person training delivers the best results — you can ask questions directly, see demonstrations live, and work on projects with the instructor right there beside you.',
      },
      {
        question: 'Do you offer online classes?',
        answer:
          'Not currently. We\'re a dedicated offline training center in Kotkapura. Our focus is in-person, hands-on learning because that\'s what gives students the best outcomes. If online training matters to you, WhatsApp us at +91 92008-82008 and we\'ll let you know if we launch online options in the future.',
      },
      {
        question: 'Where exactly is your center?',
        answer:
          'Our center is in Kotkapura, Punjab. For the exact address and directions, WhatsApp us at +91 92008-82008 — we\'ll share the location pin directly.',
      },
      {
        question: 'I don\'t live in Kotkapura. Can I still join?',
        answer:
          'Absolutely — many of our students travel from nearby towns like Faridkot, Bathinda, Muktsar, and Moga. Since classes are offline, you\'ll need to come to our Kotkapura center for sessions. We can help suggest batch timings that work around your travel schedule. WhatsApp us to discuss.',
      },
    ],
  },
  {
    id: 'pricing',
    name: 'Pricing & Payment',
    emoji: '💳',
    faqs: [
      {
        question: 'What do your courses cost?',
        answer:
          'Our courses range from ₹2,499 to ₹24,999 depending on duration and depth. Beginner courses start at ₹2,499. Comprehensive programs like Master AI Builder 90-Day go up to ₹24,999. Each course page shows the exact price with any current discount.',
      },
      {
        question: 'Do you offer EMI or installment options?',
        answer:
          'Yes. Razorpay supports EMI on most major credit cards at checkout. For longer programs, we also offer split payments — contact us on WhatsApp to discuss a plan that works for you.',
      },
      {
        question: 'Are there any scholarships or discounts?',
        answer:
          'We offer early-bird discounts for students who enroll before batch start dates. Group discounts are available when 3 or more students enroll together. For alumni, special loyalty pricing applies on new courses.',
      },
      {
        question: 'What is your refund policy?',
        answer:
          'Full refund within 48 hours of payment if the course hasn\'t started. 50% refund within 7 days or before the second session. No refund after you\'ve attended more than 25% of the course. Full details on our Refund Policy page.',
      },
      {
        question: 'What payment methods do you accept?',
        answer:
          'All major payment methods via Razorpay: UPI (Google Pay, PhonePe, Paytm), debit/credit cards, net banking, and digital wallets. Payments are secure and processed instantly.',
      },
    ],
  },
  {
    id: 'certification',
    name: 'Certification & Outcomes',
    emoji: '🏆',
    faqs: [
      {
        question: 'Will I get a certificate after completing the course?',
        answer:
          'Yes. You\'ll receive a TARAhut-verified completion certificate after successfully finishing all course requirements. It\'s digitally verifiable through our website and shareable on LinkedIn.',
      },
      {
        question: 'Is the certificate industry-recognized?',
        answer:
          'Our certificate is issued and verified by TARAhut AI Labs. It\'s not affiliated with any university or government body. What matters more than accreditation is what you can actually do with AI by the end of the course — your portfolio of real projects and the skills you demonstrate.',
      },
      {
        question: 'Can I actually earn after completing the course?',
        answer:
          'Yes, and that\'s the point. Our courses are designed around income outcomes. Students use AI skills for freelancing on Fiverr and Upwork, for getting hired in marketing and content roles, or for growing their own businesses. The earning potential depends on your effort and the course you choose.',
      },
      {
        question: 'Do you provide placement assistance?',
        answer:
          'We provide placement assistance including resume building with AI tools, mock interviews, LinkedIn profile optimization, and referrals to our network of hiring partners. We don\'t guarantee placement — your outcomes depend on your skills, effort, and market conditions at the time.',
      },
      {
        question: 'What income can I realistically expect?',
        answer:
          'Results vary based on effort, course, and market. Beginner freelancers in India typically earn ₹10K-30K per month in their first 3-6 months. With consistent work, this can grow to ₹50K+. These are realistic ranges, not guarantees. Your success depends on you.',
      },
    ],
  },
  {
    id: 'kids',
    name: 'Kids Programs',
    emoji: '👨‍👩‍👧',
    faqs: [
      {
        question: 'Which age groups do you offer kids programs for?',
        answer:
          'We run two dedicated programs: AI Explorer Junior for Class 5-7 (ages 10-12) and AI Explorer Senior for Class 8-10 (ages 13-15). Each is designed for the age group\'s attention span, interests, and learning style.',
      },
      {
        question: 'What will my child learn?',
        answer:
          'Kids learn age-appropriate AI: ChatGPT for homework help, Canva AI for creative projects, AI storytelling and games for Juniors, and more structured prompt engineering plus AI-assisted study for Seniors. Curriculum is hands-on and project-based.',
      },
      {
        question: 'Is screen time a concern? How do you handle it?',
        answer:
          'Our sessions are structured and time-limited (typically 1 hour per class). Kids learn to use AI productively, not passively consume content. Parents get weekly updates on what their child built, not just how long they were on screen.',
      },
      {
        question: 'Do parents get progress updates?',
        answer:
          'Yes. Parents receive weekly WhatsApp updates with what their child learned, what they built that week, and any feedback from the instructor. We also offer optional parent-child review calls.',
      },
    ],
  },
  {
    id: 'business',
    name: 'Partnership & Business',
    emoji: '🤝',
    faqs: [
      {
        question: 'How can I partner with TARAhut AI Labs?',
        answer:
          'We offer a partnership model for entrepreneurs who want to run their own AI training center under the TARAhut brand. We provide the curriculum, trainer support, marketing materials, and operational playbook. You bring the space and the drive. Fill out the form on our Partner page or contact us on WhatsApp.',
      },
      {
        question: 'Do you offer corporate training or bulk enrollments?',
        answer:
          'Yes. We offer customized AI training for companies, colleges, and coaching institutes. Group discounts are available for 10 or more learners. Contact us on WhatsApp at +91 92008-82008 to discuss your team\'s needs.',
      },
      {
        question: 'Where can I find your policies?',
        answer:
          'All our policies are linked in the footer: Privacy Policy, Terms & Conditions, and Refund & Cancellation Policy. Review them before enrolling so you know what to expect.',
      },
    ],
  },
]

// Flattened list of all FAQs (useful for search)
export const allFaqs: Faq[] = faqCategories.flatMap((cat) => cat.faqs)

// Top 6 questions shown on the homepage (the most important ones for first-time visitors)
export const homepageFaqs: Faq[] = [
  {
    question: 'Do I need any technical background to join?',
    answer:
      'Not at all. Our beginner courses are designed for people with zero technical background. We start from basics and build your skills through hands-on practice. All you need is a laptop and curiosity.',
  },
  {
    question: 'Where are classes held?',
    answer:
      'All our classes are held **offline at our center in Kotkapura, Punjab**. We believe hands-on, in-person training delivers the best results — you can ask questions directly, work on projects beside the instructor, and learn faster than any online format.',
  },
  {
    question: 'What do your courses cost?',
    answer:
      'Our courses range from ₹2,499 to ₹24,999 depending on duration and depth. Beginner courses start at ₹2,499. EMI and split payment options are available via Razorpay.',
  },
  {
    question: 'Can I actually earn after completing the course?',
    answer:
      'Yes, and that\'s the point. Our courses are designed around income outcomes. Students use AI skills for freelancing, getting hired in marketing and content roles, or growing their own businesses. Realistic first-year range: ₹10K-50K/month depending on effort.',
  },
  {
    question: 'Will I get a certificate?',
    answer:
      'Yes. You\'ll receive a TARAhut-verified completion certificate that\'s digitally verifiable through our website and shareable on LinkedIn. It\'s issued by TARAhut, not accredited by a university — what matters is the portfolio of real projects you build during the course.',
  },
  {
    question: 'What makes TARAhut different from YouTube or other institutes?',
    answer:
      'We focus on income outcomes, not just theory. Every course includes real projects you can show clients or employers. Our instructors are practitioners, not just academics. And we update our curriculum regularly to cover the latest AI tools and techniques.',
  },
]
