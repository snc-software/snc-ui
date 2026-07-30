# Raspberry / Sky Design System

Reference spec for generating on-brand, accessible components across repos. Pair this file with `design-tokens.json` — this doc explains intent and usage rules; the JSON holds the exact values. This system is styling-technology agnostic: map the JSON values into Tailwind config, CSS custom properties, styled-components theme, or whatever the consuming repo already uses.

## Principles

* Every component must support both **light** and **dark** mode using the tokens in `mode.light` / `mode.dark` — never hardcode a raw color scale value (e.g. `raspberry.700`) directly into a component; use the semantic mode token instead (e.g. `primary`).
* Semantic status colors (success/warning/error/info) always ship as a **bg / border / text** triad, never a single flat color. This is what gives toasts, alerts, and status pills their outlined, layered look.
* Primary brand color shifts tone between modes: `raspberry.700` in light mode,  `raspberry.400` in dark mode. This isn't a bug — a saturated 700 raspberry loses contrast on near-black backgrounds, so dark mode intentionally uses a lighter tint from the same scale.

## Color

Full scales (50–900/950) live in `design-tokens.json` under `color.raspberry` , `color.sky` , and `color.neutral` . Base/brand reference points:

| Role | Light mode | Dark mode |
|---|---|---|
| Primary | `#C2185B` (raspberry.700) | `#EC407A` (raspberry.400) |
| Primary hover | `#AD1457` (raspberry.800) | `#F06292` (raspberry.300) |
| Accent | `#0EA5E9` (sky.500) | `#38BDF8` (sky.400) |
| Background | `#F8FAFC` | `#020617` |
| Surface | `#FFFFFF` | `#0F172A` |
| Text primary | `#0F172A` | `#F8FAFC` |
| Text secondary | `#475569` | `#94A3B8` |
| Border | `#E2E8F0` | `#334155` |

### Semantic status (success / warning / error / info)

Each has a light and dark variant, each with `bg` , `border` , `text` . Use for toasts, inline alerts, badges/pills, and form validation states. Never mix a light-mode bg with a dark-mode text color or vice versa — always pull all three values from the same mode.

## Typography

| Role | Font | Weights | License |
|---|---|---|---|
| Heading | JetBrains Mono | 500 / 600 / 700 | SIL OFL — free, commercial use |
| Body | Manrope | 400 / 500 / 700 | SIL OFL — free, commercial use |

Both load via Google Fonts CDN (see `typography.*.source` in the JSON) or can be self-hosted. JetBrains Mono is monospaced and runs wider than a proportional face — apply tight letter-spacing ( `-0.02em` or so) at large heading sizes (H1/H2) to avoid overly loose type.

## Icons

**Iconoir** — MIT licensed, free for commercial use, 1, 600+ icons on a 24×24 grid, rounded/friendly style. For this React/Vite library, use the `iconoir-react` package (tree-shakeable components) rather than the CSS icon font:

```bash
npm install iconoir-react
```

```tsx
import { Bell, Heart, Home } from 'iconoir-react';

<Bell color="var(--color-primary)" width={24} height={24} />
```

Tint icons with the mode-aware semantic tokens ( `primary` , `accent` , `textSecondary` ), not raw scale values, for the same light/dark reasons as everything else.

## Component patterns established so far

* **Buttons**: solid fill using `primary` / `primaryHover` on interaction states.
* **Toasts**: `bg` + 1px `border` + `text` from the relevant semantic status triad, rounded corners (~8px).
* **Status pills**: same triad as toasts, pill/rounded-full shape, compact padding.
* **Subtle backgrounds** (e.g. selected nav item, highlighted card): `primarySubtleBg` or `accentSubtleBg` rather than a full-strength brand color.

## For Claude Code

When generating a new component in this library:
1. Read `design-tokens.json` for exact hex values — don't invent or approximate colors.
2. Always implement both light and dark variants using the `mode.light` / `mode.dark` tokens.
3. For any status/feedback UI (toast, badge, alert, form error), use the full bg/border/text triad from `color.semantic`, matched to the current mode.
4. Headings use the heading font token; body copy, labels, and UI chrome use the body font token.
5. Icons come from `iconoir-react`; tint via mode-aware semantic tokens, not raw scale values.
