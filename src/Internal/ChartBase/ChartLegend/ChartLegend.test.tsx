import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ChartLegend from './ChartLegend';

import type { LegendPayload } from 'recharts';

const payload: LegendPayload[] = [
  { value: 'Revenue', color: '#c2185b', dataKey: 'revenue' },
  { value: 'Costs', color: '#0ea5e9', dataKey: 'costs' },
];

describe('ChartLegend', () => {
  it('renders one item per payload entry', () => {
    render(<ChartLegend payload={payload} />);

    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Costs')).toBeInTheDocument();
  });

  it("renders each item swatch using that entry's color", () => {
    render(<ChartLegend payload={payload} />);

    const swatch = screen.getByText('Revenue').parentElement?.querySelector('span');

    expect(swatch).toHaveStyle({ backgroundColor: 'rgb(194, 24, 91)' });
  });
});
