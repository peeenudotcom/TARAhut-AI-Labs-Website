# AI Career Lab – Career Path Finder

## Complete Product Specification for TARAhut AI Labs

---

## Overview

An interactive, gamified career discovery tool that helps users find their ideal AI career path in under 60 seconds. Rule-based logic (no API cost), mobile-first, designed for the Indian market with specific focus on Punjab/North India.

**URL:** `/tools/career-lab`
**Standalone mode:** `?standalone=true` (hides nav/footer for ads & sharing)
**Stack:** Next.js App Router, React (client component), Supabase (counter + optional lead capture), localStorage (result persistence)

---

## Target Audiences

| Audience | Their Anxiety | What They Need to Hear |
|---|---|---|
| Students (Class 10-12) | "Will AI replace my future career?" | "You're starting at the perfect time" |
| College Students | "What should I learn to get placed?" | "Companies are hiring for this right now" |
| Working Professionals | "Am I becoming irrelevant?" | "Your experience + AI skills = unstoppable" |
| Business Owners | "How do I use AI without hiring expensive people?" | "You can automate 40% of your work yourself" |

---

## Core Structure (7 Screens)

```
1. Hook Screen
2. Step 1: Who Are You (branches the flow)
3. Step 2: Context (branched by Step 1)
4. Step 3: Interests (multi-select)
5. Step 4: Personality
6. Step 5: Goals (multi-select)
7. Step 6: Skill Level
8. AI Processing Animation
9. Results Screen + Conversion Layer
```

---

## Screen 1: Hook Screen

```
Headline: "Let AI Analyze Your Future in 60 Seconds"
Subtext: "Answer a few quick questions. Get your personalized AI career path, salary potential, and 90-day roadmap."
Badge: "4,832 career paths discovered" (live counter from Supabase)
CTA: [Start My Career Analysis] (green button, full width on mobile)
```

**Design:**
- Center aligned, clean
- Subtle animated gradient background or floating AI-themed icons
- Mobile-first (full viewport height)
- Trust line below CTA: "Free. No signup. Takes 60 seconds."

---

## Screen 2: Step 1 — "I am a..."

**Purpose:** This branches the entire flow. Most important question.

```
Question: "Which best describes you?"
Type: Single select (card-based, large tap targets)

Options:
- 🎒 School Student (Class 10-12)
- 🎓 College Student
- 💼 Working Professional
- 🏪 Business Owner
```

**Design:** 2x2 grid on mobile, 4-column on desktop. Each card has icon + title. Selected state = green border + checkmark.

---

## Screen 3: Step 2 — Context (Branched)

### If School Student:
```
Question: "What's your stream?"
Options:
- Science (PCM/PCB)
- Commerce
- Arts / Humanities
- Haven't decided yet
```

### If College Student:
```
Question: "What are you studying?"
Options:
- Engineering / BCA / BSc CS
- BBA / MBA / Commerce
- Arts / Media / Design
- Other
```

### If Working Professional:
```
Question: "What's your industry?"
Options:
- IT / Software
- Marketing / Sales
- Finance / Banking
- Education / Other
```

### If Business Owner:
```
Question: "What type of business?"
Options:
- Retail / E-commerce
- Services / Agency
- Manufacturing
- Other
```

---

## Screen 4: Step 3 — Interests (Multi-Select)

```
Question: "What excites you? Pick all that apply."
Type: Multi-select (min 1, max 3)

Options:
- 💻 Technology & Tools
- 📊 Data & Analytics
- 🎨 Creativity & Design
- 💬 Communication & Content
- 📈 Business & Strategy
```

**Design:** Pill/chip style selections. Selected = filled green. Show "Pick up to 3" hint.

---

## Screen 5: Step 4 — Personality

```
Question: "Close your eyes for a second. Which sounds most like you?"
Type: Single select

Options:
- 🧩 I like solving problems
- 🎬 I like creating things
- 👥 I like leading people
- 📉 I like analyzing patterns
```

---

## Screen 6: Step 5 — Goals (Multi-Select)

```
Question: "What matters most to you? Pick up to 3."
Type: Multi-select (min 1, max 3)

Options:
- 💰 High income
- 🌍 Work from anywhere / abroad
- 🔒 Job security
- 🎯 Freelancing / Side income
- 🏗️ Build my own business
```

---

## Screen 7: Step 6 — AI Skill Level

```
Question: "Where are you with AI right now?"
Type: Single select

Options:
- 🌱 Complete beginner
- 🔍 I've tried ChatGPT / basic tools
- ⚡ I use AI tools regularly
```

---

## UI Requirements for Question Flow

- **Progress bar** at top (accelerates toward end — steps 1-3 are 60%, steps 4-6 are 40%)
- **Back button** (top left)
- **Auto-advance** after single-select (300ms delay for visual feedback)
- **"Next" button** for multi-select steps
- **Smooth slide transitions** (left-to-right)
- **Mobile:** Full screen, large tap targets (min 48px), no scrolling needed per step
- **Haptic feedback** on selection: `navigator.vibrate?.(10)`

---

## Screen 8: AI Processing Animation

**Duration:** 2.5 seconds total

```
Rotating text (fade in/out every 800ms):
1. "Analyzing your personality..."
2. "Matching with real-world careers..."
3. "Building your roadmap..."
```

**Visual:** Centered spinner or pulsing brain icon. Dark or gradient background.

---

## Screen 9: Results Screen

This is the most important screen. It has multiple sections scrolling vertically.

---

### Section A: Career Identity Reveal

```
Typing animation reveals:
"You are a..."
✦ DATA-DRIVEN STRATEGIST ✦

One-liner: "You combine analytical thinking with strategic vision — 
the exact profile companies are hiring for in 2025."
```

**Design:** Large text, center aligned, confetti animation on reveal. Career title uses gradient text matching site brand colors.

---

### Section B: Your AI DNA (Strength Breakdown)

Visual horizontal bar chart:

```
Analytical    ████████████░░  85%
Creativity    ██████░░░░░░░░  45%
Strategy      █████████░░░░░  70%
Communication ███████░░░░░░░  55%
Leadership    ████░░░░░░░░░░  30%
```

**Calculation logic:**

| Trait | Scores from |
|---|---|
| Analytical | Interest: Data & Analytics (+30), Personality: Analyzing patterns (+30), Goals: High income (+10) |
| Creativity | Interest: Creativity & Design (+30), Personality: Creating things (+30), Goals: Freelancing (+10) |
| Strategy | Interest: Business & Strategy (+30), Personality: Solving problems (+20), Goals: Build business (+10) |
| Communication | Interest: Communication & Content (+30), Personality: Leading people (+20), Goals: Work abroad (+10) |
| Leadership | Personality: Leading people (+30), Goals: Build business (+20), Interest: Business & Strategy (+10) |

Base score: 20 for each trait. Cap at 95. Add 5-10 random variance for uniqueness.

**Design:** Animated bars that fill on scroll-into-view. Each bar uses a different color.

---

### Section C: Top 3 Career Matches

Show 3 cards, ranked by match percentage.

Each card:
```
┌──────────────────────────────────┐
│ 🏆 #1 MATCH — 94%               │
│                                  │
│ AI Business Analyst              │
│                                  │
│ Why it fits you:                 │
│ Your analytical mindset and      │
│ business interest make you       │
│ perfect for turning data into    │
│ decisions.                       │
│                                  │
│ What you'd do:                   │
│ Analyze business data, create    │
│ AI dashboards, automate reports  │
│                                  │
│ 💰 Salary Range (India):        │
│ Entry: 5-8 LPA                   │
│ With 2yr exp: 10-18 LPA          │
│ Freelance: $25-60/hr             │
│                                  │
│ 📚 Recommended Course:           │
│ AI Tools Mastery → [View Course] │
└──────────────────────────────────┘
```

---

### Section D: Your Two Futures (Comparison)

```
┌─────────────────┐  ┌─────────────────┐
│  WITHOUT AI      │  │  WITH AI         │
│  SKILLS          │  │  SKILLS          │
│                  │  │                  │
│  Same role       │  │  New career      │
│  4-6 LPA         │  │  10-18 LPA       │
│  Limited options  │  │  Global demand   │
│  Replaceable     │  │  Irreplaceable   │
│                  │  │                  │
│  ⚠️ 2027: At     │  │  🚀 2027: Lead   │
│  risk of being   │  │  your industry   │
│  automated       │  │  with AI         │
└─────────────────┘  └─────────────────┘
```

**Design:** Two side-by-side cards. Left = muted/gray. Right = green/vibrant. Clear visual contrast.

---

### Section E: 90-Day Roadmap

```
Month 1: LEARN
├── Master 5 core AI tools
├── Complete foundational course
└── Build first AI workflow

Month 2: PRACTICE  
├── Work on 3 real projects
├── Create your AI portfolio
└── Join peer study group

Month 3: EARN
├── Apply for AI-related roles
├── Start freelancing on Fiverr/Upwork
└── Build personal brand with AI content
```

**Design:** Vertical timeline with icons. Clean, minimal.

---

### Section F: Global Opportunity

```
"Your career path — [AI Business Analyst] — is in demand globally."

🇦🇺 Australia — $75K-120K AUD
🇬🇧 United Kingdom — £40K-70K GBP  
🇨🇦 Canada — $65K-100K CAD
🇺🇸 United States (Remote) — $60K-120K USD

"With the right skills, you can work from India for global companies."
```

---

### Section G: Parent-Friendly Summary

```
Heading: "Share This With Your Parents"

Card content:
"Your child has the profile of an [AI Business Analyst] — 
one of the top 5 fastest-growing careers globally. 

Starting salaries in India: 6-12 LPA
Remote international opportunities: Available
Skills required: Practical training (3-6 months), not a 4-year degree
Career stability: AI roles are projected to grow 40% by 2027"

[Send to Parent on WhatsApp]
```

WhatsApp pre-filled message:
```
"Hi, I just took an AI career assessment at TARAhut AI Labs. 
It says I have the profile of an [career title]. 
Starting salary: [X] LPA. Can we discuss this? 
See full details: [URL with result]"
```

---

### Section H: Social Proof

```
"People Like You"

"127 people with a similar profile joined TARAhut AI Labs last quarter.
42 are already using AI professionally."
```

(Use seeded numbers initially, update with real data over time)

---

### Section I: Conversion Layer (CTA Section)

```
Heading: "Ready to Start Your AI Journey?"

Primary CTA:
[Get My Plan on WhatsApp] (green, full width)
→ Pre-filled: "Hi, I just used AI Career Lab. My top match is [career]. 
   I'm a [role] in [industry]. Can you suggest the best course for me?"

Secondary CTA:
[Share My Result] 
→ Options: Copy link, WhatsApp share, Download result card

Tertiary:
[Challenge a Friend]
→ WhatsApp message: "I'm a [career title]! Find your AI career path 
   in 60 seconds: [URL]"
```

---

## Career Archetypes (10 Total)

### Mapping Logic

```javascript
const archetypes = [
  {
    id: 'data-analyst',
    title: 'AI Data Analyst',
    identity: 'Data-Driven Strategist',
    triggers: {
      interests: ['data-analytics', 'technology'],
      personality: 'analyzing-patterns',
      goals: ['high-income', 'job-security']
    },
    salary: { entry: '5-8 LPA', mid: '10-18 LPA', freelance: '$25-60/hr' },
    course: 'AI Tools Mastery',
    courseUrl: '/courses/ai-tools-mastery',
    description: 'Turn raw data into business decisions using AI',
    fitReason: 'Your analytical mindset and data interest make you perfect for this',
    dayToDay: 'Analyze business data, create AI dashboards, automate reports',
    globalDemand: ['Australia', 'UK', 'Canada', 'US'],
  },
  {
    id: 'content-creator',
    title: 'AI Content Creator',
    identity: 'Creative Visionary',
    triggers: {
      interests: ['creativity', 'communication'],
      personality: 'creating-things',
      goals: ['freelancing', 'work-abroad']
    },
    salary: { entry: '3-6 LPA', mid: '8-15 LPA', freelance: '$20-50/hr' },
    course: 'AI for Marketing',
    courseUrl: '/courses/ai-marketing',
    description: 'Create content at 10x speed using AI tools',
    fitReason: 'Your creative drive and communication skills are a perfect match',
    dayToDay: 'Write content, design graphics, produce videos using AI tools',
    globalDemand: ['US', 'UK', 'Dubai', 'Singapore'],
  },
  {
    id: 'marketing-strategist',
    title: 'AI Marketing Strategist',
    identity: 'Growth Architect',
    triggers: {
      interests: ['business', 'communication'],
      personality: 'solving-problems',
      goals: ['high-income', 'build-business']
    },
    salary: { entry: '4-7 LPA', mid: '10-20 LPA', freelance: '$30-70/hr' },
    course: 'AI for Marketing',
    courseUrl: '/courses/ai-marketing',
    description: 'Design AI-powered marketing campaigns and growth strategies',
    fitReason: 'Your strategic thinking and business sense are exactly what brands need',
    dayToDay: 'Plan campaigns, analyze performance, optimize with AI automation',
    globalDemand: ['US', 'UK', 'Australia', 'Canada'],
  },
  {
    id: 'business-consultant',
    title: 'AI Business Consultant',
    identity: 'Strategic Leader',
    triggers: {
      interests: ['business', 'data-analytics'],
      personality: 'leading-people',
      goals: ['high-income', 'build-business']
    },
    salary: { entry: '6-10 LPA', mid: '15-30 LPA', freelance: '$50-100/hr' },
    course: 'AI Tools Mastery',
    courseUrl: '/courses/ai-tools-mastery',
    description: 'Help businesses transform operations with AI',
    fitReason: 'Your leadership drive and business interest make you a natural consultant',
    dayToDay: 'Audit business processes, recommend AI solutions, lead implementation',
    globalDemand: ['US', 'UK', 'Australia', 'Singapore'],
  },
  {
    id: 'ai-developer',
    title: 'AI Developer',
    identity: 'Technical Innovator',
    triggers: {
      interests: ['technology', 'data-analytics'],
      personality: 'solving-problems',
      goals: ['high-income', 'work-abroad']
    },
    salary: { entry: '6-10 LPA', mid: '15-35 LPA', freelance: '$40-100/hr' },
    course: 'Python & AI Development',
    courseUrl: '/courses/python-ai-dev',
    description: 'Build AI applications and automation systems',
    fitReason: 'Your tech interest and problem-solving mindset are the foundation of every great developer',
    dayToDay: 'Write code, build AI apps, create automation pipelines',
    globalDemand: ['US', 'Canada', 'Germany', 'Australia'],
  },
  {
    id: 'ai-educator',
    title: 'AI Educator & Trainer',
    identity: 'Knowledge Catalyst',
    triggers: {
      interests: ['communication', 'technology'],
      personality: 'leading-people',
      goals: ['job-security', 'freelancing']
    },
    salary: { entry: '4-7 LPA', mid: '8-15 LPA', freelance: '$20-50/hr' },
    course: 'Prompt Engineering',
    courseUrl: '/courses/prompt-engineering',
    description: 'Teach others how to use AI effectively',
    fitReason: 'Your communication skills and tech interest make you a natural AI trainer',
    dayToDay: 'Create courses, conduct workshops, build training content',
    globalDemand: ['India', 'Southeast Asia', 'Middle East', 'Africa'],
  },
  {
    id: 'automation-expert',
    title: 'AI Automation Expert',
    identity: 'Efficiency Engineer',
    triggers: {
      interests: ['technology', 'business'],
      personality: 'solving-problems',
      goals: ['high-income', 'build-business']
    },
    salary: { entry: '5-8 LPA', mid: '12-22 LPA', freelance: '$30-80/hr' },
    course: 'AI Tools Mastery',
    courseUrl: '/courses/ai-tools-mastery',
    description: 'Automate business workflows and save thousands of hours',
    fitReason: 'Your problem-solving drive and tech interest are perfect for automation',
    dayToDay: 'Build AI workflows, connect tools, eliminate manual processes',
    globalDemand: ['US', 'UK', 'Australia', 'Canada'],
  },
  {
    id: 'design-specialist',
    title: 'AI Design Specialist',
    identity: 'Visual Innovator',
    triggers: {
      interests: ['creativity', 'technology'],
      personality: 'creating-things',
      goals: ['freelancing', 'high-income']
    },
    salary: { entry: '3-6 LPA', mid: '8-18 LPA', freelance: '$25-60/hr' },
    course: 'AI for Marketing',
    courseUrl: '/courses/ai-marketing',
    description: 'Create stunning designs and visuals using AI',
    fitReason: 'Your creative eye and tech comfort are what modern design teams need',
    dayToDay: 'Design with Midjourney/Canva AI, create brand assets, produce visual content',
    globalDemand: ['US', 'UK', 'Dubai', 'Singapore'],
  },
  {
    id: 'sales-growth',
    title: 'AI Sales & Growth Pro',
    identity: 'Revenue Accelerator',
    triggers: {
      interests: ['communication', 'business'],
      personality: 'leading-people',
      goals: ['high-income', 'build-business']
    },
    salary: { entry: '4-8 LPA', mid: '10-25 LPA', freelance: '$30-70/hr' },
    course: 'AI for Marketing',
    courseUrl: '/courses/ai-marketing',
    description: 'Use AI to find leads, close deals, and grow revenue',
    fitReason: 'Your people skills and business drive are the foundation of AI-powered sales',
    dayToDay: 'Generate leads with AI, automate outreach, analyze sales data',
    globalDemand: ['US', 'UK', 'India', 'Australia'],
  },
  {
    id: 'operations-manager',
    title: 'AI Operations Manager',
    identity: 'Systems Thinker',
    triggers: {
      interests: ['data-analytics', 'business'],
      personality: 'analyzing-patterns',
      goals: ['job-security', 'high-income']
    },
    salary: { entry: '5-8 LPA', mid: '12-22 LPA', freelance: '$30-60/hr' },
    course: 'AI Tools Mastery',
    courseUrl: '/courses/ai-tools-mastery',
    description: 'Optimize business operations using AI and data',
    fitReason: 'Your analytical mind and pattern recognition are exactly what operations teams need',
    dayToDay: 'Optimize processes, manage AI tools, analyze operational data',
    globalDemand: ['Australia', 'Canada', 'UK', 'Singapore'],
  },
]
```

### Matching Algorithm

```
For each archetype:
  score = 0
  
  For each user interest that matches archetype.triggers.interests:
    score += 25
  
  If user personality === archetype.triggers.personality:
    score += 30
  
  For each user goal that matches archetype.triggers.goals:
    score += 15
  
  // Context bonus (from branched Step 2)
  If user is professional + archetype involves business/consulting:
    score += 10
  If user is student + archetype involves learning/creativity:
    score += 10
  If user is business owner + archetype involves automation/operations:
    score += 10

Sort by score descending. Return top 3.
Add slight random variance (±3) so retakes feel fresh.
```

---

## Shareable Result Card (Image Generation)

Generate a canvas-based image (or use HTML-to-canvas) sized for Instagram Stories (1080x1920):

```
┌─────────────────────────────────┐
│                                 │
│  YOUR AI CAREER DNA             │
│  ─────────────────              │
│                                 │
│  ██████████░░  Analytical  85%  │
│  ██████░░░░░░  Creativity  45%  │
│  █████████░░░  Strategy    70%  │
│  ███████░░░░░  Communic.   55%  │
│  ████░░░░░░░░  Leadership  30%  │
│                                 │
│  You are a                      │
│  ✦ DATA-DRIVEN STRATEGIST ✦    │
│                                 │
│  #1 Match: AI Business Analyst  │
│  Earning Potential: 8-18 LPA    │
│                                 │
│  Find yours in 60 seconds:      │
│  tarahutailabs.com/career-lab            │
│  ─────────────────────────────  │
│  TARAhut AI Labs                  │
└─────────────────────────────────┘
```

Use `html2canvas` or similar library to generate downloadable image.

---

## Data Persistence

### localStorage (Immediate)
```javascript
// Save on result generation
localStorage.setItem('careerLabResult', JSON.stringify({
  answers: { ... },
  topMatch: 'AI Business Analyst',
  identity: 'Data-Driven Strategist',
  scores: { analytical: 85, creativity: 45, ... },
  completedAt: '2026-04-07T06:00:00Z'
}))
```

### Supabase (Analytics + Lead Capture)

**Table: `career_lab_completions`**
```sql
CREATE TABLE career_lab_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audience_type TEXT,        -- student, college, professional, business
  context TEXT,              -- stream/field/industry
  interests TEXT[],
  personality TEXT,
  goals TEXT[],
  skill_level TEXT,
  top_match TEXT,
  identity TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Table: `career_lab_counter`**
```sql
CREATE TABLE career_lab_counter (
  id INT PRIMARY KEY DEFAULT 1,
  count INT DEFAULT 0
);
-- Seed with initial value
INSERT INTO career_lab_counter (id, count) VALUES (1, 2847);
```

**API Route: `/api/career-lab/complete`**
- POST: Save completion + increment counter
- GET: Return current counter value

---

## Standalone Mode

When URL has `?standalone=true`:
- Hide site header/navigation
- Hide site footer
- Show minimal TARAhut logo (top left)
- Full-screen experience
- Used for: paid ads, WhatsApp sharing, event kiosks

---

## Re-Entry Experience

When user returns to `/tools/career-lab` and has localStorage result:

```
"Welcome back! Your last result:"

✦ DATA-DRIVEN STRATEGIST ✦
Top Match: AI Business Analyst

[See My Full Result]  [Retake Quiz]  [Talk to Counselor]
```

---

## WhatsApp Message Templates

### Primary CTA (after results)
```
Hi, I just used the AI Career Lab at TARAhut AI Labs.

My profile: [identity]
Top career match: [career title]
I'm a [audience type] in [context].

Can you suggest the best course for me?
```

### Parent Share
```
Hi, I just took an AI career assessment.

My result: [career title]
Salary potential: [entry] to [mid] per year
Global demand: High in [countries]

Details: [URL]
Can we discuss this?
```

### Friend Challenge
```
I just discovered my AI career path — I'm a [identity]! 🚀

Find yours in 60 seconds (free, no signup):
[URL]
```

---

## SEO & Meta

```
Title: "AI Career Lab – Find Your AI Career Path in 60 Seconds | TARAhut AI Labs"
Description: "Free AI-powered career discovery tool. Answer 5 questions, get your personalized AI career path, salary potential, and 90-day roadmap. No signup required."
OG Image: Pre-designed card showing the tool interface
```

---

## Performance Requirements

- Zero API calls during quiz (all client-side)
- Single API call on completion (save to Supabase + get counter)
- Page load < 2s
- Total JS bundle for this page < 50KB
- Animations: CSS transitions preferred, framer-motion only where needed
- Images: None required (emoji + CSS-based visuals)

---

## File Structure

```
src/app/(marketing)/tools/career-lab/
├── page.tsx              # Main page (metadata + layout)
├── career-lab.tsx        # Client component (all screens + state)
├── career-data.ts        # Archetypes, questions, scoring logic
├── career-engine.ts      # Matching algorithm + score calculation
└── career-results.tsx    # Results screen component (complex, worth splitting)

src/app/api/career-lab/
├── complete/route.ts     # POST: save completion, GET: counter
```

---

## Integration Points on Existing Site

1. **Tools page (`/tools`):** Add a hero banner card above the 3 tools
   ```
   "🧬 NEW: AI Career Lab"
   "Discover your AI career path in 60 seconds"
   [Try Career Lab →]
   ```

2. **Homepage:** Add section or banner linking to Career Lab

3. **Course pages:** Add "Not sure? Try Career Lab" link in sidebar/header

4. **Blog posts:** Auto-inject Career Lab CTA at end of career-related posts

5. **Navigation:** Add "Career Lab" under "Free Tools" dropdown (if exists)

---

## Distribution Checklist

- [ ] Build & deploy on website
- [ ] Seed WhatsApp groups (existing student groups)
- [ ] Create Instagram Reel showing the tool
- [ ] Set up standalone landing page for ads
- [ ] Share with franchise partner (Rohit) for his network
- [ ] Partner with 2-3 college placement cells
- [ ] Create QR code poster for offline events
- [ ] Set up Instagram Story template for result sharing
- [ ] A/B test hook screen copy after 500 completions

---

## Success Metrics

| Metric | Target (Month 1) |
|---|---|
| Completions | 500+ |
| WhatsApp CTA clicks | 15% of completions |
| Share/challenge clicks | 10% of completions |
| Avg time to complete | < 60 seconds |
| Return visitors | 20% |
| Course inquiries from Career Lab | 30+ |
