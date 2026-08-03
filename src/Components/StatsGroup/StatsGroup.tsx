import StatCard from '@/Components/StatCard';
import { cn } from '@/Utils/cn';

import { ColumnClasses, MAX_ITEMS } from './StatsGroup.constants';
import { classes } from './StatsGroup.styles';

import type { StatsGroupProps } from './StatsGroup.types';

export default function StatsGroup({ ref, items, className, ...rest }: StatsGroupProps) {
  const visibleItems = items.slice(0, MAX_ITEMS);
  const columnCount = visibleItems.length as keyof typeof ColumnClasses;

  return (
    <div ref={ref} className={cn(classes.root, ColumnClasses[columnCount], className)} {...rest}>
      {visibleItems.map(({ id, ...cardProps }) => (
        <StatCard key={id} {...cardProps} />
      ))}
    </div>
  );
}
