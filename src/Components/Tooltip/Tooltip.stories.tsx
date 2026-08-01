import Button from '@/Components/Button';

import Tooltip from './Tooltip';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: 'Saves your changes',
    children: <Button variant="primary">Save</Button>,
  },
};

export const Top: Story = {
  args: {
    content: 'Appears above the trigger',
    placement: 'top',
    children: <Button variant="secondary">Hover me</Button>,
  },
};

export const Right: Story = {
  args: {
    content: 'Appears to the right of the trigger',
    placement: 'right',
    children: <Button variant="secondary">Hover me</Button>,
  },
};

export const Left: Story = {
  args: {
    content: 'Appears to the left of the trigger',
    placement: 'left',
    children: <Button variant="secondary">Hover me</Button>,
  },
};

export const Disabled: Story = {
  args: {
    content: 'You will not see this',
    isDisabled: true,
    children: <Button variant="secondary">Hover me (disabled)</Button>,
  },
};
