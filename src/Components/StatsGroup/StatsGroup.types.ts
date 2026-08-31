import type { StatCardProps } from '@/Components/StatCard';
import type { SncComponent } from '@/Types/SncComponent';
import type { ReactNode, Ref } from 'react';

export type StatsItem = {
  /**
   * Stable identifier used as the React list key. Not forwarded to the rendered `StatCard`.
   */
  id: string;
} & Pick<
  StatCardProps,
  | 'variant'
  | 'label'
  | 'value'
  | 'icon'
  | 'status'
  | 'trendValue'
  | 'trendDirection'
  | 'sparklineData'
  | 'donutValue'
>;

export type StatsGroupProps = SncComponent<{
  /**
   * The stat cards to render, in order. Silently capped at 4 — entries beyond the 4th are not
   * rendered.
   */
  items: StatsItem[];
  /**
   * Replaces the entire card grid with a single loading indicator.
   * @default false
   */
  isLoading?: boolean;
  /**
   * Shown in place of the card grid when `items` is empty and `isLoading` is false.
   * @default 'No data found'
   */
  emptyMessage?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}>;
