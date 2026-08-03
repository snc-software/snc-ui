import type { StatCardProps } from '@/Components/StatCard';
import type { SncComponent } from '@/Types/SncComponent';
import type { Ref } from 'react';

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
  ref?: Ref<HTMLDivElement>;
}>;
