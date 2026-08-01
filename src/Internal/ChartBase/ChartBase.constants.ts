export const DefaultChartHeight = 320;

export const DefaultEmptyMessage = 'No data found';

/**
 * No categorical/multi-series palette is defined in the design system (only brand, semantic status
 * triads, and raw scales) — this sequence was derived from existing tokens and confirmed with the
 * engineer. `--snc-primary`/`--snc-accent` already flip between modes via the existing `.dark`
 * class mechanism; the remaining scale-step entries are fixed values chosen to hold reasonable
 * contrast in both modes.
 */
export const DefaultColorPalette = [
  'var(--snc-primary)',
  'var(--snc-accent)',
  'var(--snc-raspberry-400)',
  'var(--snc-sky-700)',
  'var(--snc-neutral-500)',
  'var(--snc-raspberry-900)',
  'var(--snc-sky-300)',
  'var(--snc-neutral-700)',
] as const;
