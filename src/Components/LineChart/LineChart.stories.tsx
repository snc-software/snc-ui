import LineChart from './LineChart';

import type { ChartSeries } from './LineChart.types';
import type { Meta, StoryObj } from '@storybook/react-vite';

type MonthlyRow = { month: string; revenue: number; costs: number };

const data: MonthlyRow[] = [
  { month: 'Jan', revenue: 82, costs: 40 },
  { month: 'Feb', revenue: 91, costs: 42 },
  { month: 'Mar', revenue: 88, costs: 45 },
  { month: 'Apr', revenue: 104, costs: 47 },
  { month: 'May', revenue: 112, costs: 49 },
  { month: 'Jun', revenue: 121, costs: 52 },
];

const series: ChartSeries<MonthlyRow>[] = [
  { id: 'revenue', label: 'Revenue', accessor: (row) => row.revenue },
  { id: 'costs', label: 'Costs', accessor: (row) => row.costs },
];

// Instantiation expression: `LineChart` is generic, so binding it to a concrete row type here gives
// Storybook's `Meta`/`StoryObj` inference something better than `object` to work with.
const TypedLineChart = LineChart<MonthlyRow>;

const meta = {
  title: 'Components/Line Chart',
  component: TypedLineChart,
  tags: ['autodocs'],
  argTypes: {
    isLoading: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    showGrid: { control: 'boolean' },
  },
  args: {
    data,
    xAxisKey: 'month',
    series,
    ariaLabel: 'Monthly revenue and costs trend',
  },
} satisfies Meta<typeof TypedLineChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutGrid: Story = {
  args: { showGrid: false },
};

export const Loading: Story = {
  args: { isLoading: true },
};

export const Empty: Story = {
  args: { data: [] },
};
