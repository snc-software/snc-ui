import BarChart from './BarChart';

import type { ChartSeries } from './BarChart.types';
import type { Meta, StoryObj } from '@storybook/react-vite';

type QuarterlyRow = { quarter: string; revenue: number; costs: number };

const data: QuarterlyRow[] = [
  { quarter: 'Q1', revenue: 320, costs: 180 },
  { quarter: 'Q2', revenue: 356, costs: 190 },
  { quarter: 'Q3', revenue: 341, costs: 205 },
  { quarter: 'Q4', revenue: 402, costs: 215 },
];

const series: ChartSeries<QuarterlyRow>[] = [
  { id: 'revenue', label: 'Revenue', accessor: (row) => row.revenue },
  { id: 'costs', label: 'Costs', accessor: (row) => row.costs },
];

// Instantiation expression: `BarChart` is generic, so binding it to a concrete row type here gives
// Storybook's `Meta`/`StoryObj` inference something better than `object` to work with.
const TypedBarChart = BarChart<QuarterlyRow>;

const meta = {
  title: 'Components/Bar Chart',
  component: TypedBarChart,
  tags: ['autodocs'],
  argTypes: {
    isLoading: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    showGrid: { control: 'boolean' },
  },
  args: {
    data,
    xAxisKey: 'quarter',
    series,
    ariaLabel: 'Quarterly revenue and costs',
  },
} satisfies Meta<typeof TypedBarChart>;

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
