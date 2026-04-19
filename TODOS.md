# TODOS — TARAhut AI Labs

## Phase 2: WhatsApp Assessment Chatbot
**What:** Build a WhatsApp chatbot that runs the same 8-question business assessment via conversation.
**Why:** Punjab business owners are WhatsApp-first. If web quiz conversion is low (<5% completion rate), this is the fix.
**Pros:** Lower friction for target audience, feels personal, leverages existing WhatsApp presence.
**Cons:** Requires WhatsApp Business API ($), webhook server, conversation state management.
**Context:** Ship web quiz first (Phase 1), share assessment link via WhatsApp message. Measure completion rate. If low, prioritize this. The assessment questions and Claude prompt are reusable.
**Depends on:** Web assessment funnel shipped and live. Conversion data collected for 2-4 weeks.

## Phase 2: Drizzle ORM Migration
**What:** Set up Drizzle ORM with proper schema files and migrations. Migrate existing raw Supabase queries.
**Why:** Type-safe database queries, migration management, better DX as schema grows.
**Cons:** Requires refactoring all existing database queries. Not worth doing until codebase has 10+ tables.
**Depends on:** Phase 1 shipped and stable.

## Phase 2: Full Test Infrastructure
**What:** Complete Vitest + Playwright setup with CI integration. Unit tests for all API routes, E2E tests for critical flows.
**Why:** Phase 1 ships with minimal tests (AI prompt validation only). Full coverage needed before Phase 3 growth features.
**Depends on:** Phase 1 shipped.
