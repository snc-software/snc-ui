import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Spinner from './Spinner';

describe('Spinner', () => {
  it('renders a status region with the default accessible label', () => {
    render(<Spinner />);

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('renders a consumer-supplied label as its accessible name', () => {
    render(<Spinner label="Fetching results" />);

    expect(screen.getByRole('status', { name: 'Fetching results' })).toBeInTheDocument();
  });

  it('applies the medium size classes by default', () => {
    render(<Spinner />);

    expect(screen.getByRole('status').querySelector('svg')?.getAttribute('class')).toContain(
      'snc:h-6',
    );
  });

  it('applies the small size classes when size="sm"', () => {
    render(<Spinner size="sm" />);

    expect(screen.getByRole('status').querySelector('svg')?.getAttribute('class')).toContain(
      'snc:h-4',
    );
  });

  it('applies the large size classes when size="lg"', () => {
    render(<Spinner size="lg" />);

    expect(screen.getByRole('status').querySelector('svg')?.getAttribute('class')).toContain(
      'snc:h-8',
    );
  });

  it('applies the extra large size classes when size="xl"', () => {
    render(<Spinner size="xl" />);

    expect(screen.getByRole('status').querySelector('svg')?.getAttribute('class')).toContain(
      'snc:h-12',
    );
  });

  it('hides the decorative graphic from assistive technology', () => {
    render(<Spinner />);

    expect(screen.getByRole('status').querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('paints in the primary colour by default', () => {
    render(<Spinner />);

    expect(screen.getByRole('status').className).toContain('snc:text-snc-primary');
  });

  it('lets a consumer-supplied text colour replace the primary default', () => {
    render(<Spinner className="snc:text-current" />);

    const spinner = screen.getByRole('status');

    expect(spinner.className).toContain('snc:text-current');
    expect(spinner.className).not.toContain('snc:text-snc-primary');
  });

  it('merges a consumer-supplied className with the base classes', () => {
    render(<Spinner className="custom-class" />);

    expect(screen.getByRole('status').className).toContain('custom-class');
  });
});
