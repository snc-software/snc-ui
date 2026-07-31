import { formatDateOnly } from '@/Utils/isoDate';

/**
 * Joins a committed `yyyy-MM-dd – yyyy-MM-dd` range for the trigger's display text. Empty until both
 * sides are set — matches `DatePicker`'s pattern of only reflecting a fully committed value, never
 * in-progress panel state.
 */
export function formatRangeDisplay(start: Date | undefined, end: Date | undefined): string {
  if (!start || !end) {
    return '';
  }

  return `${formatDateOnly(start)} – ${formatDateOnly(end)}`;
}
