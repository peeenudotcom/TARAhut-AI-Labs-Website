# Learn Playground Playbook

> **Purpose:** This doc lets a future agent design a complete AI playground for any TARAhut Learn course session WITHOUT real-time human feedback. It codifies the patterns we validated across all 16 sessions of *AI Tools Mastery for Beginners*.

---

## The Core Thesis

Most AI courses end at *"here's a prompt, try it yourself."* TARAhut playgrounds end at **"send / post / use this today."**

The difference isn't content — every AI course teaches the same tools. It's the **behaviour loop** that turns generation into market contact.

The validated unit of behaviour:

```
generate → understand → compare → DO → progress
```

Every session must complete that arc. If a session ends at "generate", it's broken.

---

## Behaviour Tiers

Map every session to ONE of these tiers. Pattern stack changes per tier.

| Tier | What it produces | Examples (Tools Mastery) | Pattern intensity |
|---|---|---|---|
| **A — Foundation** | First exposure / knowledge | S1 (What is AI?), S2 (mindset) | Minimal: just outputHeadline + successHeadline + simple actions |
| **B — Single execution** | One sendable asset | S6 proposal, S7 brief, S8 deck | Full stack: useWhereHint + intentCommit + finishLine + send buttons |
| **C — Consistency** | Streak / habit | S11 7-day calendar | Full stack tuned for repeat: lighter intentCommit ("Day 1 today, not all 7") |
| **D — Identity** | Cross-surface adoption | S12 brand kit | Full stack tuned for "update one place today" + sectionMatch on each element |
| **E — Build-once asset** | Live URL / live tool | S13 Bolt site, S5 Custom GPT | Full stack tuned for "first version live in <2 min" |
| **F — Money moment** | Real client interaction | S14 capstone, S15 hire-me, S16 outreach | Full stack + sendCommit + per-message sectionMatch |

Pick the tier first. Pattern stack follows.

---

## The 8 Validated Patterns

### 1. `outputHeadline` + `successHeadline` — identity shift

Replace "AI Response" with what the student MADE. Use first-person past tense in success.

✅ `outputHeadline: "✨ Your Personal 30-Day AI Business Plan — Ready to Execute"`
❌ `outputHeadline: "AI Output"`

✅ `successHeadline: "You've trained AI on your own brand voice."`
❌ `successHeadline: "Generation complete."`

### 2. `useWhereHint` — channel grounding

Names the real distribution channels. Eliminates "where do I use this?"

```ts
useWhereHint: '📤 Send this to a real local business via: 💬 WhatsApp · 📧 Email · 📩 Instagram DM · 💼 LinkedIn'
```

**When to skip:** pure-skill sessions (RCTF prompting, voice cloning) where there's no clear distribution moment yet.

### 3. `intentCommit` — rehearsal moment BEFORE action

Single tap converts intention to commitment. Sits ABOVE the action buttons. 4 fields:

```ts
intentCommit: {
  reinforcement: 'Send the WhatsApp reply to ONE person who asked "what do you do?" today — even if it feels a little awkward. That\'s how this starts working.',
  ctaLabel: '✔ I\'ll send it to someone today',
  confirmedLine: 'Locked in.',
  nextMicroStep: 'Tap WhatsApp below — your reply is already loaded. Pick the contact + send (60 seconds)',
}
```

**Why each beat matters:**
- `reinforcement`: normalises the friction (the "awkward" line is critical — give permission, not pressure)
- `ctaLabel`: imperative + "today" anchor
- `confirmedLine`: short affirmation only — ❌ "Locked in. Now go do this and that and..."
- `nextMicroStep`: imperative + tool name + time anchor in parens — kills hesitation between commitment and action

### 4. `finishLine` — 3-beat stop condition

Sits BELOW action buttons. Three beats handle the three biggest drop-offs in sequence:

```ts
finishLine: {
  primary: '🏁 Don\'t try to send all 10 — just send Message 1 now.',           // kills overwhelm
  microNudge: '💡 Start with Message 1 (Curiosity Hook) — it\'s your safest opener.', // kills starting friction
  followThroughNudge: '📲 Get 1 reply this week — that\'s your first real lead, not just a sent message.', // ties to outcome
}
```

The third line is visually separated (border-top, green text) so it reads as "the real outcome", not another instruction.

### 5. `sectionMatch` — focus extraction primitive

The most reusable infrastructure win. Copy/whatsapp actions can extract just one section of the response. Solves the universal UX problem: "users don't want everything, they want the next thing."

```ts
{ label: '💬 Send Message 1 via WhatsApp', action: { type: 'whatsapp', sectionMatch: 'Message 1' } }
{ label: '📋 Copy Day 1 post', action: { type: 'copy', sectionMatch: 'Day 1' } }
{ label: '📋 Copy Instagram bio', action: { type: 'copy', sectionMatch: 'Instagram Bio' } }
```

**Pairs with system prompt design:** for sectionMatch to work cleanly, the system prompt MUST output sections with `## Heading` markers and the section body should be **plain text only** (no quote blocks, no bullets) when intended for sending to chat platforms. Markdown formatting characters appear literally in the destination.

### 6. `realWorldActions` — channel-launcher buttons (NOT save buttons)

Right pattern: tools for sending/using.

```ts
realWorldActions: [
  { label: '💬 Open WhatsApp', action: { type: 'whatsapp' } },           // pre-fills with output
  { label: '🚀 Open Bolt.new', action: { type: 'open-url', url: 'https://bolt.new', copyFirst: true } },
  { label: '📋 Copy Day 1 post', action: { type: 'copy', sectionMatch: 'Day 1' } },
  { label: '📧 Email to prospect', action: { type: 'email' } },
]
```

**Wrong pattern (storage):** "📋 Copy" + "📧 Email to myself" only — these are filing actions, not execution actions.

**Tool URL reference:**
- WhatsApp Web (clean canvas): `https://web.whatsapp.com/`
- WhatsApp with pre-fill: handled by `whatsapp` action type
- Instagram bio edit: `https://www.instagram.com/accounts/edit/`
- Instagram DM inbox: `https://www.instagram.com/direct/inbox/`
- LinkedIn DM: `https://www.linkedin.com/messaging/`
- ChatGPT GPT Builder: `https://chatgpt.com/gpts/editor`
- Gamma: `https://gamma.app/create`
- Canva: `https://www.canva.com/create/presentations/`
- Bolt.new: `https://bolt.new`
- Midjourney: `https://www.midjourney.com/imagine`
- Ideogram: `https://ideogram.ai/t/explore`
- Leonardo: `https://app.leonardo.ai/image-generation`
- HeyGen: `https://app.heygen.com/create`
- CapCut: `https://www.capcut.com/editor`

### 7. `comparison` + `whyItWorked` — teaching primitives

Show "without technique" vs "with technique" side-by-side. Then explain WHY in 4 short bullets.

**When to use:** sessions teaching a TECHNIQUE (RCTF, few-shot, structured proposals).
**When to skip:** sessions producing a personalised asset (career plan, brand kit, hire-me page) — there's no meaningful "without" version.

For Session 4-style "voice cloning" tasks, override the comparison labels:

```ts
comparison: {
  basicPromptLabel: 'The voice from your 3 source examples',
  basicOutput: '...',
  leftHeader: '📚 Your 3 source examples',
  rightHeader: '✨ AI matched the voice',
  leftSubLabel: 'Original style',
  rightSubLabel: 'Generated style',
}
```

### 8. `sendCommit` — post-action confirmation

After user clicks any send action, ask "Did you actually send this?" with Yes/Not yet. Yes triggers identity reinforcement; Not yet triggers a nudge.

**When to use:** high-stakes single actions (proposal, first reply, outreach #1).
**When to skip:** streak sessions where commitment is implicit. Currently only Session 6 has it — validate before scaling.

### Bonus primitives also in the toolkit

- `examples` cards (S4): structured few-shot examples shown ABOVE the textarea, lifts them out of the prompt
- `testReflection` (S5): post-action multi-select chips ("What did your AI assistant fix?") with identity-shifting line
- `intentCommit.nextMicroStep` two-beat structure: `confirmedLine` (affirmation) + `nextMicroStep` (directive with time anchor)

---

## The Critique Checklist

Run every session through this BEFORE shipping. If any answer is "no", refine.

### Identity reframe
- [ ] `outputHeadline` names the deliverable, not "AI response"
- [ ] `successHeadline` is first-person past tense ("You just ___") OR identity-shifting ("This is your ___")

### Zero ambiguity on the next step
- [ ] `useWhereHint` names actual channels (not "use this somewhere")
- [ ] At least ONE action button is a channel-launcher, not a storage button
- [ ] `continueButtonLabel` is action-driven ("Send your first ___ → Continue to Session N+1")

### Loop closes on real-world action
- [ ] `yourTurnBody` pushes "this week" / "today", not "eventually"
- [ ] `finishLine.followThroughNudge` names the OUTCOME ("first reply", "first client"), not just activity ("10 sent messages")
- [ ] If `intentCommit` is present, `nextMicroStep` is imperative + tool name + time anchor

### Banned phrases (in any output the system prompt produces)
- [ ] No "engaging", "high-quality", "premium" filler
- [ ] No "let me know if you're interested" in any sample message
- [ ] No corporate-speak ("Dear Sir / Madam", "I am writing to inform you")
- [ ] No `[BRACKETED]` placeholders in output meant to be sent as-is (only in `yourTurnTemplate`)
- [ ] No lorem-ipsum testimonials with fake names

### Local context
- [ ] At least one example uses Punjab / Tier-2 India anchor (sweets shop, boutique, coaching centre, Patiala/Kotkapura/Bathinda) UNLESS the audience is different (see Audience Adaptation below)
- [ ] Punjabi/Hindi support mentioned in system prompt where natural

### Validate-first discipline
- [ ] If proposing a NEW pattern not yet shipped, am I forcing it or does it earn its place?
- [ ] Did I propose the smallest cut that delivers value, not the maximum?
- [ ] If I'm tempted to backfill across other sessions, did I HOLD and wait for validation data?

---

## Per-Session Build Workflow

For each session, in order:

1. **Read the session config** — title, description, deliverable, audience
2. **Pick the behaviour tier** (A-F above)
3. **Design the playgroundTask config** with the minimum required fields:
   - `taskTitle`, `taskDescription`, `timeEstimate`
   - `starterPrompt` (pre-filled with a real Punjab business scenario)
   - `outputHeadline`, `successHeadline`, `continueButtonLabel`
   - `proTipChips`, `outroLine`
   - 2-3 `refinementChips` (one-tap iterations)
4. **Add tier-appropriate patterns** per the table above
5. **Write the system prompt** in `route.ts` with quality bars + banned phrases for THIS session's task. Mandate plain-text bodies for sectionMatch sections that target chat platforms.
6. **Add CTA to the lesson HTML** at the most relevant section (usually end of the most thematically-aligned section, before its `curiosity-hook`)
7. **Self-critique against the checklist** — be strict, raise the bar
8. **Refine** based on critique
9. **Type-check + commit**

For a complete course (multiple sessions), batch into ONE PR per course. User reviews end-to-end, not per-session.

---

## Audience Adaptation

The patterns are universal. The voice + examples are not. When the course audience differs from "Punjab freelancer / small business owner", adapt these specific things:

| Element | Tools Mastery default | Kids course | Executive course | Builder course |
|---|---|---|---|---|
| `starterPrompt` examples | Sweets shop, boutique | School project, family situation | B2B / quarter / stakeholder | Side project, hackathon |
| `intentCommit` framing | "Send to one prospect today" | "Show this to your teacher / parent today" | "Forward to one stakeholder this week" | "Push this to GitHub today" |
| Cultural anchors | Punjab villages, festivals (Diwali, Karva Chauth) | School context, Punjabi rhymes, family | Industry verticals, quarterly cadence | Open-source, Hacker News, Twitter |
| `useWhereHint` channels | WhatsApp, IG, LinkedIn | Class WhatsApp group, parent WhatsApp | Email, LinkedIn, Slack | GitHub, Twitter, Discord |
| Tone of `successHeadline` | Locally proud ("Punjab freelancer who ships") | Playful + accomplished ("You taught AI something today") | Confident + measured ("This is the deck you'll present Monday") | Builder-pride ("This shipped, now scale it") |
| Banned phrases extension | corporate-speak | "amazing", "awesome" overuse | startup-bro lingo ("growth hacking", "10x") | marketing fluff ("revolutionary", "game-changing") |

Everything else (structure, patterns, critique checklist) stays identical.

---

## Anti-patterns

- **Storage > usage**: "Copy to clipboard" as the primary action when the student should be sending something
- **Generation as the end**: success state that says "saved" without "now use it"
- **Overwhelm**: "Send all 10 messages today" when "Send Message 1 now" is more achievable
- **Generic anchor**: examples about "small businesses" instead of "Patiala saree boutiques"
- **Marketing-frame on functional CTAs**: "Loved it?" or "Free trial" when "Use this for your idea →" works harder
- **Per-session breadth creep**: adding 4 new patterns to one session because they sound nice — pick the 1-2 the tier calls for
- **Forcing comparison**: every session does NOT need a side-by-side. Skip when there's no meaningful "without" version
- **Bulk pattern backfill**: don't add `sendCommit` to 12 sessions because you added it to S6. Validate first, scale later

---

## Validate-first principle

This rule prevents pattern bloat at scale.

> **Don't volunteer to backfill a new UI pattern across all sessions just because you added it to one. Validate that the pattern actually changes user behaviour in the test case first; then selectively apply only where it earns its place.**

When you ship a NEW pattern (something not in this playbook yet):
1. Apply to ONE session as the validation case
2. Do NOT proactively add to other sessions
3. Wait for behaviour data OR explicit user direction
4. THEN selectively apply only to sessions where the same friction exists
5. Once 2-3 sessions use the pattern successfully, ADD it to this playbook so it becomes part of the standard toolkit

---

## How to apply this playbook to a new course

1. Read this entire playbook (do not skim)
2. Read the course config — get audience, sessions list, deliverables
3. Identify the audience adaptation needed (see table above)
4. For each session, follow the Per-Session Build Workflow
5. Run the critique checklist before shipping ANY session
6. Ship the entire course as ONE PR (not session-by-session)
7. The user reviews PR end-to-end — that's the only intervention point
8. If user feedback exposes a missing pattern or a flaw in the playbook, UPDATE THIS DOCUMENT before moving to the next course

The first course you build with this playbook is the calibration PR. If quality lands, scale to the rest. If not, the user's feedback updates the playbook and you recalibrate.

---

## Reference: pattern usage in shipped sessions

| Pattern | Used in (Tools Mastery sessions) |
|---|---|
| `useWhereHint` | 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 |
| `intentCommit` | 7, 8, 10, 11, 12, 13, 14, 15, 16 |
| `finishLine` 3-beat | 9, 10, 11, 12, 13, 14, 15, 16 |
| `sectionMatch` (copy) | 11, 12, 14, 15, 16 |
| `sectionMatch` (whatsapp) | 14, 15, 16 |
| `sendCommit` | 6 (validation case — do NOT backfill yet) |
| `comparison` + `whyItWorked` | 3, 4, 5, 6, 8, 9, 13, 16 |
| `examples` (cards) | 4 |
| `testReflection` | 5 (validation case — do NOT backfill yet) |
| `open-url` with `copyFirst` | 5, 8, 9, 10, 13 |

---

*This playbook is living. Update it when a pattern is validated, when a new pattern is shipped twice with success, or when user feedback exposes a gap. The goal: a future agent can build a complete course playground autonomously by following this doc.*
