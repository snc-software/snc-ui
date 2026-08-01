import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

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

import { classes } from './BarChart.styles';

import type { BarChartProps } from './BarChart.types';

export default function BarChart<TRow extends object>({
  data,
  xAxisKey,
  series,
  ariaLabel,
  height = DefaultChartHeight,
  isLoading = false,
  emptyMessage = DefaultEmptyMessage,
  showLegend = true,
  showGrid = true,
  colors = DefaultColorPalette,
  className,
  ...rest
}: BarChartProps<TRow>) {
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
          <RechartsBarChart data={data}>
            {showGrid && <CartesianGrid stroke="var(--snc-border)" vertical={false} />}
            <XAxis
              dataKey={xAxisKey}
              stroke="var(--snc-border)"
              tick={{ className: baseClasses.axisTick }}
            />
            <YAxis stroke="var(--snc-border)" tick={{ className: baseClasses.axisTick }} />
            <Tooltip content={<ChartTooltip />} isAnimationActive={false} />
            {showLegend && <Legend content={<ChartLegend />} />}
            {series.map((item, index) => (
              <Bar
                key={item.id}
                dataKey={item.accessor}
                name={item.label}
                fill={resolveSeriesColor(index, item.color, colors)}
                isAnimationActive={false}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
