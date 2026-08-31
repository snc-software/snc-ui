import { cn } from '@/Utils/cn';

export const MAX_ITEMS = 4;

export const DefaultEmptyMessage = 'No data found';

/**
 * Column count per row, keyed by the (capped) item count, so the grid fills the row instead of
 * always reserving 4 tracks (e.g. 2 items -> 50/50, 3 items -> 33/33/33 at `lg:`). Single column
 * on mobile regardless of count.
 */
export const ColumnClasses = {
  1: cn('snc:grid-cols-1'),
  2: cn('snc:grid-cols-1 snc:sm:grid-cols-2'),
  3: cn('snc:grid-cols-1 snc:sm:grid-cols-2 snc:lg:grid-cols-3'),
  4: cn('snc:grid-cols-1 snc:sm:grid-cols-2 snc:lg:grid-cols-4'),
} as const;
