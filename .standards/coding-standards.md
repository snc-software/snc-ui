# Coding Standards

## Purpose

Defines generic standards used within this solution.

## When to Apply

ALWAYS

## Principles

### Technology

* Vite MUST be used for the front end builder
* Vitest MUST be used for the testing assertions
* TypeScript MUST be used in `strict` mode (`"strict": true` in `tsconfig.json`)
* Input components MUST be compatible with React Hook Form - [React Hook Form](https://react-hook-form.com/)

### Branching Strategy

* Branch MUST be set correctly BEFORE any implementation
* All changes MUST be done on an isolated branch
* All branches MUST contain the work item number (Github Issue Number)
  + All feature briefs MUST start with the work item number (Github Issue Number)
* All branches MUST identify the type of change
  + Feature types MUST be prefixed `feature/`
  + Bug types MUST be prefixed `bug/`
  + Technical debt types MUST be prefixed `chore/`

Examples

* `feature/<work_item_number>` -> `feature/ISSUE-1234`
* `bug/<work_item_number>` -> `bug/ISSUE-1234`
* `chore/<work_item_number>` -> `chore/ISSUE-1234`

### Committing & Pull Requests

* Committing code is the sole responsibility of the developer — no tooling or AI agent may commit code under any circumstance
* Opening or merging a pull request (and pushing the branch it's built from) is likewise the developer's responsibility, with one narrow exception: an AI agent invoked explicitly via the `sc-pr-and-merge` command MAY push the current branch, open a pull request, and enable auto-merge, strictly following that command's own instructions
* Outside of an explicit `sc-pr-and-merge` invocation, tooling or an AI agent MUST NOT commit code, push to a branch, or open/merge a pull request under any circumstance — it may prepare, stage, or describe changes for the developer to review and commit/push/PR themselves

## Required Practices

### Project Structure

```markdown
snc-ui
├── .storybook
│   └── //.. Custom storybook config and theming
├── public
│   └── snc-ui-logo.svg // Brand Logo
├── src
│   ├── Components
│   │   ├── {ComponentName}
│   │   │   └── //.. Files created as per the component standards
│   │   └── index.ts // export all components
│   ├── Shared
│   │   └── constants.ts //shared constants applicable to multiple components
│   ├── Types
│   │   └── {TypeName}.ts
│   ├── Utils
│   │   ├── {UtilName}.ts
│   │   └── cn.ts
│   ├── index.ts // Main export for the library
│   ├── index.css // main css sheet for the library
│   └── design-tokens.css // Css variables exposing the design system
└── // General Config Files
```

### Path Aliases

* Each top-level folder under `src` MUST be aliased and imported via its alias rather than a relative path that traverses outside the current folder:
  + `@/Components` → `src/Components`
  + `@/Shared` → `src/Shared`
  + `@/Types` → `src/Types`
  + `@/Utils` → `src/Utils`
* Aliases MUST be configured in both `tsconfig.json` (`compilerOptions.paths`) and `vite.config.ts` (`resolve.alias`) so type-checking and the build stay in sync
* Relative imports (`./`,  `../`) MUST only be used for files within the same component folder (e.g. `Button.tsx` importing `./Button.styles`)

### Theming

* Design tokens (colours, spacing, font values as CSS custom properties) MUST be defined in `design-tokens.css` ONLY
* Tailwind theme mappings (colours and fonts utilities that consume those tokens) MUST be stated in the `tailwind-theme.css` file ONLY
* Tailwind utilities MUST be prefixed with `snc-`
* Custom CSS Variables MUST be prefixed with `snc-`

### TypeScript

* `any` MUST NOT be used; use `unknown` with a type guard, or a specific type/generic instead
* Type-only imports MUST use `import type { X } from '...'`
* Shared/cross-component types MUST live under `src/Types`; component-scoped types stay in that component's `.types.ts`
* Enums SHOULD be avoided in favour of union types or `as const` object maps, for better tree-shaking and consistency with the `Variants`/`Sizes` pattern used in components

### Linting

* ESLint MUST be used in addition to `prettier` for code quality (not just formatting)
* The following rule sets MUST form the baseline configuration:
  + `eslint:recommended`
  + `plugin:@typescript-eslint/recommended`
  + `plugin:react/recommended` and `plugin:react-hooks/recommended`
  + `plugin:jsx-a11y/recommended` (accessibility linting, ties to component-standards)
  + `plugin:import/recommended`
* The following rules MUST be enabled:
  + `react-hooks/exhaustive-deps` — error
  + `@typescript-eslint/no-explicit-any` — error
  + `@typescript-eslint/consistent-type-imports` — error
  + `no-console` — error (warn only permitted behind an explicit `// eslint-disable-next-line` with justification comment)
  + `import/order` — error, with a defined group order (builtin/external → internal → parent/sibling → type imports)
* Any disabled lint rule MUST be scoped to the smallest possible block (single line, not file-wide) and MUST include a comment explaining why

### Dependency Management

* A new dependency (runtime or dev) MUST NOT be added without explicit confirmation from the engineer first
* The exception is where the task brief explicitly names or specifies the dependency to use — this constitutes implicit consent and confirmation is not required
* A new dependency MUST NOT be added if an existing dependency already solves the same problem (e.g. do not add a second date library, a second class-merging utility, etc.)

### Environment

* The Node.js version MUST be pinned via an `.nvmrc` file and the `engines` field in `package.json`
* CI MUST use the same Node.js version as specified in `.nvmrc`

### Formatting

* All code MUST follow a consistent format
* All code MUST pass a format using the `prettier` extension
* Any unused `import` statements MUST be removed

## Prohibited Practices

NEVER

* Commit code as an automated tool or AI agent — this is the developer's responsibility alone, with no exception
* Push a branch, or open/merge a pull request, as an automated tool or AI agent — except when explicitly invoked via the `sc-pr-and-merge` command, which is authorized to push, open, and auto-merge a PR per its own instructions
* Introduce a new dependency without explicit engineer confirmation, unless it was already specified in the task brief
* Introduce a new dependency that duplicates existing functionality
* Leave `console.log`/`console.debug` statements in committed code
* Disable an ESLint rule file-wide without a documented reason

## Related Standards

* See [Component Standards](./component-standards.md) for component-level file structure and styling
* See [Unit Test Standards](./unit-test-standards.md) for testing requirements
