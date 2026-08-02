import type { SncComponent } from '@/Types/SncComponent';
import type { ButtonHTMLAttributes, Ref } from 'react';

export type Theme = 'light' | 'dark';

export type ThemeToggleProps = SncComponent<
  Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'className' | 'id' | 'style' | 'children' | 'type'
  > & {
    /**
     * Controlled current theme. When supplied, the component relies on the consumer to update it
     * via `onToggle` rather than tracking its own state.
     */
    theme?: Theme;
    /**
     * Uncontrolled initial theme. Ignored when `theme` is supplied.
     */
    defaultTheme?: Theme;
    /**
     * Called with the new theme after a click. Does not apply the theme itself — the consumer is
     * responsible for wiring the result to wherever `.dark` is rooted in their app.
     */
    onToggle?: (theme: Theme) => void;
    /**
     * Accessible name, applied as both `aria-label` and `title` (icon-only button — no visible
     * text). Overridden by an explicit `aria-label`.
     */
    label?: string;
    /**
     * Accepted as a normal prop so the root button can be referenced directly.
     */
    ref?: Ref<HTMLButtonElement>;
  }
>;
