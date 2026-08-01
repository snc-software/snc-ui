import { Xmark } from 'iconoir-react';

import { cn } from '@/Utils/cn';

import { classes } from './TableFilterChip.styles';

import type { TableFilterChipProps } from './TableFilterChip.types';

/**
 * A single active filter, shown above the grid with a control to remove it.
 *
 * Only meaningful as a child of `TableFilterPanel`.
 */
export default function TableFilterChip({
  title,
  value,
  onClear,
  className,
  ...rest
}: TableFilterChipProps) {
  return (
    <div className={cn(classes.base, className)} {...rest}>
      <div className={classes.content}>
        <span className={classes.title}>{title}:</span>
        <span className={classes.value}>{value}</span>
      </div>
      <button
        type="button"
        aria-label={`Clear ${title.toLowerCase()} filter`}
        className={classes.clear}
        onClick={onClear}
      >
        <Xmark width={14} height={14} />
      </button>
    </div>
  );
}
