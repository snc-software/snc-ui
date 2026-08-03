import { useId } from 'react';
import { Area, AreaChart as RechartsAreaChart, ResponsiveContainer } from 'recharts';

import { classes } from './MiniSparkline.styles';

import type { MiniSparklineProps } from './MiniSparkline.types';

/**
 * Stripped-down trend area chart with no grid/axes/tooltip/legend, sized to sit inline inside a
 * `StatCard`. Not a public component — see `Internal/ChartBase`'s own index.ts.
 */
export default function MiniSparkline({ data, color, height = 40 }: MiniSparklineProps) {
  const gradientId = useId();
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <div className={classes.root} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={chartData}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            isAnimationActive={false}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
