import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ChartTooltip from './ChartTooltip';

import type { TooltipPayloadEntry } from 'recharts';

const payload: TooltipPayloadEntry[] = [
  {
    dataKey: 'revenue',
    name: 'Revenue',
    value: 120,
    color: '#c2185b',
    graphicalItemId: 'revenue',
  },
];

describe('ChartTooltip', () => {
  it('renders nothing when inactive', () => {
    const { container } = render(<ChartTooltip active={false} payload={payload} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a row per payload entry with its label and value when active', () => {
    render(<ChartTooltip active payload={payload} label="Q1" />);

    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
  });

  it('uses the swatch color from each payload entry', () => {
    render(<ChartTooltip active payload={payload} />);

    const swatch = screen.getByText('Revenue').parentElement?.querySelector('span');

    expect(swatch).toHaveStyle({ backgroundColor: 'rgb(194, 24, 91)' });
  });
});
