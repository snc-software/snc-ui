import Spinner from '@/Components/Spinner';
import StatCard from '@/Components/StatCard';
import { cn } from '@/Utils/cn';

import { ColumnClasses, DefaultEmptyMessage, MAX_ITEMS } from './StatsGroup.constants';
import { classes } from './StatsGroup.styles';

import type { StatsGroupProps } from './StatsGroup.types';

export default function StatsGroup({
  ref,
  items,
  isLoading = false,
  emptyMessage = DefaultEmptyMessage,
  className,
  ...rest
}: StatsGroupProps) {
  const visibleItems = items.slice(0, MAX_ITEMS);
  const columnCount = visibleItems.length as keyof typeof ColumnClasses;
  const isEmpty = !isLoading && visibleItems.length === 0;

  return (
    <div
      ref={ref}
      className={cn(classes.root, !isLoading && !isEmpty && ColumnClasses[columnCount], className)}
      {...rest}
    >
      {isLoading && (
        <div className={classes.loading}>
          <Spinner size="xl" />
        </div>
      )}

      {isEmpty && <div className={classes.empty}>{emptyMessage}</div>}

      {!isLoading &&
        !isEmpty &&
        visibleItems.map(({ id, ...cardProps }) => <StatCard key={id} {...cardProps} />)}
    </div>
  );
}
