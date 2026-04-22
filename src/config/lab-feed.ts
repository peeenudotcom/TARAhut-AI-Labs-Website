// Lab Feed — the "proof surface" for TARAhut courses. Real outputs
// from real students so prospective learners can see what the 16
// sessions actually produce. Authored here as a typed TS file for
// now; swap for a Supabase table when students start submitting their
// own work through a form.
//
// The newest entry (by `createdAt`) automatically gets the red
// "RECENT BUILD" pulse on the bento grid so the feed feels alive
// without a CMS. Category drives the filter pills at the top of
// /lab-feed; `reveal` powers the hover-to-see-the-prompt panel —
// the signature interaction that turns the gallery into a teaching
// tool.

export type LabFeedCategory = 'ai-art' | 'video' | 'automation' | 'other';

export interface LabFeedTile {
  id: string;
  session: number; // → "SESSION 05"
  techTag?: string; // secondary tag — "Midjourney v6", "Make.com"
  category: LabFeedCategory; // drives filter pills
  courseSlug?: string; // optional back-link into /courses/[slug]
  title: string;
  studentMeta: string; // "By Arsh S. · Batch 08"
  createdAt: string; // ISO — newest wins the RECENT BUILD pulse
  span: 'large' | 'wide' | 'default'; // bento tile size

  // Media discriminator
  kind: 'image' | 'code';

  // image-only
  src?: string;
  alt?: string;

  // code-only — faded monospace background layer + optional quote
  codeSnippet?: string;
  quote?: string;

  // Hover-reveal panel — the signature interaction. When present,
  // hovering the tile slides up an emerald panel showing the prompt,
  // workflow, or strategy behind the project. The label is the
  // eyebrow (e.g., "PROMPT STRATEGY", "THE WORKFLOW") and the body
  // is the actual teaching moment.
  reveal?: {
    label: string;
    body: string;
  };
}

export const labFeed: LabFeedTile[] = [
  {
    id: 'cyberpunk-amritsar',
    session: 5,
    techTag: 'Midjourney v6',
    category: 'ai-art',
    courseSlug: 'ai-tools-mastery-beginners',
    title: 'Cyberpunk Amritsar — concept series',
    studentMeta: 'By Arsh S. · Batch 01',
    createdAt: '2026-04-20',
    span: 'large',
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1675271591211-126ad94e495d?auto=format&fit=crop&q=80&w=1000',
    alt: 'AI-generated cyberpunk reimagining of the Golden Temple at night',
    reveal: {
      label: 'Prompt Strategy',
      body: '"Cinematic wide shot, futuristic Amritsar at night, emerald neon lighting, rain reflections, flying transport, ultra-realistic, 8k, shallow depth of field --v 6.0 --ar 16:9"',
    },
  },
  {
    id: 'melt-in-joy-website',
    session: 13,
    techTag: 'Bolt.new',
    category: 'automation',
    courseSlug: 'master-ai-builder',
    title: 'Melt in Joy — dessert brand website',
    studentMeta: 'By Jashandeep · Kotkapura Lab',
    createdAt: '2026-04-19',
    span: 'default',
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&q=80&w=1000',
    alt: 'Melt in Joy dessert brand website homepage',
    reveal: {
      label: 'The Workflow',
      body: '1. Bolt.new spec prompt · 2. Tailwind + stock imagery · 3. Razorpay cart wired in · 4. Deployed to Vercel in 90 min',
    },
  },
  {
    id: 'local-biz-rebrand',
    session: 6,
    techTag: 'Canva AI',
    category: 'ai-art',
    courseSlug: 'ai-tools-mastery-beginners',
    title: 'Local biz rebrand — Kotkapura dhaba',
    studentMeta: 'By Preet · Kotkapura Lab',
    createdAt: '2026-04-18',
    span: 'default',
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=600',
    alt: 'Brand identity system for a local Punjabi dhaba',
    reveal: {
      label: 'The Brief',
      body: 'Primary mark + monochrome variant + takeaway-box mockup. Emerald + saffron palette, Gurmukhi + English wordmarks. Delivered in 90 min.',
    },
  },
  {
    id: 'lawyer-auto-responder',
    session: 14,
    techTag: 'Make.com',
    category: 'automation',
    courseSlug: 'master-ai-builder',
    title: "Lawyer's auto-responder",
    studentMeta: 'By Manpreet S. · Online',
    quote:
      'Automated 200+ daily client emails for a firm in Ludhiana — replies drafted in Punjabi, English, and Hindi.',
    createdAt: '2026-04-17',
    span: 'wide',
    kind: 'code',
    codeSnippet:
      '{ "trigger": "new_email", "action": "claude_3.5_analyze", "output": "draft_reply", "route": "lawyer.inbox" }',
    reveal: {
      label: 'Time Saved',
      body: '~45 min per email × 200 emails/day = 150 hours/week reclaimed. Replies still land in the lawyer\'s inbox for one-click send.',
    },
  },
  {
    id: 'property-consultant-ad',
    session: 10,
    techTag: 'HeyGen Avatars',
    category: 'video',
    courseSlug: 'ai-power-8-week-program',
    title: 'AI property consultant — 90s Punjabi ad',
    studentMeta: 'By Gurbir Singh · Master AI Builder',
    createdAt: '2026-04-15',
    span: 'wide',
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
    alt: 'Still from an AI avatar video explaining a real-estate project',
    reveal: {
      label: 'The Workflow',
      body: '1. Script written with Claude · 2. Hindi voice cloned in ElevenLabs · 3. Avatar synced in HeyGen · 4. WhatsApp lead capture on CTA click',
    },
  },
  {
    id: 'health-diagnostic-bot',
    session: 13,
    techTag: 'Custom GPTs',
    category: 'automation',
    courseSlug: 'master-ai-builder',
    title: 'Clinic triage bot — Hindi + English',
    studentMeta: 'By Dr. Amit · Online Batch',
    createdAt: '2026-04-14',
    span: 'default',
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=500',
    alt: 'Custom GPT interface triaging patient symptoms',
    reveal: {
      label: 'System Prompt',
      body: 'Role: clinic-triage assistant. Ingest symptoms, flag red-flags, output 3 next-step options with urgency tier (green/amber/red). Never diagnose.',
    },
  },
  {
    id: 'boutique-social-calendar',
    session: 6,
    techTag: 'Canva AI',
    category: 'ai-art',
    courseSlug: 'ai-tools-mastery-beginners',
    title: '30-day Instagram calendar · boutique',
    studentMeta: 'By Simran D. · Kotkapura Lab',
    createdAt: '2026-04-13',
    span: 'default',
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&q=80&w=500',
    alt: 'Instagram grid for a fashion boutique',
    reveal: {
      label: 'The Brief',
      body: '30 posts · 12 reels + 12 carousels + 6 stories. Colour palette pulled from the brand logo via Canva AI. Shipped in < 2 hours.',
    },
  },
  {
    id: 'zapier-lead-router',
    session: 14,
    techTag: 'Zapier',
    category: 'automation',
    courseSlug: 'master-ai-builder',
    title: 'Lead-routing pipeline · tuition centre',
    studentMeta: 'By Vikram B. · Online',
    quote:
      'Form → Airtable → ChatGPT classifier → WhatsApp to the right teacher. Zero humans in the loop.',
    createdAt: '2026-04-11',
    span: 'wide',
    kind: 'code',
    codeSnippet:
      'form.submit → airtable.create → gpt.classify(subject, grade) → branch → whatsapp.send(teacher)',
    reveal: {
      label: 'The Workflow',
      body: '1. Google Form · 2. Airtable row · 3. GPT intent classifier (subject + grade) · 4. Branch → WhatsApp message to the matching teacher. Zero humans.',
    },
  },
  {
    id: 'property-research',
    session: 3,
    techTag: 'Perplexity Pro',
    category: 'other',
    courseSlug: 'ai-tools-mastery-beginners',
    title: 'Kotkapura land-price study',
    studentMeta: 'By Rajinder K. · Online',
    quote:
      'One prompt collapsed 12 broker sources into a single trend report with comparable plots.',
    createdAt: '2026-04-09',
    span: 'default',
    kind: 'code',
    codeSnippet:
      'focus: web · filters: magicbricks, 99acres, local · window: 24mo · output: markdown + table',
    reveal: {
      label: 'The Prompt',
      body: 'focus: web search · filters: magicbricks, 99acres, 3 local broker sites · window: last 24 months · output: markdown trend table + 3 comparable plots',
    },
  },
];
