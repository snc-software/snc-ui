import type { TooltipContentProps } from 'recharts';

// Recharts clones this component with its real props at render time (`<Tooltip content={<ChartTooltip />} />`
// is the standard idiom), so every field must be optional here even though Recharts' own
// `TooltipContentProps.active` is required — otherwise `<ChartTooltip />` fails to type-check at
// the JSX creation site, before any props have been injected.
export type ChartTooltipProps = Partial<
  Pick<TooltipContentProps<number, string>, 'active' | 'payload' | 'label'>
>;
