# Testing Guidelines

## Philosophy

**"Write tests. Not too many. Mostly integration."** (Kent C. Dodds)

Every test must justify itself by one of:

- **Boundary logic** — parsing, validation, edge cases humans miss
- **Regression protection** — behavior that broke before or is fragile
- **Refactoring confidence** — test the contract so internals can change freely
- **Integration between systems** — API contract → hook → state → UI

The more your tests resemble the way your software is used, the more confidence they give you.

## Test Runner

- **Vitest** with jsdom environment
- Global test APIs enabled (`describe`, `it`, `expect` — no imports needed)
- Setup file: `src/__tests__/setup.ts` (loads `@testing-library/jest-dom/vitest` matchers)

## Testing Library

- **React Testing Library** — user-centric testing philosophy
- Query elements by role, label, placeholder, or text — not by class or test ID
- Use `@testing-library/user-event` for simulating user interactions (preferred over `fireEvent` — simulates real browser events: focus, keydown, input, blur)

## File Location

- Test files are co-located with source files
- Naming: `component-name.test.tsx` next to `component-name.tsx`
- Shared test utilities go in `src/__tests__/`

## What to Test

- **Behavior, not implementation** — test what a function does (inputs/outputs, observable side effects), not how it does it. If you refactor internals, tests should still pass.
- **Boundaries and edge cases** — empty inputs, null/undefined, maximum values, off-by-one errors
- **Error paths** — verify that invalid inputs produce correct error messages/codes, not just that happy paths work
- **Integration points** — test that modules work together correctly at their boundaries
- **User interactions** — typing, clicking, selecting from dropdown
- **All async states** — loading, success, error, and empty states
- **Real validation logic** — test against actual Zod schemas, not mocked validation. If a field name in the schema doesn't match what the component reads, the test should catch it.

## What NOT to Test

- **Framework internals** — don't test that React renders a `<div>` or that Next.js calls your route handler
- **shadcn/ui component internals** — they're tested upstream
- **CSS/styling details** — visual testing is out of scope
- **Trivial code** — simple getters, pass-through functions, and type-only transformations
- **Lookup tables** — a test that asserts a static map returns its own values (e.g. `weather-code → label`) breaks and gets updated together with the map. It pads coverage without catching anything real.
- **Third-party library behavior** — don't test that `date-fns` formats dates correctly or that Zod rejects invalid types. Test your code that uses these libraries.
- **Things TypeScript already catches** — don't write tests that verify type-level constraints
- **Tests already covered by other assertions** — if a `toEqual` on the full response shape already proves a field is absent, don't add a separate `not.toHaveProperty` test for it

## Mocking

### The Golden Rule

**Every mock is a place where your test can silently diverge from reality.** Mock the minimum needed to make the test run.

### Always mock (external boundaries)

- **API calls** — use `vi.mock` to mock axios or `vi.stubGlobal('fetch', ...)` for server-side routes. Never hit real endpoints in unit tests (contract tests are separate).
- **Logger** — mock `@/lib/logger` in tests that exercise error paths to suppress stderr noise.
- **Debounce** — mock to call immediately. Tests shouldn't depend on timing.

### Prefer real code over mocks

- **Zod schemas** — test against the real schema. A mocked schema that always returns `success: true` catches nothing.
- **Zustand stores** — use the real store when practical. If you mock the store, you won't catch selector shape changes or argument mismatches.
- **Your own utility functions** — never mock `cn()`, helper functions, etc.
- **Your own hooks** (when possible) — a mocked hook that returns whatever you want proves nothing about real wiring.

### Be honest about mock limitations

When you mock a dependency, you are asserting: "I trust the contract between my code and this dependency will not change." That trust must be backed by:

- TypeScript enforcing the contract at compile time
- An integration test elsewhere that exercises the real contract
- The dependency being external and stable (React, Next.js)

If none apply, you're writing a test that can pass while the real code is broken.

## Test Structure

- **Arrange-Act-Assert** — set up data, execute the operation, verify the result. Keep the three sections visually distinct.
- **One concept per test** — a test should verify one behavioral expectation. Multiple asserts are fine if they verify one logical concept.
- **Descriptive test names** — `it('returns 404 when location does not exist')` not `it('test error case')`. The test name is your documentation.
- **Tests are independent** — no test should depend on another test running first. Each test sets up its own state.
- **Keep tests DRY, but not at the cost of readability** — shared setup is fine (`beforeEach`). But if understanding a test requires jumping to 5 helper files, inline the setup.

```typescript
describe('SearchBar', () => {
  it('renders search input', () => {
    // Arrange
    render(<SearchBar />)
    // Assert
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('shows autocomplete results after typing', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<SearchBar />)
    // Act
    await user.type(screen.getByRole('searchbox'), 'London')
    // Assert
    expect(await screen.findByText('London, United Kingdom')).toBeInTheDocument()
  })
})
```

## Test Smells

- **Brittle tests** — tests that break when you refactor (but behavior is unchanged) are testing implementation, not behavior.
- **Tests longer than the code they test** — if mock setup is 100 lines and assertions are 5, you're likely testing at the wrong level.
- **Tests that always pass** — if a test has never failed (including during development), it probably doesn't test anything meaningful. Try introducing a bug and see if it catches it.
- **Snapshot overuse** — snapshots are fine for catching unintended changes to serialized output. Bad as the primary assertion for logic.
- **Excessive setup** — if a test needs 50 lines of setup, the code under test probably has too many dependencies. Simplify the code first.
- **Mocking your own code** — if you're mocking an internal utility or hook, ask why. Usually the answer is "because it's hard to set up" — that's a signal to simplify the code, not add more mocks.

## Coverage

- **Meaningful coverage, not 100%** — 100% coverage with shallow tests is worse than 80% coverage of critical paths with thorough tests.
- **Focus on risk** — data mutations, API parsing, and complex business rules deserve near-complete coverage. Static UI layout does not.
- **Coverage as a floor, not a ceiling** — use it to find untested code, not as a quality metric.

### Targets

- `src/lib/` functions: > 90%
- `src/components/`: > 80%
- `src/hooks/`: > 80%
- `src/stores/`: > 80%

## Contract Tests

Contract tests verify that our Zod schemas still match the real external API responses. They hit the live Open-Meteo API and catch schema drift — the most dangerous failure mode, since it's silent.

- Located in `src/__tests__/contracts/`
- Excluded from `npm test` (network-dependent, slower)
- Run separately via `npm run test:contract`
- Use a dedicated Vitest config (`vitest.contract.config.ts`) with a 10s timeout
- Should run in CI on a schedule (e.g., daily), not on every push

If a contract test fails, it means the external API changed its response shape and our Zod schemas need updating.

## Running Tests

```bash
npm test              # Run all unit tests once
npm run test:watch    # Watch mode (re-run on file change)
npm run test:coverage # Generate coverage report
npm run test:contract # Run contract tests against live APIs
```
