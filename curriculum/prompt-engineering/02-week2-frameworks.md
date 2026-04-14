# Week 2: Advanced Prompt Frameworks

## Week Overview

**Theme:** Mastering professional prompt engineering frameworks and techniques
**Sessions:** 4 (Sessions 5-8)
**Total Hours:** 8 hours
**Key Outcome:** Participants can apply CRISP, chain-of-thought, few-shot, zero-shot, and system prompt techniques to any task

---

## Session 5: CRISP Framework Deep Dive

**Date:** Week 2, Day 1
**Duration:** 120 minutes
**Topic:** The CRISP Framework -- Context, Role, Instructions, Specifics, Parameters
**Learning Objectives:**
1. Apply all 5 elements of the CRISP framework to any prompt
2. Write CRISP prompts for 10 different scenarios
3. Identify which CRISP elements are missing in weak prompts
4. Compare CRISP-structured vs unstructured prompt outputs

### Materials Needed
- Projector with internet access
- Participant laptops with ChatGPT and Claude open
- Whiteboard and markers (5 colors for 5 CRISP elements)
- Handout: "CRISP Framework Reference" (print 1 per participant)
- Handout: "CRISP Exercise Pack" (10 exercises, print 1 per participant)

### Pre-Session Setup (Trainer)
- Write C-R-I-S-P vertically on the whiteboard in large letters (leave space for definitions)
- Prepare 10 exercise scenarios covering different industries/tasks
- Test 3 CRISP prompts in both ChatGPT and Claude
- Print all handouts

### Minute-by-Minute Session Plan

| Time | Duration | Activity | Trainer Notes |
|---|---|---|---|
| 0:00-0:05 | 5 min | **Warm-Up: "Rate This Prompt."** Show a mediocre prompt on screen: "Write a marketing email for my product." Ask participants to rate it 1-10. Most will say 3-4. "By the end of today, you will transform this into a 9/10 prompt using one framework: CRISP." | The "before" prompt establishes the baseline. They will transform this exact prompt at the end of the session and see the dramatic improvement. |
| 0:05-0:15 | 10 min | **Recap Week 1.** Quick verbal review: "Name 3 things that affect AI output quality." Expected answers: prompt quality, temperature, model choice, context window. "Week 1 was about understanding the engine. Week 2 is about driving the car. Frameworks are your steering wheel." | Bridge Week 1 (theory) to Week 2 (practice). "You now understand why AI behaves the way it does. This week, you learn to control it precisely." |
| 0:15-0:22 | 7 min | **Instruction: C -- Context.** Fill in the whiteboard. **Context** = the background information AI needs. "Without context, AI guesses. With context, AI targets." Example: "Write an email" (no context) vs "Write an email for a B2B SaaS company targeting HR managers in mid-sized Indian companies who are evaluating HR software for the first time" (rich context). Demo both in ChatGPT. Show the output difference. | The output difference should be dramatic. The no-context version will be generic. The context-rich version will be specific and useful. Ask: "Which one could you actually send to a client?" |
| 0:22-0:29 | 7 min | **Instruction: R -- Role.** **Role** = who should AI pretend to be? "The role determines the voice, expertise level, and perspective." Example roles: "Act as a senior marketing strategist with 15 years of B2B experience" vs "Act as a college intern" vs "Act as a CFO reviewing the marketing budget." Demo: same email task with 3 different roles. Show how output changes dramatically. | Participants often underestimate the power of role. The CFO role will produce an email focused on ROI and metrics. The intern role will be enthusiastic but shallow. The strategist role will be polished and strategic. Let participants see all 3 to appreciate the role effect. |
| 0:29-0:36 | 7 min | **Instruction: I -- Instructions.** **Instructions** = exactly what you want AI to do, step by step. "Vague instructions = vague output. Specific instructions = specific output." Example: "Write an email" (vague) vs "Write a 200-word cold outreach email. Start with a pain point question. Include one customer success stat. End with a soft CTA asking for a 15-minute call. Use short paragraphs." Demo both. | The instructions section is where most prompts fail. People say WHAT they want but not HOW they want it. The step-by-step specification is the upgrade. Walk through each instruction element and show how the output follows it precisely. |
| 0:36-0:40 | 4 min | **Instruction: S -- Specifics.** **Specifics** = concrete details, constraints, and requirements. Product name, audience name, word count, tone, format, things to include, things to avoid. "Specifics eliminate ambiguity." Show how adding "Tone: professional but warm. Avoid: jargon, buzzwords. Include: the phrase 'transform your HR process'." changes the output. | Specifics are the fine-tuning knobs. They are where the difference between a good prompt and a great prompt lives. Quick demo showing one prompt with and without specifics. |
| 0:40-0:45 | 5 min | **Instruction: P -- Parameters.** **Parameters** = output format and technical settings. "Format: bullet points / paragraph / table / JSON. Length: 100 words / 500 words / 3 paragraphs. Style: formal / casual / academic. Language: English / Hindi / bilingual." Show how the same content changes when you specify "format as a numbered list" vs "format as a persuasive paragraph." | Parameters are the delivery instructions. Content might be the same, but presentation changes everything. Quick live demo. Distribute the CRISP Reference handout now. |
| 0:45-1:00 | 15 min | **Guided Practice: CRISP Exercises 1-5.** Using the exercise pack, participants write CRISP prompts for 5 scenarios: (1) Write a job posting for a data analyst (2) Create a social media content calendar (3) Draft a customer complaint response (4) Write a school newsletter article (5) Create a product comparison table. For each: identify all 5 CRISP elements, write the full prompt, test in ChatGPT, rate the output. | Walk the room actively. The most common mistake: skipping the Role element or making Instructions too vague. Push participants: "Your Instructions say 'write a good email.' What does 'good' mean? Be specific. How many words? What structure? What tone?" |
| 1:00-1:15 | 15 min | **Guided Practice: CRISP Exercises 6-10.** Continue with 5 more challenging scenarios: (6) Write a funding proposal for an NGO (7) Create a training curriculum outline (8) Draft a legal disclaimer (9) Write a real estate listing description (10) Create a restaurant menu description. These are deliberately harder to force deeper CRISP thinking. Participants work in pairs for these. | Pair participants from different professional backgrounds -- a business owner paired with a content creator produces richer discussions. Walk around and check that both partners are contributing. |
| 1:15-1:20 | 5 min | **Break.** | Quick break. |
| 1:20-1:40 | 20 min | **Independent Practice: CRISP for YOUR Work.** Participants identify 3 real tasks from their own work/business that they currently use AI for. They rewrite each prompt using the CRISP framework. They test the old prompt vs the CRISP prompt side by side. They document: old prompt, CRISP prompt, old output, CRISP output, improvement notes. | This is the highest-value activity. Participants improve the prompts they actually use daily. The side-by-side comparison is always dramatic. Encourage participants to share "before/after" with the class during wrap-up. |
| 1:40-1:55 | 15 min | **Independent Practice: Transform the Warm-Up Prompt.** Return to the warm-up prompt: "Write a marketing email for my product." Each participant writes a full CRISP version. They test it and rate the output. "Remember when you rated this prompt 3/10? What do you rate your CRISP version?" Most will say 8-9/10. | Full circle moment. The transformation from a 3/10 prompt to an 8-9/10 prompt using CRISP is the core lesson of the session. Have 2-3 participants share their CRISP versions with the class. |
| 1:55-2:00 | 5 min | **Wrap-Up: CRISP Commitment.** "From today, every prompt you write should be CRISP. It takes 30 extra seconds to add Context, Role, Instructions, Specifics, and Parameters. Those 30 seconds save you 10 minutes of back-and-forth with AI." Preview Session 6: "Tomorrow: chain-of-thought and tree-of-thought prompting. We teach AI to REASON step by step. This is how you solve logic puzzles, math problems, and complex analysis with AI." | End with the time-saving pitch. Professionals respond to efficiency arguments. The CRISP investment of 30 seconds saving 10 minutes is compelling. |

### Homework / Take-Home Challenge
Rewrite 5 of your most-used prompts using the CRISP framework. Test each one. Document the before/after comparison in your portfolio. Target: every prompt should score 8/10 or higher.

---

## Session 6: Chain-of-Thought & Tree-of-Thought Prompting

**Date:** Week 2, Day 2
**Duration:** 120 minutes
**Topic:** Teaching AI to Reason -- Step-by-Step and Branch-by-Branch
**Learning Objectives:**
1. Apply chain-of-thought (CoT) prompting to improve AI reasoning
2. Understand when and why CoT dramatically improves outputs
3. Use tree-of-thought (ToT) prompting for complex multi-path problems
4. Solve logic puzzles, math problems, and analysis tasks using CoT/ToT

### Materials Needed
- Projector with internet access
- Participant laptops with ChatGPT and Claude open
- Whiteboard and markers
- Handout: "10 Logic Puzzles for CoT Practice" (print 1 per participant)
- Handout: "CoT/ToT Quick Reference" (print 1 per participant)

### Pre-Session Setup (Trainer)
- Prepare 3 math/logic problems that AI gets WRONG without CoT but RIGHT with CoT
- Prepare 2 complex analysis scenarios for ToT
- Print all handouts
- Draw a chain (linear) and a tree (branching) on the whiteboard for visual reference

### Minute-by-Minute Session Plan

| Time | Duration | Activity | Trainer Notes |
|---|---|---|---|
| 0:00-0:05 | 5 min | **Warm-Up: "AI Fails at Math."** Pose a tricky math/logic problem to ChatGPT with a simple prompt (no CoT). Show the wrong answer. "Even GPT-4o gets this wrong. But watch what happens when we add 4 words..." Add "Think step by step" to the prompt. Show the correct answer. "Those 4 words changed everything. Today we learn why." | The "think step by step" magic is one of the most impactful AI discoveries. The before/after is dramatic. Use a problem like: "If a shirt costs $20 after a 25% discount, what was the original price?" Without CoT, AI sometimes gets this wrong. With CoT, it reasons through and gets $26.67. |
| 0:05-0:15 | 10 min | **Recap Session 5.** Quick CRISP check: "Name the 5 elements of CRISP." Then: "Show me a CRISP prompt from your homework." 2 participants share. Quick feedback. Transition: "CRISP gives structure to your prompts. Today, CoT and ToT give structure to AI's THINKING." | Frame CoT/ToT as complementary to CRISP: CRISP structures the input; CoT structures the processing. Together, they are extremely powerful. |
| 0:15-0:25 | 10 min | **Instruction: Chain-of-Thought Explained.** Draw a chain on the whiteboard: Step 1 -> Step 2 -> Step 3 -> Answer. Explain: "Normally, AI jumps from question to answer in one leap. CoT forces it to show its work, step by step. Like showing your work in math class, each step checks the previous one." Three levels of CoT: (1) **Zero-shot CoT:** Just add "Think step by step" or "Let's work through this systematically" (2) **Manual CoT:** You provide the reasoning steps in your prompt: "First, identify X. Then, calculate Y. Then, compare Z." (3) **Structured CoT:** You provide a worked example with reasoning, then ask the model to follow the same pattern. | The three levels represent increasing control and reliability. Most participants will start using zero-shot CoT immediately because it is so easy. Manual and structured CoT are for when zero-shot is not enough. |
| 0:25-0:35 | 10 min | **Instruction: When CoT Matters Most.** CoT dramatically improves: (1) Math and calculations (2) Logic puzzles and riddles (3) Multi-step analysis (4) Decision-making with trade-offs (5) Code debugging (6) Legal/policy reasoning. CoT barely matters for: (1) Simple factual recall (2) Translation (3) Summarization (4) Creative writing. Demo: same analysis task with and without CoT. The CoT version catches nuances that the direct version misses. | The "when it matters" distinction prevents participants from over-applying CoT. You do not need "think step by step" for "What is the capital of France?" But you absolutely need it for "Should we expand our business to Chandigarh or Ludhiana? Consider population, competition, and logistics." |
| 0:35-0:40 | 5 min | **Instruction: Tree-of-Thought.** Draw a tree on the whiteboard: one root, 3 branches, each branch splits into 2 more. Explain: "CoT is linear -- one path of reasoning. ToT explores MULTIPLE paths simultaneously, then picks the best one." Prompt template: "Consider 3 different approaches to this problem. For each approach, reason through 3 steps. Evaluate which approach is most promising. Then develop that approach fully." | ToT is more advanced and resource-intensive. It is best for: strategic decisions, creative problem-solving, and complex analysis where the "right approach" is not obvious. Give a quick example: "Should I build a mobile app or a web app for my business? Consider: cost, speed, reach. Explore both paths before recommending." |
| 0:40-1:00 | 20 min | **Guided Practice: Logic Puzzle Gauntlet.** Using the handout, participants work through 5 logic puzzles. For each: (1) Ask AI to solve it WITHOUT CoT (2) Ask AI to solve it WITH zero-shot CoT ("Think step by step") (3) If still wrong, try manual CoT (provide the reasoning structure). Document: which puzzles needed CoT? Which level of CoT was required? | Walk around checking work. Common puzzles that benefit from CoT: the farmer-fox-chicken-grain river crossing, age-based logic problems, percentage calculations with multiple steps. The comparison between "no CoT" (often wrong) and "with CoT" (usually correct) builds conviction. |
| 1:00-1:15 | 15 min | **Guided Practice: CoT for Real Analysis.** Give participants a complex scenario: "A restaurant in Amritsar is deciding whether to open a second location in Chandigarh or Ludhiana. Monthly rent in Chandigarh is INR 1.5 lakh, Ludhiana is INR 80,000. Chandigarh has 20% more foot traffic but 30% more competition. Ludhiana has a growing food scene but fewer affluent customers. Current restaurant revenue is INR 8 lakh/month." Participants prompt AI to analyze this using CoT, then using ToT (explore both cities as separate branches). Compare the outputs. | This scenario is realistic for Punjab participants. The CoT version will give a linear analysis. The ToT version will explicitly explore both options and compare them. The ToT output is almost always more thorough and nuanced. |
| 1:15-1:20 | 5 min | **Break.** | Quick break. |
| 1:20-1:40 | 20 min | **Independent Practice: CoT in Your Domain.** Participants identify 3 complex tasks from their own work that involve reasoning, analysis, or decision-making. They write CoT prompts for each. They test: does CoT improve the output? By how much? They document the before/after with analysis in their portfolio. | Personal application is key. A business owner might use CoT for financial projections. A content creator might use it for editorial decision-making. A freelancer might use it for project planning. Help participants identify the right tasks for CoT. |
| 1:40-1:55 | 15 min | **Independent Practice: ToT Challenge.** Participants tackle one complex problem using the full ToT approach: "Consider 3 different approaches. For each, reason through the implications. Evaluate all 3. Select the best approach and develop it fully." They pick a real problem: business decision, career choice, or project strategy. Document the full ToT output and analysis. | ToT produces longer, more detailed outputs. Some participants may be surprised by how thorough the analysis becomes. The key learning: ToT forces AI to consider alternatives it would otherwise ignore. |
| 1:55-2:00 | 5 min | **Wrap-Up: The Reasoning Upgrade.** "CoT and ToT are not just prompting tricks -- they fundamentally change how AI processes your request. You are not just getting answers anymore; you are getting REASONING. And reasoning is where the real value is." Preview Session 7: "Tomorrow: few-shot and zero-shot prompting. You teach AI by SHOWING it examples. This is how you get consistent, formatted, high-quality outputs every single time." | End with the value proposition: reasoning > answers. This mindset shift is what separates advanced prompt engineers from casual users. |

### Homework / Take-Home Challenge
Find 3 problems where AI gives a wrong or weak answer. Apply CoT to fix each one. Document the before/after in your portfolio. Bonus: try ToT on at least one of them.

---

## Session 7: Few-Shot & Zero-Shot Prompting

**Date:** Week 2, Day 3
**Duration:** 120 minutes
**Topic:** Teaching AI by Example -- Classification, Extraction, and Formatting
**Learning Objectives:**
1. Distinguish between zero-shot, one-shot, and few-shot prompting
2. Create effective few-shot examples for classification tasks
3. Use few-shot prompting for data extraction and formatting
4. Determine the optimal number of examples for different tasks

### Materials Needed
- Projector with internet access
- Participant laptops with ChatGPT and Claude open
- Whiteboard and markers
- Handout: "Few-Shot Template Pack" (print 1 per participant)
- Handout: "Classification/Extraction Exercise Set" (print 1 per participant)
- Sample datasets for classification exercises (10-15 items per set)

### Pre-Session Setup (Trainer)
- Prepare 3 classification datasets (sentiment analysis, email categorization, lead scoring)
- Prepare 2 extraction tasks (resume parsing, invoice data extraction)
- Prepare 2 formatting tasks (unstructured text to structured table)
- Print all handouts

### Minute-by-Minute Session Plan

| Time | Duration | Activity | Trainer Notes |
|---|---|---|---|
| 0:00-0:05 | 5 min | **Warm-Up: "Teach Me Without Words."** Show 3 examples of something (e.g., 3 positive movie reviews labeled "POSITIVE") and then an unlabeled review. Ask the class: "Is this positive or negative?" They get it instantly because they saw the pattern. "Congratulations, you just did few-shot learning. AI works the same way." | The human parallel makes few-shot learning intuitive. We learn by example constantly. AI does the same thing, just with explicit examples in the prompt. |
| 0:05-0:15 | 10 min | **Recap Session 6.** Quick CoT check: "When should you use chain-of-thought prompting?" Ask 2 participants to share their homework CoT improvements. Brief discussion. Transition: "CoT teaches AI HOW to think. Few-shot teaches AI WHAT pattern to follow. Both are essential." | Frame the relationship: CRISP (structure), CoT (reasoning), few-shot (pattern matching). These are complementary tools in the prompt engineer's toolkit. |
| 0:15-0:22 | 7 min | **Instruction: Zero-Shot vs Few-Shot.** Define clearly: (1) **Zero-shot:** No examples given. "Classify this email as spam or not spam: [email]" -- AI uses its training knowledge. (2) **One-shot:** One example given. "Example: 'Buy now, limited offer!' = Spam. Now classify: [email]" (3) **Few-shot:** 3-5 examples given. Demo: same classification task with 0, 1, and 5 examples. Show accuracy improving with each. | The live demo should show a measurable accuracy improvement. Use a tricky classification task where zero-shot gets some wrong but few-shot gets all right. Sentiment analysis with sarcasm is a good choice: "Oh great, another Monday" -- zero-shot might miss the sarcasm, few-shot catches it. |
| 0:22-0:32 | 10 min | **Instruction: Anatomy of Good Examples.** Teach what makes few-shot examples effective: (1) **Representative:** Examples cover the range of possible inputs (2) **Diverse:** Include edge cases, not just easy cases (3) **Consistent format:** All examples follow the exact same structure (4) **Correct:** Wrong examples teach wrong patterns (5) **Minimal but sufficient:** Usually 3-5 examples are enough; more than 7 rarely helps. Demo: bad examples (all too similar) vs good examples (diverse, edge-case-inclusive). | The "bad examples" demo is important. Show: if all 3 examples are clearly positive sentiment, the model struggles with neutral or sarcastic inputs. If examples include positive, negative, AND edge cases (sarcasm, mixed sentiment), the model handles new inputs much better. |
| 0:32-0:40 | 8 min | **Instruction: Few-Shot for Extraction and Formatting.** Show how few-shot is powerful beyond classification. (1) **Data extraction:** "Given this invoice, extract: Company Name, Amount, Date, Invoice Number. Example 1: [invoice text] -> Company: ABC Corp, Amount: INR 50,000, Date: 12-Jan-2026, Invoice: INV-001." Give 2 examples, then a new invoice. (2) **Format conversion:** "Convert this unstructured text into a table. Example: [text] -> [table]." Give 2 examples, then new text. | These are HIGH-VALUE professional skills. Invoice extraction, resume parsing, and data formatting are tasks that businesses pay for. Participants who run businesses will immediately see the ROI. |
| 0:40-1:00 | 20 min | **Guided Practice: Classification Lab.** Distribute the exercise set. Participants work through 3 classification tasks: (1) **Sentiment analysis:** Classify 10 customer reviews as Positive, Negative, or Neutral. First try zero-shot, then create 3-5 examples and try few-shot. Compare accuracy. (2) **Email categorization:** Classify 10 emails as Inquiry, Complaint, Order, or Spam. Same process. (3) **Lead scoring:** Classify 10 sales leads as Hot, Warm, or Cold based on descriptions. Same process. | Walk around checking accuracy. The key metric: how many did zero-shot get wrong that few-shot got right? Participants should track this explicitly. Most will see a 20-40% accuracy improvement from zero-shot to few-shot on ambiguous tasks. |
| 1:00-1:15 | 15 min | **Guided Practice: Extraction Lab.** Participants work through 2 extraction tasks: (1) **Resume parsing:** Given 5 resumes in text form, extract: Name, Email, Experience (years), Skills, Education. Create 2 few-shot examples first, then extract from 3 new resumes. (2) **Product review extraction:** Given 5 product reviews, extract: Product Name, Rating (1-5), Key Praise, Key Complaint, Would Recommend (Yes/No). | These tasks are immediately useful for HR professionals, business owners, and e-commerce operators. The few-shot approach produces remarkably consistent, structured output from messy unstructured text. |
| 1:15-1:20 | 5 min | **Break.** | Quick break. |
| 1:20-1:40 | 20 min | **Independent Practice: Few-Shot for Your Work.** Participants identify 2 tasks from their own work that involve classification, extraction, or formatting. They create few-shot prompts with 3-5 examples each. They test on real data from their work. They document: task, examples created, results, accuracy assessment. | This is the most valuable exercise. A recruiter creates a resume extraction few-shot. A marketer creates a sentiment analysis few-shot. A finance person creates an invoice extraction few-shot. Each participant leaves with a production-ready few-shot prompt for their actual work. |
| 1:40-1:50 | 10 min | **Independent Practice: Optimal Example Count.** For one of their tasks, participants test with 1, 3, 5, and 7 examples. They measure: at what point do more examples stop improving accuracy? Document the "sweet spot" for their task. | Most participants will find that 3-5 examples is the sweet spot. Beyond 5, improvements are marginal and token cost increases. This practical knowledge saves time and money. |
| 1:50-1:55 | 5 min | **Independent Practice: Portfolio Entry.** Add all few-shot prompts, classification results, and accuracy data to the portfolio. | Quick documentation. |
| 1:55-2:00 | 5 min | **Wrap-Up: The Power of Examples.** "Few-shot prompting turns AI into a consistent, reliable tool for structured tasks. Classification, extraction, formatting -- these are the bread and butter of business AI use. With 3-5 good examples, you can automate tasks that used to take hours." Preview Session 8: "Tomorrow: system prompts and custom instructions. We build AI personas that behave consistently across entire conversations. This is how you build products, not just prompts." | Emphasize the business value. The shift from "individual prompts" to "reusable prompt templates" is what makes AI a business tool rather than a toy. |

### Homework / Take-Home Challenge
Create 3 production-ready few-shot prompts for tasks in your work. Each must have 3-5 examples. Test each on at least 5 new inputs. Document accuracy. Add to your portfolio.

---

## Session 8: System Prompts & Custom Instructions

**Date:** Week 2, Day 4
**Duration:** 120 minutes
**Topic:** Building AI Personas -- System Prompts, Custom Instructions, and Behavior Control
**Learning Objectives:**
1. Write effective system prompts that define AI persona and behavior
2. Use ChatGPT Custom Instructions and Claude Projects for persistent behavior
3. Test and debug AI persona consistency under stress
4. Build 3 distinct AI personas for different professional use cases

### Materials Needed
- Projector with internet access
- Participant laptops with ChatGPT and Claude open
- Whiteboard and markers
- Handout: "System Prompt Architecture Template" (print 1 per participant)
- Handout: "Persona Testing Checklist" (print 1 per participant)

### Pre-Session Setup (Trainer)
- Create 3 demo personas (business consultant, technical writer, creative director)
- Test system prompt behavior in both ChatGPT Custom Instructions and Claude
- Prepare 10 "stress test" questions to break personas
- Print all handouts

### Minute-by-Minute Session Plan

| Time | Duration | Activity | Trainer Notes |
|---|---|---|---|
| 0:00-0:05 | 5 min | **Warm-Up: "Dr. Jekyll and Mr. Hyde."** Show the same AI model responding to the same question with two wildly different personalities. One is a formal academic, the other is a casual comedian. Ask: "Same model, same question. What changed?" Answer: "The system prompt. The invisible instructions that tell AI WHO to be." | The personality contrast should be extreme and entertaining. Use a serious topic (e.g., "explain blockchain") and show the formal vs casual responses. Participants will laugh and immediately understand the power of system prompts. |
| 0:05-0:15 | 10 min | **Recap Session 7.** Quick few-shot check: "How many examples do you typically need for good classification?" Ask 2 participants to share their homework few-shot prompts and results. Transition: "Few-shot teaches AI what pattern to follow for one task. System prompts define WHO the AI is for ALL tasks in a conversation. It is the difference between a single instruction and a permanent identity." | Frame system prompts as the capstone of Week 2: CRISP (structure) + CoT (reasoning) + few-shot (pattern) + system prompt (identity). All four combined = professional-grade prompting. |
| 0:15-0:25 | 10 min | **Instruction: Anatomy of a System Prompt.** Teach the 6 components: (1) **Identity:** Who is this AI? Name, role, expertise. (2) **Behavior rules:** How should it communicate? Tone, style, length. (3) **Knowledge boundaries:** What does it know? What does it NOT know? (4) **Response format:** How should outputs be structured? (5) **Constraints:** What should it NEVER do? (6) **Escalation:** When should it ask for clarification or refuse to answer? Demo: build a "Senior Marketing Consultant" persona live on the whiteboard. | Write each component on the whiteboard as you explain. The "constraints" and "escalation" sections are what separate amateur system prompts from professional ones. Amateur: only defines identity. Professional: defines boundaries and failure modes. |
| 0:25-0:35 | 10 min | **Instruction: Where System Prompts Live.** Show: (1) **ChatGPT Custom Instructions:** Settings > Personalization > Custom Instructions. Two fields: "What would you like ChatGPT to know?" and "How would you like ChatGPT to respond?" (2) **Claude Projects:** Create a project with custom instructions that apply to all conversations within it. (3) **API system message:** For developers, the system prompt is the first message in the API call. Demo: set up a Custom Instruction in ChatGPT and show it affecting all responses. | Live walkthrough of both interfaces. Participants should follow along on their own laptops. Common mistake: people write system prompts but do not test them thoroughly. Emphasize: "A system prompt you have not stress-tested is a system prompt that WILL fail." |
| 0:35-0:45 | 10 min | **Instruction: Stress Testing Personas.** Demonstrate how to break a persona: (1) Ask it to do something outside its defined role (2) Ask it to break its tone rules (3) Give it conflicting instructions (4) Try to "jailbreak" by saying "ignore your instructions" (5) Ask about topics outside its knowledge boundaries. Show a poorly-written persona breaking on test 2. Show a well-written persona withstanding all 5 tests. | This is critical for anyone building customer-facing AI tools. A persona that breaks when a user asks something unexpected is unusable in production. The stress-testing mindset separates hobbyists from professionals. |
| 0:45-1:00 | 15 min | **Guided Practice: Build Persona 1.** Each participant builds their first persona using the System Prompt Architecture Template. Suggested: a persona related to their profession. Steps: (1) Fill out all 6 components on the template (2) Write the complete system prompt (3) Set it up in ChatGPT Custom Instructions OR Claude Projects (4) Have a 5-message conversation to test basic behavior. Trainer circulates. | Walk around helping with the template. Most common issue: identity is too vague ("You are a helpful assistant" -- too generic) or constraints are missing entirely. Push: "What should this persona NEVER do? What happens if someone asks something off-topic?" |
| 1:00-1:15 | 15 min | **Guided Practice: Stress Test and Iterate.** Using the Persona Testing Checklist, participants test their persona with 5 stress scenarios: (1) Off-topic question (2) Request to break character (3) Ambiguous request (4) Direct contradiction of persona rules (5) Request for something the persona should not know. For each failure, they update the system prompt and re-test. | The iteration cycle is: test > find failure > fix > re-test. This mirrors professional AI product development. Most participants will need 2-3 iterations to handle all 5 stress tests. |
| 1:15-1:20 | 5 min | **Break.** | Quick break. |
| 1:20-1:40 | 20 min | **Independent Practice: Build Personas 2 and 3.** Participants build 2 more personas for different use cases. Suggested combinations: (1) A client-facing persona (customer support, sales, consulting) (2) A personal productivity persona (writing assistant, research buddy, code reviewer) (3) A creative persona (content creator, brainstorming partner, editor). Each must pass all 5 stress tests. | Three personas with different purposes demonstrates versatility. Walk around checking that the personas are genuinely different, not variations of the same thing. The stress test requirement ensures quality. |
| 1:40-1:50 | 10 min | **Independent Practice: Persona Swap.** Participants share one persona with a partner. The partner tries to break it using creative stress tests the creator did not think of. They give feedback: what broke, what held, and suggestions for improvement. | Fresh eyes always find vulnerabilities. This peer testing is invaluable. Encourage creative "attacks" -- participants often enjoy trying to jailbreak each other's personas. Channel this into constructive feedback. |
| 1:50-1:55 | 5 min | **Independent Practice: Portfolio Documentation.** Add all 3 personas to the portfolio: full system prompt text, stress test results, iteration notes, and final version. | Quick documentation. |
| 1:55-2:00 | 5 min | **Wrap-Up: Week 2 Complete Framework Toolkit.** Recap on the whiteboard: CRISP (structure) + CoT/ToT (reasoning) + Few-Shot (pattern) + System Prompts (identity) = Professional Prompt Engineering. "You now have every framework a professional prompt engineer uses. Week 3 is about putting it ALL together for real-world applications." Preview Week 3: "Next week, we build actual AI workflows and products. Role-based pipelines, prompt chaining, Custom GPTs, Claude Projects, and a final project that could be a real business." | Draw the full framework ecosystem on the whiteboard. This visual shows how all the pieces connect. Participants should feel that their toolkit is complete and they are ready to apply it. |

### Homework / Take-Home Challenge
Set up your most useful persona as your default ChatGPT Custom Instruction. Use it for ALL interactions this week. Note: when does it help? When does it get in the way? Bring observations to Session 9.

---

## Week 2 Trainer Checklist

- [ ] All participants can write CRISP prompts fluently by end of Session 5
- [ ] All participants can apply CoT and ToT to reasoning tasks by end of Session 6
- [ ] All participants can create few-shot prompts for classification/extraction by end of Session 7
- [ ] All participants have 3 tested AI personas by end of Session 8
- [ ] Prompt portfolios growing with documented experiments and iterations
- [ ] Identify participants who are excelling (potential advanced project partners)
- [ ] Identify participants who need extra support for Week 3 application work
- [ ] Remind participants: Week 3 includes the final project -- start thinking about business problems to solve
