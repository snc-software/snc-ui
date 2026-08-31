import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import Skeleton from './Skeleton';

describe('Skeleton', () => {
  it('renders the default text shape classes when shape is omitted', () => {
    render(<Skeleton data-testid="skeleton" />);

    expect(screen.getByTestId('skeleton').className).toContain('snc:rounded');
    expect(screen.getByTestId('skeleton').className).not.toContain('snc:rounded-full');
  });

  it('renders the circle shape classes when shape="circle"', () => {
    render(<Skeleton shape="circle" data-testid="skeleton" />);

    expect(screen.getByTestId('skeleton').className).toContain('snc:rounded-full');
  });

  it('renders the rect shape classes when shape="rect"', () => {
    render(<Skeleton shape="rect" data-testid="skeleton" />);

    expect(screen.getByTestId('skeleton').className).toContain('snc:rounded-md');
  });

  it('applies the pulsing animation class', () => {
    render(<Skeleton data-testid="skeleton" />);

    expect(screen.getByTestId('skeleton').className).toContain('snc:animate-pulse');
  });

  it('is hidden from assistive technology', () => {
    render(<Skeleton data-testid="skeleton" />);

    expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true');
  });

  it('exposes no accessible role', () => {
    render(<Skeleton data-testid="skeleton" />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('merges a consumer-supplied className with the base classes', () => {
    render(<Skeleton className="custom-class" data-testid="skeleton" />);

    const skeleton = screen.getByTestId('skeleton');

    expect(skeleton.className).toContain('custom-class');
    expect(skeleton.className).toContain('snc:animate-pulse');
  });

  it('forwards data-* attributes to the root element', () => {
    render(<Skeleton data-testid="skeleton" />);

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Skeleton ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
