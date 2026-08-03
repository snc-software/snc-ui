import { Coins, GraphUp, StatsUpSquare, Wallet } from 'iconoir-react';

import StatsGroup from './StatsGroup';

import type { StatsItem } from './StatsGroup.types';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/StatsGroup',
  component: StatsGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof StatsGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

const fourMixedVariants: StatsItem[] = [
  {
    id: 'revenue',
    variant: 'basic',
    label: 'Revenue',
    value: '$12,400',
    icon: <Wallet />,
  },
  {
    id: 'growth',
    variant: 'trend',
    label: 'Growth',
    value: '$8,200',
    icon: <GraphUp />,
    trendValue: '+12.4%',
    trendDirection: 'up',
    status: 'success',
  },
  {
    id: 'signups',
    variant: 'sparkline',
    label: 'Signups',
    value: '1,204',
    icon: <StatsUpSquare />,
    sparklineData: [4, 6, 5, 8, 7, 9, 12],
    status: 'success',
  },
  {
    id: 'usage',
    variant: 'donut',
    label: 'Usage',
    value: '68%',
    icon: <Coins />,
    donutValue: 68,
    status: 'warning',
  },
];

export const Default: Story = {
  args: {
    items: fourMixedVariants,
  },
};

export const TwoItems: Story = {
  args: {
    items: fourMixedVariants.slice(0, 2),
  },
};

export const ExceedsMax: Story = {
  args: {
    items: [
      ...fourMixedVariants,
      {
        id: 'dropped',
        variant: 'basic',
        label: 'Dropped (5th item)',
        value: 'Not rendered',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'A 5th item is supplied but only the first 4 are rendered — `StatsGroup` caps at 4.',
      },
    },
  },
};
