import { cn } from '@/Utils/cn';

/**
 * Shared cell treatment. `TableHeadCell` and `TableBodyCell` both apply `cell`, so the 1px borders
 * collapse into a single continuous grid; splitting it per component would let the two drift apart and
 * break the alignment. Everything else here belongs to `Table`'s own root layout.
 */
export const classes = {
  cell: cn('snc:border snc:border-snc-border', 'snc:p-3', 'snc:font-snc-body snc:text-sm'),
  // Pulls each cell back over its neighbour's border so adjacent 1px borders render as one line.
  cellOverlap: cn('snc:mr-[-1px] snc:mt-[-1px]'),
  root: cn('snc:flex snc:w-full snc:flex-col snc:gap-y-2'),
  surface: cn(
    'snc:flex snc:flex-col snc:items-center snc:overflow-hidden',
    'snc:rounded-md snc:border snc:border-snc-border snc:bg-snc-surface',
  ),
  scrollArea: cn('snc:w-full snc:overflow-x-auto'),
  table: cn('snc:w-full snc:border-collapse'),
} as const;
