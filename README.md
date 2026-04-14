# Weather App

A weather web application that allows users to search for a location with autocomplete, view current weather conditions, and persist search history.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command                 | Description                    |
| ----------------------- | ------------------------------ |
| `npm run dev`           | Start development server       |
| `npm run build`         | Production build               |
| `npm start`             | Start production server        |
| `npm run lint`          | Run ESLint                     |
| `npm run format`        | Format code with Prettier      |
| `npm test`              | Run tests                      |
| `npm run test:watch`    | Run tests in watch mode        |
| `npm run test:coverage` | Run tests with coverage report |

## Tech Stack

| Category            | Choice                                          | Why                                                                                                                                                                                                    |
| ------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Framework**       | Next.js 15 (App Router) + React 19 + TypeScript | Industry standard for production React apps. App Router enables server components, streaming, and API routes in one project. TypeScript strict mode catches bugs at compile time.                      |
| **Styling**         | Tailwind CSS 4 + shadcn/ui + Motion             | Tailwind for rapid utility-first styling. shadcn/ui provides accessible, customizable base components without lock-in (code lives in your repo). Motion for polished animations.                       |
| **Server State**    | @tanstack/react-query                           | Handles caching, background refetching, loading/error states, and stale-while-revalidate out of the box. Eliminates boilerplate for async data management.                                             |
| **Client State**    | Zustand                                         | Minimal API (~1KB), no boilerplate, built-in localStorage persistence via middleware. Scales cleanly without the ceremony of Redux.                                                                    |
| **HTTP Client**     | Axios                                           | Interceptors for global error handling, request/response transforms, timeouts, and cleaner API than raw fetch for typed requests.                                                                      |
| **Validation**      | Zod                                             | Runtime validation for external API responses. Type-safe schema definitions with `z.infer<>` for zero type duplication. Catches API contract drift at runtime.                                         |
| **i18n**            | next-intl                                       | Type-safe internationalization with minimal setup. Even with a single locale, it enforces a clean separation of UI text from components — easy to add languages later without touching component code. |
| **Date Formatting** | date-fns                                        | Tree-shakeable, immutable date utilities. Only imports what you use — no moment.js-style bundle bloat.                                                                                                 |
| **Notifications**   | Sonner                                          | Lightweight toast library with sensible defaults. Handles success, error, and loading toasts with minimal config.                                                                                      |
| **Dark Mode**       | next-themes                                     | Handles theme persistence, system preference detection, and flash-of-wrong-theme prevention. Trivial to add, high polish impact.                                                                       |
| **Testing**         | Vitest + React Testing Library                  | Vitest is fast (native ESM, Vite-powered) with Jest-compatible API. RTL enforces testing user behavior over implementation details.                                                                    |
| **Linting**         | ESLint + Prettier + Husky + lint-staged         | Automated code quality enforcement. Husky runs lint-staged on pre-commit so no unformatted or linting-error code enters the repo.                                                                      |
| **API**             | Open-Meteo                                      | Free, no API key required, reliable weather + geocoding endpoints. No auth complexity for a take-home task.                                                                                            |

## Architecture Decisions

- **All external API calls go through Next.js API routes** (`/api/weather`, `/api/geocoding`) — keeps API logic server-side, enables Zod validation before data reaches the client, and avoids CORS issues.
- **Zustand + localStorage** for search history instead of a database — appropriate for client-side persistence in a take-home scope. The store interface is clean enough to swap in a backend later.
- **next-intl from day one** — even with English only, it separates UI strings from component logic. Adding a new locale is just a JSON file, no component changes needed.
- **Co-located types** — module-specific types live next to their code. Only shared types (Location, WeatherData, SearchHistoryEntry) live in `src/types/`.
- **WCAG 2.1 AA baseline** — semantic HTML, keyboard navigation, aria attributes, and contrast ratios are enforced through coding guidelines and ESLint (jsx-a11y). Not a full audit, but the foundations are in place for every component.
- **SEO via generateMetadata** — every public page exports localized metadata (title, description) through next-intl. Not a full SEO strategy (no sitemap, no JSON-LD) — appropriate for a single-page app, but the pattern scales if pages are added.
- **No over-engineering** — every dependency earns its place by solving a real problem with minimal setup cost. No Redux, no ORM, no CI pipeline — the scope is a polished single-page weather app.

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # Locale-wrapped pages
│   └── api/               # Server-side API route handlers
├── components/            # React components
│   └── ui/                # shadcn/ui base components
├── hooks/                 # Custom React hooks
├── i18n/                  # Internationalization config and messages
│   └── messages/          # Translation JSON files
├── lib/                   # Core logic (API clients, utilities, constants)
├── providers/             # React context providers
├── stores/                # Zustand state stores
└── types/                 # Shared TypeScript type definitions
```

## Known Limitations

- **Single locale** — i18n infrastructure is in place but only English translations exist. Adding languages requires only new JSON files in `src/i18n/messages/`.
- **No persistent backend** — search history lives in localStorage. Clearing browser data loses history.
- **Free API dependency** — Open-Meteo is free and keyless, which means no SLA, rate limit guarantees, or fallback provider. All async states (loading, error, empty) are handled gracefully in the UI, but there's no secondary weather API to fall back to if Open-Meteo is down — adding one would be over-engineering for this scope.
- **No production error monitoring** — error reporting uses console logging via `src/lib/logger.ts` (`captureError`, `captureMessage`). The interface is designed as a drop-in for Sentry — swap the implementations when deploying to production.

## Documentation

- [Implementation Plan](docs/implementation-plan.md)
- [Coding Guidelines](docs/coding-guidelines.md)
- [Testing Guidelines](docs/testing-guidelines.md)
- [AI Prompt History](docs/ai-prompts.md)
