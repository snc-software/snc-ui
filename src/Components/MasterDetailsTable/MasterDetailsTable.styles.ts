import { cn } from '@/Utils/cn';

/**
 * This component's own layout only — the surface, scroll-area, table and cell treatments come from
 * `@/Internal/TableBase`'s `classes`, the same ones `Table` uses.
 *
 * Both panes scroll independently, which only works inside a bounded height: `h-full` takes that from
 * the consumer's container, and `min-h-0` on each flex child stops the default `min-height: auto` from
 * letting a long list push its parent taller instead of scrolling.
 */
export const classes = {
  root: cn('snc:flex snc:h-full snc:min-h-0 snc:w-full snc:flex-col snc:gap-y-2'),
  // Holds the two panes side by side, below the full-width toolbar and filter chips.
  paneRow: cn('snc:flex snc:min-h-0 snc:w-full snc:flex-1 snc:items-stretch snc:gap-x-2'),
  masterPane: cn('snc:min-h-0 snc:transition-[width] snc:duration-300'),
  /**
   * Plain widths rather than flex ratios, so the transition between the two states animates. 30% is
   * the Apple Mail proportion — the list stays readable while the detail takes the majority.
   */
  masterPaneFull: cn('snc:w-full'),
  masterPaneSplit: cn('snc:w-[30%]'),
  // Vertical scrolling is this layout's addition; the shared `scrollArea` only handles the x axis.
  masterScrollArea: cn('snc:min-h-0 snc:flex-1 snc:overflow-y-auto'),
  detailPane: cn('snc:flex snc:min-h-0 snc:min-w-0 snc:flex-1'),
} as const;
