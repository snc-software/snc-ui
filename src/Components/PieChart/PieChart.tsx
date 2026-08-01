import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from 'recharts';

import Spinner from '@/Components/Spinner';
import {
  ChartLegend,
  ChartTooltip,
  classes as baseClasses,
  DefaultChartHeight,
  DefaultColorPalette,
  DefaultEmptyMessage,
  resolveSeriesColor,
} from '@/Internal/ChartBase';
import { cn } from '@/Utils/cn';

import { classes } from './PieChart.styles';

import type { PieChartProps } from './PieChart.types';

export default function PieChart({
  data,
  ariaLabel,
  height = DefaultChartHeight,
  isLoading = false,
  emptyMessage = DefaultEmptyMessage,
  showLegend = true,
  colors = DefaultColorPalette,
  className,
  ...rest
}: PieChartProps) {
  return (
    <div role="img" aria-label={ariaLabel} className={cn(classes.root, className)} {...rest}>
      {isLoading && (
        <div className={baseClasses.loading} style={{ height }}>
          <Spinner size="xl" />
        </div>
      )}

      {!isLoading && data.length === 0 && (
        <div className={baseClasses.empty} style={{ height }}>
          {emptyMessage}
        </div>
      )}

      {!isLoading && data.length > 0 && (
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPieChart>
            <Pie data={data} dataKey="value" nameKey="label" isAnimationActive={false}>
              {data.map((slice, index) => (
                <Cell key={slice.id} fill={resolveSeriesColor(index, slice.color, colors)} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} isAnimationActive={false} />
          </RechartsPieChart>
        </ResponsiveContainer>
      )}

      {/*
       * Recharts' automatic Pie→Legend payload derivation doesn't resolve for `Pie` (reproducible
       * with Recharts' own built-in `<Legend>`, no custom content involved, and `<Legend>` doesn't
       * accept an external `payload` prop to work around it), so `ChartLegend` is rendered directly
       * here instead of through Recharts' `<Legend>`. Reusing the same `resolveSeriesColor` call as
       * the slice `Cell`s guarantees the legend swatch always matches the slice it labels.
       */}
      {!isLoading && data.length > 0 && showLegend && (
        <ChartLegend
          payload={data.map((slice, index) => ({
            value: slice.label,
            dataKey: slice.id,
            color: resolveSeriesColor(index, slice.color, colors),
          }))}
        />
      )}
    </div>
  );
}
