# snc-ui

React component library built on the Raspberry / Sky design system. Components ship as a Vite
library build, are developed and documented in Storybook, and consume design tokens exposed as
CSS custom properties.

**[Browse the component library →](https://snc-software.github.io/snc-ui/)**

## Getting Started

Node version is pinned via `.nvmrc` (`nvm use`).

```bash
npm install
npm run storybook   # component dev environment (http://localhost:6006)
```

## Documentation Site

Storybook is published to GitHub Pages at
[snc-software.github.io/snc-ui](https://snc-software.github.io/snc-ui/). Every push to `main`
rebuilds and redeploys it via the `Deploy Storybook` workflow; the workflow can also be run manually
from the Actions tab.

## Scripts

| Script                    | Purpose                                        |
| ------------------------- | ---------------------------------------------- |
| `npm run storybook`       | Start Storybook for component development      |
| `npm run build-storybook` | Build the static Storybook site                |
| `npm run build`           | Type-check and build the library (`dist/`)     |
| `npm run lint`            | Run ESLint                                     |
| `npm run test`            | Run the Vitest suite                           |
| `npm run test:coverage`   | Run the Vitest suite with coverage (80% floor) |
| `npm run format`          | Format the repo with Prettier                  |
| `npm run format:check`    | Check formatting without writing               |

## Project Structure

```text
src/
├── Components/   # Component folders, re-exported from index.ts
├── Shared/       # Cross-component constants
├── Types/        # Cross-component types (SncComponent, SncComponentWithChildren)
├── Utils/        # Cross-component utilities (cn, etc.)
├── index.ts      # Library entry point
├── index.css     # Library stylesheet entry (imports Tailwind + tokens)
├── design-tokens.css   # Raw design tokens as CSS custom properties
└── tailwind-theme.css  # Tailwind theme mapping consuming design-tokens.css
```

## Path Aliases

Each top-level `src` folder is aliased and MUST be imported via its alias rather than a relative
path that traverses outside the current folder:

| Alias          | Resolves to      |
| -------------- | ---------------- |
| `@/Components` | `src/Components` |
| `@/Shared`     | `src/Shared`     |
| `@/Types`      | `src/Types`      |
| `@/Utils`      | `src/Utils`      |

## Styling

Tailwind utilities are generated under the `snc:` prefix (Tailwind v4 `prefix()`), and every theme
token also carries its own `snc-` prefix, e.g. `snc:bg-snc-primary`, `snc:bg-snc-raspberry-50`. The
`snc:` prefix marks a utility as coming from this library; the `snc-` prefix marks the token itself
as an snc-branded value. Design tokens are defined once in `src/design-tokens.css` and mapped into
Tailwind's theme in `src/tailwind-theme.css` — see [`DESIGN SYSTEM.md`](./DESIGN%20SYSTEM.md) and
[`design-tokens.json`](./design-tokens.json) for the full token reference. Dark mode is triggered
by a `.dark` class on `<html>`/`<body>`.

## Standards

All component and coding conventions for this repo live in [`.standards/`](./.standards):

- [`coding-standards.md`](./.standards/coding-standards.md)
- [`component-standards.md`](./.standards/component-standards.md)
- [`unit-test-standards.md`](./.standards/unit-test-standards.md)
