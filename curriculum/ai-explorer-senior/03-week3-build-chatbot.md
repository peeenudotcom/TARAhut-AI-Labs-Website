# Week 3: Build Your Own Chatbot

## Week Overview

**Theme:** Create, train, and deploy your own AI chatbot -- no coding required
**Sessions:** 4 (Sessions 9-12)
**Total Hours:** 8 hours
**Key Outcome:** Each student has a working chatbot they built, trained, and can share with others

---

## Session 9: Custom GPT Creation Intro

**Date:** Week 3, Day 1
**Duration:** 120 minutes
**Topic:** Introduction to OpenAI GPT Builder -- Your First Custom Bot
**Learning Objectives:**
1. Understand what a Custom GPT is and how it differs from regular ChatGPT
2. Navigate the OpenAI GPT Builder interface
3. Create a simple Custom GPT with a defined persona
4. Test and iterate on their first bot

### Materials Needed
- Projector with internet access
- Student laptops with ChatGPT Plus or free-tier GPT Builder access
- Whiteboard and markers
- Handout: "Custom GPT Blueprint" (print 1 per student)
- Handout: "Bot Persona Planning Sheet" (print 1 per student)

### Pre-Session Setup (Trainer)
- Verify GPT Builder access works on student accounts (free tier allows limited creation)
- Create 2-3 demo Custom GPTs to show students
- Prepare backup plan: if GPT Builder is not accessible, use Claude's "Projects" feature or character.ai as alternatives
- Print both handouts
- Write on whiteboard: "Today you become a BOT BUILDER"

### Minute-by-Minute Session Plan

| Time | Duration | Activity | Trainer Notes |
|---|---|---|---|
| 0:00-0:05 | 5 min | **Warm-Up: "Talk to My Bot."** Trainer shows a Custom GPT they pre-built (e.g., a "Friendly Science Tutor" bot). A volunteer student asks it questions. Class watches how it responds differently from regular ChatGPT -- it stays in character, gives subject-specific answers, and has personality. | This demo should WOW students. The bot should have a fun personality (maybe it speaks like a Bollywood character or uses cricket analogies). The goal is to make students think: "I want to build one of these!" |
| 0:05-0:15 | 10 min | **Recap Week 2.** Quick review: "What are the 4 parts of your AI study system?" Students list: plan, notes, questions, flashcards. Ask 2 students: "Have you been using the system? What is working?" Transition: "Your study system works great for YOU. But what if you could build a bot that helps ALL your classmates study? That is what we are building this week." | Bridge from personal tool use (Week 2) to building tools for others (Week 3). This shift from consumer to creator is a key mindset change. |
| 0:15-0:25 | 10 min | **Instruction: What Is a Custom GPT?** Explain simply: "A Custom GPT is like a regular ChatGPT, but with a specific personality, expertise, and set of instructions that you define. Think of it like creating a character in a video game -- you decide what it knows, how it talks, and what it does." Show 3 examples: (1) A math tutor bot (2) A recipe suggestion bot (3) A motivational coach bot. | Use the video game character analogy -- teens relate to this. Show the examples quickly (30 seconds each) so students see the range of possibilities. |
| 0:25-0:35 | 10 min | **Instruction: GPT Builder Walkthrough.** Open GPT Builder on the projector. Walk through each section: (1) Name and description (2) Instructions (the system prompt) (3) Conversation starters (4) Knowledge (upload files) (5) Capabilities (web browsing, code, image generation). Build a simple demo bot together: "Class 10 History Helper." | Go SLOWLY through the interface. Students will be seeing this for the first time. Point to each section and explain in plain language what it does. "Instructions is where you tell the bot WHO it is and HOW it should behave." |
| 0:35-0:40 | 5 min | **Live Demo: The System Prompt Is Everything.** Show how changing the system prompt dramatically changes the bot. Same "History Helper" but change instructions from "Be a friendly teacher" to "Be a strict examiner who only asks questions and never gives direct answers." Students interact with both versions. | This is the "aha" moment: the system prompt controls everything. Students realize that prompt engineering from Week 1 is directly applicable here. |
| 0:40-1:00 | 20 min | **Guided Practice: Plan Your Bot.** Using the "Bot Persona Planning Sheet," students plan their Custom GPT: (1) Bot name (2) What it does (one sentence) (3) Who it is for (4) Personality traits (friendly? strict? funny?) (5) 5 things it should know (6) 5 things it should NOT do (7) 3 conversation starters. Trainer circulates and helps with ideas. | Encourage creative and practical ideas. Good bot ideas for teens: study buddy for a specific subject, homework helper with explanations, quiz master that tests you, career advisor, debate practice partner. Discourage: bots that write entire essays (academic dishonesty discussion). |
| 1:00-1:15 | 15 min | **Guided Practice: Build Your First Bot.** Students open GPT Builder and start creating. They enter: name, description, and instructions (system prompt). They DO NOT need to add knowledge files yet (that is Session 10). Just get the basic bot working and conversational. Trainer helps students who are stuck. | Most students will get stuck on writing the system prompt. Help them translate their planning sheet into clear instructions. Example: "You are [name], a [personality] tutor for Class [X] [subject]. You always [behavior 1]. You never [behavior 2]. When asked a question, you [approach]." |
| 1:15-1:20 | 5 min | **Break.** | Students will want to keep building -- gently insist on a screen break. |
| 1:20-1:45 | 25 min | **Independent Practice: Test and Iterate.** Students test their bots by having a conversation with them. They identify problems: "It does not stay in character," "It gives wrong information," "It is too formal." For each problem, they adjust the system prompt and test again. Goal: 3 rounds of testing and improvement. | Walk around and have conversations WITH students' bots. Give feedback: "Your bot broke character when I asked about cricket. Add an instruction: 'Always bring the conversation back to [subject].'" This real-time feedback loop is invaluable. |
| 1:45-1:55 | 10 min | **Independent Practice: Peer Testing.** Students swap laptops/share links and test each other's bots. Each tester must: (1) Try to break the bot (ask off-topic questions) (2) Rate the bot on a 1-5 scale for helpfulness, personality, accuracy (3) Give 2 improvement suggestions. | Peer testing is fun and reveals issues the creator did not notice. Teens are great at trying to "break" things -- harness this destructive energy constructively. |
| 1:55-2:00 | 5 min | **Wrap-Up: Bot Showcase Teaser.** Ask 2-3 students to demo their bots (30 seconds each). Celebrate creativity. Preview Session 10: "Tomorrow, we make your bot SMART. We upload your school notes, textbook content, and specific knowledge so your bot becomes a true expert." | Pick diverse examples: one academic bot, one creative bot, one practical bot. Students should see the range of possibilities. |

### Homework / Take-Home Challenge
Prepare content to upload to your bot tomorrow: type out or photograph key notes from your best subject. At least 2 pages of content. This will become your bot's "knowledge."

---

## Session 10: Training Your Chatbot with School Knowledge

**Date:** Week 3, Day 2
**Duration:** 120 minutes
**Topic:** Uploading Knowledge and Making Your Bot a Subject Expert
**Learning Objectives:**
1. Upload documents and notes to train a Custom GPT
2. Write effective instructions for knowledge-based responses
3. Test knowledge retrieval accuracy
4. Create a "study buddy" bot that knows their specific syllabus

### Materials Needed
- Projector with internet access
- Student laptops with GPT Builder access
- Students MUST bring: typed notes, textbook photos, or digital study materials
- Whiteboard and markers
- Handout: "Knowledge Upload Checklist" (print 1 per student)

### Pre-Session Setup (Trainer)
- Prepare a demo file (typed notes for a chapter, 2-3 pages in .txt or .pdf)
- Test the knowledge upload feature in GPT Builder
- Prepare backup: if file upload is not available on free tier, teach the "paste knowledge into instructions" method
- Print checklists

### Minute-by-Minute Session Plan

| Time | Duration | Activity | Trainer Notes |
|---|---|---|---|
| 0:00-0:05 | 5 min | **Warm-Up: "Bot vs Textbook."** Ask the demo bot from yesterday a specific textbook question. It gives a generic answer. Then show the SAME bot after uploading textbook notes -- it gives a specific, accurate answer with page references. "See the difference? Knowledge changes everything." | The before/after contrast is powerful. Use a specific factual question where the generic answer is clearly inferior to the knowledge-enhanced answer. |
| 0:05-0:15 | 10 min | **Recap Session 9.** Quick check: "How many of you have a working bot from yesterday?" Troubleshoot any issues. Ask 2 students: "What did you prepare for today's upload?" Ensure everyone has content ready. For students who forgot homework, have pre-typed sample notes available. | Have backup content files ready (2-3 chapters across different subjects) for students who did not prepare content. Do not let anyone fall behind. |
| 0:15-0:25 | 10 min | **Instruction: How Knowledge Upload Works.** Explain: "When you upload a file to your GPT, it can read and reference that file when answering questions. It is like giving your bot a textbook." Demo the process: (1) Open GPT Builder > Configure > Knowledge (2) Upload a .txt or .pdf file (3) In Instructions, add: "When answering questions, always reference the uploaded knowledge files first." | Explain file format requirements: .txt, .pdf, .docx work best. Images of textbook pages do NOT work directly -- they need to be typed out or OCR'd. If students have only photos, teach them to use ChatGPT to transcribe: "Type out the text from this image." |
| 0:25-0:35 | 10 min | **Instruction: Writing Knowledge-Aware Instructions.** Show how to modify the system prompt to USE the uploaded knowledge. Key additions: "Always cite which section of the notes your answer comes from," "If the answer is not in the uploaded notes, say 'This topic is not in my current notes' instead of guessing," "When explaining a concept, use examples from the uploaded material." | The "do not guess" instruction is critical. Without it, the bot will hallucinate when asked questions outside the uploaded content. Teaching students to handle this builds their understanding of AI limitations. |
| 0:35-0:40 | 5 min | **Live Demo: The Complete Study Buddy.** Show a fully configured study buddy bot: uploaded Class 10 Science Chapter 1 notes, proper instructions, and conversation starters like "Quiz me on Chapter 1," "Explain a concept from Chapter 1," "What are the key formulas?" Interact with it live. | Students should see the "finished product" before building their own. This sets the quality bar. Show at least 3 types of interactions: explanation, quiz, and clarification. |
| 0:40-1:00 | 20 min | **Guided Practice: Upload and Configure.** Students upload their prepared content to their Custom GPTs. Steps: (1) Format content as .txt if needed (2) Upload to Knowledge section (3) Update Instructions to reference the knowledge (4) Add 3 conversation starters related to the uploaded content (5) Test with 5 questions. Trainer circulates helping with technical issues. | This is the most technical part of the course. Expect issues: file format errors, upload size limits, content not being referenced. Help individually. For students on free tier without upload access, teach the alternative: paste key content directly into the Instructions field (up to the character limit). |
| 1:00-1:15 | 15 min | **Guided Practice: Quality Testing.** Students test their knowledge-equipped bots with 3 types of questions: (1) A question the bot SHOULD be able to answer from uploaded notes (2) A question that PARTIALLY relates to the notes (3) A question completely OUTSIDE the notes. They check if the bot handles all 3 correctly. | Walk around checking responses. Common issue: bot answers question type 3 with hallucinated content instead of saying "not in my notes." Help students add stronger guardrails to their instructions. |
| 1:15-1:20 | 5 min | **Break.** | Quick screen break. |
| 1:20-1:40 | 20 min | **Independent Practice: Multi-Subject Bot.** Students enhance their bot by uploading content for at least 2 subjects/chapters. They update the instructions to handle multiple subjects: "You are a study buddy for Class [X]. You have knowledge of [Subject 1] Chapter [X] and [Subject 2] Chapter [Y]. When asked a question, identify which subject it relates to before answering." | More content makes the bot more useful. Students with lots of prepared content will shine. Help students who have limited content by providing pre-typed notes. |
| 1:40-1:50 | 10 min | **Independent Practice: Bot Personality Polish.** Students fine-tune their bot's personality. They add: (1) A greeting message style (2) Encouraging phrases for when students get quiz answers right (3) Supportive phrases for wrong answers (4) A "study tip of the day" feature. | This is about UX design thinking. A bot that says "Great job!" when you answer correctly is better than one that just says "Correct." Students learn that personality matters in product design. |
| 1:50-1:55 | 5 min | **Independent Practice: Documentation.** Students write a 1-paragraph description of their bot for their portfolio: What it does, what knowledge it has, who it is for, and what makes it special. | This documentation practice prepares them for the final showcase presentation. |
| 1:55-2:00 | 5 min | **Wrap-Up: Progress Check.** Quick show-and-tell: 2-3 students demo their knowledge-enhanced bots. Compare with yesterday's basic bots. "See how much smarter your bot got in one session?" Preview Session 11: "Tomorrow, we explore real-world chatbots and start building something that could actually be used by your school." | End with excitement about real-world applications. Tease: "What if your school had a chatbot that could answer any question about admissions, fee payments, or exam schedules?" |

### Homework / Take-Home Challenge
Upload at least 1 more chapter's worth of notes to your bot. Test your bot by having a "study session" with it -- ask it 10 questions and check if the answers are accurate.

---

## Session 11: Real-World Chatbot Use Cases

**Date:** Week 3, Day 3
**Duration:** 120 minutes
**Topic:** Chatbots in the Real World -- From School Reception to Customer Service
**Learning Objectives:**
1. Identify 5+ real-world applications of chatbots
2. Analyze what makes a chatbot useful vs annoying
3. Design a chatbot for a real-world scenario (school, business, community)
4. Understand chatbot design principles: clarity, helpfulness, boundaries

### Materials Needed
- Projector with internet access
- Student laptops with ChatGPT/GPT Builder access
- Whiteboard and markers
- Handout: "Chatbot Design Canvas" (print 2 per student)
- Examples of real chatbots bookmarked (school websites, e-commerce, banking)

### Pre-Session Setup (Trainer)
- Bookmark 5-6 real chatbots to demo (Flipkart customer service, SBI bot, a school website bot, Zomato bot, etc.)
- Prepare the "Chatbot Design Canvas" handout
- Create a demo "School Reception Bot" to show
- Write on whiteboard: "A good chatbot SAVES time. A bad chatbot WASTES time."

### Minute-by-Minute Session Plan

| Time | Duration | Activity | Trainer Notes |
|---|---|---|---|
| 0:00-0:05 | 5 min | **Warm-Up: "Rate the Bot."** Show a terrible chatbot experience on screen (screenshot of a frustrating customer service bot that goes in circles). Then show a great chatbot experience. Students vote: what makes one terrible and the other great? List responses on the whiteboard. | Use real Indian examples: "Have you ever used the IRCTC chatbot? The Flipkart chatbot?" Students will have strong opinions. The terrible example should be genuinely frustrating for maximum impact. |
| 0:05-0:15 | 10 min | **Recap Session 10.** Ask 2 students: "How was your study session with your bot last night? Was it helpful?" Address any issues. Quick quiz: "What is the most important part of a Custom GPT? (Answer: the system prompt/instructions)." | Reinforce that everything they learned about prompt engineering in Week 1 is what makes their bot good or bad. The system prompt IS prompt engineering applied to bot design. |
| 0:15-0:25 | 10 min | **Instruction: Real-World Chatbot Tour.** Show 5 live chatbots (bookmarked earlier). For each: (1) What it does (2) Who uses it (3) What it does well (4) What it does poorly. Cover: e-commerce bot (Flipkart/Amazon), banking bot (SBI/HDFC), food delivery (Zomato), school/university website bot, government service bot. | Interact with each bot live so students see real behavior. Keep each demo to 2 minutes max. Ask students to spot patterns: "What do all the good bots have in common?" |
| 0:25-0:35 | 10 min | **Instruction: Chatbot Design Principles.** Teach 5 principles: (1) Clear purpose -- bot should explain what it can do upfront (2) Quick answers -- no one wants a chatty bot (3) Fallback handling -- what happens when the bot does not know? (4) Personality match -- a bank bot should not be funny, a kids' bot should not be boring (5) Easy escalation -- "talk to a human" option. | Write all 5 principles on the whiteboard. Students will reference these when building their real-world bot. Relate back to the warm-up: "The terrible bot violated principles 1, 3, and 5. The great bot followed all 5." |
| 0:35-0:40 | 5 min | **Live Demo: School Reception Bot.** Show the pre-built school reception bot. It answers: school timings, fee structure, admission process, contact information, holidays. It politely declines unrelated questions. Ask students to try to stump it. | Let students shout questions to try. When it handles questions well, point to which design principle it follows. When it fails, discuss why and how to fix it. |
| 0:40-1:00 | 20 min | **Guided Practice: Design Your Real-World Bot.** Using the "Chatbot Design Canvas," students design a bot for a real scenario. Suggested scenarios: (1) School reception/FAQ bot (2) Local shop customer service bot (3) Event information bot (for a school function) (4) Sports team stats bot (5) Library book recommendation bot (6) Student's own idea. They complete: purpose, audience, 10 questions it must answer, personality, fallback behavior. | Let students choose their scenario. Some will want to build for their actual school -- encourage this! The canvas forces them to think before building. Check that "10 questions it must answer" are specific and realistic. |
| 1:00-1:15 | 15 min | **Guided Practice: Build the Real-World Bot.** Students start building their real-world bot in GPT Builder. Using their canvas, they write: system prompt, upload relevant content (they can create content from scratch or ask ChatGPT to generate realistic FAQ content), and set conversation starters. | For content creation shortcut: students can prompt ChatGPT to generate realistic FAQ content. Example: "Generate 20 frequently asked questions and answers for a school reception desk in Punjab, India. Include questions about fees, timings, admissions, transport, and uniforms." |
| 1:15-1:20 | 5 min | **Break.** | Quick break. Students are usually deeply focused at this point -- respect their flow but insist on a screen break. |
| 1:20-1:45 | 25 min | **Independent Practice: Complete and Polish.** Students complete their real-world bot. Checklist: (1) System prompt covers all 5 design principles (2) At least 10 questions answered correctly (3) Fallback handling works ("I do not know, please contact the school office at...") (4) Personality is appropriate for the audience (5) 3 relevant conversation starters. Test all 10 questions. | Walk around checking completeness. Push students beyond "it works" to "it works WELL." Ask: "What happens if someone asks in Hindi? Does your bot handle that?" Encourage adding bilingual capability for Punjab context. |
| 1:45-1:55 | 10 min | **Independent Practice: Peer Review Round 2.** Students pair up with someone who built a DIFFERENT type of bot. They test each other's bots using a structured checklist: purpose clear? answers accurate? personality appropriate? fallback works? easy to use? They give written feedback on the back of the design canvas. | Pair students with different bot types for diversity. The written feedback is important -- students take feedback more seriously when it is written down. |
| 1:55-2:00 | 5 min | **Wrap-Up: Real World Impact.** Share 2-3 standout bots with the class. Discuss: "Could any of these bots actually be used by a real school or business?" This plants the seed for entrepreneurial thinking. Preview Session 12: "Tomorrow, you share your bots with classmates and we do final testing. The best bots will be showcased to parents on Showcase Day in Week 4." | Build excitement for the showcase. The stakes are rising: parents will see their work. This motivates higher quality. |

### Homework / Take-Home Challenge
Share your study buddy bot with one friend or family member. Ask them to test it and give you feedback. Bring the feedback to class tomorrow.

---

## Session 12: Sharing Your Bot with Classmates and Testing

**Date:** Week 3, Day 4
**Duration:** 120 minutes
**Topic:** Quality Assurance, Sharing, and Bot Marketplace Showcase
**Learning Objectives:**
1. Share Custom GPTs with others using shareable links
2. Conduct structured QA testing on their bots
3. Give and receive constructive feedback on AI products
4. Prepare bots for the Week 4 showcase

### Materials Needed
- Projector with internet access
- Student laptops with GPT Builder access
- Whiteboard and markers
- Handout: "QA Testing Scorecard" (print 3 per student -- they test 3 bots)
- Handout: "Showcase Preparation Checklist" (print 1 per student)
- Sticky notes for feedback

### Pre-Session Setup (Trainer)
- Print all handouts
- Set up a shared document or whiteboard section for "Bot Marketplace" (list of all bots with links)
- Prepare the QA scorecard
- Have presentation template ready for Week 4 showcase prep

### Minute-by-Minute Session Plan

| Time | Duration | Activity | Trainer Notes |
|---|---|---|---|
| 0:00-0:05 | 5 min | **Warm-Up: "Customer Review."** Ask 3 students about their homework: "What did your friend/family member say about your bot? What was the best feedback? What was the most critical?" Celebrate honest feedback: "Criticism is a gift -- it makes your bot better." | Students who got positive feedback will be proud. Students who got critical feedback need encouragement: "The best product designers in the world get criticism every day. It is how they improve." |
| 0:05-0:15 | 10 min | **Recap Week 3 Journey.** Walk through the whiteboard: Session 9 (created basic bot) > Session 10 (added knowledge) > Session 11 (designed real-world bot) > Session 12 (today: test, share, prepare). "In 3 sessions you went from zero to bot builder. Today we polish and prepare for showtime." | Draw the journey visually. Students should feel the progression. Some may not realize how much they have accomplished until you spell it out. |
| 0:15-0:20 | 5 min | **Instruction: How to Share Your GPT.** Demo: (1) Open your GPT in GPT Builder (2) Click Share (3) Choose "Anyone with the link" (4) Copy the link (5) Share via WhatsApp, email, or paste in class document. Show backup method: if sharing is not available, demo the bot live for others to interact with on one screen. | Test sharing functionality beforehand. Free-tier accounts may have limited sharing. Have backup plan: students can demo on their own laptop while classmates watch and give verbal instructions. |
| 0:20-0:25 | 5 min | **Instruction: QA Testing Framework.** Explain the QA scorecard: test each bot on 5 dimensions (1) Does it do what it claims? (2) Are answers accurate? (3) Does it handle unexpected questions? (4) Is the personality consistent? (5) Would you actually use this? Score each 1-5. Total: 25 points. | Distribute QA scorecards. Explain: "QA means Quality Assurance. Real tech companies pay people to test products. Today, you are the QA team." |
| 0:25-0:30 | 5 min | **Setup: Bot Marketplace Board.** Each student writes their bot name, one-line description, and link/laptop number on the whiteboard or shared doc. This becomes the "Bot Marketplace" -- a directory of all class bots. | Create a numbered list. Students will rotate through and test 3 bots that are NOT their own. If 15 students, number them 1-15 and assign rotation: Student 1 tests bots 6, 11, 3 (random-ish distribution). |
| 0:30-1:00 | 30 min | **Guided Practice: Bot Testing Rotation.** 3 rounds of 10 minutes each. Each round, students move to a different bot and complete a QA scorecard. They interact with the bot for 7 minutes, then fill in the scorecard for 3 minutes. Trainer circulates and moderates. | Keep time strictly. Use a timer on the projector. At each rotation, call out: "Switch!" Create a fun, market-day atmosphere. Encourage students to try to stump each other's bots -- this reveals weaknesses that creators can fix. |
| 1:00-1:10 | 10 min | **Guided Practice: Feedback Collection.** Students return to their seats. They receive their 3 QA scorecards. They read the feedback silently. Then they identify: (1) Most common praise (2) Most common criticism (3) One specific improvement to make. | Give students time to process feedback. Some may feel defensive -- remind them: "This feedback makes your bot better. Every suggestion is a gift." |
| 1:10-1:15 | 5 min | **Break.** | Let emotions settle. Some students may be excited; others may need encouragement. Check in individually with students who received tough feedback. |
| 1:15-1:35 | 20 min | **Independent Practice: Final Bug Fixes.** Based on QA feedback, students make improvements to their bots. Priority order: (1) Fix factual errors (2) Improve fallback handling (3) Enhance personality (4) Add missing content (5) Polish conversation starters. After fixes, they test again to confirm improvements. | This is dedicated improvement time. Walk around and help. Students should make at least 3 concrete changes based on feedback. Check that they are actually modifying the bot, not just reading feedback. |
| 1:35-1:50 | 15 min | **Independent Practice: Showcase Preparation.** Using the "Showcase Preparation Checklist," students prepare for Week 4 Day 4 (Showcase Day). They write: (1) 1-minute elevator pitch for their bot (2) Demo script: 3 things they will show (3) One "wow moment" -- the most impressive thing their bot can do (4) Answer to "Why did you build this?" | Practice the elevator pitch out loud with a partner. Timing is crucial: 1 minute means 1 minute. Students tend to go long -- help them cut. "If you cannot explain your bot in 1 minute, you do not understand it well enough." |
| 1:50-1:55 | 5 min | **Independent Practice: Bot Portfolio Entry.** Students add their bot to their Prompt Portfolio: screenshot, description, design canvas, QA scores received, improvements made. | This documentation makes the portfolio richer for final assessment. |
| 1:55-2:00 | 5 min | **Wrap-Up: Week 3 Celebration.** Announce the "People's Choice Award" -- students vote (not for their own bot) for the best bot in class. Tally votes. Winner gets bragging rights and a small prize. Preview Week 4: "Next week: LinkedIn, AI video, school projects, and SHOWCASE DAY where you present to parents and teachers. Bring your A-game." | The vote creates excitement and a sense of accomplishment. Even students who do not win will see what made the winning bot great. This raises the bar for the showcase. |

### Homework / Take-Home Challenge
Practice your 1-minute elevator pitch 3 times in front of a mirror. Time yourself. Prepare 3 questions someone might ask about your bot and have answers ready.

---

## Week 3 Trainer Checklist

- [ ] All students have a working Custom GPT with uploaded knowledge by end of Session 10
- [ ] All students have designed and built a real-world chatbot by end of Session 11
- [ ] All bots have been QA tested by at least 3 peers by end of Session 12
- [ ] All students have a showcase preparation checklist completed
- [ ] All students can share their bot via link or demo
- [ ] Bot Marketplace board documented (for records)
- [ ] People's Choice Award winner announced
- [ ] Remind students: Week 4 Day 4 is Showcase Day -- invite parents/guardians
- [ ] Send parent/guardian invitation message for Showcase Day (WhatsApp or print)
