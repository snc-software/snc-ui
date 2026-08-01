import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import BasicNavigationMenu from '@/Components/BasicNavigationMenu';

import NavigationBar from './NavigationBar';

describe('NavigationBar', () => {
  it('renders the brand content inside the banner landmark', () => {
    render(<NavigationBar brand={<span>Acme</span>} />);

    expect(screen.getByRole('banner')).toHaveTextContent('Acme');
  });

  it('renders navigationMenu content when supplied', () => {
    render(
      <NavigationBar
        brand="Acme"
        navigationMenu={<BasicNavigationMenu items={[{ key: 'home', label: 'Home', href: '/' }]} />}
      />,
    );

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
  });

  it('renders the navigationMenu in its own region, separate from the brand', () => {
    render(
      <NavigationBar
        brand={<span>Acme</span>}
        navigationMenu={<BasicNavigationMenu items={[{ key: 'home', label: 'Home', href: '/' }]} />}
      />,
    );

    const brandParent = screen.getByText('Acme').parentElement;
    const menuParent = screen.getByRole('link', { name: 'Home' }).closest('nav')?.parentElement;
    expect(menuParent).not.toBe(brandParent);
  });

  it('renders actions content when supplied', () => {
    render(<NavigationBar brand="Acme" actions={<button type="button">Sign out</button>} />);

    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
  });

  it('omits the navigationMenu and actions regions when those props are not supplied', () => {
    render(<NavigationBar brand="Acme" />);

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(screen.getByRole('banner').children).toHaveLength(1);
  });

  it('passes through standard HTML attributes and data-* props to the root element', () => {
    render(<NavigationBar brand="Acme" data-testid="top-nav" aria-label="Primary" />);

    expect(screen.getByRole('banner')).toHaveAttribute('data-testid', 'top-nav');
    expect(screen.getByRole('banner')).toHaveAttribute('aria-label', 'Primary');
  });

  it('forwards ref to the root header element', () => {
    let headerElement: HTMLElement | null = null;
    render(
      <NavigationBar
        brand="Acme"
        ref={(node) => {
          headerElement = node;
        }}
      />,
    );

    expect(headerElement).toBe(screen.getByRole('banner'));
  });
});
