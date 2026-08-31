import Card from '@/Components/Card';
import Skeleton from '@/Components/Skeleton';
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
      role={isLoading ? 'status' : undefined}
      aria-label={isLoading ? 'Loading' : undefined}
      className={cn(classes.root, !isEmpty && ColumnClasses[columnCount], className)}
      {...rest}
    >
      {isEmpty && <div className={classes.empty}>{emptyMessage}</div>}

      {isLoading &&
        visibleItems.map(({ id }) => (
          <Card
            key={id}
            content={
              <div>
                <div className={classes.loadingCardHeader}>
                  <Skeleton shape="text" className={classes.loadingCardLabel} />
                  <Skeleton shape="circle" className={classes.loadingCardIcon} />
                </div>
                <Skeleton shape="text" className={classes.loadingCardValue} />
              </div>
            }
          />
        ))}

      {!isLoading &&
        !isEmpty &&
        visibleItems.map(({ id, ...cardProps }) => <StatCard key={id} {...cardProps} />)}
    </div>
  );
}
