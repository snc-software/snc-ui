import Avatar from '@/Components/Avatar';
import BasicNavigationMenu from '@/Components/BasicNavigationMenu';
import ComplexNavigationMenu from '@/Components/ComplexNavigationMenu';

import NavigationBar from './NavigationBar';

import type { Meta, StoryObj } from '@storybook/react-vite';

const basicItems = [
  { key: 'home', label: 'Home', href: '/', isActive: true },
  { key: 'about', label: 'About', href: '/about' },
  { key: 'pricing', label: 'Pricing', href: '/pricing' },
];

const complexItems = [
  { key: 'home', label: 'Home', href: '/', isActive: true },
  {
    key: 'products',
    label: 'Products',
    items: [
      { key: 'widgets', label: 'Widgets', href: '/widgets' },
      { key: 'gadgets', label: 'Gadgets', href: '/gadgets' },
    ],
  },
  { key: 'pricing', label: 'Pricing', href: '/pricing' },
];

const meta = {
  title: 'Components/NavigationBar',
  component: NavigationBar,
  tags: ['autodocs'],
  args: {
    brand: <span style={{ fontWeight: 600 }}>Acme</span>,
  },
} satisfies Meta<typeof NavigationBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithBasicMenu: Story = {
  args: {
    navigationMenu: <BasicNavigationMenu items={basicItems} />,
    actions: <Avatar name="Ada Lovelace" />,
  },
};

export const WithComplexMenu: Story = {
  args: {
    navigationMenu: <ComplexNavigationMenu items={complexItems} />,
    actions: <Avatar name="Ada Lovelace" />,
  },
};

export const BrandOnly: Story = {};
