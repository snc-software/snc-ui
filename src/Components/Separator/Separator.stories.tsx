import Separator from './Separator';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
  args: {
    orientation: 'horizontal',
  },
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BetweenContent: Story = {
  render: (args) => (
    <div className="snc:flex snc:flex-col">
      <p className="snc:font-snc-body snc:text-snc-text-primary snc:text-sm">Section one content</p>
      <Separator {...args} />
      <p className="snc:font-snc-body snc:text-snc-text-primary snc:text-sm">Section two content</p>
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <div className="snc:flex snc:h-12 snc:items-center">
      <span className="snc:font-snc-body snc:text-snc-text-primary snc:text-sm">Left</span>
      <Separator {...args} />
      <span className="snc:font-snc-body snc:text-snc-text-primary snc:text-sm">Right</span>
    </div>
  ),
};
