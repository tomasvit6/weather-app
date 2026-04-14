# Design System

## Design Philosophy

This is a weather app, not a dashboard. The UI should feel calm, fast, and focused.

- **Content-first** — let the weather data breathe. Avoid decorative elements that compete with information.
- **Information hierarchy** — current weather is the hero, search is the primary action, history is secondary context.
- **Progressive disclosure** — show essentials (temperature, condition) immediately; details (humidity, wind, feels-like) are visible but visually subordinate.
- **Minimal chrome** — the interface should disappear behind the content. Every element earns its place.

## Component Architecture

Three tiers, each with a clear responsibility:

1. **Primitives** (`src/components/ui/`) — shadcn/ui components. Unstyled building blocks. Never modify these directly; extend via composition and className props.
2. **Feature components** (`src/components/`) — `SearchBar`, `WeatherCard`, `SearchHistory`. Each owns one responsibility, manages its own state, and composes primitives.
3. **Page composition** (`src/app/[locale]/`) — arranges feature components into layouts. Minimal logic here.

Props interfaces are defined above each component, typed strictly. No `any`, no implicit types.

## Layout and Spacing

Mobile-first responsive design. Most users check weather on their phone.

- **Container**: `max-w-4xl` centered with horizontal padding
- **Spacing scale**: Tailwind units — `gap-4` (16px) between related elements, `gap-6` (24px) between sections, `gap-8` (32px) for major divisions
- **Breakpoints**: `sm` (640px) and `md` (768px) handle most layout shifts. `lg` (1024px) only if needed.
- **Single-column mobile**, expanding to a wider card layout on larger screens

## Color and Theming

All colors flow through CSS custom properties defined by shadcn/ui theming:

- `--background`, `--foreground` for base surfaces and text
- `--card`, `--card-foreground` for elevated content
- `--primary`, `--primary-foreground` for interactive elements
- `--muted`, `--muted-foreground` for secondary text and borders

Rules:

- Never hardcode hex or rgb values. Use Tailwind semantic classes (`bg-background`, `text-foreground`, `text-muted-foreground`).
- Dark and light mode via `next-themes`. Every color choice must work in both modes.
- Weather-contextual color accents (warm tones for sunny, cool for rain) are a nice-to-have, not MVP scope.

## Typography

System font stack (Tailwind default). No custom fonts — fast loading, native feel.

Hierarchy for the weather display:

- **Location name**: `text-lg font-semibold` or `text-xl font-bold` — establishes context
- **Temperature**: hero-sized (`text-5xl` or `text-6xl font-bold`) — the single most important number
- **Condition**: `text-lg` or `text-xl` — "Partly cloudy", "Light rain"
- **Details** (humidity, wind, feels-like): `text-sm text-muted-foreground` — supporting information, visually quieter

## Motion and Animation

Animations are functional, not decorative. They orient the user during state changes.

- **Library**: Motion (framer-motion) for declarative enter/exit transitions
- **Durations**: 150-300ms. Weather data should feel snappy, not theatrical.
- **Where to animate**: card enter/exit on location change, dropdown appear/disappear, weather data crossfade on update
- **Where not to animate**: initial page load, static content, background color transitions (CSS transitions suffice)
- **Accessibility**: always respect `prefers-reduced-motion`. Motion provides built-in support via `useReducedMotion` — disable transform/opacity animations for users who opt out.

## Accessibility (WCAG 2.1 AA)

Not an afterthought. Built into component design from the start.

- **Semantic HTML**: `<main>`, `<section>`, `<button>`, `<input>` — never `<div onClick>`.
- **Keyboard navigation**: all interactive elements reachable via Tab, activatable via Enter/Space. Autocomplete dropdown supports arrow keys and Escape to dismiss.
- **Live regions**: `aria-live="polite"` on weather data container and search results — screen readers announce updates without interrupting.
- **Contrast**: minimum 4.5:1 ratio for all text, verified in both light and dark modes.
- **Focus indicators**: visible focus rings on all interactive elements. Never remove outlines without providing an alternative.
- **Labels**: meaningful `aria-label` on icon-only buttons. Form inputs always have associated labels (visible or `sr-only`).

## Iconography

Lucide React for all icons. Consistent visual weight across the interface.

- **Sizes**: 16px (`size={16}`) inline with text, 20px in buttons, 24px standalone
- **Stroke**: default stroke width (2px) — do not customize per-icon
- **Weather icons**: Lucide icons mapped to WMO weather codes — `Sun`, `Cloud`, `CloudRain`, `CloudDrizzle`, `Snowflake`, `CloudLightning`, `CloudFog`, etc. The mapping lives in the weather codes module alongside condition strings.
- **Interactive icons**: always paired with `aria-label` or visible text. An icon alone is not a label.
