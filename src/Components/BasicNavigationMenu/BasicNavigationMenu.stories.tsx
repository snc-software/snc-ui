import BasicNavigationMenu from './BasicNavigationMenu';

import type { Meta, StoryObj } from '@storybook/react-vite';

const items = [
  { key: 'home', label: 'Home', href: '/', isActive: true },
  { key: 'about', label: 'About', href: '/about' },
  { key: 'pricing', label: 'Pricing', href: '/pricing' },
  { key: 'contact', label: 'Contact', href: '/contact' },
];

const meta = {
  title: 'Components/BasicNavigationMenu',
  component: BasicNavigationMenu,
  tags: ['autodocs'],
  args: { items },
} satisfies Meta<typeof BasicNavigationMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
