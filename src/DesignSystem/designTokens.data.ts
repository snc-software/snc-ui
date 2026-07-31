/**
 * Every `--snc-*` custom property declared in `src/design-tokens.css`, transcribed verbatim for the
 * "Design System" reference table. `dark` is only present for the 23 mode-aware tokens (mode + status
 * triads) — everything else (raw scales, fonts) is mode-independent and renders a single preview.
 */
export type DesignTokenCategory =
  'Raspberry' | 'Sky' | 'Neutral' | 'Mode' | 'Status' | 'Typography';

export type DesignTokenEntry =
  | {
      kind: 'color';
      variable: string;
      light: string;
      dark?: string;
      category: DesignTokenCategory;
      description: string;
    }
  | {
      kind: 'font';
      variable: string;
      value: string;
      category: 'Typography';
      description: string;
    };

const unreferencedScaleStep =
  "Not currently used by a semantic token. Don't use it directly in a component — pick the closest semantic token instead (e.g. `primary`, `accent`, `border`).";

export const designTokenEntries: DesignTokenEntry[] = [
  // Raspberry scale
  {
    kind: 'color',
    variable: '--snc-raspberry-50',
    light: '#fce4ec',
    category: 'Raspberry',
    description:
      'Backs `primary-subtle-bg` in light mode. Use that token, not this value directly.',
  },
  {
    kind: 'color',
    variable: '--snc-raspberry-100',
    light: '#f8bbd0',
    category: 'Raspberry',
    description: unreferencedScaleStep,
  },
  {
    kind: 'color',
    variable: '--snc-raspberry-200',
    light: '#f48fb1',
    category: 'Raspberry',
    description: unreferencedScaleStep,
  },
  {
    kind: 'color',
    variable: '--snc-raspberry-300',
    light: '#f06292',
    category: 'Raspberry',
    description: 'Backs `primary-hover` in dark mode. Use that token, not this value directly.',
  },
  {
    kind: 'color',
    variable: '--snc-raspberry-400',
    light: '#ec407a',
    category: 'Raspberry',
    description: 'Backs `primary` in dark mode. Use that token, not this value directly.',
  },
  {
    kind: 'color',
    variable: '--snc-raspberry-500',
    light: '#e91e63',
    category: 'Raspberry',
    description: unreferencedScaleStep,
  },
  {
    kind: 'color',
    variable: '--snc-raspberry-600',
    light: '#d81b60',
    category: 'Raspberry',
    description: unreferencedScaleStep,
  },
  {
    kind: 'color',
    variable: '--snc-raspberry-700',
    light: '#c2185b',
    category: 'Raspberry',
    description: 'Backs `primary` in light mode. Use that token, not this value directly.',
  },
  {
    kind: 'color',
    variable: '--snc-raspberry-800',
    light: '#ad1457',
    category: 'Raspberry',
    description: 'Backs `primary-hover` in light mode. Use that token, not this value directly.',
  },
  {
    kind: 'color',
    variable: '--snc-raspberry-900',
    light: '#880e4f',
    category: 'Raspberry',
    description: 'Backs `primary-subtle-bg` in dark mode. Use that token, not this value directly.',
  },

  // Sky scale
  {
    kind: 'color',
    variable: '--snc-sky-50',
    light: '#f0f9ff',
    category: 'Sky',
    description: 'Backs `surface-accent` in light mode. Use that token, not this value directly.',
  },
  {
    kind: 'color',
    variable: '--snc-sky-100',
    light: '#e0f2fe',
    category: 'Sky',
    description: 'Backs `accent-subtle-bg` in light mode. Use that token, not this value directly.',
  },
  {
    kind: 'color',
    variable: '--snc-sky-200',
    light: '#bae6fd',
    category: 'Sky',
    description: unreferencedScaleStep,
  },
  {
    kind: 'color',
    variable: '--snc-sky-300',
    light: '#7dd3fc',
    category: 'Sky',
    description: unreferencedScaleStep,
  },
  {
    kind: 'color',
    variable: '--snc-sky-400',
    light: '#38bdf8',
    category: 'Sky',
    description: 'Backs `accent` in dark mode. Use that token, not this value directly.',
  },
  {
    kind: 'color',
    variable: '--snc-sky-500',
    light: '#0ea5e9',
    category: 'Sky',
    description: 'Backs `accent` in light mode. Use that token, not this value directly.',
  },
  {
    kind: 'color',
    variable: '--snc-sky-600',
    light: '#0284c7',
    category: 'Sky',
    description: unreferencedScaleStep,
  },
  {
    kind: 'color',
    variable: '--snc-sky-700',
    light: '#0369a1',
    category: 'Sky',
    description: unreferencedScaleStep,
  },
  {
    kind: 'color',
    variable: '--snc-sky-800',
    light: '#075985',
    category: 'Sky',
    description: unreferencedScaleStep,
  },
  {
    kind: 'color',
    variable: '--snc-sky-900',
    light: '#0c4a6e',
    category: 'Sky',
    description: 'Backs `accent-subtle-bg` in dark mode. Use that token, not this value directly.',
  },

  // Neutral scale
  {
    kind: 'color',
    variable: '--snc-neutral-50',
    light: '#f8fafc',
    category: 'Neutral',
    description:
      'Backs `background` in light mode and `text-primary` in dark mode. Use those tokens, not this value directly.',
  },
  {
    kind: 'color',
    variable: '--snc-neutral-100',
    light: '#f1f5f9',
    category: 'Neutral',
    description: unreferencedScaleStep,
  },
  {
    kind: 'color',
    variable: '--snc-neutral-200',
    light: '#e2e8f0',
    category: 'Neutral',
    description: 'Backs `border` in light mode. Use that token, not this value directly.',
  },
  {
    kind: 'color',
    variable: '--snc-neutral-300',
    light: '#cbd5e1',
    category: 'Neutral',
    description: unreferencedScaleStep,
  },
  {
    kind: 'color',
    variable: '--snc-neutral-400',
    light: '#94a3b8',
    category: 'Neutral',
    description: 'Backs `text-secondary` in dark mode. Use that token, not this value directly.',
  },
  {
    kind: 'color',
    variable: '--snc-neutral-500',
    light: '#64748b',
    category: 'Neutral',
    description: unreferencedScaleStep,
  },
  {
    kind: 'color',
    variable: '--snc-neutral-600',
    light: '#475569',
    category: 'Neutral',
    description: 'Backs `text-secondary` in light mode. Use that token, not this value directly.',
  },
  {
    kind: 'color',
    variable: '--snc-neutral-700',
    light: '#334155',
    category: 'Neutral',
    description: 'Backs `border` in dark mode. Use that token, not this value directly.',
  },
  {
    kind: 'color',
    variable: '--snc-neutral-800',
    light: '#1e293b',
    category: 'Neutral',
    description: 'Backs `surface-accent` in dark mode. Use that token, not this value directly.',
  },
  {
    kind: 'color',
    variable: '--snc-neutral-900',
    light: '#0f172a',
    category: 'Neutral',
    description:
      'Backs `text-primary` in light mode and `surface` in dark mode. Use those tokens, not this value directly.',
  },
  {
    kind: 'color',
    variable: '--snc-neutral-950',
    light: '#020617',
    category: 'Neutral',
    description: 'Backs `background` in dark mode. Use that token, not this value directly.',
  },

  // Typography
  {
    kind: 'font',
    variable: '--snc-font-family-heading',
    value: "'JetBrains Mono', monospace",
    category: 'Typography',
    description: 'Use for all Heading levels (h1–h6).',
  },
  {
    kind: 'font',
    variable: '--snc-font-family-body',
    value: "'Manrope', sans-serif",
    category: 'Typography',
    description: 'Use for body copy, labels, and UI chrome (e.g. Paragraph).',
  },

  // Mode tokens
  {
    kind: 'color',
    variable: '--snc-background',
    light: '#f8fafc',
    dark: '#020617',
    category: 'Mode',
    description: 'Use for the outermost page/app canvas — the base layer everything else sits on.',
  },
  {
    kind: 'color',
    variable: '--snc-surface',
    light: '#ffffff',
    dark: '#0f172a',
    category: 'Mode',
    description: 'Use for card, panel, and modal backgrounds that sit above `background`.',
  },
  {
    kind: 'color',
    variable: '--snc-surface-accent',
    light: '#f0f9ff',
    dark: '#1e293b',
    category: 'Mode',
    description:
      'Use for tinted nested panels or secondary surfaces that need to stand apart from `surface`.',
  },
  {
    kind: 'color',
    variable: '--snc-text-primary',
    light: '#0f172a',
    dark: '#f8fafc',
    category: 'Mode',
    description: 'Use for primary body copy and headings — the default text color.',
  },
  {
    kind: 'color',
    variable: '--snc-text-secondary',
    light: '#475569',
    dark: '#94a3b8',
    category: 'Mode',
    description: 'Use for muted/secondary text — captions, helper text, timestamps.',
  },
  {
    kind: 'color',
    variable: '--snc-border',
    light: '#e2e8f0',
    dark: '#334155',
    category: 'Mode',
    description: 'Use for default borders on surfaces, inputs, and dividers.',
  },
  {
    kind: 'color',
    variable: '--snc-primary',
    light: '#c2185b',
    dark: '#ec407a',
    category: 'Mode',
    description: 'Use for solid-fill buttons, links, and other primary interactive/active states.',
  },
  {
    kind: 'color',
    variable: '--snc-primary-hover',
    light: '#ad1457',
    dark: '#f06292',
    category: 'Mode',
    description: 'Use for the hover/active state of primary-colored elements.',
  },
  {
    kind: 'color',
    variable: '--snc-primary-subtle-bg',
    light: '#fce4ec',
    dark: '#880e4f',
    category: 'Mode',
    description:
      'Use for subtle emphasis — selected nav items, highlighted cards — instead of a full-strength `primary` fill.',
  },
  {
    kind: 'color',
    variable: '--snc-accent',
    light: '#0ea5e9',
    dark: '#38bdf8',
    category: 'Mode',
    description: 'Use for secondary emphasis — icons and secondary highlights.',
  },
  {
    kind: 'color',
    variable: '--snc-accent-subtle-bg',
    light: '#e0f2fe',
    dark: '#0c4a6e',
    category: 'Mode',
    description: 'Use for subtle accent emphasis — the accent equivalent of `primary-subtle-bg`.',
  },

  // Semantic status triads
  {
    kind: 'color',
    variable: '--snc-success-bg',
    light: '#dcfce7',
    dark: '#14532d',
    category: 'Status',
    description:
      'Use for success toasts, alerts, badges/status pills, and form validation. Always pair with `success-border`/`success-text` from the same mode.',
  },
  {
    kind: 'color',
    variable: '--snc-success-border',
    light: '#16a34a',
    dark: '#22c55e',
    category: 'Status',
    description:
      'Use for success toasts, alerts, badges/status pills, and form validation. Always pair with `success-bg`/`success-text` from the same mode.',
  },
  {
    kind: 'color',
    variable: '--snc-success-text',
    light: '#166534',
    dark: '#86efac',
    category: 'Status',
    description:
      'Use for success toasts, alerts, badges/status pills, and form validation. Always pair with `success-bg`/`success-border` from the same mode.',
  },
  {
    kind: 'color',
    variable: '--snc-warning-bg',
    light: '#fef3c7',
    dark: '#78350f',
    category: 'Status',
    description:
      'Use for warning toasts, alerts, badges/status pills, and form validation. Always pair with `warning-border`/`warning-text` from the same mode.',
  },
  {
    kind: 'color',
    variable: '--snc-warning-border',
    light: '#d97706',
    dark: '#f59e0b',
    category: 'Status',
    description:
      'Use for warning toasts, alerts, badges/status pills, and form validation. Always pair with `warning-bg`/`warning-text` from the same mode.',
  },
  {
    kind: 'color',
    variable: '--snc-warning-text',
    light: '#92400e',
    dark: '#fcd34d',
    category: 'Status',
    description:
      'Use for warning toasts, alerts, badges/status pills, and form validation. Always pair with `warning-bg`/`warning-border` from the same mode.',
  },
  {
    kind: 'color',
    variable: '--snc-error-bg',
    light: '#fee2e2',
    dark: '#7f1d1d',
    category: 'Status',
    description:
      'Use for error toasts, alerts, badges/status pills, and form validation. Always pair with `error-border`/`error-text` from the same mode.',
  },
  {
    kind: 'color',
    variable: '--snc-error-border',
    light: '#dc2626',
    dark: '#ef4444',
    category: 'Status',
    description:
      'Use for error toasts, alerts, badges/status pills, and form validation. Always pair with `error-bg`/`error-text` from the same mode.',
  },
  {
    kind: 'color',
    variable: '--snc-error-text',
    light: '#991b1b',
    dark: '#fca5a5',
    category: 'Status',
    description:
      'Use for error toasts, alerts, badges/status pills, and form validation. Always pair with `error-bg`/`error-border` from the same mode.',
  },
  {
    kind: 'color',
    variable: '--snc-info-bg',
    light: '#e0f2fe',
    dark: '#0c4a6e',
    category: 'Status',
    description:
      'Use for info toasts, alerts, badges/status pills, and form validation. Always pair with `info-border`/`info-text` from the same mode.',
  },
  {
    kind: 'color',
    variable: '--snc-info-border',
    light: '#0284c7',
    dark: '#38bdf8',
    category: 'Status',
    description:
      'Use for info toasts, alerts, badges/status pills, and form validation. Always pair with `info-bg`/`info-text` from the same mode.',
  },
  {
    kind: 'color',
    variable: '--snc-info-text',
    light: '#075985',
    dark: '#7dd3fc',
    category: 'Status',
    description:
      'Use for info toasts, alerts, badges/status pills, and form validation. Always pair with `info-bg`/`info-border` from the same mode.',
  },
];
