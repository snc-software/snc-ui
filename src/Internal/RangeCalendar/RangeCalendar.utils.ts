/**
 * Whether `date` falls strictly between `a` and `b`, regardless of which of the two is
 * chronologically earlier — callers pass `rangeStart`/`rangeEnd` (or a live hover preview) without
 * needing to pre-sort them.
 */
export function isWithinRange(date: Date, a: Date, b: Date): boolean {
  const [earlier, later] = a <= b ? [a, b] : [b, a];

  return date > earlier && date < later;
}
