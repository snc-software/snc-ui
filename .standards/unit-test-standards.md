# Unit Test Standards

## Purpose

Defines how to unit test inside the solution

## When to Apply

Apply this standard when:
* ALWAYS

## Principles

* Application MUST have at least 80% Test Coverage
* Coverage is a floor, not a target in itself — a component MUST NOT be considered adequately tested purely because it hits the coverage number (see [What to Test](#what-to-test))

## Required Practices

### Technologies

* Testing MUST be done via Vitest
* [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) MUST be used for simplifying tests

### What to Test

At a bare minimum, every component MUST have functional tests covering:

* **Rendering** — the component renders without error with default and minimal required props
* **User interaction** — clicks, typing, keyboard navigation, and any other supported interaction produce the expected result (state change, callback invocation, etc.)
* **Variants/props** — each `variant`/`size`/state-affecting prop renders the expected output (e.g. `disabled` prevents interaction)
* **Accessibility basics** — the component is queryable via accessible queries (`getByRole`,  `getByLabelText`) rather than only `getByTestId`

Snapshot tests MAY be used to supplement the above, but MUST NOT be the only test for a component — a snapshot alone does not verify behaviour.

### Query Priority

Tests MUST prefer queries in this order (per [Testing Library's guidance](https://testing-library.com/docs/queries/about/#priority)):

1. `getByRole`
2. `getByLabelText` / `getByPlaceholderText` / `getByText`
3. `getByTestId` — only when no accessible query is feasible

### Test Structure

* Test files MUST use `describe` blocks per component (and per method/scenario grouping where useful)
* Individual test blocks MUST use `it` (not `test`) for consistency across the codebase, e.g. `it('disables the button when disabled is true')`
* Tests MUST follow an Arrange-Act-Assert structure
* Each `it` block SHOULD assert one behaviour; avoid bundling multiple unrelated assertions into a single test

### Mocking

* Dependencies MUST be mocked using Vitest mock to ensure a component is tested in isolation
* Timers/async waits MUST use `waitFor`/`findBy*` from React Testing Library rather than arbitrary `setTimeout` delays

## Prohibited Practices

NEVER

* Mark a test as complete with `.only` or `.skip` left in place
* Rely solely on a snapshot test to cover a component's behaviour
* Test third-party library internals (e.g. asserting on React Hook Form's internal state rather than the component's own behaviour)
* Test implementation details (internal state, private functions) instead of observable behaviour
* Use arbitrary fixed delays (`setTimeout`) to wait for async updates instead of `waitFor`/`findBy*`

## Related Standards

* See [Component Standards](./component-standards.md) for the `{ComponentName}.test.tsx` file requirement
* See [Coding Standards](./coding-standards.md) for general project conventions
