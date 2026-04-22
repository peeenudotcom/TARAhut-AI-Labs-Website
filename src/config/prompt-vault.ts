// The Emerald Prompt Vault — a curated library of production prompts
// tailored to Punjab's real-world workflows. Every prompt ties back
// to a specific Session from the AI Tools Mastery course so the
// vault doubles as a funnel ("you just used this — now learn why
// it works").
//
// Authored here as a typed TS file for now. When submissions open
// up we'll swap for a Supabase table with a human moderation queue.

export type PromptCategory =
  | 'legal'
  | 'real-estate'
  | 'retail'
  | 'content'
  | 'automation'
  | 'agriculture';

export interface PromptEntry {
  id: string;
  title: string;
  category: PromptCategory;
  // The actual prompt text. Placeholder variables wrapped in {{…}}
  // so the UI can highlight them and users know what to swap.
  prompt: string;
  // TARA's explanation of why the prompt is structured this way.
  // One or two short paragraphs max.
  taraTip: string;
  // Tools this prompt is designed for (ChatGPT, Claude, etc.).
  tools: string[];
  // The AI Tools Mastery session that teaches the underlying logic.
  sessionNumber: number;
  sessionTitle: string;
  // Extra keywords to widen search matching.
  tags?: string[];
}

export const PROMPT_CATEGORIES: {
  id: PromptCategory;
  label: string;
  icon: string;
  blurb: string;
}[] = [
  { id: 'legal',       label: 'Legal',       icon: '⚖️', blurb: 'Notices, briefs, contracts, consumer complaints' },
  { id: 'real-estate', label: 'Real Estate', icon: '🏠', blurb: 'Listings, reels, cold outreach, closing scripts' },
  { id: 'retail',      label: 'Retail & Dhaba', icon: '🛍️', blurb: 'Menus, upsells, inventory, WhatsApp replies' },
  { id: 'content',     label: 'Content',     icon: '🎬', blurb: 'Instagram, reels, blogs, voiceover scripts' },
  { id: 'automation',  label: 'Automation',  icon: '⚡', blurb: 'Workflows, triage, lead sorting, reports' },
  { id: 'agriculture', label: 'Agriculture', icon: '🌾', blurb: 'Scheme explainers, product ads, market reports' },
];

export const promptVault: PromptEntry[] = [
  // ── LEGAL ──────────────────────────────────────────────
  {
    id: 'legal-punjabi-notice',
    title: 'Punjabi-English legal notice draft',
    category: 'legal',
    prompt: `You are a senior advocate practising in Punjab courts.
Draft a legal notice under {{ACT_OR_SECTION}} on behalf of {{CLIENT_NAME}} addressed to {{OPPOSING_PARTY}}.

Facts:
- {{FACT_1}}
- {{FACT_2}}
- {{FACT_3}}

Relief sought: {{RELIEF}}.

Format requirements:
- Top: English legal notice with date, sender, recipient, subject.
- Bottom: Faithful Punjabi (Gurmukhi) translation so the recipient cannot claim non-comprehension.
- Tone: firm, clean, enforceable. No emotional language.
- Leave a signature block for the advocate.`,
    taraTip: `Bilingual notices are the single biggest trust-builder in rural Punjab — opposing parties can't dodge with "I didn't understand English." The structure forces ChatGPT to output facts, relief, and format explicitly so you never get vague boilerplate.`,
    tools: ['ChatGPT-4o', 'Claude 3.5'],
    sessionNumber: 6,
    sessionTitle: 'AI for Pro Writing',
    tags: ['legal notice', 'gurmukhi', 'advocate', 'dispute'],
  },
  {
    id: 'legal-case-brief',
    title: 'Court case brief — 7-point summary',
    category: 'legal',
    prompt: `Read the attached PDF of the judgment.
Output a 7-point legal brief. Each point ≤ 30 words.
Cite the paragraph number from the judgment for every point.
Flag any ambiguous holdings with [UNCERTAIN].

Do not invent citations. If a fact isn't in the document, mark it {{MISSING}}.`,
    taraTip: `The trick here is three guardrails: a hard word cap, a citation requirement, and explicit "don't invent" wording. Without those, AI confidently hallucinates case law. With them, you get brief-ready output in 30 seconds.`,
    tools: ['Claude 3.5 Projects'],
    sessionNumber: 4,
    sessionTitle: 'Research & Long Context',
    tags: ['judgment', 'brief', 'summary', 'court'],
  },
  {
    id: 'legal-consumer-complaint',
    title: 'Consumer complaint — defective product',
    category: 'legal',
    prompt: `You are a Punjab consumer-protection advocate.

Draft a complaint under the Consumer Protection Act 2019 for:
- Complainant: {{CLIENT_NAME}}, {{CITY}}
- Opposite party: {{SELLER_NAME}}
- Product + invoice date: {{PRODUCT}}, {{INVOICE_DATE}}
- Defect: {{DEFECT}}
- Attempts to resolve: {{RESOLUTION_ATTEMPTS}}
- Relief sought: refund / replacement / damages of ₹{{AMOUNT}}.

Include: cause of action, territorial jurisdiction, limitation, and prayer clause. Cite Section 2(11) if applicable.`,
    taraTip: `Asking for the prayer clause + jurisdiction + limitation in one shot means you get a complaint that's *filable*, not just a draft. Add the invoice and defect as structured variables so every fact lands where the court wants it.`,
    tools: ['ChatGPT-4o', 'Claude'],
    sessionNumber: 3,
    sessionTitle: 'Advanced Reasoning',
    tags: ['consumer', 'complaint', 'refund'],
  },

  // ── REAL ESTATE ────────────────────────────────────────
  {
    id: 're-listing-ad',
    title: 'Property listing ad — MagicBricks ready',
    category: 'real-estate',
    prompt: `Write a MagicBricks + 99acres listing for:
- Property: {{TYPE}} in {{LOCATION}}, {{CITY}}
- Size: {{SIZE}} · Price: ₹{{PRICE}} · Facing: {{FACING}}
- Age: {{AGE}} · Furnishing: {{FURNISHING}}
- Highlights: {{3_KEY_HIGHLIGHTS}}

Output 3 blocks:
1. 80-char hook title (no clichés like "spacious" or "beautiful").
2. 120-word main description (lead with the strongest highlight).
3. 5 short bullets for the amenities section.

Tone: confident, concrete, no exclamation marks.`,
    taraTip: `The no-cliché rule is what separates your ad from the 2,000 identical listings. Giving the AI a hard word cap + forcing the strongest hook first trains it to do compression, not fluff.`,
    tools: ['ChatGPT-4o'],
    sessionNumber: 6,
    sessionTitle: 'AI for Pro Writing',
    tags: ['listing', 'property', 'ad', 'magicbricks'],
  },
  {
    id: 're-reel-script',
    title: 'Viral realtor reels script — 30 seconds',
    category: 'real-estate',
    prompt: `Write a 30-second Instagram Reels script for a realtor in {{CITY}}.

Property: {{PROPERTY_TYPE}} at {{LOCATION}} for ₹{{PRICE}}.

Format:
- Hook (3 seconds) — a question or contradiction that stops the scroll
- Problem (5 seconds) — what buyers hate about this price bracket
- Reveal (15 seconds) — this property, 3 concrete differentiators
- CTA (7 seconds) — DM or WhatsApp, no generic "contact us"

Tone: Punjabi-English mix is fine. Write each section as spoken dialogue the realtor can read aloud. Include a shot description in brackets for every line.`,
    taraTip: `30-second scripts fail when they're 90% reveal and 10% hook. This structure front-loads the hook and ends with a specific CTA that doesn't sound like every other ad. Shot directions under each line mean your editor knows exactly what to cut to.`,
    tools: ['ChatGPT-4o', 'Claude'],
    sessionNumber: 10,
    sessionTitle: 'HeyGen & AI Avatars',
    tags: ['reels', 'instagram', 'realtor', 'viral'],
  },
  {
    id: 're-whatsapp-followup',
    title: 'Post-site-visit WhatsApp follow-up',
    category: 'real-estate',
    prompt: `I'm a realtor in {{CITY}}. I showed {{CLIENT_NAME}} a {{PROPERTY}} today.

Their concerns were: {{CONCERNS}}.
Their budget was: ₹{{BUDGET}}.
The property is: ₹{{PRICE}}.

Write 3 versions of a follow-up WhatsApp — under 80 words each.
- Version A: address their biggest concern head-on with a stat.
- Version B: offer a lower-budget alternative without losing the sale.
- Version C: create polite urgency around a specific date.

All versions end with a single, easy next step — not "let me know your thoughts."`,
    taraTip: `Three versions lets you A/B without thinking. The "single easy next step" rule kills the deadweight "let me know" CTA that 90% of realtors use and 0% of buyers respond to.`,
    tools: ['ChatGPT-4o'],
    sessionNumber: 2,
    sessionTitle: 'Prompt Engineering Genesis',
    tags: ['whatsapp', 'followup', 'realtor', 'sales'],
  },

  // ── RETAIL & DHABA ─────────────────────────────────────
  {
    id: 'retail-dhaba-menu',
    title: 'Dhaba menu — upsell-optimised',
    category: 'retail',
    prompt: `You run a dhaba in {{CITY}}, Punjab.

Current dishes with prices:
{{DISH_LIST}}

Redesign the menu text for a printed card. Requirements:
- Group dishes into 4 sections (Starters / Main / Breads / Sweets).
- For each dish: a 6-8 word description that sells, not describes ("butter chicken" → "Butter chicken, slow-cooked in charcoal makhani").
- Mark the 3 highest-margin dishes with a ⭐ "Chef's pick" tag.
- Suggest 2 combo pairings ("Rajma chawal + lassi ₹X — saves ₹Y").
- Add one line at the bottom: "WhatsApp us at {{NUMBER}} for home delivery".

No emojis beyond the single ⭐.`,
    taraTip: `Menus are the most under-optimised conversion surface in every Indian small business. The 6-8 word descriptions force you to sell the dish, not label it. Combos are the fastest AOV lift — the AI will suggest pairings you'd never think of.`,
    tools: ['ChatGPT-4o'],
    sessionNumber: 6,
    sessionTitle: 'AI for Pro Writing',
    tags: ['menu', 'dhaba', 'upsell', 'restaurant'],
  },
  {
    id: 'retail-inventory-prompt',
    title: 'Auto inventory reorder from monthly sheet',
    category: 'retail',
    prompt: `Read the attached sales spreadsheet for the last 30 days.

For each SKU:
1. Compute average daily units sold.
2. Compute 7-day reorder quantity at 1.3× buffer.
3. Flag SKUs where stock < 2 days of supply as 🔴 URGENT.
4. Flag SKUs with zero sales for 14+ days as 💤 DEAD — suggest clearance discount %.

Output as a single table, sorted by 🔴 urgency first.`,
    taraTip: `Inventory prompts work when you remove every word that could mean two things. "1.3× buffer", "zero sales for 14+ days", "sorted by urgency first" — each is measurable. That's what stops the AI from giving you vibes instead of numbers.`,
    tools: ['Claude 3.5 Projects', 'ChatGPT-4o'],
    sessionNumber: 14,
    sessionTitle: 'AI Workflows (Zapier / Make)',
    tags: ['inventory', 'spreadsheet', 'reorder'],
  },
  {
    id: 'retail-whatsapp-replies',
    title: 'WhatsApp auto-reply library for a boutique',
    category: 'retail',
    prompt: `You handle DMs for a boutique in {{CITY}}.

Generate 10 saved replies, each ≤ 35 words, in Hinglish. Cover:
1. Price enquiry — size not specified
2. Price enquiry — size + colour specified
3. Custom stitching timeline
4. Exchange vs return policy
5. COD availability
6. Bulk order (weddings)
7. "Is this still available?"
8. Fabric care
9. Angry customer after delivery
10. Post-purchase thank-you

For each, include one line of "TARA Tip" explaining what psychology it uses (reciprocity, social proof, urgency, etc.).`,
    taraTip: `Having the prompt itself teach psychology turns a utility ask into a training session. Now you don't just get replies — you learn which lever each reply is pulling, so you can write new ones yourself.`,
    tools: ['ChatGPT-4o', 'Claude'],
    sessionNumber: 2,
    sessionTitle: 'Prompt Engineering Genesis',
    tags: ['whatsapp', 'boutique', 'customer service'],
  },

  // ── CONTENT ────────────────────────────────────────────
  {
    id: 'content-30-post-calendar',
    title: '30-day Instagram calendar — single category',
    category: 'content',
    prompt: `Build a 30-day Instagram content calendar for a {{NICHE}} brand in Punjab.

For each day output a row:
Day | Pillar | Format | Hook (10 words) | Body (25 words) | CTA (6 words)

Pillars (rotate these 4): Educational · Relatable · Behind-the-scenes · Social proof.

Formats (mix these 4): Reel · Carousel · Static · Story.

Rules:
- No hook starts with "Did you know…" (overused).
- Relatable posts must reference Punjab-specific context (weather, festivals, local phrases).
- Every CTA must be a verb ("Comment X below", "Save for later", "DM us Punjabi").`,
    taraTip: `The magic here is the format + pillar grid. One row per day × 4 pillars × 4 formats = a calendar that doesn't repeat itself, no matter how long you run it. Punjab-specific rule stops you from getting generic "sunday motivation" posts.`,
    tools: ['ChatGPT-4o'],
    sessionNumber: 6,
    sessionTitle: 'Canva AI Integration',
    tags: ['instagram', 'calendar', '30-day', 'content'],
  },
  {
    id: 'content-youtube-hook',
    title: 'YouTube title + thumbnail copy generator',
    category: 'content',
    prompt: `Topic: {{VIDEO_TOPIC}}.
Channel niche: {{NICHE}}.

Generate 10 title + thumbnail text pairs.

Rules:
- Titles ≤ 55 characters (no Hindi for SEO reach).
- Thumbnail text ≤ 4 words (the eye reads words, not sentences).
- At least 3 titles use curiosity gaps ("Why nobody tells you…").
- At least 3 titles use contrast ("Rs 5 lakh vs Rs 50 lakh…").
- At least 2 titles use specificity ("In 73 days I…").

Rank the 10 by predicted CTR (highest first) and write one line per title explaining the hook used.`,
    taraTip: `This prompt does two things most YouTube prompts don't: it teaches the difference between curiosity, contrast, and specificity hooks, AND it forces the AI to self-rank. You learn the pattern while getting titles you can actually use.`,
    tools: ['ChatGPT-4o'],
    sessionNumber: 6,
    sessionTitle: 'AI for Pro Writing',
    tags: ['youtube', 'thumbnail', 'title', 'hook'],
  },
  {
    id: 'content-voice-script',
    title: 'ElevenLabs-ready voiceover script',
    category: 'content',
    prompt: `Write a 60-second voiceover script for a {{PRODUCT_OR_TOPIC}} explainer video.

Voice profile: {{VOICE_TYPE}} — warm, confident, under 35 years old.

Structure each sentence for audio:
- Max 14 words per sentence.
- Use contractions (you're, don't) — they read natural out loud.
- Mark natural pauses with ellipses (…) — ElevenLabs respects them.
- Mark emphasis words with ALL CAPS — the model leans on them.
- Keep one thought per sentence. No semicolons.

End with a 5-word CTA.`,
    taraTip: `Audio scripts fail when written like print. The 14-word limit, ellipses for pauses, and ALL CAPS for emphasis are exactly how ElevenLabs reads the text. Follow these rules and your first output sounds like a pro narrator, not a robot.`,
    tools: ['ElevenLabs', 'ChatGPT-4o'],
    sessionNumber: 9,
    sessionTitle: 'ElevenLabs Mastery',
    tags: ['voiceover', 'script', 'elevenlabs', 'audio'],
  },

  // ── AUTOMATION ─────────────────────────────────────────
  {
    id: 'auto-lead-triage',
    title: 'Lead triage classifier — hot / warm / cold',
    category: 'automation',
    prompt: `Classify the following incoming lead based on these signals:

Lead message: "{{LEAD_MESSAGE}}"

Rules:
- HOT = asks about price, batch dates, or "how to enroll"
- WARM = asks about syllabus, outcomes, or comparison
- COLD = casual curiosity, no specific intent
- SPAM = single word, links, or clearly non-Indian context

Output exactly three lines:
1. {HOT|WARM|COLD|SPAM}
2. One-line reason (under 15 words).
3. Suggested next action (one sentence — WhatsApp reply, email, or ignore).`,
    taraTip: `The exact output format is what makes this prompt production-ready. Three lines, nothing else — that's what a Zapier/Make step can reliably parse and route. Without the output contract, you'd need a separate cleanup step.`,
    tools: ['Claude 3.5', 'ChatGPT-4o'],
    sessionNumber: 14,
    sessionTitle: 'AI Workflows (Zapier / Make)',
    tags: ['lead', 'classify', 'triage', 'zapier'],
  },
  {
    id: 'auto-weekly-report',
    title: 'Weekly sales report — auto-generated',
    category: 'automation',
    prompt: `Attached is this week's sales CSV.

Generate a weekly report with these sections:
1. Headline number: total revenue vs last week (% change, ₹ change).
2. Top 3 products by revenue.
3. Top 3 products by volume.
4. Any product whose revenue dropped > 20% — flag with reason if inferable from the data.
5. Next week's recommended focus — one paragraph, concrete (not "work harder").

Format as a WhatsApp-pasteable message. No markdown. ≤ 180 words total.`,
    taraTip: `WhatsApp-pasteable is the key constraint. 90% of Indian small businesses send reports via WhatsApp, not email. Telling the AI "no markdown, ≤ 180 words" means the output works the moment you paste it — no cleanup, no formatting loss.`,
    tools: ['Claude 3.5 Projects'],
    sessionNumber: 14,
    sessionTitle: 'AI Workflows (Zapier / Make)',
    tags: ['report', 'sales', 'weekly', 'csv'],
  },
  {
    id: 'auto-email-classifier',
    title: 'Inbox auto-sorter for a small firm',
    category: 'automation',
    prompt: `You are an inbox assistant for a {{BUSINESS_TYPE}}.

Classify this email:
Subject: {{SUBJECT}}
Body: {{BODY}}

Route it to one of these folders:
- ACTION — needs a reply in 24 hours
- INFO — for awareness only, no reply needed
- INVOICE — accounting / payment related
- SPAM — promotional, cold outreach, or irrelevant

Output exactly:
1. Folder name
2. Confidence (1-5)
3. Draft reply (≤ 60 words) ONLY if folder = ACTION, else "No reply needed"`,
    taraTip: `Small firms drown in ACTION vs INFO vs INVOICE triage. The confidence score lets you auto-route high-confidence mail and send low-confidence mail to a human review folder. Draft-reply-only-when-needed saves the model from wasting tokens on cold emails.`,
    tools: ['Claude 3.5', 'ChatGPT-4o'],
    sessionNumber: 14,
    sessionTitle: 'AI Workflows (Zapier / Make)',
    tags: ['email', 'inbox', 'classifier', 'automation'],
  },

  // ── AGRICULTURE ────────────────────────────────────────
  {
    id: 'agri-scheme-explainer',
    title: 'Government scheme explainer — Punjabi farmer',
    category: 'agriculture',
    prompt: `Explain {{SCHEME_NAME}} to a farmer in rural Punjab.

Rules:
- Output in Gurmukhi Punjabi only (no English words except proper nouns and ₹).
- ≤ 250 words.
- Structure: What is it · Who qualifies · Documents needed · Where to apply · Common mistakes people make.
- No legalese. No jargon. A 50-year-old with Class 8 education should understand every line.
- End with one short line: "Confused? WhatsApp karo: {{NUMBER}}."`,
    taraTip: `The "50-year-old, Class 8 education" persona is what stops the AI from being clever. Without it, you get Wikipedia. With it, you get the kind of explanation a village-level organiser gives on a verandah.`,
    tools: ['Claude 3.5', 'ChatGPT-4o'],
    sessionNumber: 6,
    sessionTitle: 'AI for Pro Writing',
    tags: ['scheme', 'pmkisan', 'punjabi', 'farmer'],
  },
  {
    id: 'agri-crop-market-report',
    title: 'Daily mandi rate digest',
    category: 'agriculture',
    prompt: `Given today's mandi price data for {{CROP}} across {{DISTRICT}}:
{{PRICE_TABLE}}

Write a 120-word WhatsApp update in Hinglish for farmers:
1. Today's median price vs last week (% change).
2. Which mandi is paying best, with the rate.
3. One line of advice — sell, hold, or watch — with a concrete reason (weather, demand, arrivals).
4. "TARA ki salah" one-liner at the end — a single actionable tip.

No disclaimers. No "consult your advisor" boilerplate.`,
    taraTip: `The "no disclaimers" rule is what keeps the update usable. AIs default to hedging; farmers need a single clear signal (sell / hold / watch) with a reason they can verify. The "TARA ki salah" line makes the bot feel like a trusted cousin, not a corporate source.`,
    tools: ['Claude 3.5 Projects'],
    sessionNumber: 4,
    sessionTitle: 'Research & Long Context',
    tags: ['mandi', 'crop', 'market', 'rates'],
  },
  {
    id: 'agri-product-ad',
    title: 'Punjabi product ad for agri-input brand',
    category: 'agriculture',
    prompt: `Write a 40-word advertisement for {{PRODUCT_NAME}} targeting wheat farmers in Malwa region.

Requirements:
- Entirely in Gurmukhi Punjabi.
- Lead with the single strongest benefit (yield %, pest resistance, or cost savings).
- One social-proof line (e.g., "Used by 500+ farmers in Bathinda").
- One short CTA with a WhatsApp number.
- Must include the product name twice — once at the start, once at the CTA.

No English words except the product name and numbers.`,
    taraTip: `Malwa wheat farmers respond to yield numbers, not taglines. Forcing the AI to lead with a concrete stat (yield %, pests, cost) — not "high quality" or "trusted brand" — is what separates a Rs 5 lakh ad campaign from a Rs 50,000 one.`,
    tools: ['ChatGPT-4o'],
    sessionNumber: 6,
    sessionTitle: 'AI for Pro Writing',
    tags: ['punjabi', 'farmer', 'ad', 'agri-input'],
  },
  {
    id: 'agri-weather-advisory',
    title: '7-day weather advisory for farmers',
    category: 'agriculture',
    prompt: `Given this 7-day weather forecast for {{VILLAGE}}, Punjab:
{{FORECAST_DATA}}

Write a farming advisory in Punjabi (Gurmukhi). Rules:
- One paragraph (≤ 100 words).
- Specific to {{CROP}} growing in the {{STAGE}} stage.
- Name the 1-2 days farmers should act on and what to do (irrigation, spraying, harvesting).
- Flag any weather event that could cause damage with specific mitigation.
- End with: "ਸ਼ੱਕ ਹੋਵੇ ਤਾਂ ਪੁੱਛੋ: {{NUMBER}}"`,
    taraTip: `Weather advisories fail when they list data. This prompt forces action-per-day framing: "Tuesday — irrigate. Thursday — delay spraying." That's what farmers actually use. Damage mitigation at the end turns it from info into insurance.`,
    tools: ['Claude 3.5'],
    sessionNumber: 4,
    sessionTitle: 'Research & Long Context',
    tags: ['weather', 'advisory', 'crop', 'punjabi'],
  },

  // ── EXTRA ─────────────────────────────────────────────
  {
    id: 'legal-contract-review',
    title: 'Contract review — plain-English breakdown',
    category: 'legal',
    prompt: `You are a contract lawyer. Review the attached {{CONTRACT_TYPE}}.

Output these sections:
1. TL;DR — 3 bullets, ≤ 20 words each. What am I agreeing to?
2. Risky clauses — flag any clause that has unlimited liability, long non-compete (>2 years), auto-renewal, or vague termination. Quote the clause, then translate.
3. Missing protections — 3 things this contract *should* have but doesn't.
4. Negotiation angles — 3 specific edits I should ask for, phrased as I'd send them to the other side.

Output in plain English. No legalese.`,
    taraTip: `Most contract-review prompts return a summary. This one returns a decision: TL;DR, risks, gaps, and specific edits. The "phrased as I'd send them" constraint means the negotiation angles come out copy-pasteable, not philosophical.`,
    tools: ['Claude 3.5 Projects'],
    sessionNumber: 4,
    sessionTitle: 'Research & Long Context',
    tags: ['contract', 'review', 'risks', 'negotiation'],
  },
  {
    id: 'content-blog-outline',
    title: 'SEO blog outline — 1500 words',
    category: 'content',
    prompt: `Write a blog outline for the keyword: "{{KEYWORD}}".

Target audience: {{AUDIENCE}}.
Search intent: {{INTENT}} (informational / commercial / comparison).

Output:
- H1 (≤ 60 chars, includes the exact keyword).
- Meta description (≤ 155 chars).
- 6-8 H2 sections — each covering a distinct angle.
- Under each H2: 2-3 bullet points the writer must cover.
- 3 "People also ask" style questions the post must answer.
- One internal-link suggestion per section (to be written later).

Never use phrases like "in today's world", "digital age", or "revolutionary".`,
    taraTip: `The banned phrases list is the secret weapon — those filler openings are why 95% of AI blog posts feel like AI blog posts. Ban them and the AI has to actually commit to ideas. Internal-link slots make the outline a real SEO spec, not a content brainstorm.`,
    tools: ['ChatGPT-4o'],
    sessionNumber: 6,
    sessionTitle: 'AI for Pro Writing',
    tags: ['blog', 'seo', 'outline', '1500-words'],
  },
  {
    id: 'auto-meeting-notes',
    title: 'Meeting notes → action items',
    category: 'automation',
    prompt: `Here's the transcript of a {{MEETING_TYPE}} meeting:

{{TRANSCRIPT}}

Output four sections:
1. **One-line summary** — what was decided.
2. **Decisions** — bullet list of explicit decisions taken, each with the decision-maker named.
3. **Action items** — markdown table with columns: Owner · Task · Deadline · Dependencies.
4. **Open questions** — bullet list of anything discussed but not resolved.

No hallucination: if an owner or deadline wasn't stated, write "{{UNSPECIFIED}}". Don't guess.`,
    taraTip: `Meeting-notes prompts fail when the AI fabricates owners ("John will handle this"). The "{{UNSPECIFIED}}" rule forces it to admit the gap — which is the exact signal a project manager needs to chase the missing detail.`,
    tools: ['Claude 3.5 Projects'],
    sessionNumber: 3,
    sessionTitle: 'Advanced Reasoning',
    tags: ['meeting', 'notes', 'action items', 'transcript'],
  },
];
