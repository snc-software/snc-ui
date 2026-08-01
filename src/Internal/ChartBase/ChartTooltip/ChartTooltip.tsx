import { classes } from './ChartTooltip.styles';

import type { ChartTooltipProps } from './ChartTooltip.types';

/**
 * Only meaningful as the `content` render prop passed to Recharts' `<Tooltip>`, used by
 * `PieChart`/`LineChart`/`BarChart`.
 */
export default function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className={classes.container}>
      {label !== undefined && <p className={classes.label}>{label}</p>}
      <ul className={classes.list}>
        {payload.map((entry) => (
          <li key={String(entry.dataKey ?? entry.name)} className={classes.item}>
            <span className={classes.swatch} style={{ backgroundColor: entry.color }} />
            <span className={classes.itemLabel}>{entry.name}</span>
            <span className={classes.itemValue}>{entry.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
