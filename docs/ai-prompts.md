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
- Added design system documentation (`docs/design-system.md`) — design philosophy, component architecture, layout patterns, theming, motion, accessibility, iconography.

**Used for:** Initial project setup, folder structure, type definitions, CLAUDE.md, docs/, vitest config, ESLint + Prettier + Husky setup, i18n, error boundaries, logger service, SEO metadata

**Commit:** `chore: initial project setup with Next.js, Tailwind, shadcn/ui`

## Phase 2 — API Layer & Zod Validation

**Second prompt:**

> Task: Implement weather and geocoding API layer with Zod validation
>
> Context
>
> I'm building a weather web app (senior engineer take-home for Axiology). Phase 1 is complete — project is scaffolded with Next.js 16, TypeScript, Tailwind, shadcn/ui, next-intl, React Query, Zustand, Axios, Zod. This is Phase 2 — implementing the API layer only. No UI changes.
>
> Working directory: /Users/tomas/Documents/Coding/weather-app
>
> Read CLAUDE.md before starting — it has all the coding conventions and rules.
>
> What already exists (DO NOT recreate or overwrite unless replacing placeholders)
>
> - src/types/index.ts — Location, WeatherData, SearchHistoryEntry interfaces
> - src/lib/axios.ts — Axios instance (api) with baseURL /api, 10s timeout
> - src/lib/constants.ts — WEATHER_API_URL (https://api.open-meteo.com/v1), GEOCODING_API_URL (https://geocoding-api.open-meteo.com/v1), MAX_HISTORY_ENTRIES (10)
> - src/lib/query-keys.ts — query key factory with weather.byLocation(lat, lng) and geocoding.search(query)
> - src/lib/logger.ts — captureError() and captureMessage() functions
> - src/stores/history-store.ts — Zustand store with persist middleware (already implemented with addEntry, removeEntry, clearHistory)
> - src/providers/query-provider.tsx — QueryClientProvider (staleTime: 60s, retry: 1)
> - src/app/api/weather/route.ts — placeholder GET handler
> - src/lib/weather.ts — placeholder getWeather(lat, lng)
> - src/lib/geocoding.ts — placeholder searchLocations(query)
> - src/lib/storage.ts — placeholder getHistory() (likely obsolete since Zustand store handles persistence now — check if anything imports it, if not, remove it)
>
> Requirements
>
> 1. Create Zod schemas — src/lib/schemas.ts
> 2. Create WMO weather code mapping — src/lib/weather-codes.ts
> 3. Implement geocoding API route — src/app/api/geocoding/route.ts (NEW FILE)
> 4. Implement weather API route — src/app/api/weather/route.ts (REPLACE placeholder)
> 5. Implement client-side API functions (src/lib/geocoding.ts, src/lib/weather.ts)
> 6. Create React Query hooks — src/hooks/use-weather.ts and src/hooks/use-geocoding.ts (NEW FILES)
> 7. Clean up src/lib/storage.ts
> 8. Update AI prompts, git commit, verify
>
> (Full prompt with detailed specs for each requirement — Zod schema shapes, API route behavior, error handling patterns, transformation rules, etc.)

**Additional prompts:**

> 11. Update docs/implementation-plan.md — update to reflect what actually happened (Next.js 16, merged phases, renumbered).

> Task: Create design system documentation — concise philosophy doc (under 150 lines) covering design philosophy, component architecture, layout, theming, typography, motion, accessibility, iconography.

**Refinements during implementation:**

- Weather condition codes changed from English strings to camelCase i18n keys (`clearSky`, `slightRain`, etc.) with translations in `en.json` under `weather.condition` namespace — weather codes are user-facing content, not internal labels.
- Simplified client-side API functions (`getWeather`, `searchLocations`) — removed unnecessary try/catch wrappers that just rethrew errors. Axios errors propagate naturally, React Query catches them, UI shows translated strings.
- Updated API routes to use the `URL` API for building external URLs instead of string interpolation — cleaner, handles encoding automatically, no manual `encodeURIComponent`.
- Fixed critical bug: `new URL('/forecast', WEATHER_API_URL)` dropped the `/v1` path segment, causing 404s. Fixed to `new URL(\`${WEATHER_API_URL}/forecast\`)`.
- Added `.vscode/` to `.gitignore`.
- Added unit tests for schemas, weather codes, and API routes — focused on meaningful behavior (transformations, validation boundaries, error handling), removed tests that just tested Zod library behavior.
- Added contract tests (`npm run test:contract`) that hit the real Open-Meteo API to detect schema drift. Separate config and script so they don't run on every `npm test`.
- Updated testing guidelines with contract test documentation and "don't test the library" principle.
- Added Husky pre-push hook to run tests before every push — no CI/CD yet, so this is the safety net.

**Used for:** Zod schemas, API routes, weather codes, client API functions, React Query hooks, design system docs, implementation plan updates, unit + contract tests

**Commit:** `feat: implement weather and geocoding API routes with Zod validation`
