const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})/;

/**
 * `yyyy-MM-dd`, zero-padded — the plain date-only shape `onChange` emits when `includeTime` is
 * `false`.
 */
export function formatDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Full ISO 8601 string at UTC midnight for the given calendar date (e.g. `2026-07-31T00:00:00.000Z`)
 * — the trailing `Z` from `toISOString()` is what makes the instant unambiguously UTC to consumers.
 */
export function formatWithMidnightUtc(date: Date): string {
  const utcMidnight = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

  return utcMidnight.toISOString();
}

/**
 * Reads only the `yyyy-MM-dd` portion of `value` (whether it's a plain date or a full ISO datetime)
 * and builds the equivalent local `Date`, so a UTC-midnight `includeTime` value round-trips back to
 * the same calendar date regardless of the consumer's timezone.
 */
export function parseIsoDate(value: string | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }

  const match = ISO_DATE_PATTERN.exec(value);

  if (!match) {
    return undefined;
  }

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  return Number.isNaN(date.getTime()) ? undefined : date;
}
