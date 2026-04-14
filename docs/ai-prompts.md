# AI Prompt History

This file documents the AI prompts used during development of this project, as required by the task specification.

## Workflow

Reviewed the task myself. Then I gave AI all the information about the task, all the requirements and additional insights needed to prepare a phase-by-phase prompt plan — meaning I give step-by-step prompts for a different agent for a comprehensive implementation, refining everything as I go.

## Phase 1 — Project Scaffolding & Architecture

**First prompt:**

> Task: Set up a new weather web app project with production-grade architecture
>
> Context: I'm building a weather web app as a senior engineer take-home task for Axiology. The app lets users search for a location with autocomplete, view current weather, and persist search history. This is Phase 1 — project scaffolding and architecture setup only. No feature code yet.
>
> Requirements:
>
> 1. Create the Next.js project (`npx create-next-app@latest weather-app --typescript --tailwind --app --eslint`)
> 2. Install dependencies — class-variance-authority, clsx, tailwind-merge, lucide-react, sonner, next-themes, zod, axios, date-fns, motion, zustand, @tanstack/react-query. Dev: vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, @vitejs/plugin-react, jsdom, prettier, eslint-config-prettier, eslint-plugin-prettier, eslint-plugin-simple-import-sort, eslint-plugin-jsx-a11y. Initialize shadcn/ui, add button, card, input, skeleton, sonner components.
> 3. Create folder structure with kebab-case directories: app/api/weather/, components/ (with ui/), hooks/, lib/, providers/, stores/, types/, **tests**/. Placeholder files for all feature components, hooks, lib functions, providers, stores.
> 4. Define TypeScript types (Location, WeatherData, SearchHistoryEntry) in src/types/index.ts
> 5. Create vitest.config.ts with jsdom, globals, coverage, path aliases
> 6. Write comprehensive CLAUDE.md (reference smc-gen's CLAUDE.md for style) covering commands, tech stack, project structure, code conventions, API integration, state management, HTTP & validation, error handling, testing
> 7. Documentation files: docs/implementation-plan.md (8 phases with target commit history), docs/testing-guidelines.md (Vitest, RTL, coverage targets), docs/coding-guidelines.md (TypeScript, components, naming, imports, error handling, state, CSS, accessibility)
> 8. AI_PROMPTS.md with Phase 1 entry
> 9. Update page.tsx (placeholder with SearchBar, WeatherCard, SearchHistory) and layout.tsx (metadata)
> 10. Git commit and verify (build, dev, test)
>
> Important: No feature code, only placeholders. No `any` types. Named exports only (except Next.js pages/layouts/routes). Use src/ directory. kebab-case everything.

**Refinements during implementation:**

- Updated coding and testing guidelines and CLAUDE.md based on my own experiences from previous projects. Made type-safety a priority (AI agents tend to ignore that).
- Updated folder structure for readability — consolidated test directories, co-located types guidance.
- Added husky + lint-staged for pre-commit linting/formatting enforcement.
- Added constants file for API URLs instead of .env (no secrets needed).
- Added next-intl for i18n — minimal setup cost, enforces clean separation of UI strings from components, easy to scale to multiple locales later.
- Added comprehensive README with tech stack justifications, architecture decisions, and known limitations.
- Removed auto-generated AGENTS.md.
- Fixed ESLint config (jsx-a11y plugin conflict with eslint-config-next, underscore prefix for unused vars).
- Migrated middleware.ts to proxy.ts (Next.js 16 convention).
- Added error.tsx and not-found.tsx error boundary pages with i18n support.
- Added logger service (`captureError`, `captureMessage`) — console logging now, structured for Sentry swap in production.
- Enforced strict i18n rule in CLAUDE.md: never hardcode English for user-facing text.
- Added i18n-aware `generateMetadata` on all public pages — localized title/description, title template in layout.
- Documented WCAG 2.1 AA and SEO approach in README architecture decisions.

**Used for:** Initial project setup, folder structure, type definitions, CLAUDE.md, docs/, vitest config, ESLint + Prettier + Husky setup, i18n, error boundaries, logger service, SEO metadata

**Commit:** `chore: initial project setup with Next.js, Tailwind, shadcn/ui`
