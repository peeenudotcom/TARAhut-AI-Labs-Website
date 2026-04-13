export interface Flashcard {
  front: string;
  back: string;
}

export const sessionFlashcards: Record<number, Flashcard[]> = {
  1: [
    { front: 'What does AI stand for?', back: 'Artificial Intelligence — computer systems that can learn from data and perform tasks that normally need human intelligence.' },
    { front: 'Name the 3 types of AI', back: 'Narrow AI (current, does one thing well), General AI (future, human-level intelligence), Super AI (theoretical, beyond human).' },
    { front: 'What is the most common type of AI today?', back: 'Narrow AI — ChatGPT, Google Maps, Netflix recommendations are all Narrow AI.' },
    { front: 'Name 3 AI tools you set up in Session 1', back: 'ChatGPT, Claude, and Google Gemini.' },
    { front: 'Can AI think like a human?', back: 'No. AI finds patterns in data and generates responses. It doesn\'t understand or think — it predicts.' },
  ],
  2: [
    { front: 'What is the pilot/co-pilot analogy?', back: 'You are the pilot (decision maker). AI is the co-pilot (assistant). You guide, AI helps.' },
    { front: 'What is an AI hallucination?', back: 'When AI generates false or incorrect information that sounds convincing.' },
    { front: 'Should you share your Aadhaar number with AI?', back: 'NEVER. Don\'t share passwords, Aadhaar, bank details, or sensitive personal info with AI tools.' },
    { front: 'Name 3 AI career paths', back: 'AI Content Creator, Prompt Engineer, AI Freelancer, AI Marketing Specialist, AI Automation Specialist, AI Trainer.' },
    { front: 'What determines the quality of AI output?', back: 'The quality of your input (prompt). Better prompts = better results.' },
  ],
  3: [
    { front: 'What does RCTF stand for in prompting?', back: 'Role + Context + Task + Format — the framework for writing effective prompts.' },
    { front: 'Give an example of a "Role" in a prompt', back: '"Act as a marketing expert" or "You are a 10th grade science teacher"' },
    { front: 'What is "Context" in RCTF?', back: 'Background information: who you are, what the situation is, what you\'ve tried.' },
    { front: 'Why should you specify "Format" in prompts?', back: 'So AI gives output in the structure you need: bullet points, table, email, 200 words, etc.' },
    { front: 'What happens with a vague prompt?', back: 'You get a generic, unfocused response. Specific prompts get specific, useful answers.' },
  ],
  4: [
    { front: 'What is chain-of-thought prompting?', back: 'Asking AI to think step by step before giving the final answer. Improves accuracy for complex tasks.' },
    { front: 'What is few-shot prompting?', back: 'Giving AI 2-3 examples of what you want before asking it to generate. AI learns the pattern from examples.' },
    { front: 'What is a system prompt?', back: 'Instructions that set AI\'s behavior for the entire conversation — its role, rules, tone, and constraints.' },
    { front: 'How many prompts should a good prompt library have?', back: '30+ categorized prompts across different use cases (writing, research, design, business, etc.).' },
    { front: 'What makes a prompt "advanced"?', back: 'Combining techniques: role + context + examples + format + constraints + chain-of-thought.' },
  ],
  5: [
    { front: 'ChatGPT\'s unique strength vs Claude', back: 'GPTs (custom bots), image generation (DALL-E), web browsing, memory across conversations.' },
    { front: 'Claude\'s unique strength vs ChatGPT', back: 'Long document analysis, Artifacts (visual outputs), Projects feature, better at nuanced writing.' },
    { front: 'When should you use ChatGPT over Claude?', back: 'For image generation, using custom GPTs, browsing the web, or tasks needing memory.' },
    { front: 'When should you use Claude over ChatGPT?', back: 'For analyzing long documents, detailed writing, coding, or when you need Artifacts.' },
    { front: 'What is "tool stacking"?', back: 'Using multiple AI tools together — e.g., research with Perplexity → write with Claude → design with Canva.' },
  ],
  6: [
    { front: 'What are the 3 key parts of a cold email?', back: 'Hook (opening line), value proposition (what you offer), CTA (what you want them to do).' },
    { front: 'How can AI help with resume writing?', back: 'Tailor resume to specific job descriptions, optimize keywords, rewrite bullet points with impact metrics.' },
    { front: 'Should you submit AI-written content directly?', back: 'No. Always review, edit, and add your personal touch. AI drafts, you finalize.' },
    { front: 'What makes a good AI-written proposal?', back: 'Problem statement → proposed solution → deliverables → timeline → pricing. AI structures it, you add specifics.' },
    { front: 'How does AI improve your writing?', back: 'Faster first drafts, better structure, tone adjustment, grammar checking, translation between languages.' },
  ],
  7: [
    { front: 'What makes Perplexity different from ChatGPT?', back: 'Perplexity searches the live web and provides citations/sources. ChatGPT relies on training data.' },
    { front: 'What is NotebookLM best for?', back: 'Uploading documents and having AI analyze them — create summaries, study guides, and even podcasts from your files.' },
    { front: 'What is the 3-step research workflow?', back: 'Perplexity (gather facts with sources) → NotebookLM (deep analysis) → Claude (write the report).' },
    { front: 'Why are citations important in AI research?', back: 'AI can hallucinate facts. Citations let you verify claims against real sources.' },
    { front: 'What is NotebookLM\'s Audio Overview?', back: 'It converts your uploaded documents into a podcast-style audio discussion — great for revision.' },
  ],
  8: [
    { front: 'What is Gamma AI used for?', back: 'Creating presentations from text prompts — generates slides with layout, content, and visuals automatically.' },
    { front: 'When to use Gamma vs Canva?', back: 'Gamma for quick presentations from scratch. Canva for detailed design work, social media posts, and branding.' },
    { front: 'What is Canva\'s Magic Design?', back: 'Type what you want, Canva generates complete design options — posts, presentations, posters, etc.' },
    { front: 'How many slides should a good pitch deck have?', back: '10-12 slides: Title, Problem, Solution, How it works, Market, Business model, Team, Traction, Ask, Contact.' },
    { front: 'What is visual hierarchy?', back: 'Arranging design elements so the most important things are seen first — size, color, position, contrast.' },
  ],
  9: [
    { front: 'How do AI image generators work?', back: 'Diffusion models: start with noise, gradually remove it guided by your text prompt, until an image forms.' },
    { front: 'What is Midjourney best for?', back: 'High-quality, artistic AI images. Best for creative, professional-grade visuals.' },
    { front: 'What is Ideogram\'s strength?', back: 'Generating images with readable text — logos, posters, banners where text accuracy matters.' },
    { front: 'How to write a good image prompt?', back: '[Subject] + [Style] + [Details] + [Mood] + [Aspect ratio]. Be specific about what you want to see.' },
    { front: 'What does "upscaling" mean in AI images?', back: 'Increasing the resolution/quality of an AI-generated image for print or large display use.' },
  ],
  10: [
    { front: 'What is HeyGen used for?', back: 'Creating AI avatar videos — a digital person speaks your script. No camera, studio, or filming needed.' },
    { front: 'What is CapCut AI good at?', back: 'Auto-captions, smart editing, background removal, text-to-video, trending templates for social media.' },
    { front: 'What is the AI video production workflow?', back: 'Script (Claude) → Avatar (HeyGen) → Edit (CapCut) → Final video. All AI, no filming.' },
    { front: 'Can you clone your own voice with AI?', back: 'Yes. ElevenLabs lets you create a digital copy of your voice from a short sample. Use responsibly.' },
    { front: 'What is Opus Clip?', back: 'AI tool that takes long videos and automatically creates short clips — perfect for Reels and Shorts.' },
  ],
  11: [
    { front: 'What is ElevenLabs?', back: 'AI voice generation platform — text-to-speech with ultra-realistic voices, voice cloning, multi-language dubbing.' },
    { front: 'What is a content calendar?', back: 'A planned schedule of what to post, when, on which platform, and why — typically planned weekly or monthly.' },
    { front: 'The 5-step content machine workflow?', back: 'Research (Perplexity) → Write (Claude) → Design (Canva) → Edit (CapCut) → Voiceover (ElevenLabs).' },
    { front: 'What is audio branding?', back: 'Consistent audio identity: podcast intro, brand jingle, IVR/hold music — all created with AI.' },
    { front: 'Best AI tool for social media captions?', back: 'ChatGPT or Claude — give brand context, tone, hashtag preferences for consistent, on-brand captions.' },
  ],
  12: [
    { front: 'What\'s included in a complete brand kit?', back: 'Logo + brand colors + fonts + social media templates + product video + brand audio + style guide.' },
    { front: 'Which AI tool for logo concepts?', back: 'Ideogram — best for images with readable text. Or use Canva AI for template-based logos.' },
    { front: 'Which tool for social media graphics?', back: 'Canva AI — templates, batch creation, brand kit integration, direct publishing.' },
    { front: 'Which tool for brand video?', back: 'HeyGen for avatar videos + CapCut for editing + ElevenLabs for voiceover.' },
    { front: 'Why do small businesses need a brand kit?', back: 'Consistent visual identity across all platforms = professional appearance = more trust = more customers.' },
  ],
  13: [
    { front: 'What is no-code development?', back: 'Building websites and apps using natural language instructions instead of writing code manually.' },
    { front: 'What is Bolt.new?', back: 'AI-powered website builder — describe what you want in English, AI generates a complete working website.' },
    { front: 'What should a portfolio website include?', back: 'Hero with name, About section, 3-4 project case studies, tools you use, contact/hire me section.' },
    { front: 'Can you deploy a Bolt.new site for free?', back: 'Yes. Bolt.new sites can be deployed live and shared with a public URL.' },
    { front: 'What makes a good portfolio project case study?', back: 'Problem → Solution → Tools Used → Result. Show the process, not just the final output.' },
  ],
  14: [
    { front: 'What is a capstone project?', back: 'A comprehensive final project that combines all skills learned across the entire course.' },
    { front: 'What\'s the first step in any client project?', back: 'Understand the brief: Who is the client? What do they need? What\'s the deadline? What tools to use?' },
    { front: 'How long should a project presentation be?', back: '5-10 minutes: intro (1 min), problem (1 min), solution demo (3-5 min), tools used (1 min), Q&A (2 min).' },
    { front: 'What makes a "real" project vs a practice project?', back: 'A real project solves an actual problem for a real person or business, not a hypothetical scenario.' },
    { front: 'How should you handle client feedback?', back: 'Listen fully, take notes, ask clarifying questions, make revisions, confirm satisfaction. Don\'t take it personally.' },
  ],
  15: [
    { front: 'What are the 3 rules of a great portfolio?', back: 'Show the process (not just result), include real businesses, prove the outcome with numbers/impact.' },
    { front: 'How to structure a case study?', back: 'Problem → Approach → Tools Used → Deliverables → Result/Impact. Include screenshots.' },
    { front: 'How to present without reading slides?', back: 'Know your 3 key points, use slides as visual support only, practice 3 times, make eye contact.' },
    { front: 'What is the STAR method for presentations?', back: 'Situation → Task → Action → Result. Great for explaining what you built and why it matters.' },
    { front: 'Should you show failed attempts in your portfolio?', back: 'Yes, selectively. Showing iteration (v1 → v2 → final) proves you can improve and take feedback.' },
  ],
  16: [
    { front: 'Name 3 freelancing platforms', back: 'Fiverr, Upwork, and LinkedIn. Also: Freelancer.com, Toptal, and direct outreach via cold email.' },
    { front: 'What should a Fiverr gig description include?', back: 'Clear service description, what\'s included, delivery time, pricing tiers, portfolio samples.' },
    { front: 'How to price AI services as a beginner?', back: 'Start 20-30% below market rate to build reviews. Raise after 10+ positive reviews. Research competitors first.' },
    { front: 'What is a 90-day career plan?', back: 'Month 1: Build portfolio + first 3 clients. Month 2: Optimize + raise rates. Month 3: Scale or get hired.' },
    { front: 'What\'s the most important thing after this course?', back: 'Start DOING. Apply skills daily. One real project is worth more than 100 hours of theory.' },
  ],
};
