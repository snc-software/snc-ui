import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import Link from './Link';

describe('Link', () => {
  it('renders with the given href and displays its children', () => {
    render(<Link href="/about">About</Link>);

    const link = screen.getByRole('link', { name: 'About' });

    expect(link).toHaveAttribute('href', '/about');
  });

  it('applies the base link styling', () => {
    render(<Link href="/about">About</Link>);

    const link = screen.getByRole('link', { name: 'About' });

    expect(link.className).toContain('snc:text-snc-primary');
  });

  it('merges a consumer-supplied className with the base classes', () => {
    render(
      <Link href="/about" className="custom-class">
        About
      </Link>,
    );

    const link = screen.getByRole('link', { name: 'About' });

    expect(link.className).toContain('custom-class');
    expect(link.className).toContain('snc:text-snc-primary');
  });

  it('does not set a rel attribute when target is not "_blank"', () => {
    render(
      <Link href="/about" target="_self">
        About
      </Link>,
    );

    const link = screen.getByRole('link', { name: 'About' });

    expect(link).not.toHaveAttribute('rel');
  });

  it('automatically sets rel="noopener noreferrer" when target="_blank" and no rel is supplied', () => {
    render(
      <Link href="https://example.com" target="_blank">
        External
      </Link>,
    );

    const link = screen.getByRole('link', { name: 'External' });

    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('respects a consumer-supplied rel when target="_blank" instead of overriding it', () => {
    render(
      <Link href="https://example.com" target="_blank" rel="nofollow">
        External
      </Link>,
    );

    const link = screen.getByRole('link', { name: 'External' });

    expect(link).toHaveAttribute('rel', 'nofollow');
  });

  it('is reachable via keyboard tab navigation', async () => {
    const user = userEvent.setup();
    render(<Link href="/about">About</Link>);

    await user.tab();

    expect(screen.getByRole('link', { name: 'About' })).toHaveFocus();
  });

  it('forwards standard anchor attributes (e.g. download, aria-label) via passthrough', () => {
    render(
      <Link href="/file.pdf" download aria-label="Download report">
        Download
      </Link>,
    );

    const link = screen.getByRole('link', { name: 'Download report' });

    expect(link).toHaveAttribute('download');
  });
});
