# Testing guide

This app uses Jest for the test runner and React Testing Library for user-facing component
tests. Next.js supplies the TypeScript, JSX, and App Router transforms through `next/jest`.

The goal of the suite is to protect behavior: what a visitor can see or do, what an API route
returns, and what shared logic calculates. Avoid snapshots of large pages and assertions tied
only to Tailwind class names; those tests tend to fail during harmless design changes.

## Quick start

Install the exact dependency versions from the lockfile:

```bash
npm ci
```

Run the entire suite once:

```bash
npm test
```

Useful variants:

```bash
npm run test:watch              # Rerun tests affected by edited files
npm run test:coverage           # Test and write the HTML coverage report
npm test -- Pagination          # Run tests matching a filename or test name
npm test -- --runInBand         # Run serially when debugging shared state
npx tsc --noEmit                # Type-check application and test code
```

After a coverage run, open `coverage/lcov-report/index.html` in a browser to inspect uncovered
lines and branches by file. The generated `coverage/` directory should not be committed.

## Configuration

- `jest.config.cjs` extends the Next.js Jest transformer, maps the `@/` alias to `src/`, clears
  mocks between tests, selects V8 coverage, and uses jsdom by default.
- `jest.setup.ts` loads the `@testing-library/jest-dom` matchers and supplies browser APIs such
  as `matchMedia` that jsdom does not implement.
- `package.json` contains the normal, watch, and coverage commands.

Coverage includes every `.ts` and `.tsx` file beneath `src/`; only declaration files (`.d.ts`)
are omitted because they contain no executable JavaScript. Jest enforces at least 90% globally
for statements, branches, functions, and lines.

## Suite layout

Put tests close to the code they protect in a `__tests__` directory:

```text
src/
├── app/api/__tests__/routes.test.ts
├── components/__tests__/Pagination.test.tsx
└── utils/__tests__/getRange.test.ts
```

Use `*.test.ts` for non-React logic and `*.test.tsx` when the test renders JSX. Prefer a test
filename matching its subject. A combined route file is acceptable for a few short handlers;
split it when the setup or scenarios become difficult to scan.

## What to test

### Utilities

Cover normal inputs, boundaries, invalid input, and error behavior. Table-driven tests work
well for compact helpers:

```ts
import getRange from '@/utils/getRange';

it.each([
  [4, [0, 1, 2, 3]],
  [0, []],
])('builds a range ending at %s', (end, expected) => {
  expect(getRange(end)).toEqual(expected);
});
```

When a helper uses time, randomness, the filesystem, or storage, control that dependency with
a mock. Restore spies when a test changes a global implementation.

### Components

Render components through React Testing Library and query them the way assistive technology
does: by role, accessible name, label, or visible text. Exercise the user action and assert its
observable result.

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import Pagination from '@/components/Pagination';

it('reports a selected page', () => {
  const onPageChange = jest.fn();
  render(
    <Pagination
      activePage={1}
      limit={10}
      total={30}
      mode="client"
      onPageChange={onPageChange}
    />,
  );

  fireEvent.click(screen.getByRole('button', { name: '2' }));
  expect(onPageChange).toHaveBeenCalledWith(2);
});
```

Use `userEvent` for realistic typing, keyboard navigation, tabbing, and multi-step interaction.
`fireEvent` is suitable for a single low-level event. Use asynchronous queries such as
`findByRole` when a result appears after an effect, promise, or request.

Test both English and Japanese output when locale changes behavior. For components using
`LocaleProvider`, either render the provider and mock `next/navigation`, or mock `useLocale`
when locale routing is outside the behavior under test.

### Local storage and browser state

jsdom provides `localStorage`. Clear it before every test that reads or writes saved items or
likes so tests remain independent:

```ts
beforeEach(() => {
  localStorage.clear();
});
```

Set storage before rendering when testing hydration. Assert both the visible state and the
serialized value when persistence is part of the contract.

### API route handlers

Route handlers execute on the server, so their files must select Jest's Node environment before
any imports:

```ts
/** @jest-environment node */

import { NextRequest } from 'next/server';
```

Construct a `NextRequest`, call the exported handler directly, and inspect its status and JSON.
Mock database connections, models, email, and OpenAI calls; unit tests must not contact real
services or require secrets.

```ts
const request = new NextRequest('http://localhost/api/example', {
  method: 'POST',
  body: JSON.stringify({ name: 'share' }),
  headers: { 'Content-Type': 'application/json' },
});

const response = await POST(request);
expect(response.status).toBe(200);
expect(await response.json()).toEqual({ ok: true });
```

Every handler should cover malformed JSON or invalid input, missing optional configuration,
successful dependency calls, dependency failures, locale handling, and output sanitization
where applicable. Copy and restore `process.env` when a test changes configuration:

```ts
const originalEnv = process.env;

beforeEach(() => {
  process.env = { ...originalEnv };
});

afterAll(() => {
  process.env = originalEnv;
});
```

### Server actions and content APIs

Mock MongoDB models for like actions. For blog and project content readers, use small fixtures
that represent English and Japanese content and mock filesystem calls when testing parsing,
sorting, filtering, heading extraction, or missing-file behavior. Do not make tests depend on
the creation timestamps of files in a developer's checkout.

### Animation and canvas UI

Assert deterministic animation configuration and meaningful state transitions rather than
pixel output. Mock Framer Motion, GSAP, Three.js, canvas contexts, observers, and animation
frames at the boundary when necessary. Keep one integration test for the visitor interaction;
test mathematical helpers separately as ordinary unit tests.

## Mocking conventions

- Mock external boundaries, not the function being tested.
- Declare `jest.mock(...)` at module scope so Jest can hoist it safely.
- Use `jest.mocked(value)` for typed access to a mocked import.
- Prefer fixed test data over copied production content.
- Clear call history in `beforeEach` when the global `clearMocks` option is not sufficient for
  replaced implementations.
- Never place API keys, email addresses intended for tests, or database credentials in fixtures.
- Avoid mocking React Testing Library, browser accessibility queries, or simple child components
  unless their dependencies prevent the parent behavior from being exercised.

## Coverage

Run:

```bash
npm run test:coverage -- --runInBand
```

Read all four metrics:

- **Statements**: executable statements reached.
- **Branches**: both sides of conditionals, fallbacks, and optional paths reached.
- **Functions**: functions or callbacks invoked.
- **Lines**: source lines executed.

High line coverage alone is not enough. A route can execute every line while missing validation
branches or failure behavior. Add scenarios for real decisions instead of importing files solely
to inflate the number. Coverage exclusions belong only to non-executable declarations or code
that cannot meaningfully run under Jest; document any new exclusion in the pull request.

The coverage report measures the whole configured source scope. Do not narrow
`collectCoverageFrom` to make the target pass. The global threshold applies in
`jest.config.cjs` so local runs and CI enforce the same contract.

The terminal table also colors individual files. Those colors are diagnostic and are separate
from Jest's enforced global threshold: a yellow file can coexist with a passing global gate.
Red files should be treated as untested modules and receive a focused test. Pure TypeScript
declarations live in `.d.ts` files because they are erased at build time and have no runtime
behavior for Jest to execute.

## Debugging failures

### `window is not defined`

A component test is probably running in the Node environment, or server and browser tests were
mixed in one file. Remove the Node environment annotation or split the suites.

### `Request is not defined`

A Next.js route test is probably running in jsdom. Add `/** @jest-environment node */` at the top
of the test file.

### State leaks between tests

Clear `localStorage`, reset changed environment variables, restore fake timers, and restore
global spies. A test must pass both alone and as part of the full suite.

### An element cannot be found

Use `screen.debug()` temporarily and check the accessible role or name. If rendering changes
after an asynchronous effect, await a `findBy...` query instead of querying immediately.

### Coverage differs locally and in CI

Use `npm ci`, the supported Node version, and the V8 provider configured by the project. Avoid
tests based on the machine's timezone, locale, filesystem timestamps, or random output.

## Before submitting a change

1. Add or update tests for every behavior changed.
2. Run the focused test while developing.
3. Run `npm test` for the complete suite.
4. Run `npx tsc --noEmit`.
5. Run `npm run test:coverage` when executable branches were added.
6. Confirm no secrets, generated coverage files, or brittle snapshots are included.
