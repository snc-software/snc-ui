import { render, screen } from '@testing-library/react';
import { StatsReport } from 'iconoir-react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import StatCard from './StatCard';

describe('StatCard', () => {
  it('renders label and value as text for the basic variant', () => {
    render(<StatCard variant="basic" label="Revenue" value="$12,400" />);

    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$12,400')).toBeInTheDocument();
  });

  it('renders label and value as text for the trend variant', () => {
    render(
      <StatCard
        variant="trend"
        label="Revenue"
        value="$12,400"
        trendValue="+12.4%"
        trendDirection="up"
      />,
    );

    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$12,400')).toBeInTheDocument();
  });

  it('renders label and value as text for the sparkline variant', () => {
    render(
      <StatCard
        variant="sparkline"
        label="Revenue"
        value="$12,400"
        sparklineData={[1, 4, 2, 8, 5]}
      />,
    );

    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$12,400')).toBeInTheDocument();
  });

  it('renders label and value as text for the donut variant', () => {
    render(<StatCard variant="donut" label="Revenue" value="$12,400" donutValue={60} />);

    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$12,400')).toBeInTheDocument();
  });

  it('renders the supplied icon, hidden from assistive tech', () => {
    render(
      <StatCard
        variant="basic"
        label="Revenue"
        value="$12,400"
        icon={<StatsReport data-testid="stat-icon" />}
      />,
    );

    const icon = screen.getByTestId('stat-icon');

    expect(icon).toBeInTheDocument();
    expect(icon.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('renders trendValue text and the correct arrow glyph for trendDirection="up"', () => {
    const { container } = render(
      <StatCard
        variant="trend"
        label="Revenue"
        value="$12,400"
        trendValue="+12.4%"
        trendDirection="up"
      />,
    );

    expect(screen.getByText('+12.4%')).toBeInTheDocument();
    expect(container.querySelector('svg path')).toHaveAttribute(
      'd',
      'M12 21L12 3M12 3L20.5 11.5M12 3L3.5 11.5',
    );
  });

  it('renders the correct arrow glyph for trendDirection="down"', () => {
    const { container } = render(
      <StatCard
        variant="trend"
        label="Revenue"
        value="$12,400"
        trendValue="-4.1%"
        trendDirection="down"
      />,
    );

    expect(container.querySelector('svg path')).toHaveAttribute(
      'd',
      'M12 3L12 21M12 21L20.5 12.5M12 21L3.5 12.5',
    );
  });

  it('renders a MiniSparkline fed from sparklineData', () => {
    const { container } = render(
      <StatCard
        variant="sparkline"
        label="Revenue"
        value="$12,400"
        sparklineData={[1, 4, 2, 8, 5]}
      />,
    );

    expect(container.querySelector('.recharts-area-curve')).toBeInTheDocument();
  });

  it('renders a MiniDonut fed from donutValue', () => {
    const { container } = render(
      <StatCard variant="donut" label="Revenue" value="$12,400" donutValue={60} />,
    );

    expect(container.querySelectorAll('.recharts-pie-sector')).toHaveLength(2);
    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  it('applies the neutral fallback colour when status is omitted', () => {
    render(
      <StatCard
        variant="basic"
        label="Revenue"
        value="$12,400"
        icon={<StatsReport data-testid="stat-icon" />}
      />,
    );

    const iconBadge = screen.getByTestId('stat-icon').closest('span');

    expect(iconBadge).toHaveClass('snc:text-snc-text-secondary');
    expect(iconBadge).toHaveClass('snc:bg-snc-border');
  });

  it('applies the matching semantic colour when status is supplied', () => {
    render(
      <StatCard
        variant="basic"
        label="Revenue"
        value="$12,400"
        status="success"
        icon={<StatsReport data-testid="stat-icon" />}
      />,
    );

    const iconBadge = screen.getByTestId('stat-icon').closest('span');

    expect(iconBadge).toHaveClass('snc:text-snc-success-text');
    expect(iconBadge).toHaveClass('snc:bg-snc-success-bg');
  });

  it.each(['basic', 'trend', 'sparkline', 'donut'] as const)(
    'renders and colours the icon consistently for the %s variant',
    (variant) => {
      render(
        <StatCard
          variant={variant}
          label="Revenue"
          value="$12,400"
          status="warning"
          icon={<StatsReport data-testid="stat-icon" />}
        />,
      );

      const iconBadge = screen.getByTestId('stat-icon').closest('span');

      expect(iconBadge).toHaveClass('snc:text-snc-warning-text');
      expect(iconBadge).toHaveClass('snc:bg-snc-warning-bg');
    },
  );

  it('forwards data-* attributes to the root element', () => {
    render(
      <StatCard
        variant="basic"
        label="Revenue"
        value="$12,400"
        data-testid="revenue-stat-card"
      />,
    );

    expect(screen.getByTestId('revenue-stat-card')).toBeInTheDocument();
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<StatCard ref={ref} variant="basic" label="Revenue" value="$12,400" />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies a custom className alongside the root default classes', () => {
    render(
      <StatCard
        variant="basic"
        label="Revenue"
        value="$12,400"
        className="custom-stat-card"
        data-testid="revenue-stat-card"
      />,
    );

    const root = screen.getByTestId('revenue-stat-card');

    expect(root).toHaveClass('custom-stat-card');
    expect(root.className).toContain('snc:rounded-xl');
  });
});
