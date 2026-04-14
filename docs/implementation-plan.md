# Implementation Plan

## Overview

Weather web app that allows users to search for a location with autocomplete, view current weather conditions, and persist search history. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, and shadcn/ui.

## Architecture Decisions

- **Next.js API Routes** as a proxy layer — all external API calls (Open-Meteo) go through `/api/` routes to keep API logic server-side and enable runtime validation with Zod
- **@tanstack/react-query** for server state — automatic caching, background refetching, and loading/error state management for weather and geocoding data
- **Zustand** for client state — lightweight store for search history, synced with localStorage via built-in `persist` middleware
- **Axios** over fetch — interceptors for consistent error handling, request/response transforms, and timeouts
- **Zod** for runtime validation — parse all external API responses to catch schema drift and malformed data

## Phases

### Phase 1 — Project Scaffolding & Architecture ✅

- Create Next.js 15 project with TypeScript, Tailwind, App Router
- Install all dependencies (shadcn/ui, react-query, zustand, axios, zod, vitest, etc.)
- Set up project structure with placeholder files
- Define TypeScript types (Location, WeatherData, SearchHistoryEntry)
- Configure Vitest, ESLint (with prettier, import sorting, a11y), Prettier
- Write CLAUDE.md, coding guidelines, testing guidelines
- **Commit:** `chore: initial project setup with Next.js, Tailwind, shadcn/ui`

### Phase 2 — Types & API Layer

- Create Zod schemas for Open-Meteo API responses (forecast + geocoding)
- Implement `/api/weather` route — fetch from Open-Meteo Forecast API, validate with Zod, return typed response
- Implement `/api/geocoding` route — fetch from Open-Meteo Geocoding API, validate with Zod, return typed response
- Create Axios client functions (`getWeather`, `searchLocations`) that call internal API routes
- Add error handling with typed error responses
- **Commit:** `feat: implement weather and geocoding API routes with Zod validation`

### Phase 3 — Core UI Components

- Build `SearchBar` component — text input with debounced autocomplete dropdown, location selection
- Build `WeatherCard` component — display current weather (temperature, condition, humidity, wind, feels-like)
- Add weather condition icons/descriptions mapping from WMO weather codes
- Wire up react-query hooks for data fetching
- **Commit:** `feat: implement search bar with autocomplete and weather display card`

### Phase 4 — Search History & Storage

- Implement Zustand store with localStorage persistence
- Build `SearchHistory` component — list of recent searches with location, temperature, time
- Add click-to-search-again on history entries
- Add clear history and remove individual entries
- **Commit:** `feat: add search history with localStorage persistence`

### Phase 5 — Integration & Polish

- Connect all components end-to-end
- Add loading states with Skeleton components
- Add error states with Sonner toast notifications and retry buttons
- Add empty states (no search yet, no results found)
- **Commit:** `feat: integrate components with loading, error, and empty states`

### Phase 6 — Dark Mode & Animations

- Set up next-themes for dark/light mode toggle
- Add Motion animations for weather card transitions
- Add smooth transitions for search dropdown, history list
- Responsive design polish (mobile-first)
- **Commit:** `feat: add dark mode support and UI animations`

### Phase 7 — Testing

- Unit tests for lib/ functions (API clients, storage, query keys)
- Component tests for SearchBar, WeatherCard, SearchHistory
- Test loading, error, and empty states
- Test user interactions (search, select location, clear history)
- **Commit:** `test: add unit and component tests`

### Phase 8 — Documentation & Final Polish

- Update README with setup instructions, screenshots, architecture overview
- Update AI_PROMPTS.md with all phases
- Final accessibility audit
- Verify production build
- **Commit:** `docs: update README and finalize documentation`

## Target Commit History

```
chore: initial project setup with Next.js, Tailwind, shadcn/ui
feat: implement weather and geocoding API routes with Zod validation
feat: implement search bar with autocomplete and weather display card
feat: add search history with localStorage persistence
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
