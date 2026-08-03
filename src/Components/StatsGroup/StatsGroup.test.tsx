import { render, screen } from '@testing-library/react';
import { Coins } from 'iconoir-react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import StatsGroup from './StatsGroup';

import type { StatsItem } from './StatsGroup.types';

const buildItems = (count: number): StatsItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `stat-${index}`,
    variant: 'basic',
    label: `Label ${index}`,
    value: `Value ${index}`,
  }));

describe('StatsGroup', () => {
  it('renders one StatCard per supplied item, in order', () => {
    render(<StatsGroup items={buildItems(3)} />);

    const labels = screen.getAllByText(/^Label \d$/).map((node) => node.textContent);

    expect(labels).toEqual(['Label 0', 'Label 1', 'Label 2']);
  });

  it('renders exactly 4 cards when exactly 4 items are supplied', () => {
    render(<StatsGroup items={buildItems(4)} />);

    expect(screen.getAllByText(/^Label \d$/)).toHaveLength(4);
  });

  it('caps rendering at 4 cards when 5 items are supplied', () => {
    render(<StatsGroup items={buildItems(5)} />);

    expect(screen.getAllByText(/^Label \d$/)).toHaveLength(4);
    expect(screen.queryByText('Label 4')).not.toBeInTheDocument();
  });

  it("renders each item's variant-specific content", () => {
    const { container } = render(
      <StatsGroup
        items={[
          {
            id: 'trend-item',
            variant: 'trend',
            label: 'Revenue',
            value: '$12,400',
            trendValue: '+12.4%',
            trendDirection: 'up',
          },
          {
            id: 'donut-item',
            variant: 'donut',
            label: 'Usage',
            value: '68%',
            donutValue: 68,
          },
        ]}
      />,
    );

    expect(screen.getByText('+12.4%')).toBeInTheDocument();
    expect(container.querySelectorAll('.recharts-pie-sector')).toHaveLength(2);
  });

  it('renders the supplied icon for an item, hidden from assistive tech', () => {
    render(
      <StatsGroup
        items={[
          {
            id: 'icon-item',
            variant: 'basic',
            label: 'Revenue',
            value: '$12,400',
            icon: <Coins data-testid="stat-icon" />,
          },
        ]}
      />,
    );

    expect(screen.getByTestId('stat-icon').closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('forwards data-* attributes to the root element', () => {
    render(<StatsGroup items={buildItems(1)} data-testid="stats-group" />);

    expect(screen.getByTestId('stats-group')).toBeInTheDocument();
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<StatsGroup ref={ref} items={buildItems(1)} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies a custom className alongside the root default grid classes', () => {
    render(
      <StatsGroup items={buildItems(1)} className="custom-stats-group" data-testid="stats-group" />,
    );

    const root = screen.getByTestId('stats-group');

    expect(root).toHaveClass('custom-stats-group');
    expect(root.className).toContain('snc:grid');
  });

  it('uses a single column, with no responsive override, for 1 item', () => {
    render(<StatsGroup items={buildItems(1)} data-testid="stats-group" />);

    expect(screen.getByTestId('stats-group')).toHaveClass('snc:grid-cols-1');
    expect(screen.getByTestId('stats-group').className).not.toMatch(/snc:(sm|lg):grid-cols/);
  });

  it('splits the row 50/50 from sm: up for 2 items', () => {
    render(<StatsGroup items={buildItems(2)} data-testid="stats-group" />);

    expect(screen.getByTestId('stats-group')).toHaveClass('snc:sm:grid-cols-2');
    expect(screen.getByTestId('stats-group').className).not.toMatch(/snc:lg:grid-cols/);
  });

  it('splits the row 33/33/33 from lg: up for 3 items', () => {
    render(<StatsGroup items={buildItems(3)} data-testid="stats-group" />);

    expect(screen.getByTestId('stats-group')).toHaveClass('snc:sm:grid-cols-2');
    expect(screen.getByTestId('stats-group')).toHaveClass('snc:lg:grid-cols-3');
  });

  it('splits the row into 4 equal columns from lg: up for 4 items', () => {
    render(<StatsGroup items={buildItems(4)} data-testid="stats-group" />);

    expect(screen.getByTestId('stats-group')).toHaveClass('snc:lg:grid-cols-4');
  });

  it('bases the column count on the capped item count, not the raw count, for 5 items', () => {
    render(<StatsGroup items={buildItems(5)} data-testid="stats-group" />);

    expect(screen.getByTestId('stats-group')).toHaveClass('snc:lg:grid-cols-4');
    expect(screen.getByTestId('stats-group').className).not.toMatch(/grid-cols-5/);
  });
});
