import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PieChart from './PieChart';

import type { PieChartDatum } from './PieChart.types';

const data: PieChartDatum[] = [
  { id: 'active', label: 'Active', value: 60 },
  { id: 'archived', label: 'Archived', value: 40 },
];

describe('PieChart', () => {
  it('renders without error with minimal required props', () => {
    render(<PieChart data={data} ariaLabel="Document status breakdown" />);

    expect(screen.getByRole('img', { name: 'Document status breakdown' })).toBeInTheDocument();
  });

  it('renders a slice per data entry', () => {
    const { container } = render(<PieChart data={data} ariaLabel="Document status breakdown" />);

    expect(container.querySelectorAll('.recharts-pie-sector')).toHaveLength(data.length);
  });

  it('shows a spinner and hides the chart when isLoading is true', () => {
    const { container } = render(
      <PieChart data={data} ariaLabel="Document status breakdown" isLoading />,
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(container.querySelectorAll('.recharts-pie-sector')).toHaveLength(0);
  });

  it('shows the empty message when data is empty', () => {
    render(<PieChart data={[]} ariaLabel="Document status breakdown" />);

    expect(screen.getByText('No data found')).toBeInTheDocument();
  });

  it('shows a custom emptyMessage when provided', () => {
    render(
      <PieChart data={[]} ariaLabel="Document status breakdown" emptyMessage="Nothing to show" />,
    );

    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
  });

  it('hides the legend when showLegend is false', () => {
    render(<PieChart data={data} ariaLabel="Document status breakdown" showLegend={false} />);

    expect(screen.queryByText('Active')).not.toBeInTheDocument();
  });

  it('renders one legend item per data entry, with a swatch matching each slice color', () => {
    render(
      <PieChart
        data={[
          { id: 'active', label: 'Active', value: 60, color: '#123456' },
          { id: 'archived', label: 'Archived', value: 40 },
        ]}
        ariaLabel="Document status breakdown"
      />,
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Archived')).toBeInTheDocument();

    const activeSwatch = screen.getByText('Active').parentElement?.querySelector('span');

    expect(activeSwatch).toHaveStyle({ backgroundColor: 'rgb(18, 52, 86)' });
  });

  it('applies a consumer-supplied slice color override', () => {
    const { container } = render(
      <PieChart
        data={[{ id: 'active', label: 'Active', value: 60, color: '#123456' }]}
        ariaLabel="Document status breakdown"
      />,
    );

    const sector = container.querySelector('.recharts-pie-sector path');

    expect(sector).toHaveAttribute('fill', '#123456');
  });

  it('exposes the chart via role="img" with the supplied ariaLabel', () => {
    render(<PieChart data={data} ariaLabel="Document status breakdown" />);

    expect(screen.getByRole('img')).toHaveAccessibleName('Document status breakdown');
  });

  it('forwards data-* attributes to the root element', () => {
    render(
      <PieChart data={data} ariaLabel="Document status breakdown" data-testid="status-chart" />,
    );

    expect(screen.getByTestId('status-chart')).toBeInTheDocument();
  });
});
