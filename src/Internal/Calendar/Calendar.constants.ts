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

/**
 * Applied when `minYear`/`maxYear` isn't supplied to {@link resolveYearRange}.
 */
export const DefaultMinYearOffset = 20;
export const DefaultMaxYearOffset = 10;

export const NavIconSize = 16;

export const DayCellVariants = {
  selected: cn('snc:bg-snc-primary-subtle-bg snc:text-snc-primary snc:font-semibold'),
  today: cn('snc:font-semibold'),
} as const;
