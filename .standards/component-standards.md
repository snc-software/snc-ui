# Component Standards

## Purpose

Defines how components are structured inside the solution

## When to Apply

Apply this standard when:

* A new component is being created
* An existing component is being modified

## Principles

* Components MUST use the React functional component structure
* Components MUST be accessible by default (see [Accessibility](#accessibility))
* Components MUST support standard HTML attribute passthrough for their root element (e.g. `...rest` spread), unless explicitly restricted for safety

## Required Practices

### File Structure

A component MUST have this structure at its basic level

```markdown
{ComponentName}
├── index.ts
├── {ComponentName}.tsx
├── {ComponentName}.test.tsx
├── {ComponentName}.styles.ts
└── {ComponentName}.types.ts
```

* **index.ts** re-exports the component (as default) and any related types for use within the solution
* **{ComponentName}.tsx** is the main component definition
* **{ComponentName}.test.tsx** is the unit test document for the component
* **{ComponentName}.styles.ts** is the file which holds all static, non-variant styles for the component
* **{ComponentName}.types.ts** is the file which holds the component's props interface and any relevant structures for the component

#### Conditionally Required Files

* **{ComponentName}.constants.ts** — REQUIRED when the component exposes variant, size, or other style-affecting props. MUST export a `Variants` object (and a `Sizes` object where applicable) where each key maps to a class string produced via `cn`. Also used for any other static, non-function constant values within the scope of the component. This file does not return JSX so it MUST be a plain `.ts` file, not `.tsx`.

```ts
// Button.constants.ts
import { cn } from '@/Utils/cn';

export const Variants = {
  primary: cn('snc-bg-primary snc-text-white', 'hover:snc-bg-primary-dark'),
  secondary: cn('snc-bg-secondary snc-text-black'),
} as const;

export const Sizes = {
  sm: cn('snc-h-8 snc-px-2 snc-text-sm'),
  md: cn('snc-h-10 snc-px-4 snc-text-base'),
} as const;
```

#### Optional Files

In some cases there is a need to extract functionality from the component. In these cases these files are optional but SHOULD be used when an appropriate need is met.

* **{ComponentName}.utils.ts** Contains definitions for static helper functions within the scope of the component
* **{ComponentName}.stories.tsx** Storybook stories — REQUIRED for any component intended for standalone consumer use (see [Storybook](#storybook)). This does NOT apply to compound sub-components (see [Compound Components](#compound-components)), which MUST NOT have their own stories file.

### Component Structure

* Components MUST follow the React functional component structure
* Components MUST use a **default export**
* Props MUST be destructured in the function signature, with any DOM passthrough props captured via `...rest`
* Boolean props MUST match the native HTML attribute name where an equivalent exists (e.g. `disabled`,  `readOnly`,  `checked`,  `required`,  `hidden`)
* Boolean props with no native HTML equivalent SHOULD use an `is`/`has`/`should` prefix for clarity (e.g. `isLoading`,  `hasError`)
* Callback props MUST be prefixed `on` (e.g. `onChange`,  `onClose`)
* `ref` MUST be accepted as a normal prop, in line with the underlying component's props type

```tsx
import { cn } from '@/Utils/cn';
import { Variants, Sizes } from './Button.constants';
import { classes } from './Button.styles';
import type { ButtonProps } from './Button.types';

export default function Button({
  ref,
  variant = 'primary',
  size = 'md',
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(classes.base, Variants[variant], Sizes[size])}
      {...rest}
    >
      {children}
    </button>
  );
}
```

### Base Component Types

* Every component's props MUST extend `SncComponent` (or `SncComponentWithChildren` if the component renders `children`) rather than redeclaring `className`,  `id`,  `style`, or `data-*` support individually
* These base types MUST live in a shared location (e.g. `src/Types/SncComponent.ts`) since they are cross-component, not component-scoped

```ts
// src/Types/SncComponent.ts
export type SncComponent<Props = object> = Props & {
  /**
   * Additional CSS classnames
   */
  className?: string;
  /**
   * Component Identifier
   */
  id?: string;
  /**
   * Optional in-line style properties
   */
  style?: React.CSSProperties;
  /**
   * Add data- attributes
   */
  [key: `data-${string}`]: unknown;
};

export type SncComponentWithChildren<Props = object> = SncComponent<Props> & {
  /**
   * Component Children
   */
  children?: React.ReactNode | undefined;
};
```

```ts
// Button.types.ts
import type { SncComponentWithChildren } from '@/Types/SncComponent';
import type { Variants } from './Button.constants';

export type ButtonProps = SncComponentWithChildren<{
  variant?: keyof typeof Variants;
  disabled?: boolean;
}>;
```

* `Props` MUST default to `object`, not `{}` — an empty object type (`{}`) matches almost any value other than `null`/`undefined` and is commonly flagged by stricter ESLint TypeScript configs
* A component MUST NOT redeclare `className`,  `id`,  `style`, or `data-*` handling itself; these always come from the base type

### Exports (index.ts)

* **index.ts** MUST re-export the component as the default export
* **index.ts** MUST re-export the component's public types from `{ComponentName}.types.ts`

```ts
export { default } from './Button';
export type { ButtonProps } from './Button.types';
```

### Styles

* Static, non-variant styling MUST be done via a plain object of strings inside the `{ComponentName}.styles.ts` file
* Variant/size-dependent styling MUST live in `{ComponentName}.constants.ts` as described above
* Styling MUST use the `cn` function to merge styles gracefully
* Styling MUST use Tailwind utilities where appropriate

```ts
export const classes = {
  base: cn('snc-inline-flex snc-items-center snc-rounded-md'),
} as const;
```

### Compound Components

* Where a component is composed of related sub-parts (e.g. `Card` with a header and body), sub-components MUST be named with the parent as a prefix (e.g. `CardHeader`,  `CardBody`) rather than using dot-notation (`Card.Header`)
* Sub-components MUST live within their parent's component folder (e.g. `Card/CardHeader.tsx`) and MUST be re-exported from the parent's `index.ts`. For component families with a large number of sub-components (roughly 8+), each sub-component MAY instead live in its own subdirectory nested under the parent (e.g. `Sidebar/SidebarHeader/SidebarHeader.tsx`) to keep the parent folder's file listing manageable — this still counts as "living within the parent's component folder." A nested sub-component subdirectory MUST contain at minimum `{SubComponentName}.tsx` and an `index.ts` re-exporting it (plus its own `.test.tsx` where the sub-component has dedicated tests); it MUST NOT duplicate the parent's shared `.styles.ts`/`.types.ts`/`.constants.ts` files unless the "share unless complexity warrants a split" rule below already justifies a split for that sub-component
* Sub-components are building blocks, not standalone consumable components — they MUST NOT have their own `{ComponentName}.stories.tsx`. Only the parent (e.g. `Card`) has a stories file, and its story MUST demonstrate the sub-components in context
* Since a sub-component (e.g. `CardHeader`) only makes sense as a child of its parent, this constraint MUST be documented via a JSDoc comment on the sub-component
* Each sub-component MAY have its own `.types.ts` entry but SHOULD share a single `.styles.ts`/`.constants.ts` file for the group unless complexity warrants a split

### Controlled vs Uncontrolled State

* Input-style components MUST support both controlled (`value`/`onChange` supplied) and uncontrolled (`defaultValue`) usage where feasible
* Components MUST NOT hold state that duplicates a value already supplied by the consumer; state should be lifted or derived, not mirrored
* Input components MUST remain compatible with [React Hook Form](https://react-hook-form.com/) (per coding-standards) — this means accepting `ref` and standard `name`/`value`/`onChange`/`onBlur` props

### Accessibility

* Components MUST use semantic HTML elements as the basis for their root element (e.g. a `Button` renders a `<button>`, not a styled `<div>`)
* Interactive components MUST be operable via keyboard (tab order,  `Enter`/`Space` activation, arrow-key navigation for composite widgets such as menus or tabs)
* Components MUST expose appropriate ARIA attributes where semantic HTML alone is insufficient (e.g. `aria-expanded`,  `aria-selected`,  `aria-live`)
* Focus MUST be visibly indicated and MUST NOT be trapped or lost unexpectedly (e.g. on open/close of a modal, focus MUST move to and return from the modal correctly)
* Images and icon-only interactive elements MUST provide accessible text (`alt`,  `aria-label`, or visually hidden text)

### Storybook

* Any standalone component intended for consumer use MUST have a corresponding `{ComponentName}.stories.tsx`
* Compound sub-components MUST NOT have their own stories file — they are covered only within their parent's story (see [Compound Components](#compound-components))
* Stories MUST cover the default state and each variant/size combination
* Stories SHOULD document all public props via controls (`argTypes`)

### Documentation

* Complex or non-obvious props MUST be documented with a JSDoc comment above the prop in `{ComponentName}.types.ts`
* Components with non-trivial usage patterns (e.g. compound components, render props) SHOULD include a short usage example in the Storybook story's docs page

## Prohibited Practices

NEVER

* Declare constants inside the component file — these live in `.constants.ts`
* Declare types inside the component file — these live in `.types.ts`
* Use inline `style` attributes for styling that could be expressed via Tailwind/`cn`
* Use `any` for props or component state
* Mirror a consumer-supplied prop into local state without a clear derivation reason
* Render a non-semantic element (e.g. `<div onClick>`) where a semantic interactive element is appropriate
* Use dot-notation (`Card.Header`) for compound sub-components — use a prefixed name instead (`CardHeader`)
* Add a `.stories.tsx` file for a compound sub-component
* Redeclare `className`,  `id`,  `style`, or `data-*` prop support instead of extending `SncComponent`/`SncComponentWithChildren`

## Related Standards

* See [Coding Standards](./coding-standards.md) for project structure, theming, and formatting
* See [Unit Test Standards](./unit-test-standards.md) for `{ComponentName}.test.tsx` requirements
