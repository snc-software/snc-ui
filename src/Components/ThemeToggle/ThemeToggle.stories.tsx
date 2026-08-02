import ThemeToggle from './ThemeToggle';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    onToggle: { action: 'toggled' },
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: { defaultTheme: 'light' },
};

export const Dark: Story = {
  args: { defaultTheme: 'dark' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Controlled: Story = {
  args: { theme: 'light' },
};
