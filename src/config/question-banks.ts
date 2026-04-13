export interface QuizQuestion {
  q: string;      // question text
  o: string[];    // 4 options
  a: number;      // correct answer index (0-3)
  e: string;      // explanation shown after answering
}

export const questionBanks: Record<number, QuizQuestion[]> = {
  1: [
    // --- EASY (10) ---
    {
      q: "What does AI stand for?",
      o: ["Automated Interface", "Artificial Intelligence", "Advanced Integration", "Automated Information"],
      a: 1,
      e: "AI stands for Artificial Intelligence — systems designed to simulate human thinking, learning, and decision-making.",
    },
    {
      q: "Which of the following is the best example of AI in everyday life?",
      o: ["A ceiling fan with a remote control", "A calculator app on your phone", "Google Maps suggesting the fastest route", "A digital alarm clock"],
      a: 2,
      e: "Google Maps uses AI to analyze real-time traffic data and predict the fastest route, making it a classic everyday AI application.",
    },
    {
      q: "What is Narrow AI (also called Weak AI)?",
      o: ["AI that can do any task a human can do", "AI designed to perform one specific task very well", "AI that has emotions and self-awareness", "AI that only works on narrow screens"],
      a: 1,
      e: "Narrow AI is built to excel at one specific task — like recognizing faces, translating languages, or recommending movies — but cannot generalize beyond that.",
    },
    {
      q: "Which company created ChatGPT?",
      o: ["Google", "Meta", "OpenAI", "Microsoft"],
      a: 2,
      e: "ChatGPT was created by OpenAI, a San Francisco-based AI research company founded in 2015.",
    },
    {
      q: "Which of these AI tools was created by Google?",
      o: ["Claude", "ChatGPT", "Gemini", "Copilot"],
      a: 2,
      e: "Gemini is Google's AI model, competing directly with ChatGPT and Claude in the conversational AI space.",
    },
    {
      q: "When you use face unlock on your phone, which type of AI is being used?",
      o: ["General AI", "Superintelligence", "Narrow AI", "Robotic AI"],
      a: 2,
      e: "Face unlock is a specific, narrow AI task — the system is trained only to recognize faces and cannot do anything else.",
    },
    {
      q: "What is Claude?",
      o: ["A search engine by Microsoft", "An AI assistant made by Anthropic", "A video editing tool", "A social media platform"],
      a: 1,
      e: "Claude is a conversational AI assistant developed by Anthropic, known for being thoughtful, safe, and highly capable at writing and analysis.",
    },
    {
      q: "Which Indian app uses AI to recommend songs based on your listening habits?",
      o: ["Paytm", "Gaana or Spotify", "WhatsApp", "Truecaller"],
      a: 1,
      e: "Apps like Gaana and Spotify use AI recommendation engines to learn your taste and suggest songs you are likely to enjoy.",
    },
    {
      q: "In which decade was the term 'Artificial Intelligence' first coined?",
      o: ["1930s", "1950s", "1970s", "1990s"],
      a: 1,
      e: "The term 'Artificial Intelligence' was coined by John McCarthy in 1956 at the Dartmouth Conference, which is considered the birth of AI as a field.",
    },
    {
      q: "What do AI systems primarily learn from?",
      o: ["Instructions written by programmers for every situation", "Large amounts of data", "Human emotions", "Solar energy"],
      a: 1,
      e: "AI systems learn by finding patterns in massive datasets — the more relevant data they have, the better they perform.",
    },
    // --- MEDIUM (10) ---
    {
      q: "What is Artificial General Intelligence (AGI)?",
      o: ["An AI that specializes in geometry problems", "A robot that can walk and talk", "A hypothetical AI that can perform any intellectual task a human can", "The current version of ChatGPT"],
      a: 2,
      e: "AGI refers to a theoretical AI system that can reason, learn, and apply knowledge across any domain — just like a human — which does not yet exist.",
    },
    {
      q: "Which of these is a common misconception about AI?",
      o: ["AI can make mistakes", "AI learns from data", "AI is conscious and has feelings", "AI can be used for writing"],
      a: 2,
      e: "AI is not conscious — it does not have feelings, desires, or self-awareness. It processes data and generates statistically likely outputs.",
    },
    {
      q: "Truecaller identifying spam calls in Punjab is an example of:",
      o: ["Superintelligence", "Narrow AI", "General AI", "Human AI collaboration"],
      a: 1,
      e: "Truecaller uses narrow AI trained specifically to detect and flag spam calls — a single, well-defined task.",
    },
    {
      q: "How does a recommendation algorithm on YouTube decide what to show you next?",
      o: ["A human editor curates it manually", "It shows random videos", "It analyzes patterns in your viewing history and similar users' behavior", "It asks you directly what you want to watch"],
      a: 2,
      e: "YouTube's AI studies your watch history, likes, and watch time alongside millions of similar users to predict what you'll enjoy next.",
    },
    {
      q: "What type of AI would a self-driving car primarily use?",
      o: ["Superintelligence", "Multiple narrow AI systems working together", "General AI", "No AI — just sensors"],
      a: 1,
      e: "Self-driving cars use several specialized narrow AI systems — one for object detection, one for path planning, one for traffic sign recognition — working in concert.",
    },
    {
      q: "Which of the following best describes how ChatGPT generates a response?",
      o: ["It searches the internet in real time for every answer", "It copies answers from a database of FAQs", "It predicts the most likely next words based on patterns learned from training data", "A human operator types the reply"],
      a: 2,
      e: "ChatGPT is a Large Language Model that predicts the most contextually appropriate next token (word/part) based on billions of examples it was trained on.",
    },
    {
      q: "What is one key difference between ChatGPT and Gemini?",
      o: ["ChatGPT can only answer in English", "Gemini is built by OpenAI", "Gemini is deeply integrated with Google's ecosystem like Search and Docs", "ChatGPT has no free tier"],
      a: 2,
      e: "Gemini's major advantage is its tight integration with Google Workspace tools — Gmail, Google Docs, and Search — making it powerful for users in Google's ecosystem.",
    },
    {
      q: "AI systems that recommend products on Amazon or Flipkart are trained primarily on:",
      o: ["Employee opinions about products", "Astrological data", "User purchase history, browsing patterns, and ratings", "Random product listings"],
      a: 2,
      e: "E-commerce recommendation engines analyze your past purchases, what you browsed, and the behavior of similar shoppers to suggest relevant products.",
    },
    {
      q: "Which statement about AI history is correct?",
      o: ["AI was invented with the iPhone in 2007", "AI as a concept dates back to the 1950s with pioneers like Alan Turing", "AI was created by ChatGPT's launch in 2022", "Robots existed before AI was conceptualized"],
      a: 1,
      e: "Alan Turing proposed the concept of machine intelligence in 1950 with his famous 'Turing Test', predating modern computers and the internet by decades.",
    },
    {
      q: "A farmer in Punjab using an app to identify crop diseases from a photo is using which type of AI?",
      o: ["Superintelligence", "General AI", "Narrow AI (image classification)", "No AI — just a photo filter"],
      a: 2,
      e: "Crop disease identification from photos is an image classification task — a narrow AI trained specifically on agricultural images to detect disease patterns.",
    },
    // --- HARD (5) ---
    {
      q: "What is the 'Turing Test' designed to measure?",
      o: ["The processing speed of a computer", "Whether a machine can exhibit intelligent behavior indistinguishable from a human in conversation", "How much data an AI has been trained on", "The security of an AI system"],
      a: 1,
      e: "Proposed by Alan Turing in 1950, the Turing Test evaluates whether a machine's conversational responses are indistinguishable from a human's — a foundational benchmark for machine intelligence.",
    },
    {
      q: "What is the primary technical reason AI models like ChatGPT can 'hallucinate' false information?",
      o: ["They are deliberately programmed to lie", "They lack internet access", "They predict statistically likely text without a built-in truth-verification mechanism", "Their training data is from the 1800s"],
      a: 2,
      e: "LLMs generate the most statistically probable continuation of text — if the training data contained errors or gaps, the model can confidently produce incorrect information because it has no separate fact-checking layer.",
    },
    {
      q: "Which of the following would be closest to Artificial General Intelligence (AGI)?",
      o: ["A chess-playing program that beats grandmasters", "A system that can learn to drive, diagnose diseases, write poetry, and trade stocks without being specifically programmed for each", "An AI that translates 200 languages perfectly", "A voice assistant that controls smart home devices"],
      a: 1,
      e: "AGI requires flexible, cross-domain reasoning — the ability to transfer learning from one domain to another without retraining, which no current AI system can truly do.",
    },
    {
      q: "Why is training a large AI model on data from only one region problematic?",
      o: ["It makes the model too fast", "The model may perform poorly and show bias toward groups underrepresented in the training data", "It violates copyright law automatically", "It makes the model multilingual by accident"],
      a: 1,
      e: "Biased or non-representative training data leads to models that work well for some demographics but poorly — or unfairly — for others, a critical challenge in building equitable AI systems.",
    },
    {
      q: "What fundamentally distinguishes a modern Large Language Model (LLM) from a traditional rule-based AI system?",
      o: ["LLMs are faster to run on servers", "LLMs use pre-written IF-THEN rules for every possible input", "LLMs learn statistical patterns from data and generalize, rather than following hand-coded logic", "LLMs only work with text while rule-based systems work with images"],
      a: 2,
      e: "Traditional AI required engineers to manually code rules for every scenario; LLMs infer patterns from billions of examples, enabling flexible, open-ended responses without explicit programming for each case.",
    },
  ],

  2: [
    // --- EASY (10) ---
    {
      q: "In AI ethics, what does 'AI hallucination' mean?",
      o: ["The AI sees images that don't exist", "The AI confidently generates false or made-up information", "The AI becomes too slow to respond", "The AI screens go blank randomly"],
      a: 1,
      e: "AI hallucination refers to when an AI model produces information that sounds confident and plausible but is factually incorrect or entirely fabricated.",
    },
    {
      q: "What is the 'pilot and co-pilot' analogy used to describe in AI?",
      o: ["AI flies airplanes autonomously", "You remain in control while AI assists you — like a co-pilot supports the pilot", "AI and humans take turns controlling the same task", "AI is only useful in the aviation industry"],
      a: 1,
      e: "The pilot/co-pilot analogy means you stay in charge (the pilot) and AI assists you with tasks (the co-pilot) — AI enhances your decisions, it doesn't replace them.",
    },
    {
      q: "Which of these is an example of AI bias?",
      o: ["An AI that takes longer to respond on weekends", "A hiring AI that consistently ranks male candidates higher than equally qualified female candidates", "An AI chatbot that responds in multiple languages", "An AI that suggests faster routes based on traffic"],
      a: 1,
      e: "AI bias occurs when a model's output systematically disadvantages certain groups, often because the training data reflected historical inequalities.",
    },
    {
      q: "What should you do after AI generates important information for you?",
      o: ["Trust it completely and use it immediately", "Delete the AI response and do it yourself", "Verify it against reliable sources before using it", "Share it on social media right away"],
      a: 2,
      e: "AI can and does make mistakes. Always verify critical information — especially facts, statistics, and medical/legal advice — through credible sources.",
    },
    {
      q: "What is a deepfake?",
      o: ["A very deep neural network", "AI-generated fake media (video/audio/images) that looks convincingly real", "A type of password encryption", "A deep-sea research robot"],
      a: 1,
      e: "Deepfakes use AI to create hyper-realistic fake videos, images, or audio — often of real people — which can be used for misinformation, fraud, or harassment.",
    },
    {
      q: "Which of these is a responsible use of AI?",
      o: ["Using AI to generate fake news articles", "Using AI to write a first draft and then editing it yourself", "Using AI to cheat on an exam without disclosure", "Using AI to create fake reviews for your business"],
      a: 1,
      e: "Responsible AI use means leveraging it as a tool to enhance your work, being transparent about its role, and taking accountability for the final output.",
    },
    {
      q: "Why is privacy a concern when using AI tools?",
      o: ["AI makes your phone battery drain faster", "AI tools may store, analyze, or train on the personal data you share with them", "AI tools require your home address to function", "Privacy is not actually a concern with AI"],
      a: 1,
      e: "When you share personal data with AI services, that data may be used for training, stored on servers, or potentially accessed by the company — always review privacy policies.",
    },
    {
      q: "What does the 'mindset shift' from 'AI will replace me' to 'AI will help me' mean practically?",
      o: ["You should fear AI and avoid learning it", "You should focus on learning how to work with AI to become more productive and valuable", "You should only use AI for fun, not work", "AI cannot actually help with professional tasks"],
      a: 1,
      e: "The right mindset is viewing AI as a force multiplier — professionals who know how to use AI well will be more capable and valuable than those who don't.",
    },
    {
      q: "A student in Ludhiana uses AI to write their entire assignment and submits it as their own. This is an example of:",
      o: ["Responsible AI use", "AI bias", "Academic dishonesty and unethical AI use", "AI hallucination"],
      a: 2,
      e: "Submitting AI-generated work as entirely your own without disclosure is dishonest. Ethical AI use means being transparent and using AI to support — not replace — your own thinking.",
    },
    {
      q: "What career path benefits most from AI skills in 2025?",
      o: ["Only software engineers", "Only data scientists", "Almost every profession — from teachers and doctors to marketers and lawyers", "Only people who work at tech companies"],
      a: 2,
      e: "AI literacy is becoming a universal professional skill. Teachers, healthcare workers, marketers, lawyers, farmers, and entrepreneurs all benefit from knowing how to use AI effectively.",
    },
    // --- MEDIUM (10) ---
    {
      q: "What is the first of the 5 mindset shifts for working effectively with AI?",
      o: ["Learn to code first", "Shift from fear to curiosity — approach AI as a tool to explore", "Replace all your work with AI immediately", "Only use AI for creative tasks"],
      a: 1,
      e: "The foundational mindset shift is moving from anxiety or fear about AI to genuine curiosity — experimenting with it openly to discover how it can serve your goals.",
    },
    {
      q: "If a chatbot confidently tells you that a historical event happened in 1845 but it actually happened in 1947, this is called:",
      o: ["A deepfake", "An AI hallucination", "An AI bias", "A prompt error"],
      a: 1,
      e: "This is an AI hallucination — the model generated a plausible-sounding but factually incorrect date with full confidence, without any signal that it was wrong.",
    },
    {
      q: "How does AI bias typically enter a model?",
      o: ["Through slow internet connections", "Through biased or unrepresentative training data", "Through the user's questions", "Through software bugs in the UI"],
      a: 1,
      e: "AI models learn from their training data. If that data reflects historical biases — in language, hiring patterns, medical research — the model will inherit and potentially amplify those biases.",
    },
    {
      q: "In the context of AI ethics, what is 'informed consent'?",
      o: ["Getting consent from the AI before using it", "Users knowing and agreeing to how their data will be collected and used by AI systems", "The AI asking permission before answering sensitive questions", "A legal form signed by AI companies"],
      a: 1,
      e: "Informed consent means users are clearly told what data is being collected, how it will be used, and have genuinely agreed to those terms — a cornerstone of ethical AI and data privacy.",
    },
    {
      q: "A teacher in Amritsar notices that an AI essay grader consistently gives lower scores to essays written in Punjabi-influenced English. This is an example of:",
      o: ["AI hallucination", "AI bias based on linguistic diversity in training data", "Responsible AI use", "A deepfake"],
      a: 1,
      e: "This illustrates linguistic bias — if the AI was trained mainly on 'standard' Western English essays, it may penalize regional dialects or writing styles unfairly.",
    },
    {
      q: "What is the most important verification step after getting an AI-generated response?",
      o: ["Run the response through another AI", "Check the AI's confidence score", "Cross-reference key facts and claims with authoritative, independent sources", "Print the response and file it"],
      a: 2,
      e: "The most reliable verification is cross-referencing with authoritative sources — peer-reviewed papers, government data, established news organizations — not just running it through another AI.",
    },
    {
      q: "What does 'AI transparency' mean?",
      o: ["AI tools should have clear, see-through interfaces", "Being open about when and how AI was used to create content", "AI companies sharing all their code publicly", "AI should show you its calculations"],
      a: 1,
      e: "AI transparency means being honest — with yourself, your audience, or your organization — about the role AI played in creating a piece of work.",
    },
    {
      q: "Which of these AI career paths has the highest average salary globally in 2025?",
      o: ["AI Content Writer", "AI Prompt Engineer", "AI/ML Engineer", "AI Customer Support Specialist"],
      a: 2,
      e: "AI/ML Engineers who build and fine-tune machine learning models command the highest salaries, often $150,000–$300,000+ annually at top companies.",
    },
    {
      q: "Why should you avoid entering sensitive personal data (like your Aadhaar number or medical records) into public AI chatbots?",
      o: ["AI cannot process personal data", "It may violate the AI's usage terms, and the data could be stored, shared, or used for training", "It will cause the chatbot to crash", "AI tools charge extra for processing sensitive data"],
      a: 1,
      e: "Most public AI chatbots store conversation data and may use it for model improvement. Sharing sensitive personal or business data puts your privacy and security at risk.",
    },
    {
      q: "A business in Chandigarh uses AI-generated customer testimonials without disclosing they are fake. This raises which ethical concern?",
      o: ["AI hallucination", "Deepfake creation only", "Deception and consumer fraud — an ethical and potentially legal violation", "AI bias"],
      a: 2,
      e: "Using AI to create fake testimonials without disclosure is a form of deception. It violates consumer trust and may breach advertising and consumer protection laws.",
    },
    // --- HARD (5) ---
    {
      q: "What is the 'alignment problem' in AI ethics?",
      o: ["Making AI systems run efficiently on different hardware", "Ensuring AI systems pursue goals that are genuinely beneficial to humans, not just technically correct", "Aligning AI text with correct grammar", "Getting different AI tools to communicate with each other"],
      a: 1,
      e: "The alignment problem is the challenge of ensuring that an AI's objectives truly match human values and intentions — a powerful AI optimizing for the wrong goal could cause serious harm.",
    },
    {
      q: "Which of the following best describes 'explainable AI' (XAI)?",
      o: ["AI that can explain jokes", "AI systems designed to provide human-understandable reasons for their decisions", "AI that is simple enough for children to use", "AI that writes explanations for complex topics"],
      a: 1,
      e: "Explainable AI (XAI) refers to AI systems where the reasoning behind decisions can be understood by humans — critical in high-stakes domains like medicine, law, and finance.",
    },
    {
      q: "A hospital in India uses an AI diagnostic tool trained exclusively on Western patient data. What is the most serious risk?",
      o: ["The tool will be slower", "Diagnostic accuracy may be significantly lower for Indian patients due to population-specific biological differences not represented in training data", "The tool will cost more to run", "The hospital's internet will be slower"],
      a: 1,
      e: "Training data determines what a model knows. If Indian patients have different disease prevalence patterns, genetic markers, or presentation styles, a model trained on Western data may systematically misdiagnose them.",
    },
    {
      q: "What distinguishes 'AI as a tool' from 'AI as a decision-maker' from an ethics standpoint?",
      o: ["There is no meaningful ethical difference", "When AI is the decision-maker, human accountability is removed, which is ethically problematic in consequential domains", "AI as a tool is always more expensive", "Only AI decision-making is legal"],
      a: 1,
      e: "When humans retain decision-making authority, accountability is clear. When AI autonomously makes consequential decisions (loan approvals, parole, medical treatment), it becomes unclear who is responsible for harmful outcomes.",
    },
    {
      q: "What is 'differential privacy' in the context of AI data ethics?",
      o: ["Privacy settings that differ by country", "A mathematical technique that adds carefully calculated noise to datasets so individual data points cannot be identified while overall patterns remain useful", "Privacy for paid AI users vs free users", "A system where different employees have different data access"],
      a: 1,
      e: "Differential privacy is a rigorous mathematical approach to data privacy — it allows AI systems to learn from sensitive data while providing strong guarantees that individual users' information cannot be extracted from the model.",
    },
  ],

  3: [
    // --- EASY (10) ---
    {
      q: "What is a 'prompt' in the context of AI tools?",
      o: ["A reminder notification on your phone", "The instruction or input you give to an AI to get a response", "The AI's training data", "A type of computer program"],
      a: 1,
      e: "A prompt is simply what you type or say to an AI tool — it's your instruction, question, or request that the AI responds to.",
    },
    {
      q: "What does the 'R' in the RCTF prompt framework stand for?",
      o: ["Response", "Role", "Result", "Request"],
      a: 1,
      e: "In the RCTF framework, R stands for Role — you assign the AI a specific persona or expertise (e.g., 'Act as a senior marketing consultant').",
    },
    {
      q: "What does the 'T' in the RCTF framework stand for?",
      o: ["Tone", "Task", "Template", "Text"],
      a: 1,
      e: "T stands for Task — the specific action you want the AI to perform, such as 'write', 'summarize', 'translate', or 'analyze'.",
    },
    {
      q: "Which of these is a better prompt?",
      o: ["Write something about marketing", "Write a 200-word Instagram caption for a new mango pickle brand targeting young adults in Punjab, using a fun and local tone", "Tell me about business", "Help me with my work"],
      a: 1,
      e: "Specific prompts produce specific, useful results. The second option gives the AI clear context (product, platform, audience, tone, length), dramatically improving output quality.",
    },
    {
      q: "What does the 'C' in RCTF stand for?",
      o: ["Clarity", "Context", "Command", "Content"],
      a: 1,
      e: "C stands for Context — background information that helps the AI understand your situation, such as your industry, audience, or the purpose of the task.",
    },
    {
      q: "What does the 'F' in RCTF stand for?",
      o: ["Facts", "Frequency", "Format", "Feedback"],
      a: 2,
      e: "F stands for Format — specifying how you want the AI to structure its response, such as bullet points, a table, a numbered list, or a formal report.",
    },
    {
      q: "Which of these is a vague, low-quality prompt?",
      o: ["Write a 5-step beginner guide to starting a YouTube channel in Hindi", "Tell me stuff", "Summarize this article in 3 bullet points", "Write a formal email declining a meeting request"],
      a: 1,
      e: "'Tell me stuff' gives the AI zero context, audience, topic, or format guidance — the resulting response will almost certainly be too generic to be useful.",
    },
    {
      q: "Why is giving the AI a 'role' helpful?",
      o: ["It makes the AI respond faster", "It sets the expertise level and perspective the AI should adopt, leading to more targeted responses", "It prevents the AI from making mistakes", "It allows the AI to access the internet"],
      a: 1,
      e: "Assigning a role (e.g., 'You are an experienced CA') primes the AI to approach the topic from that expertise level, producing more relevant and appropriately detailed responses.",
    },
    {
      q: "A shopkeeper in Patiala wants to use AI to write a WhatsApp message about a Diwali sale. Which prompt is better?",
      o: ["Write a WhatsApp message about Diwali sale for my general store in Patiala, offering 20% off on all items, keep it friendly and under 80 words", "Write a Diwali message", "Tell me about Diwali", "Give me ideas for Diwali"],
      a: 0,
      e: "The first prompt includes all key details — medium (WhatsApp), occasion, location, offer details, tone, and length — giving AI everything it needs to produce a directly usable message.",
    },
    {
      q: "What is the most common mistake beginners make when writing prompts?",
      o: ["Using too many technical words", "Being too vague and not providing enough context or specifics", "Making prompts too long", "Using the wrong AI tool"],
      a: 1,
      e: "The number one beginner mistake is vagueness. Without context, audience, format, and goal, the AI can only guess what you need — and usually guesses wrong.",
    },
    // --- MEDIUM (10) ---
    {
      q: "Which complete RCTF prompt is written correctly?",
      o: [
        "Role: Career coach. Context: A 25-year-old IT professional in Chandigarh wants to switch to AI product management. Task: Write a 90-day learning roadmap. Format: Numbered weekly milestones.",
        "Help me with my career change",
        "Write something useful for someone in IT",
        "Career advice please"
      ],
      a: 0,
      e: "The first option correctly applies all four RCTF elements — it gives the AI a role, background context, a clear task, and a specific output format.",
    },
    {
      q: "You ask AI to 'write a business plan' and the result is too generic. What should you do?",
      o: ["Try a completely different AI tool", "Give up and write it yourself", "Refine your prompt by adding your specific business type, target market, city, and budget", "Ask the AI to try again with exactly the same prompt"],
      a: 2,
      e: "Iterative refinement means improving your prompt based on the AI's output. Adding specifics — your industry, location, scale, audience — transforms a generic plan into a relevant one.",
    },
    {
      q: "What is the purpose of specifying 'Format' in a prompt?",
      o: ["To choose the AI's font size", "To control the structure of the output so it matches how you plan to use it", "To speed up the AI's response", "To set the language the AI responds in"],
      a: 1,
      e: "Format instructions (e.g., 'respond in bullet points', 'use a table', 'write 3 short paragraphs') ensure the AI's output is in a form you can immediately use without heavy reformatting.",
    },
    {
      q: "A teacher wants AI to create a quiz. Which prompt best applies RCTF?",
      o: [
        "Make a quiz",
        "Role: Experienced teacher. Context: Class 8 students in a government school in Punjab learning fractions for the first time. Task: Create 5 multiple-choice questions. Format: Each question with 4 options and the correct answer marked.",
        "Quiz about math please",
        "Help me test my students"
      ],
      a: 1,
      e: "This prompt specifies the teacher role, the specific student context (class, region, topic level), the exact task, and the format — all four RCTF elements are covered.",
    },
    {
      q: "What does 'prompt chaining' mean?",
      o: ["Writing very long prompts", "Using multiple linked prompts where the output of one becomes the input of the next", "Copying prompts from the internet", "Locking a prompt so others can't use it"],
      a: 1,
      e: "Prompt chaining breaks complex tasks into a sequence of smaller prompts — each building on the previous output — allowing you to tackle tasks too complex for a single prompt.",
    },
    {
      q: "Why should you specify the target audience in your prompt?",
      o: ["The AI charges less for targeted prompts", "The AI's tone, vocabulary, and depth of explanation adjust based on who the content is for", "Audience specification prevents hallucinations", "AI cannot understand audience without specification"],
      a: 1,
      e: "The same topic explained for a 10-year-old needs very different language than for a PhD researcher. Specifying your audience helps AI calibrate complexity, vocabulary, and examples appropriately.",
    },
    {
      q: "You want AI to help write a formal complaint letter to a bank. Which element is most critical to include?",
      o: ["Your favorite font", "Specific context: your name, the issue, the date it happened, and what resolution you want", "The AI tool's version number", "The number of pages you want"],
      a: 1,
      e: "For a formal letter, concrete context is essential — without the specific details of the complaint, the AI can only produce a generic template that won't be usable.",
    },
    {
      q: "What happens when you use role-playing in a prompt (e.g., 'Act as a nutritionist')?",
      o: ["The AI literally becomes a qualified nutritionist", "The AI frames its responses from the perspective and expertise of that role, making output more relevant", "The AI refuses to answer because it's not actually a nutritionist", "Nothing changes in the output"],
      a: 1,
      e: "Role assignment biases the AI toward relevant knowledge and communication style for that role — though it doesn't make the AI actually qualified, it does make outputs more contextually appropriate.",
    },
    {
      q: "Which format specification would be most useful for getting a quick comparison of two AI tools?",
      o: ["Write it as a poem", "Respond in a 3-column table: Feature | ChatGPT | Claude", "Give me one very long paragraph", "Use numbered list"],
      a: 1,
      e: "A comparison table is the most scannable, structured format for comparing two things across multiple dimensions — it lets you see differences at a glance.",
    },
    {
      q: "A prompt says: 'Write a recipe.' What critical information is missing?",
      o: ["Nothing is missing — this is a complete prompt", "Dish name, dietary restrictions, serving size, cooking skill level, and available equipment", "The AI's preferred cooking style", "The calorie count"],
      a: 1,
      e: "Without knowing what dish, for how many people, with what dietary needs, and at what skill level, the AI can only guess — resulting in a generic recipe that may not be useful at all.",
    },
    // --- HARD (5) ---
    {
      q: "What is a 'negative prompt' and when is it useful?",
      o: ["A prompt that asks the AI to criticize something", "Telling the AI explicitly what NOT to include — used to exclude unwanted content or styles from the output", "A failed prompt that produced bad results", "A prompt written in a negative tone"],
      a: 1,
      e: "Negative prompts explicitly constrain outputs by excluding unwanted elements (e.g., 'do not use jargon', 'avoid mentioning competitors', 'no bullet points') — especially powerful in image generation and creative writing.",
    },
    {
      q: "Why does adding 'think step by step' to a prompt often improve complex reasoning tasks?",
      o: ["It makes the AI response longer", "It triggers the AI to break down reasoning into sequential steps, reducing logical errors through structured thinking", "It forces the AI to search the internet", "It activates a special reasoning mode"],
      a: 1,
      e: "Chain-of-thought prompting — telling AI to reason step by step — has been shown to significantly improve accuracy on math, logic, and multi-step reasoning tasks by externalizing the reasoning process.",
    },
    {
      q: "What is the risk of including too much irrelevant context in a prompt?",
      o: ["The AI will charge more for processing", "The AI may lose focus on the core task, over-weight irrelevant details, or produce a less targeted response", "The prompt will be blocked by the AI's safety filter", "Irrelevant context always improves responses"],
      a: 1,
      e: "While context is important, irrelevant details can dilute the AI's focus. Good prompt engineering is about providing the right context, not the most context — precision matters.",
    },
    {
      q: "A marketer wants consistent brand voice across 50 pieces of AI-generated content. What is the most efficient prompting strategy?",
      o: ["Write a new detailed prompt from scratch for every single piece", "Create a master 'system prompt' or prompt template with brand voice guidelines, and use it as a base for all pieces", "Ask the AI to remember the brand voice from session to session", "Hire a human to check each piece for brand voice"],
      a: 1,
      e: "A reusable prompt template with embedded brand voice guidelines (tone, vocabulary, forbidden words, target audience) ensures consistency at scale — this is the foundation of a professional prompt library.",
    },
    {
      q: "What is the concept of 'prompt injection' in AI security?",
      o: ["Adding more context to improve a prompt", "A malicious technique where an attacker embeds hidden instructions in content that an AI processes, causing it to behave unexpectedly", "A fast method for inputting long prompts", "Automatically generating prompts using software"],
      a: 1,
      e: "Prompt injection is an emerging AI security threat — attackers hide instructions in content an AI agent reads (like a webpage or email) to hijack the AI's actions, similar to SQL injection in traditional software.",
    },
  ],

  4: [
    // --- EASY (10) ---
    {
      q: "What is 'chain-of-thought' prompting?",
      o: ["Writing a very long single prompt", "Asking the AI to show its reasoning step by step before giving a final answer", "Connecting multiple AI tools together", "Using the same prompt repeatedly"],
      a: 1,
      e: "Chain-of-thought prompting instructs the AI to walk through its reasoning process step by step, which significantly improves accuracy on complex logic, math, and multi-step tasks.",
    },
    {
      q: "What is 'few-shot prompting'?",
      o: ["Using an AI tool for just a few minutes", "Providing a few examples of the desired input-output pattern before your actual request", "Taking a few screenshots of AI responses", "Prompting with fewer than 10 words"],
      a: 1,
      e: "Few-shot prompting gives the AI 2–5 examples of what you want before your real question, teaching it the pattern to follow without any formal retraining.",
    },
    {
      q: "What is a 'system prompt'?",
      o: ["A prompt written by the AI company", "A background instruction that sets the AI's behavior, persona, and rules for an entire conversation", "A prompt to restart the AI system", "A technical error message from the AI"],
      a: 1,
      e: "A system prompt is a behind-the-scenes instruction (often hidden from end users) that defines how the AI should behave, what role it plays, and what it should or shouldn't do throughout the session.",
    },
    {
      q: "What is 'iterative refinement' in prompt engineering?",
      o: ["Writing the perfect prompt on the first try", "Repeatedly improving your prompt based on the AI's output until you get what you need", "Asking 10 different AI tools the same question", "Iterating through a list of AI tools"],
      a: 1,
      e: "Iterative refinement is a core skill: you start with a basic prompt, evaluate the output, identify what's missing or wrong, refine the prompt, and repeat until the result is excellent.",
    },
    {
      q: "What is 'zero-shot prompting'?",
      o: ["A prompt that gets zero useful responses", "Asking the AI to perform a task without providing any examples", "Using the AI for the first time", "A prompt with no formatting"],
      a: 1,
      e: "Zero-shot prompting means you give the AI a task instruction without any examples — you trust the AI's training to understand what you want from description alone.",
    },
    {
      q: "What is a 'persona' in advanced prompting?",
      o: ["Your personal profile on an AI platform", "A detailed character or role you assign to the AI to shape its voice, expertise, and style", "The AI's avatar image", "A privacy setting"],
      a: 1,
      e: "Assigning a detailed persona (e.g., 'You are Priya, a friendly financial advisor with 15 years of experience in Indian markets') shapes not just what the AI knows but how it communicates.",
    },
    {
      q: "What is a 'prompt library'?",
      o: ["A book about AI prompting", "A curated collection of tested, effective prompts you can reuse for recurring tasks", "The AI's internal database of prompts", "A subscription service for AI prompts"],
      a: 1,
      e: "A personal prompt library is a powerful productivity tool — a set of proven, refined prompts for your most common tasks that you can quickly copy, adapt, and use.",
    },
    {
      q: "Which technique involves showing the AI an example before asking it to do the task?",
      o: ["Chain-of-thought", "Zero-shot prompting", "Few-shot prompting", "Negative prompting"],
      a: 2,
      e: "Few-shot prompting uses examples to demonstrate the desired input-output relationship, helping the AI understand the pattern, format, and style you want before tackling your actual task.",
    },
    {
      q: "What does 'temperature' refer to in AI model settings?",
      o: ["The physical heat generated by the AI server", "A setting that controls how creative or random the AI's responses are", "The speed of the AI's response", "The length of the AI's response"],
      a: 1,
      e: "Temperature is a model parameter — low temperature (close to 0) makes responses more predictable and factual; high temperature (close to 1) makes responses more creative and varied.",
    },
    {
      q: "Why is iterative prompting better than trying to write the perfect prompt immediately?",
      o: ["It isn't — a perfect first prompt is always better", "Complex tasks are easier to refine through dialogue than to specify perfectly upfront; iteration allows you to react to what the AI produces", "AI only remembers the last prompt", "Iterative prompting is free while first-try prompting costs more"],
      a: 1,
      e: "Writing the perfect prompt on the first try for complex tasks is nearly impossible. Iteration — like a conversation — lets you guide the AI progressively toward exactly what you need.",
    },
    // --- MEDIUM (10) ---
    {
      q: "You want AI to write marketing copy. You provide three examples of copy you like. This is an example of:",
      o: ["Zero-shot prompting", "Chain-of-thought prompting", "Few-shot prompting", "Negative prompting"],
      a: 2,
      e: "By showing the AI examples of what you like before your request, you are using few-shot prompting — the examples demonstrate tone, length, and style more effectively than description alone.",
    },
    {
      q: "What is the main benefit of using a system prompt when building an AI-powered tool or chatbot?",
      o: ["It makes the AI free to use", "It establishes persistent instructions, persona, and guardrails that apply to every user interaction without the user needing to repeat them", "It allows the AI to access user files automatically", "It doubles the AI's processing speed"],
      a: 1,
      e: "System prompts are the foundation of consistent AI applications — they define behavior, boundaries, and persona once, ensuring every user interaction follows the same rules and style.",
    },
    {
      q: "A HR professional in Mohali wants AI to generate consistent job descriptions. What advanced prompting approach is most efficient?",
      o: ["Write a fresh detailed prompt for every job description", "Create a reusable prompt template with placeholders: '[Job Title] at [Company], [Key Responsibilities], [Required Skills]' and fill it in for each role", "Use chain-of-thought for every description", "Ask the AI to remember previous descriptions"],
      a: 1,
      e: "Prompt templates with placeholders are the professional way to scale consistent AI output — you build the structure once and vary only the specific details for each use case.",
    },
    {
      q: "What is the purpose of adding 'Let's think step by step' to a math problem prompt?",
      o: ["It makes the AI solve the problem faster", "It triggers chain-of-thought reasoning, causing the AI to break down the problem into logical steps, reducing calculation errors", "It forces the AI to show its training data", "It enables the AI to access a calculator"],
      a: 1,
      e: "Research shows that chain-of-thought prompting (asking AI to reason step by step) dramatically improves accuracy on multi-step reasoning and math tasks by preventing the AI from jumping to conclusions.",
    },
    {
      q: "What does 'combining techniques' mean in advanced prompting?",
      o: ["Using two different AI tools simultaneously", "Applying multiple prompting strategies in one prompt — e.g., few-shot examples + chain-of-thought + specific format instructions", "Merging two prompts into one shorter one", "Combining text prompts with image prompts"],
      a: 1,
      e: "The most powerful prompts often combine multiple techniques — for example, providing examples (few-shot), asking for step-by-step reasoning (chain-of-thought), and specifying exact output format (format instructions).",
    },
    {
      q: "You get a good first draft from AI but need it in a more formal tone. What is the best next step?",
      o: ["Start over with a completely new prompt", "Copy the output and send it as-is", "Say: 'Rewrite the above in a formal professional tone suitable for a board presentation' — iterative refinement", "Use a different AI tool"],
      a: 2,
      e: "Iterative refinement lets you build on existing good output — rather than starting over, you instruct the AI to adjust specific aspects (tone, length, format) of what it already produced.",
    },
    {
      q: "Why is providing a 'negative example' sometimes more effective than a positive description?",
      o: ["AI prefers negative examples to positive ones", "Showing what you don't want can be more precise than describing what you do want, especially for subtle style preferences", "Negative examples are processed faster", "Negative examples prevent hallucinations"],
      a: 1,
      e: "Sometimes it's easier to recognize what's wrong than to describe perfection. Showing a bad example and saying 'don't do this' gives the AI a clear boundary that can be more effective than a positive description.",
    },
    {
      q: "A social media manager wants to create a prompt system for daily posts. What should they include in their base system prompt?",
      o: ["Their personal password", "Brand voice guidelines, tone, target audience, forbidden words, post length, and key brand messages", "Their social media follower count", "The AI model version they prefer"],
      a: 1,
      e: "A well-designed system prompt for content creation encodes everything that should remain consistent: brand identity, tone, audience, constraints — freeing you to only specify unique details for each post.",
    },
    {
      q: "What is the difference between one-shot and few-shot prompting?",
      o: ["There is no difference", "One-shot provides exactly one example; few-shot provides 2–8 examples to better establish the pattern", "One-shot uses images; few-shot uses text", "Few-shot is only for code generation"],
      a: 1,
      e: "One-shot gives a single example to demonstrate the desired pattern; few-shot gives multiple examples — more examples generally help the AI learn the pattern more reliably, especially for complex or unusual formats.",
    },
    {
      q: "What type of prompt would work best for getting AI to write a creative short story?",
      o: ["A very strict, detailed, highly constrained prompt", "A prompt with character descriptions, setting, tone, and a starting situation — but leaving the plot open for creative freedom", "A one-word prompt like 'Story'", "A prompt that says 'be as creative as possible'"],
      a: 1,
      e: "The best creative prompts give the AI a framework (characters, setting, tone) while leaving space for creative expression — too much constraint kills creativity; too little gives nothing to work with.",
    },
    // --- HARD (5) ---
    {
      q: "What is 'self-consistency prompting' and what problem does it solve?",
      o: ["Making the AI always agree with you", "Running the same complex reasoning prompt multiple times and selecting the answer that appears most often — reduces errors from one-off reasoning failures", "Prompting the AI to check its own grammar", "Keeping prompts consistent in a library"],
      a: 1,
      e: "Self-consistency is an advanced technique for reasoning tasks — you generate multiple reasoning paths for the same problem and take the majority answer, significantly improving reliability over a single attempt.",
    },
    {
      q: "What is a 'meta-prompt' or 'prompt generator prompt'?",
      o: ["A prompt about a topic you haven't studied", "A prompt that instructs the AI to generate an optimized prompt for a specific task you describe", "The AI's internal prompt template", "A prompt that describes the AI's training process"],
      a: 1,
      e: "A meta-prompt asks the AI to create or optimize a prompt for you — for example: 'Write me a detailed prompt I can use to get AI to create a business plan for a food startup in Amritsar.' This bootstraps your prompt quality.",
    },
    {
      q: "In few-shot prompting, what is most critical about the examples you choose?",
      o: ["Examples should be as long as possible", "Examples should accurately represent the quality, format, and style you want — poor examples teach the AI the wrong pattern", "Examples must be from the same industry", "Examples should be randomly selected"],
      a: 1,
      e: "The quality of your examples directly determines output quality — if your examples are inconsistent or mediocre, the AI will learn and replicate those flaws. High-quality, representative examples are essential.",
    },
    {
      q: "Why does over-constraining a prompt sometimes produce worse results?",
      o: ["AI tools have a constraint penalty fee", "Excessive constraints can conflict with each other, narrow the solution space too much, or prevent the AI from finding the best approach within its capabilities", "More constraints always improve results", "Over-constrained prompts crash the AI"],
      a: 1,
      e: "Constraints help focus AI output, but too many competing constraints force trade-offs that degrade quality. The art of prompting is providing exactly the right constraints — necessary guardrails without unnecessarily limiting the AI's strengths.",
    },
    {
      q: "What is 'constitutional AI' prompting and how does it relate to advanced prompting?",
      o: ["Prompting AI about legal constitutions", "A technique where you give the AI a set of principles it must follow, then have it critique and revise its own outputs against those principles", "Prompting AI only for government use cases", "A method of encrypting prompts for security"],
      a: 1,
      e: "Constitutional AI prompting gives the model explicit principles (a 'constitution'), then has it evaluate its outputs against those principles and self-correct — this technique is used by Anthropic to train Claude for safe and helpful behavior.",
    },
  ],

  5: [
    // --- EASY (10) ---
    {
      q: "What is ChatGPT's DALL-E feature used for?",
      o: ["Writing long-form documents", "Generating images from text descriptions", "Translating text into different languages", "Creating spreadsheets automatically"],
      a: 1,
      e: "DALL-E is OpenAI's image generation model integrated into ChatGPT Plus — you describe an image in text and it generates it, useful for illustrations, marketing visuals, and creative projects.",
    },
    {
      q: "What are 'Custom GPTs' in ChatGPT?",
      o: ["Different versions of ChatGPT that cost more", "User-created AI assistants built on ChatGPT with custom instructions, knowledge, and capabilities", "GPT models trained by governments", "Premium features only for enterprise users"],
      a: 1,
      e: "Custom GPTs let you build specialized AI assistants — for example, a GPT trained on your company's documents, with specific instructions, tools, and persona — without writing any code.",
    },
    {
      q: "What is Claude's 'Projects' feature primarily used for?",
      o: ["Managing AI artwork projects", "Organizing long-running work with persistent context, documents, and instructions across multiple conversations", "Creating custom AI models", "Billing and subscription management"],
      a: 1,
      e: "Claude Projects allow you to maintain ongoing context — upload documents, set custom instructions, and have the AI remember your project details across multiple conversations without re-explaining each time.",
    },
    {
      q: "Which AI tool is best known for its extra-long context window, making it ideal for analyzing very large documents?",
      o: ["ChatGPT-3.5", "Claude (by Anthropic)", "Gemini Nano", "Bing AI"],
      a: 1,
      e: "Claude has a very large context window (up to 200,000 tokens), meaning you can upload and analyze entire books, lengthy legal contracts, or large codebases in a single conversation.",
    },
    {
      q: "What does ChatGPT's memory feature do?",
      o: ["It remembers information across different conversations so you don't have to repeat context every time", "It stores images you generate", "It remembers your typing speed", "It memorizes other people's ChatGPT conversations"],
      a: 0,
      e: "ChatGPT memory allows the AI to retain key information about you (preferences, work context, ongoing projects) across sessions — making interactions feel more personalized over time.",
    },
    {
      q: "What are Claude's 'Artifacts'?",
      o: ["Errors generated by Claude", "Standalone pieces of content (code, documents, visuals) Claude creates in a separate side panel that can be edited and copied", "Old versions of Claude", "Claude's image generation feature"],
      a: 1,
      e: "Artifacts is Claude's feature for producing self-contained deliverables — like a complete webpage, a Python script, or a formatted report — displayed in a separate panel for easy review and use.",
    },
    {
      q: "Which AI model is most deeply integrated with Google Workspace (Gmail, Docs, Sheets)?",
      o: ["ChatGPT", "Claude", "Gemini", "Copilot"],
      a: 2,
      e: "Google Gemini is natively integrated into Google's productivity suite — you can use it directly inside Gmail to draft emails, in Google Docs to write content, and in Sheets to analyze data.",
    },
    {
      q: "For a freelance writer who uploads lengthy research PDFs and wants to chat about the content, which tool is most suitable?",
      o: ["DALL-E", "Claude with file upload", "Gemini Nano", "Canva AI"],
      a: 1,
      e: "Claude excels at document analysis with its large context window and file upload capability — a freelancer can upload a full research report and ask detailed questions about specific sections.",
    },
    {
      q: "What is 'tool stacking' in the context of AI tools?",
      o: ["Physically stacking multiple devices running AI", "Using multiple AI tools together in a workflow, each doing what it does best", "Upgrading to premium plans on multiple tools", "Storing prompts in stacks for later use"],
      a: 1,
      e: "Tool stacking means combining specialized AI tools in a workflow — for example, using ChatGPT to draft content, Claude to refine and analyze it, and Canva AI to design the visuals.",
    },
    {
      q: "What type of tasks is ChatGPT with browsing most useful for?",
      o: ["Generating images from the 1990s", "Getting up-to-date information from the web that might be beyond the AI's training data cutoff", "Accessing private company databases", "Making phone calls"],
      a: 1,
      e: "ChatGPT's web browsing feature allows it to search the internet and retrieve current information — essential for research on recent events, current prices, or the latest news.",
    },
    // --- MEDIUM (10) ---
    {
      q: "What is the main advantage of using Claude for reviewing long legal or financial documents compared to ChatGPT-3.5?",
      o: ["Claude is free while ChatGPT is paid", "Claude's larger context window lets it process the entire document at once, maintaining coherence throughout", "Claude can sign documents digitally", "Claude has better internet access"],
      a: 1,
      e: "Claude's 200K token context window means you can paste or upload an entire lengthy contract or annual report and ask nuanced questions — ChatGPT's shorter context would require breaking it into chunks.",
    },
    {
      q: "A startup founder wants to create a specialized AI assistant for customer support trained on their product FAQs. Which ChatGPT feature should they use?",
      o: ["DALL-E image generation", "ChatGPT Memory", "Custom GPTs with uploaded knowledge base", "ChatGPT browsing"],
      a: 2,
      e: "Custom GPTs allow you to upload documents (like FAQs, product guides), set custom instructions, and create a specialized assistant — no coding required — that focuses only on your content.",
    },
    {
      q: "What is the key difference between ChatGPT Plus and Claude Pro in terms of available features?",
      o: ["ChatGPT Plus is always cheaper", "ChatGPT Plus offers DALL-E image generation and GPT Store access; Claude Pro offers Projects with persistent memory and superior document analysis", "They are identical products", "Claude Pro includes video generation"],
      a: 1,
      e: "The key differentiation is ChatGPT's strength in multimedia (image gen, custom GPTs) vs Claude's strength in deep document analysis, long-form writing quality, and persistent project context.",
    },
    {
      q: "For a content team that produces 50 social media posts per week with a consistent brand voice, which feature would be most valuable?",
      o: ["DALL-E image generation", "Claude Projects with a saved brand voice system prompt and style guide", "ChatGPT browsing for trending topics", "Gemini's Gmail integration"],
      a: 1,
      e: "Claude Projects with pre-loaded brand guidelines means every new conversation inherits the full context — the team doesn't need to repeat instructions, ensuring consistent output at scale.",
    },
    {
      q: "When would you choose ChatGPT's browsing feature over Claude's document analysis?",
      o: ["When you have a 500-page PDF to analyze", "When you need current information from the web, like today's news, current stock prices, or recent research", "When you want to generate an image", "When you need to write code"],
      a: 1,
      e: "Claude analyzes documents you provide; ChatGPT browsing retrieves live web information. If you need current data (news, prices, recent publications), ChatGPT's browsing is the right tool.",
    },
    {
      q: "What makes Claude particularly well-suited for tasks requiring nuanced ethical reasoning or careful analysis?",
      o: ["It has the fastest processing speed", "Anthropic's Constitutional AI training approach focuses on making Claude helpful, harmless, and honest — leading to more careful, balanced responses", "It can access more databases", "It was trained on more data than any other model"],
      a: 1,
      e: "Anthropic designed Claude with Constitutional AI principles, making it particularly thoughtful about nuance, ethical implications, and acknowledging uncertainty — making it well-suited for complex, sensitive analysis.",
    },
    {
      q: "A researcher uploads three academic papers to Claude and asks it to synthesize the key findings. What Claude feature makes this possible?",
      o: ["DALL-E integration", "Claude's file upload feature combined with its large context window", "Claude's browsing capability", "Claude's code interpreter"],
      a: 1,
      e: "Claude's file upload + large context window is the key — you can upload multiple large documents and ask it to synthesize across all of them in a single conversation, which most other tools can't match.",
    },
    {
      q: "What is the 'GPT Store' and why is it useful?",
      o: ["A physical store selling AI hardware", "A marketplace of custom GPTs built by OpenAI and the community — you can find pre-built AI tools for specific tasks", "A store selling ChatGPT subscriptions at a discount", "A database of AI training data"],
      a: 1,
      e: "The GPT Store hosts thousands of custom GPTs built for specific use cases — from coding assistants to cooking advisors — allowing you to find specialized AI tools without building them yourself.",
    },
    {
      q: "For a law firm in Chandigarh wanting to analyze 200-page contracts quickly, which AI tool offers the most practical workflow?",
      o: ["DALL-E for visualization", "Gemini in Gmail for email drafting", "Claude with file upload — paste or upload the full contract and ask specific questions about clauses, risks, and terms", "ChatGPT-3.5 free version"],
      a: 2,
      e: "Claude's combination of large context window, document upload, and careful analytical responses makes it the leading choice for legal document analysis among current AI tools.",
    },
    {
      q: "What is 'tool stacking' and give an example of a good AI tool stack for content marketing?",
      o: ["Using one AI tool very intensively", "Using multiple specialized AI tools together — e.g., Perplexity for research, Claude for writing, Canva AI for design, and Buffer for scheduling", "Stacking multiple ChatGPT subscriptions", "Using tools on multiple devices simultaneously"],
      a: 1,
      e: "A smart AI tool stack uses each tool for its specialty: Perplexity (research), Claude (long-form writing), ChatGPT (quick iterations), Canva AI (visuals) — together they create a complete content production pipeline.",
    },
    // --- HARD (5) ---
    {
      q: "What is the significance of a model's 'context window' for professional users?",
      o: ["It determines the interface design of the AI tool", "It defines the maximum amount of text the AI can process in a single interaction — a larger window enables analysis of longer documents without loss of coherence", "It controls how many users can access the AI simultaneously", "It determines how long the AI takes to respond"],
      a: 1,
      e: "Context window is a critical technical limitation — once input exceeds it, the model 'forgets' earlier content. For professionals analyzing lengthy contracts, reports, or codebases, a 200K token context window is a significant practical advantage.",
    },
    {
      q: "What is the risk of relying on ChatGPT's browsing feature for critical research without verification?",
      o: ["The feature is too slow to be useful", "Web results can be from unreliable sources, and the AI may misinterpret or selectively summarize web content — verification remains essential", "The feature automatically selects only peer-reviewed sources", "Browsing costs significant additional money per search"],
      a: 1,
      e: "ChatGPT's browsing retrieves and summarizes web content, but websites can be biased, outdated, or wrong. The AI adds another layer of potential misinterpretation. Always verify critical facts from primary sources.",
    },
    {
      q: "How does 'multi-modal' AI capability change professional workflows compared to text-only AI?",
      o: ["It makes text processing slower", "Professionals can input images, charts, screenshots, and documents directly — getting analysis without manual transcription or description, dramatically expanding use cases", "Multi-modal AI only works for creative professionals", "It replaces the need for human analysis entirely"],
      a: 1,
      e: "Multi-modal input (images, PDFs, audio) means professionals can feed AI real-world content in its natural format — a doctor can upload an X-ray, an accountant a scanned invoice, an engineer a diagram — removing the transcription bottleneck.",
    },
    {
      q: "What are the privacy implications of using Claude Projects with company-sensitive documents?",
      o: ["There are no privacy implications — all data is automatically encrypted and private", "Documents uploaded to Claude Projects are stored on Anthropic's servers and may be used per their data policy — sensitive company data requires reviewing terms before uploading", "Projects only work with public documents", "Claude immediately deletes all uploaded documents"],
      a: 1,
      e: "Before uploading sensitive client data, proprietary IP, or personal information to any AI tool including Claude, organizations must review the provider's data retention and usage policies — and ideally use enterprise versions with stronger data protection.",
    },
    {
      q: "What is the strategic difference between using ChatGPT for quick creative tasks vs Claude for deep analytical work?",
      o: ["There is no practical difference — both do everything equally well", "ChatGPT often excels at quick creative generation and has the GPT ecosystem; Claude tends to produce more careful, nuanced analysis and handles longer, complex documents more coherently", "ChatGPT is only for writing; Claude is only for code", "Claude is always faster than ChatGPT"],
      a: 1,
      e: "Savvy professionals use tools strategically: ChatGPT for rapid creative iteration, image generation, and plugin-based tasks; Claude for careful analysis, long-form documents, and situations requiring nuanced judgment. Neither is universally superior.",
    },
  ],

  6: [
    // --- EASY (10) ---
    {
      q: "What is the most important element of an AI-generated business email?",
      o: ["Fancy vocabulary", "Accuracy, clarity, and a professional tone that you review before sending", "Length — longer emails are always better", "Using as many AI-generated sentences as possible"],
      a: 1,
      e: "An AI-drafted email is only a starting point — you must review it for accuracy, adjust the tone for your relationship with the recipient, and personalize it before sending.",
    },
    {
      q: "What does 'cold outreach' mean in a professional context?",
      o: ["Sending messages in cold weather", "Contacting a person you have no prior relationship with to pitch a product, service, or opportunity", "An email written without AI help", "Reaching out to former colleagues"],
      a: 1,
      e: "Cold outreach is unsolicited first contact — like a sales email or a LinkedIn message to a potential client or employer you've never interacted with before.",
    },
    {
      q: "What is the main benefit of using AI to help write your resume?",
      o: ["AI will write a completely unique resume with no effort from you", "AI can help you phrase achievements with stronger action verbs and keywords relevant to the job description", "AI will guarantee you a job interview", "AI creates resume designs automatically"],
      a: 1,
      e: "AI excels at transforming vague job descriptions into powerful, keyword-optimized bullet points — for example, turning 'did sales' into 'Grew B2B sales revenue by 34% in 12 months through strategic prospecting.'",
    },
    {
      q: "What is LinkedIn optimization in the context of AI writing?",
      o: ["Paying LinkedIn to boost your profile", "Using AI to improve your LinkedIn headline, summary, and experience sections with compelling, keyword-rich language", "Connecting with as many people as possible", "Using AI to automatically post daily content"],
      a: 1,
      e: "AI can help craft a compelling LinkedIn headline, a narrative-driven About section, and achievement-focused experience descriptions — all of which improve how you appear in recruiter searches.",
    },
    {
      q: "Which tone is most appropriate for a formal business proposal?",
      o: ["Casual and filled with slang", "Professional, confident, and clear — focused on client benefits and specific deliverables", "Extremely formal with complex legal language throughout", "Conversational like a WhatsApp message"],
      a: 1,
      e: "A business proposal should be professional and confident — written for the decision-maker, focused on their problem and your solution, with clear deliverables, timelines, and pricing.",
    },
    {
      q: "What does 'proofreading' mean in the context of AI-assisted writing?",
      o: ["Asking AI to write the entire document again", "Checking the AI's output for factual errors, grammar issues, inappropriate tone, and missing information before using it", "Printing the document to check for spelling", "Having a colleague write the document instead"],
      a: 1,
      e: "After AI drafts a document, proofreading means critically reviewing it for factual accuracy, tone appropriateness, grammatical errors, and whether it truly meets your communication goal.",
    },
    {
      q: "What is 'tone adjustment' in AI writing tools?",
      o: ["Changing the font size of a document", "Instructing AI to rewrite content in a different register — e.g., from casual to formal, or from technical to simple", "Adding emojis to messages", "Changing the language of the document"],
      a: 1,
      e: "Tone adjustment means instructing AI to rewrite the same content at a different register — converting a casual draft to formal business language, or simplifying technical jargon for a general audience.",
    },
    {
      q: "A startup in Ludhiana wants to email 500 potential B2B clients. What should they use AI for?",
      o: ["Sending the emails automatically without review", "Drafting a strong template email with a compelling subject line and clear value proposition, then personalizing key details for each recipient", "Writing 500 completely unique emails from scratch", "Only using AI to check grammar after writing it themselves"],
      a: 1,
      e: "The best use of AI in cold outreach is creating a high-quality base template with a compelling hook, then personalizing critical details (company name, specific problem) for each recipient for better response rates.",
    },
    {
      q: "What is the main ethical concern about using AI-generated content professionally?",
      o: ["AI content is always copyrighted by the AI company", "Presenting AI-generated content as entirely your own without appropriate review or disclosure can be misleading — you must own the final output", "Using AI for any work is unethical", "AI content is always plagiarized"],
      a: 1,
      e: "The ethical standard for AI writing is: you are responsible for everything that goes out under your name. AI assists the process, but you must understand, verify, and own the final content.",
    },
    {
      q: "What makes an AI-generated report more credible?",
      o: ["Making it as long as possible", "Adding verified data, specific examples, citations, and your own expert analysis alongside the AI draft", "Using the most impressive vocabulary the AI can generate", "Never editing the AI's output"],
      a: 1,
      e: "AI reports gain credibility when you inject real data, specific examples from your context, and your own professional analysis — pure AI output is often generic; your expertise is what makes it authoritative.",
    },
    // --- MEDIUM (10) ---
    {
      q: "What is the best way to use AI to write a cold LinkedIn message to a potential employer?",
      o: [
        "Ask AI to write a generic 'I'm looking for a job' message",
        "Provide AI with: your background, the specific role and company, one specific thing you admire about their work, and ask for a clear, brief call to action — review and personalize before sending",
        "Copy a template from the internet and use it unchanged",
        "Write a 500-word message explaining your entire career history"
      ],
      a: 1,
      e: "Effective cold LinkedIn messages are specific, brief, and personalized. Use AI to draft a tight structure — your credibility hook, genuine specific compliment, clear value you bring, and a low-commitment ask like a 15-minute call.",
    },
    {
      q: "Which of these resume bullet points would AI most likely help improve?",
      o: [
        "'Responsible for sales activities in the northern region'",
        "'Achieved 42% sales growth in Punjab and Haryana by implementing territory-specific distribution strategy in FY2024'",
        "'Good at sales'",
        "'Sales person at company'"
      ],
      a: 0,
      e: "AI excels at transforming vague, passive descriptions like 'responsible for' into achievement-oriented bullets with specific metrics, geography, and impact — dramatically improving resume impact.",
    },
    {
      q: "What prompt would best get AI to rewrite a casual email in a formal business style?",
      o: [
        "'Make this better'",
        "'Rewrite the following email in formal business English suitable for communication with a senior corporate client. Maintain all key information but elevate the tone and ensure professional structure: [paste email]'",
        "'Change this email'",
        "'Be more professional'"
      ],
      a: 1,
      e: "The best prompt gives AI explicit context: target register (formal business), target audience (senior corporate client), what to preserve (key information), and what to change (tone and structure) — then provides the content.",
    },
    {
      q: "What should a business proposal always include, regardless of how it's written?",
      o: ["A biography of the founder", "Understanding of client's problem, your proposed solution, timeline, pricing, and expected outcomes", "At least 20 pages of content", "References to other clients' private information"],
      a: 1,
      e: "A compelling business proposal follows a problem-solution structure: articulate the client's pain point, present your solution, show your approach and timeline, state pricing clearly, and quantify the expected benefit to the client.",
    },
    {
      q: "How can AI help with LinkedIn profile optimization beyond just writing?",
      o: ["AI can automatically connect with relevant people", "AI can analyze job descriptions in your target field and suggest keywords to include in your profile to improve recruiter search visibility", "AI can upgrade your LinkedIn subscription", "AI can verify your profile credentials"],
      a: 1,
      e: "One of the most powerful LinkedIn optimization strategies is mining job descriptions for the exact keywords recruiters search — AI can quickly extract and suggest these keywords to embed throughout your profile.",
    },
    {
      q: "A content writer is using AI to draft all client articles and submitting them without review. What is the main professional risk?",
      o: ["The client might prefer AI writing", "Factual errors, hallucinations, or inappropriate content may go undetected, damaging the writer's professional reputation and client relationship", "AI writing is always higher quality than human writing", "There are no professional risks"],
      a: 1,
      e: "AI hallucinations are real — a published article with incorrect facts, outdated statistics, or embarrassing errors (that AI invented) reflects directly on the writer, not the AI tool they used.",
    },
    {
      q: "What is an 'email sequence' and how does AI help create one?",
      o: ["A series of emails sent in a specific order for a campaign or follow-up journey — AI helps draft multiple connected messages with consistent tone and escalating engagement", "A single long email broken into sections", "A list of email addresses", "An email folder organization system"],
      a: 0,
      e: "An email sequence (like a 5-part sales follow-up or welcome series) requires consistent voice and progressive messaging — AI can draft all messages in one session, maintaining coherence and escalating from introduction to conversion.",
    },
    {
      q: "What is the most effective use of AI for executive report writing?",
      o: ["Let AI write the entire report without your input", "Use AI to structure the report, draft sections, and format data — while you provide real data, analysis, and review accuracy before finalizing", "AI cannot write executive reports", "Use AI only to check spelling"],
      a: 1,
      e: "The optimal workflow is human-AI collaboration: you provide real data, insights, and context; AI provides structure, language polish, and formatting — the final output combines AI efficiency with human expertise and accuracy.",
    },
    {
      q: "Why is it important to 'personalize' AI-drafted outreach emails before sending?",
      o: ["Personalization is unnecessary — generic messages work fine", "Recipients can often detect generic AI messages; personalized details (specific company name, recent achievement, mutual connection) dramatically improve response rates", "AI already personalizes emails automatically", "Personalization only matters for personal emails, not business ones"],
      a: 1,
      e: "Studies show personalized outreach emails have 2-5x higher response rates than generic ones. AI can draft the structure efficiently; you add the specific details that show genuine research and interest.",
    },
    {
      q: "What does 'AI writing ethics' require when submitting AI-assisted work?",
      o: ["Never disclosing that AI was used, regardless of context", "Context-appropriate transparency — academic work may require full disclosure; professional work may simply require you to own and verify the final output", "Always adding a disclaimer that AI wrote everything", "Avoiding AI tools entirely for professional work"],
      a: 1,
      e: "AI writing ethics vary by context: academic institutions may require full disclosure; clients may have AI use policies; professional contexts generally require you to take full responsibility for accuracy and quality of submitted work.",
    },
    // --- HARD (5) ---
    {
      q: "What is 'ATS optimization' and how does AI help with it?",
      o: ["An advanced training system for AI models", "Applicant Tracking System optimization — using the right keywords from job descriptions so your resume is not filtered out before a human reads it, which AI can systematically identify", "A type of AI tool for HR departments", "An automated testing system for software"],
      a: 1,
      e: "Most large companies use ATS software that filters resumes by keyword match before any human reads them. AI can analyze a job description and identify the exact keywords, phrases, and skills to include in your resume to pass this filter.",
    },
    {
      q: "What is the 'AIDA framework' and how can AI help you apply it to marketing emails?",
      o: ["An AI development framework", "Attention, Interest, Desire, Action — a classic copywriting structure; AI can generate compelling hooks (Attention), engaging benefit statements (Interest), emotional appeals (Desire), and clear CTAs (Action)", "A data analysis methodology", "An email security protocol"],
      a: 1,
      e: "AIDA is a proven copywriting formula. AI can quickly draft each element — a provocative subject line (Attention), relevant statistics or stories (Interest), vivid outcome descriptions (Desire), and a clear, urgent CTA (Action) — at scale.",
    },
    {
      q: "Why is it risky to use AI to generate references or testimonials in a job application?",
      o: ["AI references are always too long", "Fabricating references or testimonials — even with AI — is fraud. Employers verify references, and fake ones can result in job offer withdrawal or termination", "AI cannot write in different names", "References are no longer used in hiring"],
      a: 1,
      e: "Using AI to create fake references or testimonials constitutes fraud. If discovered (and employers do check), consequences range from immediate rejection to professional blacklisting, and potentially legal action.",
    },
    {
      q: "What is 'voice calibration' in professional AI writing, and why does it matter?",
      o: ["Adjusting the AI's text-to-speech settings", "Training AI (through examples and feedback) to match your personal communication style so output requires minimal editing — critical for maintaining authentic professional identity at scale", "Changing the language the AI writes in", "Setting the AI's response speed"],
      a: 1,
      e: "Voice calibration means building prompts (with examples of your own writing) that teach AI your specific style — your vocabulary, sentence length preferences, and tone. This produces output that sounds like you, not generic AI.",
    },
    {
      q: "How does AI's limitation in understanding 'subtext' and 'cultural nuance' affect professional email writing in an Indian business context?",
      o: ["AI understands all cultural nuances perfectly", "AI may generate technically correct but culturally tone-deaf content — for example, not recognizing when directness might be perceived as disrespectful in a senior-junior business relationship, requiring human adjustment", "Cultural nuance is irrelevant in business emails", "AI overcorrects for cultural nuance too much"],
      a: 1,
      e: "Indian business communication often involves implicit hierarchical respect, relationship-building language before the ask, and festival greetings at appropriate times — AI may draft emails that are culturally blunt or miss these relationship-maintaining elements that a human would naturally include.",
    },
  ],

  7: [
    // --- EASY (10) ---
    {
      q: "What is Perplexity AI primarily designed for?",
      o: ["Image generation", "AI-powered research and search with cited sources", "Video editing", "Social media management"],
      a: 1,
      e: "Perplexity AI is an AI-powered research tool that retrieves information from the web and presents it with citations — making it much more reliable for research than chatbots that don't cite sources.",
    },
    {
      q: "What makes Perplexity AI different from a regular Google search?",
      o: ["Perplexity AI only searches Indian websites", "Perplexity synthesizes information from multiple sources into a direct, cited answer — instead of making you read through many links", "Perplexity is completely free with no paid version", "Perplexity uses older data than Google"],
      a: 1,
      e: "Google shows you a list of links; Perplexity reads those sources and synthesizes them into a direct, comprehensive answer with citations — saving significant research time.",
    },
    {
      q: "What is NotebookLM?",
      o: ["A note-taking app by Microsoft", "Google's AI tool for analyzing and interacting with your own uploaded documents", "A cloud storage service", "An AI tool for writing code"],
      a: 1,
      e: "NotebookLM (by Google) allows you to upload your own documents and then have an AI that's trained specifically on your materials — you can ask questions, get summaries, and generate insights from your own content.",
    },
    {
      q: "What is the 'Audio Overview' feature in NotebookLM?",
      o: ["A feature to transcribe audio files", "A feature that converts your uploaded documents into a podcast-style audio conversation between two AI hosts discussing the key ideas", "Background music while you read", "A voice assistant for note-taking"],
      a: 1,
      e: "NotebookLM's Audio Overview generates a remarkable podcast-style conversation between two AI voices discussing the main ideas in your documents — useful for learning content in a different format.",
    },
    {
      q: "Why is it important to verify information found through AI research tools?",
      o: ["AI research tools are always 100% accurate", "Even cited AI tools can misrepresent or selectively quote sources — always click through to verify primary sources for critical information", "Verification is only needed for medical information", "AI tools only use government-approved sources"],
      a: 1,
      e: "While citation-based AI tools like Perplexity are more reliable, they can still misquote, summarize inaccurately, or use low-quality sources. For important decisions, always verify by reading the original source.",
    },
    {
      q: "What is a 'Collection' in Perplexity AI?",
      o: ["A folder of saved images", "A saved set of related searches and threads organized by topic — useful for ongoing research projects", "A list of contacts", "A type of premium subscription"],
      a: 1,
      e: "Perplexity Collections let you organize research on a specific topic — saving related searches together so you can build on them over time rather than starting fresh each session.",
    },
    {
      q: "What is 'fact verification' in the context of AI research?",
      o: ["Asking the AI if something is true", "Cross-checking AI-generated claims against primary sources, official data, or peer-reviewed research before using them", "Verifying that you are logged into the AI tool correctly", "Checking if the AI's spelling is correct"],
      a: 1,
      e: "Fact verification means not taking AI responses at face value — actively checking key claims against original sources like government data, academic papers, or authoritative news organizations.",
    },
    {
      q: "A student researching Punjab's agricultural economy would best use which AI tool for finding current, cited information?",
      o: ["DALL-E", "NotebookLM", "Perplexity AI Pro Search", "Canva AI"],
      a: 2,
      e: "Perplexity AI Pro Search retrieves current web information with citations — ideal for a research paper where you need recent data and traceable sources about a current topic like agricultural economics.",
    },
    {
      q: "What is 'source evaluation' in research?",
      o: ["Rating how attractive a website looks", "Critically assessing the credibility, authority, accuracy, and recency of a source before using it in research", "Choosing which AI tool to use", "Evaluating the speed of a website"],
      a: 1,
      e: "Source evaluation (CRAAP test: Currency, Relevance, Authority, Accuracy, Purpose) ensures you base your work on credible, unbiased, accurate information — a critical skill in the AI age where sources proliferate rapidly.",
    },
    {
      q: "What is Perplexity Pro Search's main advantage over the standard Perplexity search?",
      o: ["It searches only academic databases", "It performs more in-depth, multi-step research with better source diversity and deeper analysis", "It generates images alongside search results", "It searches only in Hindi"],
      a: 1,
      e: "Perplexity Pro Search conducts more sophisticated multi-step research — it can follow up on its initial findings, go deeper into subtopics, and synthesize from a broader range of higher-quality sources.",
    },
    // --- MEDIUM (10) ---
    {
      q: "How would a journalist in Delhi use NotebookLM effectively for investigative research?",
      o: ["Upload all their articles to build a portfolio", "Upload primary documents, government reports, and interview transcripts — then use AI to identify patterns, cross-references, and gaps across hundreds of pages", "Generate audio versions of their articles", "Use it to write their articles automatically"],
      a: 1,
      e: "NotebookLM's power for journalism is in its ability to process large volumes of documents at once and help identify connections — patterns in financial records, contradictions across testimony, or themes across interview notes.",
    },
    {
      q: "What is the most reliable way to evaluate whether a Perplexity AI citation is trustworthy?",
      o: ["Count the number of citations — more is better", "Click through to the actual source, assess the publisher's authority, check the publication date, and read the original context of the quote", "Assume all citations are trustworthy since Perplexity found them", "Check the citation's formatting"],
      a: 1,
      e: "Quantity of citations doesn't equal quality. You must click through and evaluate: Is it a peer-reviewed journal? An official government site? A reputable news organization? Is the context accurately represented? Does it match the AI's summary?",
    },
    {
      q: "A researcher has 50 academic papers on climate change and wants to quickly understand the consensus. Which workflow is most efficient?",
      o: ["Read all 50 papers manually", "Upload all papers to NotebookLM and ask: 'What is the main consensus across these papers? What are the key disagreements?'", "Search Google for summaries of each paper", "Ask ChatGPT to write a summary without the papers"],
      a: 1,
      e: "NotebookLM's ability to process your specific uploaded documents and answer questions across all of them simultaneously makes it uniquely powerful for synthesizing large literature reviews that would take days to read manually.",
    },
    {
      q: "What is a 'research workflow' in the context of AI tools?",
      o: ["The speed at which AI processes research queries", "A systematic process using multiple AI tools for different stages — e.g., Perplexity for discovery, NotebookLM for deep analysis, Claude for synthesis writing", "Using only one AI tool for all research", "The number of sources AI can access"],
      a: 1,
      e: "A professional AI research workflow orchestrates different tools for their strengths: Perplexity finds and cites current web sources, NotebookLM deeply analyzes your collected documents, and Claude or ChatGPT helps synthesize findings into a coherent report.",
    },
    {
      q: "What unique advantage does NotebookLM offer over general chatbots for company-specific research?",
      o: ["It has access to more public data", "Its AI is grounded solely in the documents you upload — it won't hallucinate information from outside your materials, making it more reliable for analyzing your specific content", "It generates better images", "It works without internet connection"],
      a: 1,
      e: "Unlike general chatbots that blend your query with their vast training data, NotebookLM answers exclusively from your uploaded documents — making it highly reliable for internal reports, private research, and company-specific knowledge management.",
    },
    {
      q: "A law student needs to research a Supreme Court case. How would they use Perplexity and NotebookLM together?",
      o: ["Only use one tool at a time", "Use Perplexity to find and identify key case documents and commentary, then upload those documents to NotebookLM to deeply analyze specific arguments, precedents, and implications", "Use NotebookLM to search the internet for case details", "Use Perplexity to generate Audio Overviews"],
      a: 1,
      e: "This is an ideal two-tool workflow: Perplexity discovers and retrieves relevant case materials with citations, then NotebookLM lets you deep-dive into the uploaded documents with AI assistance — a powerful research combination.",
    },
    {
      q: "What is 'hallucination risk' specifically in AI research tools, and how do citations mitigate it?",
      o: ["Hallucination risk is reduced to zero when citations are present", "Citations don't eliminate hallucination — AI can still misquote or misrepresent sources — but they allow you to verify claims against the original, making errors detectable and correctable", "Citation-based tools cannot hallucinate", "Hallucination only occurs in image generation"],
      a: 1,
      e: "Even citation-based AI can misrepresent what a source actually says. Citations are valuable because they give you the means to verify — unlike uncited AI claims which are impossible to check. Always treat citations as a starting point, not proof.",
    },
    {
      q: "How does the 'Audio Overview' feature in NotebookLM help professionals with limited reading time?",
      o: ["It reads documents aloud in a monotone voice", "It generates an engaging podcast-style discussion of your documents — allowing you to absorb complex information during commutes or while multitasking", "It replaces the need to read documents entirely", "It creates audio advertisements for your research"],
      a: 1,
      e: "Audio Overview transforms dense document content into conversational audio — making it possible to absorb research summaries, catch key insights, and prepare for meetings while commuting or exercising.",
    },
    {
      q: "For a market research analyst in Chandigarh studying consumer trends, what would be an effective AI research workflow?",
      o: ["Just ask ChatGPT without any documents", "Use Perplexity to find current industry reports with citations, download relevant reports, upload them to NotebookLM for deep analysis, then use Claude to write the final research report", "Use DALL-E to visualize trends", "Search Twitter manually and summarize"],
      a: 1,
      e: "A professional market research workflow uses AI at every stage: Perplexity (current data with sources), NotebookLM (deep document analysis), Claude (polished report writing) — significantly reducing research time while maintaining rigor.",
    },
    {
      q: "What does Perplexity AI's 'focus mode' allow researchers to do?",
      o: ["Block distracting notifications while researching", "Search specifically within certain domains — like academic papers, YouTube, Reddit, or the general web — for more targeted results", "Focus the AI's attention on only one topic permanently", "Run searches offline"],
      a: 1,
      e: "Perplexity's focus modes let you restrict searches to specific source types — Academic (Semantic Scholar), YouTube, Reddit, or the general web — allowing targeted retrieval that matches your research needs.",
    },
    // --- HARD (5) ---
    {
      q: "What is the fundamental difference between 'retrieval-augmented generation' (RAG) and pure language model generation in research tools?",
      o: ["RAG is slower than pure generation", "RAG retrieves relevant documents at query time and conditions the model's response on those documents — reducing hallucination and enabling citation; pure generation relies only on baked-in training knowledge", "RAG only works with audio documents", "There is no practical difference for users"],
      a: 1,
      e: "RAG is the architecture behind tools like Perplexity and NotebookLM — it retrieves relevant sources first, then generates responses grounded in those sources. This dramatically reduces hallucination compared to models that rely purely on memorized training data.",
    },
    {
      q: "What is 'source triangulation' and why is it essential even when using AI research tools?",
      o: ["Using three AI tools simultaneously", "Confirming a fact through three independent, unrelated credible sources — because any single source, even an AI with citations, can be wrong or biased", "A feature in Perplexity Pro", "Triangulating GPS coordinates for field research"],
      a: 1,
      e: "Source triangulation is a foundational research principle: before treating information as established fact, confirm it through multiple independent, credible sources. AI tools surface sources faster, but the triangulation discipline remains essential.",
    },
    {
      q: "What are the privacy risks of uploading proprietary business documents to NotebookLM?",
      o: ["There are no privacy risks with Google products", "Google may retain uploaded data per its terms of service; proprietary business information, trade secrets, or client data uploaded could potentially be used for product improvement or exposed in a data breach", "Uploaded documents are instantly deleted after analysis", "Only documents over 100 pages pose privacy risks"],
      a: 1,
      e: "Before uploading sensitive business documents to any cloud AI tool, including NotebookLM, organizations must review the service's data retention and usage policies. Enterprise versions typically offer stronger privacy protections and data processing agreements.",
    },
    {
      q: "How would you critically evaluate whether an AI-generated research summary is truly comprehensive vs selectively presenting information?",
      o: ["Count the word length of the summary", "Cross-check the summary against the actual sources cited, verify what was emphasized vs omitted, and look for counterarguments or contradictory evidence that the AI may have excluded", "Trust the AI's completeness since it analyzed all sources", "Check how many citations are included"],
      a: 1,
      e: "AI summarizers can be selective, biased toward prominent perspectives, or miss nuance in sources. Evaluating comprehensiveness requires: checking if counterevidence was represented, verifying that cited passages match the summary's characterization, and deliberately searching for opposing views.",
    },
    {
      q: "What is 'information half-life' and how does it affect AI research tool selection?",
      o: ["How long an AI tool is available before being discontinued", "How quickly information in a domain becomes outdated — fast-changing fields (technology, markets, law) require tools with current web access like Perplexity; stable fields may be well-served by document analysis tools", "The time it takes AI to generate a response", "The expiry date of an AI subscription"],
      a: 1,
      e: "Different domains have different information half-lives: a news story is outdated in hours; medical guidelines update annually; historical facts rarely change. This should drive tool choice — Perplexity for fast-moving domains; archived document analysis for stable ones.",
    },
  ],

  8: [
    // --- EASY (10) ---
    {
      q: "What is Gamma AI primarily used for?",
      o: ["Video editing", "Converting text or prompts into professional presentations automatically", "Photo retouching", "Writing code"],
      a: 1,
      e: "Gamma AI is an AI-powered presentation tool that transforms a topic or outline into a fully designed, multi-slide presentation — drastically reducing the time needed to create professional decks.",
    },
    {
      q: "What does Canva AI's 'Magic Design' feature do?",
      o: ["It magically fixes broken images", "It generates design templates and layouts based on your content and a brief description of what you need", "It automatically posts designs to social media", "It converts designs to 3D models"],
      a: 1,
      e: "Canva's Magic Design uses AI to suggest and generate design templates tailored to your content, brand, and purpose — dramatically accelerating the design process for non-designers.",
    },
    {
      q: "What is a 'Brand Kit' in Canva?",
      o: ["A physical kit of Canva merchandise", "A saved set of your brand's colors, fonts, and logo that can be applied to any design automatically", "A premium subscription tier", "A collection of stock photos from your brand"],
      a: 1,
      e: "Canva's Brand Kit stores your company's visual identity — specific color codes, approved fonts, and logo files — so every team member can create on-brand designs without guessing or manually inputting brand details.",
    },
    {
      q: "What is 'visual hierarchy' in presentation design?",
      o: ["Arranging employees by seniority in a team photo", "The deliberate arrangement of design elements so viewers naturally notice the most important information first", "Using only vertical layouts in presentations", "A feature in Gamma AI"],
      a: 1,
      e: "Visual hierarchy guides the viewer's eye through a slide in the intended order — using size, color, contrast, and positioning to ensure the headline is seen first, supporting points second, and details last.",
    },
    {
      q: "Which tool would you use to quickly create a professional pitch deck from a written outline?",
      o: ["NotebookLM", "Gamma AI", "Perplexity", "Claude"],
      a: 1,
      e: "Gamma AI is specifically designed to transform text outlines into fully designed presentations — it's the fastest path from 'idea on paper' to 'professional-looking pitch deck.'",
    },
    {
      q: "What is the main advantage of using Canva AI's templates over starting from a blank design?",
      o: ["Templates are always free", "Templates provide proven layouts, visual hierarchy, and design balance — reducing the risk of creating an amateur-looking design", "Templates prevent you from making any design changes", "Templates automatically add your content"],
      a: 1,
      e: "Professional templates encode years of design expertise — balanced layouts, appropriate whitespace, proven typography combinations — giving non-designers a strong visual foundation to build on.",
    },
    {
      q: "What does 'slide design principles' refer to?",
      o: ["The technical file format used for slides", "Guidelines for creating clear, visually effective slides — including simplicity, one idea per slide, strong visuals, minimal text, and consistent styling", "The order in which slides should appear", "The maximum number of slides in a presentation"],
      a: 1,
      e: "Core slide design principles include: one main idea per slide, minimal text (audience reads OR listens, not both), high-quality visuals, consistent fonts and colors, and strong visual hierarchy that guides the eye.",
    },
    {
      q: "For a small business in Jalandhar creating promotional material for Instagram, which tool is most suitable?",
      o: ["Gamma AI", "Canva AI with social media templates", "NotebookLM", "Perplexity"],
      a: 1,
      e: "Canva AI is specifically designed for marketing graphics including social media posts — it has Instagram-specific templates, correct dimensions, and AI design features perfect for small business promotional content.",
    },
    {
      q: "What makes Gamma AI presentations faster to create than traditional PowerPoint?",
      o: ["Gamma has more slide themes than PowerPoint", "Gamma's AI generates complete slides with content, layout, and design from a single text prompt — eliminating the need to manually design each slide", "Gamma works only offline", "Gamma is free while PowerPoint is paid"],
      a: 1,
      e: "Traditional PowerPoint requires you to manually create each slide's content, choose layouts, select colors, add images, and adjust alignment. Gamma's AI does all of this from your text input, reducing hours to minutes.",
    },
    {
      q: "What is the '6x6 rule' in presentation design?",
      o: ["A slide must have exactly 6 slides total", "No more than 6 bullet points per slide and 6 words per bullet — to keep slides readable and prevent information overload", "Use exactly 6 colors in your presentation", "Present for exactly 6 minutes"],
      a: 1,
      e: "The 6x6 rule (max 6 bullets, 6 words each) is a classic guideline to prevent text-heavy slides that audiences read instead of listen to. Less text = more focus on the presenter's message.",
    },
    // --- MEDIUM (10) ---
    {
      q: "When should you choose Gamma AI over Canva for a presentation?",
      o: ["When you need pixel-perfect custom design control", "When you have a text outline or topic and want AI to create a complete, professional presentation structure and design quickly", "When you need to create social media graphics", "When you have a team of designers"],
      a: 1,
      e: "Gamma is optimal when speed and AI-generated structure matter most — going from idea to complete deck rapidly. Canva is better when you need granular design control, specific brand elements, or marketing graphics.",
    },
    {
      q: "A startup founder has 24 hours to prepare a 10-slide investor pitch deck. What is the most efficient workflow?",
      o: ["Hire a designer immediately", "Use Gamma AI with a clear topic outline to generate the initial deck in minutes, then refine slides manually, add real data, and ensure consistent brand colors — then export", "Build it from scratch in PowerPoint", "Use only text in the presentation"],
      a: 1,
      e: "Gamma dramatically accelerates the starting point — generating a structured, designed deck in minutes — leaving maximum time for the high-value work: refining the story, adding accurate data, and practicing the pitch.",
    },
    {
      q: "What is the benefit of applying a Brand Kit in Canva across all company designs?",
      o: ["It saves money on designer fees only", "It ensures all marketing materials (social posts, brochures, presentations) use consistent colors, fonts, and logos — building strong brand recognition", "Brand Kits prevent any design errors", "It automatically posts content to all social platforms"],
      a: 1,
      e: "Brand consistency is critical for recognition and trust. Canva's Brand Kit makes it effortless for any team member — regardless of design skill — to create on-brand materials that look cohesive with everything else the brand produces.",
    },
    {
      q: "What is 'information density' in slides, and why is less usually more?",
      o: ["The file size of a presentation", "How much content is crammed onto each slide — dense slides overwhelm viewers who cannot simultaneously read and listen, reducing comprehension and retention", "The number of slides in a presentation", "The resolution of images used"],
      a: 1,
      e: "Research shows audiences cannot simultaneously read text-heavy slides and listen to a speaker — both compete for the same cognitive resources. Sparse, visual slides keep attention on the presenter; dense slides cause cognitive overload.",
    },
    {
      q: "How can Canva AI's Magic Write feature help a small business owner with limited writing skills?",
      o: ["It writes code for a company website", "It generates copy for social media posts, product descriptions, and marketing materials directly within Canva — so design and content are created in one place", "It translates designs into multiple languages automatically", "It reads your designs aloud"],
      a: 1,
      e: "Canva's Magic Write uses AI to generate marketing copy within the design tool — meaning a business owner can simultaneously create the visual design and the text content without switching between multiple apps.",
    },
    {
      q: "What is a 'story arc' in presentations, and how does Gamma AI help create one?",
      o: ["A circular shape used in slide design", "A narrative structure (problem → solution → proof → call to action) that makes presentations persuasive — Gamma AI can help structure this flow from your topic description", "The animation style used in transitions", "The font size used for headings"],
      a: 1,
      e: "A strong presentation tells a story — establishing a problem the audience relates to, presenting your solution, proving it works, and calling the audience to action. Gamma AI's topic-to-deck generation often creates this narrative arc automatically.",
    },
    {
      q: "A training institute in Patiala wants consistent branding across 100 course presentations. What is the most efficient approach?",
      o: ["Have a designer redo each presentation manually", "Create a Canva Brand Kit with the institute's colors, fonts, and logo; use a master presentation template; train staff to use both — ensuring every presentation is auto-on-brand", "Use a different tool for each presentation", "Avoid using templates to keep each presentation unique"],
      a: 1,
      e: "The Brand Kit + master template approach is the most scalable solution — any staff member can create new presentations that automatically inherit the institute's visual identity without design expertise.",
    },
    {
      q: "What is the difference between using Gamma AI for content creation vs Canva AI for content creation?",
      o: ["There is no difference — both do exactly the same thing", "Gamma AI is optimized for structured multi-slide presentations from text; Canva AI is optimized for single-frame visual designs with granular creative control — different tools for different outputs", "Canva AI is only for video", "Gamma AI can only create 5-slide presentations"],
      a: 1,
      e: "Gamma creates multi-slide presentations from text prompts with AI handling structure and design; Canva gives you design templates and AI assistance but requires more manual design decisions — they serve different creative needs.",
    },
    {
      q: "What should you always do before using an AI-generated Gamma presentation professionally?",
      o: ["Nothing — AI-generated presentations are always presentation-ready", "Review every slide for accuracy, replace placeholder text, add your real data, adjust the brand to match your organization's identity, and practice your delivery", "Translate it into a different language", "Add as much text as possible to each slide"],
      a: 1,
      e: "AI-generated presentations are excellent starting points, not final products. They may contain generic content, inaccurate placeholders, or design choices that don't match your brand — always treat them as a draft requiring your expert refinement.",
    },
    {
      q: "What visual design principle relates to using empty space intentionally in a slide?",
      o: ["Cluttering", "White space (negative space) — deliberately leaving areas empty to reduce visual noise, improve readability, and direct attention to key content", "Symmetry only applies to logos", "Visual density"],
      a: 1,
      e: "White space is a core design principle: empty space is not wasted space — it gives content room to breathe, reduces cognitive load, and makes key information stand out more clearly. Many amateur designers make the mistake of filling every pixel.",
    },
    // --- HARD (5) ---
    {
      q: "What is 'cognitive load theory' and how should it inform AI-generated presentation design?",
      o: ["A theory about how heavy computers make audiences tired", "The principle that human working memory is limited — slides should be designed to minimize extraneous information and present one concept at a time to maximize learning and retention", "A rule about how long AI should take to generate slides", "A measurement of how complex the AI model is"],
      a: 1,
      e: "Cognitive Load Theory (Sweller, 1988) shows that working memory can only process a limited amount of information simultaneously. Well-designed slides reduce 'extraneous load' (distracting elements) and 'intrinsic load' (complexity) — enabling learners to focus on the actual content.",
    },
    {
      q: "What is a critical limitation of AI-generated Gamma presentations for highly technical or specialized content?",
      o: ["Gamma AI generates too many slides", "AI cannot verify the accuracy of technical content — a data science presentation or medical training deck generated by AI may contain confident-sounding but incorrect technical information requiring expert review", "Gamma AI only generates presentations in English", "AI-generated slides have poor visual quality"],
      a: 1,
      e: "Gamma AI generates based on patterns in its training data — it doesn't have genuine expertise. For technical, medical, legal, or scientific presentations, the AI-generated content must be rigorously verified by a subject matter expert before professional use.",
    },
    {
      q: "How does understanding color psychology improve AI-assisted design decisions in Canva?",
      o: ["Color psychology only applies to fashion, not presentations", "Knowing that colors evoke emotional responses (blue = trust, red = urgency, green = growth) allows you to guide Canva AI's color suggestions toward palettes that reinforce your message and brand positioning", "Canva AI automatically selects psychologically optimal colors", "Color choice has no impact on audience perception"],
      a: 1,
      e: "Color psychology is a genuine phenomenon — studies show color choice significantly influences perception of brand trustworthiness, urgency, and category association. Understanding it allows designers to use Canva's tools intentionally rather than aesthetically.",
    },
    {
      q: "What is 'progressive disclosure' in presentation design, and how can it be effectively implemented?",
      o: ["Disclosing sensitive information at the end of a presentation", "Revealing information incrementally as needed — showing one point at a time through animations or slide sequencing — to prevent cognitive overload and guide audience focus", "A legal requirement to show data sources", "Using increasingly complex slides throughout a deck"],
      a: 1,
      e: "Progressive disclosure controls the information flow — by revealing content step-by-step (rather than all at once), presenters keep audience attention on the current point, prevent premature reading, and create more dynamic, engaging slide experiences.",
    },
    {
      q: "From a strategic communications standpoint, what is the most critical element of a high-stakes investor presentation that AI tools alone cannot determine?",
      o: ["The visual design and color scheme", "The genuine business narrative — the authentic story of why this problem matters, why this team, why now — which requires deep self-knowledge, market understanding, and genuine conviction that no AI can fabricate", "The number of slides", "Grammatically correct text"],
      a: 1,
      e: "Investors fund people and stories, not slides. AI can generate professional visuals and polished language, but the core narrative — your unique insight about the market, your authentic team story, your genuine conviction — must come from you. AI amplifies your story; it cannot create the substance of it.",
    },
  ],

  9: [],  // TODO: Image Generation
  10: [], // TODO: Video Creation
  11: [], // TODO: AI for Productivity & Automation
  12: [], // TODO: AI for Coding & Development
  13: [], // TODO: AI for Data & Analytics
  14: [], // TODO: AI Business Strategy
  15: [], // TODO: AI Career & Future Skills
  16: [], // TODO: Capstone & Final Project
};
