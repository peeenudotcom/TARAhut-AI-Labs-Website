// Lab Feed — the "proof surface" for TARAhut courses. Real outputs
// from real students so prospective learners can see what the 16
// sessions actually produce. Authored here as a typed TS file for now
// (zero infra, full type safety); swap for a Supabase table if/when
// students start submitting their own work through a form.
//
// The newest entry (by `createdAt`) automatically gets the red "RECENT
// BUILD" pulse on the bento grid so the feed feels alive without a
// CMS behind it. Order in this array doesn't matter — the UI sorts.

export interface LabFeedTile {
  id: string;
  session: number; // → "SESSION 05"
  techTag?: string; // secondary tag — e.g., "Midjourney v6", "Make.com"
  courseSlug?: string; // optional back-link into /courses/[slug]
  title: string;
  studentMeta: string; // "By Arsh S. · Batch 08" or "Dr. Amit · Online"
  createdAt: string; // ISO — newest wins the RECENT BUILD pulse
  span: 'large' | 'wide' | 'tall' | 'default'; // bento tile size

  // Discriminator + media payload
  kind: 'image' | 'code';

  // image-only
  src?: string;
  alt?: string;

  // code-only — `codeSnippet` renders as a faded monospace background
  // layer (emerald, low opacity); `quote` surfaces as a pulled quote
  // above the student meta, framed like a testimonial.
  codeSnippet?: string;
  quote?: string;
}

export const labFeed: LabFeedTile[] = [
  {
    id: 'cyberpunk-amritsar',
    session: 5,
    techTag: 'Midjourney v6',
    courseSlug: 'ai-tools-mastery-beginners',
    title: 'Cyberpunk Amritsar — concept series',
    studentMeta: 'By Arsh S. · Batch 01',
    createdAt: '2026-04-20',
    span: 'large',
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1675271591211-126ad94e495d?auto=format&fit=crop&q=80&w=1000',
    alt: 'AI-generated cyberpunk reimagining of the Golden Temple at night',
  },
  {
    id: 'melt-in-joy-website',
    session: 13,
    techTag: 'Bolt.new',
    courseSlug: 'master-ai-builder',
    title: 'Melt in Joy — dessert brand website',
    studentMeta: 'By Jashandeep · Kotkapura Lab',
    createdAt: '2026-04-19',
    span: 'wide',
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&q=80&w=1000',
    alt: 'Melt in Joy dessert brand website homepage',
  },
  {
    id: 'local-biz-rebrand',
    session: 6,
    techTag: 'Canva AI',
    courseSlug: 'ai-tools-mastery-beginners',
    title: 'Local biz rebrand — Kotkapura dhaba',
    studentMeta: 'By Preet · Kotkapura Lab',
    createdAt: '2026-04-18',
    span: 'default',
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=500',
    alt: 'Brand identity system for a local Punjabi dhaba',
  },
  {
    id: 'lawyer-auto-responder',
    session: 14,
    techTag: 'Make.com',
    courseSlug: 'master-ai-builder',
    title: "Lawyer's auto-responder",
    studentMeta: 'By Manpreet S. · Online',
    quote:
      'Automated 200+ daily client emails for a firm in Ludhiana — replies drafted in Punjabi, English, and Hindi.',
    createdAt: '2026-04-17',
    span: 'tall',
    kind: 'code',
    codeSnippet:
      '{ "trigger": "new_email", "action": "claude_3.5_analyze", "output": "draft_reply", "route": "lawyer.inbox" }',
  },
  {
    id: 'property-consultant-ad',
    session: 10,
    techTag: 'HeyGen Avatars',
    courseSlug: 'ai-power-8-week-program',
    title: 'AI property consultant — 90s Punjabi ad',
    studentMeta: 'By Gurbir Singh · Master AI Builder',
    createdAt: '2026-04-15',
    span: 'wide',
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
    alt: 'Still from an AI avatar video explaining a real-estate project',
  },
  {
    id: 'health-diagnostic-bot',
    session: 13,
    techTag: 'Custom GPTs',
    courseSlug: 'master-ai-builder',
    title: 'Clinic triage bot — Hindi + English',
    studentMeta: 'By Dr. Amit · Online Batch',
    createdAt: '2026-04-14',
    span: 'default',
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=500',
    alt: 'Custom GPT interface triaging patient symptoms',
  },
  {
    id: 'boutique-social-calendar',
    session: 6,
    techTag: 'Canva AI',
    courseSlug: 'ai-tools-mastery-beginners',
    title: '30-day Instagram calendar · boutique',
    studentMeta: 'By Simran D. · Kotkapura Lab',
    createdAt: '2026-04-13',
    span: 'default',
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&q=80&w=500',
    alt: 'Instagram grid for a fashion boutique',
  },
  {
    id: 'zapier-lead-router',
    session: 14,
    techTag: 'Zapier',
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
  },
  {
    id: 'property-research',
    session: 3,
    techTag: 'Perplexity Pro',
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
  },
];
