# Week 1: How LLMs Actually Work

## Week Overview

**Theme:** Deep understanding of the technology behind AI language models
**Sessions:** 4 (Sessions 1-4)
**Total Hours:** 8 hours
**Key Outcome:** Participants understand transformer architecture, tokenization, model parameters, and can critically evaluate different LLMs

---

## Session 1: Transformer Architecture Simplified

**Date:** Week 1, Day 1
**Duration:** 120 minutes
**Topic:** How Transformers Work -- The Assembly Line of Attention
**Learning Objectives:**
1. Explain the transformer architecture using the "assembly line" analogy
2. Understand the concept of attention mechanisms in plain language
3. Trace how a prompt becomes a response (input to output pipeline)
4. Identify why transformers revolutionized NLP over previous approaches

### Materials Needed
- Projector with internet access
- Whiteboard and markers (multiple colors)
- Participant laptops with ChatGPT and Claude open
- Printed visual: "Transformer Architecture Diagram" (simplified, 1 per participant)
- 20 index cards with words written on them (for the attention activity)
- Handout: "LLM Glossary" (print 1 per participant)

### Pre-Session Setup (Trainer)
- Draw a blank "assembly line" diagram on the whiteboard (to fill in during instruction)
- Prepare 20 index cards with words for the attention activity
- Test all AI tools are accessible
- Print architecture diagrams and glossaries
- Have the "Attention Is All You Need" paper title on a slide (reference only, not reading it)

### Minute-by-Minute Session Plan

| Time | Duration | Activity | Trainer Notes |
|---|---|---|---|
| 0:00-0:05 | 5 min | **Warm-Up: "What Happens When You Press Enter?"** Ask the class: "When you type a prompt in ChatGPT and press Enter, what do you think happens in the 2-3 seconds before the response appears?" Collect answers on the whiteboard. Most people think it "searches a database" or "looks up the answer." "Today we learn what ACTUALLY happens. It is more fascinating than you think." | This warm-up reveals misconceptions. Most people, even regular AI users, think LLMs are fancy search engines. The reality is more interesting. Write all answers on the board -- you will return to them at the end to debunk myths. |
| 0:05-0:15 | 10 min | **Introductions + Baseline Check.** Since this is Session 1, do quick introductions: name, profession, how long they have used AI, and "what is the most impressive thing you have done with AI?" This reveals the class skill level. Trainer introduces the course structure, assessment, and expectations. | Keep introductions efficient: 30 seconds each. The "most impressive AI use" question helps you gauge who is advanced and who is at the minimum prerequisite level. Set expectations: "This is an advanced course. We move fast. Ask questions anytime." |
| 0:15-0:22 | 7 min | **Instruction: Before Transformers -- The Dark Ages.** Quick history: (1) Rule-based systems (1950s-2000s): if-then rules, no learning (2) RNNs and LSTMs (2010s): processed words one at a time, like reading a book with amnesia -- forgot the beginning by the end (3) The problem: sequential processing was too slow and lost context. "Imagine reading a novel but forgetting Chapter 1 by Chapter 5. That was AI before 2017." | Keep the history brief -- this is context, not the main lesson. The "amnesia" analogy makes RNN limitations instantly clear. Show a quick visual of sequential vs parallel processing if possible. |
| 0:22-0:35 | 13 min | **Instruction: The Assembly Line Analogy.** Core teaching moment. Draw the transformer as a factory assembly line on the whiteboard: (1) **Raw Material Loading (Input Embedding):** Words arrive and get converted into numbers (vectors). Like raw materials entering a factory. (2) **Quality Inspection Stations (Attention Layers):** At each station, every word "looks at" every other word to understand relationships. Not sequential -- ALL at once. Like having 100 inspectors looking at every part simultaneously. (3) **Assembly Stations (Feed-Forward Layers):** After inspection, words get enriched with context. "Bank" next to "river" gets flagged as nature; "bank" next to "money" gets flagged as finance. (4) **Final Assembly (Output Layer):** The enriched understanding produces the most likely next word. Repeat for each word. | Draw each station as you explain. Use colored markers: blue for input, red for attention, green for feed-forward, black for output. The assembly line metaphor works because it is parallel (unlike sequential manufacturing) and each station adds value. Ask participants to repeat the analogy back to you in their own words after you finish. |
| 0:35-0:45 | 10 min | **Instruction: Attention -- The Secret Sauce.** Deeper dive into attention. Activity: lay out 10 index cards on a table with a sentence like "The cat sat on the mat because it was tired." Ask: "What does 'it' refer to?" Humans instantly know it is "the cat." Explain: attention does this computationally. Every word calculates how much it should "pay attention" to every other word. "It" pays high attention to "cat" and low attention to "mat." Draw attention arrows on the whiteboard. | The physical card activity makes attention tangible. Let participants handle the cards and draw their own attention arrows. This kinesthetic element helps cement the concept. If time allows, try an ambiguous sentence: "The trophy would not fit in the suitcase because it was too big." What does "it" refer to? Attention mechanisms determine this. |
| 0:45-1:00 | 15 min | **Guided Practice: Trace the Pipeline.** Participants work in pairs. They pick a simple prompt (e.g., "What is the capital of France?") and trace it through the assembly line on paper: (1) Tokenize the input (approximate -- break into words) (2) Imagine what attention connections would form (3) Predict what the model would output and why. They draw their own simplified transformer diagram. Then test: type the prompt in ChatGPT and see if the output matches their prediction. | Walk around checking diagrams. The prediction element is key: participants should try to "think like the model" before seeing the output. This builds intuition for prompt engineering later. Common mistake: thinking the model "looks up" France. Correct: it predicts "Paris" because those tokens have high co-occurrence in training data. |
| 1:00-1:15 | 15 min | **Guided Practice: Breaking the Assembly Line.** Participants experiment with prompts that reveal how the transformer works (and fails). Try: (1) "Continue this pattern: A, B, C, D, ..." (prediction) (2) "The following is true: 2+2=5. What is 2+2?" (conflicting context) (3) Very long prompt that repeats the same instruction at the beginning and end with contradictory middle (attention limits). Discuss what each experiment reveals about the architecture. | These are designed to expose transformer behavior. The "2+2=5" experiment shows how context can override training. The contradiction experiment shows attention decay over long contexts. Guide discussion: "What does this tell us about how the model processes information?" |
| 1:15-1:20 | 5 min | **Break.** | Quick screen break. |
| 1:20-1:40 | 20 min | **Independent Practice: Architecture Explorer.** Participants complete 5 experiments and document results in their portfolio: (1) Test attention by writing sentences with ambiguous pronouns -- does AI resolve them correctly? (2) Test context dependency by giving the same question with different preceding context (3) Test the "assembly line" by progressively adding context to a vague prompt and seeing how outputs change (4) Test parallel processing: give a prompt with 5 independent questions -- does it handle all equally well? (5) Find a prompt where the transformer architecture clearly fails. | These experiments build deep understanding. Each one illuminates a different aspect of the architecture. Participants should document: the prompt, the expected output, the actual output, and what this reveals about transformers. This goes in their portfolio. |
| 1:40-1:55 | 15 min | **Independent Practice: Teach-Back.** Participants pair up. Each person has 3 minutes to explain the transformer architecture to their partner using the assembly line analogy. Partner gives feedback: "Was it clear? What was confusing?" Then swap. If they can teach it, they understand it. | The teach-back method is the highest level of learning retention. Walk around and listen. Correct any misconceptions you hear. Common mistake: saying the model "understands" or "knows" -- redirect to "predicts" and "calculates attention." |
| 1:55-2:00 | 5 min | **Wrap-Up: Myth Busting.** Return to the whiteboard from warm-up. Go through each answer about "what happens when you press Enter" and correct them. "It does not search a database. It runs your tokens through an attention-based assembly line that predicts the most likely next token based on patterns in its training data." Preview Session 2: "Tomorrow we go deeper: tokens and context windows. Why does ChatGPT sometimes forget what you said? Why does it cost money to use GPT-4? The answer is tokens." | The bookend with the warm-up is satisfying. Participants see how far their understanding has come in one session. End with curiosity for tomorrow. |

### Homework / Take-Home Challenge
Write a 1-page explanation of the transformer architecture as if explaining to a 10-year-old. Use your own analogies (not the assembly line -- create something new). Bring it to share tomorrow.

---

## Session 2: Tokens & Context Windows

**Date:** Week 1, Day 2
**Duration:** 120 minutes
**Topic:** Understanding Tokenization, Context Windows, and Their Impact on Prompting
**Learning Objectives:**
1. Define tokens and demonstrate tokenization with real examples
2. Explain context windows and their limits across different models
3. Use the OpenAI Tokenizer to count tokens in prompts
4. Design prompts that optimize token usage

### Materials Needed
- Projector with internet access
- Participant laptops with ChatGPT, Claude, and OpenAI Tokenizer open
- Whiteboard and markers
- Handout: "Token Counting Cheat Sheet" (print 1 per participant)
- Handout: "Context Window Comparison Chart" (print 1 per participant)

### Pre-Session Setup (Trainer)
- Open the OpenAI Tokenizer (platform.openai.com/tokenizer) on the projector
- Prepare 5 text samples of varying length for token counting
- Create a context window comparison chart (GPT-4o, Claude Sonnet, Gemini Pro, Llama)
- Print both handouts

### Minute-by-Minute Session Plan

| Time | Duration | Activity | Trainer Notes |
|---|---|---|---|
| 0:00-0:05 | 5 min | **Warm-Up: "How Much Does This Prompt Cost?"** Show a 500-word prompt on screen. Ask: "If this prompt costs money to process, how would the AI company calculate the cost?" Collect guesses. "The answer is TOKENS. And by the end of today, you will be able to calculate the exact cost of any prompt." | This connects tokens to money immediately -- professionals care about cost. The pricing angle hooks business owners especially. |
| 0:05-0:15 | 10 min | **Recap Session 1 + Homework Share.** Ask 2-3 participants to share their "explain transformers to a 10-year-old" homework. Class votes on the best analogy. Quick recap question: "What is attention, in one sentence?" | Celebrate creative analogies. Common good ones: "Like a group of friends at a party where everyone can hear everyone at once" or "Like a team of editors, each reading the whole document simultaneously." |
| 0:15-0:25 | 10 min | **Instruction: What Are Tokens?** Open the OpenAI Tokenizer on the projector. Type "Hello, world!" and show the token breakdown. Key points: (1) A token is roughly 3/4 of a word in English (2) Common words are one token; rare words may be split into multiple tokens (3) Spaces and punctuation are tokens too (4) Hindi/Punjabi text uses MORE tokens per word than English. Live demo: tokenize "artificial intelligence" (2 tokens) vs "antidisestablishmentarianism" (5+ tokens). | The tokenizer visual is powerful. Participants can see words being split into colored chunks. Show surprises: "ChatGPT" is actually multiple tokens. Numbers tokenize differently than words. Hindi text: show how a short Hindi sentence uses many more tokens than the English equivalent -- this is important for bilingual users in Punjab. |
| 0:25-0:35 | 10 min | **Instruction: Context Windows Explained.** Analogy: "The context window is the model's working memory. Everything in the conversation -- your prompts AND the AI responses -- must fit in this window. When the conversation exceeds the window, the model starts forgetting the beginning." Show the comparison chart: GPT-4o (128K tokens), Claude Sonnet (200K tokens), Gemini Pro (1M tokens), Llama 3 (8K tokens). Calculate: 128K tokens is roughly 96,000 words or a 300-page book. | Draw a visual: a sliding window moving across a long document. As new content enters, old content falls off the left side. This explains why long conversations "lose" early context. The book analogy helps: "Claude can hold a 600-page book in memory. GPT-4o can hold 300 pages. Llama holds about 25 pages." |
| 0:35-0:45 | 10 min | **Instruction: Token Economics.** Explain pricing: (1) Input tokens cost less than output tokens (2) GPT-4o: ~$2.50/1M input tokens, ~$10/1M output tokens (3) Claude Sonnet: ~$3/1M input, ~$15/1M output. Calculate live: "If your prompt is 1000 tokens and the response is 2000 tokens, this call costs approximately $0.0225. Cheap for one call. But if you make 10,000 API calls per day for a business..." | This is especially relevant for participants building business applications. The "per call is cheap but at scale is expensive" realization is important. Show: a customer service bot handling 1000 conversations/day would cost approximately $225/day at these rates. |
| 0:45-1:00 | 15 min | **Guided Practice: Token Counting Lab.** Participants open the OpenAI Tokenizer. They tokenize: (1) A short prompt they use regularly (2) A long, detailed prompt (3) The same prompt in English vs Hindi (4) A prompt with formatting (markdown, bullet points) (5) Code vs natural language. They document: text, token count, and cost estimate. Goal: build intuition for token sizes. | Walk around checking that everyone can access the tokenizer. Help participants who are new to the concept. Key insight to drive home: "Now you understand why ChatGPT starts 'forgetting' things in long conversations -- the context window fills up." |
| 1:00-1:15 | 15 min | **Guided Practice: Context Window Stress Test.** Participants conduct an experiment: (1) Start a new ChatGPT conversation (2) Give a specific instruction at the very beginning: "Always end every response with 'PINEAPPLE'" (3) Have a normal conversation for 20+ exchanges (4) Check: does it still follow the instruction? When does it "forget"? They document the exact point of failure. Repeat with Claude and compare. | This experiment makes context window limits REAL. Participants will see the instruction being followed initially, then forgotten. The comparison between ChatGPT and Claude reveals different context handling. This is one of the most eye-opening activities in the course. |
| 1:15-1:20 | 5 min | **Break.** | Quick break. Participants often want to keep experimenting -- encourage a real break. |
| 1:20-1:40 | 20 min | **Independent Practice: Token Optimization.** Participants take a long, verbose prompt (provided by trainer, ~500 tokens) and optimize it to say the same thing in fewer tokens. Target: reduce by 40% without losing meaning. They test both versions in ChatGPT and compare output quality. Document: original prompt (tokens), optimized prompt (tokens), quality comparison. Then they optimize one of their OWN frequently-used prompts. | Provide a deliberately verbose prompt to optimize. Example: "I would like you to please help me with writing an email to my boss in which I explain to him that I need to take some time off from work next week because I have a doctor's appointment that I need to attend." This can easily be cut to half the tokens. |
| 1:40-1:55 | 15 min | **Independent Practice: Cost Calculator.** Participants build a simple Google Sheet: columns for Prompt Name, Input Tokens, Output Tokens (estimated), Model, Cost per Call, Calls per Day (estimated), Daily Cost, Monthly Cost. They populate it with 5 real prompts they use or plan to use. This becomes a practical planning tool. | This is directly applicable for business users. A freelancer or business owner who wants to build AI tools needs to understand cost. The spreadsheet becomes a reference tool they keep using after the course. |
| 1:55-2:00 | 5 min | **Wrap-Up: Token Wisdom.** Key takeaways: (1) Tokens = the currency of AI (2) Context window = AI's working memory (3) Longer is not always better -- optimize your prompts (4) Different models have different windows and costs. Preview Session 3: "Tomorrow we get experimental: temperature, top-p, and other parameters. Same prompt, wildly different outputs. You will see why." | End with clear, memorable takeaways. The "tokens = currency" framing will stick. |

### Homework / Take-Home Challenge
Take your 3 most-used prompts. Tokenize each one. Optimize each to use 30% fewer tokens while maintaining output quality. Document: before/after token counts and output comparison.

---

## Session 3: Temperature & Parameters

**Date:** Week 1, Day 3
**Duration:** 120 minutes
**Topic:** Model Parameters -- Controlling AI Behavior Through Settings
**Learning Objectives:**
1. Explain temperature, top-p, frequency penalty, and presence penalty
2. Predict how parameter changes will affect outputs
3. Choose optimal parameters for different use cases
4. Conduct systematic experiments with parameter variations

### Materials Needed
- Projector with internet access
- Participant laptops with ChatGPT (Playground access ideal), Claude
- Whiteboard and markers
- Handout: "Parameter Reference Card" (print 1 per participant)
- Handout: "Experiment Log Template" (print 3 per participant)

### Pre-Session Setup (Trainer)
- Access OpenAI Playground (or API playground) -- this is where parameters can be adjusted
- If Playground is not available, prepare to use the ChatGPT API or demonstrate via screenshots
- Prepare 5 identical prompts to test at different temperatures
- Print handouts

### Minute-by-Minute Session Plan

| Time | Duration | Activity | Trainer Notes |
|---|---|---|---|
| 0:00-0:05 | 5 min | **Warm-Up: "Same Recipe, Different Chef."** Show 3 responses to the EXACT same prompt. One is formal and precise. One is creative and wild. One is completely nonsensical. Ask: "Same prompt, same model. Why are these so different?" Answer: "Temperature. And today you learn to control it like a professional chef controls heat." | The cooking analogy sets up the entire session. Temperature in cooking = temperature in AI. Low heat = controlled, predictable. High heat = volatile, surprising. |
| 0:05-0:15 | 10 min | **Recap Session 2 + Homework Review.** Ask 2 participants to share their token optimization results. "How many tokens did you save? Did output quality change?" Quick discussion. Transition: "Yesterday was about the QUANTITY of your prompt (tokens). Today is about the QUALITY of the output (parameters)." | The quantity vs quality framing clearly differentiates Sessions 2 and 3. |
| 0:15-0:28 | 13 min | **Instruction: Temperature Explained.** Draw a number line on the whiteboard: 0 on the left, 2 on the right. Explain: (1) **Temperature 0:** The model ALWAYS picks the most probable next token. Output is deterministic, predictable, repetitive. Like a very cautious chef who follows the recipe exactly. (2) **Temperature 0.7:** The model usually picks probable tokens but occasionally surprises. Balanced creativity. Like a good chef who improvises a little. (3) **Temperature 1.0:** The model considers less probable tokens. More creative, sometimes incoherent. Like an experimental chef. (4) **Temperature 2.0:** Near-random token selection. Chaotic, often nonsensical. Like a chef throwing random ingredients. Live demo: same prompt at temp 0, 0.7, 1.0, and 2.0. | If you have OpenAI Playground access, demonstrate live. If not, pre-generate 4 outputs and show them side by side. The visual contrast between temp 0 (boring but accurate) and temp 2 (creative but unhinged) is always dramatic. Ask participants: "For what tasks would you use temp 0? Temp 1?" |
| 0:28-0:35 | 7 min | **Instruction: Other Parameters.** Briefly cover: (1) **Top-p (nucleus sampling):** Instead of temperature, limit the token choices to the top X% of probability. Top-p 0.1 = very restricted. Top-p 0.9 = wide range. (2) **Frequency penalty:** Reduces repetition by penalizing tokens that have already appeared. (3) **Presence penalty:** Encourages new topics by penalizing tokens from topics already discussed. (4) **Max tokens:** Hard limit on response length. | Do not go too deep on top-p vs temperature -- the debate over which to use is ongoing even among researchers. Key point: "In practice, adjusting temperature is the most important parameter. The others are fine-tuning knobs." |
| 0:35-0:40 | 5 min | **Instruction: Parameter Cheat Sheet.** Distribute the reference card. Walk through use-case recommendations: Code generation (temp 0-0.2), Business writing (0.3-0.5), Creative writing (0.7-0.9), Brainstorming (0.9-1.2), Poetry/experimental (1.0-1.5). "There is no 'best' temperature. There is only the RIGHT temperature for your task." | The cheat sheet is a practical takeaway they will reference often. Emphasize: these are starting points, not rules. Experimentation is key. |
| 0:40-1:00 | 20 min | **Guided Practice: Temperature Lab.** Participants conduct a systematic experiment. Same prompt, tested at 5 temperatures (0, 0.3, 0.7, 1.0, 1.5). They document each output on the experiment log. Prompt options: (1) "Write a product description for a smartwatch" (2) "Explain quantum computing" (3) "Write a story opening about a detective." After all 5, they rank outputs: which temperature produced the best result for this specific task? | If OpenAI Playground is not accessible, participants can use the "be more creative" or "be more precise" instructions in regular ChatGPT as approximate temperature controls. The key learning is experiencing the spectrum. Walk around checking experiment logs are thorough. |
| 1:00-1:15 | 15 min | **Guided Practice: Parameter Mixing.** Participants experiment with combining parameters: (1) Low temperature + high frequency penalty = ? (2) High temperature + low top-p = ? (3) High presence penalty + creative prompt = ? They test combinations and document surprising results. Then discuss: "Which combination produced the most useful output for your use case?" | This builds deeper intuition. Some combinations are contradictory (high temp + low top-p effectively cancel each other out). Participants discover this through experimentation, which is more powerful than being told. |
| 1:15-1:20 | 5 min | **Break.** | Quick break. |
| 1:20-1:40 | 20 min | **Independent Practice: Parameter Optimization Challenge.** Each participant picks a real task they do regularly with AI (email writing, code review, content creation, research, etc.). They test their usual prompt at 5 different temperature settings. They find the OPTIMAL temperature for their specific use case. They document: task, prompt, 5 outputs, optimal temperature, and reasoning. | This is directly applicable to their daily AI use. By the end, each participant has a personalized temperature setting for their most common task. This is practical knowledge they will use immediately. |
| 1:40-1:55 | 15 min | **Independent Practice: The Parameter Cookbook.** Participants create a "recipe card" for 3 different tasks. Each card has: Task Name, Recommended Temperature, Top-p Setting, Frequency Penalty, Presence Penalty, Max Tokens, and a sample prompt. They share their best recipe with the class. | The cookbook metaphor continues from the warm-up. These recipe cards become part of their portfolio. Sharing builds community knowledge -- someone might have optimized a task that others find useful. |
| 1:55-2:00 | 5 min | **Wrap-Up: Parameter Mastery.** Quick poll: "What is the biggest thing you learned about temperature today?" Most common insight: "I had no idea the same prompt could produce such different results." Preview Session 4: "Tomorrow is the main event: GPT-4o vs Claude Sonnet vs Gemini Pro vs Llama. Blind test. YOU judge. Bring your toughest prompts." | Build excitement for the model comparison. "Bring your toughest prompts" gives them homework naturally. |

### Homework / Take-Home Challenge
Write your 3 hardest prompts -- the ones where you need the best possible AI output. Do NOT test them yet. Bring them fresh to tomorrow's blind test. Also: create 2 more parameter recipe cards for your portfolio.

---

## Session 4: Model Comparison Deep Dive

**Date:** Week 1, Day 4
**Duration:** 120 minutes
**Topic:** GPT-4o vs Claude Sonnet vs Gemini Pro vs Llama -- Blind Test & Critical Evaluation
**Learning Objectives:**
1. Compare output quality across 4 major LLMs
2. Identify specific strengths and weaknesses of each model
3. Choose the right model for different task types
4. Conduct systematic, unbiased model evaluation

### Materials Needed
- Projector with internet access
- Participant laptops with ChatGPT, Claude, Gemini, and optionally a Llama interface (e.g., via Groq or HuggingChat)
- Whiteboard and markers (4 colors, one per model)
- Handout: "Blind Test Scorecard" (print 5 per participant)
- Handout: "Model Comparison Matrix" (print 1 per participant)
- Numbered labels (1-4) for blind test

### Pre-Session Setup (Trainer)
- Open all 4 AI models in separate browser windows
- Prepare 5 standardized test prompts (same prompt for all models)
- Create a scoring system for blind test
- Set up the blind test: responses labeled A, B, C, D (not by model name)
- Print scorecards and comparison matrices
- Have Groq or HuggingChat ready for Llama access (if participants do not have local Llama)

### Minute-by-Minute Session Plan

| Time | Duration | Activity | Trainer Notes |
|---|---|---|---|
| 0:00-0:05 | 5 min | **Warm-Up: "Brand Loyalty Test."** Quick poll: "Which AI model do you use most?" Tally on the whiteboard. Then: "Today we test if your favorite model is ACTUALLY the best, or if you just use it out of habit. Prepare to have your beliefs challenged." | Most participants will say ChatGPT. This poll creates a "before" data point. After the blind test, many will change their preference. The shift is a powerful learning moment about bias. |
| 0:05-0:15 | 10 min | **Recap Week 1.** Quick review of all 3 sessions: transformers (architecture), tokens (input economics), parameters (output control). Verbal quiz: "What is attention?" "What is a token?" "What does temperature 0 mean?" 5 rapid questions. Transition: "Now you understand HOW models work. But not all models are created equal. Let us find out which is best -- for WHAT." | Emphasize "for WHAT" -- the key insight is that no model is universally best. Different models excel at different tasks. This nuance is what separates advanced users from beginners. |
| 0:15-0:25 | 10 min | **Instruction: The 4 Contenders.** Brief profile of each model: (1) **GPT-4o (OpenAI):** The market leader. Multimodal, fast, widely integrated. (2) **Claude Sonnet (Anthropic):** Known for long context, nuanced writing, following complex instructions. (3) **Gemini Pro (Google):** Massive context window, strong at research and factual tasks, integrated with Google ecosystem. (4) **Llama 3 (Meta):** Open-source, runs locally, no data sent to cloud, customizable. Key stats: context window, pricing, availability. | Keep this factual and unbiased. Do NOT express a model preference. The blind test will let participants form their own opinions based on evidence. If you have a personal favorite, actively challenge it during the discussion. |
| 0:25-0:30 | 5 min | **Instruction: How to Evaluate Fairly.** Explain the blind test methodology: (1) Same prompt to all models (2) Responses labeled A, B, C, D -- model names hidden (3) Score each response on: accuracy, completeness, clarity, usefulness, creativity (4) Reveal model names AFTER scoring. Distribute scorecards. "No peeking at which model produced which response. Judge the output, not the brand." | This teaches evaluation methodology. In professional AI work, blind testing is standard practice for model selection. Participants learn a skill they will use beyond this class. |
| 0:30-0:50 | 20 min | **Guided Practice: Blind Test Round 1 (3 prompts).** Trainer runs 3 standardized prompts through all 4 models (pre-done to save time). Responses are displayed labeled A-D on the projector (or in a shared doc). Participants score each response on the scorecard. Prompts: (1) A factual question with nuance (2) A creative writing task (3) A logical reasoning / analysis task. After scoring all 3, trainer reveals model names. | Pre-generate responses to save time. Display on screen or share via Google Doc so everyone can read at their own pace. The reveal moment is always dramatic -- "Response B, which most of you scored highest, was actually Claude." or "The response most of you scored lowest was GPT-4o." Challenge assumptions. |
| 0:50-1:05 | 15 min | **Guided Practice: Blind Test Round 2 (Participant Prompts).** Using the prompts participants brought as homework, run 2-3 of the most interesting ones through all 4 models live. Participants score blind, then reveal. Discuss: "Did the 'best' model change depending on the task?" | Live generation takes more time but is more authentic. If time is tight, pre-generate during break. The task-dependency insight is crucial: "GPT-4o might win at coding but Claude might win at writing. There is no universal champion." |
| 1:05-1:10 | 5 min | **Guided Practice: Results Analysis.** Tally class scores on the whiteboard. Which model won each round? Which model had the highest average? Compare with the "brand loyalty" poll from the warm-up. "How many of you now have a different opinion about which model is best?" | The visual comparison on the whiteboard is compelling. If the results are close (they often are), that is the point: "These models are closer in quality than most people think. The prompt matters more than the model." |
| 1:10-1:15 | 5 min | **Break.** | Let participants discuss results informally during break. They will have strong opinions. |
| 1:15-1:35 | 20 min | **Independent Practice: Personal Model Assessment.** Each participant tests their own use case across all 4 models. They pick their most important/frequent AI task and run it on all models. They complete the "Model Comparison Matrix" handout: for their specific use case, rank each model on accuracy, speed, cost, tone, and overall fit. They write a 3-sentence recommendation for themselves. | This is personalized. A content writer will get different results than a programmer. A business owner will have different priorities than a student. Each person leaves with a data-driven model recommendation for THEIR specific needs. |
| 1:35-1:50 | 15 min | **Independent Practice: Model Selection Framework.** Participants create a decision framework: "If I need [task type], use [model] because [reason]." They create at least 5 rules. Examples: "If I need code debugging, use GPT-4o because it handles code context best." "If I need to analyze a long document, use Claude because of its larger context window." "If I need privacy, use Llama because it runs locally." | These rules become practical guidelines for daily use. Share some with the class -- participants often have insights others have not considered. Build a class "collective wisdom" list on the whiteboard. |
| 1:50-1:55 | 5 min | **Independent Practice: Portfolio Entry.** Participants add to their portfolio: blind test results, personal model comparison, and decision framework. This becomes a reference document. | Quick documentation. They should have all data from today's experiments ready to paste/write. |
| 1:55-2:00 | 5 min | **Wrap-Up: Week 1 Complete.** "In 4 sessions, you have gone from 'I use ChatGPT' to understanding transformer architecture, tokens, parameters, and having a data-driven model selection framework. You know more about LLMs than 99% of AI users." New brand loyalty poll: "Which model would you use NOW for your main task?" Compare with the opening poll. Preview Week 2: "Next week, we learn the frameworks that professional prompt engineers use. CRISP, chain-of-thought, few-shot, system prompts. Your prompts are about to go from good to exceptional." | The second poll comparison is always revealing. Many participants change their preference. This demonstrates that evidence-based evaluation beats brand loyalty. End Week 1 with confidence and anticipation for Week 2. |

### Homework / Take-Home Challenge
Run your top 5 most-used prompts through at least 2 different models. Document which model produced better results for each. Update your model selection framework. Be prepared to share your findings.

---

## Week 1 Trainer Checklist

- [ ] All participants can explain the transformer architecture using an analogy by end of Session 1
- [ ] All participants can use the OpenAI Tokenizer by end of Session 2
- [ ] All participants have conducted temperature experiments by end of Session 3
- [ ] All participants have a personal model selection framework by end of Session 4
- [ ] Prompt portfolios started with experiment documentation
- [ ] Pre-course assessment scores reviewed and any support needs identified
- [ ] All participants have working accounts on ChatGPT, Claude, and Gemini
- [ ] Participant engagement and comprehension levels noted for Week 2 pacing
