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

### Phase 3 — Core UI Components

- Build `SearchBar` component — text input with debounced autocomplete dropdown, location selection
- Build `WeatherCard` component — display current weather (temperature, condition, humidity, wind, feels-like)
- Build `SearchHistory` component — list of recent searches with click-to-search, clear history, remove individual entries
- Wire up components with React Query hooks and Zustand store
- **Commit:** `feat: implement search bar with autocomplete, weather display, and search history`

### Phase 4 — Integration & Loading/Error/Empty States

- Connect all components end-to-end
- Add loading states with Skeleton components
- Add error states with Sonner toast notifications and retry buttons
- Add empty states (no search yet, no results found)
- **Commit:** `feat: integrate components with loading, error, and empty states`

### Phase 5 — Dark Mode & Animations

- Set up next-themes for dark/light mode toggle
- Add Motion animations for weather card transitions
- Add smooth transitions for search dropdown, history list
- Responsive design polish (mobile-first)
- **Commit:** `feat: add dark mode support and UI animations`

### Phase 6 — Testing

- Unit tests for lib/ functions (API clients, query keys, weather codes)
- Component tests for SearchBar, WeatherCard, SearchHistory
- Test loading, error, and empty states
- Test user interactions (search, select location, clear history)
- **Commit:** `test: add unit and component tests`

### Phase 7 — Documentation & Final Polish

- Update README with setup instructions, screenshots, architecture overview
- Update AI_PROMPTS.md with all phases
- Final accessibility audit
- Verify production build
- **Commit:** `docs: update README and finalize documentation`

## Target Commit History

```
chore: initial project setup with Next.js, Tailwind, shadcn/ui
feat: implement weather and geocoding API routes with Zod validation
feat: implement search bar with autocomplete, weather display, and search history
feat: integrate components with loading, error, and empty states
feat: add dark mode support and UI animations
test: add unit and component tests
docs: update README and finalize documentation
```

## External APIs

- **Weather:** Open-Meteo Forecast API — `https://api.open-meteo.com/v1/forecast`
  - Parameters: latitude, longitude, current weather variables
  - No API key required, free for non-commercial use

- **Geocoding:** Open-Meteo Geocoding API — `https://geocoding-api.open-meteo.com/v1/search`
  - Parameters: name (search query), count (max results), language
  - Returns matching locations with coordinates, country, admin region
