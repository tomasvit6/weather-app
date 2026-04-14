# AI Prompt History

This file documents the AI prompts used during development of this project, as required by the task specification.

## Workflow

Reviewed the task myself. Then I gave AI all the information about the task, all the requirements and additional insights needed to prepare a phase-by-phase prompt plan — meaning I give step-by-step prompts for a different agent for a comprehensive implementation, refining everything as I go.

## Phase 1 — Project Scaffolding & Architecture

**Phase 1 prompt:**

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

**Phase 2 prompt:**

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

## Phase 3 — Core UI Components, States & Theming

**Phase 3 prompt:**

> Task: Build core UI components — SearchBar, WeatherCard, SearchHistory
>
> Context
>
> Working directory: /Users/tomas/Documents/Coding/weather-app
>
> Read CLAUDE.md and docs/design-system.md before starting — they define coding conventions, design philosophy, typography hierarchy, and accessibility requirements.
>
> This is a weather web app (senior engineer take-home for Axiology). Phase 1 (scaffolding) and Phase 2 (API layer) are complete. This is Phase 3 — building the three core UI components and wiring them into the page. After this phase the app should be fully functional end-to-end.
>
> What already exists (DO NOT recreate): use-debounce, use-weather, use-geocoding hooks; history-store Zustand store; types; weather-codes; utils; i18n messages; shadcn components; page/layout/error placeholders.
>
> Requirements:
>
> 1. SearchBar — debounced autocomplete combobox with keyboard navigation (ArrowDown/Up/Enter/Escape), click-outside-to-close, ARIA combobox pattern (role="combobox", aria-expanded, aria-controls, aria-activedescendant, role="listbox", role="option"), Search/Loader2 icons
> 2. WeatherCard — four states (empty/loading/error/loaded), typography hierarchy from design system (text-6xl temperature, text-lg condition, text-sm details), weather icon mapping, details grid (feels like, humidity, wind), aria-live="polite"
> 3. SearchHistory — Zustand integration with hydration safety (useSyncExternalStore pattern from CLAUDE.md), relative timestamps via date-fns, delete/clear buttons with i18n aria-labels, semantic ul/li structure
> 4. Weather condition icon mapping — src/lib/weather-icons.ts, all WMO codes mapped to Lucide icons
> 5. Client orchestrator — src/components/weather-app.tsx, manages selectedLocation state, wires components, adds to history via useEffect when weather data loads
> 6. Update page.tsx — replace three placeholder imports with WeatherApp
> 7. Add Toaster to layout
> 8. History store deduplication — filter existing entries with same location id before prepending
> 9. Git commit, verify build/lint, test full flow in browser

**Refinements during implementation:**

- Code review caught hardcoded English in aria-label (`Remove ${name} from history`) — added `history.remove` i18n key with ICU `{location}` parameter.
- Fixed "no results" flash during debounce — the 300ms debounce window showed "No locations found" before the query fired. Added `debouncedQuery === query` guard so the empty state only appears after the debounce settles.
- Removed unused `inputRef` from SearchBar.
- Replaced `setState` in effects (ESLint `react-hooks/set-state-in-effect` violations) with derived state pattern using `isFocused`/`isDismissed` flags instead of `isOpen` state + effects.
- Fixed `react-hooks/static-components` lint error — weather icon components assigned to variables during render. Used `createElement()` instead of JSX to avoid the "component created during render" violation.
- Added header with custom SVG logo (sun + cloud, uses `fill-foreground` for theme adaptation) and footer with i18n credit text.
- Set up `next-themes` ThemeProvider with system default, added sun/moon theme toggle in header.
- Added visual depth — `bg-muted/40` on body for subtle grey background, soft diffuse `box-shadow` on cards (low-opacity, no hard edges), separate light/dark shadow values.
- Added `weather.lastUpdated` i18n key and "Updated X ago" display in WeatherCard using React Query's `dataUpdatedAt` timestamp, with a `useRelativeTime` hook that ticks every 30s.
- Added `refetchInterval: 5 * 60 * 1000` to `useWeather` hook for automatic background refetching since we don't use WebSockets.
- Updated `implementation-plan.md` — merged Phases 3/4/5 into single Phase 3, added Phase 5 "Polish & Production Hardening" for API response caching and rate-limit handling.

**Additional prompts (iterative refinements):**

- Add header/footer with custom SVG logo and dark/light theme toggle
- Improve visual depth — elevated cards on a subtle grey background with soft, diffuse shadows
- Since we can't push live updates without sockets, show "last updated" timestamp with automatic background refetching on an interval
- Add glassmorphism to the weather card — animated gradient blobs behind a frosted glass panel, tinted by weather condition
- Replace `Record<string, ...>` with a type-safe `WeatherCondition` union derived from the weather codes map
- Auto-detect user's location on initial load via browser geolocation, resolve city/country name via reverse geocoding
- Add unit and contract tests for the new reverse geocoding route

**Additional refinements during implementation:**

- Glassmorphism weather card — animated gradient blobs behind a `backdrop-blur-2xl bg-white/80` glass panel. Blobs use percentage-based sizes with `blur-[80px]` for smooth gradient washes, not visible circles. Three blob keyframe animations (12s/15s/18s) with `prefers-reduced-motion` respect.
- Weather condition colors — `WeatherCondition` union type derived from `as const` weather codes map. Threaded through `WeatherData.condition`, `SearchHistoryEntry.condition`, all icon/color/gradient mappings. Eliminated all `Record<string, ...>` in favor of `Record<WeatherCondition, ...>` for compile-time exhaustiveness checking.
- Weather-contextual color system — amber for clear/sunny, blue for rain, violet for thunderstorms, cyan for freezing, sky for snow. Applied to weather icon, condition text, and glassmorphism blob gradients. Detail row icons get individual colors (orange thermometer, blue droplets, teal wind).
- Iterative mobile responsive fixes — detail boxes replaced with flat `divide-x` row layout, responsive text sizes (`text-[11px] sm:text-xs`), responsive padding (`px-5 sm:px-8`).
- Browser geolocation on initial load — `useGeolocation` hook requests `navigator.geolocation.getCurrentPosition`, reverse geocodes via new `/api/reverse-geocoding` route (Nominatim API) to get city/country name. Auto-detected locations (`id: 0`) are excluded from search history.
- Reverse geocoding API route — `/api/reverse-geocoding` proxies Nominatim with `accept-language=en`, falls back through `city → town → village → name` for the location name, uppercases country code.
- Unit tests for reverse geocoding route — input validation, response transformation (city/town/village fallback, country code uppercasing), error handling. Follows same pattern as existing API route tests.
- Contract test for Nominatim — verifies response shape against live API (address structure, country_code format). Runs via `npm run test:contract`.
- Scroll-to-weather on history click — `scrollIntoView({ behavior: 'smooth' })` with `scroll-mt-20` to clear sticky header.
- Sticky header with `backdrop-blur-md bg-background/80`.

**Used for:** SearchBar, WeatherCard, SearchHistory, WeatherApp orchestrator, weather icon mapping, header/footer, theme toggle, ThemeProvider, page integration, glassmorphism, weather colors, type-safe weather conditions, geolocation, reverse geocoding, auto-refetch with "last updated" display

**Commit:** `feat: implement search bar with autocomplete, weather display, and search history`

## Phase 4 — Testing

**Phase 4 prompt:**

> Task: Add unit and component tests
>
> Context
>
> Working directory: /Users/tomas/Documents/Coding/weather-app
>
> Read CLAUDE.md and docs/testing-guidelines.md before starting — they define the testing philosophy, what to test, what NOT to test, and mocking guidelines.
>
> This is a weather web app (senior engineer take-home for Axiology). Phases 1-3 are complete. This is Phase 4 — adding meaningful test coverage for components, hooks, stores, and remaining lib functions. The app is fully functional.
>
> What already has tests (DO NOT duplicate)
>
> - src/lib/schemas.test.ts — Zod schema parsing, defaults, transforms (is_day → boolean)
> - src/lib/weather-codes.test.ts — getWeatherCondition for known codes, unknown fallback
> - src/app/api/weather/route.test.ts — input validation, response transformation, error handling
> - src/app/api/geocoding/route.test.ts — same pattern as weather route
> - src/app/api/reverse-geocoding/route.test.ts — same pattern
> - src/\_\_tests\_\_/contracts/ — contract tests against live APIs (separate config)
>
> What needs tests: (1) weather-icons — getWeatherIcon/getWeatherColor/getWeatherGradient for all WeatherCondition values, distinct icons for different categories. (2) history-store — addEntry prepend/dedup/cap-at-10, removeEntry, clearHistory, Zustand tested via getState/setState. (3) use-debounce — initial value, delayed update, timer reset with fake timers. (4) SearchBar — autocomplete dropdown, keyboard nav (ArrowDown/Up/Enter/Escape), ARIA combobox pattern, loading/no-results states, input clears after selection. Mock use-geocoding and use-debounce. (5) WeatherCard — four states (empty/loading/error/loaded), temperature rounding, aria-live. Mock weather-icons. (6) SearchHistory — store integration, entry click/remove/clear, aria-labels. Mock weather-icons. (7) Shared test-utils with NextIntlClientProvider + QueryClientProvider wrapper.
>
> (Full prompt with detailed specs for each test file, mocking strategies, helper factories, coverage targets, and important notes about what NOT to test.)

**Additional prompts (iterative refinements):**

- Audit test suite against modern React testing best practices — remove low-value tests, eliminate unnecessary mocks, verify each test catches real regressions

**Refinements during implementation:**

- Removed weather-icons mock from weather-card and search-history tests — pure lookup functions render fine in jsdom, mocking them hid integration bugs. Use real functions, mock only at boundaries (network, timers, browser APIs).
- Replaced `.animate-spin` CSS class query with `.lucide-loader-circle` component identity class for loading indicator assertion — less brittle.
- Verified Lucide SVG icons render correctly in jsdom — no mock needed despite initial assumption.

**Used for:** Unit tests for lib/weather-icons, stores/history-store, hooks/use-debounce. Component tests for search-bar, weather-card, search-history. Shared test utilities.

**Commit:** `test: add unit and component tests`

## Phase 5 — Polish & Production Hardening

**Phase 5 prompt:**

> Task: Polish & production hardening
>
> Context
>
> Working directory: /Users/tomas/Documents/Coding/weather-app
>
> Read CLAUDE.md and docs/design-system.md before starting.
>
> This is a weather web app (senior engineer take-home for Axiology). Phases 1-4 are complete — the app is fully functional with tests passing (86 tests). This is Phase 5 — production polish. The app already has glassmorphism weather card, dark/light mode, geolocation, and animated gradient blobs. This phase focuses on the remaining production concerns: API caching, rate-limit handling, Motion animations, responsive polish, accessibility audit, and favicon.
>
> What already exists
>
> - Animated gradient blobs on weather card with prefers-reduced-motion respect (CSS keyframes in globals.css)
> - Dark/light mode via next-themes with toggle in header
> - Auto-refetch every 5 minutes via React Query refetchInterval
> - Sticky header with backdrop blur
> - Glassmorphism weather card with weather-contextual colors
> - Geolocation auto-detect on load
> - All tests passing (86 tests, 11 files)
>
> Requirements
>
> 1. API response caching — Cache-Control headers on `/api/weather` (max-age=300, stale-while-revalidate=600), `/api/geocoding` and `/api/reverse-geocoding` (max-age=3600, stale-while-revalidate=86400). Only on successful (200) responses.
> 2. Rate-limit handling — In all three API routes, detect 429 from upstream, log via `captureMessage`, return `{ error: 'Too many requests...' }` with status 429. Add axios response interceptor that shows a sonner toast on 429. Add `error.rateLimited` i18n key.
> 3. Motion animations — WeatherCard enter animation keyed by `data.location.id` (`initial={{ opacity: 0, y: 12 }}` → `animate={{ opacity: 1, y: 0 }}`, duration 0.3). SearchBar dropdown AnimatePresence (opacity + y: -8, duration 0.15). SearchHistory entries stagger (`motion.li` with `delay: index * 0.05`). Respect `prefers-reduced-motion` (motion v12+ handles automatically).
> 4. SVG favicon — Create `src/app/icon.svg` from `src/components/logo.tsx` with hardcoded black fill (no CSS variables). Next.js App Router auto-serves it.
> 5. Responsive design polish — Verify at 375px viewport: search input full-width, temperature scales (`text-5xl` mobile / `text-7xl` desktop), search history doesn't overflow, header fits, detail row labels truncate. Fix only what's broken.
> 6. Accessibility audit — Tab order, `aria-live="polite"` on weather card, focus indicators, muted text contrast in dark mode, Escape closes search dropdown. Fix any issues found.
> 7. Update docs/ai-prompts.md — Append Phase 5 entry.
> 8. Update docs/implementation-plan.md — Mark Phase 5 as ✅.
> 9. Git commit with message "feat: add API caching, rate-limit handling, and UI animations".
> 10. Verify — npm test, npm run build, browser testing (animations, Cache-Control headers, favicon, mobile viewport, tab navigation, dark mode, reduced motion).
>
> Important Notes
>
> - All user-facing strings via i18n
> - Motion v12+ uses `motion.div` not `motion(div)` — `import { motion, AnimatePresence } from 'motion/react'`
> - Cache headers only on success responses, not errors
> - Don't break existing tests
> - Keep animations subtle and fast (150-300ms)
> - SVG favicon needs hardcoded colors, not CSS variables

**Additional prompts (iterative refinements):**

- Our `t()` is type unsafe — add type-safe translations. Checked how smc-gen solves it: module augmentation on `next-intl` `AppConfig` interface with `Messages = typeof messages`. Created `src/i18n/types.ts`.
- Search history card should always be displayed — even when no results. Empty state should include the card title and empty icon. On page load, show skeleton loaders until Zustand store hydrates from localStorage (replace `return null` with skeleton rows).
- Reviewed all changes — identified issues: unsafe `as` assertions in reverse-geocoding route (replaced with `ReverseGeocodingResponseSchema` Zod validation); hardcoded English in axios 429 interceptor (removed — i18n unavailable outside React context, rate-limit errors propagate through React Query to translated component error states).
- Add time display in weather card header — current time in the location's timezone via `Intl.DateTimeFormat` with `timezone` from weather API response. Required adding `timezone=auto` param to Open-Meteo request and `timezone` field to the response schema + type.
- Header logo/title should scroll to top or link to `/` — on-route click now smooth-scrolls via `onClick={() => window.scrollTo(...)}`. Required `'use client'` directive since handler is an event.
- `SearchBar` onSelect shouldn't scroll — split `handleSelect` into `handleSearch` (no scroll) and `handleHistorySelect` (scrolls to weather card).
- Add `ROUTES` constant and `API_ROUTES` constant — centralized all client-side and API route paths in `src/lib/constants.ts`. Updated header, `weather.ts`, `geocoding.ts`, `use-geolocation.ts` to use them.
- Responsive polish — temperature scales `text-4xl sm:text-5xl md:text-7xl`; location name/time stack vertically on mobile; detail row gets `min-w-0` + `truncate` on values so long strings ellipsis properly in the flex layout.
- Search input visible in light mode — shadcn default `bg-transparent` blended into page background; changed to `bg-background` for contrast.
- Mocked `AnimatePresence` in test setup (`src/__tests__/setup.ts`) — exit animations left elements in DOM indefinitely under jsdom, breaking the Escape-closes-dropdown test. `motion.div/ul/li` render fine, only `AnimatePresence` needs the mock.
- Added README "Known Limitations" entry — no client-side spell-check or fuzzy matching; out of scope for this exercise, typically handled by a dedicated search service (Algolia, Meilisearch) or the geocoding provider itself.

**Used for:** API caching headers, rate-limit handling, Motion animations, SVG favicon, responsive fixes, a11y audit, type-safe i18n, search history skeleton + empty state, location time display, scroll-to-top logo link, `ROUTES` / `API_ROUTES` constants, light-mode input contrast, `AnimatePresence` test mock

**Commit:** `feat: add API caching, rate-limit handling, and UI animations`
