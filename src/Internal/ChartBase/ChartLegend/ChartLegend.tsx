import { classes } from './ChartLegend.styles';

import type { ChartLegendProps } from './ChartLegend.types';

/**
 * Only meaningful as the `content` render prop passed to Recharts' `<Legend>`, used by
 * `PieChart`/`LineChart`/`BarChart`.
 */
export default function ChartLegend({ payload = [] }: ChartLegendProps) {
  return (
    <ul className={classes.list}>
      {payload.map((entry) => (
        <li key={String(entry.dataKey ?? entry.value)} className={classes.item}>
          <span className={classes.swatch} style={{ backgroundColor: entry.color }} />
          <span className={classes.label}>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
}
