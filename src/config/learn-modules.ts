export interface LearnModule {
  session: number;
  title: string;
  description: string;
  week: number;
  tools: string[];
  isFree: boolean;
}

export const learnModules: LearnModule[] = [
  { session: 1, title: 'What is AI?', description: 'Understand AI, meet ChatGPT, Claude & Gemini', week: 1, tools: ['ChatGPT', 'Claude', 'Gemini'], isFree: true },
  { session: 2, title: 'The AI Mindset', description: 'Ethics, careers, and the right approach to AI', week: 1, tools: [], isFree: false },
  { session: 3, title: 'Prompt Engineering Basics', description: 'The RCTF framework for better AI outputs', week: 1, tools: ['ChatGPT', 'Claude'], isFree: false },
  { session: 4, title: 'Advanced Prompting', description: 'Chain-of-thought, few-shot, and prompt libraries', week: 1, tools: ['ChatGPT', 'Claude', 'Gemini'], isFree: false },
  { session: 5, title: 'Mastering ChatGPT & Claude', description: 'Deep dive into the two most powerful AI tools', week: 2, tools: ['ChatGPT', 'Claude'], isFree: false },
  { session: 6, title: 'AI for Professional Writing', description: 'Emails, resumes, proposals with AI', week: 2, tools: ['ChatGPT', 'Claude'], isFree: false },
  { session: 7, title: 'AI Research Tools', description: 'Perplexity and NotebookLM for deep research', week: 2, tools: ['Perplexity', 'NotebookLM'], isFree: false },
  { session: 8, title: 'Presentations & Design', description: 'Gamma and Canva AI for visual content', week: 2, tools: ['Gamma', 'Canva AI'], isFree: false },
  { session: 9, title: 'AI Image Generation', description: 'Midjourney, Ideogram, and Canva AI for images', week: 3, tools: ['Midjourney', 'Ideogram', 'Canva AI'], isFree: false },
  { session: 10, title: 'AI Video Creation', description: 'HeyGen avatars and CapCut editing', week: 3, tools: ['HeyGen', 'CapCut'], isFree: false },
  { session: 11, title: 'AI Audio + Social Media', description: 'ElevenLabs voiceovers and content workflows', week: 3, tools: ['ElevenLabs'], isFree: false },
  { session: 12, title: 'Brand Kit Project', description: 'Create a complete brand identity with AI', week: 3, tools: ['All tools'], isFree: false },
  { session: 13, title: 'No-Code Website Building', description: 'Build websites with Bolt.new', week: 4, tools: ['Bolt.new'], isFree: false },
  { session: 14, title: 'Capstone Project', description: 'Real client brief — deliver a complete solution', week: 4, tools: ['All tools'], isFree: false },
  { session: 15, title: 'Portfolio & Presentations', description: 'Assemble portfolio and practice presenting', week: 4, tools: ['Bolt.new', 'Gamma'], isFree: false },
  { session: 16, title: 'Freelancing + Certification', description: 'Launch your career and earn your certificate', week: 4, tools: [], isFree: false },
];
