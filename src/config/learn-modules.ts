export interface LearnModule {
  session: number;
  title: string;
  description: string;
  week: number;
  tools: string[];
  isFree: boolean;
  deliverable: string;
  previewQuestions: { q: string; options: string[]; answer: number }[];
}

export interface CourseConfig {
  id: string;
  title: string;
  slug: string;
  totalSessions: number;
  filePrefix: string; // 'session' for Tools Mastery, 'claude' for Master Claude
  modules: LearnModule[];
}

export const courseConfigs: Record<string, CourseConfig> = {
  'ai-tools-mastery-beginners': {
    id: 'ai-tools-mastery-beginners',
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
      },
    ],
  },
  'master-claude-15-days': {
    id: 'master-claude-15-days',
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
};

// Backward-compatible export for existing code that imports learnModules
export const learnModules = courseConfigs['ai-tools-mastery-beginners'].modules;

// Helper to get course config by ID
export function getCourseConfig(courseId: string): CourseConfig | undefined {
  return courseConfigs[courseId];
}
