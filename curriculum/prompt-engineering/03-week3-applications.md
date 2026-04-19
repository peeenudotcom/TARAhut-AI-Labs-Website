# Week 3: Real-World Applications & Final Project

## Week Overview

**Theme:** Build production-ready AI workflows, Custom GPTs, Claude Projects, and a final business project
**Sessions:** 4 (Sessions 9-12)
**Total Hours:** 8 hours
**Key Outcome:** Participants have deployed AI workflows, 3 Custom GPTs, 2 Claude Projects, and a complete final project with certification

---

## Session 9: Role-Based Prompting & Multi-Step Workflows

**Date:** Week 3, Day 1
**Duration:** 120 minutes
**Topic:** Building Content Production Pipelines with Role-Based Prompting
**Learning Objectives:**
1. Design multi-step AI workflows using different roles at each stage
2. Build a complete content production pipeline (research to distribution)
3. Understand handoff points between AI steps and human review
4. Create reusable workflow templates for professional use

### Materials Needed
- Projector with internet access
- Participant laptops with ChatGPT and Claude open
- Whiteboard and markers
- Handout: "Workflow Design Canvas" (print 2 per participant)
- Handout: "Role Library" (print 1 per participant -- 20 pre-built roles)

### Pre-Session Setup (Trainer)
- Prepare a complete 5-step content pipeline demo (tested end-to-end)
- Create the Role Library handout with 20 professional roles and their system prompts
- Print workflow canvases and role library
- Draw a blank pipeline diagram on the whiteboard

### Minute-by-Minute Session Plan

| Time | Duration | Activity | Trainer Notes |
|---|---|---|---|
| 0:00-0:05 | 5 min | **Warm-Up: "One Person, Many Hats."** Ask: "How many different 'roles' do you play in your work in a single day?" List on the whiteboard: writer, researcher, editor, manager, analyst, communicator. "What if AI could play each of these roles separately, and each role does its job perfectly? That is a workflow." | Professionals relate to wearing many hats. The insight is: instead of one generic AI prompt, use DIFFERENT roles for different stages of a task. Each role brings specialized behavior. |
| 0:05-0:15 | 10 min | **Recap Week 2 + Homework Observations.** Ask 3 participants: "How was using your custom persona as default ChatGPT instructions? When did it help? When did it get in the way?" Quick discussion. Transition: "Week 2 gave you individual tools. Week 3 is about COMBINING them into workflows. Think of it as going from playing individual notes to playing a full song." | The music analogy works well: CRISP is a note, CoT is another note, few-shot is another. A workflow is the melody that combines them all. |
| 0:15-0:25 | 10 min | **Instruction: What Is a Multi-Step Workflow?** Draw on the whiteboard: Input -> Step 1 (Role A) -> Output 1 -> Step 2 (Role B) -> Output 2 -> Step 3 (Role C) -> Final Output. Explain: "Each step uses a different AI role optimized for that task. The output of one step becomes the input for the next. A human reviews between steps." Example: Content Pipeline: Research (Analyst) -> Outline (Strategist) -> Draft (Writer) -> Edit (Editor) -> Optimize (SEO Specialist). | The pipeline diagram makes the concept visual and concrete. Emphasize: "The magic is in the ROLES. A researcher role produces different output than a writer role, even on the same topic. By chaining roles, you get the best of each." |
| 0:25-0:35 | 10 min | **Instruction: Live Pipeline Demo.** Walk through the complete 5-step content pipeline on the projector. Step 1: "Act as a market researcher. Research the top 5 trends in AI for small businesses in India in 2026." Get output. Step 2: "Act as a content strategist. Based on this research [paste output], create a blog post outline with 5 sections." Get output. Step 3: "Act as a professional blog writer. Write section 1 based on this outline [paste]." Step 4: "Act as an editor. Improve this draft for clarity and engagement [paste]." Step 5: "Act as an SEO specialist. Optimize this blog post for the keyword 'AI for small business India' [paste]." | Run through all 5 steps live (or pre-generated to save time). The key observation for participants: each step produces a BETTER result than if you had asked for the final output in one prompt. The pipeline approach produces consistently higher-quality output. |
| 0:35-0:40 | 5 min | **Instruction: Human-in-the-Loop.** Critical point: "Between each step, YOU review the output before passing it to the next step. You are the quality control manager in this factory." Show where to insert human review: after research (verify facts), after outline (adjust structure), after draft (add personal voice), after edit (final approval), after SEO (ensure it still reads well). | This prevents the "garbage cascade" where an error in Step 1 propagates through all subsequent steps. Human review at each stage catches issues early. This is how professional AI teams work. |
| 0:40-1:00 | 20 min | **Guided Practice: Build Your First Pipeline.** Distribute the Workflow Design Canvas. Participants design a 4-5 step pipeline for a task relevant to their work. Options: (1) Content creation pipeline (2) Email marketing pipeline (3) Report writing pipeline (4) Proposal creation pipeline (5) Social media content pipeline. They fill out: each step's role, input, output, and human review point. Then they test steps 1-3 in ChatGPT. | Walk around helping participants define clear roles for each step. Common mistake: making all roles too similar ("Act as a writer" for every step). Push for differentiation: "Your Step 2 role should have DIFFERENT expertise than your Step 3 role. What unique skill does each bring?" |
| 1:00-1:15 | 15 min | **Guided Practice: Complete the Pipeline.** Participants finish testing all steps. They run the full pipeline end-to-end and evaluate the final output. Compare: single prompt (ask for the final output directly) vs pipeline approach (multi-step). Quality difference? Time difference? | The comparison is always illuminating. The pipeline approach takes more time but produces noticeably better results. Help participants quantify: "The pipeline took 15 minutes but produced a blog post I could actually publish. The single prompt took 1 minute but produced something I would need to heavily edit." |
| 1:15-1:20 | 5 min | **Break.** | Quick break. |
| 1:20-1:45 | 25 min | **Independent Practice: Industry Pipeline.** Participants build a second pipeline for a DIFFERENT industry or task. If their first was content creation, this one should be something different: client onboarding workflow, market analysis pipeline, hiring process, or product development research. They complete the full workflow canvas and test at least 3 steps. | Encourage participants to build pipelines they would ACTUALLY use. The more real the application, the more valuable the exercise. Some participants will start seeing immediate business applications -- support this enthusiasm. |
| 1:45-1:55 | 10 min | **Independent Practice: Pipeline Documentation.** Participants document their best pipeline in detail: role definitions, sample prompts for each step, expected output format, human review checklist, and estimated time savings. This goes in their portfolio. | Thorough documentation means the pipeline is REUSABLE. Without documentation, they will forget the exact role definitions and prompt structures. The portfolio entry should be detailed enough that someone else could run the pipeline. |
| 1:55-2:00 | 5 min | **Wrap-Up: Workflow Thinking.** "You have shifted from 'prompt user' to 'workflow designer.' This is what companies pay AI consultants to do: design multi-step AI workflows that produce consistent, high-quality output." Preview Session 10: "Tomorrow, we go deeper with prompt chaining -- automated multi-step workflows where each step feeds the next automatically. Research to outline to draft to polish to distribute, all in one flow." | The professional positioning matters. "AI consultant" and "workflow designer" are real roles that pay well. Participants should see themselves as leveling up their professional capabilities. |

### Homework / Take-Home Challenge
Use your content pipeline to create one real piece of content for your work/business. Bring the final output and documentation of each step to class tomorrow.

---

## Session 10: Prompt Chaining for Complex Tasks

**Date:** Week 3, Day 2
**Duration:** 120 minutes
**Topic:** Research -> Outline -> Draft -> Polish -> Distribute -- Automated Prompt Chains
**Learning Objectives:**
1. Design prompt chains where outputs automatically feed into next prompts
2. Build a complete research-to-distribution chain
3. Handle error propagation and quality degradation in chains
4. Create chain templates for repeated business processes

### Materials Needed
- Projector with internet access
- Participant laptops with ChatGPT and Claude open
- Whiteboard and markers
- Handout: "Prompt Chain Blueprint" (print 2 per participant)
- Handout: "Chain Quality Control Checklist" (print 1 per participant)

### Pre-Session Setup (Trainer)
- Prepare a complete 5-link prompt chain (research -> outline -> draft -> polish -> distribute)
- Test the entire chain end-to-end, noting where quality issues arise
- Create "chain repair" examples (what to do when a link breaks)
- Print all handouts

### Minute-by-Minute Session Plan

| Time | Duration | Activity | Trainer Notes |
|---|---|---|---|
| 0:00-0:05 | 5 min | **Warm-Up: "The Assembly Line Returns."** Callback to Session 1: "Remember the transformer assembly line? Today, YOU build an assembly line. But instead of tokens flowing through attention layers, your IDEAS flow through AI roles. Each station adds value. The final product is something you could not create in one step." | The callback to Session 1 creates a satisfying arc. Participants can appreciate how far their understanding has come. |
| 0:05-0:15 | 10 min | **Recap Session 9 + Homework.** Ask 2 participants to share their pipeline-produced content. Quick evaluation: "Is this publishable? What would you change?" Discuss: what worked well in the pipeline? Where did quality drop? Transition: "Yesterday you designed pipelines. Today, we make them FASTER and SMOOTHER with prompt chaining." | The homework sharing validates that pipelines produce real results. Quality issues raised in discussion become teaching moments for today's chain quality control segment. |
| 0:15-0:25 | 10 min | **Instruction: Pipelines vs Chains.** Clarify the difference: (1) **Pipeline (Session 9):** Manual handoff between steps. You copy output, paste into next prompt, review each time. (2) **Prompt chain:** Designed so each prompt explicitly references and builds on the previous output within one conversation. The "chain" is the conversation flow. Key technique: "Use the research above to..." or "Based on the outline you just created..." Each prompt assumes the previous output is in context. | Draw both on the whiteboard: pipeline = separate conversations with copy-paste. Chain = one continuous conversation with forward references. Chains are faster but riskier (error propagation). Pipelines are safer but slower. Both have a place. |
| 0:25-0:35 | 10 min | **Instruction: The 5-Link Chain.** Demo the complete chain in ONE ChatGPT conversation: **Link 1 (Research):** "Act as a market research analyst. Research 5 key trends in [topic]. Present findings as bullet points with supporting data." **Link 2 (Outline):** "Now, act as a content strategist. Using the research above, create a detailed blog post outline with 5 sections, each with 3 sub-points." **Link 3 (Draft):** "Now, act as an expert blog writer. Write the full blog post based on the outline above. Target 1500 words. Professional but accessible tone." **Link 4 (Polish):** "Now, act as a senior editor. Review and improve the draft above for clarity, engagement, and flow. Fix any errors. Strengthen weak paragraphs." **Link 5 (Distribute):** "Now, act as a social media manager. Based on the blog post above, create: 1 LinkedIn post, 3 tweets, and 1 email newsletter summary." | Run through all 5 links in one conversation on the projector. The speed is impressive -- a complete content package in under 10 minutes. But point out quality issues: "See how the draft has some repetitive phrases from the research? That is error propagation. The polish step should catch it, but does not always." |
| 0:35-0:40 | 5 min | **Instruction: Chain Quality Control.** Teach 4 techniques: (1) **Checkpoint prompts:** After every 2 links, insert: "Review everything above. Identify any factual errors, inconsistencies, or quality issues. Fix them before proceeding." (2) **Constraint reinforcement:** Remind the model of constraints at each link: "Remember: professional tone, 1500 words, no jargon." (3) **Branch and merge:** For critical steps, generate 2 versions and pick the better one before continuing. (4) **Human gateway:** Insert "STOP. Review the output above before I give you the next instruction." at critical points. | These QC techniques are what separate amateur chains from professional ones. The checkpoint prompt is especially powerful -- it catches errors before they propagate. Demo: insert a checkpoint after Link 3 and show how it catches issues the raw chain missed. |
| 0:40-1:00 | 20 min | **Guided Practice: Build a Research-to-Distribution Chain.** Using the Prompt Chain Blueprint, participants design and execute a 5-link chain for a topic relevant to their work. They must include at least 2 quality control checkpoints. They run the entire chain in one ChatGPT conversation and evaluate the final output. | Walk around checking chain design. Common issue: chains that are too ambitious (7+ links tend to degrade in quality). Help participants keep it to 5 links max and use the quality control techniques taught. |
| 1:00-1:15 | 15 min | **Guided Practice: Chain Repair Workshop.** Trainer demonstrates a "broken chain" -- a chain where Link 3 produced poor output that poisoned Links 4 and 5. How to fix: (1) Identify the broken link (2) Re-generate that specific link with better instructions (3) Feed the fixed output into the remaining links (4) Add a checkpoint prompt before the previously broken link for future runs. Participants then fix a deliberately broken chain provided by the trainer. | The repair skill is essential. In real use, chains will break. Knowing how to identify and fix the broken link without restarting the entire chain saves enormous time. Provide a pre-built broken chain for participants to diagnose and fix. |
| 1:15-1:20 | 5 min | **Break.** | Quick break. |
| 1:20-1:40 | 20 min | **Independent Practice: Business Process Chain.** Participants build a prompt chain for a real business process (not content creation -- something different): (1) Client proposal chain: intake brief -> research client -> draft proposal -> pricing section -> executive summary (2) Hiring chain: job requirements -> job posting -> candidate screening criteria -> interview questions -> offer letter template (3) Product launch chain: market research -> positioning -> messaging -> landing page copy -> launch email. Full chain execution with quality control. | These are high-value business processes. Each participant builds a chain they can use immediately. Walk around ensuring the chains are practical and the quality control points are well-placed. |
| 1:40-1:55 | 15 min | **Independent Practice: Chain Template Library.** Participants create 2 reusable chain templates: the full prompt for each link, quality control checkpoints, and usage instructions. These templates should be generic enough to use with different topics/clients by changing a few variables. | The template is the reusable asset. A content chain template where you swap out the topic is infinitely more valuable than a one-time chain. Encourage participants to share their best templates with the class. |
| 1:55-2:00 | 5 min | **Wrap-Up: Chain Mastery.** "You can now build automated AI workflows that produce professional-quality output in minutes. This is what AI consultants charge thousands for." Preview Session 11: "Tomorrow we BUILD -- Custom GPTs and Claude Projects for real use cases. You will create 3 GPTs and 2 Claude Projects that you can deploy for your business." | Build anticipation. Tomorrow is the most hands-on building session of the course. |

### Homework / Take-Home Challenge
Run your business process chain for a real client/project. Document each link's output and the final result. Identify where quality dropped and how you fixed it. Begin thinking about your final project: what business problem will you solve with AI?

---

## Session 11: Custom GPTs & Claude Projects

**Date:** Week 3, Day 3
**Duration:** 120 minutes
**Topic:** Building Deployable AI Tools -- 3 Custom GPTs + 2 Claude Projects
**Learning Objectives:**
1. Build 3 Custom GPTs for different professional use cases
2. Build 2 Claude Projects with custom instructions and knowledge
3. Apply all prompt engineering frameworks (CRISP, CoT, few-shot, system prompts) in product creation
4. Test, iterate, and prepare tools for real-world deployment

### Materials Needed
- Projector with internet access
- Participant laptops with ChatGPT (GPT Builder access) and Claude (Projects access)
- Whiteboard and markers
- Handout: "GPT/Project Build Checklist" (print 5 per participant -- one per build)
- Handout: "Use Case Selection Guide" (print 1 per participant)

### Pre-Session Setup (Trainer)
- Verify GPT Builder and Claude Projects access for all participants
- Create 2 demo Custom GPTs and 1 Claude Project to show as examples
- Prepare the Use Case Selection Guide with 15 suggested use cases
- Print all handouts
- Have backup files ready for knowledge upload (sample business documents, FAQs, etc.)

### Minute-by-Minute Session Plan

| Time | Duration | Activity | Trainer Notes |
|---|---|---|---|
| 0:00-0:05 | 5 min | **Warm-Up: "If AI Could Do One Thing For You..."** Quick round: each participant shares one repetitive task they wish AI could handle permanently. Write on the whiteboard. "Every single thing on this whiteboard is buildable as a Custom GPT or Claude Project. Today, you build 5 of them." | The list becomes a menu of potential builds. Participants see their own needs reflected, which creates motivation. Common responses: email drafting, client onboarding, content scheduling, report generation, customer FAQ handling. |
| 0:05-0:15 | 10 min | **Recap Session 10.** Quick chain recap: "What are the 4 chain quality control techniques?" Ask 1 participant to share their homework chain results. Transition: "Chains are powerful but temporary -- they exist in one conversation. Custom GPTs and Claude Projects are PERMANENT. You build them once, use them forever, and share them with your team." | The permanence argument is key. Chains are disposable; GPTs and Projects are assets. This is the shift from "using AI" to "building AI tools." |
| 0:15-0:25 | 10 min | **Instruction: Custom GPTs vs Claude Projects.** Side-by-side comparison: **Custom GPT:** Best for: public-facing tools, tools you share with others, specialized assistants. Features: system prompt, knowledge upload, conversation starters, web browsing, code execution, image generation. Limitation: requires ChatGPT ecosystem. **Claude Project:** Best for: team workspaces, long-context work, document analysis. Features: project instructions, knowledge base, focused conversations within a project context. Limitation: less public sharing. "Use GPTs when you want to SHARE a tool. Use Claude Projects when you want a WORKSPACE." | Do not pick favorites -- both have strengths. The decision framework (share = GPT, workspace = Claude Project) gives participants a clear selection criterion. Show one example of each: a GPT that a client would use, and a Claude Project that a team would use internally. |
| 0:25-0:35 | 10 min | **Instruction: Building with All Frameworks.** Quick recap of how every Week 2 framework applies to building GPTs/Projects: (1) **CRISP:** The system prompt IS a CRISP prompt. (2) **CoT:** Include reasoning instructions: "When analyzing, always think step by step." (3) **Few-shot:** Include examples in the instructions: "When responding to client emails, follow this pattern: [example]." (4) **System prompt:** The entire GPT/Project configuration IS the system prompt. Everything from Week 2 converges here. | This is the integration moment. Draw the connection diagram on the whiteboard: Week 1 (understanding) + Week 2 (frameworks) = Week 3 (building). Participants should see that everything they have learned has been building to this point. |
| 0:35-0:40 | 5 min | **Setup: Choose Your 5 Builds.** Using the Use Case Selection Guide, participants select 5 tools to build: 3 Custom GPTs and 2 Claude Projects. Suggested categories: (1) GPT 1: Client-facing tool (2) GPT 2: Personal productivity tool (3) GPT 3: Content creation tool (4) Project 1: Document analysis workspace (5) Project 2: Strategic planning workspace. They write their 5 choices on the checklist. | Help participants choose wisely. The builds should be diverse (not 5 content writers) and relevant to their actual work. If someone is a freelancer, one GPT could be for client proposals. If they run a business, one could be for customer FAQ. |
| 0:40-1:00 | 20 min | **Guided Practice: Build GPT 1 (Client-Facing).** Step-by-step, participants build their first Custom GPT using GPT Builder. Checklist: (1) Name and description (2) System prompt using CRISP + CoT + few-shot (3) Upload relevant knowledge documents (4) Set conversation starters (5) Enable appropriate capabilities (6) Test with 5 diverse inputs (7) Stress test with 3 edge cases. Trainer circulates helping with system prompts and knowledge uploads. | This is the most complex GPT: client-facing means it needs to be robust, professional, and handle unexpected inputs gracefully. Walk around checking system prompts for completeness. Common gap: no fallback behavior defined. Push: "What happens if someone asks something your GPT cannot handle?" |
| 1:00-1:15 | 15 min | **Guided Practice: Build GPT 2 (Productivity).** Faster build -- participants apply the same process to a personal productivity GPT. This can be simpler: email drafting assistant, meeting notes organizer, task prioritizer, code reviewer. Less stress testing needed since it is for personal use. | The second GPT goes faster because the process is familiar. Let participants work more independently. Help only those who are stuck. |
| 1:15-1:20 | 5 min | **Break.** | Quick break. |
| 1:20-1:35 | 15 min | **Independent Practice: Build GPT 3 + Claude Project 1.** Participants build their third GPT and first Claude Project. For the Claude Project: (1) Create a new project in Claude (2) Write project instructions (3) Upload knowledge documents (4) Set the context and scope (5) Start a conversation within the project to test. Trainer available for questions but participants should be largely self-sufficient by now. | Two builds in 15 minutes requires efficiency. Participants who are fast will finish both. Others may only complete one. That is fine -- they can finish during the next independent practice block. |
| 1:35-1:50 | 15 min | **Independent Practice: Build Claude Project 2 + Testing.** Complete the fifth build. Then: comprehensive testing of all 5 tools. Each tool gets 5 test inputs including at least 1 edge case. Participants document: build name, purpose, system prompt summary, test results, issues found, and fixes applied. | The documentation is critical -- these builds are potential portfolio pieces AND real business tools. Thorough documentation makes them maintainable and improvable. |
| 1:50-1:55 | 5 min | **Independent Practice: Share One Build.** Each participant shares the link or demo of their best GPT with the class Slack/WhatsApp group. Others can test and give quick feedback. | Community sharing builds social proof and generates ideas. Someone's email GPT might inspire another person to build something similar for their industry. |
| 1:55-2:00 | 5 min | **Wrap-Up: From User to Builder.** "You came into this course as AI USERS. You are now AI BUILDERS. You have 5 deployed AI tools that solve real problems. That is a marketable skill." Preview Session 12: "Tomorrow is FINAL PROJECT DAY. You build a complete AI workflow for a real business problem and present it for certification. Bring your best game." | The identity shift from "user" to "builder" is the core transformation of this course. Reinforce it. Tomorrow's session is the culmination of everything. |

### Homework / Take-Home Challenge
FINAL PROJECT PREPARATION: (1) Choose your business problem (2) Identify which AI tools and frameworks you will use (3) Draft your workflow outline (4) Prepare any documents/knowledge you need to upload (5) Practice a 5-minute presentation of your solution.

---

## Session 12: Final Project -- Build a Complete AI Workflow + Certification

**Date:** Week 3, Day 4
**Duration:** 120 minutes
**Topic:** Final Project Build, Presentation, and Certification Ceremony
**Learning Objectives:**
1. Build a complete AI workflow solving a real business problem
2. Present the solution professionally with live demo
3. Receive peer and trainer evaluation
4. Demonstrate mastery of all prompt engineering frameworks

### Materials Needed
- Projector with internet access and HDMI adapter
- Participant laptops fully charged
- Whiteboard and markers
- Printed certificates (TARAhut AI Labs Professional Certificate)
- Evaluation rubrics (print 1 per participant for peer evaluation + trainer copy)
- Timer for presentations
- Camera/phone for documentation
- Refreshments (optional)

### Pre-Session Setup (Trainer)
- Arrange room: presentation area with projector, audience-style seating
- Print certificates with each participant's name
- Print evaluation rubrics
- Test projector and internet
- Prepare a running order (presentation sequence)
- Have the evaluation rubric criteria visible on a slide

### Minute-by-Minute Session Plan

| Time | Duration | Activity | Trainer Notes |
|---|---|---|---|
| 0:00-0:05 | 5 min | **Warm-Up: "3 Weeks Ago."** Trainer addresses the class: "3 weeks ago, you knew that AI could generate text. Today, you understand transformer architecture, tokenization, parameters, CRISP, chain-of-thought, few-shot, system prompts, pipelines, chains, Custom GPTs, and Claude Projects. You are now in the top 1% of AI users globally. Let us prove it today." | Confidence boost before presentations. List everything they have learned on the whiteboard -- the sheer volume is impressive and builds pride. |
| 0:05-0:15 | 10 min | **Final Project Work Time.** Last chance to polish. Participants finalize their workflow, test critical components, and rehearse their presentation (quietly, to themselves or a partner). Trainer is available for last-minute questions and technical troubleshooting. | Walk around doing quick checks: "Is your demo working? Is your presentation structured? Do you know your timing?" Fix technical issues now -- not during the presentation. Have backup plans: if a participant's GPT is down, they can show screenshots. |
| 0:15-0:25 | 10 min | **Presentation Guidelines + Rubric Review.** Explain the format: (1) 5-minute presentation (strict timing) (2) 3-minute Q&A from class and trainer (3) Business Problem (30 seconds) -> Solution Design (1 min) -> Live Demo (2 min) -> Results & Impact (1 min) -> Lessons Learned (30 seconds). Show the evaluation rubric: Problem Relevance (20%), Solution Design (20%), Technical Execution (20%), Presentation Quality (20%), Business Impact (20%). Distribute peer evaluation rubrics. | Go through each rubric criterion with examples of what scores 5/5 vs 3/5 vs 1/5. Clear expectations reduce presentation anxiety and improve quality. |
| 0:25-0:30 | 5 min | **Setup and First Presenter Preparation.** First presenter connects to the projector and prepares. | Help with technical setup. The first presenter sets the tone -- if possible, have a confident presenter go first. |
| 0:30-1:10 | 40 min | **Final Project Presentations (Block 1).** Approximately 5 presentations at 8 minutes each (5 min presentation + 3 min Q&A). Peer evaluation after each. Trainer takes notes for personalized feedback. Applause after each presentation. | Manage time strictly. Use a visible timer. If someone goes over 5 minutes, give a 30-second warning, then a polite cut-off. During Q&A, ask at least one substantive question: "Why did you choose CRISP over RACE for your system prompt?" or "What happens if the chain breaks at step 3?" |
| 1:10-1:15 | 5 min | **Break.** | Quick break between presentation blocks. |
| 1:15-1:45 | 30 min | **Final Project Presentations (Block 2).** Remaining presentations. Same format: 5 min + 3 min Q&A + peer evaluation. | Continue strict timing. Energy may dip in the second block -- keep the audience engaged by asking them questions during Q&A. "Did anyone else try a similar approach? How did yours differ?" |
| 1:45-1:50 | 5 min | **Peer Evaluation Collection + Quick Tally.** Collect all peer evaluation forms. While participants talk informally, trainer does a quick tally of scores. Identify: top project (highest average score), most creative solution, best presentation, most practical application. | Quick math: average the rubric scores for each presenter. You do not need exact numbers -- approximate rankings are fine for the awards. |
| 1:50-1:55 | 5 min | **Awards + Recognition.** Announce: (1) **Best Overall Project** -- highest average score (2) **Most Creative Solution** -- unique approach or unexpected application (3) **Best Presentation** -- clearest, most engaging delivery (4) **Most Business-Ready** -- closest to actual deployment. Verbal recognition for each winner. | Make this celebratory. Even informal recognition feels meaningful. If you have small prizes (gift cards, books, extra mentoring session), distribute them. Every participant should feel accomplished, not just the winners. |
| 1:55-2:00 | 5 min | **Certification Ceremony + Closing.** Call each participant by name. Present the certificate with a personalized comment: "Amrit, your client onboarding GPT could be a product. Seriously." Handshake and photo. Group photo. Trainer closing speech: "You are now certified prompt engineers. The AI industry needs people who can do what you just demonstrated. Go build, go create, go lead." | Make certificates feel earned and valuable. The personalized comment should reference something specific from their project or from their journey in the course. End with aspiration: "This is not the end of your AI journey -- it is the beginning." |

### Post-Session Tasks (Trainer)
- Process and distribute all certificates (digital copies via email)
- Compile peer and trainer evaluations into individual feedback reports
- Send feedback reports to each participant within 3 days
- Add all participants to the TARAhut AI Labs professional alumni network
- Send course completion survey (for program improvement)
- Upload class photos/videos (with consent)
- Identify participants for potential roles: guest speakers, mentors, advanced course candidates
- Complete franchise session report and submit to TARAhut AI Labs HQ
- Follow up with participants after 2 weeks to see if they are using their AI workflows

---

## Week 3 Trainer Checklist

- [ ] All participants have at least 2 reusable workflow templates by end of Session 9
- [ ] All participants have built at least 1 complete prompt chain by end of Session 10
- [ ] All participants have 3 Custom GPTs and 2 Claude Projects by end of Session 11
- [ ] All participants presented their final project in Session 12
- [ ] All certificates distributed
- [ ] All peer evaluations collected and compiled
- [ ] Individual feedback reports drafted
- [ ] Alumni network invitations sent
- [ ] Course completion survey distributed
- [ ] Final course report submitted to HQ

---

## End of Course: Generative AI & Prompt Engineering (Advanced)

**Total Sessions Delivered:** 12
**Total Contact Hours:** 24 hours
**Skills Covered:** Transformer architecture, tokenization, model parameters, model comparison, CRISP framework, chain-of-thought, tree-of-thought, few-shot prompting, zero-shot prompting, system prompts, multi-step workflows, prompt chaining, Custom GPT creation, Claude Projects, AI workflow design
**Outputs Per Participant:** Prompt portfolio (50+ prompts), model comparison framework, 3 parameter recipe cards, 3 AI personas, 2 workflow templates, 2 prompt chain templates, 3 Custom GPTs, 2 Claude Projects, final project (complete AI workflow), professional certificate
