import PieChart from './PieChart';

import type { PieChartDatum } from './PieChart.types';
import type { Meta, StoryObj } from '@storybook/react-vite';

const documentStatusBreakdown: PieChartDatum[] = [
  { id: 'active', label: 'Active', value: 48 },
  { id: 'draft', label: 'Draft', value: 21 },
  { id: 'archived', label: 'Archived', value: 18 },
  { id: 'expired', label: 'Expired', value: 6 },
];

const meta = {
  title: 'Components/Pie Chart',
  component: PieChart,
  tags: ['autodocs'],
  argTypes: {
    isLoading: { control: 'boolean' },
    showLegend: { control: 'boolean' },
  },
  args: {
    data: documentStatusBreakdown,
    ariaLabel: 'Document status breakdown',
  },
} satisfies Meta<typeof PieChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutLegend: Story = {
  args: { showLegend: false },
};

export const Loading: Story = {
  args: { isLoading: true },
};

export const Empty: Story = {
  args: { data: [] },
};
