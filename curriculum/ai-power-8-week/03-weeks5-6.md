# Weeks 5-6: Sessions 17-24 -- Trainer Session Plans

**Program:** AI Power -- 8-Week Program
**By:** TARAhut AI Labs

---

# WEEK 5: NO-CODE AUTOMATION & WORKFLOWS

> Goal: Students learn to build automations that connect apps together -- no coding needed. They create workflows that save hours of manual work for businesses and themselves.

**Week 5 Deliverable:** 3 Working Automations (built in Zapier or Make)

---

## SESSION 17: Introduction to Automation -- Zapier & Make

**Date:** Week 5, Day 1
**Theme:** What is automation? Setting up Zapier and Make.
**Tools:** Zapier, Make (Integromat)

### Minute-by-Minute Plan

| Time | Min | Block | Activity | Trainer Notes |
|---|---|---|---|---|
| 0:00 | 5 | Warm-Up | "The Lazy Genius" story: "Meet Simran. She runs an online bakery on Instagram. Every time someone DMs an order, she manually copies the order into a Google Sheet, sends a confirmation on WhatsApp, and creates an invoice. It takes 15 minutes per order. She gets 20 orders a day. That's 5 hours of copying and pasting. What if we made it happen AUTOMATICALLY?" | Students should be thinking "I know businesses like this" -- connects to Week 4. |
| 0:05 | 10 | Recap | Week 4 recap: business plans, invoicing, WhatsApp. "You built tools for businesses. This week, you make those tools work WITHOUT human effort." Bridge: "Automation is the next level. It's the difference between a tool and a system." | |
| 0:15 | 25 | Instruction | **Part 1: What is Automation? (8 min).** Analogy: "Automation is like setting up dominoes. You push the first one, and the rest fall on their own." Trigger --> Action. When THIS happens, do THAT. Real examples: (1) New email arrives --> save attachment to Google Drive, (2) New form submission --> send WhatsApp message, (3) New Instagram follower --> add to Google Sheets. **Part 2: Zapier Introduction (10 min).** Open Zapier (zapier.com). Sign up (free plan: 5 Zaps, 100 tasks/month). Vocabulary: Zap = automation, Trigger = the event, Action = what happens next. Live demo: Create a Zap: "When a new Google Form response is submitted --> send me an email notification." Walk through every click. Test it live -- submit a form and show the email arriving. **Part 3: Make (Integromat) Introduction (7 min).** Open Make (make.com). Sign up (free plan: 1000 operations/month). Make's advantage: visual workflow builder (drag and drop). Quick demo: show the same form-to-email automation in Make's visual interface. Compare: Zapier = simpler, Make = more powerful/visual. | The live demo where the form triggers an email is the "magic moment." Practice this beforehand. Ensure form + email are ready. |
| 0:40 | 30 | Guided Practice | **Exercise 1: First Zap (15 min).** ALL students create the same automation together: Trigger: New Google Form response. Action: Send an email (Gmail) to themselves with the form data. Trainer walks through every click on projector. Test with a real form submission. Celebrate when emails arrive: "You just built your first automation!" **Exercise 2: First Make Scenario (15 min).** ALL students create the same automation in Make: Trigger: New row in Google Sheets. Action: Send a Gmail notification. Trainer walks through on projector. Test by adding a row to the Sheet. | Free Zapier allows only 5 zaps -- students should not waste them. Plan which 5 they'll build across the week. Make gives more room to experiment. |
| 1:10 | 5 | Break | | |
| 1:15 | 35 | Independent Work | **Automation Brainstorm + Build #1 (35 min):** **Brainstorm (10 min):** Using ChatGPT, students prompt: "I want to automate tasks for a [type of business]. Suggest 10 simple automations I can build using Zapier or Make with Google Sheets, Gmail, Google Forms, and WhatsApp." Pick the top 3 most useful automations. Write them down. **Build (25 min):** Start building Automation #1 from their list. This counts toward the deliverable. Trainer circulates and helps with setup issues. | Common issues: account verification delays, connecting apps (OAuth permissions). Help students through these patiently. |
| 1:50 | 10 | Wrap-Up | 3 students share what automation they're building and why it's useful. Trainer picks "Most Creative Automation Idea." Homework: Finish Automation #1 if not done. Think about Automation #2. Preview: "Tomorrow -- we build real business automations: form to WhatsApp to Sheet to Email. The full chain." | |

---

## SESSION 18: Building Real Automations -- Form to WhatsApp to Sheet to Email

**Date:** Week 5, Day 2
**Theme:** Multi-step automations for business use cases
**Tools:** Zapier, Make, Google Forms, Google Sheets, Gmail

### Minute-by-Minute Plan

| Time | Min | Block | Activity | Trainer Notes |
|---|---|---|---|---|
| 0:00 | 5 | Warm-Up | Live demo: Trainer submits a Google Form on their phone. On the projector: (1) the data appears in Google Sheets, (2) an email notification arrives, (3) a WhatsApp message is sent -- ALL automatically within 30 seconds. "This is what we build today." | This multi-step demo is the most impressive automation moment. Rehearse it. |
| 0:05 | 10 | Recap | Review: trigger, action, Zap, scenario. Check Automation #1 status: "Who completed their first automation? Show of hands." Troubleshoot common issues from Session 17. | 5-minute troubleshooting for anyone stuck. |
| 0:15 | 25 | Instruction | **The Full Chain Automation (25 min).** Build on projector step-by-step: **Step 1: Create a Google Form (5 min).** "Order Form for Raju's Sweet Shop" -- fields: Name, Phone, Item (dropdown: Gulab Jamun, Rasgulla, Barfi, Laddu), Quantity, Delivery Address. **Step 2: Connect Form to Google Sheets (3 min).** Responses automatically go to Sheets (built-in Google feature). **Step 3: Zapier/Make Automation (12 min).** Trigger: New Google Sheets row. Action 1: Send email to business owner with order details. Action 2: Send WhatsApp notification (using Zapier's WhatsApp integration OR Make's HTTP module with WhatsApp API). Walk through every step. **Step 4: Test (5 min).** Submit a test order. Watch the full chain execute. | WhatsApp automation via Zapier requires WhatsApp Business API (paid) for direct integration. Alternative: use Zapier to send SMS or use a free webhook to WhatsApp service. Be transparent about limitations. For training, the email chain is sufficient to demonstrate the concept. |
| 0:40 | 30 | Guided Practice | **Build the Order Chain (30 min):** Students build their own version of the order form automation for their Week 4 business. **Phase 1 (10 min):** Create a Google Form customized for their business (restaurant menu, salon services, tuition class enrollment -- whatever fits). **Phase 2 (10 min):** Set up the Zapier/Make automation: Form response --> Sheets --> Email notification. **Phase 3 (10 min):** Test the automation end-to-end. Screenshot the successful test. | This is Automation #2 for the deliverable. Students should document each automation with screenshots. |
| 1:10 | 5 | Break | | |
| 1:15 | 35 | Independent Work | **Automation Documentation + Build #3 Start (35 min):** **Documentation (15 min):** Create a Google Doc: "My Automations Portfolio." For each automation, include: name, what it does, trigger, actions, screenshot of the workflow, screenshot of a successful test, which business it helps. Document Automation #1 and #2. **Build #3 Start (20 min):** Start building a third automation. Ideas: (1) New email with specific subject --> extract info to Sheets, (2) Scheduled weekly email summary from Sheet data, (3) New calendar event --> send preparation reminder, (4) Daily weather notification for the business. Use ChatGPT: "Suggest a useful third automation for [business type] using Zapier or Make." | Students who finish fast: challenge them to make a 4th or 5th automation. Extra credit for complexity. |
| 1:50 | 10 | Wrap-Up | 2 students demo their order form automation live (submit form, show email arriving). Class applauds. "You just built something a developer would charge INR 10,000+ for." Homework: Complete Automation #3. Preview: "Tomorrow -- AI supercharges Google Sheets and Excel. Formulas that write themselves." | |

---

## SESSION 19: AI + Google Sheets/Excel Power Session

**Date:** Week 5, Day 3
**Theme:** Advanced spreadsheet skills with AI assistance
**Tools:** Google Sheets, ChatGPT, Claude

### Minute-by-Minute Plan

| Time | Min | Block | Activity | Trainer Notes |
|---|---|---|---|---|
| 0:00 | 5 | Warm-Up | "Formula Fear" poll: "Who is scared of Excel/Sheets formulas?" (Most hands go up.) "After today, you'll LOVE formulas because AI writes them for you." | Addresses a real anxiety for non-IT students. |
| 0:05 | 10 | Recap | Check Automation #3 status. Quick troubleshooting. Review the automation documentation format. | |
| 0:15 | 25 | Instruction | **Part 1: AI as Your Formula Assistant (10 min).** The magic prompt: "Write a Google Sheets formula that [describes what you want]." Demo 5 formulas generated by ChatGPT: (1) VLOOKUP -- "Find the price of an item based on its name from another sheet," (2) IF + conditional -- "If sales > 10000, show 'Good', otherwise show 'Needs Improvement'," (3) SUMIF -- "Add up all sales for the month of March," (4) COUNTIF -- "Count how many times 'Gulab Jamun' appears in column B," (5) Array formula -- "Calculate running total of daily sales." Each time: ask ChatGPT, paste formula, show it working. **Part 2: Data Analysis with AI (8 min).** Demo: paste a small sales dataset into Claude. Ask: "Analyze this data. What are the top-selling items? What day has the highest sales? Any trends?" Claude gives insights without any formulas. **Part 3: Charts & Visualization (7 min).** Demo: select data in Sheets, insert chart. Use ChatGPT: "What type of chart best shows monthly sales comparison?" AI recommends chart type and explains why. | The "paste data into Claude for analysis" trick is mind-blowing for students who struggle with formulas. It's a legitimate shortcut. |
| 0:40 | 30 | Guided Practice | **Exercise 1: Formula Practice (15 min).** Trainer provides a sample dataset (pre-shared Google Sheet with sales data for a sweet shop: Date, Item, Quantity, Price, Total). Students write 5 formulas using AI assistance: (1) Total revenue, (2) Average order value, (3) Best-selling item (COUNTIF), (4) Sales for a specific date range (SUMIFS), (5) Conditional formatting: highlight orders > INR 500. **Exercise 2: AI Data Analysis (15 min).** Copy the dataset. Paste into Claude. Ask 3 analytical questions. Write down the insights. Create 1 chart in Google Sheets based on AI's recommendation. | Provide the sample dataset as a shared Google Sheet link. All students work on the same data for guided practice. |
| 1:10 | 5 | Break | | |
| 1:15 | 35 | Independent Work | **Build a Business Dashboard (35 min):** For their Week 4 business, create a simple dashboard in Google Sheets: Row 1-3: Business name, month, date range. Section 1: Sales summary (total, average, best day). Section 2: Top 5 items/services. Section 3: A chart (bar or pie). Section 4: 3 AI-generated insights (paste from Claude analysis). Use sample/realistic data if real data isn't available. This becomes an additional tool they can offer to the business. | A "dashboard" sounds impressive to business owners. Even a simple one adds enormous perceived value. |
| 1:50 | 10 | Wrap-Up | 2 students show their dashboards. "You now speak the language of business data. Combined with automation from earlier this week, you're building real systems." Homework: Add the dashboard to the Business Improvement Plan folder (from Week 4). Finalize all 3 automations if not done. Preview: "Tomorrow -- Notion AI. The ultimate productivity tool. And we submit our automation deliverable." | |

---

## SESSION 20: Notion AI + Week 5 Deliverable Submission

**Date:** Week 5, Day 4
**Theme:** Notion AI for productivity + deliverable submission
**Tools:** Notion AI, all automation tools

### Minute-by-Minute Plan

| Time | Min | Block | Activity | Trainer Notes |
|---|---|---|---|---|
| 0:00 | 5 | Warm-Up | Open Notion on projector. Show a beautifully organized workspace: project tracker, notes, calendar, to-do list -- all in one place. "This is Notion. It's like Google Docs, Sheets, and Calendar had a beautiful baby." | Visual impact matters. Use a pre-built aesthetic Notion page. |
| 0:05 | 10 | Recap | Automation week review: Zapier, Make, Google Sheets + AI, dashboards. "In 3 sessions, you went from 'What is automation?' to building multi-step workflows and business dashboards. Let that sink in." Check: all 3 automations ready? | |
| 0:15 | 25 | Instruction | **Part 1: Notion Basics (10 min).** Sign up for Notion (notion.so) -- free for personal use. Show: pages, databases, templates. The block system: every line is a block (text, heading, toggle, table, image). Demo: create a "Student Hub" page with: To-do list, class notes section, project tracker table. **Part 2: Notion AI Features (10 min).** Built-in AI (press space or / then "AI"): summarize, translate, explain, brainstorm, write, improve writing, fix grammar. Demo: write rough notes about automation, then use Notion AI to "Improve writing" and "Summarize." Show "Brainstorm ideas" for a project. **Part 3: Templates for Business (5 min).** Demo: Notion templates for: CRM (customer tracker), project management, content calendar, meeting notes. Show how a small business can run on Notion instead of 5 different apps. | Notion can feel overwhelming due to its flexibility. Keep demos simple and focused. The goal is awareness + basic usage, not mastery. |
| 0:40 | 30 | Guided Practice | **Exercise 1: Personal Notion Setup (15 min).** Students create their first Notion workspace: Page 1: "My AI Power Course" -- with toggle sections for each week's notes. Page 2: "Project Tracker" -- a table with columns: Project, Status, Deadline, Tool Used. Add their automation projects to the tracker. **Exercise 2: Notion AI Practice (15 min).** Students write rough notes about their favourite session so far (5 sentences, quick and messy). Use Notion AI to: (1) Improve the writing, (2) Summarize in 2 sentences, (3) Translate to Hindi. Compare original vs AI-improved. | Some students will fall in love with Notion and want to explore. Let them, but keep the class moving. Notion is a bonus skill, not the week's core. |
| 1:10 | 5 | Break | | |
| 1:15 | 35 | Independent Work | **Deliverable Finalization (35 min):** **Phase 1: Automation Documentation (15 min):** Finalize the "My Automations Portfolio" Google Doc. Ensure all 3 automations are documented with: name, purpose, trigger/actions, screenshots, test results, which business it serves. **Phase 2: Bonus -- Notion Portfolio (10 min, optional):** Students who finish early can create a Notion page that links to all their automation documentation. This is great for their eventual portfolio website. **Phase 3: Submission (10 min):** Create Google Drive folder: "Week 5 -- [Name] -- Automations." Include: automation portfolio doc, dashboard Google Sheet (from Session 19), Notion setup screenshot (optional). Submit via Google Form. | Core requirement: 3 documented automations. Dashboard and Notion are bonus quality indicators. |
| 1:50 | 10 | Wrap-Up | "Automation Showcase" -- 3 students demo their most creative automation live. Class votes on "Automation of the Week." Announce: "You now have skills that 90% of working professionals in Punjab don't have. Next week -- you build CHATBOTS. Like the ones banks and airlines use. But without writing a single line of code." Hype Week 6. | |

---

# WEEK 6: AI AGENTS & CHATBOTS -- ZERO CODE

> Goal: Students understand AI agents, build functional chatbots using no-code tools, create Custom GPTs, and explore AI voice bots. They deliver a working chatbot for a real use case.

**Week 6 Deliverable:** Working Chatbot for a Real Use Case (deployed and testable)

---

## SESSION 21: What Are AI Agents? The Future of Work

**Date:** Week 6, Day 1
**Theme:** Understanding AI agents and their applications
**Tools:** ChatGPT (Custom GPTs preview), Perplexity

### Minute-by-Minute Plan

| Time | Min | Block | Activity | Trainer Notes |
|---|---|---|---|---|
| 0:00 | 5 | Warm-Up | "Talk to a bot" -- students text a live customer service chatbot (trainer pre-identifies one -- Swiggy, Zomato, or a bank's WhatsApp bot). Ask: "Was that a human or a bot? How could you tell?" Discussion. | Every student has interacted with chatbots but never thought about building one. |
| 0:05 | 10 | Recap | Week 5 highlights: automation, Zapier, Make, Sheets, Notion. "Last week you connected apps. This week you build something that TALKS BACK." | |
| 0:15 | 25 | Instruction | **Part 1: What Are AI Agents? (10 min).** Simple explanation: "An AI agent is a bot that can think, decide, and act -- not just answer questions." Levels of AI: Level 1 -- Chatbot (answers questions from a script). Level 2 -- Smart Chatbot (understands context, uses AI to generate answers). Level 3 -- AI Agent (can take actions: book appointments, search databases, complete tasks). Real-world examples: customer support bots, appointment booking bots, FAQ bots, lead generation bots, personal assistant bots. **Part 2: Where Chatbots Are Used Locally (8 min).** Punjab-relevant examples: (1) Coaching centre: "What courses do you offer? What's the fee?" bot, (2) Restaurant: "What's today's special? Can I order?" bot, (3) Clinic: "Book an appointment" bot, (4) Real estate: "Show me properties in [area]" bot. For each, show how it saves the business owner hours per day. **Part 3: No-Code Chatbot Tools Overview (7 min).** Introduce the tools: Botpress -- most powerful free option, visual builder. Voiceflow -- great for conversational design. Custom GPTs -- built right inside ChatGPT. We'll use all 3 this week. | Keep the agent explanation simple. Non-IT students don't need to know about LangChain or APIs. Focus on what agents DO, not how they work technically. |
| 0:40 | 30 | Guided Practice | **Exercise 1: Chatbot Design on Paper (15 min).** Before building, DESIGN. Students draw a simple conversation flow on paper: Start --> Greeting --> Menu of options (3-4 choices) --> Response for each choice --> Closing. Use case: FAQ bot for their Week 4 business. Example flow: "Hi! Welcome to Raju's Sweet Shop. How can I help? 1. See today's menu 2. Place an order 3. Store timings 4. Talk to a human." For each option, write the bot's response. **Exercise 2: Custom GPT Preview (15 min).** Open ChatGPT. Go to "Explore GPTs" or "Create a GPT" (requires ChatGPT Plus or use trainer's account for demo). Show how to create a simple Custom GPT: Name it, give it instructions, upload knowledge. Demo: create "Raju's Sweet Shop Assistant" -- give it the menu, prices, store hours. Test it by chatting with it. | If students don't have ChatGPT Plus, use the trainer's account for live demo. Students design their chatbot on paper -- they'll build it in Botpress tomorrow. The paper design is crucial; don't skip it. |
| 1:10 | 5 | Break | | |
| 1:15 | 35 | Independent Work | **Chatbot Design Document (35 min):** Create a Google Doc: "My Chatbot Design -- [Business Name]." Include: Section 1: Purpose -- what does the bot do? Who uses it? Section 2: Conversation Flow -- draw or describe the full flow (greeting, options, responses, fallback for unknown questions, closing). Section 3: Knowledge Base -- list all information the bot needs (FAQs, prices, hours, policies). Section 4: Personality -- what tone does the bot use? (friendly? professional? funny?). Use ChatGPT: "Help me design a conversation flow for a chatbot that helps customers of a [business type] in Punjab." | This design document is the blueprint for Sessions 22-23. Without it, building the bot will be chaotic. Insist on completion. |
| 1:50 | 10 | Wrap-Up | 3 students share their chatbot concept: "My bot does [X] for [business]. It can handle [Y] questions." Peer feedback: "What question might a customer ask that your bot can't handle?" Homework: Complete the chatbot design document. Research Botpress (botpress.com) -- just browse the website and watch a 5-minute YouTube tutorial. Preview: "Tomorrow -- we BUILD the bot. Bring your design document." | |

---

## SESSION 22: Build a Chatbot with Botpress -- Part 1

**Date:** Week 6, Day 2
**Theme:** Hands-on chatbot building with Botpress
**Tools:** Botpress

### Minute-by-Minute Plan

| Time | Min | Block | Activity | Trainer Notes |
|---|---|---|---|---|
| 0:00 | 5 | Warm-Up | Show a 60-second video of a Botpress chatbot in action (pre-recorded or from Botpress website). "By the end of today, yours will work like this." | Sets the target clearly. |
| 0:05 | 10 | Recap | Review chatbot design documents. Quick check: "Does everyone have their conversation flow, knowledge base, and personality defined?" Fix gaps now. | Students without complete designs will struggle. Give them 5 minutes to finish if needed. |
| 0:15 | 25 | Instruction | **Botpress Walkthrough (25 min).** Open Botpress (botpress.com). Sign up (free tier is generous). **Interface tour (5 min):** Flows, Knowledge Base, Tables, Agents, Integrations. **Build together -- "Raju's Sweet Shop Bot" (20 min):** Step 1: Create a new bot. Name it. Step 2: Set up the greeting node: "Namaste! Welcome to Raju's Sweet Shop. How can I help you today?" Step 3: Add choice cards: Menu, Place Order, Store Timings, Talk to Human. Step 4: Build each branch: Menu --> display items and prices. Timings --> "We're open 9 AM to 9 PM, every day." Order --> "Please share: your name, item, and quantity. We'll confirm on WhatsApp." Human --> "Calling Raju bhai... Please hold." Step 5: Add a "Didn't understand" fallback: "Sorry, main samajh nahi paaya. Kya aap dobara try kar sakte ho?" Step 6: Test in the Botpress simulator. | Go SLOWLY. Non-IT students need every click shown. Pause after each step and say "Everyone done? Thumbs up." Use a mic if room is large. |
| 0:40 | 30 | Guided Practice | **Build YOUR Bot -- Phase 1 (30 min).** Students build their own chatbot using their design document: **Step 1 (5 min):** Create bot, name it. **Step 2 (5 min):** Set up greeting node with their custom welcome message. **Step 3 (10 min):** Add 3-4 choice options based on their design. **Step 4 (10 min):** Build responses for at least 2 of the choices. Trainer circulates actively. For each student, check: does the greeting work? Do the choices appear? Does at least 1 branch work? | Target: by end of guided practice, every student has a bot that greets and shows options. Even if branches are incomplete, the skeleton should work. |
| 1:10 | 5 | Break | | |
| 1:15 | 35 | Independent Work | **Build YOUR Bot -- Phase 2 (35 min).** Complete ALL branches of the chatbot. Add: (1) Responses for every choice option. (2) At least 3 FAQ-style Q&As in the Knowledge Base section (Botpress AI answers from uploaded knowledge). (3) A fallback message for unrecognized inputs. (4) Test every branch in the simulator. Screenshot each successful conversation. | Students who finish early: add more knowledge to the Knowledge Base, add personality to responses (emojis, Punjabi phrases), or add more conversation branches. |
| 1:50 | 10 | Wrap-Up | 3 students demo their chatbot in the Botpress simulator on projector. Class tests it by suggesting questions. Celebrate working bots. "You just built a chatbot. No code. Zero. This is what startups in Bangalore pay developers lakhs for." Homework: Test the bot yourself 10 times. Find 3 questions it can't handle and add responses for them. Preview: "Tomorrow -- Custom GPTs and Voiceflow. Two more ways to build bots." | |

---

## SESSION 23: Custom GPTs + Voiceflow + AI Voice Bots

**Date:** Week 6, Day 3
**Theme:** Alternative chatbot platforms + voice bot introduction
**Tools:** ChatGPT (Custom GPTs), Voiceflow, Botpress

### Minute-by-Minute Plan

| Time | Min | Block | Activity | Trainer Notes |
|---|---|---|---|---|
| 0:00 | 5 | Warm-Up | "Hey Alexa / Ok Google" -- ask the room's smart speaker (or phone) a question. "That's a voice bot. What if you could build one for a business?" | If no smart speaker, use Google Assistant on a phone. |
| 0:05 | 10 | Recap | Review Botpress progress. Quick troubleshooting: "What problems did you find when testing?" Common issues: bot doesn't understand rephrased questions, bot loops, missing responses. Quick fixes for top 3 issues. | Spend time here -- debugging is a real skill. |
| 0:15 | 25 | Instruction | **Part 1: Custom GPTs Deep Dive (12 min).** (Use trainer's ChatGPT Plus account if students don't have Plus.) What is a Custom GPT? It's a ChatGPT that only knows about YOUR topic. Steps to create: (1) Go to ChatGPT --> Explore/Create, (2) Name + description, (3) Instructions: "You are the customer support assistant for [business]. You know the following: [paste all business info]. Always respond in a friendly tone. If asked something you don't know, say 'Let me connect you with the owner.'" (4) Upload files: menu PDF, price list, FAQ document. (5) Test and share. Live demo: build "Punjab Tourism Guide GPT" in 5 minutes. **Part 2: Voiceflow Quick Tour (8 min).** Open Voiceflow (voiceflow.com). Sign up. Show: visual conversation designer (similar to Botpress but more focused on voice). Demo: create a simple 3-step voice conversation: greeting --> question --> response. **Part 3: AI Voice Bots -- The Future (5 min).** Brief overview: voice bots for phone calls, WhatsApp voice messages, IVR systems. Show 1 example of an AI phone bot (YouTube video). "This is where the industry is going. You're learning the foundation now." | Custom GPTs are the easiest chatbot to build but require ChatGPT Plus ($20/month). For the deliverable, Botpress (free) is the primary tool. Custom GPTs are taught as an alternative/bonus skill. |
| 0:40 | 30 | Guided Practice | **Exercise 1: Custom GPT (15 min).** Using trainer's Plus account OR students with Plus: create a Custom GPT for their Week 4 business. Upload the business info as instructions. Test it. Students without Plus: work in groups of 3-4 around one Plus account, or watch the demo and document the process in their notes. **Exercise 2: Botpress Enhancement (15 min).** Return to their Botpress chatbot. Add Knowledge Base content: upload or paste all business information (menu, prices, hours, policies). Enable AI-powered answers in Botpress (it uses the Knowledge Base to answer questions not covered by the flow). Test with 5 new questions that aren't in the explicit flow. | The Knowledge Base feature in Botpress is powerful -- it lets the bot answer questions beyond the scripted flow. This is the AI magic layer. |
| 1:10 | 5 | Break | | |
| 1:15 | 35 | Independent Work | **Chatbot Polish + Deployment (35 min):** **Phase 1 (15 min):** Final improvements to the Botpress chatbot: fix any broken flows, add more Knowledge Base content, improve response messages, add personality. **Phase 2 (10 min):** Deploy the chatbot. Botpress free tier allows sharing via a link. Get the shareable link. Test it in a regular browser (not the simulator). Send the link to the batch WhatsApp group -- classmates test each other's bots. **Phase 3 (10 min):** Document the chatbot in a Google Doc: name, purpose, link, 5 screenshot conversations showing it working, list of what it can and cannot do. | The shareable link is key -- it makes the chatbot REAL. Students can show it to the business owner. This transforms the deliverable from "I built something" to "Try it yourself." |
| 1:50 | 10 | Wrap-Up | Peer testing results: "Who tested a classmate's bot? What worked? What didn't?" Honest feedback. "The best way to improve a chatbot is to let real users break it." Homework: Send the chatbot link to the business owner from Week 4. Ask them to test it and share feedback. Preview: "Tomorrow -- final polish and submission. And we see how everyone's bots perform." | |

---

## SESSION 24: Chatbot Showcase + Week 6 Deliverable Submission

**Date:** Week 6, Day 4
**Theme:** Showcase, peer testing, and deliverable submission
**Tools:** Botpress, all previous tools

### Minute-by-Minute Plan

| Time | Min | Block | Activity | Trainer Notes |
|---|---|---|---|---|
| 0:00 | 5 | Warm-Up | "Chatbot Roulette" -- trainer randomly selects 3 chatbot links from the WhatsApp group. Class tests them live on projector and gives instant feedback: "I love...", "I wish it could...", "It got confused when..." | Fun and high-energy. Sets the tone for showcase day. |
| 0:05 | 10 | Recap | Week 6 journey: from "What is a chatbot?" to deployed, shareable chatbots. Review: AI agents (concept), Botpress (primary tool), Custom GPTs (alternative), Voiceflow (voice), Knowledge Base (AI layer). "In 4 sessions, you built something that businesses pay INR 25,000-50,000 for." | Let the value statement land. |
| 0:15 | 25 | Instruction | **Chatbot Quality Checklist (10 min).** On screen: 10-point quality check: (1) Greeting is clear and friendly, (2) All options work, (3) Responses are accurate, (4) Fallback message exists, (5) Knowledge Base handles off-script questions, (6) Tone is consistent, (7) No broken flows/loops, (8) Response time is reasonable, (9) Bot identifies when to hand off to a human, (10) Mobile-friendly. Students grade their own bot 1-10. **Grading Rubric (5 min):** Functionality (works end-to-end): 3 marks. Knowledge (handles 10+ different questions): 3 marks. Design (clear flow, good UX): 2 marks. Real-world relevance (solves a real problem): 2 marks. Total: 10 marks. **Business Owner Feedback (10 min).** Students who got business owner feedback: share it. Discuss: what did owners like? What confused them? How to iterate. For students who didn't get feedback: role-play -- trainer acts as the business owner and tests the bot. | The self-grading exercise builds self-awareness. Students often discover issues they missed. |
| 0:40 | 30 | Guided Practice | **Chatbot Showcase Round (30 min).** 6 students present (5 min each): share screen, show the bot, explain the use case, demo 3 conversations. Class asks 1 question the bot might not handle -- student tests it live. Scoring: class votes on Best Bot, Most Creative Bot, Most Useful Bot. | Select diverse use cases: restaurant, salon, coaching centre, real estate, etc. If time allows, do 8 presentations (4 min each). |
| 1:10 | 5 | Break | | |
| 1:15 | 35 | Independent Work | **Final Submission (35 min):** **Phase 1 (10 min):** Last-minute fixes based on showcase feedback. Update Knowledge Base if needed. **Phase 2 (10 min):** Finalize documentation: chatbot design document (from Session 21), chatbot link, 5 conversation screenshots, quality self-assessment score, business owner feedback (if available). **Phase 3 (10 min):** Organize Google Drive folder: "Week 6 -- [Name] -- Chatbot." Include all documentation + the shareable bot link. Submit via Google Form. **Phase 4 (5 min):** Update Notion portfolio (from Session 20) with the chatbot project. | |
| 1:50 | 10 | Wrap-Up | Award ceremony: Best Bot, Most Creative, Most Useful. Announce. 6-week progress reflection: "You started not knowing what AI is. Now you create content, build automations, and deploy chatbots. You're in the top 1% of AI-skilled students in Punjab." Preview Weeks 7-8: "Next week: we turn all of this into MONEY. Freelancing, resume building, LinkedIn. Week 8: you present everything to real business owners and your parents. Demo Day is coming." | The 6-week milestone is huge. Consider a class photo. The Demo Day preview should build excitement and a bit of healthy pressure. |

---

## Week 5-6 Trainer Checklist

### Before Week 5
- [ ] Zapier and Make accounts tested (know free tier limits)
- [ ] Google Form for demo automation pre-built
- [ ] Gmail connected to Zapier/Make and tested
- [ ] Google Sheets automation tested end-to-end
- [ ] WhatsApp integration options researched (document limitations transparently)
- [ ] Notion account tested, demo workspace pre-built
- [ ] Sample sales dataset created for Session 19

### Before Week 6
- [ ] Botpress account tested, sample bot pre-built
- [ ] ChatGPT Plus account available (trainer's) for Custom GPT demos
- [ ] Voiceflow account tested
- [ ] AI voice bot demo video downloaded (backup for slow internet)
- [ ] Chatbot quality checklist printed (1 per student)
- [ ] Business owners from Week 4 contacted -- informed their chatbot is coming
- [ ] Showcase schedule planned (who presents, in what order)

### End of Week 6
- [ ] All Week 5 deliverables graded (3 automations + documentation)
- [ ] All Week 6 deliverables graded (working chatbot + documentation)
- [ ] Grades entered in TARAhut tracking sheet
- [ ] Weekly report submitted to HQ
- [ ] 2 session recordings uploaded
- [ ] Students reminded to prepare for career/freelancing focus in Week 7
- [ ] Demo Day logistics started (venue, invitations, certificate printing)

---

*Trainer Manual -- Weeks 5-6 | TARAhut AI Labs | Confidential*
