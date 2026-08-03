import type { Variants } from './StatCard.constants';
import type { SncComponent } from '@/Types/SncComponent';
import type { HTMLAttributes, ReactElement, Ref } from 'react';

export type StatCardProps = SncComponent<
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'id' | 'style' | 'children'> & {
    /**
     * Visual layout of the card. No default: every usage must state which layout it needs.
     */
    variant: keyof typeof Variants;
    /**
     * The stat's name.
     */
    label: string;
    /**
     * The headline value.
     */
    value: string | number;
    /**
     * Decorative icon, available on every variant. Hidden from assistive tech and tinted by
     * `status` (or the neutral fallback when `status` is omitted).
     */
    icon?: ReactElement;
    /**
     * Semantic status, tinting the icon, trend arrow, sparkline stroke, or donut arc to match.
     * Falls back to a neutral tone when omitted.
     */
    status?: 'success' | 'warning' | 'error';
    /**
     * Pre-formatted change text (e.g. `"+12.4%"`). Only meaningful when `variant="trend"`.
     */
    trendValue?: string;
    /**
     * Selects the trend arrow glyph. Purely presentational — does not implicitly set `status`.
     * Only meaningful when `variant="trend"`.
     */
    trendDirection?: 'up' | 'down';
    /**
     * Plotted in array order. Only meaningful when `variant="sparkline"`.
     */
    sparklineData?: number[];
    /**
     * Fill percentage (0-100). Only meaningful when `variant="donut"`.
     */
    donutValue?: number;
    ref?: Ref<HTMLDivElement>;
  }
>;
