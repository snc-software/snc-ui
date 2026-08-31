import { Coins } from 'iconoir-react';

import StatCard from './StatCard';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['basic', 'trend', 'sparkline', 'donut'],
    },
    status: {
      control: 'select',
      options: [undefined, 'success', 'warning', 'error'],
    },
    isLoading: { control: 'boolean' },
  },
  args: {
    label: 'Revenue',
    value: '$12,400',
    icon: <Coins />,
  },
} satisfies Meta<typeof StatCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    variant: 'basic',
  },
};

export const Trend: Story = {
  args: {
    variant: 'trend',
    trendValue: '+12.4%',
    trendDirection: 'up',
    status: 'success',
  },
};

export const Sparkline: Story = {
  args: {
    variant: 'sparkline',
    sparklineData: [4, 6, 5, 8, 7, 9, 12],
    status: 'success',
  },
};

export const Donut: Story = {
  args: {
    variant: 'donut',
    donutValue: 68,
    status: 'warning',
  },
};

export const NeutralStatus: Story = {
  args: {
    variant: 'trend',
    trendValue: '-4.1%',
    trendDirection: 'down',
  },
};

export const ErrorStatus: Story = {
  args: {
    variant: 'donut',
    donutValue: 24,
    status: 'error',
  },
};

export const Loading: Story = {
  args: {
    variant: 'basic',
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    variant: 'basic',
    value: undefined,
  },
};
