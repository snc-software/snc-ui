import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Separator from './Separator';

describe('Separator', () => {
  it('renders a horizontal separator line', () => {
    render(<Separator />);

    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('renders as a native hr element', () => {
    render(<Separator />);

    expect(screen.getByRole('separator').tagName).toBe('HR');
  });

  it('applies the shared border token as the line color', () => {
    render(<Separator />);

    expect(screen.getByRole('separator').className).toContain('snc:border-snc-border');
  });

  it('applies margin on both sides of the line by default (horizontal)', () => {
    render(<Separator />);

    expect(screen.getByRole('separator').className).toContain('snc:my-2');
  });

  it('merges a consumer-supplied className with the base classes', () => {
    render(<Separator className="custom-class" />);

    const separator = screen.getByRole('separator');

    expect(separator.className).toContain('custom-class');
    expect(separator.className).toContain('snc:border-snc-border');
  });

  it('forwards additional HTML attributes to the root element', () => {
    render(<Separator data-testid="separator" />);

    expect(screen.getByTestId('separator')).toBeInTheDocument();
  });

  it('applies the horizontal variant classes by default', () => {
    render(<Separator />);

    const separator = screen.getByRole('separator');

    expect(separator.className).toContain('snc:w-full');
    expect(separator).not.toHaveAttribute('aria-orientation');
  });

  it('applies the vertical variant classes when orientation="vertical"', () => {
    render(<Separator orientation="vertical" />);

    const separator = screen.getByRole('separator');

    expect(separator.className).toContain('snc:h-full');
    expect(separator.className).toContain('snc:mx-2');
  });

  it('sets aria-orientation to vertical when orientation="vertical"', () => {
    render(<Separator orientation="vertical" />);

    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });
});
