import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import BasicNavigationMenu from './BasicNavigationMenu';

import type { NavigationLink } from './BasicNavigationMenu.types';

describe('BasicNavigationMenu', () => {
  it('renders an item with href as an accessible link', () => {
    const items: NavigationLink[] = [{ key: 'home', label: 'Home', href: '/' }];
    render(<BasicNavigationMenu items={items} />);

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
  });

  it('renders an item with only onClick as an accessible button and calls it on click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const items: NavigationLink[] = [{ key: 'logout', label: 'Log out', onClick }];
    render(<BasicNavigationMenu items={items} />);

    await user.click(screen.getByRole('button', { name: 'Log out' }));

    expect(onClick).toHaveBeenCalled();
  });

  it('applies the active underline treatment and aria-current when isActive is true', () => {
    const items: NavigationLink[] = [{ key: 'home', label: 'Home', href: '/', isActive: true }];
    render(<BasicNavigationMenu items={items} />);

    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link.className).toContain('snc:border-snc-primary');
  });

  it('names the nav landmark "Main" by default', () => {
    render(<BasicNavigationMenu items={[{ key: 'home', label: 'Home', href: '/' }]} />);

    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
  });

  it('names the nav landmark from the label prop when supplied', () => {
    render(
      <BasicNavigationMenu items={[{ key: 'home', label: 'Home', href: '/' }]} label="Primary" />,
    );

    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
  });
});
