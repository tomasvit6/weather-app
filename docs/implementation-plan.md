# Implementation Plan

## Overview

Weather web app that allows users to search for a location with autocomplete, view current weather conditions, and persist search history. Built with Next.js 16 (App Router), TypeScript, Tailwind CSS, and shadcn/ui.

## Architecture Decisions

- **Next.js API Routes** as a proxy layer — all external API calls (Open-Meteo) go through `/api/` routes to keep API logic server-side and enable runtime validation with Zod
- **@tanstack/react-query** for server state — automatic caching, background refetching, and loading/error state management for weather and geocoding data
- **Zustand** for client state — lightweight store for search history, synced with localStorage via built-in `persist` middleware
- **Axios** over fetch — interceptors for consistent error handling, request/response transforms, and timeouts
- **Zod** for runtime validation — parse all external API responses to catch schema drift and malformed data

## Phases

### Phase 1 — Project Scaffolding & Architecture ✅

- Create Next.js 16 project with TypeScript, Tailwind, App Router
- Install all dependencies (shadcn/ui, react-query, zustand, axios, zod, vitest, etc.)
- Set up project structure with placeholder files
- Define TypeScript types (Location, WeatherData, SearchHistoryEntry)
- Configure Vitest, ESLint (with prettier, import sorting, a11y), Prettier
- Set up next-intl i18n with `[locale]` routing and `proxy.ts`
- Add logger service (`captureError`, `captureMessage`) for structured error logging
- Add error and not-found boundary pages with i18n support
- Set up Husky + lint-staged for pre-commit enforcement
- Add constants file for API URLs (no secrets needed)
- Implement Zustand history store with localStorage persistence via `persist` middleware
- Set up React Query provider (staleTime: 60s, retry: 1)
- Write CLAUDE.md, coding guidelines, testing guidelines
- **Commit:** `chore: initial project setup with Next.js, Tailwind, shadcn/ui`

### Phase 2 — API Layer & Zod Validation ✅

- Create Zod schemas for Open-Meteo API responses (forecast + geocoding)
- Create WMO weather code mapping module (codes 0–99 to human-readable conditions)
- Implement `/api/weather` route — fetch from Open-Meteo Forecast API, validate with Zod, return typed response
- Implement `/api/geocoding` route — fetch from Open-Meteo Geocoding API, validate with Zod, return typed response
- Create Axios client functions (`getWeather`, `searchLocations`) that call internal API routes
- Create React Query hooks (`useWeather`, `useGeocodingSearch`) for data fetching
- Add error handling with typed error responses and `captureError()` logging
- Clean up unused `storage.ts` placeholder (Zustand store handles persistence)
- **Commit:** `feat: implement weather and geocoding API routes with Zod validation`

### Phase 3 — Core UI Components, States & Theming ✅

- Build `SearchBar` component — debounced autocomplete combobox with keyboard navigation, ARIA combobox pattern
- Build `WeatherCard` component — loading skeleton, error, empty, and loaded states with weather icon mapping
- Build `SearchHistory` component — Zustand store integration, hydration-safe rendering, relative timestamps
- Build `WeatherApp` client orchestrator — manages selected location state, wires components together
- Create weather condition → Lucide icon mapping (`weather-icons.ts`)
- Add loading states with Skeleton components, error states with AlertTriangle, empty states with muted icons
- Add header with custom SVG logo and footer
- Set up next-themes for dark/light mode toggle with sun/moon animated icon
- Add visual depth — subtle grey background (`bg-muted/40`), soft card shadows
- Add Sonner Toaster to layout for toast notifications
- Add history store deduplication by location id
- **Commit:** `feat: implement search bar with autocomplete, weather display, and search history`

### Phase 4 — Testing ✅

- Unit tests for lib/ functions (API clients, query keys, weather codes, weather icons)
- Component tests for SearchBar, WeatherCard, SearchHistory
- Test loading, error, and empty states
- Test user interactions (search, select location, clear history)
- **Commit:** `test: add unit and component tests`

### Phase 5 — Polish & Production Hardening ✅

- API response caching on `/api/weather` and `/api/geocoding` routes (Cache-Control headers, stale-while-revalidate)
- Rate-limit handling — detect 429 responses from Open-Meteo, return appropriate error to client, show user-friendly toast
- Motion animations for weather card transitions, search dropdown appear/disappear
- Responsive design polish
- Final accessibility audit
- Use app svg logo as favicon
- **Commit:** `feat: add API caching, rate-limit handling, and UI animations`

### Phase 6 — Documentation ✅

- Update README with setup instructions, architecture overview, tech stack rationale
- Split submission notes into **Assumptions, Tradeoffs & Known Limitations** (explicitly addressing the brief)
- Update `docs/ai-prompts.md` with all phases through Phase 6
- Remove unused Next.js default assets from `public/`
- Verify production build
- **Commit:** `docs: update README and finalize phase 6 documentation`

### Phase 7 — Submission Polish ✅

Final pass to round out the submission:

- Pin Node version via `.nvmrc` and `"engines": { "node": ">=20" }` in `package.json`
- Add `.github/workflows/ci.yml` running `lint`, `format:check`, `test`, `build`
- Wire API error toasts via new `useApiErrorToast` hook (429 rate-limit and generic fetch failure)
- Surface geolocation denial with an inline message instead of silent fallback
- **Commit:** `chore: submission polish`

## Target Commit History

```
chore: initial project setup with Next.js, Tailwind, shadcn/ui
feat: implement weather and geocoding API routes with Zod validation
feat: implement search bar with autocomplete, weather display, and search history
test: add unit and component tests
feat: add API caching, rate-limit handling, and UI animations
docs: update README and finalize phase 6 documentation
chore: submission polish
```

## External APIs

- **Weather:** Open-Meteo Forecast API — `https://api.open-meteo.com/v1/forecast`
  - Parameters: latitude, longitude, current weather variables
  - No API key required, free for non-commercial use

- **Geocoding:** Open-Meteo Geocoding API — `https://geocoding-api.open-meteo.com/v1/search`
  - Parameters: name (search query), count (max results), language
  - Returns matching locations with coordinates, country, admin region
