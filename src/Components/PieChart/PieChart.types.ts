import type { ChartCommonProps } from '@/Internal/ChartBase';
import type { SncComponent } from '@/Types/SncComponent';

export type PieChartDatum = {
  /**
   * Stable key, also used as the Recharts `dataKey` for this slice.
   */
  id: string;
  /**
   * Legend/tooltip display text.
   */
  label: string;
  value: number;
  /**
   * Overrides the palette-assigned color for this slice.
   */
  color?: string;
};

export type PieChartProps = SncComponent<
  ChartCommonProps & {
    /**
     * One entry per slice.
     */
    data: PieChartDatum[];
  }
>;
