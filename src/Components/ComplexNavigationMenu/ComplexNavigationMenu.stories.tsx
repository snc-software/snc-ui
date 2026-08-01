import ComplexNavigationMenu from './ComplexNavigationMenu';

import type { Meta, StoryObj } from '@storybook/react-vite';

const items = [
  { key: 'home', label: 'Home', href: '/', isActive: true },
  {
    key: 'products',
    label: 'Products',
    items: [
      { key: 'widgets', label: 'Widgets', href: '/widgets' },
      { key: 'gadgets', label: 'Gadgets', href: '/gadgets' },
    ],
  },
  {
    key: 'company',
    label: 'Company',
    items: [
      { key: 'about', label: 'About', href: '/about' },
      { key: 'careers', label: 'Careers', href: '/careers' },
    ],
  },
  { key: 'contact', label: 'Contact', href: '/contact' },
];

const meta = {
  title: 'Components/ComplexNavigationMenu',
  component: ComplexNavigationMenu,
  tags: ['autodocs'],
  args: { items },
} satisfies Meta<typeof ComplexNavigationMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
