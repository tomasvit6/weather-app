# Coding Guidelines

## Core Principles

- **Single Responsibility**: Every function, component, and module should have one reason to change. If you can't describe what it does without "and", split it.
- **DRY**: Extract shared logic only when duplication is real (3+ occurrences with identical intent). Two similar blocks are often fine — premature abstraction is worse than duplication.
- **YAGNI**: Don't build for hypothetical futures. Implement what's needed now. Delete dead code — version control remembers.
- **KISS**: Choose the simplest solution that works. Complexity is a cost; justify every layer of indirection.
- **Principle of Least Surprise**: Code should behave the way a reader would expect. If a function name says `getWeather`, it shouldn't mutate state.

## TypeScript

- **Strict mode** enabled — no implicit any, strict null checks
- **No `any` type** — use `unknown` and narrow with type guards, or define proper types
- **All function parameters and return types must be typed**
- **Prefer `interface`** over `type` for object shapes (interfaces are extendable, produce better error messages)
- **Use discriminated unions** for states (loading | error | success) rather than multiple booleans
- **Use `as const`** for literal types and query keys
- **Zod at boundaries** — validate all external API responses; infer types: `type X = z.infer<typeof XSchema>`

## Functions

- **Keep functions short** — ideally under 20 lines. If a function needs a comment block explaining sections, those sections should be separate functions.
- **Limit parameters** — 3 or fewer. Beyond that, use an options/config object.
- **Prefer pure functions** — given the same input, return the same output with no side effects. Isolate side effects at the edges.
- **Use early returns** — guard clauses at the top eliminate nesting and make the happy path obvious.
- **Avoid boolean parameters** — they obscure intent at the call site. Use separate functions or an options object with named flags.

## Components

- **Functional components only** — no class components
- **Named exports** — `export function SearchBar()` (no default exports except Next.js pages/layouts/routes)
- **Props interface** defined above the component:

```tsx
interface SearchBarProps {
  onSelect: (location: Location) => void
  placeholder?: string
}

export function SearchBar({ onSelect, placeholder }: SearchBarProps) {
  // ...
}
```

- **Client components**: Add `'use client'` directive only when needed (event handlers, hooks, browser APIs)
- **Server components**: Default — no directive needed. Prefer server components where possible.
- **Composition over configuration** — prefer composing small components over one component with many props/flags
- **Lift state only when needed** — keep state as close to where it's used as possible
- **Derive state, don't sync it** — if a value can be computed from existing state/props, compute it. Don't create a second state that you try to keep in sync via `useEffect`.

## Naming

| Thing       | Convention           | Example               |
| ----------- | -------------------- | --------------------- |
| Files       | kebab-case           | `search-bar.tsx`      |
| Directories | kebab-case           | `use-debounce.ts`     |
| Components  | PascalCase           | `SearchBar`           |
| Functions   | camelCase            | `getWeather`          |
| Variables   | camelCase            | `searchQuery`         |
| Constants   | SCREAMING_SNAKE_CASE | `MAX_HISTORY_ENTRIES` |
| Types       | PascalCase           | `WeatherData`         |
| Interfaces  | PascalCase           | `SearchBarProps`      |
| Schemas     | PascalCaseSchema     | `WeatherDataSchema`   |

Additional naming rules:

- **Names reveal intent** — `remainingRetries` not `r`, `isEligibleForDiscount` not `flag`
- **Don't abbreviate** — `calculateTotalPrice` not `calcTotPrc`. Only universally understood abbreviations (`id`, `url`, `html`)
- **Booleans read as questions** — prefix with `is`, `has`, `can`, `should`: `isVisible`, `hasPermission`
- **Functions describe actions** — verbs first: `fetchUser`, `parseResponse`. Event handlers: `handleClick`, `onSubmit`
- **Be consistent** — pick one term per concept and stick with it across the codebase
- **Avoid generic names** — `data`, `info`, `item`, `temp` tell the reader nothing. Name things for what they represent.

## Imports

- **Always use `@/` alias** — `import { Location } from '@/types'` (never `../../types`)
- **No barrel exports** — import directly from the source file. Barrel exports cause circular dependency issues that produce runtime errors in production builds.
- **Import order** (enforced by eslint-plugin-simple-import-sort): Node built-ins → External packages → `@/` aliases → Relative → Styles
- **Co-locate types** — module-specific types live next to the code that uses them (props in component files, Zod-inferred types next to schemas). Only shared/global types used across multiple modules go in `src/types/`.

## Error Handling

- **Fail fast** — validate inputs at the boundary and reject bad data immediately. Don't pass invalid state through layers of code.
- **Be specific** — throw/return typed errors that tell the caller exactly what went wrong. `"Location not found"` not `"Bad request"`.
- **API routes**: `try/catch` around external API calls, return proper HTTP status codes with typed error body (`{ error: string; status: number }`)
- **UI components**: Error boundaries for unexpected crashes, Sonner toasts for expected errors (API failures, validation)
- **Never swallow errors** — an empty `catch {}` block is a bug waiting to happen. At minimum, log. If you genuinely expect an error and want to ignore it, add a comment explaining why.
- **Don't use exceptions for control flow** — use return types (discriminated unions, `null`) for expected failure modes.
- **Handle errors at the right level** — catch errors where you can actually do something about them.

## State

- **Minimize state** — derive values from existing state where possible
- **Derive state, don't sync it** — if a value can be computed from existing state/props, compute it. Never create a second state synced via `useEffect`.
- **Server state** in react-query (weather data, geocoding results)
- **Client state** in Zustand (search history, UI preferences)
- **Local state** in `useState` (input values, dropdown open/close)

## Render Performance

- **Memoize deliberately** — `React.memo`, `useMemo`, and `useCallback` have costs. Use them when you've measured a re-render problem, not by default.
- **Stable references** — define callbacks and objects outside the component or in `useMemo` when passing to memoized children or dependency arrays.
- **Key prop** — use stable, unique IDs for list keys. Never use array index as key for lists that can reorder/filter. Never use `Math.random()`.

## Data Fetching

- **Handle all states** — every async operation has loading, success, error, and empty states. Never ignore error or empty states.
- **Colocate data needs** — fetch data as close to where it's consumed as possible.

## CSS

- **Tailwind utility classes** — no custom CSS unless absolutely necessary
- **Use `cn()` helper** for conditional classes: `cn('base-class', isActive && 'active-class')`
- **Mobile-first responsive** — base styles for mobile, `sm:`, `md:`, `lg:` for larger screens
- **Use shadcn/ui components** as the base — don't build from scratch what shadcn provides

## Accessibility (WCAG 2.1 AA)

- **Semantic HTML** — use `<main>`, `<nav>`, `<section>`, `<button>` (not `<div onClick>`)
- **aria labels** on interactive elements without visible text
- **`aria-describedby`/`aria-invalid`** on form inputs with errors
- **`aria-live`** for dynamic content updates (search results, weather data loading)
- **Keyboard navigable** — all interactive elements reachable via Tab, activatable via Enter/Space
- **Focus indicators** — visible focus rings on all interactive elements (Tailwind's `focus-visible:`)
- **Color contrast** — 4.5:1 for normal text, 3:1 for large text

## Comments & Documentation

- **Code should be self-documenting** — if you need a comment to explain what code does, first try to make the code clearer (better names, extract function, simplify logic).
- **Comments explain _why_, not _what_** — `// Retry 3 times because Open-Meteo has intermittent 503s` is valuable. `// increment counter` is noise.
- **Delete commented-out code** — version control exists.
- **Keep comments in sync** — a wrong comment is worse than no comment.
- **TODO comments include context** — `// TODO(#123): migrate to new API after v3 release` not `// TODO: fix this`.

## Code Review Mindset

- **Readability is paramount** — code is read 10x more than it's written. Optimize for the reader.
- **Correctness over cleverness** — a straightforward solution that's obviously correct beats a clever one-liner that requires a comment.
- **Consistency over personal preference** — follow established patterns in the codebase.
- **Small, focused changes** — large PRs get rubber-stamped. Small, cohesive PRs get meaningful review.
