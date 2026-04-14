# Weather App

A weather web application that allows users to search for a location with autocomplete, view current weather conditions, and persist search history.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command                 | Description                          |
| ----------------------- | ------------------------------------ |
| `npm run dev`           | Start development server             |
| `npm run build`         | Production build                     |
| `npm start`             | Start production server              |
| `npm run lint`          | Run ESLint                           |
| `npm run format`        | Format code with Prettier            |
| `npm test`              | Run tests                            |
| `npm run test:watch`    | Run tests in watch mode              |
| `npm run test:coverage` | Run tests with coverage report       |
| `npm run test:contract` | Run contract tests against live APIs |

## Tech Stack

| Category            | Choice                                          | Why                                                                                                                                                                                                    |
| ------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Framework**       | Next.js 16 (App Router) + React 19 + TypeScript | Industry standard for production React apps. App Router enables server components, streaming, and API routes in one project. TypeScript strict mode catches bugs at compile time.                      |
| **Styling**         | Tailwind CSS 4 + shadcn/ui + Motion             | Tailwind for rapid utility-first styling. shadcn/ui provides accessible, customizable base components without lock-in (code lives in your repo). Motion for polished animations.                       |
| **Server State**    | @tanstack/react-query                           | Handles caching, background refetching, loading/error states, and stale-while-revalidate out of the box. Eliminates boilerplate for async data management.                                             |
| **Client State**    | Zustand                                         | Minimal API (~1KB), no boilerplate, built-in localStorage persistence via middleware. Scales cleanly without the ceremony of Redux.                                                                    |
| **HTTP Client**     | Axios                                           | Timeout configuration, typed responses, and a cleaner API than raw fetch. Interceptor support is available if global request/response handling is needed later.                                        |
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
- **No over-engineering** — every dependency earns its place by solving a real problem with minimal setup cost. No Redux, no ORM — the scope is a polished single-page weather app.
- **CI on every PR** — `.github/workflows/ci.yml` runs lint, format check, tests, and build. Contract tests are excluded from CI and run on demand (they hit live APIs).

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

## Assumptions, Tradeoffs & Known Limitations

### Assumptions

- **Single user, single browser** — no account system or cross-device sync needed; persistence is local to the browser.
- **Modern evergreen browser** — ES2022+, `localStorage`, and `fetch` are available. No IE / legacy polyfills shipped.
- **English-speaking audience** — only the English locale is bundled; the i18n infrastructure is in place so adding languages is a JSON file, not a refactor.
- **Take-home evaluation scope** — polish, correctness, and documentation were prioritized over breadth of features and over concerns that only appear under real production traffic (horizontal scaling, DDoS, multi-region).
- **Node ≥ 20** — pinned via `.nvmrc` and `engines` in `package.json` (required by Next.js 16).

### Tradeoffs

- **localStorage over a backend database** for search history. Simpler and sufficient at this scope; downside is history doesn't sync across devices. The Zustand store interface is clean enough to swap in a backend later without touching components.
- **Open-Meteo as the only provider, no fallback.** Free, keyless, reliable enough for a take-home — but no SLA and no redundancy. Adding a secondary weather API would be over-engineering here; the failure path surfaces errors to the user rather than masking them.
- **next-intl from day one with only English shipped.** Pays the infra cost up-front so adding a locale later is a JSON file with zero component changes. Costs nothing at runtime.
- **Axios over native `fetch`** (~15 KB) — gained: interceptors, timeout configuration, and cleaner typed requests. Worth the weight for a real API layer.
- **Zustand + React Query split** — two state libraries, each owning one concern cleanly (client state vs. server cache). Simpler in practice than forcing one library to do both.
- **Unit + component + contract tests; no E2E.** The critical paths are covered by Vitest + RTL plus contract tests that hit the real Open-Meteo endpoints to catch schema drift. A Playwright happy-path suite is the natural next step and is noted as a follow-up.
- **Husky locally + GitHub Actions CI.** Pre-commit hooks catch issues before code enters the repo; CI re-runs lint, format check, tests, and build on every PR. Contract tests are excluded from CI since they hit live APIs — they belong on a separate scheduled workflow if added later.
- **No Open Graph / Twitter card metadata.** `generateMetadata` sets title and description; social share previews are deliberately skipped — they'd require dedicated preview images and design work that doesn't belong in this scope. The favicon is wired via `src/app/icon.svg`.

### Known Limitations

- **Single locale shipped** — English only. Adding languages = new JSON file in `src/i18n/messages/` + entry in `src/i18n/routing.ts`.
- **No persistent backend** — search history lives in `localStorage`. Clearing browser data loses history; it doesn't sync across devices.
- **Free API dependency** — Open-Meteo provides no SLA, no rate-limit guarantees, and no fallback provider. Loading, error, and empty states are handled gracefully in the UI; rate-limit responses (429) are detected and surfaced.
- **Console-based error logging** — `src/lib/logger.ts` exposes `captureError` / `captureMessage` with a Sentry-compatible interface. Swap the implementations to wire real monitoring when deploying.
- **No fuzzy search or spell correction** on the input — the search relies on Open-Meteo's geocoding API directly (e.g. "Lodnon" won't suggest "London"). Typically handled by a dedicated search service (Algolia, Meilisearch) or the provider itself; out of scope here.

## Documentation

- [Implementation Plan](docs/implementation-plan.md)
- [Coding Guidelines](docs/coding-guidelines.md)
- [Testing Guidelines](docs/testing-guidelines.md)
- [AI Prompt History](docs/ai-prompts.md)
