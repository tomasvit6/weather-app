# Weather App

## Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
npm run format       # Prettier format all files
npm run format:check # Prettier check formatting
npm test             # Run all Vitest tests
npm run test:watch   # Vitest watch mode
npm run test:coverage # Coverage report
```

## Tech Stack

Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS 4, shadcn/ui, Motion, Axios, Zod, @tanstack/react-query, Zustand, next-intl, Sonner, next-themes, date-fns, Vitest + React Testing Library.

## Project Structure

```
src/app/           - Next.js pages and API routes
src/app/[locale]/  - Locale-wrapped pages (next-intl)
src/app/api/       - API route handlers (not locale-wrapped)
src/components/    - React components (feature components at root, shadcn in ui/)
src/components/ui/ - shadcn/ui base components (do not modify manually)
src/hooks/         - Custom React hooks
src/i18n/          - Internationalization config, routing, and message files
src/lib/           - Core logic (API clients, utilities, query keys, constants)
src/providers/     - React context providers (QueryProvider, ThemeProvider)
src/stores/        - Zustand stores
src/types/         - Shared/global type definitions (used across multiple modules)
src/__tests__/     - Test setup (setup.ts) and shared test utilities
docs/              - Project documentation
```

## Core Rules

### Git Safety (CRITICAL)

**NEVER run `git stage`, `git reset`, `git checkout -- .`, `git restore`, `git stash`, or `git clean` commands.** These can wipe uncommitted work. The user manages staging and commits themselves. Only run read-only git commands (`git status`, `git diff`, `git log`, `git branch`).

### Typesafety (PRIORITY)

- Zod for all validation at boundaries (API responses); infer types: `type X = z.infer<typeof XSchema>`
- No `any` — use `unknown` with type guards if needed
- All function parameters and return types must be typed
- Never trust raw API data — always parse with Zod schemas

### Code Quality

- **NEVER use `eslint-disable` comments** — find a proper solution
- No raw `console.log/error/warn` — use `captureError()` / `captureMessage()` from `src/lib/logger.ts` (logs to console now, swap in Sentry for production)
- Never silently swallow errors in catch blocks
- **TDD for bug fixes**: When fixing a bug, ALWAYS write a failing test first that reproduces the bug, then fix the code to make it pass. The test stays as a regression guard.
- **API error toasts**: The global axios interceptor shows error toasts. If a component handles errors locally (e.g., `onError` with `toast.error()`), the API call **must** suppress the global toast to avoid double toasts.

### React Hydration

Use `useSyncExternalStore` (not `useState`+`useEffect`) to avoid hydration mismatches for client-only values:

```tsx
const subscribe = () => () => {}
function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}
// Use for: Date.now(), window APIs, any server/client differences
```

### Accessibility (WCAG 2.1 AA)

- Semantic HTML (`<main>`, `<nav>`, `<section>`, `<button>` — not `<div onClick>`)
- Alt text, form labels + `aria-describedby`/`aria-invalid`
- Keyboard navigable — all interactive elements reachable via Tab, activatable via Enter/Space
- `aria-live` for dynamic content updates
- 4.5:1 contrast ratio for text

## Code Conventions

- **File naming**: kebab-case for all files and directories (`search-bar.tsx`, `use-debounce.ts`)
- **Component exports**: Named exports only, PascalCase (`export function SearchBar()`)
- **No default exports** except for Next.js pages/layouts/routes (required by framework)
- **No barrel exports** — import directly from source files. Barrel exports cause circular dependency issues that produce runtime errors in production builds.
- **Imports**: Use `@/` path alias for all imports (`import { Location } from '@/types'`)
- **Import order** (ESLint-enforced): Node built-ins → External packages → `@/` aliases → Relative → Styles
- **Naming**: Files `kebab-case` | Components `PascalCase` | Types `PascalCase` | Schemas `PascalCaseSchema` | Constants `SCREAMING_SNAKE_CASE`

## API Integration

- Weather: Open-Meteo Forecast API (`https://api.open-meteo.com/v1/forecast`)
- Geocoding: Open-Meteo Geocoding API (`https://geocoding-api.open-meteo.com/v1/search`)
- **All external API calls go through Next.js API routes** (`src/app/api/`) — never call external APIs directly from client components
- No API keys required

## State Management

- **@tanstack/react-query** for server state (weather data, geocoding results) — handles caching, loading/error states, refetching
- **Zustand** for client state (search history, UI preferences) — synced with localStorage
- **React useState** for component-local UI state (dropdown open, input value)
- Query keys defined in `src/lib/query-keys.ts` for consistency

## i18n (next-intl) (CRITICAL)

- **NEVER hardcode English for user-facing text** — all UI strings must come from translation files
- All user-facing strings go in `src/i18n/messages/en.json`
- Use `useTranslations()` in client components, `getTranslations()` in server components
- Namespace by feature: `search.placeholder`, `weather.temperature`, `history.clear`
- Pages live under `src/app/[locale]/`, API routes under `src/app/api/` (not locale-wrapped)
- Proxy config in `src/proxy.ts` handles locale detection and routing
- Every public page must export `generateMetadata` with localized title and description
- Adding a new locale: create `src/i18n/messages/{locale}.json` and add to `src/i18n/routing.ts` locales array

## Error Handling

- API routes return proper HTTP status codes with typed error responses (`{ error: string; status: number }`)
- Client components show user-friendly error messages via Sonner toasts + retry options
- Never swallow errors silently — always log or display them

## Testing

- Use Vitest + React Testing Library
- Test files live next to source: `search-bar.test.tsx` alongside `search-bar.tsx`
- Use `describe` / `it` pattern
- Mock external API calls, never hit real APIs in tests
- Focus on: behavior over implementation, user interactions, edge cases
