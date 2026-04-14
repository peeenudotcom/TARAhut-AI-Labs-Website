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
  'ai-explorer-junior': {
    id: 'ai-explorer-junior',
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
};

// Backward-compatible export for existing code that imports learnModules
export const learnModules = courseConfigs['ai-tools-mastery-beginners'].modules;

// Helper to get course config by ID
export function getCourseConfig(courseId: string): CourseConfig | undefined {
  return courseConfigs[courseId];
}
