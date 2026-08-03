import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer } from 'recharts';

import { classes } from './MiniDonut.styles';

import type { MiniDonutProps } from './MiniDonut.types';

const data = (value: number) => [
  { id: 'value', value },
  { id: 'track', value: 100 - value },
];

/**
 * Stripped-down ring gauge with the fill percentage centered inside the ring, sized to sit
 * inline inside a `StatCard`. No legend/tooltip/loading/empty states. Not a public component —
 * see `Internal/ChartBase`'s own index.ts.
 */
export default function MiniDonut({
  value,
  color,
  trackColor = 'var(--snc-border)',
  size = 64,
}: MiniDonutProps) {
  return (
    <div className={classes.root} style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data(value)}
            dataKey="value"
            nameKey="id"
            innerRadius="75%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            isAnimationActive={false}
          >
            <Cell key="value" fill={color} />
            <Cell key="track" fill={trackColor} />
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>

      <span className={classes.label} style={{ fontSize: size * 0.22 }}>
        {Math.round(value)}%
      </span>
    </div>
  );
}
