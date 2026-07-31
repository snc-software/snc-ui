const DefaultMinYearOffset = 20;
const DefaultMaxYearOffset = 10;

export type CalendarDayOrigin = 'previous' | 'current' | 'next';

export type CalendarDay = {
  date: Date;
  origin: CalendarDayOrigin;
};

export type YearRange = {
  minYear: number;
  maxYear: number;
};

export type MonthYear = {
  year: number;
  month: number;
};

const DAYS_IN_WEEK = 7;
const WEEKS_IN_GRID = 6;
const GRID_SIZE = DAYS_IN_WEEK * WEEKS_IN_GRID;

/**
 * `Date#getDay()` runs Sunday(0)-Saturday(6); shifting so Monday lands on 0 puts the grid's first
 * column on Monday, matching the Monday-start requirement.
 */
function toMondayFirstWeekday(date: Date): number {
  return (date.getDay() + 6) % 7;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Always a fixed 42-cell (6x7) grid, filled with real leading/trailing days from the adjacent months
 * where the requested month doesn't fill every row — the common date-picker UX, rather than blank
 * filler cells, so the grid height never changes between months and a boundary day is one click away.
 */
export function buildMonthGrid(year: number, month: number): CalendarDay[] {
  const firstOfMonth = new Date(year, month, 1);
  const leadingDays = toMondayFirstWeekday(firstOfMonth);
  const gridStart = new Date(year, month, 1 - leadingDays);

  return Array.from({ length: GRID_SIZE }, (_, index) => {
    const date = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + index,
    );

    const origin: CalendarDayOrigin =
      date.getFullYear() === year && date.getMonth() === month
        ? 'current'
        : date < firstOfMonth
          ? 'previous'
          : 'next';

    return { date, origin };
  });
}

/**
 * Whichever bound isn't supplied defaults independently off the current year, so passing only one of
 * `minYear`/`maxYear` doesn't force the other to a matching value.
 */
export function resolveYearRange(minYear?: number, maxYear?: number): YearRange {
  const currentYear = new Date().getFullYear();

  return {
    minYear: minYear ?? currentYear - DefaultMinYearOffset,
    maxYear: maxYear ?? currentYear + DefaultMaxYearOffset,
  };
}

export function addMonths({ year, month }: MonthYear, delta: number): MonthYear {
  const total = month + delta;
  const normalizedMonth = ((total % 12) + 12) % 12;
  const yearOffset = Math.floor(total / 12);

  return { year: year + yearOffset, month: normalizedMonth };
}
