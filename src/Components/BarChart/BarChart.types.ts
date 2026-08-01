import type { CartesianChartBaseProps } from '@/Internal/ChartBase';
import type { SncComponent } from '@/Types/SncComponent';

// The series vocabulary is defined once, alongside the parts that consume it, and surfaced from
// here so `@/Components/BarChart` remains the only place it's imported from.
export type { ChartSeries } from '@/Internal/ChartBase';

export type BarChartProps<TRow extends object> = SncComponent<CartesianChartBaseProps<TRow>>;
