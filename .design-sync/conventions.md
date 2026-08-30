## Raspberry / Sky design system — build conventions

**Setup.** No provider/root wrapper is required — there's no ThemeProvider or context you need to mount. Every component reads color from CSS custom properties on `:root`, already loaded via `styles.css`. Light mode is the default; add a `dark` class to any ancestor element to switch a whole subtree to dark mode (colors flip via `.dark { --snc-* }` overrides — no JS, no prop). Fonts (JetBrains Mono for headings, Manrope for body) load automatically via `styles.css`'s `@import`s to Google Fonts.

**Styling idiom — Tailwind utilities under a `snc:` prefix.** This system uses Tailwind v4 with `prefix(snc)`, so every utility class is written `snc:<utility>` (colon included, e.g. `className="snc:flex snc:gap-4 snc:p-4"`). Never write a bare Tailwind class like `bg-blue-500` — it won't exist in this stylesheet. Color utilities target the semantic mode tokens by name, not raw hex or scale values:

| Purpose | Class |
|---|---|
| Page/app background | `snc:bg-snc-background` |
| Card/panel background | `snc:bg-snc-surface` |
| Accented panel background | `snc:bg-snc-surface-accent` |
| Primary text | `snc:text-snc-text-primary` |
| Secondary/muted text | `snc:text-snc-text-secondary` |
| Border | `snc:border-snc-border` |
| Brand primary (buttons, links, active states) | `snc:bg-snc-primary` / `snc:text-snc-primary` / `snc:border-snc-primary` |
| Accent (secondary actions) | `snc:bg-snc-accent` / `snc:text-snc-accent` |
| Subtle brand background (selected nav item, highlighted card) | `snc:bg-snc-primary-subtle-bg` / `snc:bg-snc-accent-subtle-bg` |
| Status: success/warning/error/info | `snc:bg-snc-{status}-bg`, `snc:border-snc-{status}-border`, `snc:text-snc-{status}-text` — always use all three from the SAME status together (never mix, e.g. don't pair `success-bg` with `error-text`) |
| Heading font | `snc:font-snc-heading` (JetBrains Mono — use tight tracking like `snc:tracking-tight` at large sizes, it runs wide) |
| Body font | `snc:font-snc-body` (Manrope) |
| Spacing/radius | standard Tailwind scale, `snc:`-prefixed: `snc:p-4`, `snc:gap-2`, `snc:rounded-lg`, `snc:rounded-full`, etc. |

Icons come from `iconoir-react` (`import { Bell } from 'iconoir-react'`), tinted via the same mode-aware classes/CSS vars above — never a raw hex value.

**Where the truth lives.** `styles.css` is the entry point (imports the two Google Fonts stylesheets, then `_ds_bundle.css`, the full compiled stylesheet — every utility class and CSS custom property this system defines is enumerated there; read it before inventing a class name). Each component's `.prompt.md` and `.d.ts` in `components/**` document its exact prop API. `guidelines/design-system.md` (when present) has the fuller usage rationale (why primary shifts tone between modes, the bg/border/text triad rule for status colors).

**Compose from the real component set** (37 available: `Accordion, Autocomplete, Avatar, BarChart, BasicNavigationMenu, Button, Card, Checkbox, CmdK, ComplexNavigationMenu, DatePicker, DateRangePicker, FileUpload, InformationPanel, Input, LineChart, MasterDetailsTable, Modal, MultiSelect, NavigationBar, OptionsList, PieChart, SearchInput, Select, Separator, Sidebar, Spinner, StatCard, StatsGroup, StatusPill, Switch, Table, Tag, TextArea, ThemeToggle, Tooltip, Wizard` — plus `Heading`, `Paragraph`, `Link` for typography) rather than raw HTML elements wherever one fits — a raw `<button>` should become `<Button>`, a raw `<h2>` should become `<Heading level="h2">`, etc.

**Example** — a status card built idiomatically:

```tsx
import { Button, Card, StatusPill } from '@snc-software/snc-ui';

<Card
  header={
    <div className="snc:flex snc:items-center snc:justify-between snc:gap-4">
      <h3 className="snc:font-snc-heading snc:text-snc-text-primary snc:tracking-tight">
        Deployment
      </h3>
      <StatusPill variant="success">Live</StatusPill>
    </div>
  }
  content={
    <p className="snc:font-snc-body snc:text-snc-text-secondary snc:text-sm">
      Last run 2 minutes ago
    </p>
  }
  actions={<Button variant="secondary">View logs</Button>}
/>
```
