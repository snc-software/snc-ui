import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import BarChart from './BarChart';

import type { ChartSeries } from './BarChart.types';

type QuarterlyRow = { quarter: string; revenue: number; costs: number };

const data: QuarterlyRow[] = [
  { quarter: 'Q1', revenue: 100, costs: 40 },
  { quarter: 'Q2', revenue: 120, costs: 45 },
  { quarter: 'Q3', revenue: 90, costs: 50 },
];

const series: ChartSeries<QuarterlyRow>[] = [
  { id: 'revenue', label: 'Revenue', accessor: (row) => row.revenue },
  { id: 'costs', label: 'Costs', accessor: (row) => row.costs },
];

describe('BarChart', () => {
  it('renders without error with minimal required props', () => {
    render(
      <BarChart data={data} xAxisKey="quarter" series={series} ariaLabel="Quarterly revenue" />,
    );

    expect(screen.getByRole('img', { name: 'Quarterly revenue' })).toBeInTheDocument();
  });

  it('renders one bar group per series entry', () => {
    const { container } = render(
      <BarChart data={data} xAxisKey="quarter" series={series} ariaLabel="Quarterly revenue" />,
    );

    expect(container.querySelectorAll('.recharts-bar')).toHaveLength(series.length);
  });

  it('uses xAxisKey values as the x-axis category labels', () => {
    render(
      <BarChart data={data} xAxisKey="quarter" series={series} ariaLabel="Quarterly revenue" />,
    );

    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText('Q2')).toBeInTheDocument();
    expect(screen.getByText('Q3')).toBeInTheDocument();
  });

  it('applies a consumer-supplied series color override', () => {
    const { container } = render(
      <BarChart
        data={data}
        xAxisKey="quarter"
        series={[
          { id: 'revenue', label: 'Revenue', accessor: (row) => row.revenue, color: '#123456' },
        ]}
        ariaLabel="Quarterly revenue"
      />,
    );

    expect(container.querySelector('.recharts-bar-rectangle path')).toHaveAttribute(
      'fill',
      '#123456',
    );
  });

  it('shows a spinner and hides the chart when isLoading is true', () => {
    const { container } = render(
      <BarChart
        data={data}
        xAxisKey="quarter"
        series={series}
        ariaLabel="Quarterly revenue"
        isLoading
      />,
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(container.querySelectorAll('.recharts-bar')).toHaveLength(0);
  });

  it('shows the empty message when data is empty', () => {
    render(<BarChart data={[]} xAxisKey="quarter" series={series} ariaLabel="Quarterly revenue" />);

    expect(screen.getByText('No data found')).toBeInTheDocument();
  });

  it('shows a custom emptyMessage when provided', () => {
    render(
      <BarChart
        data={[]}
        xAxisKey="quarter"
        series={series}
        ariaLabel="Quarterly revenue"
        emptyMessage="Nothing to show"
      />,
    );

    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
  });

  it('hides the legend when showLegend is false', () => {
    render(
      <BarChart
        data={data}
        xAxisKey="quarter"
        series={series}
        ariaLabel="Quarterly revenue"
        showLegend={false}
      />,
    );

    expect(screen.queryByText('Revenue')).not.toBeInTheDocument();
  });

  it('forwards data-* attributes to the root element', () => {
    render(
      <BarChart
        data={data}
        xAxisKey="quarter"
        series={series}
        ariaLabel="Quarterly revenue"
        data-testid="quarterly-chart"
      />,
    );

    expect(screen.getByTestId('quarterly-chart')).toBeInTheDocument();
  });
});
