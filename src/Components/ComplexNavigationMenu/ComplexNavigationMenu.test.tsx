import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import ComplexNavigationMenu from './ComplexNavigationMenu';

import type { ComplexNavigationMenuItem } from './ComplexNavigationMenu.types';

const items: ComplexNavigationMenuItem[] = [
  { key: 'home', label: 'Home', href: '/' },
  {
    key: 'products',
    label: 'Products',
    items: [
      { key: 'widgets', label: 'Widgets', href: '/widgets' },
      { key: 'gadgets', label: 'Gadgets', href: '/gadgets', isActive: true },
    ],
  },
];

describe('ComplexNavigationMenu', () => {
  it('renders a top-level item without items as a plain link', () => {
    render(<ComplexNavigationMenu items={items} />);

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
  });

  it('renders an item with nested items as a closed dropdown trigger', () => {
    render(<ComplexNavigationMenu items={items} />);

    const trigger = screen.getByRole('button', { name: 'Products' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'true');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: 'Widgets' })).not.toBeInTheDocument();
  });

  it('opens the dropdown and shows its nested links when the trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<ComplexNavigationMenu items={items} />);

    await user.click(screen.getByRole('button', { name: 'Products' }));

    expect(screen.getByRole('button', { name: 'Products' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('link', { name: 'Widgets' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Gadgets' })).toBeInTheDocument();
  });

  it('closes the dropdown and returns focus to the trigger on Escape', async () => {
    const user = userEvent.setup();
    render(<ComplexNavigationMenu items={items} />);

    const trigger = screen.getByRole('button', { name: 'Products' });
    await user.click(trigger);
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('link', { name: 'Widgets' })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes an open dropdown when a click occurs outside it', async () => {
    const user = userEvent.setup();
    render(<ComplexNavigationMenu items={items} />);

    await user.click(screen.getByRole('button', { name: 'Products' }));
    await user.click(document.body);

    expect(screen.queryByRole('link', { name: 'Widgets' })).not.toBeInTheDocument();
  });

  it('keeps only one dropdown open at a time', async () => {
    const user = userEvent.setup();
    const multiDropdownItems: ComplexNavigationMenuItem[] = [
      ...items,
      { key: 'company', label: 'Company', items: [{ key: 'about', label: 'About', href: '/about' }] },
    ];
    render(<ComplexNavigationMenu items={multiDropdownItems} />);

    await user.click(screen.getByRole('button', { name: 'Products' }));
    await user.click(screen.getByRole('button', { name: 'Company' }));

    expect(screen.getByRole('button', { name: 'Products' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByRole('button', { name: 'Company' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('applies the active highlight to a nested link with isActive', async () => {
    const user = userEvent.setup();
    render(<ComplexNavigationMenu items={items} />);

    await user.click(screen.getByRole('button', { name: 'Products' }));

    expect(screen.getByRole('link', { name: 'Gadgets' }).className).toContain(
      'snc:bg-snc-primary-subtle-bg',
    );
  });

  it('names the nav landmark "Main" by default', () => {
    render(<ComplexNavigationMenu items={items} />);

    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
  });
});
