export interface PlaygroundRefinementChip {
  // One-tap follow-up that nudges Claude to refine the existing output.
  // The instruction is appended to the original prompt before re-generation.
  label: string;        // "✏️ Make it shorter"
  instruction: string;  // "Now rewrite this in half the words while keeping the key points."
}

export type PlaygroundActionType =
  | { type: 'whatsapp'; phone?: string; sectionMatch?: string }  // Opens wa.me with the AI output as message body. If sectionMatch is set, sends ONLY the matched section's body (not the full output) — used by Session 14's "Send first reply via WhatsApp" so the chat opens with the reply draft, not the entire delivery plan.
  | { type: 'copy'; sectionMatch?: string }    // Copies AI output to clipboard. If sectionMatch is set, copies ONLY the section whose `## Heading` starts with that string (case-insensitive). Used by Session 11's "Copy Day 1 post" so the user gets just the Day 1 chunk, not the full calendar.
  | { type: 'email' }                           // Mailto link with subject + AI output as body
  | { type: 'continue-session' }                // Plain link back to lesson
  | { type: 'open-url'; url: string; copyFirst?: boolean };  // Opens an external tool (e.g. ChatGPT GPT Builder), optionally copying the output first

export interface PlaygroundAction {
  label: string;        // "📱 Send via WhatsApp"
  action: PlaygroundActionType;
}

export interface PlaygroundComparison {
  // Static "Before" example shown side-by-side with the live response. Used
  // in sessions teaching a technique (RCTF, few-shot, etc.) where the WHOLE
  // point is the delta. Authored once per task — never AI-generated, so cost
  // stays at zero and the contrast is consistent.
  basicPromptLabel: string;   // "Write 5 captions for a sweets shop"
  basicOutput: string;        // markdown — the lazy / source content
  // Optional label overrides — different sessions need different framings.
  // Default: "Without RCTF" / "With YOUR RCTF prompt".
  leftHeader?: string;        // e.g. "📚 Your 3 source examples"
  rightHeader?: string;       // e.g. "✨ AI matched the voice"
  leftSubLabel?: string;      // small grey eyebrow on left card
  rightSubLabel?: string;     // small grey eyebrow on right card
}

export interface PlaygroundExample {
  // One worked example shown as a card ABOVE the textarea (not crammed inside).
  // Used by few-shot tasks where 2-3 examples are needed but stuffing them
  // into a textarea overwhelms the user before they can experience the result.
  label: string;   // "Patiala mustard oil 250ml"
  text: string;    // The full example description
}

export interface PlaygroundExamples {
  intro: string;                  // "Learn my brand voice from these 3 examples:"
  items: PlaygroundExample[];     // 2-3 examples
  visibleByDefault?: number;      // How many show on load (rest hidden behind "View N more")
}

export interface PlaygroundTask {
  // The student-facing task framing — drives the sidebar "Your First AI Task"
  // card and the AI Playground page header. Only sessions with a task defined
  // get a live playground; others fall back to copy-prompt-only.
  taskTitle: string;             // Sidebar card heading — "Your First AI Task"
  taskDescription: string;       // "Create a professional WhatsApp message using AI."
  timeEstimate: string;          // "Takes 2 minutes"
  starterPrompt: string;         // Pre-fills the textarea — multi-line OK
  proTipChips: string[];         // Pill chips under "Pro Tip"
  outroLine: string;             // Subtitle in the green "First AI Conversation ✓" sidebar badge
  // Drive the post-generation product moment (the keystone of the "guided
  // product, not chatbox" rework). Each is optional so older sessions
  // remain compatible while we roll the pattern out.
  outputHeadline?: string;       // Replaces "AI Response" once done — "Your AI-Generated 30-day Plan"
  successHeadline?: string;      // Big celebratory line shown after Save — "🎯 You now have a 30-day roadmap"
  refinementChips?: PlaygroundRefinementChip[];  // 2–3 one-tap iterations
  realWorldActions?: PlaygroundAction[];         // 1–2 actions to actually USE the output
  // Learning-loop scaffolding — for sessions that teach a technique. The user
  // shouldn't just see better output, they should INTERNALISE why it's better
  // and APPLY it to their own context.
  comparison?: PlaygroundComparison;             // "Without RCTF" vs "With RCTF" comparison
  whyItWorked?: { heading: string; bullets: string[] };  // Callout under the live response
  // Post-action reflection — multi-select chips that turn the abstract "you
  // tested it" into a tactile self-confirmation. Optional; only sessions
  // where the asset is meant to be USED (Custom GPT, prompt template, etc.)
  // get one. Selections are local-only (no backend save in v1).
  // `identityLine` fires once at least one chip is selected — frames the
  // moment as a real-world skill win, not just UI feedback.
  testReflection?: {
    headline: string;
    prompt: string;
    hint?: string;
    chips: string[];
    identityLine?: string;
  };
  yourTurnTemplate?: string;     // Replaces starterPrompt with a [BRACKETED] version when "Your Turn" clicked
  // Task-specific framing for the Your Turn block — generic fallbacks ship
  // when omitted, but each session reads better with its own copy (RCTF
  // prompt vs voice clone vs business plan, etc.).
  yourTurnHeadline?: string;     // "Now write your own RCTF prompt" / "Now train AI on YOUR brand voice"
  yourTurnBody?: string;         // 1-2 sentences explaining what they should do
  // Override for the success-state Continue button so each session can frame
  // it as execution → progression (not just navigation).
  continueButtonLabel?: string;  // "Use this voice for your product → Continue to Session 5"
  // One-line hint about WHERE to actually send/use the output. Renders as a
  // small icon-led line in the success card. Anchors abstract output to
  // a real channel: "Send via: 💬 WhatsApp · 📧 Email · 📩 Instagram DM".
  useWhereHint?: string;
  // Commitment loop — triggered after the user clicks any send action
  // (WhatsApp / Email / Instagram / LinkedIn / open-url). Asks "did you
  // actually send it?" with Yes/Not-yet. Yes locks in identity; Not-yet
  // nudges. Closes the loop from "I could send it" → "I sent it".
  sendCommit?: {
    prompt: string;            // "Did you send this to a real business?"
    yesLabel: string;          // "✅ Yes, sent it"
    noLabel: string;           // "🤔 Not yet"
    yesReinforcement: string;  // "You just took your first real step..."
    noNudge: string;           // "Pick one local business and send it now..."
  };
  // Finish line — sits BELOW the action buttons. Names what "done" looks
  // like, optionally where to start, and optionally what to do AFTER done.
  // Three semantic beats: (1) stop condition, (2) starting point, (3) bridge
  // from "selected" to actual real-world publication. Together they remove
  // the "I opened the tool, now what?" + "I picked one, now what?" risks.
  finishLine?: {
    primary: string;             // "🏁 Generate 3-5 images and pick 1 you'd actually post today."
    microNudge?: string;         // "💡 Start with Prompt 1 — it's your strongest angle."
    followThroughNudge?: string; // "📲 Post it on Instagram or send it on WhatsApp today — that's where this turns into results."
  };
  // Intent commitment — sits ABOVE the channel hint / action buttons.
  // Reinforces the rehearsal moment: "Say this once out loud →
  // ✔ I'll use this today". Bridges intention to commitment before the
  // user even clicks a channel. Pairs especially well with sessions that
  // produce a conversation starter or script.
  intentCommit?: {
    reinforcement: string;     // "Say this once out loud — then send it or use it in your next conversation."
    ctaLabel: string;          // "✔ I'll use this today"
    confirmedLine: string;     // "Locked in." (the affirmation)
    nextMicroStep?: string;    // "→ Open WhatsApp below and message one prospect (60 seconds)" — the immediate next action that removes ambiguity after the lock-in
  };
  examples?: PlaygroundExamples; // Structured examples shown as cards (lifts them out of the textarea)
  // Post-generation success-state variant. When set to 'action-first', the
  // success state renders a clean vertical flow optimised around the primary
  // action (Send via WhatsApp, etc.) and demotes/hides the comparison +
  // why-it-worked + open refinement chip blocks. The classic flow remains
  // the default — switch a session over only after live calibration.
  successStyle?: 'action-first' | 'classic';
  // Outcome-driven Generate button label. Replaces "✨ Generate with AI"
  // with task-specific framing like "Generate My First Earnings Map" so the
  // user knows exactly what they'll get. Per-session override.
  generateButtonLabel?: string;
  // Channel chips rendered as a small "Use this in" row in the action-first
  // success state. Identifiers map to icons + labels in the component.
  // Examples: ['whatsapp', 'instagram', 'linkedin', 'email', 'sms'].
  useThisIn?: string[];
  // Repeat-loop strip: tomorrow's nudge + an optional progress counter.
  // Renders below the finish line in the action-first flow to create
  // momentum across days, not just within a single session.
  repeatLoop?: {
    tomorrow: string;       // "Tomorrow: send to one more business"
    counter?: string;       // "0/5 messages sent" — local-only in v1
  };
  // Soft identity nudge before the continue CTA in the action-first flow.
  // Reinforces action-over-perfection. Shorter than yourTurnTemplate — this
  // is a one-liner, not a full re-prompt.
  yourTurnNudge?: string;   // "Done > perfect. Send it now, refine tomorrow."
}

export interface LearnModule {
  session: number;
  title: string;
  description: string;
  week: number;
  tools: string[];
  isFree: boolean;
  deliverable: string;
  previewQuestions: { q: string; options: string[]; answer: number }[];
  playgroundTask?: PlaygroundTask;
}

export interface CourseConfig {
  id: string;
  title: string;
  slug: string;
  totalSessions: number;
  filePrefix: string; // 'session' for Tools Mastery, 'claude' for Master Claude
  tagline?: string;
  description?: string;
  audience?: string;
  duration?: string;
  icon?: string;
  originalPrice?: number;
  onlinePrice?: number;
  highlights?: string[];
  modules: LearnModule[];
}

export const courseConfigs: Record<string, CourseConfig> = {
  'ai-tools-mastery-beginners': {
    id: 'ai-tools-mastery-beginners',
    tagline: 'Zero to AI-confident in 16 sessions',
    description: 'The perfect starting point for anyone new to AI. Learn ChatGPT, Claude, Gemini, and 10+ tools through hands-on projects. No coding, no jargon — just practical AI skills you can use from Day 1.',
    audience: 'Complete beginners, students, small business owners, professionals wanting to add AI to their toolkit',
    duration: '4 weeks (16 sessions)',
    icon: '🚀',
    originalPrice: 4999,
    onlinePrice: 999,
    highlights: ['Master ChatGPT, Claude & Gemini', 'Build a personal prompt library', 'Create Custom GPTs for business', 'No coding required — 100% beginner-friendly'],
    title: 'AI Tools Mastery for Beginners',
    slug: 'ai-tools-mastery-beginners',
    totalSessions: 16,
    filePrefix: 'session',
    modules: [
      {
        session: 1,
        title: 'What is AI?',
        description: 'Understand AI, meet ChatGPT, Claude & Gemini',
        week: 1,
        tools: ['ChatGPT', 'Claude', 'Gemini'],
        isFree: true,
        deliverable: 'First AI conversations + understanding of AI types',
        previewQuestions: [
          { q: 'What does AI stand for?', options: ['Automatic Intelligence', 'Artificial Intelligence', 'Advanced Internet'], answer: 1 },
          { q: 'Which of these is an AI tool?', options: ['Microsoft Word', 'ChatGPT', 'Calculator'], answer: 1 },
          { q: 'Can AI replace human creativity completely?', options: ['Yes, very soon', 'No, it augments human creativity', 'Only in art'], answer: 1 },
        ],
        playgroundTask: {
          taskTitle: 'Your First AI Task',
          taskDescription: 'Create a professional WhatsApp message using AI.',
          timeEstimate: 'Takes 2 minutes',
          starterPrompt: `Write a professional WhatsApp message for:
A student asking for internship

Tone: polite + confident
Length: short`,
          proTipChips: ['Tone', 'Length', 'Audience'],
          outroLine: 'You just saved 15 minutes of work',
          outputHeadline: 'Your WhatsApp Message — Ready to Send',
          successHeadline: 'This is YOUR first AI deliverable. Send it now.',
          refinementChips: [
            { label: '✂️ Make it shorter', instruction: 'Now rewrite this in half the words. Keep the polite + confident tone.' },
            { label: '🇮🇳 Reply in Punjabi', instruction: 'Now translate this message into Punjabi (Gurmukhi script), keeping the same warmth.' },
            { label: '🤝 Add a follow-up line', instruction: 'Add one short follow-up line at the end politely asking for a 5-minute call this week.' },
          ],
          realWorldActions: [
            { label: '📱 Send via WhatsApp', action: { type: 'whatsapp' } },
            { label: '📋 Copy message', action: { type: 'copy' } },
          ],
        },
      },
      {
        session: 2,
        title: 'The AI Mindset',
        description: 'Ethics, careers, and the right approach to AI',
        week: 1,
        tools: [],
        isFree: false,
        deliverable: 'AI career plan + responsible use pledge',
        previewQuestions: [
          { q: 'What is the most important thing when using AI at work?', options: ['Speed', 'Responsibility & accuracy checks', 'Using the most expensive tool'], answer: 1 },
          { q: 'AI hallucination means AI…', options: ['Gets tired', 'Generates false information confidently', 'Only works at night'], answer: 1 },
          { q: 'Which skill becomes MORE valuable when AI exists?', options: ['Typing speed', 'Critical thinking', 'Memorizing facts'], answer: 1 },
        ],
        playgroundTask: {
          taskTitle: 'Your AI Career Plan',
          taskDescription: 'Get a personalised 30-day plan for learning AI on your career path.',
          timeEstimate: 'Takes 3 minutes',
          starterPrompt: `I am a 12th grade student in Punjab interested in starting a small business.
I have 1 hour per day to learn AI tools.

Create a 30-day plan for me with:
- Which 2 AI tools to focus on each week
- One small project I can complete every weekend
- A portfolio piece I can show clients by Day 30
- One ethical rule I should follow when using AI for clients`,
          proTipChips: ['Goal', 'Timeframe', 'Background'],
          outroLine: 'You have a 30-day roadmap you can start tomorrow.',
          outputHeadline: 'Your Personal 30-Day AI Business Plan — Ready to Execute',
          successHeadline: 'You now have a step-by-step roadmap to start your AI journey.',
          refinementChips: [
            { label: '💼 More portfolio focus', instruction: 'Now revise the plan so I have 4 portfolio pieces by Day 30 instead of 2 — more varied across content, marketing and design.' },
            { label: '⏱️ Make it 15-day plan', instruction: 'Now compress this into a focused 15-day plan instead of 30 days. Keep the same quality of deliverables.' },
            { label: '₹ Add a budget', instruction: 'Now add a "Cost" line to each week showing me which tools are free vs paid and budget for the cheapest paid path under ₹500/month.' },
          ],
          realWorldActions: [
            { label: '📋 Copy my plan', action: { type: 'copy' } },
            { label: '📧 Email plan to myself', action: { type: 'email' } },
          ],
        },
      },
      {
        session: 3,
        title: 'Prompt Engineering Basics',
        description: 'The RCTF framework for better AI outputs',
        week: 1,
        tools: ['ChatGPT', 'Claude'],
        isFree: false,
        deliverable: '20 structured prompts using RCTF framework',
        previewQuestions: [
          { q: 'What does RCTF stand for in prompting?', options: ['Role, Context, Task, Format', 'Request, Create, Test, Fix', 'Read, Confirm, Think, Finish'], answer: 0 },
          { q: 'A vague prompt gives you…', options: ['Precise results', 'Vague, generic results', 'Better creativity'], answer: 1 },
          { q: 'Which prompt is better?', options: ['"Write something"', '"Write a 3-sentence email to a client apologizing for a delay"', '"Email about delay"'], answer: 1 },
        ],
        playgroundTask: {
          taskTitle: 'Your First 4/4 RCTF Prompt',
          taskDescription: 'Run a fully-structured RCTF prompt and see the quality jump for yourself.',
          timeEstimate: 'Takes 2 minutes',
          starterPrompt: `Act as a senior content marketing strategist with 10 years' experience.

Context: I run a small online sweets shop in Punjab, India. My target customers are families ordering for festivals (Diwali, Karva Chauth). My ad budget is ₹3,000 per month.

Task: Write 5 Instagram caption ideas that drive Diwali pre-orders.

Format: For each caption give me:
- Full caption text (under 180 characters)
- The single best emoji to use
- A specific CTA (DM, WhatsApp, link)`,
          proTipChips: ['Role', 'Context', 'Task', 'Format'],
          outroLine: 'You ran a real 4/4 RCTF prompt and felt the quality.',
          outputHeadline: 'Your AI Output — Generated from a 4/4 RCTF Prompt',
          successHeadline: 'This is what a structured prompt produces. Now write your own.',
          refinementChips: [
            { label: '🥖 Switch to a bakery', instruction: 'Now keep the same RCTF structure but rewrite for a small bakery in Amritsar selling for Christmas instead of Diwali.' },
            { label: '🇮🇳 Add Hindi versions', instruction: 'Now add a Hindi (Devanagari) version of each caption alongside the English one.' },
            { label: '💸 Cut budget to ₹1,000', instruction: 'Now adjust the strategy assuming the ad budget is only ₹1,000/month — lean harder on organic reach.' },
          ],
          realWorldActions: [
            { label: '📋 Copy this output', action: { type: 'copy' } },
            { label: '📧 Email it to myself', action: { type: 'email' } },
          ],
          comparison: {
            basicPromptLabel: 'Write 5 Instagram captions for a sweets shop in Punjab.',
            basicOutput: `1. 🎉 Try our delicious sweets today! Visit us for the best mithai in Punjab. #sweets #mithai #punjab

2. ✨ Premium quality sweets handcrafted with love. Order now! #punjabisweets #mithai

3. 🍬 Sweetness in every bite! Check out our amazing collection. DM for orders. #sweetshop

4. 😋 The taste of tradition. Quality you can trust. Visit our store today! #indiansweets

5. 🌟 Make your celebrations sweeter with us. Order now and enjoy! #celebration #sweets`,
          },
          whyItWorked: {
            heading: 'Why your RCTF prompt produced 10× better output',
            bullets: [
              '**Role** — "senior content marketing strategist with 10 years\' experience" → Claude wrote with authority instead of generic AI voice.',
              '**Context** — "Punjab sweets shop, Diwali/Karva Chauth families, ₹3,000 budget" → every caption referenced festivals, culture, and budget-aware tactics.',
              '**Task** — "5 Instagram caption ideas that drive Diwali pre-orders" → output was decisive and on-brief, not a generic dump.',
              '**Format** — "caption + best emoji + specific CTA" → structured output you can copy-paste straight into Instagram.',
            ],
          },
          yourTurnTemplate: `Act as a senior content marketing strategist with 10 years' experience.

Context: I run a [YOUR BUSINESS — e.g. saree boutique, fitness studio, tutoring centre] in [YOUR CITY/TOWN]. My target customers are [YOUR CUSTOMERS — e.g. working women aged 25-40]. My ad budget is ₹[YOUR BUDGET] per month.

Task: Write 5 [PLATFORM — Instagram / WhatsApp / Facebook] captions that drive [YOUR GOAL — bookings / orders / signups].

Format: For each caption give me:
- Full caption text (under 180 characters)
- The single best emoji to use
- A specific CTA (DM, WhatsApp, link)`,
          yourTurnHeadline: 'Now write your own RCTF prompt',
          yourTurnBody: 'Reading examples doesn\'t teach the skill — writing one for your own business or idea does. Click below to swap in a template, fill in YOUR details, and generate again.',
        },
      },
      {
        session: 4,
        title: 'Advanced Prompting',
        description: 'Chain-of-thought, few-shot, and prompt libraries',
        week: 1,
        tools: ['ChatGPT', 'Claude', 'Gemini'],
        isFree: false,
        deliverable: 'Personal prompt library with 30+ categorized prompts',
        previewQuestions: [
          { q: 'What is "few-shot" prompting?', options: ['Using AI only a few times', 'Giving AI examples to follow', 'Writing short prompts'], answer: 1 },
          { q: 'Chain-of-thought prompting helps AI…', options: ['Write shorter answers', 'Reason step-by-step through problems', 'Use less energy'], answer: 1 },
          { q: 'A prompt library is useful because…', options: ['It costs less', 'It saves time by reusing proven prompts', 'AI prefers libraries'], answer: 1 },
        ],
        playgroundTask: {
          taskTitle: 'Clone a Brand Voice with Few-Shot',
          taskDescription: 'Teach Claude a specific writing style using 3 examples — then watch it write 5 new pieces in the exact same voice.',
          timeEstimate: 'Takes 3 minutes',
          // Short, focused starter — the 3 examples now live in `examples`
          // (rendered as cards above the textarea) so the user isn't drowning
          // in text before they can hit Generate.
          starterPrompt: `Write 5 NEW product descriptions in the exact same voice as the examples above for these products:

1. Cold-pressed coconut oil for hair, 200ml
2. Handmade Punjabi juttis, men's black, size 9
3. Wildflower honey from Kullu, 500g
4. Cotton kurta, ivory white, size M
5. Organic raw sweetcorn, 1kg`,
          proTipChips: ['Examples', 'Pattern', 'Voice'],
          outroLine: 'You taught the AI a brand voice from 3 examples — that\'s a real freelance skill.',
          outputHeadline: '✨ AI Has Learned Your Brand Voice',
          successHeadline: 'You\'ve trained AI on your own brand voice.',
          continueButtonLabel: 'Use this voice for your product → Continue to Session 5',
          examples: {
            intro: 'Read these 3 examples carefully — Claude will study them and clone the voice.',
            visibleByDefault: 1,
            items: [
              {
                label: 'Hand-pressed Patiala mustard oil, 250ml',
                text: 'Strong roots, ancient method. Cold-pressed in clay drums for 90 days. Three drops before bath, two months to see thicker hair. ₹299. Made in our village, not a factory.',
              },
              {
                label: 'Handloom Phulkari dupatta, mustard yellow',
                text: 'Stitched by Amritsar grandmothers. Each thread takes 4 hours. Lasts a generation if you don\'t wash it in cold water. ₹2,400. Only 12 made this season.',
              },
              {
                label: 'Organic ajwain, 100g',
                text: 'From the same field your grandmother bought from. No pesticides, sun-dried for 6 days. Half a teaspoon after dinner — your stomach will thank you. ₹149. We ship Tuesday and Friday.',
              },
            ],
          },
          refinementChips: [
            { label: '💎 Make voice more luxe', instruction: 'Now rewrite the 5 new descriptions in a more premium / luxury voice while keeping the same length and structure.' },
            { label: '✂️ Under 30 words each', instruction: 'Now compress each of the 5 descriptions to under 30 words while keeping the voice and key sensory details.' },
            { label: '💰 Add price psychology', instruction: 'Now rewrite each with a small psychological hook (scarcity, social proof, anchor) — keep the same voice.' },
          ],
          realWorldActions: [
            { label: '📋 Copy this output', action: { type: 'copy' } },
            { label: '📧 Email it to myself', action: { type: 'email' } },
          ],
          // Comparison reframed for voice cloning: the LEFT card shows the
          // SOURCE examples (the original style), the RIGHT card shows the
          // generated output. Student instantly sees the voice transfer.
          comparison: {
            basicPromptLabel: 'The voice from your 3 source examples',
            basicOutput: `**Patiala mustard oil:** "Strong roots, ancient method. Cold-pressed in clay drums for 90 days. ₹299. Made in our village, not a factory."

**Phulkari dupatta:** "Stitched by Amritsar grandmothers. Each thread takes 4 hours. ₹2,400. Only 12 made this season."

**Organic ajwain:** "From the same field your grandmother bought from. ₹149. We ship Tuesday and Friday."`,
            leftHeader: '📚 Your 3 source examples',
            rightHeader: '✨ AI matched the voice',
            leftSubLabel: 'Original style',
            rightSubLabel: 'Generated style',
          },
          whyItWorked: {
            heading: 'Why your few-shot prompt cloned the voice perfectly',
            bullets: [
              '**3 examples > 50 instructions** — you taught Claude the *pattern* (sentence rhythm, what to mention) instead of explaining rules.',
              '**Specificity transferred** — Claude copied the small details: ₹ price format, location mention, "ship Tuesday and Friday"-style proof.',
              '**No "premium" or "engaging" filler** — your examples didn\'t use those words, so Claude didn\'t either.',
              '**Voice consistency** — all 5 outputs read like the same person wrote them, because they were trained on the same 3 examples.',
            ],
          },
          // Your Turn keeps the full bracketed prompt inline (since the user
          // is now editing the examples themselves). Examples cards hide once
          // they enter Your Turn mode.
          // Just the items list — examples cards above stay visible, so the
          // student only edits the 5 product names. One small action, real
          // ownership: "I got descriptions for MY actual products in this voice."
          yourTurnTemplate: `Write 5 NEW product descriptions in the exact same voice as the examples above for these products:

1. [YOUR PRODUCT 1 — e.g. "Saffron-infused mustard oil, 200ml"]
2. [YOUR PRODUCT 2]
3. [YOUR PRODUCT 3]
4. [YOUR PRODUCT 4]
5. [YOUR PRODUCT 5]`,
          yourTurnHeadline: 'Now generate this for YOUR products',
          yourTurnBody: 'Replace the 5 product names in the textarea with your own — Claude will write descriptions for them in the exact same voice. That\'s the moment the skill becomes yours.',
        },
      },
      {
        session: 5,
        title: 'Mastering ChatGPT & Claude',
        description: 'Deep dive into the two most powerful AI tools',
        week: 2,
        tools: ['ChatGPT', 'Claude'],
        isFree: false,
        deliverable: 'Tool comparison report: 5 tasks on both tools',
        previewQuestions: [
          { q: 'ChatGPT was created by…', options: ['Google', 'OpenAI', 'Microsoft'], answer: 1 },
          { q: 'Claude is known for being especially…', options: ['Fast at math', 'Safe and nuanced in responses', 'Best for image generation'], answer: 1 },
          { q: 'When should you use both ChatGPT and Claude?', options: ['Never, pick one', 'When you want to compare outputs for quality', 'Only for coding'], answer: 1 },
        ],
        playgroundTask: {
          taskTitle: 'Design Your First Custom GPT',
          taskDescription: 'Get a complete Custom GPT spec you can paste into ChatGPT in 2 minutes — a real freelance product.',
          timeEstimate: 'Takes 2 minutes',
          starterPrompt: `Design a Custom GPT for this use case:

A WhatsApp tone polisher for small Punjab business owners. They paste rough Punjabi/English business messages, and it returns polished, polite, customer-friendly versions ready to send.

Give me the complete Custom GPT spec ready to paste into ChatGPT.`,
          proTipChips: ['User', 'Task', 'Output format'],
          outroLine: 'You built your first AI tool — paste it in ChatGPT and it works for you 24/7.',
          outputHeadline: '✨ Your Ready-to-Use AI Assistant',
          successHeadline: 'You just built your first AI tool.',
          continueButtonLabel: 'Test it with your own message → Continue to Session 6',
          refinementChips: [
            { label: '🇮🇳 Add Punjabi/Hindi handling', instruction: 'Now strengthen the instructions to handle Punjabi (Gurmukhi) and Hindi inputs with cultural nuance — not just translation.' },
            { label: '🎯 Niche to one industry', instruction: 'Now niche this GPT specifically for sweets shop owners (festivals, pre-orders, family customers) instead of general business.' },
            { label: '💼 Make it sellable', instruction: 'Now add a brief "How to monetise this GPT" section — how a freelancer could charge ₹500/month for access.' },
          ],
          // Primary action: open ChatGPT's GPT Builder with the spec already
          // copied — user pastes, tests, and walks away with a working tool.
          realWorldActions: [
            { label: '🚀 Open ChatGPT GPT Builder', action: { type: 'open-url', url: 'https://chatgpt.com/gpts/editor', copyFirst: true } },
            { label: '📋 Copy spec only', action: { type: 'copy' } },
            { label: '📧 Email to myself', action: { type: 'email' } },
          ],
          testReflection: {
            headline: '✅ You tested your AI assistant',
            prompt: 'What improved in YOUR message?',
            hint: 'Most users notice Tone & Clarity first.',
            chips: ['Tone', 'Clarity', 'Professionalism', 'Translation', 'Politeness'],
            identityLine: 'You just improved a real message using AI — this is a skill you can use daily.',
          },
          comparison: {
            basicPromptLabel: 'Make me a custom GPT for messaging.',
            basicOutput: `**Name:** Message Helper

**Description:** A GPT that helps you write messages.

**Instructions:** You are a helpful AI that writes good messages for users. Be friendly and helpful. Make sure messages are clear.

**Conversation Starters:** Help me write a message`,
            leftHeader: '🔸 Vague request',
            rightHeader: '🔹 With a clear use-case',
            leftSubLabel: 'Useless GPT',
            rightSubLabel: 'Real freelance product',
          },
          whyItWorked: {
            heading: 'Why your prompt produced a usable Custom GPT',
            bullets: [
              '**Specific user** — "Punjab business owners" is actionable; "users" is not.',
              '**Concrete task** — "polish rough Punjabi/English messages" defines the input AND output, not just a vibe.',
              '**Cultural anchor** — naming the language and customer type forces real instructions, not generic ones.',
              '**Output frame** — asking for the spec "ready to paste" forces the right structure (Name, Description, Instructions, Starters).',
            ],
          },
          yourTurnTemplate: `Design a Custom GPT for this use case:

[YOUR USE CASE — describe (a) WHO uses it, (b) WHAT they paste in, (c) WHAT they get back]

For example: "A bio-rewriter for Punjab handloom boutique owners. They paste their current Instagram bio. It returns 3 stronger versions with festival hooks and a clear CTA."

Give me the complete Custom GPT spec ready to paste into ChatGPT.`,
          yourTurnHeadline: 'Now build YOUR own AI tool',
          yourTurnBody: 'Pick a real workflow you (or a friend) repeat weekly — describe the user, what they paste in, what they get back. Walk away with a usable AI tool you can paste into ChatGPT today.',
        },
      },
      {
        session: 6,
        title: 'AI for Professional Writing',
        description: 'Emails, resumes, proposals with AI',
        week: 2,
        tools: ['ChatGPT', 'Claude'],
        isFree: false,
        deliverable: 'Professional email set + AI-optimized resume',
        previewQuestions: [
          { q: 'When using AI to write a professional email, you should…', options: ['Send it immediately without reading', 'Review and personalize before sending', 'Use the longest version'], answer: 1 },
          { q: 'AI can help improve your resume by…', options: ['Adding fake experience', 'Optimizing for keywords and clarity', 'Changing your name'], answer: 1 },
          { q: 'Which tone is best for a client proposal?', options: ['Casual and funny', 'Professional and solution-focused', 'Very formal and long'], answer: 1 },
        ],
        playgroundTask: {
          taskTitle: 'Write a Client Proposal That Wins',
          taskDescription: 'Generate a complete client proposal — sectioned, persuasive, send-ready. The single most valuable freelance document.',
          timeEstimate: 'Takes 3 minutes',
          starterPrompt: `Write a client proposal for this scenario:

CLIENT: A small Punjab sweets shop owner (Diwali pre-order season approaching, never used AI)
SERVICE I OFFER: AI-powered Diwali Instagram marketing — 5 Reels per week + 15 captions + 2 carousel ads
PRICING: ₹15,000 per month
TIMELINE: Start Oct 1, 6-week Diwali sprint
ME: 3 portfolio pieces, AI-trained at TARAhut, based in Kotkapura

Write a proposal that wins this client.`,
          proTipChips: ['Their problem', 'Your solution', 'Investment'],
          outroLine: 'You have a complete proposal you could send to a real client tomorrow.',
          outputHeadline: '✨ Your Client Proposal — Send-Ready',
          successHeadline: 'This is a real proposal you can send today to get your first client.',
          continueButtonLabel: 'Send your first proposal → Continue to Session 7',
          useWhereHint: '📤 Send this to a real local business via:',
          sendCommit: {
            prompt: 'Did you send this to a real business?',
            yesLabel: '✅ Yes, sent it',
            noLabel: '🤔 Not yet',
            yesReinforcement: '🚀 You just took your first real step toward getting a client.',
            noNudge: '👋 Pick one local business and send it now — it takes 30 seconds.',
          },
          refinementChips: [
            { label: '✂️ Cut to one page', instruction: 'Now compress this to fit on a single A4 page (under 350 words) without losing the persuasive hooks.' },
            { label: '🎁 Add a free trial offer', instruction: 'Now add a "Try me first" section offering 1 free Reel before commitment, with terms.' },
            { label: '📱 Make it WhatsApp-friendly', instruction: 'Now reformat as a WhatsApp message thread (3-5 short messages) instead of a formal proposal.' },
          ],
          // Channel-specific send buttons — the hint above introduces them.
          // Instagram + LinkedIn don't have direct-DM URL schemes, so we open
          // their messaging inboxes after copying the proposal so the user
          // can paste straight in.
          realWorldActions: [
            { label: '💬 Send via WhatsApp', action: { type: 'whatsapp' } },
            { label: '📧 Email to prospect', action: { type: 'email' } },
            { label: '📩 Open Instagram DM', action: { type: 'open-url', url: 'https://www.instagram.com/direct/inbox/', copyFirst: true } },
            { label: '💼 Open LinkedIn DM', action: { type: 'open-url', url: 'https://www.linkedin.com/messaging/', copyFirst: true } },
            { label: '📋 Copy', action: { type: 'copy' } },
          ],
          comparison: {
            basicPromptLabel: 'Write a client proposal for Diwali Instagram marketing.',
            basicOutput: `**Proposal for Diwali Instagram Marketing**

Dear Sir,

I would like to provide you with our Instagram marketing services for the upcoming Diwali season. We offer high-quality content creation including reels, captions, and carousel ads that will drive engagement for your business.

Our pricing is competitive and we deliver excellent results. Please let me know if you are interested.

Thank you,
[Name]`,
            leftHeader: '🔸 Generic proposal',
            rightHeader: '🔹 With sectioned structure',
            leftSubLabel: 'Won\'t win the client',
            rightSubLabel: 'Send-ready',
          },
          whyItWorked: {
            heading: 'Why your structured proposal lands the deal',
            bullets: [
              '**Their problem first** — you led with their pain (Diwali season, no AI experience), not your service.',
              '**Specific deliverables** — "5 Reels per week" beats "high-quality content".',
              '**Investment frame** — "₹15,000/month" presented as ROI, not cost.',
              '**Local proof** — Kotkapura + TARAhut credibility resonates with Punjab business owners.',
            ],
          },
          yourTurnTemplate: `Write a client proposal for this scenario:

CLIENT: [YOUR PROSPECT — describe their business + situation]
SERVICE I OFFER: [WHAT YOU\'RE SELLING — be specific about deliverables]
PRICING: [YOUR PRICE — monthly fee or project fee]
TIMELINE: [WHEN YOU START + HOW LONG]
ME: [YOUR CREDIBILITY — portfolio, training, location]

Write a proposal that wins this client.`,
          yourTurnHeadline: 'Now write a proposal for YOUR real prospect',
          yourTurnBody: 'Pick someone you actually want as a client (a friend\'s business, a local shop, a LinkedIn connection). Replace the brackets with their real details, then generate.',
        },
      },
      {
        session: 7,
        title: 'AI Research Tools',
        description: 'Perplexity and NotebookLM for deep research',
        week: 2,
        tools: ['Perplexity', 'NotebookLM'],
        isFree: false,
        deliverable: 'Cited research report using Perplexity + NotebookLM',
        previewQuestions: [
          { q: 'Perplexity AI is best described as…', options: ['An image generator', 'An AI-powered search engine with citations', 'A video editor'], answer: 1 },
          { q: 'NotebookLM lets you…', options: ['Generate images from text', 'Chat with your own uploaded documents', 'Schedule social media posts'], answer: 1 },
          { q: 'Why are citations important in AI research?', options: ['They make documents longer', 'They let you verify the source and accuracy', 'AI requires them to function'], answer: 1 },
        ],
        playgroundTask: {
          taskTitle: 'Generate a Research Brief',
          taskDescription: 'Get a structured research brief on any business topic — with verification pointers so you don\'t get fooled by AI hallucinations.',
          timeEstimate: 'Takes 2 minutes',
          starterPrompt: `Research brief on this topic:

TOPIC: AI adoption in small Punjab businesses (fewer than 50 employees)
AUDIENCE: An AI freelancer writing a pitch for local clients
WHAT I NEED: What's working, what's not, and 3 specific opportunities I can sell against

Format the brief so I can use it in a sales conversation tomorrow.`,
          proTipChips: ['Topic', 'Audience', 'Use case'],
          outroLine: 'You have a research-grade brief in 2 minutes — what used to take 4 hours.',
          outputHeadline: '✨ Your Research Brief — Sales-Ready',
          successHeadline: 'This is how you sound like an expert without years of experience.',
          continueButtonLabel: 'Use this to start a real conversation → Continue to Session 8',
          useWhereHint: '📤 Use ONE insight from above to start a real conversation today:',
          intentCommit: {
            reinforcement: 'Say the opener line above out loud once — then send it or use it in your next conversation.',
            ctaLabel: '✔ I\'ll use this today',
            confirmedLine: 'Locked in.',
            nextMicroStep: 'Do it now — tap WhatsApp below and send one message (takes 60 seconds)',
          },
          refinementChips: [
            { label: '🎯 Narrow to one industry', instruction: 'Now narrow the brief specifically to Punjab sweets shops (festival-driven retail) — drop everything not relevant to that niche.' },
            { label: '📊 Add data points', instruction: 'Now add 5 specific numbers / statistics I can quote (acknowledge if uncertain — never invent stats).' },
            { label: '❓ Add objection handlers', instruction: 'Now add 3 likely objections from a hesitant client + a one-line response to each.' },
          ],
          // Channel openers (no pre-fill) — the user is meant to extract ONE
          // insight and start a conversation in their OWN words. We open the
          // channel; they bring the insight + the human voice.
          realWorldActions: [
            { label: '💬 Open WhatsApp', action: { type: 'open-url', url: 'https://web.whatsapp.com/' } },
            { label: '📧 Open Email', action: { type: 'open-url', url: 'mailto:' } },
            { label: '📋 Copy brief for reference', action: { type: 'copy' } },
          ],
          yourTurnTemplate: `Research brief on this topic:

TOPIC: [YOUR REAL TOPIC — e.g. "Instagram engagement trends for Punjab boutiques in 2026"]
AUDIENCE: [WHO WILL READ THIS — e.g. "a saree shop owner I'm pitching"]
WHAT I NEED: [YOUR USE CASE — e.g. "3 hooks I can lead with in a WhatsApp pitch"]

Format the brief so I can use it in a sales conversation tomorrow.`,
          yourTurnHeadline: 'Now research YOUR real topic',
          yourTurnBody: 'Pick a topic you need to discuss with a real prospect THIS WEEK — replace the brackets and generate. Then walk into the conversation with ONE insight that makes you sound like the expert in the room.',
        },
      },
      {
        session: 8,
        title: 'Presentations & Design',
        description: 'Gamma and Canva AI for visual content',
        week: 2,
        tools: ['Gamma', 'Canva AI'],
        isFree: false,
        deliverable: '10-slide pitch deck + social media graphics',
        previewQuestions: [
          { q: 'Gamma AI helps you…', options: ['Edit videos', 'Create presentations from a text prompt', 'Write code'], answer: 1 },
          { q: 'The rule of thumb for slides is…', options: ['As much text as possible', 'One clear idea per slide', 'Only use images, no text'], answer: 1 },
          { q: 'Canva AI\'s "Magic Design" feature…', options: ['Requires design experience', 'Generates design templates from your content', 'Only works on desktop'], answer: 1 },
        ],
        playgroundTask: {
          taskTitle: 'Generate Your Pitch Deck Outline',
          taskDescription: 'Get an 8-slide pitch deck outline — narrative-driven, slide-by-slide, ready to paste into Gamma.',
          timeEstimate: 'Takes 3 minutes',
          starterPrompt: `Generate an 8-slide pitch deck outline for this scenario:

I AM PITCHING: AI-powered Instagram marketing services
TO: A 45-year-old saree boutique owner in Patiala who wants more young (25-40) customers
MY FEE: ₹12,000/month
PITCH LENGTH: 7 minutes
GOAL: Get a 30-day trial signed today

Deck must be narrative — each slide builds on the last.`,
          proTipChips: ['Audience', 'Goal', 'Length'],
          outroLine: 'You have a narrative deck outline ready to present to a real client.',
          outputHeadline: '✨ Your Pitch Deck — 8 Slides, Story-Driven',
          successHeadline: 'This is a pitch you can use to close a real client.',
          continueButtonLabel: 'Present this to a real client → Continue to Session 9',
          useWhereHint: '📤 Use this in: 🤝 in-person meeting · 📱 WhatsApp PDF · 💻 Zoom call',
          intentCommit: {
            reinforcement: 'Run through your hook slide out loud once — then book one real client meeting this week to present it.',
            ctaLabel: '✔ I\'ll present this this week',
            confirmedLine: 'Locked in.',
            nextMicroStep: 'Build it now — tap "Build in Gamma" below (2 mins)',
          },
          refinementChips: [
            { label: '⏱️ Cut to 5 slides', instruction: 'Now compress this to a 5-slide version for a 3-minute pitch — keep only what drives the close.' },
            { label: '📈 Add a results slide', instruction: 'Now add a slide showing 2 hypothetical 30/60/90-day result projections so the prospect sees a clear payoff.' },
            { label: '🎨 Add visual direction', instruction: 'Now add a 1-line visual/imagery direction for each slide (mood, photo style, key visual).' },
          ],
          // Channel openers — Gamma + Canva are the build tools. Both copy
          // the outline first so the user pastes straight in. Email for
          // sharing as a doc, Copy for clipboard-only.
          realWorldActions: [
            { label: '🚀 Build in Gamma', action: { type: 'open-url', url: 'https://gamma.app/create', copyFirst: true } },
            { label: '🎨 Build in Canva', action: { type: 'open-url', url: 'https://www.canva.com/create/presentations/', copyFirst: true } },
            { label: '📧 Email outline', action: { type: 'email' } },
            { label: '📋 Copy outline', action: { type: 'copy' } },
          ],
          comparison: {
            basicPromptLabel: 'Make me a pitch deck for Instagram marketing.',
            basicOutput: `**Slide 1:** Introduction
**Slide 2:** About Us
**Slide 3:** Services
**Slide 4:** Why Instagram?
**Slide 5:** Pricing
**Slide 6:** Portfolio
**Slide 7:** Contact
**Slide 8:** Thank You`,
            leftHeader: '🔸 Generic structure',
            rightHeader: '🔹 With audience + goal',
            leftSubLabel: 'Won\'t close',
            rightSubLabel: 'Closes',
          },
          whyItWorked: {
            heading: 'Why your deck outline actually flows',
            bullets: [
              '**Specific audience** — "45-year-old saree boutique owner" forces angle on age-gap (their customers are getting younger).',
              '**Concrete goal** — "Sign 30-day trial today" makes every slide work toward closing, not informing.',
              '**Time constraint** — 7 min limits to 8 slides, forces ruthless cuts.',
              '**Narrative mandate** — each slide builds, no orphan "About Us" slides that break flow.',
            ],
          },
          yourTurnTemplate: `Generate an 8-slide pitch deck outline for this scenario:

I AM PITCHING: [YOUR SERVICE]
TO: [YOUR PROSPECT — age, business, what they want]
MY FEE: [YOUR PRICE]
PITCH LENGTH: [YOUR TIME]
GOAL: [YOUR CLOSE — what action do they take by end?]

Deck must be narrative — each slide builds on the last.`,
          yourTurnHeadline: 'Now outline YOUR real pitch deck',
          yourTurnBody: 'Pick a real prospect you want to close THIS WEEK. Replace the brackets with their details. Then build the deck in Gamma or Canva and present it — that\'s how the skill becomes income.',
        },
      },
      {
        session: 9,
        title: 'AI Image Generation',
        description: 'Midjourney, Ideogram, and Canva AI for images',
        week: 3,
        tools: ['Midjourney', 'Ideogram', 'Canva AI'],
        isFree: false,
        deliverable: '10 brand images across multiple AI tools',
        previewQuestions: [
          { q: 'Ideogram is especially good at…', options: ['Writing code', 'Generating images with readable text', 'Making videos'], answer: 1 },
          { q: 'A good image prompt includes…', options: ['Just the subject name', 'Subject, style, mood, and composition', 'Only colors'], answer: 1 },
          { q: 'AI-generated images can be used for…', options: ['Only personal use', 'Business branding, marketing, and content (check license)', 'Nothing commercial'], answer: 1 },
        ],
        playgroundTask: {
          taskTitle: 'Build 5 Pro Midjourney Prompts',
          taskDescription: 'Get 5 production-quality Midjourney prompts with style, lighting, composition, and aspect ratio — copy-paste ready.',
          timeEstimate: 'Takes 2 minutes',
          starterPrompt: `Generate 5 Midjourney prompts for this campaign:

USE CASE: Instagram square ads for a Punjab handloom Phulkari boutique
AUDIENCE: Indian women aged 25-40 who love festive wear
GOAL: Drive boutique walk-ins for the Karva Chauth season
EACH PROMPT MUST DIFFER in mood/angle (not 5 variations of the same shot)

Format each as a complete Midjourney prompt with style modifiers and aspect ratio (1:1).`,
          proTipChips: ['Subject', 'Style', 'Composition'],
          outroLine: 'You have 5 publish-ready image prompts that took pros hours to write.',
          outputHeadline: '✨ Your 5 Midjourney Prompts — Ready to Generate',
          successHeadline: 'These are ready-to-use prompts for real campaign visuals.',
          continueButtonLabel: 'Generate your first images → Continue to Session 10',
          useWhereHint: '📤 Use these for: 📸 Instagram ads · 📱 WhatsApp creatives · 🖼️ product banners',
          finishLine: {
            primary: '🏁 Generate 3-5 images per prompt and pick 1 you\'d actually post today.',
            microNudge: '💡 Start with Prompt 1 — it\'s your strongest angle.',
            followThroughNudge: '📲 Post it on Instagram or send it on WhatsApp now — this is where it turns into results.',
          },
          refinementChips: [
            { label: '🎬 Switch to cinematic style', instruction: 'Now rewrite all 5 in a cinematic / editorial photography style instead of commercial product photography.' },
            { label: '📱 Make 4:5 portrait', instruction: 'Now adjust all 5 prompts for Instagram Reels covers — 4:5 aspect ratio, vertical composition.' },
            { label: '🌅 Add seasonal lighting', instruction: 'Now add specific golden-hour Diwali lighting (warm, festive, lamplit) to each prompt.' },
          ],
          // Channel openers — direct launchers into the image-generation
          // tools, with prompts copied first so the user pastes straight in.
          realWorldActions: [
            { label: '🎨 Open Midjourney', action: { type: 'open-url', url: 'https://www.midjourney.com/imagine', copyFirst: true } },
            { label: '✨ Open Ideogram', action: { type: 'open-url', url: 'https://ideogram.ai/t/explore', copyFirst: true } },
            { label: '🖌 Open Leonardo', action: { type: 'open-url', url: 'https://app.leonardo.ai/image-generation', copyFirst: true } },
            { label: '📋 Copy all prompts', action: { type: 'copy' } },
          ],
          comparison: {
            basicPromptLabel: 'Phulkari boutique Instagram ads.',
            basicOutput: `1. A Phulkari dupatta on a model. Bright colors. Beautiful style.

2. Indian woman wearing a Phulkari dupatta. Festive look.

3. Phulkari Indian fashion. Traditional style. High quality.

4. Beautiful Phulkari design. Punjab fashion. Pretty model.

5. Indian festive wear. Phulkari embroidery. Stunning visuals.`,
            leftHeader: '🔸 Vague prompts',
            rightHeader: '🔹 With style + composition',
            leftSubLabel: 'AI guesses',
            rightSubLabel: 'AI delivers',
          },
          whyItWorked: {
            heading: 'Why your prompts produced usable images',
            bullets: [
              '**Use case anchored** — "boutique walk-ins for Karva Chauth" forces seasonal mood, not generic "fashion".',
              '**Audience-specific** — "Indian women 25-40, festive" filters out wedding-couture / runway / Western styles.',
              '**Style modifiers** — naming the photography style (commercial, editorial, candid) makes Midjourney consistent.',
              '**Differentiated angles** — mandating each prompt differs prevents 5 variations of the same shot.',
            ],
          },
          yourTurnTemplate: `Generate 5 Midjourney prompts for this campaign:

USE CASE: [YOUR USE CASE — e.g. "Instagram ads for my Bathinda fitness studio"]
AUDIENCE: [YOUR TARGET — e.g. "women 30-45 who want to lose weight after pregnancy"]
GOAL: [YOUR GOAL — e.g. "drive trial class signups"]
EACH PROMPT MUST DIFFER in mood/angle.

Format each as a complete Midjourney prompt with style modifiers and aspect ratio.`,
          yourTurnHeadline: 'Now write prompts for YOUR real campaign',
          yourTurnBody: 'Pick a real campaign you (or a friend) is running THIS WEEK. Fill in the brackets, generate the 5 prompts, then run them in Midjourney or Ideogram — your first publishable AI visuals.',
        },
      },
      {
        session: 10,
        title: 'AI Video Creation',
        description: 'HeyGen avatars and CapCut editing',
        week: 3,
        tools: ['HeyGen', 'CapCut'],
        isFree: false,
        deliverable: '60-second AI avatar brand video',
        previewQuestions: [
          { q: 'HeyGen allows you to…', options: ['Generate music', 'Create AI avatar videos that speak your script', 'Build websites'], answer: 1 },
          { q: 'A 60-second brand video should focus on…', options: ['Every feature of your product', 'One clear message or call-to-action', 'Only showing your logo'], answer: 1 },
          { q: 'CapCut is used for…', options: ['Writing scripts', 'Editing and enhancing video content', 'Generating avatars'], answer: 1 },
        ],
        playgroundTask: {
          taskTitle: 'Write a 60-Second Promo Script',
          taskDescription: 'Generate a 60-second video script with shot list — Hook → Value → Proof → CTA — ready for HeyGen or CapCut.',
          timeEstimate: 'Takes 2 minutes',
          starterPrompt: `Write a 60-second promo video script for this scenario:

PRODUCT: A Punjab sweets shop launching Diwali pre-orders
TARGET VIEWER: Punjabi families ordering 1-2 weeks before Diwali
GOAL: Drive WhatsApp pre-orders before festival rush
PLATFORM: Instagram Reels + WhatsApp status

Script must follow 5-sec HOOK → 30-sec VALUE → 15-sec PROOF → 10-sec CTA. Include a shot list per beat.`,
          proTipChips: ['Hook', 'Value', 'CTA'],
          outroLine: 'You have a video script ready to record and post today — what used to take a copywriter ₹8,000.',
          outputHeadline: '✨ Your 60-Second Video Script — Ready to Record',
          successHeadline: 'This is a video you can record and post today to get real customers.',
          continueButtonLabel: 'Post your first video → Continue to Session 11',
          useWhereHint: '📤 Use this for: 🎥 Instagram Reels · 📱 WhatsApp Status · ▶️ YouTube Shorts',
          intentCommit: {
            reinforcement: 'Read your hook out loud once — then record it in 1-2 takes today. Don\'t wait for the perfect moment.',
            ctaLabel: '✔ I\'ll record and post this today',
            confirmedLine: 'Locked in.',
            nextMicroStep: 'Record it now — tap CapCut below and capture your hook (60 seconds)',
          },
          finishLine: {
            primary: '🏁 Record this in 1-2 takes — don\'t aim for perfect, aim for posted.',
            microNudge: '💡 Start with the Hook only — once you record the first 5 seconds, the rest flows.',
            followThroughNudge: '📲 Post it now on Reels or WhatsApp Status — that\'s where this turns into leads.',
          },
          refinementChips: [
            { label: '⏱️ Make it 30-second', instruction: 'Now compress to a 30-second version — keep the hook and CTA, halve the value section.' },
            { label: '🇮🇳 Punjabi voiceover', instruction: 'Now rewrite the dialogue in Punjabi (Gurmukhi script) — keep the same beats.' },
            { label: '😊 Add humour', instruction: 'Now add one quick humour beat in the hook (relatable family Diwali moment) — keep the rest serious.' },
          ],
          // Channel openers — tap straight into the recording / editing tool
          // with the script copied first. CapCut is mobile-native + free,
          // HeyGen is the AI-avatar route. Both are first-step options.
          realWorldActions: [
            { label: '🎬 Open CapCut', action: { type: 'open-url', url: 'https://www.capcut.com/editor', copyFirst: true } },
            { label: '🎥 Open HeyGen', action: { type: 'open-url', url: 'https://app.heygen.com/create', copyFirst: true } },
            { label: '📋 Copy script', action: { type: 'copy' } },
            { label: '📧 Email script', action: { type: 'email' } },
          ],
          yourTurnTemplate: `Write a 60-second promo video script for this scenario:

PRODUCT: [YOUR PRODUCT/SERVICE]
TARGET VIEWER: [WHO\'S WATCHING — be specific]
GOAL: [WHAT ACTION YOU WANT THEM TO TAKE]
PLATFORM: [WHERE IT\'LL POST — Reels / YouTube / WhatsApp]

Script must follow 5-sec HOOK → 30-sec VALUE → 15-sec PROOF → 10-sec CTA. Include a shot list per beat.`,
          yourTurnHeadline: 'Now write a script for YOUR real video',
          yourTurnBody: 'Pick a video you\'ll record TODAY — for your business or your first client. Fill in the brackets, generate the script, then record it in 1-2 takes. The skill becomes income only when you post.',
        },
      },
      {
        session: 11,
        title: 'AI Audio + Social Media',
        description: 'ElevenLabs voiceovers and content workflows',
        week: 3,
        tools: ['ElevenLabs'],
        isFree: false,
        deliverable: 'Brand audio kit + 7-day content calendar',
        previewQuestions: [
          { q: 'ElevenLabs is best known for…', options: ['Making images', 'Generating realistic AI voiceovers', 'Writing blog posts'], answer: 1 },
          { q: 'A content calendar helps you…', options: ['Post randomly when inspired', 'Plan and schedule consistent content', 'Delete old posts'], answer: 1 },
          { q: 'For social media, shorter content tends to…', options: ['Perform worse', 'Perform better due to attention spans', 'Only work on Twitter'], answer: 1 },
        ],
        playgroundTask: {
          taskTitle: 'Build a 7-Day Content Calendar',
          taskDescription: 'Get a complete 7-day Instagram calendar — daily hook, body, CTA, hashtags, format, post time. Stop guessing what to post.',
          timeEstimate: 'Takes 3 minutes',
          starterPrompt: `Build a 7-day Instagram content calendar for this account:

ACCOUNT: A new AI freelance content writer based in Bathinda
AUDIENCE: Small Punjab business owners (sweets shops, boutiques, coaching centres)
GOAL: Get 3 enquiries by Day 7
TONE: Friendly expert, locally rooted

Each day must have: hook (first line), body (1-2 sentences), CTA, 5 hashtags, format (Reel / Carousel / Static / Story), best post time. Vary formats across the week.`,
          proTipChips: ['Audience', 'Goal', 'Format mix'],
          outroLine: 'You have 7 days of posts ready to publish — what most freelancers spend Sunday agonising over.',
          outputHeadline: '✨ Your 7-Day Content Calendar — Schedule-Ready',
          successHeadline: 'This is a week of content you can start posting today to attract real customers.',
          continueButtonLabel: 'Post your first content → Continue to Session 12',
          useWhereHint: '📤 Use this on: 📸 Instagram · 📱 WhatsApp Status · 🎥 Reels · 🧵 Stories',
          intentCommit: {
            reinforcement: 'Pick Day 1 and post it today — don\'t wait for the perfect week. One post starts the streak.',
            ctaLabel: '✔ I\'ll post Day 1 today',
            confirmedLine: 'Locked in.',
            nextMicroStep: 'Open Instagram below and publish your first post now (60 seconds)',
          },
          finishLine: {
            primary: '🏁 Don\'t try to post all 7 — just publish Day 1 now.',
            microNudge: '💡 Come back tomorrow and follow Day 2 — consistency beats planning.',
            followThroughNudge: '📲 7 days = visibility → visibility = inquiries — start today.',
          },
          refinementChips: [
            { label: '🎯 Aim for one viral post', instruction: 'Now rewrite Day 4 to be a high-shareability post (controversial take, surprising insight, before/after) designed to boost reach.' },
            { label: '📊 Add weekly theme', instruction: 'Now wrap all 7 days in a single weekly theme that builds story arc — Day 1 introduces, Day 7 closes.' },
            { label: '🎬 More Reels', instruction: 'Now switch the static posts to Reels — give a quick visual / hook idea for each.' },
          ],
          // Posting-first action set — Instagram + WhatsApp foreground the
          // distribution moment, "Copy Day 1 post" uses the new sectionMatch
          // copy so the user only gets Day 1 (not the full 7-day wall),
          // matching Day-1-first psychology. Email handles the full calendar
          // as a secondary utility.
          realWorldActions: [
            { label: '📸 Open Instagram', action: { type: 'open-url', url: 'https://www.instagram.com/' } },
            { label: '💬 Open WhatsApp', action: { type: 'open-url', url: 'https://web.whatsapp.com/' } },
            { label: '📋 Copy Day 1 post', action: { type: 'copy', sectionMatch: 'Day 1' } },
            { label: '📧 Email full calendar', action: { type: 'email' } },
          ],
          yourTurnTemplate: `Build a 7-day Instagram content calendar for this account:

ACCOUNT: [YOUR ACCOUNT — what business + where based]
AUDIENCE: [YOUR TARGET CUSTOMERS]
GOAL: [WHAT WIN BY DAY 7 — DMs, enquiries, follows, sales]
TONE: [YOUR VOICE — friendly, formal, witty, etc.]

Each day must have: hook, body, CTA, 5 hashtags, format, best post time. Vary formats.`,
          yourTurnHeadline: 'Now build a calendar for YOUR account',
          yourTurnBody: 'Start your 7-day posting streak THIS WEEK — one post per day is how this turns into clients. Replace the brackets with your real account, generate the calendar, then post Day 1 today.',
        },
      },
      {
        session: 12,
        title: 'Brand Kit Project',
        description: 'Create a complete brand identity with AI',
        week: 3,
        tools: ['All tools'],
        isFree: false,
        deliverable: 'Complete brand identity for a local business',
        previewQuestions: [
          { q: 'A brand kit typically includes…', options: ['Just a logo', 'Logo, colors, fonts, and brand voice', 'Only social media posts'], answer: 1 },
          { q: 'Brand consistency means…', options: ['Using the same tool every day', 'Looking and sounding the same across all platforms', 'Only using one color'], answer: 1 },
          { q: 'When creating for a local business, you should…', options: ['Copy a global brand style', 'Research the local audience and competitors first', 'Use the most trendy design'], answer: 1 },
        ],
        playgroundTask: {
          taskTitle: 'Generate Your Complete Brand Kit',
          taskDescription: 'Get a full brand identity in 3 minutes — name analysis, mission, voice, colors, tagline, bio, logo direction. What designers charge ₹15,000 for.',
          timeEstimate: 'Takes 3 minutes',
          starterPrompt: `Generate a complete brand kit for this business:

BUSINESS NAME: Nibble (Instagram handle: @nibble.ai)
WHAT IT DOES: AI services for small Punjab businesses — content + automation for sweets shops, boutiques, coaching centres
DESIRED VIBE: Friendly-expert. Locally rooted but tech-forward. Approachable, not corporate.
FOUNDER: Solo Punjab-based AI freelancer, mid-20s

Give me: name analysis (why this works), mission (1 line), brand voice (3 words + Do/Don't), color palette (3 colors with hex + reasoning), typography vibe, tagline, Instagram bio (under 150 chars), logo direction (3 sentences).`,
          proTipChips: ['Vibe', 'Audience', 'Local context'],
          outroLine: 'You have a brand identity ready to go live across every surface — bio, messages, posts.',
          outputHeadline: '✨ Your Complete Brand Kit — Designer-Quality',
          successHeadline: 'This is your brand identity — use it today across everything you post and send.',
          continueButtonLabel: 'Update your brand live → Continue to Session 13',
          useWhereHint: '📤 Use this in: 📸 Instagram bio · 💬 WhatsApp replies · 📧 client messages · 🎥 video scripts',
          intentCommit: {
            reinforcement: 'Update ONE place with this brand today — start with your Instagram bio. One visible change beats a perfect plan.',
            ctaLabel: '✔ I\'ll update my bio now',
            confirmedLine: 'Locked in.',
            nextMicroStep: 'Copy your bio below and paste it into Instagram (takes 60 seconds)',
          },
          finishLine: {
            primary: '🏁 Don\'t try to apply everything — update your bio first.',
            microNudge: '💡 Then use this voice in your next post or message today.',
            followThroughNudge: '📲 Consistency in voice builds trust — that\'s what turns viewers into clients.',
          },
          refinementChips: [
            { label: '🌑 Make it darker / luxe', instruction: 'Now make the entire kit feel premium / luxury — darker palette, more refined voice, aspirational tagline.' },
            { label: '🇮🇳 Add Hindi/Punjabi tagline', instruction: 'Now add a Hindi (Devanagari) AND Punjabi (Gurmukhi) version of the tagline that locals would actually say.' },
            { label: '👥 Generate 3 customer personas', instruction: 'Now add 3 specific customer personas (name, age, profession, why they\'d hire) so the brand has someone to speak to.' },
          ],
          // Identity-application action set — Instagram profile edit is the
          // single-most-visible surface to update first; sectionMatch copies
          // give one-tap access to the bio + tagline (the two most-used kit
          // elements) without having to scroll through the full kit.
          realWorldActions: [
            { label: '📸 Open Instagram (Edit Profile)', action: { type: 'open-url', url: 'https://www.instagram.com/accounts/edit/' } },
            { label: '💬 Open WhatsApp', action: { type: 'open-url', url: 'https://web.whatsapp.com/' } },
            { label: '📋 Copy Instagram bio', action: { type: 'copy', sectionMatch: 'Instagram Bio' } },
            { label: '📋 Copy tagline', action: { type: 'copy', sectionMatch: 'Tagline' } },
          ],
          yourTurnTemplate: `Generate a complete brand kit for this business:

BUSINESS NAME: [YOUR NAME + handle]
WHAT IT DOES: [BUSINESS DESCRIPTION — what + who for]
DESIRED VIBE: [YOUR AESTHETIC — friendly / luxe / playful / serious / etc.]
FOUNDER: [WHO YOU ARE — background, location, age range]

Give me: name analysis, mission, brand voice (3 words + Do/Don't), color palette (3 colors with hex + reasoning), typography vibe, tagline, Instagram bio under 150 chars, logo direction.`,
          yourTurnHeadline: 'Now generate YOUR brand kit',
          yourTurnBody: 'Apply this brand to your real business THIS WEEK — this is how you stop sounding generic and start being remembered. Replace the brackets with real details, generate, then update your bio today.',
        },
      },
      {
        session: 13,
        title: 'No-Code Website Building',
        description: 'Build websites with Bolt.new',
        week: 4,
        tools: ['Bolt.new'],
        isFree: false,
        deliverable: 'Live personal portfolio website',
        previewQuestions: [
          { q: 'Bolt.new lets you build websites by…', options: ['Writing complex code', 'Describing what you want in plain English', 'Hiring a developer'], answer: 1 },
          { q: 'A portfolio website should showcase…', options: ['Everything you have ever done', 'Your best 3-5 projects with results', 'Only your resume'], answer: 1 },
          { q: 'No-code tools are useful because…', options: ['They are always free', 'Non-developers can build functional websites quickly', 'They have no limitations'], answer: 1 },
        ],
        playgroundTask: {
          taskTitle: 'Write Your Bolt.new Master Prompt',
          taskDescription: 'Get a complete Bolt.new prompt — sections, copy, design direction, tech stack — paste it and Bolt builds the whole site.',
          timeEstimate: 'Takes 3 minutes',
          starterPrompt: `Write a complete Bolt.new prompt for this website:

WHAT: A landing page for an AI freelance content service in Punjab
SECTIONS NEEDED: Hero / Services (3 cards) / Pricing (₹3K / ₹8K / ₹15K monthly) / Portfolio (3 case studies) / About me / Contact (WhatsApp + form)
DESIGN DIRECTION: Mobile-first. Punjabi-village warmth (mustard, terracotta tones) with cyan/electric tech accents. Bold sans-serif for headings. Large, friendly typography.
TECH PREFERENCES: Tailwind CSS. Next.js App Router. Dark mode default.

Output the complete master prompt I can paste into Bolt.new.`,
          proTipChips: ['Sections', 'Design', 'Tech stack'],
          outroLine: 'You have a Bolt.new prompt that builds a real website — what costs ₹30K from a freelance dev.',
          outputHeadline: '✨ Your Bolt.new Master Prompt — Site-Ready',
          successHeadline: 'This is your first client-ready website draft — live in 90 seconds.',
          continueButtonLabel: 'Share your live site → Continue to Session 14',
          useWhereHint: '📤 Share your live site URL on: 📸 Instagram bio · 💼 LinkedIn · 💬 WhatsApp · 📧 email signature',
          intentCommit: {
            reinforcement: 'Paste this into Bolt and generate your first version — don\'t edit yet. Done beats perfect.',
            ctaLabel: '✔ I\'ll generate my first version now',
            confirmedLine: 'Locked in.',
            nextMicroStep: 'Tap Open Bolt below — your prompt is already copied. Paste + generate (90 seconds)',
          },
          finishLine: {
            primary: '🏁 Don\'t try to make it perfect — just generate the first version.',
            microNudge: '💡 Review only the Hero and Pricing sections first — leave the rest for later.',
            followThroughNudge: '📲 Send the live URL to one prospect or add it to your bio today — that\'s where a draft turns into trust.',
          },
          refinementChips: [
            { label: '🎨 Add a colour system', instruction: 'Now add a complete colour system (primary, secondary, accent, background, text, surface) with hex codes for the design.' },
            { label: '✍️ Generate the copy', instruction: 'Now write the actual hero headline, sub-hero, services copy (3 cards), and CTA text — not just "include hero section".' },
            { label: '📱 Add micro-interactions', instruction: 'Now add 3 specific micro-interactions (button hovers, scroll reveals, card lifts) that elevate the polish.' },
          ],
          // Build-tool launcher — Bolt is foregrounded with copyFirst so the
          // user pastes straight in. Email + plain copy remain as utility
          // fallbacks. No "share" button here — sharing happens AFTER Bolt
          // produces the URL, not from this screen.
          realWorldActions: [
            { label: '🚀 Open Bolt.new', action: { type: 'open-url', url: 'https://bolt.new', copyFirst: true } },
            { label: '📋 Copy prompt', action: { type: 'copy' } },
            { label: '📧 Email prompt to self', action: { type: 'email' } },
          ],
          comparison: {
            basicPromptLabel: 'Build me a website for AI freelance services.',
            basicOutput: `Build a website with the following: a homepage with information about services, an about page, a contact form, and a portfolio section. Make it look modern and professional. Use a clean design with good colors.`,
            leftHeader: '🔸 Vague Bolt prompt',
            rightHeader: '🔹 With sections + design + stack',
            leftSubLabel: 'Bolt guesses',
            rightSubLabel: 'Bolt delivers',
          },
          whyItWorked: {
            heading: 'Why your Bolt prompt produced a real website',
            bullets: [
              '**Named sections** — Bolt builds what you list; "Hero / Services / Pricing / Portfolio / About / Contact" leaves no ambiguity.',
              '**Specific copy hints** — "₹3K / ₹8K / ₹15K monthly" gives Bolt real numbers to render, not placeholder lorem.',
              '**Design direction** — naming the aesthetic (mustard + terracotta + cyan) prevents generic blue-and-white SaaS look.',
              '**Tech stack** — Tailwind + Next.js App Router locks Bolt into modern, editable code (not legacy frameworks).',
            ],
          },
          yourTurnTemplate: `Write a complete Bolt.new prompt for this website:

WHAT: [YOUR WEBSITE PURPOSE — portfolio / business / landing page]
SECTIONS NEEDED: [LIST EVERY SECTION you want, in order]
DESIGN DIRECTION: [YOUR AESTHETIC — colours, vibe, typography style]
TECH PREFERENCES: [Tailwind / framework preference / dark mode / mobile-first]

Output the complete master prompt I can paste into Bolt.new.`,
          yourTurnHeadline: 'Now write the prompt for YOUR website',
          yourTurnBody: 'Pick the website you actually need (your portfolio, a friend\'s business, a side project). Fill in the brackets, generate, then paste into Bolt — your live draft will be ready in 90 seconds.',
        },
      },
      {
        session: 14,
        title: 'Capstone Project',
        description: 'Real client brief — deliver a complete solution',
        week: 4,
        tools: ['All tools'],
        isFree: false,
        deliverable: 'Complete AI solution for a real client brief',
        previewQuestions: [
          { q: 'The capstone project is important because…', options: ['It gives you a certificate immediately', 'It proves you can deliver real-world AI work', 'It is the easiest session'], answer: 1 },
          { q: 'When working on a client brief, you should first…', options: ['Start designing immediately', 'Understand the client\'s goals and audience', 'Use as many AI tools as possible'], answer: 1 },
          { q: 'Delivering a complete solution means…', options: ['Sending a rough draft', 'Presenting a polished, client-ready output', 'Using only one AI tool'], answer: 1 },
        ],
        playgroundTask: {
          taskTitle: 'Receive a Realistic Client Brief',
          taskDescription: 'Get a vague-but-realistic client brief PLUS your delivery plan — clarifying questions, scope, timeline, pricing rationale.',
          timeEstimate: 'Takes 3 minutes',
          starterPrompt: `Generate a realistic client brief AND my response plan for this scenario:

CLIENT PERSONA: A 50-year-old Patiala bakery owner. Wants "more business". Budget around ₹20K/month. Has never used AI. Sends WhatsApp messages with typos.
MY SERVICE: AI-powered marketing — content + automation + ads
MY GOAL: Convert this lead into a paying client this week

Output:
1. The realistic vague WhatsApp brief he\'d actually send (in his voice)
2. My 5 clarifying questions before quoting
3. Proposed scope (3 deliverables, prioritised)
4. Timeline (30 days, week-by-week)
5. Pricing rationale (why ₹X is right for THIS client)`,
          proTipChips: ['Persona', 'Goal', 'Real voice'],
          outroLine: 'You can now turn vague client messages into structured delivery plans — and reply within minutes.',
          outputHeadline: '✨ Your Client Reply + Full Delivery Plan',
          successHeadline: 'This is a real client message — and you\'re ready to reply and close.',
          continueButtonLabel: 'Send your first reply → Continue to Session 15',
          useWhereHint: '📤 Send your reply now: 💬 WhatsApp · 📧 Email · 📩 Instagram DM',
          intentCommit: {
            reinforcement: 'Send the first reply within 10 minutes — fast replies win clients before competitors even notice the message.',
            ctaLabel: '✔ I\'ll send my reply now',
            confirmedLine: 'Locked in.',
            nextMicroStep: 'Tap WhatsApp below — your first reply is already loaded. Pick the contact + send (60 seconds)',
          },
          finishLine: {
            primary: '🏁 Send the first reply without overthinking — speed beats perfection.',
            microNudge: '💡 Ask just 1-2 natural questions in your reply — save the rest for the call.',
            followThroughNudge: '📲 Move the conversation toward a 5-min call — that\'s where real clients close.',
          },
          refinementChips: [
            { label: '💸 Cut budget to ₹8K', instruction: 'Now adjust scope + pricing assuming the client\'s real budget is ₹8K/month — what 1-2 deliverables make the most ROI sense?' },
            { label: '⏱️ Speed to 7 days', instruction: 'Now compress to a 7-day "quick win" plan — what can I deliver this week to prove value?' },
            { label: '🚫 Add red flags', instruction: 'Now add 3 client red flags I should watch for in his replies (signs to walk away before wasting time).' },
          ],
          // Reply-first action set — WhatsApp is foregrounded with sectionMatch
          // so the chat opens with JUST the first reply (not the whole plan).
          // Copy variants split: first reply (primary) vs full plan (utility).
          realWorldActions: [
            { label: '💬 Send first reply via WhatsApp', action: { type: 'whatsapp', sectionMatch: 'Your First Reply' } },
            { label: '📋 Copy first reply', action: { type: 'copy', sectionMatch: 'Your First Reply' } },
            { label: '📋 Copy full plan', action: { type: 'copy' } },
            { label: '📧 Email full plan to self', action: { type: 'email' } },
          ],
          yourTurnTemplate: `Generate a realistic client brief AND my response plan for this scenario:

CLIENT PERSONA: [DESCRIBE A REAL PROSPECT — age, business, what they\'d ask, sophistication]
MY SERVICE: [WHAT YOU OFFER]
MY GOAL: [WHAT WIN — close, trial, free consult]

Output:
1. The realistic vague brief he/she\'d actually send (in their voice)
2. My 5 clarifying questions before quoting
3. Proposed scope (3 deliverables, prioritised)
4. Timeline (week-by-week)
5. Pricing rationale`,
          yourTurnHeadline: 'Now do this for YOUR real prospect',
          yourTurnBody: 'Pick someone you actually want to close THIS WEEK. Fill in the brackets — Claude returns a brief in their voice + a real first reply you can send today.',
        },
      },
      {
        session: 15,
        title: 'Portfolio & Presentations',
        description: 'Assemble portfolio and practice presenting',
        week: 4,
        tools: ['Bolt.new', 'Gamma'],
        isFree: false,
        deliverable: 'Polished portfolio + 10-minute presentation',
        previewQuestions: [
          { q: 'When presenting your portfolio, focus on…', options: ['How many tools you used', 'The problems you solved and results you achieved', 'How long it took'], answer: 1 },
          { q: 'A strong portfolio presentation should be…', options: ['As long as possible', 'Concise, visual, and story-driven', 'Text-heavy with no visuals'], answer: 1 },
          { q: 'Practicing your presentation helps because…', options: ['It wastes time', 'It builds confidence and reveals weak spots', 'Clients do not care about delivery'], answer: 1 },
        ],
        playgroundTask: {
          taskTitle: 'Write Your Hire-Me Page',
          taskDescription: 'Generate a complete Hire-Me page — hero, services, process, differentiators, testimonial template, CTA. Stop staring at a blank page.',
          timeEstimate: 'Takes 3 minutes',
          starterPrompt: `Write a complete Hire-Me page for this freelancer:

NAME / LOCATION: AI freelancer based in Kotkapura, Punjab
SKILLS: ChatGPT prompting, Canva AI design, content calendars, Bolt.new sites, voice cloning
EXPERIENCE: 6 months self-taught learning + 3 portfolio pieces (sweets shop campaign, boutique brand kit, coaching centre site)
TARGET CLIENTS: Small Punjab businesses — sweets, boutique, coaching centres
VIBE: Friendly, ambitious, family-rooted, locally credible

Output:
- Hero (hook headline + sub + primary CTA)
- What I Do (3 service cards with outcome-focused titles)
- How I Work (3 steps from enquiry to delivery)
- Why Me (3 differentiators specific to this freelancer)
- Testimonial template (placeholder a real client could fill)
- Contact / CTA section`,
          proTipChips: ['Vibe', 'Outcome focus', 'Specificity'],
          outroLine: 'You have what you send when someone asks "what do you do?" — sendable today.',
          outputHeadline: '✨ Your Hire-Me Page — Publish-Ready',
          successHeadline: 'This is what you send when someone asks what you do.',
          continueButtonLabel: 'Send your hire-me reply → Continue to Session 16',
          useWhereHint: '📤 Use this in: 💬 WhatsApp replies · 📸 Instagram bio link · 📧 Email signature · 💼 LinkedIn About',
          intentCommit: {
            reinforcement: 'Send the WhatsApp reply to ONE person who asked "what do you do?" today — even if it feels a little awkward. That\'s how this starts working.',
            ctaLabel: '✔ I\'ll send it to someone today',
            confirmedLine: 'Locked in.',
            nextMicroStep: 'Tap WhatsApp below — your reply is already loaded. Pick the contact + send (60 seconds)',
          },
          finishLine: {
            primary: '🏁 Don\'t publish the whole page first — send the WhatsApp reply to one person now.',
            microNudge: '💡 Then drop the hero line in your Instagram bio and email signature today.',
            followThroughNudge: '📲 The page only earns when it\'s in someone\'s inbox or DMs — distribution is the deliverable.',
          },
          refinementChips: [
            { label: '✂️ Cut to 200 words', instruction: 'Now compress the entire page to under 200 words total — keep only what closes.' },
            { label: '🇮🇳 Bilingual version', instruction: 'Now add a Punjabi (Gurmukhi) version of the hero hook + CTA so locals immediately feel at home.' },
            { label: '💬 Add an FAQ', instruction: 'Now add 5 honest FAQs (pricing, turnaround, what if it doesn\'t work, what tools used, do you teach me) — direct answers, no fluff.' },
          ],
          // Distribution-first action set — WhatsApp reply (sectionMatch
          // pulls just the chat-ready 30-50 word message), Instagram for bio
          // updates, plus surgical copies of hero + headline. Full-page copy
          // / email kept as utility fallbacks.
          realWorldActions: [
            { label: '💬 Send WhatsApp reply', action: { type: 'whatsapp', sectionMatch: 'Your WhatsApp Reply' } },
            { label: '📸 Open Instagram (Edit Profile)', action: { type: 'open-url', url: 'https://www.instagram.com/accounts/edit/' } },
            { label: '📋 Copy hero (for bio)', action: { type: 'copy', sectionMatch: 'Hero' } },
            { label: '📋 Copy full page', action: { type: 'copy' } },
          ],
          yourTurnTemplate: `Write a complete Hire-Me page for this freelancer:

NAME / LOCATION: [YOUR NAME + WHERE YOU ARE]
SKILLS: [YOUR ACTUAL SKILLS — list 3-5]
EXPERIENCE: [YOUR HONEST EXPERIENCE — months learning + portfolio pieces]
TARGET CLIENTS: [WHO YOU WANT TO SERVE]
VIBE: [YOUR PERSONALITY — friendly / formal / playful / etc.]

Output: Hero / Services (3 cards) / How I Work (3 steps) / Why Me (3 differentiators) / Testimonial template / CTA.`,
          yourTurnHeadline: 'Now write YOUR own Hire-Me page',
          yourTurnBody: 'Replace the brackets with YOUR real skills, location, and target clients. Then send the WhatsApp reply to one person today — that\'s how a page becomes a paying client.',
        },
      },
      {
        session: 16,
        title: 'Freelancing + Certification',
        description: 'Launch your career and earn your certificate',
        week: 4,
        tools: [],
        isFree: false,
        deliverable: 'Fiverr/Upwork profiles + 90-day career plan',
        previewQuestions: [
          { q: 'The best way to get your first freelance client is…', options: ['Wait for them to find you', 'Actively reach out and showcase your portfolio', 'Lower your price to zero'], answer: 1 },
          { q: 'Fiverr and Upwork are platforms for…', options: ['Social media only', 'Finding freelance work and clients', 'Hosting websites'], answer: 1 },
          { q: 'A 90-day career plan should include…', options: ['One big goal only', 'Weekly milestones, skill targets, and income goals', 'Only the jobs you want to apply for'], answer: 1 },
        ],
        playgroundTask: {
          taskTitle: 'Generate Your First 10 Outreach Messages',
          taskDescription: 'Get 10 personalised cold outreach messages — different platforms, different angles. Send 5 today and you\'ll have replies by Friday.',
          timeEstimate: 'Takes 3 minutes',
          starterPrompt: `Generate 10 cold outreach messages for this freelancer:

WHAT I OFFER: AI content + automation services for small Punjab businesses
TARGET CUSTOMERS: Sweets shop owners, boutique owners, coaching-centre owners, small restaurants
MIX OF PLATFORMS: 4 WhatsApp DMs / 3 Instagram DMs / 2 LinkedIn cold messages / 1 cold email

Each message must be DIFFERENT in angle:
- One curiosity-led ("noticed something specific about their account")
- One social-proof-led ("just helped a similar business with X result")
- One pain-led ("I bet you spend 4 hours/week on Y")
- One observation-led ("your competitor just started doing X")
- One direct-offer-led ("free 1-hour audit, no pitch")
- One referral-style ("a mutual contact suggested I reach out")
- Two more original angles I can choose from

Each message under 80 words, ends with one specific easy next step.`,
          proTipChips: ['Platform', 'Angle', 'Specific ask'],
          outroLine: 'You have your first 10 chances at a real client. The first reply is the win.',
          outputHeadline: '✨ Your 10 Outreach Messages — Send-Ready',
          successHeadline: 'These are your first 10 chances at a real client — start with Message 1.',
          continueButtonLabel: 'Send Message 1 today → Earn your certificate',
          useWhereHint: '📤 Send these on: 💬 WhatsApp · 📩 Instagram DM · 💼 LinkedIn · 📧 Email',
          intentCommit: {
            reinforcement: 'Send Message 1 to one prospect today — even if it feels a little awkward. That\'s how your first reply arrives.',
            ctaLabel: '✔ I\'ll send Message 1 today',
            confirmedLine: 'Locked in.',
            nextMicroStep: 'Tap WhatsApp below — Message 1 is loaded. Pick a contact + send (60 seconds)',
          },
          finishLine: {
            primary: '🏁 Don\'t send all 10 — just send Message 1 now.',
            microNudge: '💡 Start with Message 1 (WhatsApp · Curiosity Hook) — it\'s your safest opener.',
            followThroughNudge: '📲 Get 1 reply this week — that\'s your first real lead, not just a sent message.',
          },
          refinementChips: [
            { label: '🇮🇳 Punjabi WhatsApp versions', instruction: 'Now rewrite the 4 WhatsApp DMs in Punjabi (Gurmukhi) — keep the same angles, adjust to natural Punjabi business idiom.' },
            { label: '🎯 Niche to sweets only', instruction: 'Now niche all 10 specifically to sweets shop owners (mention festivals, pre-orders, family customers) — drop other niches.' },
            { label: '💰 Add follow-up', instruction: 'Now add a polite follow-up message for each (to send 4 days later if no reply).' },
          ],
          // Decision-fatigue killer — 10 messages, ONE primary send button
          // (Message 1, the safest opener). Other messages are accessible
          // via the full-copy / email fallbacks but the visual hierarchy
          // makes Message 1 the unmissable next step.
          realWorldActions: [
            { label: '💬 Send Message 1 via WhatsApp', action: { type: 'whatsapp', sectionMatch: 'Message 1' } },
            { label: '📋 Copy Message 1', action: { type: 'copy', sectionMatch: 'Message 1' } },
            { label: '📋 Copy all 10 messages', action: { type: 'copy' } },
            { label: '📧 Email all messages to self', action: { type: 'email' } },
          ],
          comparison: {
            basicPromptLabel: 'Write 10 cold outreach messages for AI freelancing.',
            basicOutput: `1. Hi! I offer AI services. Are you interested?

2. Hello, I help businesses with AI marketing. Let me know if you need help.

3. Hi there, I do AI content for businesses. Reply if interested.

4. Hello! I am a freelancer offering AI services. DM me to know more.

5. Hi, I provide AI marketing for small businesses. Reach out anytime.`,
            leftHeader: '🔸 Same message to everyone',
            rightHeader: '🔹 With 10 different angles',
            leftSubLabel: 'Gets ignored',
            rightSubLabel: 'Gets replies',
          },
          whyItWorked: {
            heading: 'Why your outreach pack actually gets replies',
            bullets: [
              '**10 angles, not 1 message** — you can send to 10 different prospects without sounding like a copy-paste bot.',
              '**Platform-matched tone** — WhatsApp ≠ LinkedIn ≠ cold email. Each is written for its medium.',
              '**Specific easy ask** — every message ends with ONE small step (audit / 5-min call / yes-no question), not a vague "let me know".',
              '**Personalisation hooks** — angles like "noticed your account" and "your competitor" force the prospect to engage with the substance, not just react to a pitch.',
            ],
          },
          yourTurnTemplate: `Generate 10 cold outreach messages for this freelancer:

WHAT I OFFER: [YOUR REAL SERVICE]
TARGET CUSTOMERS: [WHO YOU WANT TO REACH — be specific]
MIX OF PLATFORMS: [PICK YOUR 4-3-2-1 split — WhatsApp / IG / LinkedIn / email]

Each message must be DIFFERENT in angle (curiosity, social-proof, pain, observation, direct-offer, referral, plus more). Each under 80 words, ends with one specific easy next step.`,
          yourTurnHeadline: 'Now generate YOUR own outreach pack',
          yourTurnBody: 'Replace the brackets with your real service and target customers. Walk away with 10 messages — then send Message 1 today. The first reply is the win, not the 10 sent messages.',
        },
      },
    ],
  },
  'master-claude-15-days': {
    id: 'master-claude-15-days',
    tagline: 'Become a Claude power user in 15 days',
    description: 'Deep dive into Anthropic\u2019s Claude — the AI that writes like a human. Master long-form content, document analysis, coding assistance, and advanced prompting techniques.',
    audience: 'Content creators, writers, developers, business professionals who want to specialize in Claude',
    duration: '15 days (15 sessions)',
    icon: '🧠',
    originalPrice: 9999,
    onlinePrice: 999,
    highlights: ['Master Claude\u2019s unique strengths', 'Long-form content & document analysis', 'Claude Projects & artifacts', 'Advanced prompting techniques'],
    title: 'Master Claude in 15 Days',
    slug: 'master-claude-15-days',
    totalSessions: 15,
    filePrefix: 'claude',
    modules: [
      { session: 1, title: 'Understanding Claude', description: 'What makes Claude different, models, Claude vs ChatGPT', week: 1, tools: ['Claude'], isFree: true, deliverable: 'First Claude conversations + model comparison', previewQuestions: [
        { q: 'Who created Claude?', options: ['OpenAI', 'Google', 'Anthropic'], answer: 2 },
        { q: 'What does Constitutional AI mean?', options: ['AI that follows a constitution', 'AI trained to be helpful, harmless, and honest', 'AI that works in government'], answer: 1 },
        { q: 'Which Claude model is the most capable?', options: ['Haiku', 'Sonnet', 'Opus'], answer: 2 },
      ]},
      { session: 2, title: 'Interface Mastery', description: 'Every feature, setting, and shortcut in Claude', week: 1, tools: ['Claude'], isFree: false, deliverable: 'Complete interface familiarity + power user shortcuts', previewQuestions: [
        { q: 'What is Claude\'s context window?', options: ['4K tokens', '32K tokens', '200K+ tokens'], answer: 2 },
        { q: 'Can Claude browse the internet?', options: ['Yes, always', 'No, it uses training data', 'Only with plugins'], answer: 1 },
        { q: 'Which shortcut starts a new conversation?', options: ['Ctrl+N', 'Ctrl+K', 'Ctrl+Shift+O'], answer: 0 },
      ]},
      { session: 3, title: 'The CRISP Framework', description: 'TARAhut\'s prompt engineering system for Claude', week: 1, tools: ['Claude'], isFree: false, deliverable: '10 CRISP-structured prompts for real use cases', previewQuestions: [
        { q: 'What does CRISP stand for?', options: ['Context, Role, Instructions, Specifics, Parameters', 'Create, Research, Implement, Share, Publish', 'Claude, Response, Input, System, Prompt'], answer: 0 },
        { q: 'Which CRISP element tells Claude WHO to be?', options: ['Context', 'Role', 'Instructions'], answer: 1 },
        { q: 'Why add Parameters to a prompt?', options: ['To make it longer', 'To control output format, length, and style', 'Claude requires them'], answer: 1 },
      ]},
      { session: 4, title: 'Claude Projects', description: 'Persistent AI workspaces with custom instructions', week: 1, tools: ['Claude Projects'], isFree: false, deliverable: 'First Claude Project with custom instructions + knowledge base', previewQuestions: [
        { q: 'What is a Claude Project?', options: ['A coding tool', 'A persistent workspace with custom instructions', 'A file sharing service'], answer: 1 },
        { q: 'Can you upload documents to a Project?', options: ['No', 'Yes, as a knowledge base', 'Only images'], answer: 1 },
        { q: 'Do custom instructions carry across conversations in a Project?', options: ['No, they reset', 'Yes, they persist', 'Only for paid users'], answer: 1 },
      ]},
      { session: 5, title: 'Claude Artifacts', description: 'Building interactive outputs with Claude', week: 2, tools: ['Claude Artifacts'], isFree: false, deliverable: 'Created and iterated on 3+ Artifacts', previewQuestions: [
        { q: 'What is a Claude Artifact?', options: ['A historical item', 'An interactive output like code, HTML, or documents', 'A bug in Claude'], answer: 1 },
        { q: 'Can you edit an Artifact after Claude creates it?', options: ['No', 'Yes, through conversation', 'Only the code ones'], answer: 1 },
        { q: 'Which of these can be an Artifact?', options: ['Only text', 'Only code', 'Code, HTML, SVGs, documents, React components'], answer: 2 },
      ]},
      { session: 6, title: 'Projects + Artifacts Workshop', description: 'Build a complete business project', week: 2, tools: ['Claude Projects', 'Claude Artifacts'], isFree: false, deliverable: 'Complete business project with uploaded docs + generated artifacts', previewQuestions: [
        { q: 'What should you set FIRST when creating a Project?', options: ['The color theme', 'Custom instructions', 'The file size limit'], answer: 1 },
        { q: 'How many documents can you upload to a Project?', options: ['1', '5', 'Multiple — it builds a knowledge base'], answer: 2 },
        { q: 'Should you iterate on Artifacts or accept the first version?', options: ['Accept first version', 'Iterate 2-3 times for best results', 'Start over each time'], answer: 1 },
      ]},
      { session: 7, title: 'Business Writing', description: 'Reports, proposals, emails with Claude', week: 2, tools: ['Claude'], isFree: false, deliverable: 'Professional email set + client proposal using CRISP', previewQuestions: [
        { q: 'Why is Claude good at business writing?', options: ['It\'s the cheapest', 'It produces nuanced, professional-quality text', 'It has templates built in'], answer: 1 },
        { q: 'What CRISP element is most important for email tone?', options: ['Context', 'Role', 'Parameters (tone/style)'], answer: 2 },
        { q: 'Should you send Claude-written emails without reviewing?', options: ['Yes, Claude is perfect', 'No, always review and personalize', 'Only short emails'], answer: 1 },
      ]},
      { session: 8, title: 'Research & Analysis', description: 'Extract insights from long documents', week: 2, tools: ['Claude'], isFree: false, deliverable: 'Research report from uploaded document analysis', previewQuestions: [
        { q: 'What is Claude\'s advantage for research?', options: ['It browses the web', 'It can analyze very long documents (200K+ tokens)', 'It cites academic papers'], answer: 1 },
        { q: 'Can you upload a 50-page PDF to Claude?', options: ['No, too long', 'Yes, Claude handles long documents well', 'Only the first 10 pages'], answer: 1 },
        { q: 'What is a SWOT analysis?', options: ['A coding framework', 'Strengths, Weaknesses, Opportunities, Threats', 'A type of AI model'], answer: 1 },
      ]},
      { session: 9, title: 'Content Creation', description: 'Blogs, social media, video scripts with Claude', week: 3, tools: ['Claude'], isFree: false, deliverable: 'Blog post + social media content + multilingual adaptation', previewQuestions: [
        { q: 'Can Claude write content in Hindi?', options: ['No, English only', 'Yes, with good quality', 'Only basic phrases'], answer: 1 },
        { q: 'What makes Claude\'s content different from ChatGPT\'s?', options: ['It\'s faster', 'More nuanced, less generic, better structured', 'It uses more emojis'], answer: 1 },
        { q: 'Should you use AI content as-is for social media?', options: ['Yes', 'No, adapt it to your voice and audience', 'Only for LinkedIn'], answer: 1 },
      ]},
      { session: 10, title: 'Claude Cowork', description: 'Autonomous background tasks with Claude Desktop', week: 3, tools: ['Claude Desktop', 'Claude Cowork'], isFree: false, deliverable: 'Set up and executed 3 Cowork tasks', previewQuestions: [
        { q: 'What is Claude Cowork?', options: ['A team chat feature', 'Autonomous background task execution on desktop', 'A video call tool'], answer: 1 },
        { q: 'Where does Cowork run?', options: ['In the browser', 'In the Claude Desktop app', 'On a server'], answer: 1 },
        { q: 'Is Cowork good for creative writing?', options: ['Yes, it\'s best for creative tasks', 'No, better for routine/batch tasks', 'Only for poetry'], answer: 1 },
      ]},
      { session: 11, title: 'Claude for Code', description: 'No-code building with Claude\'s help', week: 3, tools: ['Claude'], isFree: false, deliverable: 'Web page + Python script built with Claude', previewQuestions: [
        { q: 'Do you need to know coding to use Claude for code?', options: ['Yes, expert level', 'No, you describe what you want', 'Only Python'], answer: 1 },
        { q: 'What language is best for simple web pages?', options: ['Python', 'HTML + CSS', 'Java'], answer: 1 },
        { q: 'Can Claude debug code it wrote?', options: ['No', 'Yes, paste the error and it fixes it', 'Only simple bugs'], answer: 1 },
      ]},
      { session: 12, title: 'Automation & Integration', description: 'Connect Claude with your daily workflow', week: 3, tools: ['Claude', 'Claude Desktop'], isFree: false, deliverable: 'Personal Claude system with daily-use Project', previewQuestions: [
        { q: 'What is the goal of automation?', options: ['Replace all human work', 'Save time on repetitive tasks', 'Make AI smarter'], answer: 1 },
        { q: 'Can Claude connect to Zapier?', options: ['No', 'Yes, via the API', 'Only to Google'], answer: 1 },
        { q: 'What is a "morning briefing" prompt?', options: ['A prompt you run daily to get your day organized', 'A news website', 'A Claude model name'], answer: 0 },
      ]},
      { session: 13, title: 'Vernacular AI', description: 'Working in Hindi, Punjabi, and regional languages', week: 3, tools: ['Claude'], isFree: false, deliverable: 'Hindi + Punjabi content + cultural adaptation examples', previewQuestions: [
        { q: 'What % of India\'s internet users prefer regional languages?', options: ['30%', '60%', '90%'], answer: 2 },
        { q: 'Can Claude write in Gurmukhi script?', options: ['No', 'Yes', 'Only transliteration'], answer: 1 },
        { q: 'What is cultural adaptation?', options: ['Translating word by word', 'Adapting content for local context, not just language', 'Using Indian English'], answer: 1 },
      ]},
      { session: 14, title: 'Claude API Fundamentals', description: 'Building custom AI applications', week: 3, tools: ['Claude API'], isFree: false, deliverable: 'Understanding of API concepts + first API call structure', previewQuestions: [
        { q: 'What is an API?', options: ['A website', 'A way for apps to talk to Claude directly', 'A programming language'], answer: 1 },
        { q: 'What do you need to use the Claude API?', options: ['A special computer', 'An API key from Anthropic', 'A PhD in AI'], answer: 1 },
        { q: 'What is "temperature" in the API?', options: ['How hot the server runs', 'How creative/random the output is', 'The response time'], answer: 1 },
      ]},
      { session: 15, title: 'Final Project + Certification', description: 'Complete a real-world challenge and graduate', week: 3, tools: ['All Claude features'], isFree: false, deliverable: 'Complete business solution + presentation + certificate', previewQuestions: [
        { q: 'What makes a great final project?', options: ['Length', 'Using all Claude features to solve a real problem', 'Fancy slides'], answer: 1 },
        { q: 'How long should the final presentation be?', options: ['30 minutes', '5 minutes', '1 hour'], answer: 1 },
        { q: 'What is the CRISP framework?', options: ['A snack brand', 'Context, Role, Instructions, Specifics, Parameters', 'A coding library'], answer: 1 },
      ]},
    ],
  },
  'ai-explorer-junior': {
    id: 'ai-explorer-junior',
    tagline: 'AI adventures for young minds',
    description: 'Designed for school students (Class 6-10). Explore AI through fun projects, creative experiments, and age-appropriate tools. Build your first AI projects and understand the technology shaping your future.',
    audience: 'School students (Class 6-10), young learners curious about AI',
    duration: '3 weeks (12 sessions)',
    icon: '🎮',
    originalPrice: 2999,
    onlinePrice: 999,
    highlights: ['Age-appropriate AI education', 'Fun, project-based learning', 'Creative AI experiments', 'Build your first AI projects'],
    title: 'AI Explorer for School Kids — Junior',
    slug: 'ai-explorer-junior',
    totalSessions: 12,
    filePrefix: 'junior',
    modules: [
      { session: 1, title: 'Meet Your AI Friend', description: 'Introduction to AI with fun activities', week: 1, tools: ['ChatGPT'], isFree: true, deliverable: 'First AI conversation', previewQuestions: [
        { q: 'What does AI stand for?', options: ['Automatic Intelligence', 'Artificial Intelligence', 'Amazing Internet'], answer: 1 },
        { q: 'Which of these uses AI?', options: ['A calculator', 'Google Search', 'A pencil'], answer: 1 },
        { q: 'Can AI think like humans?', options: ['Yes, exactly like us', 'No, it finds patterns in data', 'Only at night'], answer: 1 },
      ]},
      { session: 2, title: 'AI Study Buddy', description: 'Using AI to help with homework and learning', week: 1, tools: ['ChatGPT', 'Gemini'], isFree: false, deliverable: 'AI-assisted homework solutions', previewQuestions: [
        { q: 'Is it OK to copy AI answers directly?', options: ['Yes, always', 'No, use it to learn and write in your own words', 'Only for math'], answer: 1 },
        { q: 'AI can help you with...', options: ['Only English', 'Any subject you ask about', 'Only coding'], answer: 1 },
        { q: 'The best way to use AI for study is...', options: ['Ask it to do your homework', 'Ask it to explain concepts you don\'t understand', 'Never use it'], answer: 1 },
      ]},
      { session: 3, title: 'Prompt Power', description: 'Learning to ask AI better questions', week: 1, tools: ['ChatGPT'], isFree: false, deliverable: '10 well-written prompts', previewQuestions: [
        { q: 'A good prompt is...', options: ['Very short like "help me"', 'Clear and specific about what you want', 'As long as possible'], answer: 1 },
        { q: 'If AI gives a wrong answer, you should...', options: ['Give up', 'Ask again with a better prompt', 'Trust it anyway'], answer: 1 },
        { q: 'Which prompt is better?', options: ['"Write something"', '"Write a funny poem about mangoes for my class"', '"Do something"'], answer: 1 },
      ]},
      { session: 4, title: 'AI Artist', description: 'Creating images and art with AI', week: 2, tools: ['Canva AI', 'Bing Image Creator'], isFree: false, deliverable: '5 AI-generated artworks', previewQuestions: [
        { q: 'AI can create images by...', options: ['Taking photos', 'Understanding your text description', 'Scanning your brain'], answer: 1 },
        { q: 'A good image prompt includes...', options: ['Just "make a picture"', 'Subject, style, colors, and mood', 'Only the color you want'], answer: 1 },
        { q: 'Can you use AI art in school projects?', options: ['Never', 'Yes, with proper credit to the AI tool', 'Only for art class'], answer: 1 },
      ]},
      { session: 5, title: 'AI Storyteller', description: 'Writing stories and creative content with AI', week: 2, tools: ['ChatGPT'], isFree: false, deliverable: 'An AI-collaborative short story', previewQuestions: [
        { q: 'AI can help with creative writing by...', options: ['Writing the whole story for you', 'Giving you ideas, characters, and helping you improve your draft', 'Only checking spelling'], answer: 1 },
        { q: 'The best stories combine...', options: ['Only AI writing', 'Your imagination + AI assistance', 'Copying from a book'], answer: 1 },
        { q: 'What makes AI-assisted writing special?', options: ['It\'s faster than thinking', 'You can explore many ideas quickly and pick the best ones', 'It doesn\'t need editing'], answer: 1 },
      ]},
      { session: 6, title: 'English & Languages', description: 'Using AI for language learning', week: 2, tools: ['ChatGPT', 'Gemini'], isFree: false, deliverable: 'Bilingual content in English + Hindi/Punjabi', previewQuestions: [
        { q: 'Can AI help you learn English?', options: ['No', 'Yes, it can correct grammar, teach vocabulary, and practice conversation', 'Only with expensive apps'], answer: 1 },
        { q: 'AI can translate between...', options: ['Only English and Hindi', 'Many languages including Punjabi', 'Only 2 languages'], answer: 1 },
        { q: 'The best way to improve English with AI is...', options: ['Let AI write everything for you', 'Practice writing, then ask AI to check and explain mistakes', 'Only read AI outputs'], answer: 1 },
      ]},
      { session: 7, title: 'Smart Searching', description: 'Research and finding information with AI', week: 3, tools: ['Perplexity', 'ChatGPT'], isFree: false, deliverable: 'Research report on a topic of choice', previewQuestions: [
        { q: 'How is AI search different from Google?', options: ['It\'s the same', 'AI summarizes and explains, not just links', 'AI is slower'], answer: 1 },
        { q: 'Should you trust everything AI says?', options: ['Yes, always', 'No, always verify important facts', 'Only if it sounds right'], answer: 1 },
        { q: 'Perplexity AI is useful because it...', options: ['Has games', 'Shows sources for its answers', 'Only works on phones'], answer: 1 },
      ]},
      { session: 8, title: 'Presentation Pro', description: 'Making amazing presentations with AI', week: 3, tools: ['Gamma', 'Canva AI'], isFree: false, deliverable: 'A 10-slide AI-powered presentation', previewQuestions: [
        { q: 'Gamma AI can create a presentation from...', options: ['A photo', 'A text description of your topic', 'A video'], answer: 1 },
        { q: 'Good slides should have...', options: ['As much text as possible', 'One main idea per slide with visuals', 'Only images, no text'], answer: 1 },
        { q: 'After AI creates slides, you should...', options: ['Submit them immediately', 'Review, customize, and make them yours', 'Delete them and start over'], answer: 1 },
      ]},
      { session: 9, title: 'AI Safety', description: 'Staying safe and responsible with AI', week: 3, tools: [], isFree: false, deliverable: 'AI Safety pledge + quiz', previewQuestions: [
        { q: 'You should NEVER share with AI...', options: ['Your homework questions', 'Your passwords, address, or phone number', 'Your favorite color'], answer: 1 },
        { q: 'If AI generates something inappropriate, you should...', options: ['Share it with friends', 'Stop and tell a parent or teacher', 'Ignore it'], answer: 1 },
        { q: 'AI-generated images should be...', options: ['Shared as if you drew them', 'Labeled as AI-generated', 'Kept secret'], answer: 1 },
      ]},
      { session: 10, title: 'My AI Project — Part 1', description: 'Start building your showcase project', week: 4, tools: ['All tools'], isFree: false, deliverable: 'Project plan + first draft', previewQuestions: [
        { q: 'A good project starts with...', options: ['Opening AI immediately', 'A clear plan of what you want to create', 'Copying someone else'], answer: 1 },
        { q: 'Which is a good AI project idea?', options: ['Making AI do all your homework forever', 'Using AI to create a guide about your city for tourists', 'Just chatting with AI'], answer: 1 },
        { q: 'Your project should show...', options: ['That AI did all the work', 'That YOU used AI as a tool to create something amazing', 'Nothing special'], answer: 1 },
      ]},
      { session: 11, title: 'My AI Project — Part 2', description: 'Complete and polish your project', week: 4, tools: ['All tools'], isFree: false, deliverable: 'Completed project ready for showcase', previewQuestions: [
        { q: 'Before presenting, you should...', options: ['Not practice at all', 'Practice explaining your project out loud', 'Only focus on visuals'], answer: 1 },
        { q: 'A great project presentation includes...', options: ['Reading everything from slides', 'Explaining what you made, how AI helped, and what you learned', 'Only showing pictures'], answer: 1 },
        { q: 'What makes your project unique is...', options: ['Using the most AI tools', 'YOUR ideas and creativity combined with AI', 'Making it the longest'], answer: 1 },
      ]},
      { session: 12, title: 'Showcase & Graduation', description: 'Present your project and celebrate!', week: 4, tools: [], isFree: false, deliverable: 'Project presentation + certificate', previewQuestions: [
        { q: 'After this course, you can use AI to...', options: ['Only play games', 'Help with studies, creativity, and learning new things', 'Replace teachers'], answer: 1 },
        { q: 'The most important AI skill is...', options: ['Typing fast', 'Asking good questions and thinking critically about answers', 'Memorizing all AI tools'], answer: 1 },
        { q: 'You are now...', options: ['An AI expert', 'An AI Explorer who knows how to learn with AI responsibly', 'A robot'], answer: 1 },
      ]},
    ],
  },
  'ai-explorer-senior': {
    id: 'ai-explorer-senior',
    tagline: 'Advanced AI for senior students',
    description: 'For senior school students (Class 11-12) and college freshers. Go beyond basics into prompt engineering, AI-powered research, content creation, and career preparation with AI tools.',
    audience: 'Senior school students (Class 11-12), college students, young professionals',
    duration: '3 weeks (12 sessions)',
    icon: '🔬',
    originalPrice: 3999,
    onlinePrice: 999,
    highlights: ['Advanced prompt engineering', 'AI-powered research & writing', 'Career preparation with AI', 'Build a professional AI portfolio'],
    title: 'AI Explorer for School Kids — Senior',
    slug: 'ai-explorer-senior',
    totalSessions: 12,
    filePrefix: 'senior',
    modules: [
      { session: 1, title: 'The AI Revolution', description: 'How AI is changing everything — and why you need to know', week: 1, tools: ['ChatGPT', 'Claude'], isFree: true, deliverable: 'AI landscape map + first conversations', previewQuestions: [
        { q: 'What is a Large Language Model (LLM)?', options: ['A big dictionary', 'AI trained on massive text data to understand and generate language', 'A search engine'], answer: 1 },
        { q: 'ChatGPT was created by...', options: ['Google', 'OpenAI', 'Microsoft'], answer: 1 },
        { q: 'AI is best used as...', options: ['A replacement for thinking', 'A tool that augments your abilities', 'Entertainment only'], answer: 1 },
      ]},
      { session: 2, title: 'Prompt Power-Ups', description: 'Advanced prompting techniques for better results', week: 1, tools: ['ChatGPT', 'Claude'], isFree: false, deliverable: 'Prompt library with 20+ structured prompts', previewQuestions: [
        { q: 'Chain-of-thought prompting means...', options: ['Writing a very long prompt', 'Asking AI to think step by step', 'Using multiple AI tools'], answer: 1 },
        { q: 'Few-shot prompting means...', options: ['Using AI rarely', 'Giving AI examples to follow', 'Short prompts only'], answer: 1 },
        { q: 'The RCTF framework stands for...', options: ['Role, Context, Task, Format', 'Read, Create, Test, Fix', 'Run, Check, Try, Finish'], answer: 0 },
      ]},
      { session: 3, title: 'AI Exam Prep', description: 'Using AI to prepare for board exams', week: 1, tools: ['ChatGPT', 'Claude'], isFree: false, deliverable: 'Study plan + mock test questions for 2 subjects', previewQuestions: [
        { q: 'AI can help with board exam prep by...', options: ['Giving you the actual exam paper', 'Creating study plans, mock questions, and explaining concepts', 'Replacing your textbooks'], answer: 1 },
        { q: 'The best way to use AI for revision is...', options: ['Ask it to memorize for you', 'Generate practice questions and test yourself', 'Only the night before the exam'], answer: 1 },
        { q: 'AI-generated study plans should be...', options: ['Followed blindly', 'Customized to your weak areas and schedule', 'Ignored'], answer: 1 },
      ]},
      { session: 4, title: 'AI Detective', description: 'Research, fact-checking, and critical thinking', week: 2, tools: ['Perplexity', 'ChatGPT'], isFree: false, deliverable: 'Research report with verified sources', previewQuestions: [
        { q: 'AI hallucination means...', options: ['AI sees things', 'AI generates false information confidently', 'AI crashes'], answer: 1 },
        { q: 'To verify AI information, you should...', options: ['Trust it completely', 'Cross-check with reliable sources', 'Ask AI if it\'s correct'], answer: 1 },
        { q: 'Perplexity is better than ChatGPT for research because...', options: ['It\'s faster', 'It provides sources and citations', 'It\'s more creative'], answer: 1 },
      ]},
      { session: 5, title: 'AI Design Studio', description: 'Creating professional visuals with AI', week: 2, tools: ['Canva AI', 'Ideogram'], isFree: false, deliverable: 'Brand kit + 5 social media graphics', previewQuestions: [
        { q: 'Canva AI\'s Magic Design...', options: ['Requires design skills', 'Generates designs from your description', 'Only makes logos'], answer: 1 },
        { q: 'A good brand kit includes...', options: ['Just a logo', 'Logo, colors, fonts, and consistent style', 'Only social media posts'], answer: 1 },
        { q: 'AI-generated images work best when...', options: ['You use vague prompts', 'You describe style, mood, composition, and subject clearly', 'You don\'t edit them'], answer: 1 },
      ]},
      { session: 6, title: 'AI Code Lab', description: 'Building simple projects with AI-assisted coding', week: 2, tools: ['ChatGPT', 'Claude'], isFree: false, deliverable: 'Simple web page + calculator built with AI', previewQuestions: [
        { q: 'You need to know coding to use AI for code?', options: ['Yes, expert level', 'No, describe what you want in plain English', 'Only Python'], answer: 1 },
        { q: 'HTML is used for...', options: ['Making apps', 'Building web page structure', 'Creating databases'], answer: 1 },
        { q: 'If AI code has an error, you should...', options: ['Give up', 'Paste the error back to AI and ask it to fix it', 'Start over completely'], answer: 1 },
      ]},
      { session: 7, title: 'Career & Branding', description: 'Building your professional identity with AI', week: 3, tools: ['ChatGPT', 'Canva AI'], isFree: false, deliverable: 'LinkedIn-ready profile + AI resume', previewQuestions: [
        { q: 'A LinkedIn profile helps students by...', options: ['Getting likes', 'Building a professional network for internships and opportunities', 'Playing games'], answer: 1 },
        { q: 'AI can improve your resume by...', options: ['Adding fake experience', 'Optimizing keywords and making it professional', 'Making it very long'], answer: 1 },
        { q: 'Your personal brand is...', options: ['Your social media follower count', 'How people perceive your skills and value', 'Your school name'], answer: 1 },
      ]},
      { session: 8, title: 'Build Your Brand', description: 'Content creation and social media with AI', week: 3, tools: ['ChatGPT', 'Canva AI', 'CapCut'], isFree: false, deliverable: '7-day content plan + 5 posts created', previewQuestions: [
        { q: 'A content calendar helps you...', options: ['Post randomly', 'Plan consistent, varied content', 'Copy others'], answer: 1 },
        { q: 'The best social media content...', options: ['Is always promotional', 'Mixes education, inspiration, and personal stories', 'Is only selfies'], answer: 1 },
        { q: 'AI helps with content creation by...', options: ['Posting for you automatically', 'Writing captions, generating ideas, and creating visuals', 'Replacing creativity'], answer: 1 },
      ]},
      { session: 9, title: 'AI Ethics & Deepfakes', description: 'Understanding AI risks and responsible use', week: 3, tools: [], isFree: false, deliverable: 'Ethics case study analysis', previewQuestions: [
        { q: 'A deepfake is...', options: ['A fake website', 'AI-generated video or audio that looks/sounds real', 'A broken AI tool'], answer: 1 },
        { q: 'AI bias means...', options: ['AI has opinions', 'AI can reflect and amplify human prejudices from training data', 'AI is always fair'], answer: 1 },
        { q: 'Responsible AI use means...', options: ['Using AI for everything', 'Being transparent, checking facts, and considering impact', 'Avoiding AI completely'], answer: 1 },
      ]},
      { session: 10, title: 'Capstone — Part 1', description: 'Plan and start your capstone project', week: 4, tools: ['All tools'], isFree: false, deliverable: 'Project plan + first deliverables', previewQuestions: [
        { q: 'A capstone project should demonstrate...', options: ['Speed only', 'Your ability to solve a real problem using AI tools', 'That AI did all the work'], answer: 1 },
        { q: 'Good project topics come from...', options: ['Random selection', 'Real problems you\'ve noticed in your school or community', 'Copying someone else'], answer: 1 },
        { q: 'The first step of any project is...', options: ['Opening AI', 'Defining the problem and planning your approach', 'Making slides'], answer: 1 },
      ]},
      { session: 11, title: 'Capstone — Part 2', description: 'Complete, polish, and prepare to present', week: 4, tools: ['All tools'], isFree: false, deliverable: 'Completed capstone project', previewQuestions: [
        { q: 'Polishing a project means...', options: ['Starting over', 'Reviewing quality, fixing issues, and improving details', 'Adding more pages'], answer: 1 },
        { q: 'A strong presentation...', options: ['Is very long', 'Tells a clear story: problem → solution → impact', 'Has no visuals'], answer: 1 },
        { q: 'Feedback from others helps because...', options: ['They are smarter than you', 'Fresh eyes catch things you missed', 'You have to change everything they say'], answer: 1 },
      ]},
      { session: 12, title: 'Showcase & Graduation', description: 'Present to parents and teachers, earn your certificate', week: 4, tools: [], isFree: false, deliverable: 'Final presentation + certificate', previewQuestions: [
        { q: 'After this course, you should...', options: ['Stop learning about AI', 'Keep exploring and applying AI to new challenges', 'Only use one AI tool'], answer: 1 },
        { q: 'The most important skill in the AI era is...', options: ['Memorizing facts', 'Critical thinking and adaptability', 'Typing speed'], answer: 1 },
        { q: 'Your next step should be...', options: ['Wait for someone to tell you what to do', 'Identify a problem and start solving it with AI', 'Forget everything you learned'], answer: 1 },
      ]},
    ],
  },
  'ai-power-8-week': {
    id: 'ai-power-8-week',
    tagline: 'Intensive 8-week AI transformation',
    description: 'The most comprehensive AI program for working professionals. 8 weeks of intensive training covering every major AI tool, automation, content creation, data analysis, and freelancing with AI.',
    audience: 'Working professionals, career changers, freelancers wanting to 10x their productivity',
    duration: '8 weeks (16 sessions)',
    icon: '⚡',
    originalPrice: 9999,
    onlinePrice: 999,
    highlights: ['Most comprehensive program', 'Cover 20+ AI tools', 'Automation & workflow building', 'Freelancing income strategies'],
    title: 'AI Power Program (8 Weeks)',
    slug: 'ai-power-8-week',
    totalSessions: 16,
    filePrefix: 'power',
    modules: [
      { session: 1, title: 'AI Foundations — What is AI?', description: 'Introduction to AI, types, and real-world applications', week: 1, tools: ['ChatGPT', 'Claude', 'Gemini'], isFree: true, deliverable: 'AI landscape understanding + first conversations', previewQuestions: [
        { q: 'What does AI stand for?', options: ['Automatic Intelligence', 'Artificial Intelligence', 'Advanced Internet'], answer: 1 },
        { q: 'Which is an example of Generative AI?', options: ['Calculator', 'ChatGPT', 'Microsoft Excel'], answer: 1 },
        { q: 'AI is best used for...', options: ['Replacing humans entirely', 'Augmenting human capabilities', 'Only entertainment'], answer: 1 },
      ]},
      { session: 2, title: 'Prompt Engineering — CRISP Framework', description: 'Master the CRISP framework for effective AI prompts', week: 1, tools: ['ChatGPT', 'Claude'], isFree: false, deliverable: '20 structured prompts using CRISP', previewQuestions: [
        { q: 'CRISP stands for...', options: ['Create, Run, Iterate, Ship, Publish', 'Context, Role, Instructions, Specifications, Parameters', 'Copy, Read, Improve, Send, Print'], answer: 1 },
        { q: 'A vague prompt gives...', options: ['Better results', 'Vague, generic results', 'Faster output'], answer: 1 },
        { q: 'The best prompts include...', options: ['One word', 'Context, role, and specific instructions', 'Just a question mark'], answer: 1 },
      ]},
      { session: 3, title: 'Professional Writing with AI', description: 'Business emails, reports, and professional documents', week: 2, tools: ['ChatGPT', 'Claude', 'Gemini'], isFree: false, deliverable: 'Professional document portfolio', previewQuestions: [
        { q: 'AI-generated text should always be...', options: ['Used as-is', 'Reviewed and edited by you', 'Ignored'], answer: 1 },
        { q: 'For business emails, AI helps most with...', options: ['Replacing thinking', 'Drafting and tone adjustment', 'Sending automatically'], answer: 1 },
        { q: 'Professional writing with AI requires...', options: ['No human input', 'Clear prompts with context and tone', 'Only ChatGPT'], answer: 1 },
      ]},
      { session: 4, title: 'Academic & Application Writing', description: 'SOPs, cover letters, and academic documents', week: 2, tools: ['ChatGPT', 'Claude'], isFree: false, deliverable: 'SOP + cover letter drafts', previewQuestions: [
        { q: 'An SOP should be...', options: ['Generic and copied', 'Personal and specific to the program', 'Very short'], answer: 1 },
        { q: 'AI helps with applications by...', options: ['Writing everything for you', 'Helping structure and refine YOUR story', 'Submitting automatically'], answer: 1 },
        { q: 'The most important part of a cover letter is...', options: ['Length', 'Matching your skills to the role', 'Using fancy words'], answer: 1 },
      ]},
      { session: 5, title: 'AI Design & Visual Content', description: 'Canva AI, image generation, and visual branding', week: 3, tools: ['Canva', 'DALL-E', 'Midjourney'], isFree: false, deliverable: 'Brand kit + social media designs', previewQuestions: [
        { q: 'Canva AI can...', options: ['Only make logos', 'Generate designs, remove backgrounds, and resize', 'Replace Photoshop entirely'], answer: 1 },
        { q: 'Brand consistency means...', options: ['Using random colors', 'Using the same fonts, colors, and style everywhere', 'Changing design daily'], answer: 1 },
        { q: 'AI image generation works best with...', options: ['One-word prompts', 'Detailed descriptions of what you want', 'No instructions'], answer: 1 },
      ]},
      { session: 6, title: 'AI Video & Personal Branding', description: 'HeyGen, CapCut, and video marketing', week: 3, tools: ['HeyGen', 'CapCut', 'Runway'], isFree: false, deliverable: 'Personal branding video', previewQuestions: [
        { q: 'HeyGen is used for...', options: ['Text editing', 'AI avatar videos', 'Spreadsheets'], answer: 1 },
        { q: 'Personal branding videos should...', options: ['Be 30 minutes long', 'Be short, clear, and show your expertise', 'Have no script'], answer: 1 },
        { q: 'CapCut helps with...', options: ['Writing code', 'Video editing with AI features', 'Email marketing'], answer: 1 },
      ]},
      { session: 7, title: "AI for Punjab's Industries", description: 'Apply AI to agriculture, textiles, and local business', week: 4, tools: ['ChatGPT', 'Claude', 'Canva'], isFree: false, deliverable: 'Industry-specific AI solutions', previewQuestions: [
        { q: 'AI can help Punjab farmers by...', options: ['Replacing them', 'Predicting weather, pest control, and crop planning', 'Only entertainment'], answer: 1 },
        { q: 'Local businesses benefit from AI through...', options: ['Nothing', 'Marketing, customer service, and operations', 'Only large companies use AI'], answer: 1 },
        { q: 'The best AI solutions for local industries are...', options: ['Copied from Silicon Valley', 'Customized for local needs and languages', 'Only in English'], answer: 1 },
      ]},
      { session: 8, title: 'AI Business Plan Workshop', description: 'Create a complete business plan using AI', week: 4, tools: ['ChatGPT', 'Claude', 'Canva'], isFree: false, deliverable: 'Complete AI-assisted business plan', previewQuestions: [
        { q: 'A business plan should include...', options: ['Only the idea', 'Problem, solution, market, revenue model, and team', 'Just financials'], answer: 1 },
        { q: 'AI helps with business planning by...', options: ['Making decisions for you', 'Market research, financial projections, and competitor analysis', 'Guaranteeing success'], answer: 1 },
        { q: 'The most important part of a business plan is...', options: ['The logo', 'Solving a real problem for real customers', 'The font choice'], answer: 1 },
      ]},
      { session: 9, title: 'No-Code Automation', description: 'Zapier, Make, and workflow automation', week: 5, tools: ['Zapier', 'Make'], isFree: false, deliverable: '3 automated workflows', previewQuestions: [
        { q: 'No-code automation means...', options: ['No computers needed', 'Building workflows without writing code', 'Only for developers'], answer: 1 },
        { q: 'Zapier connects...', options: ['Physical machines', 'Different apps and services automatically', 'Only Google products'], answer: 1 },
        { q: 'A good automation saves...', options: ['Nothing', 'Time on repetitive tasks', 'Only money'], answer: 1 },
      ]},
      { session: 10, title: 'AI Chatbots & Custom GPTs', description: 'Build AI assistants for businesses', week: 5, tools: ['ChatGPT', 'Claude'], isFree: false, deliverable: 'Custom GPT + chatbot prototype', previewQuestions: [
        { q: 'A Custom GPT is...', options: ['A new AI company', 'A specialized ChatGPT with custom instructions', 'A coding language'], answer: 1 },
        { q: 'Business chatbots are useful for...', options: ['Replacing all employees', '24/7 customer support and FAQ handling', 'Only tech companies'], answer: 1 },
        { q: 'The key to a good chatbot is...', options: ['Making it sound robotic', 'Clear instructions and relevant knowledge', 'Using the most expensive AI'], answer: 1 },
      ]},
      { session: 11, title: 'AI Freelancing Masterclass', description: 'Start earning with AI skills on freelancing platforms', week: 6, tools: ['All tools'], isFree: false, deliverable: 'Freelancing profile + first gig proposal', previewQuestions: [
        { q: 'The best freelancing platforms for AI work are...', options: ['Only Fiverr', 'Upwork, Fiverr, and direct outreach', 'None exist'], answer: 1 },
        { q: 'A strong freelancing profile needs...', options: ['No portfolio', 'Skills, portfolio, and client testimonials', 'Only a photo'], answer: 1 },
        { q: 'Pricing AI services should be based on...', options: ['Hours worked', 'Value delivered to the client', 'Random guessing'], answer: 1 },
      ]},
      { session: 12, title: 'Career & Exam Preparation with AI', description: 'Use AI for competitive exams and career growth', week: 6, tools: ['ChatGPT', 'Claude'], isFree: false, deliverable: 'Study plan + practice papers', previewQuestions: [
        { q: 'AI can help exam preparation by...', options: ['Taking the exam for you', 'Creating practice questions and explaining concepts', 'Cheating'], answer: 1 },
        { q: 'The best way to use AI for studying is...', options: ['Copy-pasting answers', 'Active learning: ask questions, get explanations, practice', 'Only reading AI output'], answer: 1 },
        { q: 'AI career tools help with...', options: ['Getting hired automatically', 'Resume building, interview prep, and skill gap analysis', 'Nothing useful'], answer: 1 },
      ]},
      { session: 13, title: 'AI for Data & Research', description: 'Data analysis, research, and insights with AI', week: 7, tools: ['ChatGPT', 'Claude', 'Google Sheets'], isFree: false, deliverable: 'Data analysis report', previewQuestions: [
        { q: 'AI helps with data analysis by...', options: ['Making up data', 'Finding patterns, summarizing, and visualizing data', 'Only large datasets'], answer: 1 },
        { q: 'Research with AI should always...', options: ['Be taken at face value', 'Be verified with primary sources', 'Replace libraries'], answer: 1 },
        { q: 'The best AI for data work is...', options: ['Any single tool', 'The right tool for the specific task', 'The most expensive one'], answer: 1 },
      ]},
      { session: 14, title: 'Future-Proofing & AI Agents', description: 'AI agents, trends, and staying relevant', week: 7, tools: ['ChatGPT', 'Claude'], isFree: false, deliverable: 'Future-proofing career plan', previewQuestions: [
        { q: 'AI agents can...', options: ['Only chat', 'Take actions, use tools, and complete multi-step tasks', 'Replace all jobs tomorrow'], answer: 1 },
        { q: 'To stay relevant in the AI era...', options: ['Ignore AI', 'Keep learning and adapting', 'Only learn one tool'], answer: 1 },
        { q: 'The most future-proof skill is...', options: ['Memorization', 'Learning how to learn', 'Using one specific tool'], answer: 1 },
      ]},
      { session: 15, title: 'Capstone Project Building', description: 'Build your final project combining all skills', week: 8, tools: ['All tools'], isFree: false, deliverable: 'Capstone project draft', previewQuestions: [
        { q: 'A capstone project should demonstrate...', options: ['One tool only', 'Integration of multiple AI tools and skills', 'Speed over quality'], answer: 1 },
        { q: 'The best projects solve...', options: ['Imaginary problems', 'Real problems for real people', 'Only technical challenges'], answer: 1 },
        { q: 'Documentation is important because...', options: ['Teachers require it', 'It shows your thinking process and makes work reusable', 'It wastes time'], answer: 1 },
      ]},
      { session: 16, title: 'Demo Day & Certification', description: 'Present your project and earn your certificate', week: 8, tools: [], isFree: false, deliverable: 'Final presentation + certificate', previewQuestions: [
        { q: 'A good demo presentation...', options: ['Is very long', 'Tells a story: problem, solution, results', 'Has no visuals'], answer: 1 },
        { q: 'After certification, you should...', options: ['Stop learning', 'Apply skills professionally and keep growing', 'Wait for instructions'], answer: 1 },
        { q: 'The most valuable outcome of this course is...', options: ['The certificate', 'The skills and confidence to use AI professionally', 'Attendance'], answer: 1 },
      ]},
    ],
  },
  'prompt-engineering': {
    id: 'prompt-engineering',
    tagline: 'Master the art of talking to AI',
    description: 'The skill that separates average AI users from power users. Learn RCTF framework, chain-of-thought, few-shot prompting, system prompts, and build reusable prompt libraries for any industry.',
    audience: 'Anyone who uses AI tools and wants dramatically better results',
    duration: '4 weeks (12 sessions)',
    icon: '✍️',
    originalPrice: 5999,
    onlinePrice: 999,
    highlights: ['RCTF & CRISP frameworks', 'Chain-of-thought & few-shot techniques', 'Build a prompt library', 'System prompts & Custom GPTs'],
    title: 'Generative AI & Prompt Engineering',
    slug: 'prompt-engineering',
    totalSessions: 12,
    filePrefix: 'prompt',
    modules: [
      { session: 1, title: 'Transformer Architecture', description: 'How LLMs work under the hood', week: 1, tools: ['ChatGPT', 'Claude'], isFree: true, deliverable: 'Understanding of transformer architecture', previewQuestions: [
        { q: 'Transformers process text using...', options: ['Rules-based parsing', 'Attention mechanisms', 'Simple pattern matching'], answer: 1 },
        { q: 'Self-attention allows the model to...', options: ['Ignore context', 'Weigh the importance of each word relative to others', 'Only read left to right'], answer: 1 },
        { q: 'LLMs generate text by...', options: ['Looking up answers in a database', 'Predicting the next most likely token', 'Copying from the internet'], answer: 1 },
      ]},
      { session: 2, title: 'Tokens & Context Windows', description: 'Understanding tokenization and context limits', week: 1, tools: ['ChatGPT', 'Claude'], isFree: false, deliverable: 'Token counting exercises', previewQuestions: [
        { q: 'A token is roughly...', options: ['A full sentence', 'About 4 characters or 3/4 of a word', 'One letter'], answer: 1 },
        { q: 'Context window determines...', options: ['Output quality', 'How much text the model can process at once', 'Response speed'], answer: 1 },
        { q: 'When you exceed the context window...', options: ['The model crashes', 'Earlier content gets forgotten or truncated', 'Nothing happens'], answer: 1 },
      ]},
      { session: 3, title: 'Temperature & Parameters', description: 'Control AI output with temperature and other settings', week: 1, tools: ['ChatGPT', 'Claude'], isFree: false, deliverable: 'Parameter comparison experiments', previewQuestions: [
        { q: 'Higher temperature makes output...', options: ['More deterministic', 'More creative and random', 'Shorter'], answer: 1 },
        { q: 'Temperature 0 is best for...', options: ['Creative writing', 'Factual, consistent answers', 'Poetry'], answer: 1 },
        { q: 'Top-p sampling controls...', options: ['Speed', 'The diversity of token selection', 'Model size'], answer: 1 },
      ]},
      { session: 4, title: 'Model Comparison Deep Dive', description: 'GPT-4 vs Claude vs Gemini — strengths and use cases', week: 1, tools: ['ChatGPT', 'Claude', 'Gemini'], isFree: false, deliverable: 'Model comparison matrix', previewQuestions: [
        { q: 'Claude excels at...', options: ['Image generation', 'Long document analysis and careful reasoning', 'Only code'], answer: 1 },
        { q: 'The best model depends on...', options: ['Price only', 'The specific task and requirements', 'Popularity'], answer: 1 },
        { q: 'Multi-model strategy means...', options: ['Using only one model', 'Using the right model for each task', 'Switching models randomly'], answer: 1 },
      ]},
      { session: 5, title: 'CRISP Framework', description: 'Master the CRISP framework for structured prompting', week: 2, tools: ['ChatGPT', 'Claude'], isFree: false, deliverable: '20 CRISP-structured prompts', previewQuestions: [
        { q: 'CRISP stands for...', options: ['Create, Run, Iterate, Ship, Publish', 'Context, Role, Instructions, Specifications, Parameters', 'Copy, Read, Improve, Send, Print'], answer: 1 },
        { q: 'The Role component helps by...', options: ['Making AI funny', 'Giving the AI a perspective and expertise level', 'Nothing'], answer: 1 },
        { q: 'Specifications in CRISP include...', options: ['Only word count', 'Format, length, tone, audience, and constraints', 'Just the topic'], answer: 1 },
      ]},
      { session: 6, title: 'Chain-of-Thought Prompting', description: 'Guide AI through step-by-step reasoning', week: 2, tools: ['ChatGPT', 'Claude'], isFree: false, deliverable: 'Chain-of-thought prompt library', previewQuestions: [
        { q: 'Chain-of-thought prompting asks the AI to...', options: ['Give one-word answers', 'Think step by step through the problem', 'Skip reasoning'], answer: 1 },
        { q: 'CoT is most useful for...', options: ['Simple greetings', 'Complex reasoning, math, and analysis tasks', 'Image generation'], answer: 1 },
        { q: '"Let\'s think step by step" is an example of...', options: ['Few-shot prompting', 'Zero-shot chain-of-thought', 'System prompts'], answer: 1 },
      ]},
      { session: 7, title: 'Few-Shot & Zero-Shot Prompting', description: 'Teaching AI by example vs. instruction alone', week: 2, tools: ['ChatGPT', 'Claude'], isFree: false, deliverable: 'Few-shot prompt templates', previewQuestions: [
        { q: 'Few-shot prompting means...', options: ['Using AI briefly', 'Giving examples for the AI to follow', 'Writing short prompts'], answer: 1 },
        { q: 'Zero-shot prompting relies on...', options: ['Many examples', 'Clear instructions without examples', 'No prompt at all'], answer: 1 },
        { q: 'Few-shot works best when...', options: ['The task is obvious', 'The output format is specific and consistent', 'You have no examples'], answer: 1 },
      ]},
      { session: 8, title: 'System Prompts & Custom Instructions', description: 'Configure AI behavior with system-level prompts', week: 3, tools: ['ChatGPT', 'Claude'], isFree: false, deliverable: '5 system prompt templates', previewQuestions: [
        { q: 'A system prompt...', options: ['Is visible to end users', 'Sets the AI\'s behavior, role, and boundaries', 'Only works in ChatGPT'], answer: 1 },
        { q: 'Custom instructions persist across...', options: ['One message', 'An entire conversation', 'Only the first response'], answer: 1 },
        { q: 'The best system prompts include...', options: ['Just "be helpful"', 'Role, constraints, output format, and guardrails', 'Nothing specific'], answer: 1 },
      ]},
      { session: 9, title: 'Role-Based Prompting & Multi-Step Workflows', description: 'Assign roles and build complex AI workflows', week: 3, tools: ['ChatGPT', 'Claude'], isFree: false, deliverable: 'Multi-step workflow templates', previewQuestions: [
        { q: 'Role-based prompting assigns AI a...', options: ['Random personality', 'Specific expertise and perspective', 'Human name'], answer: 1 },
        { q: 'Multi-step workflows break tasks into...', options: ['One big prompt', 'Sequential, manageable steps', 'Random order'], answer: 1 },
        { q: 'The benefit of role-based prompting is...', options: ['Entertainment', 'More focused, expert-level responses', 'Longer responses'], answer: 1 },
      ]},
      { session: 10, title: 'Prompt Chaining', description: 'Connect multiple prompts for complex outputs', week: 3, tools: ['ChatGPT', 'Claude'], isFree: false, deliverable: 'Prompt chain templates', previewQuestions: [
        { q: 'Prompt chaining means...', options: ['Writing one long prompt', 'Using the output of one prompt as input to the next', 'Repeating the same prompt'], answer: 1 },
        { q: 'Chaining is useful for...', options: ['Simple questions', 'Complex tasks that require multiple processing steps', 'Only coding'], answer: 1 },
        { q: 'The key to good chaining is...', options: ['Speed', 'Clear input/output contracts between steps', 'Using one tool only'], answer: 1 },
      ]},
      { session: 11, title: 'Custom GPTs & Claude Projects', description: 'Build permanent AI tools for businesses', week: 4, tools: ['ChatGPT', 'Claude'], isFree: false, deliverable: '3 Custom GPTs + 2 Claude Projects', previewQuestions: [
        { q: 'Custom GPTs are best for...', options: ['One-time tasks', 'Recurring tasks that need consistent AI behavior', 'General chatting'], answer: 1 },
        { q: 'Claude Projects differ from Custom GPTs by...', options: ['Being free', 'Supporting document uploads and persistent context', 'Being simpler'], answer: 1 },
        { q: 'The best Custom GPTs solve...', options: ['Everything', 'One specific business problem very well', 'Nothing practical'], answer: 1 },
      ]},
      { session: 12, title: 'Final Capstone Project', description: 'Build a complete AI solution combining all techniques', week: 4, tools: ['All tools'], isFree: false, deliverable: 'Capstone project + presentation + certificate', previewQuestions: [
        { q: 'The capstone should integrate at least...', options: ['1 technique', '4+ prompting techniques', 'Only system prompts'], answer: 1 },
        { q: 'The pass mark for the capstone is...', options: ['50/100', '70/100', '90/100'], answer: 1 },
        { q: 'After this course, the best next step is...', options: ['Stop learning', 'Explore AI agents, RAG, and advanced topics', 'Repeat the course'], answer: 1 },
      ]},
    ],
  },
  'ai-hustler-45': {
    id: 'ai-hustler-45',
    tagline: 'From zero to earning with AI in 45 days',
    description: 'The flagship program. 35 sessions covering AI tools, content creation, digital marketing, client acquisition, field work, and your FIRST PAID CLIENT. Graduate with real income, not just a certificate.',
    audience: 'Aspiring freelancers, job seekers, anyone who wants to earn with AI skills',
    duration: '10 weeks (35 sessions)',
    icon: '💰',
    originalPrice: 7999,
    onlinePrice: 999,
    highlights: ['Get your FIRST paid client', 'Real field work & client pitching', 'Complete freelancing business setup', 'Portfolio + certificate + income'],
    title: 'AI Hustler 45',
    slug: 'ai-hustler-45',
    totalSessions: 35,
    filePrefix: 'hustler',
    modules: [
      { session: 1, title: 'AI Foundations — What is AI?', description: 'Introduction to AI tools and landscape', week: 1, tools: ['ChatGPT', 'Claude', 'Gemini'], isFree: true, deliverable: 'AI tool accounts + first conversations', previewQuestions: [
        { q: 'What does AI stand for?', options: ['Automatic Intelligence', 'Artificial Intelligence', 'Advanced Internet'], answer: 1 },
        { q: 'Which is an AI tool?', options: ['Microsoft Word', 'ChatGPT', 'Calculator'], answer: 1 },
        { q: 'AI is best at...', options: ['Replacing humans', 'Augmenting human capabilities', 'Only entertainment'], answer: 1 },
      ], playgroundTask: {
        taskTitle: 'Your First AI Earnings Conversation',
        taskDescription: 'Have your first real conversation with AI — about how it can help YOU earn money with your existing skills.',
        timeEstimate: 'Takes 2 minutes',
        starterPrompt: `I'm based in Punjab. My background: 12th pass, comfortable with WhatsApp + basic computer use. No formal design or coding skills.

I want to earn money with AI in the next 3 months. Tell me:
1. The 3 most realistic AI-based services I could offer to local small businesses (sweets shops, boutiques, coaching centres)
2. For each, the minimum I need to learn before offering it
3. A realistic monthly income range for the first 3 months`,
        proTipChips: ['Background', 'Skills', 'Local market'],
        outroLine: 'You just had your first real AI conversation about earning. The journey starts now.',
        outputHeadline: '✨ Your First AI Earnings Map',
        successHeadline: 'Your first AI earnings map is ready — built around YOUR background.',
        continueButtonLabel: 'Sent? Continue → Session 2',
        // First session of Hustler 45 is the action-first calibration target.
        // Validates: do users move faster to the primary action when the
        // post-generation UI strips comparison + why-it-worked + open chips?
        successStyle: 'action-first',
        generateButtonLabel: '✨ Generate My First Earnings Map',
        useThisIn: ['whatsapp', 'email'],
        intentCommit: {
          reinforcement: 'Send this once. See what happens. The first reply changes everything.',
          ctaLabel: '✔ I will send it today',
          confirmedLine: 'Locked in. The first move is yours.',
          nextMicroStep: '↓ Open WhatsApp below and message one local business now (60 seconds)',
        },
        finishLine: {
          primary: '🏁 Pick the ONE service from the map that feels most like you.',
          microNudge: '💡 Don\'t pick what pays the most — pick what you\'d actually start tomorrow.',
          followThroughNudge: '📲 Message 1 business — that\'s how this turns into your first reply.',
        },
        repeatLoop: {
          tomorrow: 'Tomorrow: pick 3 local businesses to message about your service',
          counter: 'Day 1 of 45',
        },
        yourTurnNudge: 'Action over perfection. Start ugly, refine later.',
        refinementChips: [
          { label: '🎯 Niche to ONE service', instruction: 'Now pick the single most realistic of the 3 services for someone in a tier-3 Punjab town and double-click on it: 30-day skill plan, first 3 client types to approach, and a starter price.' },
          { label: '🇮🇳 Punjabi version', instruction: 'Now translate the whole earnings plan into Punjabi (Gurmukhi) — keep it warm and family-style, like advice from an older brother.' },
          { label: '💰 Add a daily routine', instruction: 'Now add a realistic 1-hour-per-day routine for 30 days that someone with a part-time job could actually follow to launch the first service.' },
        ],
        realWorldActions: [
          { label: '📱 Start my first outreach on WhatsApp', action: { type: 'whatsapp' } },
          { label: '📋 Copy', action: { type: 'copy' } },
          { label: '📧 Email to myself', action: { type: 'email' } },
        ],
      } },
      { session: 2, title: 'AI Landscape & Choosing Tools', description: 'Compare tools and choose the right one for each task', week: 1, tools: ['ChatGPT', 'Claude', 'Gemini'], isFree: false, deliverable: 'Tool comparison matrix', previewQuestions: [
        { q: 'The best AI tool depends on...', options: ['Popularity', 'The specific task', 'Price only'], answer: 1 },
        { q: 'Claude is especially good at...', options: ['Image generation', 'Long document analysis', 'Only coding'], answer: 1 },
        { q: 'You should use multiple AI tools because...', options: ['It is fun', 'Each has different strengths', 'One tool does everything'], answer: 0 },
      ], playgroundTask: {
        taskTitle: 'Your Personal AI Tool Choice Matrix',
        taskDescription: 'Stop guessing which AI tool to open. Get a clear "use this for that" matrix for the work YOU actually do.',
        timeEstimate: 'Takes 2 minutes',
        starterPrompt: `I do these 5 tasks regularly for small Punjab businesses:
1. Writing WhatsApp pitches and follow-ups
2. Drafting Instagram captions in English + Punjabi
3. Brainstorming festival promo ideas (Diwali, Karva Chauth, Lohri)
4. Quick research on competitor businesses online
5. Designing simple posters for shop owners

Budget: free tiers only for the first month.

Build me a Tool Choice Matrix: for each task, tell me Use First / Strong Second / Don't Bother. Be opinionated — I need a default, not a buffet.`,
        proTipChips: ['Tasks', 'Budget', 'Default tool'],
        outroLine: 'You now have a default for every task — no more "which tool should I open?" paralysis.',
        outputHeadline: '✨ Your AI Tool Choice Matrix',
        successHeadline: 'You have a default tool for every task. Open the matrix every time you start work.',
        continueButtonLabel: 'Lock in your stack → Session 3',
        refinementChips: [
          { label: '📱 Phone-only edition', instruction: 'Now rebuild the matrix assuming I only have a phone (no laptop) — recommend mobile-app versions of each tool.' },
          { label: '💸 Add ONE paid upgrade', instruction: 'Now suggest the SINGLE most worth-it paid upgrade if I had ₹500/month to spend on AI tools — and why.' },
          { label: '🇮🇳 Indic-language rule', instruction: 'Now add a "Punjabi/Hindi output" column to the matrix showing which tool is best when the output needs to be in Indic language.' },
        ],
        realWorldActions: [
          { label: '📋 Copy my matrix', action: { type: 'copy' } },
          { label: '📧 Email it to myself', action: { type: 'email' } },
        ],
      } },
      { session: 3, title: 'AI Deep Dive — Hands-On All Tools', description: 'Practice with every major AI tool', week: 1, tools: ['ChatGPT', 'Claude', 'Gemini', 'Canva'], isFree: false, deliverable: 'Multi-tool output comparison', previewQuestions: [
        { q: 'Hands-on practice is important because...', options: ['Reading is enough', 'You learn by doing', 'AI tools are simple'], answer: 1 },
        { q: 'When comparing tools, test with...', options: ['Different prompts', 'The same prompt across all tools', 'No prompts'], answer: 1 },
        { q: 'The goal of deep dive is...', options: ['Speed', 'Understanding each tool\'s strengths and limits', 'Memorizing menus'], answer: 1 },
      ], playgroundTask: {
        taskTitle: 'Same Problem, 3 AI Brains',
        taskDescription: 'See ChatGPT, Claude, and Gemini solve the same Punjab business problem 3 different ways — then pick the winning approach.',
        timeEstimate: 'Takes 3 minutes',
        starterPrompt: `Business: A 6-month-old saree boutique in Bathinda. Average sale ₹2,500. Owner has ₹3,000/month for marketing. Currently 800 Instagram followers, mostly local women aged 25-45. Foot traffic is slow on weekdays.

Problem: How should this boutique drive 20+ extra weekday walk-ins per week over the next 30 days?

Show me 3 different 30-day plans — one in ChatGPT-style (action-oriented, list-heavy), one in Claude-style (nuanced, prioritised, weighs trade-offs), one in Gemini-style (current trends + seasonal awareness). End with an Honest Verdict on which plan actually wins for THIS shop.`,
        proTipChips: ['Business', 'Constraints', 'Specific goal'],
        outroLine: 'You felt the difference between 3 AI brains. Now you can pick the right one for each job.',
        outputHeadline: '✨ Same Problem. 3 Brains. 3 Plans.',
        successHeadline: 'You can now choose the right AI for the right thinking style.',
        continueButtonLabel: 'Take the winning plan → Session 4',
        refinementChips: [
          { label: '🍬 Switch business type', instruction: 'Now run the same 3-brains exercise but for a Patiala mithai shop wanting to drive Diwali pre-orders. Same 3 styles, same Honest Verdict.' },
          { label: '⏱️ 7-day version', instruction: 'Now compress the winning plan into a 7-day sprint instead of 30 days — keep the same quality of moves, just front-loaded.' },
          { label: '💸 Cut budget in half', instruction: 'Now redo the winning plan assuming the budget drops to ₹1,500/month — what changes, what gets cut.' },
        ],
        realWorldActions: [
          { label: '📋 Copy the 3 plans', action: { type: 'copy' } },
          { label: '📧 Email them to myself', action: { type: 'email' } },
        ],
      } },
      { session: 4, title: 'Prompt Engineering — 5-Block Framework', description: 'Master structured prompting for business use', week: 1, tools: ['ChatGPT', 'Claude'], isFree: false, deliverable: 'Prompt library with 20+ prompts', previewQuestions: [
        { q: 'A structured prompt includes...', options: ['One word', 'Role, context, task, format, and constraints', 'Just a question'], answer: 1 },
        { q: 'Better prompts give...', options: ['Slower responses', 'More accurate and useful outputs', 'No difference'], answer: 1 },
        { q: 'The 5-Block Framework helps by...', options: ['Making prompts longer', 'Organizing your instructions clearly', 'Confusing the AI'], answer: 1 },
      ], playgroundTask: {
        taskTitle: 'Your First 5-Block Prompt → 5 Send-Ready Captions',
        taskDescription: 'Run a fully-structured Role / Context / Task / Format / Constraints prompt and feel why structure beats wishing.',
        timeEstimate: 'Takes 3 minutes',
        starterPrompt: `**Role:** You are a senior Punjab content marketer with 10 years experience writing for small local businesses.

**Context:** I run a 2-year-old home-based bakery in Patiala. I sell custom cakes (avg ₹800), cookies (₹250/box), and brownies (₹300/box). My customers are mostly working women aged 28-45 who order for birthdays, anniversaries, and Karva Chauth gifts. Marketing budget: ₹2,000/month. Currently 1,400 Instagram followers, mostly local.

**Task:** Write 5 Instagram captions to drive Karva Chauth gift orders this season.

**Format:** For each caption give me:
- Full caption text (under 200 characters)
- The single best emoji
- A specific CTA (DM / WhatsApp / link)
- The exact hashtag set (5 hashtags)

**Constraints:** Warm, family-aware tone. No "amazing/premium/world-class" filler. Mix English with 1-2 Hindi/Punjabi words where natural. Each caption MUST take a different angle.`,
        proTipChips: ['Role', 'Context', 'Task', 'Format', 'Constraints'],
        outroLine: 'You ran a real 5-block prompt. Now do this for YOUR business and you have a content engine.',
        outputHeadline: '✨ 5 Send-Ready Karva Chauth Captions',
        successHeadline: 'This is what structured prompting produces. Now write the same prompt for YOUR business.',
        continueButtonLabel: 'Use the framework on your work → Session 5',
        refinementChips: [
          { label: '🇮🇳 Punjabi versions', instruction: 'Now add a Punjabi (Gurmukhi) version of each caption alongside the English one — keep the same warmth, family-style tone.' },
          { label: '💎 Premium product line', instruction: 'Now rewrite the same 5 captions but for a premium product line: ₹1,800 limited-edition cake boxes (only 12 made). Adjust scarcity language accordingly.' },
          { label: '📱 WhatsApp version', instruction: 'Now adapt these 5 captions into 5 WhatsApp broadcast messages (under 350 chars each) for sending to past customers.' },
        ],
        realWorldActions: [
          { label: '📋 Copy these captions', action: { type: 'copy' } },
          { label: '📱 Send first one via WhatsApp', action: { type: 'whatsapp', sectionMatch: 'Caption 1' } },
          { label: '📧 Email all 5', action: { type: 'email' } },
        ],
        comparison: {
          basicPromptLabel: 'Write 5 Karva Chauth captions for my home bakery in Patiala.',
          basicOutput: `1. ✨ Make this Karva Chauth special with our delicious cakes! Order now! #karvachauth #cakes #patiala

2. 🎂 Beautiful cakes for the most beautiful festival. DM to order. #cake #karvachauth

3. 💕 Show your love with our amazing cakes this Karva Chauth! #love #karvachauth

4. 🌙 Celebrate Karva Chauth with sweet memories. Order today! #celebration #cakes

5. 🌟 Premium quality cakes for your special day. Visit us now! #premium #cake #patiala`,
        },
        whyItWorked: {
          heading: 'Why your 5-block prompt produced 10× better output',
          bullets: [
            '**Role** — "senior Punjab content marketer with 10 years" → captions had voice and authority, not generic AI tone.',
            '**Context** — "Patiala bakery, ₹800 cakes, working women 28-45, ₹2K budget" → every caption was specific to the actual business reality.',
            '**Task** — "5 Karva Chauth captions" → output was decisive, on-brief, no hedging.',
            '**Format** — "caption + emoji + CTA + hashtags" → structured output you can paste straight into Instagram.',
            '**Constraints** — "warm, family-aware, no filler, mix Hindi/Punjabi, different angles" → the bumpers that prevent generic slop.',
          ],
        },
        yourTurnTemplate: `**Role:** You are a senior Punjab content marketer with 10 years experience writing for small local businesses.

**Context:** I run [YOUR BUSINESS — e.g. a saree boutique, fitness studio, coaching centre] in [YOUR CITY/TOWN]. My average sale is ₹[YOUR PRICE]. My customers are [YOUR CUSTOMERS — e.g. women 25-45, parents of school kids]. Marketing budget: ₹[YOUR BUDGET]/month.

**Task:** Write 5 [PLATFORM — Instagram / WhatsApp / Facebook] captions that drive [YOUR GOAL — bookings / pre-orders / enquiries] for [YOUR OCCASION — Diwali / new launch / weekend special].

**Format:** For each caption give me:
- Full caption text (under 200 characters)
- The single best emoji
- A specific CTA (DM / WhatsApp / link)
- The exact hashtag set (5 hashtags)

**Constraints:** Warm, family-aware tone. No "amazing/premium/world-class" filler. Mix English with 1-2 Hindi/Punjabi words where natural. Each caption MUST take a different angle.`,
        yourTurnHeadline: 'Now run the 5-Block on YOUR business',
        yourTurnBody: 'Reading the example doesn\'t teach the skill — writing one for your own business does. Replace the bracketed fields with YOUR details and generate again.',
      } },
      { session: 5, title: 'ChatGPT Deep Dive — English Content', description: 'Create business content in English using ChatGPT', week: 2, tools: ['ChatGPT'], isFree: false, deliverable: 'Business content portfolio (English)', previewQuestions: [
        { q: 'Business content should be...', options: ['Very long', 'Clear, professional, and action-oriented', 'Informal always'], answer: 1 },
        { q: 'ChatGPT helps businesses by...', options: ['Replacing writers', 'Drafting content quickly that humans refine', 'Nothing'], answer: 1 },
        { q: 'The best content prompts specify...', options: ['Nothing', 'Audience, tone, format, and purpose', 'Only the topic'], answer: 1 },
      ]},
      { session: 6, title: 'ChatGPT Deep Dive — Hindi & Punjabi', description: 'Create multilingual business content', week: 2, tools: ['ChatGPT'], isFree: false, deliverable: 'Business content in Hindi and Punjabi', previewQuestions: [
        { q: 'Multilingual content matters because...', options: ['It looks impressive', 'Local businesses need content in local languages', 'AI only works in English'], answer: 1 },
        { q: 'For Hindi/Punjabi content, you should...', options: ['Translate from English', 'Create directly in the target language with cultural context', 'Use Google Translate only'], answer: 1 },
        { q: 'Regional language content helps businesses...', options: ['Nothing', 'Connect with local customers authentically', 'Only in rural areas'], answer: 1 },
      ]},
      { session: 7, title: 'Canva AI — Social Media Graphics', description: 'Design professional social media content with Canva AI', week: 2, tools: ['Canva'], isFree: false, deliverable: '10 social media designs', previewQuestions: [
        { q: 'Canva AI can...', options: ['Only make logos', 'Generate designs, edit photos, and create brand kits', 'Replace Photoshop completely'], answer: 1 },
        { q: 'Good social media designs are...', options: ['Very text-heavy', 'Visual, branded, and clear', 'Always complex'], answer: 1 },
        { q: 'Consistent branding means...', options: ['Random colors', 'Same fonts, colors, and style across all posts', 'Different every time'], answer: 1 },
      ]},
      { session: 8, title: 'Canva AI — Marketing Materials', description: 'Create flyers, brochures, and business cards', week: 2, tools: ['Canva'], isFree: false, deliverable: 'Marketing materials set', previewQuestions: [
        { q: 'Marketing materials should...', options: ['Be as cheap as possible', 'Look professional and reflect the brand', 'Use clip art'], answer: 1 },
        { q: 'Canva templates save time by...', options: ['Doing everything automatically', 'Providing professional starting points you customize', 'Limiting creativity'], answer: 1 },
        { q: 'A good business card includes...', options: ['Everything about the business', 'Name, title, contact info, and brand colors', 'Only a phone number'], answer: 1 },
      ]},
      { session: 9, title: 'Canva AI — Professional Portfolio', description: 'Build a portfolio that wins clients', week: 3, tools: ['Canva'], isFree: false, deliverable: 'Professional portfolio', previewQuestions: [
        { q: 'A portfolio shows...', options: ['Your education only', 'Your best work and results', 'Everything you ever made'], answer: 1 },
        { q: 'Portfolio pieces should include...', options: ['Just images', 'The problem, your solution, and the results', 'Only text'], answer: 1 },
        { q: 'The best portfolios are...', options: ['Very long', 'Curated to show range and quality', 'Generic templates'], answer: 1 },
      ]},
      { session: 10, title: 'Video AI — HeyGen Avatars', description: 'Create AI avatar marketing videos', week: 3, tools: ['HeyGen'], isFree: false, deliverable: 'AI avatar marketing video', previewQuestions: [
        { q: 'HeyGen creates...', options: ['Written content', 'AI avatar videos from text scripts', 'Music'], answer: 1 },
        { q: 'AI videos help businesses by...', options: ['Nothing', 'Creating professional video content without filming', 'Replacing TV'], answer: 1 },
        { q: 'A good video script is...', options: ['Very long', 'Short, clear, and has a call to action', 'Improvised'], answer: 1 },
      ]},
      { session: 11, title: 'Video AI — Voiceovers & CapCut', description: 'AI voiceovers and video editing', week: 3, tools: ['CapCut', 'ElevenLabs'], isFree: false, deliverable: 'Edited video with AI voiceover', previewQuestions: [
        { q: 'AI voiceovers are useful for...', options: ['Nothing', 'Creating professional narration without recording', 'Only music'], answer: 1 },
        { q: 'CapCut helps with...', options: ['Writing', 'Video editing with AI-powered features', 'Spreadsheets'], answer: 1 },
        { q: 'Good video editing keeps videos...', options: ['As long as possible', 'Engaging, paced well, and focused', 'Silent'], answer: 1 },
      ]},
      { session: 12, title: 'Video AI — 3 Types of Marketing Videos', description: 'Create testimonial, explainer, and promo videos', week: 3, tools: ['CapCut', 'HeyGen', 'Canva'], isFree: false, deliverable: '3 marketing video types', previewQuestions: [
        { q: 'The 3 types of marketing videos are...', options: ['Random, funny, long', 'Testimonial, explainer, and promotional', 'Only ads'], answer: 1 },
        { q: 'Testimonial videos work because...', options: ['They are cheap', 'Real people sharing real results builds trust', 'They are short'], answer: 1 },
        { q: 'An explainer video should...', options: ['Be 30 minutes', 'Clearly explain the product/service in under 2 minutes', 'Have no visuals'], answer: 1 },
      ]},
      { session: 13, title: 'Digital Marketing Fundamentals Day 1', description: 'SEO, content marketing, and online presence basics', week: 4, tools: ['ChatGPT', 'Google'], isFree: false, deliverable: 'Digital marketing plan', previewQuestions: [
        { q: 'SEO stands for...', options: ['Social Email Outreach', 'Search Engine Optimization', 'Simple Email Operations'], answer: 1 },
        { q: 'Content marketing is about...', options: ['Spamming posts', 'Creating valuable content that attracts customers', 'Only paid ads'], answer: 1 },
        { q: 'Every business needs...', options: ['TV ads', 'An online presence (Google, social media, website)', 'Only word of mouth'], answer: 1 },
      ]},
      { session: 14, title: 'Digital Marketing — Social Media Strategy', description: 'Build a complete social media strategy', week: 4, tools: ['ChatGPT', 'Canva', 'Meta'], isFree: false, deliverable: 'Social media strategy document', previewQuestions: [
        { q: 'A social media strategy defines...', options: ['Random posting', 'Goals, audience, content pillars, and schedule', 'Only hashtags'], answer: 1 },
        { q: 'Content pillars are...', options: ['Building supports', '3-5 topic categories you consistently post about', 'Only educational content'], answer: 1 },
        { q: 'Posting consistency matters because...', options: ['It wastes time', 'Algorithms favor regular, quality content', 'Once a month is enough'], answer: 1 },
      ]},
      { session: 15, title: 'Portfolio Building + Phase 1 Exam', description: 'Compile portfolio and take Phase 1 certification exam', week: 4, tools: ['All tools'], isFree: false, deliverable: 'Complete portfolio + Phase 1 certificate', previewQuestions: [
        { q: 'A portfolio should contain...', options: ['Everything', 'Your best work organized by service type', 'Only one project'], answer: 1 },
        { q: 'The Phase 1 exam tests...', options: ['Memory', 'Your ability to create a complete business package under time pressure', 'Speed typing'], answer: 1 },
        { q: 'Phase 2 focuses on...', options: ['More theory', 'Applied skills and real client work', 'Taking a break'], answer: 1 },
      ]},
      { session: 16, title: 'Advanced Prompt Engineering — CRISP', description: 'Advanced prompting techniques for client work', week: 5, tools: ['ChatGPT', 'Claude'], isFree: false, deliverable: 'Advanced prompt library', previewQuestions: [
        { q: 'Advanced prompting differs from basic by...', options: ['Being longer', 'Using structured frameworks and chaining', 'Being more confusing'], answer: 1 },
        { q: 'CRISP framework improves prompts by...', options: ['Making them shorter', 'Providing structure: Context, Role, Instructions, Specs, Parameters', 'Nothing'], answer: 1 },
        { q: 'Client-ready prompts must be...', options: ['Complicated', 'Consistent, professional, and produce quality output', 'Generic'], answer: 1 },
      ]},
      { session: 17, title: 'Field Visit — Real Business Needs', description: 'Visit local businesses and understand their digital needs', week: 5, tools: [], isFree: false, deliverable: 'Business needs audit reports', previewQuestions: [
        { q: 'Field visits help you understand...', options: ['Nothing new', 'Real problems businesses face that you can solve', 'Only theory'], answer: 1 },
        { q: 'When visiting a business, you should...', options: ['Pitch immediately', 'Listen, observe, and take notes first', 'Criticize their marketing'], answer: 1 },
        { q: 'A business audit checks...', options: ['Their finances', 'Their online presence: GMB, social media, website, reviews', 'Their employees'], answer: 1 },
      ]},
      { session: 18, title: 'Service Packages + Proposals', description: 'Create professional service packages and proposals', week: 5, tools: ['Canva', 'ChatGPT'], isFree: false, deliverable: 'Service package proposals', previewQuestions: [
        { q: 'Service packages should be...', options: ['One-size-fits-all', 'Tiered (basic/growth/premium) for different budgets', 'Very expensive only'], answer: 1 },
        { q: 'A proposal should include...', options: ['Just a price', 'Problem, solution, deliverables, timeline, and price', 'Only your resume'], answer: 1 },
        { q: 'Tiered pricing helps because...', options: ['It confuses clients', 'Clients choose the level that fits their budget', 'Only premium sells'], answer: 1 },
      ]},
      { session: 19, title: 'Contracts + Client Onboarding', description: 'Set up professional client relationships', week: 5, tools: ['ChatGPT', 'Canva'], isFree: false, deliverable: 'Contract template + onboarding checklist', previewQuestions: [
        { q: 'A contract protects...', options: ['Only the client', 'Both you and the client', 'Nobody'], answer: 1 },
        { q: 'Client onboarding should include...', options: ['Nothing formal', 'Welcome message, timeline, deliverables, and communication plan', 'Only an invoice'], answer: 1 },
        { q: 'Setting expectations early prevents...', options: ['Good results', 'Scope creep and misunderstandings', 'Client happiness'], answer: 1 },
      ]},
      { session: 20, title: 'WhatsApp Marketing Campaigns', description: 'Build effective WhatsApp marketing for businesses', week: 6, tools: ['WhatsApp Business'], isFree: false, deliverable: 'WhatsApp marketing campaign', previewQuestions: [
        { q: 'WhatsApp Business is useful for...', options: ['Personal chats only', 'Catalogs, auto-replies, and broadcast lists', 'Only large companies'], answer: 1 },
        { q: 'Broadcast lists differ from groups because...', options: ['They are the same', 'Messages appear as individual chats to recipients', 'They are public'], answer: 1 },
        { q: 'Good WhatsApp marketing is...', options: ['Spamming everyone', 'Targeted, valuable, and permission-based', 'Daily messages'], answer: 1 },
      ]},
      { session: 21, title: 'Google My Business Deep Dive', description: 'Master GMB for local business visibility', week: 6, tools: ['Google Business'], isFree: false, deliverable: 'Optimized GMB profile', previewQuestions: [
        { q: 'GMB helps businesses by...', options: ['Nothing', 'Appearing in local Google search and Maps results', 'Only for restaurants'], answer: 1 },
        { q: 'A complete GMB profile includes...', options: ['Just a name', 'Photos, hours, services, posts, and reviews', 'Only the address'], answer: 1 },
        { q: 'GMB posts should be...', options: ['Never updated', 'Posted weekly with offers, updates, and photos', 'Only text'], answer: 1 },
      ]},
      { session: 22, title: 'Meta Business Suite', description: 'Manage Facebook and Instagram professionally', week: 6, tools: ['Meta Business Suite'], isFree: false, deliverable: 'Scheduled social media week', previewQuestions: [
        { q: 'Meta Business Suite manages...', options: ['Only Facebook', 'Facebook and Instagram from one dashboard', 'Only ads'], answer: 1 },
        { q: 'Scheduling posts helps by...', options: ['Wasting time', 'Maintaining consistency without daily effort', 'Nothing'], answer: 1 },
        { q: 'Business Suite insights show...', options: ['Nothing useful', 'Reach, engagement, and audience demographics', 'Only follower count'], answer: 1 },
      ]},
      { session: 23, title: 'Sarvam AI + Multilingual Content', description: 'Create content in Indian languages using Sarvam AI', week: 7, tools: ['Sarvam AI', 'ChatGPT'], isFree: false, deliverable: 'Multilingual marketing content', previewQuestions: [
        { q: 'Sarvam AI specializes in...', options: ['English only', 'Indian languages including Hindi, Punjabi, Tamil', 'Only code'], answer: 1 },
        { q: 'Multilingual marketing helps businesses...', options: ['Nothing', 'Reach customers in their preferred language', 'Only in cities'], answer: 1 },
        { q: 'Good multilingual content is...', options: ['Direct translation', 'Culturally adapted and natural-sounding', 'Always formal'], answer: 1 },
      ]},
      { session: 24, title: 'Objection Handling Mastery', description: 'Handle client objections and close deals', week: 7, tools: [], isFree: false, deliverable: 'Objection handling scripts', previewQuestions: [
        { q: 'The LAAR framework stands for...', options: ['Look, Ask, Answer, Run', 'Listen, Acknowledge, Address, Redirect', 'Leave, Avoid, Argue, Reject'], answer: 1 },
        { q: 'When a client says "it\'s too expensive"...', options: ['Lower your price immediately', 'Show the ROI and value compared to the cost', 'Walk away'], answer: 1 },
        { q: 'Objections are actually...', options: ['Rejections', 'Buying signals that need addressing', 'Insults'], answer: 1 },
      ]},
      { session: 25, title: 'Workflow Automation', description: 'Automate repetitive tasks for efficiency', week: 7, tools: ['Zapier', 'Make'], isFree: false, deliverable: 'Automated client workflows', previewQuestions: [
        { q: 'Automation saves...', options: ['Nothing', 'Time on repetitive tasks so you can focus on growth', 'Only money'], answer: 1 },
        { q: 'A good automation candidate is...', options: ['Creative work', 'Repetitive tasks done the same way every time', 'One-time projects'], answer: 1 },
        { q: 'Zapier connects...', options: ['Physical devices', 'Different apps to work together automatically', 'Only Google products'], answer: 1 },
      ]},
      { session: 26, title: 'Phase 2 Practical Exam', description: 'Pitch a complete client package under pressure', week: 7, tools: [], isFree: false, deliverable: 'Phase 2 certification', previewQuestions: [
        { q: 'The Phase 2 exam is...', options: ['Written test', 'A 15-minute live pitch to a simulated client', 'Multiple choice'], answer: 1 },
        { q: 'Pass mark for Phase 2 is...', options: ['50/100', '70/100', '90/100'], answer: 1 },
        { q: 'The exam tests...', options: ['Memory', 'Real client-facing skills under pressure', 'Speed'], answer: 1 },
      ]},
      { session: 27, title: 'Business Skills for Freelancers', description: 'Invoicing, tax basics, income tracking, time management', week: 8, tools: ['Canva', 'Google Sheets'], isFree: false, deliverable: 'Complete freelancing business setup', previewQuestions: [
        { q: 'A professional invoice must include...', options: ['Just the amount', 'Invoice number, date, services, amount, payment details', 'Only your name'], answer: 1 },
        { q: 'GST registration is needed above...', options: ['₹5 lakh/year', '₹20 lakh/year', '₹50 lakh/year'], answer: 1 },
        { q: 'Time blocking helps freelancers...', options: ['Work less', 'Handle multiple clients without burnout', 'Avoid clients'], answer: 1 },
      ]},
      { session: 28, title: 'Field Work Day 1 — Guided Sprint', description: 'Trainer demonstrates live business approaches', week: 8, tools: [], isFree: false, deliverable: 'Observation notes + approach scripts', previewQuestions: [
        { q: 'Field work starts with...', options: ['Cold calling', 'Watching the trainer approach businesses first', 'Sending emails'], answer: 1 },
        { q: 'During trainer demos, you should...', options: ['Just watch', 'Take detailed notes on what works', 'Do nothing'], answer: 1 },
        { q: 'The first approach should always...', options: ['Start with pricing', 'Build rapport and ask about their business', 'Criticize their marketing'], answer: 1 },
      ]},
      { session: 29, title: 'Field Work Day 2 — Solo Sprint', description: 'Students approach businesses in pairs', week: 8, tools: [], isFree: false, deliverable: '5+ business approaches + contact info collected', previewQuestions: [
        { q: 'Approaching in pairs helps with...', options: ['Nothing', 'Safety and confidence', 'Speed'], answer: 1 },
        { q: 'A successful approach ends with...', options: ['A sale', 'Contact info and permission to follow up', 'Nothing'], answer: 1 },
        { q: 'Free trials help because...', options: ['You lose money', 'Businesses can see value before committing', 'They always convert'], answer: 1 },
      ]},
      { session: 30, title: 'Field Work Day 3 — Follow-Up Sprint', description: 'Follow up with leads and convert to clients', week: 9, tools: ['WhatsApp'], isFree: false, deliverable: 'Follow-up messages sent + meetings scheduled', previewQuestions: [
        { q: 'Follow-up should happen within...', options: ['A month', '24-48 hours of first meeting', 'Never'], answer: 1 },
        { q: 'The best follow-up includes...', options: ['Just "are you interested?"', 'A quick win or free audit showing immediate value', 'A price list'], answer: 1 },
        { q: 'Most deals close after...', options: ['First contact', '2-3 follow-ups', 'One email'], answer: 1 },
      ]},
      { session: 31, title: 'Field Work Day 4 — Intensive Outreach', description: 'Maximum business outreach and conversion', week: 9, tools: ['WhatsApp', 'Canva'], isFree: false, deliverable: 'Client pipeline with 10+ leads', previewQuestions: [
        { q: 'Intensive outreach means...', options: ['Spamming', 'Focused, high-volume quality approaches', 'One email'], answer: 1 },
        { q: 'A client pipeline tracks...', options: ['Nothing', 'All leads from first contact to signed deal', 'Only payments'], answer: 1 },
        { q: 'The goal of Day 31 is...', options: ['Rest', 'Maximum qualified leads in the pipeline', 'Theory review'], answer: 1 },
      ]},
      { session: 32, title: 'Deliver Day 1 — First Client Project', description: 'Execute your first paid client project', week: 9, tools: ['All tools'], isFree: false, deliverable: 'First client deliverables', previewQuestions: [
        { q: 'First client delivery should be...', options: ['Average', 'Exceptional — first impressions matter most', 'Quick and dirty'], answer: 1 },
        { q: 'Client communication during delivery should be...', options: ['None until done', 'Regular updates showing progress', 'Only when problems arise'], answer: 1 },
        { q: 'Quality control means...', options: ['Skipping review', 'Checking every deliverable before sending to client', 'Only spell check'], answer: 1 },
      ]},
      { session: 33, title: 'Deliver, Close & Collect — FIRST PAYMENT', description: 'Complete delivery, close the deal, collect your first payment', week: 9, tools: ['All tools'], isFree: false, deliverable: 'First payment received', previewQuestions: [
        { q: 'Collecting payment should happen...', options: ['Eventually', 'Immediately upon delivery with a professional invoice', 'Only if they offer'], answer: 1 },
        { q: 'After first payment, you should...', options: ['Disappear', 'Ask for a testimonial and discuss ongoing services', 'Lower your prices'], answer: 1 },
        { q: 'Your first payment proves...', options: ['Nothing', 'Your skills have real market value', 'You got lucky'], answer: 1 },
      ]},
      { session: 34, title: 'Scale, Systematize & Grow', description: 'Build systems to go from 1 client to 5+', week: 10, tools: ['Google Sheets', 'Canva'], isFree: false, deliverable: 'Growth plan + retainer packages + testimonials', previewQuestions: [
        { q: 'Scaling requires...', options: ['Working 5x harder', 'Systems: templates, SOPs, automation', 'Luck'], answer: 1 },
        { q: 'Monthly retainers provide...', options: ['Unpredictable income', 'Predictable recurring revenue', 'Less work'], answer: 1 },
        { q: 'The 90-day plan targets...', options: ['₹1,000/month', '₹25,000-35,000/month with 5-7 clients', '₹1,00,000/month'], answer: 1 },
      ]},
      { session: 35, title: 'Demo Day + Graduation', description: 'Present your best work and earn your certificate', week: 10, tools: [], isFree: false, deliverable: 'Final presentation + TARAhut AI Hustler 45 certificate', previewQuestions: [
        { q: 'Demo Day presentation is...', options: ['30 minutes', '5 minutes: best work + client story + income', 'Optional'], answer: 1 },
        { q: 'After graduation, the alumni network provides...', options: ['Nothing', 'Ongoing support, referrals, and learning', 'A job'], answer: 1 },
        { q: 'The most important outcome of AI Hustler 45 is...', options: ['The certificate', 'The skills and confidence to earn independently', 'Attendance'], answer: 1 },
      ]},
    ],
  },
  'ai-for-digital-marketing': {
    id: 'ai-for-digital-marketing',
    tagline: 'AI-powered digital marketing mastery',
    description: 'Learn to run marketing campaigns 5x faster using AI. Cover social media, SEO, email marketing, paid ads, WhatsApp marketing, analytics, and build your own AI marketing agency.',
    audience: 'Marketing professionals, business owners, aspiring digital marketers',
    duration: '4 weeks (12 sessions)',
    icon: '📈',
    originalPrice: 24999,
    onlinePrice: 999,
    highlights: ['Social media marketing with AI', 'SEO & content marketing', 'Paid ads & email automation', 'Build your AI marketing agency'],
    title: 'AI for Digital Marketing',
    slug: 'ai-for-digital-marketing',
    totalSessions: 12,
    filePrefix: 'dm',
    modules: [
      { session: 1, title: 'AI Fundamentals + The Marketing Opportunity', description: 'Understand AI landscape and its impact on digital marketing', week: 1, tools: ['ChatGPT', 'Claude', 'Gemini'], isFree: true, deliverable: 'AI marketing opportunity analysis', previewQuestions: [
        { q: 'What is the biggest advantage of AI in marketing?', options: ['It replaces marketers', 'It automates repetitive tasks and personalizes at scale', 'It only works for big companies'], answer: 1 },
        { q: 'Which AI tool is best for marketing copy?', options: ['Only ChatGPT', 'It depends on the task — different tools have different strengths', 'AI cannot write marketing copy'], answer: 1 },
        { q: 'AI in marketing is most useful for...', options: ['Replacing creativity', 'Data-driven decisions and content creation at scale', 'Only email marketing'], answer: 1 },
      ]},
      { session: 2, title: 'Understanding the Digital Customer Journey', description: 'Map customer journeys and identify AI touchpoints', week: 1, tools: ['ChatGPT', 'Claude'], isFree: false, deliverable: 'AI-enhanced customer journey map', previewQuestions: [
        { q: 'The customer journey starts with...', options: ['Purchase', 'Awareness — the customer discovers your brand', 'Loyalty'], answer: 1 },
        { q: 'AI improves the customer journey by...', options: ['Removing human interaction', 'Personalizing each touchpoint based on behavior data', 'Making it longer'], answer: 1 },
        { q: 'A customer journey map helps you...', options: ['Nothing', 'Identify gaps and opportunities in your marketing funnel', 'Only track sales'], answer: 1 },
      ]},
      { session: 3, title: 'AI-Powered Social Media Marketing', description: 'Master Facebook, Instagram & YouTube marketing with AI', week: 1, tools: ['ChatGPT', 'Canva', 'Meta Business Suite'], isFree: false, deliverable: '7-day social media content calendar with AI-generated posts', previewQuestions: [
        { q: 'The best social media strategy is...', options: ['Post randomly', 'Consistent, planned content aligned with business goals', 'Only paid ads'], answer: 1 },
        { q: 'AI helps social media marketing by...', options: ['Posting automatically without strategy', 'Generating content ideas, captions, hashtags, and visuals', 'Replacing the marketing team'], answer: 1 },
        { q: 'Content pillars are...', options: ['Building supports', '3-5 core topic categories you consistently create around', 'Only educational posts'], answer: 1 },
      ]},
      { session: 4, title: 'Content Marketing with AI', description: 'Create blogs, newsletters & marketing copy using AI', week: 2, tools: ['ChatGPT', 'Claude', 'Canva'], isFree: false, deliverable: 'Blog post + newsletter + marketing copy portfolio', previewQuestions: [
        { q: 'Content marketing works because...', options: ['People love ads', 'Valuable content builds trust and attracts customers organically', 'It is cheap'], answer: 1 },
        { q: 'AI-written content should always be...', options: ['Published as-is', 'Reviewed, fact-checked, and edited by a human', 'Ignored'], answer: 1 },
        { q: 'The best AI copywriting prompt includes...', options: ['Just the topic', 'Audience, tone, format, key points, and CTA', 'Nothing specific'], answer: 1 },
      ]},
      { session: 5, title: 'AI for SEO & Search Marketing', description: 'Optimize content for search engines using AI tools', week: 2, tools: ['ChatGPT', 'Claude', 'Google Search Console'], isFree: false, deliverable: 'SEO-optimized content + keyword strategy', previewQuestions: [
        { q: 'SEO stands for...', options: ['Social Email Outreach', 'Search Engine Optimization', 'Simple Easy Operations'], answer: 1 },
        { q: 'AI helps SEO by...', options: ['Hacking Google rankings', 'Generating keyword ideas, meta descriptions, and optimized content', 'Replacing Google'], answer: 1 },
        { q: 'The most important SEO factor is...', options: ['Keyword stuffing', 'High-quality, relevant content that answers user queries', 'Paying Google'], answer: 1 },
      ]},
      { session: 6, title: 'AI-Powered Email Marketing & Automation', description: 'Build automated email campaigns with AI', week: 2, tools: ['ChatGPT', 'Mailchimp'], isFree: false, deliverable: '5-email automated sequence', previewQuestions: [
        { q: 'Email marketing ROI is...', options: ['Very low', 'One of the highest of any marketing channel (~36x)', 'Only for big companies'], answer: 1 },
        { q: 'AI improves email marketing by...', options: ['Sending more spam', 'Personalizing subject lines, content, and send times', 'Nothing'], answer: 1 },
        { q: 'A good email sequence includes...', options: ['One email', 'Welcome, value, story, offer, and follow-up emails', 'Only sales emails'], answer: 1 },
      ]},
      { session: 7, title: 'AI Video Marketing & Visual Content', description: 'Create professional marketing videos with AI', week: 3, tools: ['HeyGen', 'CapCut', 'Canva'], isFree: false, deliverable: 'Marketing video + thumbnail + visual content set', previewQuestions: [
        { q: 'Video marketing is important because...', options: ['People prefer reading', 'Video gets 2x more engagement than text on social media', 'Only for YouTube'], answer: 1 },
        { q: 'AI video tools like HeyGen can...', options: ['Only edit existing videos', 'Create AI avatar videos from text scripts in minutes', 'Replace professional studios completely'], answer: 1 },
        { q: 'A good marketing video is...', options: ['As long as possible', 'Short, engaging, with a clear CTA within 60 seconds', 'Only about features'], answer: 1 },
      ]},
      { session: 8, title: 'AI for Paid Advertising', description: 'Create & optimize Google Ads and Meta Ads with AI', week: 3, tools: ['ChatGPT', 'Google Ads', 'Meta Ads'], isFree: false, deliverable: 'Ad campaign setup + AI-generated ad variations', previewQuestions: [
        { q: 'Paid advertising works best when...', options: ['You spend the most money', 'Ads are targeted, relevant, and well-optimized', 'You run one ad forever'], answer: 1 },
        { q: 'AI helps paid ads by...', options: ['Making them free', 'Generating ad copy variations, audience suggestions, and bid optimization', 'Replacing the ad platform'], answer: 1 },
        { q: 'A/B testing means...', options: ['Testing A and B grades', 'Running two versions to see which performs better', 'Testing on mobile only'], answer: 1 },
      ]},
      { session: 9, title: 'WhatsApp & Conversational Marketing', description: 'Build AI-powered WhatsApp marketing campaigns', week: 3, tools: ['WhatsApp Business', 'ChatGPT'], isFree: false, deliverable: 'WhatsApp marketing campaign + chatbot flow', previewQuestions: [
        { q: 'WhatsApp marketing in India is powerful because...', options: ['Everyone uses it', 'Over 500M users with 95%+ open rates', 'It is free'], answer: 1 },
        { q: 'AI chatbots on WhatsApp help by...', options: ['Spamming customers', 'Providing instant 24/7 responses and qualifying leads', 'Replacing salespeople completely'], answer: 1 },
        { q: 'Permission-based marketing means...', options: ['Messaging anyone', 'Only messaging people who opted in to receive messages', 'Asking permission after messaging'], answer: 1 },
      ]},
      { session: 10, title: 'AI Analytics, Reporting & ROI', description: 'Measure marketing performance with AI-powered analytics', week: 4, tools: ['Google Analytics', 'ChatGPT', 'Google Sheets'], isFree: false, deliverable: 'Marketing dashboard + ROI report', previewQuestions: [
        { q: 'Marketing ROI measures...', options: ['How much you spent', 'Revenue generated relative to marketing investment', 'Only website traffic'], answer: 1 },
        { q: 'AI helps analytics by...', options: ['Making numbers up', 'Identifying patterns, predicting trends, and generating insights', 'Only creating charts'], answer: 1 },
        { q: 'The most important marketing metric depends on...', options: ['Nothing', 'Your specific business goals (leads, sales, awareness)', 'Always follower count'], answer: 1 },
      ]},
      { session: 11, title: 'Building Your AI Marketing Agency', description: 'Package skills into services and attract clients', week: 4, tools: ['Canva', 'ChatGPT', 'Claude'], isFree: false, deliverable: 'Service packages + pricing + portfolio website', previewQuestions: [
        { q: 'An AI marketing agency differs from traditional by...', options: ['Nothing', 'Delivering faster, more personalized work using AI tools', 'Being cheaper'], answer: 1 },
        { q: 'Tiered pricing (basic/growth/premium) helps because...', options: ['It confuses clients', 'Clients choose the level matching their budget', 'Only premium sells'], answer: 1 },
        { q: 'The first step to getting clients is...', options: ['Buying ads', 'Building a portfolio that demonstrates results', 'Waiting for referrals'], answer: 1 },
      ]},
      { session: 12, title: 'Capstone — Complete AI Marketing Campaign', description: 'Plan, create & present a full AI-powered marketing campaign', week: 4, tools: ['All tools'], isFree: false, deliverable: 'Complete marketing campaign + presentation + certificate', previewQuestions: [
        { q: 'A complete marketing campaign includes...', options: ['Just social media posts', 'Strategy, content, ads, email, analytics, and reporting', 'Only paid advertising'], answer: 1 },
        { q: 'The capstone must demonstrate...', options: ['One skill', 'Integration of all 11 sessions into a cohesive campaign', 'Only theory knowledge'], answer: 1 },
        { q: 'After this course, the best next step is...', options: ['Stop learning', 'Start your AI marketing agency or service business', 'Repeat the course'], answer: 1 },
      ]},
    ],
  },
  'master-ai-builder': {
    id: 'master-ai-builder',
    tagline: 'Build real AI products from scratch',
    description: 'The builder\u2019s path. Learn no-code tools, AI APIs, chatbots, automation, website building, SaaS development, and AI agents. Graduate with a working AI product you can sell.',
    audience: 'Aspiring builders, entrepreneurs, developers wanting to build AI products',
    duration: '4 weeks (12 sessions)',
    icon: '🛠️',
    originalPrice: 24999,
    onlinePrice: 999,
    highlights: ['No-code AI app building', 'AI APIs & integrations', 'Build & launch a SaaS product', 'AI agents & automation'],
    title: 'Master AI Builder',
    slug: 'master-ai-builder',
    totalSessions: 12,
    filePrefix: 'builder',
    modules: [
      { session: 1, title: 'AI Awakening — Understanding AI & Builder Mindset', description: 'Introduction to AI and the builder mindset', week: 1, tools: ['ChatGPT', 'Claude', 'Gemini'], isFree: true, deliverable: 'AI landscape map + personal builder roadmap', previewQuestions: [
        { q: 'The AI builder mindset focuses on...', options: ['Consuming AI content', 'Building products and solutions using AI tools', 'Only learning theory'], answer: 1 },
        { q: 'The best AI builders start by...', options: ['Learning everything first', 'Identifying a real problem to solve, then using AI to solve it', 'Only watching tutorials'], answer: 1 },
        { q: 'AI tools are evolving so fast that...', options: ['You should wait to learn', 'Building skills now gives you a massive advantage', 'They will replace builders'], answer: 1 },
      ]},
      { session: 2, title: 'No-Code AI Tools', description: 'Build apps without coding using Bubble, Softr, Glide', week: 1, tools: ['Bubble', 'Softr', 'Glide'], isFree: false, deliverable: 'Working no-code app prototype', previewQuestions: [
        { q: 'No-code tools are useful because...', options: ['Coding is dead', 'You can build and test ideas quickly without programming', 'They make better apps'], answer: 1 },
        { q: 'Bubble is best for...', options: ['Simple forms', 'Complex web apps with custom logic and databases', 'Only mobile apps'], answer: 1 },
        { q: 'The biggest advantage of no-code for AI builders is...', options: ['Cost savings', 'Speed — you can go from idea to prototype in hours', 'No learning needed'], answer: 1 },
      ]},
      { session: 3, title: 'AI Chatbots & Assistants', description: 'Build Custom GPTs and Claude Projects for businesses', week: 1, tools: ['ChatGPT', 'Claude'], isFree: false, deliverable: '3 custom AI assistants for different use cases', previewQuestions: [
        { q: 'Custom GPTs are powerful because...', options: ['They are free', 'You can create specialized AI tools for specific tasks', 'They replace all software'], answer: 1 },
        { q: 'A good AI assistant needs...', options: ['No configuration', 'Clear instructions, relevant knowledge, and defined boundaries', 'Only a name'], answer: 1 },
        { q: 'Claude Projects differ from Custom GPTs by...', options: ['Being identical', 'Supporting persistent document context and longer conversations', 'Being simpler'], answer: 1 },
      ]},
      { session: 4, title: 'AI Automation — Workflows & Triggers', description: 'Automate business processes with Zapier, Make, n8n', week: 2, tools: ['Zapier', 'Make', 'n8n'], isFree: false, deliverable: '5 automated workflows for common business tasks', previewQuestions: [
        { q: 'Automation is most valuable for...', options: ['One-time tasks', 'Repetitive tasks that follow the same pattern', 'Creative work'], answer: 1 },
        { q: 'Zapier connects apps by...', options: ['Manual copy-paste', 'Triggers and actions — when X happens, do Y', 'Only within Google'], answer: 1 },
        { q: 'n8n differs from Zapier by...', options: ['Being the same', 'Being open-source and self-hostable with more complex logic', 'Being simpler'], answer: 1 },
      ]},
      { session: 5, title: 'AI Website Building', description: 'Build websites with v0, Bolt, Lovable, and Cursor', week: 2, tools: ['v0', 'Bolt', 'Cursor'], isFree: false, deliverable: 'Complete website built with AI tools', previewQuestions: [
        { q: 'AI website builders like v0 work by...', options: ['Picking templates', 'Generating code from natural language descriptions', 'Only making logos'], answer: 1 },
        { q: 'Cursor helps developers by...', options: ['Replacing them', 'AI-powered code editing, debugging, and generation', 'Only formatting code'], answer: 1 },
        { q: 'The best approach to AI website building is...', options: ['Accept whatever AI generates', 'Describe clearly, iterate, and customize the output', 'Only use templates'], answer: 1 },
      ]},
      { session: 6, title: 'AI for Data & Analytics', description: 'Analyze data using Sheets AI, Pandas AI, Julius', week: 2, tools: ['Google Sheets', 'Julius AI'], isFree: false, deliverable: 'Data analysis report with AI-generated insights', previewQuestions: [
        { q: 'AI data analysis helps by...', options: ['Making up numbers', 'Finding patterns and insights humans might miss', 'Only making charts'], answer: 1 },
        { q: 'Julius AI can...', options: ['Only open files', 'Analyze data, create visualizations, and answer questions in plain English', 'Replace data scientists'], answer: 1 },
        { q: 'The most important data skill is...', options: ['Complex formulas', 'Asking the right questions about your data', 'Memorizing functions'], answer: 1 },
      ]},
      { session: 7, title: 'AI Voice & Video Apps', description: 'Build voice and video tools with ElevenLabs, HeyGen, Descript', week: 3, tools: ['ElevenLabs', 'HeyGen', 'Descript'], isFree: false, deliverable: 'AI voiceover + avatar video + edited content', previewQuestions: [
        { q: 'ElevenLabs is best known for...', options: ['Image generation', 'Ultra-realistic AI voice cloning and text-to-speech', 'Video editing'], answer: 1 },
        { q: 'AI video tools help businesses by...', options: ['Nothing', 'Creating professional video content without expensive production', 'Only for entertainment'], answer: 1 },
        { q: 'Voice cloning should be used...', options: ['To impersonate anyone', 'Ethically — only with consent and for legitimate purposes', 'Never'], answer: 1 },
      ]},
      { session: 8, title: 'AI APIs & Integration Basics', description: 'Learn OpenAI API and Claude API fundamentals', week: 3, tools: ['OpenAI API', 'Claude API'], isFree: false, deliverable: 'Working API integration + custom AI tool', previewQuestions: [
        { q: 'An API is...', options: ['A programming language', 'A way for software applications to communicate with each other', 'Only for developers'], answer: 1 },
        { q: 'The OpenAI API lets you...', options: ['Use ChatGPT for free', 'Build custom applications powered by GPT models', 'Only send text messages'], answer: 1 },
        { q: 'API keys should be...', options: ['Shared publicly', 'Kept secret and stored securely as environment variables', 'Put in the HTML'], answer: 1 },
      ]},
      { session: 9, title: 'Building SaaS Products with AI', description: 'Go from idea to MVP using AI tools', week: 3, tools: ['v0', 'Cursor', 'Supabase'], isFree: false, deliverable: 'SaaS MVP with landing page, auth, and core feature', previewQuestions: [
        { q: 'MVP stands for...', options: ['Most Valuable Product', 'Minimum Viable Product — the simplest version that solves the problem', 'Maximum Value Plan'], answer: 1 },
        { q: 'The best SaaS ideas come from...', options: ['Copying competitors', 'Real problems you or others experience repeatedly', 'Random brainstorming'], answer: 1 },
        { q: 'AI accelerates SaaS building by...', options: ['Writing all the code perfectly', 'Helping with code, copy, design, and iteration speed', 'Making it effortless'], answer: 1 },
      ]},
      { session: 10, title: 'AI Agents & Multi-Step Workflows', description: 'Build autonomous AI agents that complete complex tasks', week: 4, tools: ['Claude', 'LangChain', 'CrewAI'], isFree: false, deliverable: 'Working AI agent that completes a multi-step business task', previewQuestions: [
        { q: 'AI agents differ from chatbots by...', options: ['Being more expensive', 'Taking autonomous actions and using tools to complete tasks', 'Being the same thing'], answer: 1 },
        { q: 'Multi-step workflows are useful for...', options: ['Simple Q&A', 'Complex tasks requiring research, analysis, and action', 'Only coding'], answer: 1 },
        { q: 'The key challenge with AI agents is...', options: ['Speed', 'Reliability — ensuring they complete tasks correctly', 'They are too simple'], answer: 1 },
      ]},
      { session: 11, title: 'Monetization & Launching Your AI Product', description: 'Price, market, and launch your AI-powered product', week: 4, tools: ['Stripe', 'Canva', 'ChatGPT'], isFree: false, deliverable: 'Launch plan + pricing strategy + marketing materials', previewQuestions: [
        { q: 'The best pricing strategy for AI products is...', options: ['Always free', 'Value-based — price based on the problem you solve, not your costs', 'As expensive as possible'], answer: 1 },
        { q: 'A good launch includes...', options: ['Just posting on social media', 'Landing page, waitlist, demo, content, and outreach strategy', 'Only Product Hunt'], answer: 1 },
        { q: 'The most common reason AI products fail is...', options: ['Bad technology', 'Not solving a real problem that people will pay for', 'Competition'], answer: 1 },
      ]},
      { session: 12, title: 'Capstone — Build & Present Your AI Product', description: 'Complete your AI product and present to panel', week: 4, tools: ['All tools'], isFree: false, deliverable: 'Working AI product + pitch deck + demo + certificate', previewQuestions: [
        { q: 'The capstone should demonstrate...', options: ['One tool', 'End-to-end product building skills from idea to launch', 'Only theory'], answer: 1 },
        { q: 'A good product demo shows...', options: ['Every feature', 'The core problem, solution, and key user flow', 'Only the tech stack'], answer: 1 },
        { q: 'After Master AI Builder, the best path is...', options: ['Stop building', 'Launch your product, get users, iterate, and keep building', 'Wait for better AI'], answer: 1 },
      ]},
    ],
  },
};

// Backward-compatible export for existing code that imports learnModules
export const learnModules = courseConfigs['ai-tools-mastery-beginners'].modules;

// Helper to get course config by ID
export function getCourseConfig(courseId: string): CourseConfig | undefined {
  return courseConfigs[courseId];
}
