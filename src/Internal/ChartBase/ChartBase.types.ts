import type { ReactNode } from 'react';

export type ChartSeries<TRow extends object> = {
  /**
   * Stable key, also used as the Recharts `dataKey` for this series.
   */
  id: string;
  /**
   * Legend/tooltip display text.
   */
  label: string;
  /**
   * Reads this series' value out of a row, matching `TableColumn.accessor`.
   */
  accessor: (row: TRow) => number;
  /**
   * Overrides the palette-assigned color for this series.
   */
  color?: string;
};

/**
 * Fields shared by every chart type, independent of how its data is shaped.
 */
export type ChartCommonProps = {
  /**
   * Accessible summary of what the chart shows, applied via `role="img"` since the chart itself is
   * an SVG with no inherent text content.
   */
  ariaLabel: string;
  /**
   * @default 320
   */
  height?: number;
  /**
   * Replaces the chart with a loading indicator.
   * @default false
   */
  isLoading?: boolean;
  /**
   * Shown in place of the chart when there is no data.
   * @default 'No data found'
   */
  emptyMessage?: ReactNode;
  /**
   * @default true
   */
  showLegend?: boolean;
  /**
   * Overrides the default series color palette.
   * @default DefaultColorPalette
   */
  colors?: readonly string[];
};

/**
 * Shared by `LineChart` and `BarChart`: both plot one or more `series` against a common
 * `xAxisKey`. `PieChart`'s data shape differs enough (a single set of proportional slices, not
 * multiple series over a shared axis) that it defines its own `data` shape on top of
 * `ChartCommonProps` instead of this type.
 */
export type CartesianChartBaseProps<TRow extends object> = ChartCommonProps & {
  data: TRow[];
  xAxisKey: Extract<keyof TRow, string>;
  series: Array<ChartSeries<TRow>>;
  /**
   * Toggles the `CartesianGrid`.
   * @default true
   */
  showGrid?: boolean;
};
