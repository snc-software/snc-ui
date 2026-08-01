import { cn } from '@/Utils/cn';

/**
 * Full names drive each weekday header's `aria-label`; `WeekdaySymbols` is what's actually displayed
 * (single character, per design review), so screen readers still announce the whole day name.
 */
export const WeekdayLabels = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;
export const WeekdaySymbols = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const;

export const MonthLabels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const NavIconSize = 16;

export const DayCellVariants = {
  // Boundary (start/end) day — solid fill, pill-capped on its outer edge, so it reads as bolder than
  // the light trail fill between the two ends.
  boundary: cn('snc:bg-snc-primary snc:text-snc-surface snc:font-semibold'),
  boundaryStart: cn('snc:rounded-l-full'),
  boundaryEnd: cn('snc:rounded-r-full'),
  // Strictly-between day — light tint, no rounding, so it visually joins the two boundary ends.
  inRange: cn('snc:bg-snc-primary-subtle-bg snc:rounded-none'),
  today: cn('snc:font-semibold'),
} as const;
