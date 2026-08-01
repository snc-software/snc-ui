import { cn } from '@/Utils/cn';

export const classes = {
  // Content-driven width, same reasoning as Calendar: RangeCalendar floats in a `position: fixed`
  // Popout panel, so it sizes off its own two fixed-width month columns rather than a guessed number.
  wrapper: cn(
    'snc:inline-flex snc:flex-col',
    'snc:overflow-hidden snc:rounded-lg snc:border snc:border-snc-border snc:bg-snc-surface snc:shadow-lg',
    'snc:font-snc-body',
  ),
  // Row holding the two independent month columns plus the divider between them.
  panels: cn('snc:flex'),
  monthColumn: cn('snc:flex snc:flex-col'),
  // Per-column nav pane — an exact duplicate of Calendar's, since each month now navigates on its own.
  navPane: cn('snc:flex snc:items-center snc:gap-2', 'snc:bg-snc-primary snc:px-3 snc:py-2'),
  navButton: cn(
    'snc:flex snc:shrink-0 snc:items-center snc:justify-center',
    'snc:size-8 snc:rounded-md snc:text-snc-surface',
    'snc:transition-colors snc:duration-150',
    'snc:enabled:hover:bg-snc-primary-hover',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-snc-surface snc:focus-visible:ring-offset-2',
    'snc:disabled:cursor-not-allowed snc:disabled:opacity-50',
  ),
  navSelectors: cn('snc:flex snc:flex-1 snc:gap-2'),
  // `ch` sizes off the actual rendered font's own digit width — see Calendar.styles.ts for the same
  // reasoning. 9 characters covers the longest month names ("September"/"November"/"December").
  monthSelect: cn('snc:w-[calc(9ch+3rem)] snc:shrink-0'),
  // 4 characters — a year is always exactly 4 digits here (`resolveYearRange` never exceeds year 9999).
  yearSelect: cn('snc:w-[calc(4ch+3rem)] snc:shrink-0'),
  monthBody: cn('snc:flex snc:flex-col snc:gap-2 snc:p-3'),
  divider: cn('snc:w-px snc:bg-snc-border'),
  weekdayRow: cn('snc:flex snc:justify-center'),
  // `capitalize`, not `uppercase` — `WeekdaySymbols` is already cased exactly as intended ("Mo", not
  // "MO"); `uppercase` would force-transform every character regardless of source casing.
  weekdayHeader: cn(
    'snc:flex snc:size-9 snc:items-center snc:justify-center',
    'snc:font-snc-heading snc:text-xs snc:capitalize snc:text-snc-text-secondary',
  ),
  grid: cn('snc:flex snc:flex-col'),
  week: cn('snc:flex snc:justify-center'),
  day: cn(
    'snc:flex snc:size-9 snc:items-center snc:justify-center',
    'snc:rounded-md snc:text-snc-text-primary snc:text-sm',
    'snc:transition-colors snc:duration-150',
    'snc:hover:bg-snc-primary-subtle-bg',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-snc-primary snc:focus-visible:ring-offset-2',
  ),
  // Adjacent-month filler — same footprint as a day cell so the grid never reflows, but blank and
  // inert (no role, no text) since only the requested month's days are selectable.
  dayEmpty: cn('snc:size-9'),
} as const;
