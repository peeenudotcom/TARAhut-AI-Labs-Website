'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { getResources, type ArchetypeResources } from './career-data'
import { InterviewPrepModal } from './interview-prep-modal'

// ─── Types ───────────────────────────────────────────────────────────────────

type Step = 'hook' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'processing' | 'results'

interface Answers {
  status: string
  interests: string[]
  personality: string
  goals: string[]
  skillLevel: string
  workStyle: string
  timeCommitment: string
}

interface CareerMatch {
  title: string
  icon: string
  whyFits: string
  whatYouDo: string
  salaryRange: string
  demandCountries: string
}

interface CareerResult {
  identity: string
  subtitle: string
  archetypeId: string
  score: number
  readiness: number
  marketFit: number
  growthPotential: number
  strengths: { label: string; value: number; color: string }[]
  careers: CareerMatch[]
  roadmap: { month: string; title: string; desc: string }[]
  resources: ArchetypeResources
}

// ─── Constants ───────────────────────────────────────────────────────────────

const WHATSAPP_NUMBER = '919200882008'

const STATUS_OPTIONS = [
  { id: 'school', label: 'School Student', icon: '🎒', desc: 'Class 10-12' },
  { id: 'college', label: 'College Student', icon: '🎓', desc: 'Undergraduate / Postgraduate' },
  { id: 'professional', label: 'Working Professional', icon: '💼', desc: 'Currently employed' },
  { id: 'business', label: 'Business Owner', icon: '🏢', desc: 'Running a business' },
  { id: 'freelancer', label: 'Freelancer', icon: '🚀', desc: 'Self-employed' },
]

const INTEREST_OPTIONS = [
  { id: 'tech', label: 'Technology', icon: '💻' },
  { id: 'business', label: 'Business', icon: '📊' },
  { id: 'creativity', label: 'Creativity', icon: '🎨' },
  { id: 'communication', label: 'Communication', icon: '🗣️' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'design', label: 'Design', icon: '✨' },
]

const PERSONALITY_OPTIONS = [
  { id: 'problem-solver', label: 'I like solving problems', icon: '🧩', desc: 'Logic-driven thinker' },
  { id: 'creator', label: 'I like creating content', icon: '🎬', desc: 'Creative storyteller' },
  { id: 'leader', label: 'I like leading people', icon: '👑', desc: 'Natural organizer' },
  { id: 'analyst', label: 'I like analyzing data', icon: '🔍', desc: 'Detail-oriented mind' },
]

const GOAL_OPTIONS = [
  { id: 'high-income', label: 'High Income', icon: '💰' },
  { id: 'work-abroad', label: 'Work Abroad', icon: '🌍' },
  { id: 'job-security', label: 'Job Security', icon: '🛡️' },
  { id: 'freelancing', label: 'Freelancing', icon: '🏠' },
  { id: 'own-business', label: 'Start a Business', icon: '🚀' },
  { id: 'impact', label: 'Make an Impact', icon: '💡' },
]

const SKILL_OPTIONS = [
  { id: 'beginner', label: 'Complete Beginner', icon: '🌱', desc: 'Never explored AI' },
  { id: 'some-idea', label: 'Some Idea', icon: '🌿', desc: 'Used ChatGPT / basic tools' },
  { id: 'exploring', label: 'Already Exploring', icon: '🌳', desc: 'Building projects / learning' },
]

const WORK_STYLE_OPTIONS = [
  { id: 'solo', label: 'Solo Deep Work', icon: '🎧', desc: 'Focused, independent' },
  { id: 'team', label: 'Team Collaboration', icon: '🤝', desc: 'Brainstorming, syncing' },
  { id: 'mix', label: 'Mix of Both', icon: '⚡', desc: 'Flexible & adaptive' },
  { id: 'leading', label: 'Leading a Team', icon: '🎯', desc: 'Guiding others' },
]

const TIME_OPTIONS = [
  { id: '2-5', label: '2-5 hrs/week', icon: '⏱️', desc: 'Casual learning' },
  { id: '5-10', label: '5-10 hrs/week', icon: '⏰', desc: 'Committed learner' },
  { id: '10-20', label: '10-20 hrs/week', icon: '🔥', desc: 'Serious about growth' },
  { id: 'fulltime', label: 'Full-time Learner', icon: '🚀', desc: 'All in!' },
]

const PROCESSING_MESSAGES = [
  'Analyzing your personality profile...',
  'Mapping your interests to AI careers...',
  'Calculating market demand scores...',
  'Matching with real-world career paths...',
  'Evaluating salary growth potential...',
  'Building your personalized roadmap...',
  'Generating your Career DNA...',
]

// ─── Career Archetypes ───────────────────────────────────────────────────────

interface Archetype {
  id: string
  title: string
  identity: string
  subtitle: string
  icon: string
  triggers: { interests: string[]; personality: string[]; goals: string[] }
  strengths: { technical: number; creative: number; analytical: number; leadership: number; communication: number; business: number }
  careers: CareerMatch[]
  roadmap: { month: string; title: string; desc: string }[]
}

const ARCHETYPES: Archetype[] = [
  {
    id: 'ai-ml-engineer',
    title: 'AI/ML Engineer',
    identity: 'The AI Architect',
    subtitle: 'You think in systems and build intelligent solutions',
    icon: '🤖',
    triggers: { interests: ['tech', 'analytics'], personality: ['problem-solver', 'analyst'], goals: ['high-income', 'work-abroad'] },
    strengths: { technical: 95, creative: 40, analytical: 90, leadership: 35, communication: 30, business: 25 },
    careers: [
      { title: 'AI/ML Engineer', icon: '🤖', whyFits: 'Your analytical mind + tech interest = perfect for building AI models', whatYouDo: 'Design, train, and deploy machine learning models for real-world applications', salaryRange: '₹8L - ₹35L/year', demandCountries: 'USA, Canada, UK, Germany, Australia' },
      { title: 'Data Scientist', icon: '📊', whyFits: 'You love data and problem-solving — the core of data science', whatYouDo: 'Extract insights from large datasets to drive business decisions', salaryRange: '₹6L - ₹28L/year', demandCountries: 'USA, UK, Singapore, Netherlands' },
      { title: 'MLOps Engineer', icon: '⚙️', whyFits: 'Your systems thinking makes you ideal for production ML', whatYouDo: 'Deploy and maintain ML models in production environments', salaryRange: '₹10L - ₹40L/year', demandCountries: 'USA, Canada, Germany' },
    ],
    roadmap: [
      { month: 'Month 1', title: 'Foundation', desc: 'Python, statistics, and ML basics with hands-on projects' },
      { month: 'Month 2', title: 'Build & Practice', desc: 'Deep learning, NLP, computer vision — real datasets' },
      { month: 'Month 3', title: 'Portfolio & Apply', desc: '3 projects on GitHub, Kaggle profile, start applying' },
    ],
  },
  {
    id: 'ai-content-creator',
    title: 'AI Content Creator',
    identity: 'The Creative Disruptor',
    subtitle: 'You turn ideas into content that captivates and converts',
    icon: '🎬',
    triggers: { interests: ['creativity', 'communication'], personality: ['creator'], goals: ['freelancing', 'own-business'] },
    strengths: { technical: 35, creative: 95, analytical: 30, leadership: 40, communication: 85, business: 55 },
    careers: [
      { title: 'AI Content Creator', icon: '🎬', whyFits: 'Your creativity + communication skills = content gold', whatYouDo: 'Create viral content using AI tools like Midjourney, ChatGPT, and Canva AI', salaryRange: '₹4L - ₹18L/year', demandCountries: 'Global (remote-first)' },
      { title: 'AI Marketing Specialist', icon: '📱', whyFits: 'You understand storytelling and can leverage AI for scale', whatYouDo: 'Run AI-powered campaigns, automate content pipelines', salaryRange: '₹5L - ₹20L/year', demandCountries: 'USA, UK, Dubai, Australia' },
      { title: 'AI Video Producer', icon: '🎥', whyFits: 'Your creative vision + AI video tools = next-gen content', whatYouDo: 'Produce professional videos using AI generation and editing tools', salaryRange: '₹3L - ₹15L/year', demandCountries: 'Global (remote-first)' },
    ],
    roadmap: [
      { month: 'Month 1', title: 'Master AI Tools', desc: 'ChatGPT, Midjourney, Canva AI, CapCut — daily practice' },
      { month: 'Month 2', title: 'Build Your Brand', desc: 'Start a content channel, build portfolio of 20+ pieces' },
      { month: 'Month 3', title: 'Monetize', desc: 'Land first freelance client or reach 1K followers' },
    ],
  },
  {
    id: 'ai-business-consultant',
    title: 'AI Business Consultant',
    identity: 'The Strategic Visionary',
    subtitle: 'You see opportunities where others see complexity',
    icon: '🏆',
    triggers: { interests: ['business'], personality: ['leader'], goals: ['high-income', 'own-business'] },
    strengths: { technical: 30, creative: 45, analytical: 65, leadership: 90, communication: 80, business: 95 },
    careers: [
      { title: 'AI Business Consultant', icon: '🏆', whyFits: 'Your leadership + business sense = trusted AI advisor', whatYouDo: 'Help companies adopt AI strategies and transform operations', salaryRange: '₹8L - ₹30L/year', demandCountries: 'USA, UK, UAE, Singapore' },
      { title: 'AI Transformation Lead', icon: '🔄', whyFits: 'You naturally lead change and can drive AI adoption', whatYouDo: 'Lead digital transformation projects using AI/automation', salaryRange: '₹12L - ₹45L/year', demandCountries: 'USA, UK, Australia, India' },
      { title: 'AI Product Manager', icon: '📋', whyFits: 'Your mix of strategy and execution is rare and valuable', whatYouDo: 'Define AI product roadmaps, coordinate teams, ship features', salaryRange: '₹10L - ₹35L/year', demandCountries: 'USA, UK, Germany, Singapore' },
    ],
    roadmap: [
      { month: 'Month 1', title: 'AI Literacy', desc: 'Understand AI capabilities, use cases, and business applications' },
      { month: 'Month 2', title: 'Strategy Building', desc: 'Learn frameworks for AI adoption, ROI analysis, change management' },
      { month: 'Month 3', title: 'Case Studies & Network', desc: 'Build 3 consulting case studies, start networking' },
    ],
  },
  {
    id: 'prompt-engineer',
    title: 'Prompt Engineer',
    identity: 'The AI Whisperer',
    subtitle: 'You speak the language that makes AI do extraordinary things',
    icon: '⚡',
    triggers: { interests: ['tech', 'creativity'], personality: ['problem-solver', 'creator'], goals: ['freelancing', 'high-income'] },
    strengths: { technical: 70, creative: 80, analytical: 60, leadership: 25, communication: 75, business: 50 },
    careers: [
      { title: 'Prompt Engineer', icon: '⚡', whyFits: 'Your creative problem-solving is exactly what prompt engineering needs', whatYouDo: 'Design prompts and AI workflows for companies and products', salaryRange: '₹6L - ₹25L/year', demandCountries: 'USA, UK, Remote Global' },
      { title: 'AI Automation Specialist', icon: '🔗', whyFits: 'You can chain AI tools together for powerful workflows', whatYouDo: 'Build automated AI pipelines using no-code/low-code tools', salaryRange: '₹5L - ₹20L/year', demandCountries: 'Global (remote-first)' },
    ],
    roadmap: [
      { month: 'Month 1', title: 'Prompt Mastery', desc: 'Advanced prompting, chain-of-thought, system prompts' },
      { month: 'Month 2', title: 'Tool Integration', desc: 'APIs, Zapier, Make.com — connect AI to real workflows' },
      { month: 'Month 3', title: 'Client Projects', desc: 'Build 5 automation case studies, launch on Upwork/Fiverr' },
    ],
  },
  {
    id: 'data-analyst',
    title: 'AI Data Analyst',
    identity: 'The Insight Hunter',
    subtitle: 'You find stories hidden in numbers that others miss',
    icon: '📈',
    triggers: { interests: ['analytics', 'business'], personality: ['analyst'], goals: ['job-security', 'high-income'] },
    strengths: { technical: 60, creative: 30, analytical: 95, leadership: 35, communication: 55, business: 70 },
    careers: [
      { title: 'AI Data Analyst', icon: '📈', whyFits: 'Your analytical nature + business interest = data analyst DNA', whatYouDo: 'Use AI tools to analyze data, create dashboards, and drive decisions', salaryRange: '₹5L - ₹22L/year', demandCountries: 'USA, UK, Canada, Australia, India' },
      { title: 'Business Intelligence Analyst', icon: '🎯', whyFits: 'You bridge the gap between data and business strategy', whatYouDo: 'Transform raw data into actionable business insights using AI', salaryRange: '₹6L - ₹25L/year', demandCountries: 'USA, UK, Singapore' },
    ],
    roadmap: [
      { month: 'Month 1', title: 'Tools & SQL', desc: 'Excel AI, Python basics, SQL, and data visualization' },
      { month: 'Month 2', title: 'Analysis Projects', desc: 'Real datasets, dashboards, and AI-powered insights' },
      { month: 'Month 3', title: 'Portfolio & Certify', desc: 'Google/IBM certification + 3 portfolio projects' },
    ],
  },
  {
    id: 'ai-ux-designer',
    title: 'AI UX Designer',
    identity: 'The Experience Architect',
    subtitle: 'You design digital experiences that feel intuitive and magical',
    icon: '🎨',
    triggers: { interests: ['design', 'creativity', 'tech'], personality: ['creator', 'problem-solver'], goals: ['work-abroad', 'high-income'] },
    strengths: { technical: 55, creative: 90, analytical: 50, leadership: 35, communication: 65, business: 45 },
    careers: [
      { title: 'AI UX Designer', icon: '🎨', whyFits: 'Your design eye + tech interest = future of UX', whatYouDo: 'Design AI-powered interfaces and user experiences', salaryRange: '₹6L - ₹25L/year', demandCountries: 'USA, UK, Germany, Canada' },
      { title: 'AI Product Designer', icon: '✏️', whyFits: 'You combine aesthetics with functionality perfectly', whatYouDo: 'Design end-to-end product experiences for AI applications', salaryRange: '₹8L - ₹30L/year', demandCountries: 'USA, UK, Netherlands' },
    ],
    roadmap: [
      { month: 'Month 1', title: 'AI Design Tools', desc: 'Figma AI, Midjourney, design systems, UX research' },
      { month: 'Month 2', title: 'Case Studies', desc: 'Redesign 3 AI products with documented UX process' },
      { month: 'Month 3', title: 'Portfolio Launch', desc: 'Polished portfolio site + Dribbble/Behance presence' },
    ],
  },
  {
    id: 'ai-marketing-strategist',
    title: 'AI Marketing Strategist',
    identity: 'The Growth Hacker',
    subtitle: 'You turn AI into a marketing superpower that drives results',
    icon: '📱',
    triggers: { interests: ['communication', 'business', 'analytics'], personality: ['creator', 'leader'], goals: ['own-business', 'high-income'] },
    strengths: { technical: 40, creative: 70, analytical: 65, leadership: 55, communication: 90, business: 80 },
    careers: [
      { title: 'AI Marketing Strategist', icon: '📱', whyFits: 'Your communication + business sense = marketing powerhouse', whatYouDo: 'Plan and execute AI-driven marketing campaigns at scale', salaryRange: '₹5L - ₹22L/year', demandCountries: 'USA, UK, Dubai, India' },
      { title: 'Growth Marketing Manager', icon: '🚀', whyFits: 'You understand both the art and science of growth', whatYouDo: 'Use AI for SEO, content marketing, paid ads optimization', salaryRange: '₹7L - ₹28L/year', demandCountries: 'USA, UK, Singapore, Australia' },
    ],
    roadmap: [
      { month: 'Month 1', title: 'AI Marketing Stack', desc: 'ChatGPT for copy, Canva AI, AI SEO tools, analytics' },
      { month: 'Month 2', title: 'Campaign Lab', desc: 'Run 3 real campaigns with measurable results' },
      { month: 'Month 3', title: 'Results & Clients', desc: 'Build case studies with ROI data, approach first clients' },
    ],
  },
  {
    id: 'nlp-chatbot-dev',
    title: 'NLP/Chatbot Developer',
    identity: 'The Conversation Designer',
    subtitle: 'You build AI that talks, understands, and connects',
    icon: '💬',
    triggers: { interests: ['tech', 'communication'], personality: ['problem-solver'], goals: ['high-income', 'job-security'] },
    strengths: { technical: 85, creative: 50, analytical: 70, leadership: 30, communication: 70, business: 40 },
    careers: [
      { title: 'NLP Engineer', icon: '💬', whyFits: 'Your tech + communication blend is perfect for language AI', whatYouDo: 'Build chatbots, voice assistants, and text analysis systems', salaryRange: '₹8L - ₹32L/year', demandCountries: 'USA, UK, Canada, Germany' },
      { title: 'Conversational AI Designer', icon: '🗣️', whyFits: 'You understand how humans communicate and can teach AI', whatYouDo: 'Design conversation flows and dialogue systems for AI products', salaryRange: '₹6L - ₹24L/year', demandCountries: 'USA, UK, Singapore' },
    ],
    roadmap: [
      { month: 'Month 1', title: 'NLP Foundations', desc: 'Python, NLP basics, transformer models, API integration' },
      { month: 'Month 2', title: 'Build Chatbots', desc: 'Create 3 chatbots with real use cases (support, sales, FAQ)' },
      { month: 'Month 3', title: 'Deploy & Showcase', desc: 'Live deployment, documentation, and portfolio' },
    ],
  },
  {
    id: 'ai-educator',
    title: 'AI Educator/Trainer',
    identity: 'The Knowledge Multiplier',
    subtitle: 'You empower others by making complex AI concepts simple',
    icon: '🎓',
    triggers: { interests: ['communication', 'creativity'], personality: ['leader', 'creator'], goals: ['impact', 'own-business'] },
    strengths: { technical: 50, creative: 75, analytical: 40, leadership: 85, communication: 95, business: 60 },
    careers: [
      { title: 'AI Educator/Trainer', icon: '🎓', whyFits: 'Your communication + leadership = born educator', whatYouDo: 'Teach AI skills through courses, workshops, and corporate training', salaryRange: '₹4L - ₹20L/year', demandCountries: 'India, USA, UAE, Global Online' },
      { title: 'AI Course Creator', icon: '📚', whyFits: 'You can break down complex topics into engaging lessons', whatYouDo: 'Create and sell online AI courses on platforms like Udemy, YouTube', salaryRange: '₹3L - ₹30L/year (passive)', demandCountries: 'Global (online)' },
    ],
    roadmap: [
      { month: 'Month 1', title: 'Deep AI Knowledge', desc: 'Master 5 AI tools thoroughly enough to teach them' },
      { month: 'Month 2', title: 'Create Content', desc: 'Build a mini-course or YouTube series with 10+ lessons' },
      { month: 'Month 3', title: 'Launch & Grow', desc: 'Launch course, gather testimonials, scale with marketing' },
    ],
  },
  {
    id: 'ai-entrepreneur',
    title: 'AI Entrepreneur',
    identity: 'The Visionary Builder',
    subtitle: 'You see AI as a business opportunity and move fast to capture it',
    icon: '🦄',
    triggers: { interests: ['business', 'tech'], personality: ['leader', 'problem-solver'], goals: ['own-business', 'high-income'] },
    strengths: { technical: 55, creative: 65, analytical: 60, leadership: 90, communication: 70, business: 95 },
    careers: [
      { title: 'AI Startup Founder', icon: '🦄', whyFits: 'Your business drive + tech interest = startup DNA', whatYouDo: 'Build and scale AI-powered products or services', salaryRange: '₹0 - Unlimited', demandCountries: 'Global' },
      { title: 'AI Agency Owner', icon: '🏢', whyFits: 'You can package AI services and sell them at scale', whatYouDo: 'Run an agency offering AI automation, content, or consulting', salaryRange: '₹5L - ₹50L+/year', demandCountries: 'India, USA, UK, Dubai' },
    ],
    roadmap: [
      { month: 'Month 1', title: 'AI Skills + Idea', desc: 'Master key AI tools, validate a business idea' },
      { month: 'Month 2', title: 'MVP & First Sales', desc: 'Build minimum viable product, get first paying customers' },
      { month: 'Month 3', title: 'Scale', desc: 'Systematize delivery, hire or outsource, focus on growth' },
    ],
  },
  {
    id: 'ai-sales',
    title: 'AI Sales & Partnerships',
    identity: 'The Dealmaker',
    subtitle: 'You connect people, products, and AI in ways that generate revenue',
    icon: '🤝',
    triggers: { interests: ['business', 'communication'], personality: ['leader'], goals: ['high-income', 'work-abroad'] },
    strengths: { technical: 25, creative: 40, analytical: 50, leadership: 75, communication: 95, business: 85 },
    careers: [
      { title: 'AI Sales Executive', icon: '🤝', whyFits: 'Your people skills + business understanding = closing power', whatYouDo: 'Sell AI solutions to enterprises and SMBs', salaryRange: '₹6L - ₹30L/year (with commissions)', demandCountries: 'USA, UK, India, UAE' },
      { title: 'AI Partnership Manager', icon: '🔗', whyFits: 'You build relationships that create mutual growth', whatYouDo: 'Manage strategic partnerships between AI companies', salaryRange: '₹8L - ₹28L/year', demandCountries: 'USA, UK, Singapore' },
    ],
    roadmap: [
      { month: 'Month 1', title: 'AI Product Knowledge', desc: 'Understand AI landscape, pricing models, use cases' },
      { month: 'Month 2', title: 'Sales Methodology', desc: 'Learn consultative selling, demo skills, objection handling' },
      { month: 'Month 3', title: 'Pipeline Building', desc: 'Build prospect list, start outreach, close first deals' },
    ],
  },
  {
    id: 'computer-vision',
    title: 'Computer Vision Engineer',
    identity: 'The Visual Intelligence Expert',
    subtitle: 'You teach machines to see and understand the world',
    icon: '👁️',
    triggers: { interests: ['tech', 'analytics'], personality: ['problem-solver', 'analyst'], goals: ['high-income', 'work-abroad', 'job-security'] },
    strengths: { technical: 95, creative: 35, analytical: 90, leadership: 25, communication: 25, business: 20 },
    careers: [
      { title: 'Computer Vision Engineer', icon: '👁️', whyFits: 'Your deep analytical + tech skills are perfect for visual AI', whatYouDo: 'Build image recognition, object detection, and video analysis systems', salaryRange: '₹10L - ₹40L/year', demandCountries: 'USA, Germany, Canada, Japan' },
      { title: 'Robotics AI Engineer', icon: '🤖', whyFits: 'Your problem-solving extends naturally to physical AI systems', whatYouDo: 'Develop AI for autonomous robots, drones, and IoT devices', salaryRange: '₹8L - ₹35L/year', demandCountries: 'USA, Germany, Japan, South Korea' },
    ],
    roadmap: [
      { month: 'Month 1', title: 'Foundations', desc: 'Python, OpenCV, image processing, CNN fundamentals' },
      { month: 'Month 2', title: 'Advanced Models', desc: 'YOLO, segmentation, GANs — hands-on projects' },
      { month: 'Month 3', title: 'Deployment', desc: 'Edge deployment, real-time systems, portfolio + Kaggle' },
    ],
  },
  {
    id: 'ai-ethics',
    title: 'AI Ethics & Policy',
    identity: 'The Responsible Innovator',
    subtitle: 'You ensure AI is built and used for the good of humanity',
    icon: '⚖️',
    triggers: { interests: ['communication', 'analytics'], personality: ['leader', 'analyst'], goals: ['impact', 'job-security'] },
    strengths: { technical: 40, creative: 35, analytical: 75, leadership: 80, communication: 90, business: 55 },
    careers: [
      { title: 'AI Ethics Researcher', icon: '⚖️', whyFits: 'Your analytical mind + desire for impact = ethics champion', whatYouDo: 'Research and advise on responsible AI development practices', salaryRange: '₹6L - ₹25L/year', demandCountries: 'USA, UK, EU, Canada' },
      { title: 'AI Policy Advisor', icon: '📜', whyFits: 'Your communication + leadership = policy influence', whatYouDo: 'Shape government and corporate AI regulations and guidelines', salaryRange: '₹8L - ₹30L/year', demandCountries: 'USA, UK, EU, India' },
    ],
    roadmap: [
      { month: 'Month 1', title: 'AI Foundations', desc: 'Understand AI systems, biases, fairness metrics' },
      { month: 'Month 2', title: 'Policy & Frameworks', desc: 'Study global AI regulations, ethics frameworks' },
      { month: 'Month 3', title: 'Research & Publish', desc: 'Write policy papers, join ethics communities' },
    ],
  },
  {
    id: 'ai-freelancer',
    title: 'AI Freelancer',
    identity: 'The Independent Operator',
    subtitle: 'You use AI to build a location-independent career on your terms',
    icon: '🌴',
    triggers: { interests: ['creativity', 'tech'], personality: ['problem-solver', 'creator'], goals: ['freelancing', 'work-abroad'] },
    strengths: { technical: 60, creative: 75, analytical: 45, leadership: 40, communication: 65, business: 70 },
    careers: [
      { title: 'AI Freelancer', icon: '🌴', whyFits: 'Your independence + multi-skill interest = freelance success', whatYouDo: 'Offer AI services (writing, automation, design) to global clients', salaryRange: '₹3L - ₹25L/year', demandCountries: 'Global (100% remote)' },
      { title: 'AI Virtual Assistant', icon: '🤖', whyFits: 'You can leverage AI to deliver 10x the output of traditional VAs', whatYouDo: 'Provide AI-enhanced virtual assistance to busy professionals', salaryRange: '₹3L - ₹12L/year', demandCountries: 'USA, UK, Australia' },
    ],
    roadmap: [
      { month: 'Month 1', title: 'AI Stack Mastery', desc: 'Master 5-7 AI tools for different service offerings' },
      { month: 'Month 2', title: 'Profile & Proposals', desc: 'Set up Upwork/Fiverr profiles, send 50 proposals' },
      { month: 'Month 3', title: 'Scale & Specialize', desc: 'Land 3-5 clients, find your niche, raise rates' },
    ],
  },
  {
    id: 'ai-healthcare',
    title: 'AI in Healthcare',
    identity: 'The Healing Innovator',
    subtitle: 'You harness AI to transform healthcare and save lives',
    icon: '🏥',
    triggers: { interests: ['tech', 'analytics'], personality: ['analyst', 'problem-solver'], goals: ['impact', 'job-security'] },
    strengths: { technical: 80, creative: 25, analytical: 90, leadership: 45, communication: 40, business: 35 },
    careers: [
      { title: 'Healthcare AI Specialist', icon: '🏥', whyFits: 'Your analytical drive + impact goals = healthcare AI match', whatYouDo: 'Develop AI solutions for diagnostics, drug discovery, patient care', salaryRange: '₹8L - ₹35L/year', demandCountries: 'USA, UK, Germany, India' },
      { title: 'Medical Data Analyst', icon: '🩺', whyFits: 'You find patterns in data that can improve health outcomes', whatYouDo: 'Analyze medical datasets to support clinical decisions', salaryRange: '₹6L - ₹22L/year', demandCountries: 'USA, UK, Canada, Australia' },
    ],
    roadmap: [
      { month: 'Month 1', title: 'AI + Health Basics', desc: 'Python, medical data types, basic ML for healthcare' },
      { month: 'Month 2', title: 'Specialized Projects', desc: 'Image diagnosis, patient outcome prediction projects' },
      { month: 'Month 3', title: 'Certify & Apply', desc: 'Health AI certifications, portfolio, apply to health-tech' },
    ],
  },
]

// ─── Logic Engine ────────────────────────────────────────────────────────────

function computeResult(answers: Answers): CareerResult {
  // Score each archetype based on matches
  const scored = ARCHETYPES.map((arch) => {
    let score = 0

    // Interest matches (weight: 3)
    arch.triggers.interests.forEach((t) => {
      if (answers.interests.includes(t)) score += 3
    })

    // Personality match (weight: 4)
    arch.triggers.personality.forEach((p) => {
      if (answers.personality === p) score += 4
    })

    // Goal matches (weight: 2)
    arch.triggers.goals.forEach((g) => {
      if (answers.goals.includes(g)) score += 2
    })

    // Bonus for work style alignment
    if (answers.workStyle === 'solo' && arch.strengths.technical > 70) score += 1
    if (answers.workStyle === 'team' && arch.strengths.communication > 70) score += 1
    if (answers.workStyle === 'leading' && arch.strengths.leadership > 70) score += 2
    if (answers.workStyle === 'mix' && arch.strengths.creative > 60) score += 1

    // Time commitment bonus
    if (answers.timeCommitment === 'fulltime') score += 1
    if (answers.timeCommitment === '10-20' && arch.strengths.technical > 60) score += 1

    return { archetype: arch, score }
  })

  scored.sort((a, b) => b.score - a.score)
  const best = scored[0].archetype

  // Calculate overall career score
  const maxPossibleScore = 25
  const rawScore = Math.min(scored[0].score, maxPossibleScore)
  const overallScore = Math.round(55 + (rawScore / maxPossibleScore) * 40) // 55-95 range

  // Readiness based on skill level
  const readinessMap: Record<string, number> = { 'beginner': 25, 'some-idea': 48, 'exploring': 72 }
  const readiness = readinessMap[answers.skillLevel] || 30

  // Market fit from career match strength
  const marketFit = Math.round(60 + (rawScore / maxPossibleScore) * 35)

  // Growth potential based on goals + time commitment
  const timeBonus: Record<string, number> = { '2-5': 0, '5-10': 8, '10-20': 15, 'fulltime': 25 }
  const growthPotential = Math.min(98, 65 + (timeBonus[answers.timeCommitment] || 0) + (answers.goals.length * 3))

  // Build strength profile from best archetype
  const strengths = [
    { label: 'Technical', value: best.strengths.technical, color: '#059669' },
    { label: 'Creative', value: best.strengths.creative, color: '#8B5CF6' },
    { label: 'Analytical', value: best.strengths.analytical, color: '#3B82F6' },
    { label: 'Leadership', value: best.strengths.leadership, color: '#F59E0B' },
    { label: 'Communication', value: best.strengths.communication, color: '#EC4899' },
    { label: 'Business', value: best.strengths.business, color: '#0D9488' },
  ]

  return {
    identity: best.identity,
    subtitle: best.subtitle,
    archetypeId: best.id,
    score: overallScore,
    readiness,
    marketFit,
    growthPotential,
    strengths,
    careers: best.careers,
    roadmap: best.roadmap,
    resources: getResources(best.id),
  }
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = (current / total) * 100
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-[#64748B]">Step {current} of {total}</span>
        <span className="text-xs font-semibold text-[#059669]">{Math.round(pct)}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(to right, #059669, #10B981)' }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

function SelectCard({
  selected,
  onClick,
  icon,
  label,
  desc,
  multi,
}: {
  selected: boolean
  onClick: () => void
  icon: string
  label: string
  desc?: string
  multi?: boolean
}) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative w-full rounded-xl border-2 p-4 text-left transition-all duration-200',
        selected
          ? 'border-[#059669] bg-[#F0FDF4] shadow-md shadow-emerald-500/10'
          : 'border-[#E2E8F0] bg-white hover:border-[#059669]/40 hover:shadow-sm'
      )}
      whileTap={{ scale: 0.98 }}
    >
      {multi && (
        <div
          className={cn(
            'absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all',
            selected ? 'border-[#059669] bg-[#059669]' : 'border-[#CBD5E1]'
          )}
        >
          {selected && (
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      )}
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-sm font-semibold text-[#0F172A]">{label}</p>
          {desc && <p className="text-xs text-[#64748B] mt-0.5">{desc}</p>}
        </div>
      </div>
    </motion.button>
  )
}

function RadarChart({ strengths }: { strengths: { label: string; value: number; color: string }[] }) {
  const size = 240
  const center = size / 2
  const radius = 90
  const sides = strengths.length
  const angleStep = (Math.PI * 2) / sides

  function getPoint(index: number, value: number) {
    const angle = angleStep * index - Math.PI / 2
    const r = (value / 100) * radius
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) }
  }

  const dataPoints = strengths.map((s, i) => getPoint(i, s.value))
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z'

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[280px] mx-auto">
      {/* Grid rings */}
      {[25, 50, 75, 100].map((pct) => {
        const points = Array.from({ length: sides }, (_, i) => {
          const p = getPoint(i, pct)
          return `${p.x},${p.y}`
        }).join(' ')
        return (
          <polygon key={pct} points={points} fill="none" stroke="#E2E8F0" strokeWidth={1} opacity={0.6} />
        )
      })}

      {/* Axis lines */}
      {strengths.map((_, i) => {
        const p = getPoint(i, 100)
        return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="#E2E8F0" strokeWidth={1} />
      })}

      {/* Data area */}
      <motion.path
        d={dataPath}
        fill="rgba(5,150,105,0.15)"
        stroke="#059669"
        strokeWidth={2.5}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{ transformOrigin: `${center}px ${center}px` }}
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={4}
          fill={strengths[i].color}
          stroke="white"
          strokeWidth={2}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
        />
      ))}

      {/* Labels */}
      {strengths.map((s, i) => {
        const p = getPoint(i, 125)
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[10px] font-semibold fill-[#475569]"
          >
            {s.label}
          </text>
        )
      })}
    </svg>
  )
}

function CircularScore({ score, label, size = 80, color = '#059669' }: { score: number; label: string; size?: number; color?: string }) {
  const strokeWidth = 6
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E2E8F0" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - score / 100) }}
          transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <motion.span
          className="text-lg font-bold text-[#0F172A]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {score}
        </motion.span>
      </div>
      <span className="text-[10px] font-medium text-[#64748B] text-center leading-tight">{label}</span>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function CareerLab() {
  const [step, setStep] = useState<Step>('hook')
  const [answers, setAnswers] = useState<Answers>({
    status: '',
    interests: [],
    goals: [],
    personality: '',
    skillLevel: '',
    workStyle: '',
    timeCommitment: '',
  })
  const [processingMsg, setProcessingMsg] = useState(0)
  const [result, setResult] = useState<CareerResult | null>(null)
  const [userCount] = useState(() => 4200 + Math.floor(Math.random() * 800))
  const [copied, setCopied] = useState(false)
  const [interviewModalOpen, setInterviewModalOpen] = useState(false)

  const stepOrder: Step[] = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7']
  const currentStepIndex = stepOrder.indexOf(step) + 1
  const totalSteps = stepOrder.length

  const canProceed = useMemo(() => {
    switch (step) {
      case 'q1': return answers.status !== ''
      case 'q2': return answers.interests.length > 0
      case 'q3': return answers.personality !== ''
      case 'q4': return answers.goals.length > 0
      case 'q5': return answers.skillLevel !== ''
      case 'q6': return answers.workStyle !== ''
      case 'q7': return answers.timeCommitment !== ''
      default: return false
    }
  }, [step, answers])

  const goNext = useCallback(() => {
    const idx = stepOrder.indexOf(step)
    if (idx < stepOrder.length - 1) {
      setStep(stepOrder[idx + 1])
    } else {
      // Last step — start processing
      setStep('processing')
    }
  }, [step])

  const goBack = useCallback(() => {
    const idx = stepOrder.indexOf(step)
    if (idx > 0) {
      setStep(stepOrder[idx - 1])
    } else {
      setStep('hook')
    }
  }, [step])

  // Processing animation
  useEffect(() => {
    if (step !== 'processing') return

    let msgIdx = 0
    const interval = setInterval(() => {
      msgIdx++
      if (msgIdx >= PROCESSING_MESSAGES.length) {
        clearInterval(interval)
        const r = computeResult(answers)
        setResult(r)
        setStep('results')
      } else {
        setProcessingMsg(msgIdx)
      }
    }, 400)

    return () => clearInterval(interval)
  }, [step, answers])

  function toggleMulti(field: 'interests' | 'goals', id: string) {
    setAnswers((prev) => {
      const arr = prev[field]
      return {
        ...prev,
        [field]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id],
      }
    })
  }

  function getWhatsAppLink() {
    const careerTitle = result?.careers[0]?.title || 'AI Career'
    const statusLabel = STATUS_OPTIONS.find((s) => s.id === answers.status)?.label || ''
    const msg = encodeURIComponent(
      `Hi, I just used your AI Career Lab.\n\nI'm a ${statusLabel} interested in ${careerTitle}.\nMy Career Score is ${result?.score}/100.\n\nCan you suggest the best course for me?`
    )
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`
  }

  function handleShare() {
    const text = `I just discovered my AI career path: "${result?.identity}"! My Career Score is ${result?.score}/100. Find yours at uplrn.ai/tools/career-lab`
    if (navigator.share) {
      navigator.share({ title: 'My AI Career Path', text }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AnimatePresence mode="wait">

        {/* ── HOOK SCREEN ── */}
        {step === 'hook' && (
          <motion.div
            key="hook"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative overflow-hidden min-h-[90vh] flex items-center justify-center"
            style={{ backgroundColor: '#020617' }}
          >
            {/* Background glow */}
            <div className="absolute inset-0">
              <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[120px]" style={{ background: 'rgba(16,185,129,0.08)' }} />
              <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[100px]" style={{ background: 'rgba(139,92,246,0.06)' }} />
            </div>

            {/* Grid */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)',
              backgroundSize: '50px 50px',
            }} />

            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-emerald-400/30"
                style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
                animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
              />
            ))}

            <div className="relative z-10 max-w-xl mx-auto px-6 py-20 text-center">
              {/* Badge */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 backdrop-blur-sm">
                  <span className="flex h-2 w-2">
                    <span className="absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  {userCount.toLocaleString()} students already discovered their path
                </span>
              </motion.div>

              {/* Neural network icon */}
              <motion.div
                className="mt-8 inline-flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl animate-pulse" style={{ width: 80, height: 80, margin: -8 }} />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-teal-400/20 border border-emerald-400/20">
                    <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h1
                className="mt-8 text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Let AI Analyze Your{' '}
                <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                  Future in 60 Seconds
                </span>
              </motion.h1>

              <motion.p
                className="mt-5 text-lg text-gray-400 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Answer a few questions and get your personalized AI career path,
                strength profile, and 90-day action plan.
              </motion.p>

              {/* Features */}
              <motion.div
                className="mt-6 flex flex-wrap items-center justify-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {['No login required', 'Takes 60 seconds', '15 career paths'].map((f) => (
                  <span key={f} className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] border border-white/10 px-3 py-1.5 text-xs text-gray-400">
                    <span className="text-emerald-400">&#10003;</span> {f}
                  </span>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div
                className="mt-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <button
                  onClick={() => setStep('q1')}
                  className="group relative inline-flex items-center gap-3 rounded-xl px-10 py-4 text-base font-semibold text-black transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #34D399, #059669, #0D9488)',
                    boxShadow: '0 10px 40px rgba(16,185,129,0.35)',
                  }}
                >
                  Start My Career Analysis
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </motion.div>

              <motion.p
                className="mt-5 text-xs text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                Powered by AI Career Intelligence Engine
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* ── QUESTION FLOW ── */}
        {stepOrder.includes(step) && (
          <motion.div
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="min-h-screen flex flex-col"
          >
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-[#E2E8F0] px-6 py-4">
              <div className="max-w-2xl mx-auto">
                <ProgressBar current={currentStepIndex} total={totalSteps} />
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center px-6 py-10">
              <div className="w-full max-w-2xl">

                {/* Q1: Status */}
                {step === 'q1' && (
                  <div>
                    <h2 className="text-2xl font-bold text-[#0F172A]">What describes you best?</h2>
                    <p className="mt-2 text-sm text-[#64748B]">This helps us tailor career paths to your stage in life.</p>
                    <div className="mt-6 grid gap-3">
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectCard
                          key={opt.id}
                          selected={answers.status === opt.id}
                          onClick={() => setAnswers((p) => ({ ...p, status: opt.id }))}
                          icon={opt.icon}
                          label={opt.label}
                          desc={opt.desc}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Q2: Interests */}
                {step === 'q2' && (
                  <div>
                    <h2 className="text-2xl font-bold text-[#0F172A]">What excites you most?</h2>
                    <p className="mt-2 text-sm text-[#64748B]">Select all that apply — pick at least one.</p>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      {INTEREST_OPTIONS.map((opt) => (
                        <SelectCard
                          key={opt.id}
                          selected={answers.interests.includes(opt.id)}
                          onClick={() => toggleMulti('interests', opt.id)}
                          icon={opt.icon}
                          label={opt.label}
                          multi
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Q3: Personality */}
                {step === 'q3' && (
                  <div>
                    <h2 className="text-2xl font-bold text-[#0F172A]">Which sounds more like you?</h2>
                    <p className="mt-2 text-sm text-[#64748B]">Pick the one that resonates most.</p>
                    <div className="mt-6 grid gap-3">
                      {PERSONALITY_OPTIONS.map((opt) => (
                        <SelectCard
                          key={opt.id}
                          selected={answers.personality === opt.id}
                          onClick={() => setAnswers((p) => ({ ...p, personality: opt.id }))}
                          icon={opt.icon}
                          label={opt.label}
                          desc={opt.desc}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Q4: Goals */}
                {step === 'q4' && (
                  <div>
                    <h2 className="text-2xl font-bold text-[#0F172A]">What matters most to you?</h2>
                    <p className="mt-2 text-sm text-[#64748B]">Select all your career goals.</p>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      {GOAL_OPTIONS.map((opt) => (
                        <SelectCard
                          key={opt.id}
                          selected={answers.goals.includes(opt.id)}
                          onClick={() => toggleMulti('goals', opt.id)}
                          icon={opt.icon}
                          label={opt.label}
                          multi
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Q5: Skill Level */}
                {step === 'q5' && (
                  <div>
                    <h2 className="text-2xl font-bold text-[#0F172A]">Where are you on your AI journey?</h2>
                    <p className="mt-2 text-sm text-[#64748B]">Be honest — this helps us set realistic expectations.</p>
                    <div className="mt-6 grid gap-3">
                      {SKILL_OPTIONS.map((opt) => (
                        <SelectCard
                          key={opt.id}
                          selected={answers.skillLevel === opt.id}
                          onClick={() => setAnswers((p) => ({ ...p, skillLevel: opt.id }))}
                          icon={opt.icon}
                          label={opt.label}
                          desc={opt.desc}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Q6: Work Style */}
                {step === 'q6' && (
                  <div>
                    <h2 className="text-2xl font-bold text-[#0F172A]">How do you prefer to work?</h2>
                    <p className="mt-2 text-sm text-[#64748B]">Your work style shapes which AI roles suit you best.</p>
                    <div className="mt-6 grid gap-3">
                      {WORK_STYLE_OPTIONS.map((opt) => (
                        <SelectCard
                          key={opt.id}
                          selected={answers.workStyle === opt.id}
                          onClick={() => setAnswers((p) => ({ ...p, workStyle: opt.id }))}
                          icon={opt.icon}
                          label={opt.label}
                          desc={opt.desc}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Q7: Time Commitment */}
                {step === 'q7' && (
                  <div>
                    <h2 className="text-2xl font-bold text-[#0F172A]">How much time can you invest weekly?</h2>
                    <p className="mt-2 text-sm text-[#64748B]">This helps us build a realistic roadmap for you.</p>
                    <div className="mt-6 grid gap-3">
                      {TIME_OPTIONS.map((opt) => (
                        <SelectCard
                          key={opt.id}
                          selected={answers.timeCommitment === opt.id}
                          onClick={() => setAnswers((p) => ({ ...p, timeCommitment: opt.id }))}
                          icon={opt.icon}
                          label={opt.label}
                          desc={opt.desc}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between">
                  <button
                    onClick={goBack}
                    className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-[#64748B] transition-colors hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  <button
                    onClick={goNext}
                    disabled={!canProceed}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold transition-all duration-200',
                      canProceed
                        ? 'bg-[#059669] text-white shadow-md shadow-emerald-500/20 hover:bg-[#047857] hover:shadow-lg hover:shadow-emerald-500/30'
                        : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
                    )}
                  >
                    {step === 'q7' ? 'Analyze My Career DNA' : 'Continue'}
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── PROCESSING SCREEN ── */}
        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6"
            style={{ backgroundColor: '#020617' }}
          >
            <div className="text-center max-w-md">
              {/* Pulsing brain */}
              <div className="relative mx-auto mb-8">
                <motion.div
                  className="mx-auto h-24 w-24 rounded-full"
                  style={{ background: 'linear-gradient(135deg, rgba(5,150,105,0.3), rgba(139,92,246,0.2))' }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                  </svg>
                </div>
              </div>

              {/* Rotating messages */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={processingMsg}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-lg font-medium text-emerald-300"
                >
                  {PROCESSING_MESSAGES[processingMsg]}
                </motion.p>
              </AnimatePresence>

              {/* Progress bar */}
              <div className="mt-8 mx-auto max-w-xs">
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((processingMsg + 1) / PROCESSING_MESSAGES.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  {Math.round(((processingMsg + 1) / PROCESSING_MESSAGES.length) * 100)}% complete
                </p>
              </div>

              {/* Show actual inputs being processed */}
              <motion.div
                className="mt-8 flex flex-wrap justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {answers.interests.map((i) => (
                  <span key={i} className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-gray-400 capitalize">
                    {i}
                  </span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ── RESULTS SCREEN ── */}
        {step === 'results' && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#F8FAFC]"
          >
            {/* Hero result */}
            <div className="relative overflow-hidden" style={{ backgroundColor: '#020617' }}>
              <div className="absolute inset-0">
                <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px]" style={{ background: 'rgba(16,185,129,0.1)' }} />
              </div>
              <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 text-center">
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-sm text-emerald-300">
                    Your Career DNA is Ready
                  </span>
                </motion.div>

                <motion.h1
                  className="mt-6 text-3xl sm:text-4xl font-bold text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  You are{' '}
                  <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                    {result.identity}
                  </span>
                </motion.h1>
                <motion.p
                  className="mt-3 text-gray-400 text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {result.subtitle}
                </motion.p>

                {/* Overall Career Score */}
                <motion.div
                  className="mt-10 inline-flex items-center gap-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm px-8 py-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="relative">
                    <CircularScore score={result.score} label="Career Score" size={90} color="#34D399" />
                  </div>
                  <div className="h-12 w-px bg-white/10" />
                  <CircularScore score={result.readiness} label="Readiness" size={70} color="#F59E0B" />
                  <CircularScore score={result.marketFit} label="Market Fit" size={70} color="#3B82F6" />
                  <CircularScore score={result.growthPotential} label="Growth" size={70} color="#8B5CF6" />
                </motion.div>

                <motion.p
                  className="mt-4 text-xs text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  You&apos;re in the top {Math.max(5, 100 - result.score + Math.floor(Math.random() * 8))}% of users with this profile
                </motion.p>
              </div>
            </div>

            {/* Results content */}
            <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">

              {/* Career DNA Radar */}
              <motion.section
                className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-lg font-bold text-[#0F172A] mb-6">Your Career DNA</h2>
                <div className="grid sm:grid-cols-2 gap-6 items-center">
                  <RadarChart strengths={result.strengths} />
                  <div className="space-y-3">
                    {result.strengths.map((s) => (
                      <div key={s.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-[#475569]">{s.label}</span>
                          <span className="text-xs font-bold" style={{ color: s.color }}>{s.value}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: s.color }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${s.value}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>

              {/* Top Career Matches */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-lg font-bold text-[#0F172A] mb-4">Top Career Matches For You</h2>
                <div className="grid gap-4">
                  {result.careers.map((career, i) => (
                    <motion.div
                      key={career.title}
                      className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F0FDF4] text-2xl border border-[#D1FAE5]">
                          {career.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h3 className="text-base font-bold text-[#0F172A]">{career.title}</h3>
                            <span className="inline-flex items-center rounded-full bg-[#F0FDF4] border border-[#D1FAE5] px-3 py-1 text-xs font-semibold text-[#059669]">
                              {career.salaryRange}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-[#059669] font-medium">{career.whyFits}</p>
                          <p className="mt-1 text-sm text-[#64748B]">{career.whatYouDo}</p>
                          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#94A3B8]">
                            <span>In demand:</span>
                            <span className="font-medium text-[#64748B]">{career.demandCountries}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* 90-Day Roadmap */}
              <motion.section
                className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-lg font-bold text-[#0F172A] mb-6">Your 90-Day Roadmap</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {result.roadmap.map((r, i) => (
                    <div key={r.month} className="relative rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#059669] text-[11px] font-bold text-white">
                          {i + 1}
                        </span>
                        <span className="text-sm font-bold text-[#0F172A]">{r.month}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-[#059669]">{r.title}</h3>
                      <p className="mt-1 text-xs text-[#64748B] leading-relaxed">{r.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* ── WEEK-BY-WEEK LEARNING PLAN ── */}
              <motion.section
                className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-bold text-[#0F172A]">Your Weekly Learning Plan</h2>
                  <span className="rounded-full bg-[#F0FDF4] border border-[#D1FAE5] px-3 py-1 text-xs font-semibold text-[#059669]">
                    {TIME_OPTIONS.find(t => t.id === answers.timeCommitment)?.label || ''}/week
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mb-6">Personalized based on your available time. Each week builds on the last.</p>
                <div className="space-y-4">
                  {(result.resources.weeklyPlan[answers.timeCommitment] || result.resources.weeklyPlan['5-10'] || []).map((wp, i) => (
                    <div key={wp.week} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#059669] text-[10px] font-bold text-white">{i + 1}</span>
                        <span className="text-sm font-bold text-[#0F172A]">{wp.week}</span>
                      </div>
                      <ul className="space-y-1.5 mb-3">
                        {wp.tasks.map((task, j) => (
                          <li key={j} className="flex items-start gap-2 text-xs text-[#475569]">
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-[#CBD5E1] bg-white text-[8px] text-[#94A3B8]">{j + 1}</span>
                            {task}
                          </li>
                        ))}
                      </ul>
                      <div className="rounded-lg bg-[#F0FDF4] border border-[#D1FAE5] px-3 py-2">
                        <p className="text-[10px] font-semibold text-[#059669]">Milestone: {wp.milestone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* ── FREE RESOURCES ── */}
              <motion.section
                className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-lg font-bold text-[#0F172A] mb-1">Free Resources to Start Today</h2>
                <p className="text-xs text-[#64748B] mb-5">Curated specifically for your career path. All free or free-to-audit.</p>
                <div className="grid gap-3">
                  {result.resources.freeResources.map((res) => (
                    <a
                      key={res.title}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 transition-all hover:border-[#059669]/40 hover:shadow-sm"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white border border-[#E2E8F0] text-sm">
                        {res.type === 'youtube' ? '🎥' : res.type === 'course' ? '📚' : res.type === 'tool' ? '🔧' : res.type === 'book' ? '📖' : '🌐'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0F172A] group-hover:text-[#059669] transition-colors">{res.title}</p>
                        <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{res.desc}</p>
                      </div>
                      <svg className="h-4 w-4 shrink-0 mt-1 text-[#94A3B8] group-hover:text-[#059669] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </motion.section>

              {/* ── TOOLS TO LEARN ── */}
              <motion.section
                className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-lg font-bold text-[#0F172A] mb-1">Tools You Need to Learn</h2>
                <p className="text-xs text-[#64748B] mb-5">Learn them in order — essential first, then level up.</p>
                {(['essential', 'intermediate', 'advanced'] as const).map((cat) => {
                  const tools = result.resources.toolsToLearn.filter(t => t.category === cat)
                  if (tools.length === 0) return null
                  return (
                    <div key={cat} className="mb-4 last:mb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn(
                          'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                          cat === 'essential' ? 'bg-[#F0FDF4] text-[#059669] border border-[#D1FAE5]' :
                          cat === 'intermediate' ? 'bg-[#EFF6FF] text-[#3B82F6] border border-[#BFDBFE]' :
                          'bg-[#FAF5FF] text-[#8B5CF6] border border-[#E9D5FF]'
                        )}>
                          {cat}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {tools.map((tool) => (
                          <a
                            key={tool.name}
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 transition-all hover:border-[#059669]/40 hover:shadow-sm"
                          >
                            <span className="text-sm font-medium text-[#0F172A] truncate">{tool.name}</span>
                            {tool.free && (
                              <span className="shrink-0 rounded bg-[#F0FDF4] px-1.5 py-0.5 text-[9px] font-bold text-[#059669]">FREE</span>
                            )}
                          </a>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </motion.section>

              {/* ── PORTFOLIO PROJECTS ── */}
              <motion.section
                className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-lg font-bold text-[#0F172A] mb-1">Portfolio Project Ideas</h2>
                <p className="text-xs text-[#64748B] mb-5">Build these to prove your skills. Each one is a talking point in interviews.</p>
                <div className="space-y-3">
                  {result.resources.portfolioProjects.map((project, i) => (
                    <div key={project.title} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#059669] text-xs font-bold text-white mt-0.5">{i + 1}</span>
                          <div>
                            <p className="text-sm font-semibold text-[#0F172A]">{project.title}</p>
                            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{project.desc}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3 ml-10">
                        <span className={cn(
                          'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                          project.difficulty === 'beginner' ? 'bg-[#F0FDF4] text-[#059669]' :
                          project.difficulty === 'intermediate' ? 'bg-[#EFF6FF] text-[#3B82F6]' :
                          'bg-[#FAF5FF] text-[#8B5CF6]'
                        )}>
                          {project.difficulty}
                        </span>
                        <span className="text-[10px] text-[#94A3B8]">{project.timeEstimate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* ── CERTIFICATIONS ── */}
              <motion.section
                className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-lg font-bold text-[#0F172A] mb-1">Certifications That Actually Matter</h2>
                <p className="text-xs text-[#64748B] mb-5">Not all certs are equal. These are the ones employers and clients actually recognize.</p>
                <div className="space-y-3">
                  {result.resources.certifications.map((cert) => (
                    <a
                      key={cert.name}
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 transition-all hover:border-[#059669]/40 hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#0F172A] group-hover:text-[#059669] transition-colors">{cert.name}</p>
                          <p className="text-xs text-[#64748B] mt-0.5">{cert.provider}</p>
                        </div>
                        <span className={cn(
                          'shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold',
                          cert.cost === 'Free' || cert.cost.includes('Free')
                            ? 'bg-[#F0FDF4] text-[#059669] border border-[#D1FAE5]'
                            : 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                        )}>
                          {cert.cost}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-[#059669] font-medium">{cert.worth}</p>
                    </a>
                  ))}
                </div>
              </motion.section>

              {/* ── INTERVIEW QUESTIONS ── */}
              <motion.section
                className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-bold text-[#0F172A]">Interview Questions to Prepare</h2>
                  <button
                    onClick={() => setInterviewModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #059669, #0D9488)', boxShadow: '0 4px 15px rgba(5,150,105,0.25)' }}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    Practice with AI Coach
                  </button>
                </div>
                <p className="text-xs text-[#64748B] mb-5">Real questions asked in interviews for this career path. Practice answering each one.</p>
                <div className="space-y-2">
                  {result.resources.interviewQuestions.map((q, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-[9px] font-bold text-white mt-0.5">Q{i + 1}</span>
                      <p className="text-sm text-[#0F172A] leading-relaxed">{q}</p>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* ── JOB PLATFORMS ── */}
              <motion.section
                className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-lg font-bold text-[#0F172A] mb-1">Where to Find Jobs & Clients</h2>
                <p className="text-xs text-[#64748B] mb-5">Don&apos;t just apply randomly. These platforms are best for your specific career path.</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {result.resources.jobPlatforms.map((platform) => (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 transition-all hover:border-[#059669]/40 hover:shadow-sm"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#0F172A] group-hover:text-[#059669] transition-colors">{platform.name}</p>
                        <p className="text-xs text-[#64748B] mt-0.5">{platform.bestFor}</p>
                      </div>
                      <svg className="h-4 w-4 shrink-0 text-[#94A3B8] group-hover:text-[#059669] transition-colors mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </motion.section>

              {/* ── SKILL CHECKLIST ── */}
              <motion.section
                className="rounded-2xl border border-[#059669]/20 bg-gradient-to-b from-[#F0FDF4] to-white p-6 sm:p-8 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-lg font-bold text-[#0F172A] mb-1">Skills Checklist</h2>
                <p className="text-xs text-[#64748B] mb-5">Track your progress. Check off each skill as you learn it. Screenshot this and revisit monthly.</p>
                <div className="space-y-2">
                  {result.resources.skillChecklist.map((skill, i) => (
                    <label key={i} className="flex items-center gap-3 rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 cursor-pointer hover:bg-[#F8FAFC] transition-colors">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-[#CBD5E1] text-[#059669] focus:ring-[#059669]/20 accent-[#059669]"
                      />
                      <span className="text-sm text-[#0F172A]">{skill}</span>
                    </label>
                  ))}
                </div>
              </motion.section>

              {/* Global Opportunity + Parent Insight + Reality Check */}
              <div className="grid sm:grid-cols-3 gap-4">
                <motion.div
                  className="rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] p-5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0 }}
                >
                  <span className="text-2xl">🌍</span>
                  <h3 className="mt-2 text-sm font-bold text-[#1E40AF]">Global Opportunity</h3>
                  <p className="mt-1 text-xs text-[#3B82F6] leading-relaxed">
                    This skill is in high demand in Australia, UK, Canada, USA, and the Middle East. Remote opportunities are growing 40% year-on-year.
                  </p>
                </motion.div>

                <motion.div
                  className="rounded-2xl border border-[#D1FAE5] bg-[#F0FDF4] p-5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-2xl">👨‍👩‍👧</span>
                  <h3 className="mt-2 text-sm font-bold text-[#065F46]">Parent Insight</h3>
                  <p className="mt-1 text-xs text-[#059669] leading-relaxed">
                    This path offers strong career stability, above-average salaries, and global mobility. AI skills add value to any traditional degree.
                  </p>
                </motion.div>

                <motion.div
                  className="rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] p-5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-2xl">&#9888;&#65039;</span>
                  <h3 className="mt-2 text-sm font-bold text-[#92400E]">Reality Check</h3>
                  <p className="mt-1 text-xs text-[#B45309] leading-relaxed">
                    Without AI skills, many traditional career paths face disruption. The window to build expertise is now — early movers have the biggest advantage.
                  </p>
                </motion.div>
              </div>

              {/* Salary Trajectory */}
              <motion.section
                className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-lg font-bold text-[#0F172A] mb-1">Salary Growth Trajectory</h2>
                <p className="text-xs text-[#64748B] mb-6">Projected earnings with dedicated AI skill development</p>
                <div className="flex items-end justify-between gap-4" style={{ height: 180 }}>
                  {[
                    { year: 'Year 1', amount: '₹4-8L', px: 48, color: '#D1FAE5' },
                    { year: 'Year 2', amount: '₹8-15L', px: 80, color: '#A7F3D0' },
                    { year: 'Year 3', amount: '₹12-22L', px: 104, color: '#6EE7B7' },
                    { year: 'Year 5', amount: '₹18-35L', px: 136, color: '#34D399' },
                    { year: 'Year 7+', amount: '₹25-50L+', px: 160, color: '#059669' },
                  ].map((bar, i) => (
                    <div key={bar.year} className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
                      <span className="text-[10px] font-bold text-[#059669]">{bar.amount}</span>
                      <motion.div
                        className="w-full rounded-t-lg"
                        style={{ backgroundColor: bar.color, minWidth: 4 }}
                        initial={{ height: 0 }}
                        whileInView={{ height: bar.px }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                      />
                      <span className="text-[10px] font-medium text-[#64748B]">{bar.year}</span>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Success Stories */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-lg font-bold text-[#0F172A] mb-4">People Like You</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { name: 'Rahul, 22', from: 'BCA Student', to: 'AI Analyst at TCS', time: '8 months', avatar: '👨‍💻' },
                    { name: 'Priya, 26', from: 'Marketing Exec', to: 'AI Marketing Lead', time: '6 months', avatar: '👩‍💼' },
                    { name: 'Ankit, 30', from: 'Teacher', to: 'AI Course Creator', time: '10 months', avatar: '👨‍🏫' },
                  ].map((story) => (
                    <div key={story.name} className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0FDF4] text-xl">{story.avatar}</span>
                        <div>
                          <p className="text-sm font-bold text-[#0F172A]">{story.name}</p>
                          <p className="text-[10px] text-[#64748B]">{story.from}</p>
                        </div>
                      </div>
                      <p className="text-xs text-[#475569]">
                        Now: <span className="font-semibold text-[#059669]">{story.to}</span>
                      </p>
                      <p className="text-[10px] text-[#94A3B8] mt-1">Transformed in {story.time}</p>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* ── CONVERSION LAYER ── */}
              <motion.section
                className="rounded-2xl bg-[#0F172A] p-8 sm:p-10 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-sm text-emerald-300 mb-4">
                  Your personalized plan is ready
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Want Your Complete<br />
                  <span className="text-emerald-300">Roadmap + Course Plan?</span>
                </h2>
                <p className="mt-3 text-sm text-gray-400 max-w-lg mx-auto">
                  Talk to our AI career advisor and get a step-by-step plan customized for your profile, budget, and timeline.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  {/* Primary CTA: WhatsApp */}
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 rounded-xl px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
                    style={{ background: '#25D366', boxShadow: '0 8px 30px rgba(37,211,102,0.3)' }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Get My Plan on WhatsApp
                  </a>

                  {/* Secondary: Share */}
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-white/10"
                  >
                    {copied ? '✓ Link Copied!' : 'Share My Result'}
                  </button>
                </div>

                {/* Retake */}
                <button
                  onClick={() => {
                    setStep('hook')
                    setAnswers({ status: '', interests: [], goals: [], personality: '', skillLevel: '', workStyle: '', timeCommitment: '' })
                    setResult(null)
                  }}
                  className="mt-6 text-xs text-gray-500 hover:text-gray-300 transition-colors underline underline-offset-2"
                >
                  Retake the quiz with different answers
                </button>
              </motion.section>

              {/* Live counter */}
              <div className="text-center py-4">
                <p className="text-xs text-[#94A3B8]">
                  <motion.span
                    className="font-semibold text-[#059669]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {userCount.toLocaleString()}
                  </motion.span>{' '}
                  students have found their AI career path with this tool
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interview Prep Modal */}
      {result && (
        <InterviewPrepModal
          open={interviewModalOpen}
          onClose={() => setInterviewModalOpen(false)}
          careerPath={result.careers[0]?.title || 'AI Career'}
          identity={result.identity}
        />
      )}
    </div>
  )
}
