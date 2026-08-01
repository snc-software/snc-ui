import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
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

import { classes } from './LineChart.styles';

import type { LineChartProps } from './LineChart.types';

export default function LineChart<TRow extends object>({
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
}: LineChartProps<TRow>) {
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
          <RechartsLineChart data={data}>
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
              <Line
                key={item.id}
                dataKey={item.accessor}
                name={item.label}
                stroke={resolveSeriesColor(index, item.color, colors)}
                dot={false}
                isAnimationActive={false}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
