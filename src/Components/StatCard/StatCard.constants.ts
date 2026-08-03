import { cn } from '@/Utils/cn';

export const Variants = {
  basic: cn('snc:flex-col'),
  trend: cn('snc:flex-col'),
  sparkline: cn('snc:flex-col'),
  donut: cn('snc:flex-row snc:items-center snc:gap-4'),
} as const;

/**
 * CSS colour strings (not Tailwind classes) for `MiniSparkline`'s stroke / `MiniDonut`'s fill,
 * which need a real paintable value rather than a class name.
 */
export const StatusColors = {
  success: 'var(--snc-success-text)',
  warning: 'var(--snc-warning-text)',
  error: 'var(--snc-error-text)',
} as const;

export const NeutralColor = 'var(--snc-text-secondary)';

/**
 * Tailwind text-colour classes for the trend-arrow wrapper, which inherits colour via
 * `currentColor`.
 */
export const StatusTextClasses = {
  success: cn('snc:text-snc-success-text'),
  warning: cn('snc:text-snc-warning-text'),
  error: cn('snc:text-snc-error-text'),
} as const;

export const NeutralTextClass = cn('snc:text-snc-text-secondary');

/**
 * Faded background classes for the `icon` badge, paired with `StatusTextClasses`/
 * `NeutralTextClass` for the icon's own colour — the icon sits on a subtle tint of its own
 * status colour, darker text on a faded bg, matching the reference dashboard preview.
 */
export const StatusIconBgClasses = {
  success: cn('snc:bg-snc-success-bg'),
  warning: cn('snc:bg-snc-warning-bg'),
  error: cn('snc:bg-snc-error-bg'),
} as const;

export const NeutralIconBgClass = cn('snc:bg-snc-border');
