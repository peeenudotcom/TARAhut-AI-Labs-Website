// TARA's "AI-optimized" session brain for the 16-session AI Tools
// Mastery course. This layer is SEPARATE from the canonical
// courses.ts syllabus on purpose: the website UI (Pulse Path, course
// pages) reads from courses.ts; TARA reads from this file, which is
// enriched with semantic tags, tools, outcomes, and sprint-level
// goals so she can answer intent-based questions like
// "which session helps me save time on social media?"
//
// When the human team wants to tune TARA's session recommendations
// without touching the public syllabus, they edit this file.

export type Sprint = 'Genesis' | 'Architect' | 'Developer' | 'Master';

export interface SemanticSession {
  id: number; // 1..16
  sprint: Sprint;
  sprintGoal: string;
  title: string;
  tools: string[];
  tags: string[]; // intent keywords TARA can match against user queries
  outcome: string; // the "after this session you can…" result
  canUnlockFree: boolean;
}

export const SPRINT_GOALS: Record<Sprint, string> = {
  Genesis: 'Master the Logic of LLMs.',
  Architect: 'Visual & Content Production.',
  Developer: 'Video & Voice Production.',
  Master: 'Agents & Career Launch.',
};

export const SEMANTIC_SESSIONS: SemanticSession[] = [
  // ── SPRINT 01: GENESIS ──────────────────────────────────
  {
    id: 1,
    sprint: 'Genesis',
    sprintGoal: SPRINT_GOALS.Genesis,
    title: 'The AI Lab Setup',
    tools: ['ChatGPT-4o', 'Claude 3.5', 'Gemini'],
    tags: ['beginner', 'setup', 'getting-started', 'accounts', 'workstation'],
    outcome: 'Professional AI environment ready.',
    canUnlockFree: true,
  },
  {
    id: 2,
    sprint: 'Genesis',
    sprintGoal: SPRINT_GOALS.Genesis,
    title: 'Prompt Engineering Genesis',
    tools: ['ChatGPT', 'Claude'],
    tags: ['prompting', 'role-context-task', 'foundations', 'better-outputs'],
    outcome: '10× better outputs than the average user.',
    canUnlockFree: false,
  },
  {
    id: 3,
    sprint: 'Genesis',
    sprintGoal: SPRINT_GOALS.Genesis,
    title: 'Advanced Reasoning',
    tools: ['Claude', 'ChatGPT'],
    tags: ['chain-of-thought', 'xml-tagging', 'reasoning', 'business-problems', 'logic'],
    outcome: 'Zero-error logic for complex business problems.',
    canUnlockFree: false,
  },
  {
    id: 4,
    sprint: 'Genesis',
    sprintGoal: SPRINT_GOALS.Genesis,
    title: 'Research & Long Context',
    tools: ['Perplexity', 'Claude Projects', 'NotebookLM'],
    tags: ['research', 'long-documents', 'pdf-analysis', 'summarization', 'reports'],
    outcome: 'Analyze 500+ page PDFs in seconds.',
    canUnlockFree: false,
  },

  // ── SPRINT 02: ARCHITECT ────────────────────────────────
  {
    id: 5,
    sprint: 'Architect',
    sprintGoal: SPRINT_GOALS.Architect,
    title: 'Midjourney v6 Mastery',
    tools: ['Midjourney v6'],
    tags: ['image', 'art', 'branding', 'logo', 'photorealistic', 'ui-mockup', 'design'],
    outcome: 'Professional graphic design without a designer.',
    canUnlockFree: false,
  },
  {
    id: 6,
    sprint: 'Architect',
    sprintGoal: SPRINT_GOALS.Architect,
    title: 'Canva AI Integration',
    tools: ['Canva AI'],
    tags: ['social-media', 'instagram', 'content-calendar', 'posts', 'design', 'layouts', 'save-time'],
    outcome: '30 days of content in 60 minutes.',
    canUnlockFree: false,
  },
  {
    id: 7,
    sprint: 'Architect',
    sprintGoal: SPRINT_GOALS.Architect,
    title: 'Presentation Mastery (Gamma)',
    tools: ['Gamma'],
    tags: ['pitch-deck', 'investor-deck', 'landing-page', 'prototype', 'client-presentation', 'sales'],
    outcome: 'High-impact visuals for clients.',
    canUnlockFree: false,
  },
  {
    id: 8,
    sprint: 'Architect',
    sprintGoal: SPRINT_GOALS.Architect,
    title: 'Ideogram & Typography',
    tools: ['Ideogram'],
    tags: ['typography', 'packaging', 'brand-kit', 'text-to-image', 'branding'],
    outcome: 'Professional packaging and brand kits.',
    canUnlockFree: false,
  },

  // ── SPRINT 03: DEVELOPER ────────────────────────────────
  {
    id: 9,
    sprint: 'Developer',
    sprintGoal: SPRINT_GOALS.Developer,
    title: 'ElevenLabs Mastery',
    tools: ['ElevenLabs'],
    tags: ['voice-cloning', 'voiceover', 'narration', 'ads', 'audio', 'hindi-punjabi-voice'],
    outcome: 'Professional voiceovers for ads.',
    canUnlockFree: false,
  },
  {
    id: 10,
    sprint: 'Developer',
    sprintGoal: SPRINT_GOALS.Developer,
    title: 'HeyGen & AI Avatars',
    tools: ['HeyGen'],
    tags: ['avatar', 'ai-clone', 'talking-head', 'faceless-marketing', 'youtube', 'instagram-reels'],
    outcome: 'Faceless marketing for YouTube/Instagram.',
    canUnlockFree: false,
  },
  {
    id: 11,
    sprint: 'Developer',
    sprintGoal: SPRINT_GOALS.Developer,
    title: 'AI Video Editing',
    tools: ['Descript', 'CapCut AI'],
    tags: ['video-editing', 'editing-workflow', 'automation', 'cuts', 'captions'],
    outcome: 'Automating the video editing workflow.',
    canUnlockFree: false,
  },
  {
    id: 12,
    sprint: 'Developer',
    sprintGoal: SPRINT_GOALS.Developer,
    title: 'Generative Video (Sora / Luma)',
    tools: ['Sora', 'Luma'],
    tags: ['video-generation', 'text-to-video', 'cinematic', 'ads', 'high-end-video'],
    outcome: 'High-end video production at zero cost.',
    canUnlockFree: false,
  },

  // ── SPRINT 04: MASTER ───────────────────────────────────
  {
    id: 13,
    sprint: 'Master',
    sprintGoal: SPRINT_GOALS.Master,
    title: 'Custom GPTs & Assistants',
    tools: ['Custom GPTs', 'Claude Projects'],
    tags: ['custom-gpt', 'chatbot', 'ai-assistant', 'business-bot', 'personalized-ai'],
    outcome: 'Personalized AI bots for business tasks.',
    canUnlockFree: false,
  },
  {
    id: 14,
    sprint: 'Master',
    sprintGoal: SPRINT_GOALS.Master,
    title: 'AI Workflows (Zapier / Make)',
    tools: ['Zapier', 'Make.com'],
    tags: ['automation', 'workflow', 'no-code', 'save-time', 'business-ops', 'leads'],
    outcome: 'Systems that work while you sleep.',
    canUnlockFree: false,
  },
  {
    id: 15,
    sprint: 'Master',
    sprintGoal: SPRINT_GOALS.Master,
    title: 'No-Code AI Deployment',
    tools: ['Bolt.new', 'Lovable', 'v0'],
    tags: ['no-code', 'web-app', 'saas', 'deploy', 'ship', 'startup'],
    outcome: 'Ready to launch a SaaS product.',
    canUnlockFree: false,
  },
  {
    id: 16,
    sprint: 'Master',
    sprintGoal: SPRINT_GOALS.Master,
    title: 'The Graduation Project',
    tools: ['All stack'],
    tags: ['capstone', 'real-client', 'punjab-business', 'certification', 'portfolio', 'career-launch'],
    outcome: 'Certification and career launchpad.',
    canUnlockFree: false,
  },
];

// Render the semantic sessions as a human-readable block for the
// knowledge base. Keeping the formatting tight so the system prompt
// stays within token budgets.
export function renderSemanticSessions(): string {
  const bySprint: Record<Sprint, SemanticSession[]> = {
    Genesis: [],
    Architect: [],
    Developer: [],
    Master: [],
  };
  SEMANTIC_SESSIONS.forEach((s) => bySprint[s.sprint].push(s));

  const sprintOrder: Sprint[] = ['Genesis', 'Architect', 'Developer', 'Master'];
  const lines: string[] = [
    '# AI TOOLS MASTERY — 16-SESSION SEMANTIC MAP',
    '',
    'This is the enriched session map for the flagship **AI Tools Mastery** course — use this when a user asks intent questions like "which session teaches me X" or "what do I learn to save time on Y?". Match on the `tags` to find the right session, not just the title.',
    '',
  ];

  sprintOrder.forEach((sprint, i) => {
    const num = String(i + 1).padStart(2, '0');
    lines.push(`## SPRINT ${num}: ${sprint.toUpperCase()} (Sessions ${bySprint[sprint][0].id}-${bySprint[sprint][bySprint[sprint].length - 1].id})`);
    lines.push(`_Goal: ${SPRINT_GOALS[sprint]}_`);
    lines.push('');
    bySprint[sprint].forEach((s) => {
      const free = s.canUnlockFree ? ' **[FREE UNLOCK SESSION]**' : '';
      lines.push(
        `- **Session ${String(s.id).padStart(2, '0')} · ${s.title}** — Tools: ${s.tools.join(', ')} · Tags: ${s.tags.join(', ')} · Outcome: _${s.outcome}_${free}`
      );
    });
    lines.push('');
  });

  return lines.join('\n');
}
