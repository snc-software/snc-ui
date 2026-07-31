import Tag from './Tag';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
  },
  args: {
    children: 'Filters',
  },
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Filters' },
};

export const GroupHeading: Story = {
  render: (args) => (
    <div className="snc:flex snc:flex-col snc:gap-2">
      <Tag {...args}>Status</Tag>
      <p className="snc:font-snc-body snc:text-snc-text-secondary snc:text-sm">
        Active, Draft, Archived
      </p>
    </div>
  ),
  args: { children: 'Status' },
};
