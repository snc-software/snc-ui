import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import LineChart from './LineChart';

import type { ChartSeries } from './LineChart.types';

type MonthlyRow = { month: string; revenue: number; costs: number };

const data: MonthlyRow[] = [
  { month: 'Jan', revenue: 100, costs: 40 },
  { month: 'Feb', revenue: 120, costs: 45 },
  { month: 'Mar', revenue: 90, costs: 50 },
];

const series: ChartSeries<MonthlyRow>[] = [
  { id: 'revenue', label: 'Revenue', accessor: (row) => row.revenue },
  { id: 'costs', label: 'Costs', accessor: (row) => row.costs },
];

describe('LineChart', () => {
  it('renders without error with minimal required props', () => {
    render(<LineChart data={data} xAxisKey="month" series={series} ariaLabel="Monthly trend" />);

    expect(screen.getByRole('img', { name: 'Monthly trend' })).toBeInTheDocument();
  });

  it('renders one line per series entry', () => {
    const { container } = render(
      <LineChart data={data} xAxisKey="month" series={series} ariaLabel="Monthly trend" />,
    );

    expect(container.querySelectorAll('.recharts-line')).toHaveLength(series.length);
  });

  it('uses xAxisKey values as the x-axis category labels', () => {
    render(<LineChart data={data} xAxisKey="month" series={series} ariaLabel="Monthly trend" />);

    expect(screen.getByText('Jan')).toBeInTheDocument();
    expect(screen.getByText('Feb')).toBeInTheDocument();
    expect(screen.getByText('Mar')).toBeInTheDocument();
  });

  it('applies a consumer-supplied series color override', () => {
    const { container } = render(
      <LineChart
        data={data}
        xAxisKey="month"
        series={[
          { id: 'revenue', label: 'Revenue', accessor: (row) => row.revenue, color: '#123456' },
        ]}
        ariaLabel="Monthly trend"
      />,
    );

    expect(container.querySelector('.recharts-line-curve')).toHaveAttribute('stroke', '#123456');
  });

  it('shows a spinner and hides the chart when isLoading is true', () => {
    const { container } = render(
      <LineChart
        data={data}
        xAxisKey="month"
        series={series}
        ariaLabel="Monthly trend"
        isLoading
      />,
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(container.querySelectorAll('.recharts-line')).toHaveLength(0);
  });

  it('shows the empty message when data is empty', () => {
    render(<LineChart data={[]} xAxisKey="month" series={series} ariaLabel="Monthly trend" />);

    expect(screen.getByText('No data found')).toBeInTheDocument();
  });

  it('shows a custom emptyMessage when provided', () => {
    render(
      <LineChart
        data={[]}
        xAxisKey="month"
        series={series}
        ariaLabel="Monthly trend"
        emptyMessage="Nothing to show"
      />,
    );

    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
  });

  it('hides the legend when showLegend is false', () => {
    render(
      <LineChart
        data={data}
        xAxisKey="month"
        series={series}
        ariaLabel="Monthly trend"
        showLegend={false}
      />,
    );

    expect(screen.queryByText('Revenue')).not.toBeInTheDocument();
  });

  it('forwards data-* attributes to the root element', () => {
    render(
      <LineChart
        data={data}
        xAxisKey="month"
        series={series}
        ariaLabel="Monthly trend"
        data-testid="trend-chart"
      />,
    );

    expect(screen.getByTestId('trend-chart')).toBeInTheDocument();
  });
});
