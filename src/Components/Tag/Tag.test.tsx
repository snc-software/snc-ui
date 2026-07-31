import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Tag from './Tag';

describe('Tag', () => {
  it('renders the provided text content', () => {
    render(<Tag>Filters</Tag>);

    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('renders text in the heading font', () => {
    render(<Tag>Filters</Tag>);

    expect(screen.getByText('Filters').className).toContain('snc:font-snc-heading');
  });

  it('renders the text in full caps via text-transform', () => {
    render(<Tag>Filters</Tag>);

    expect(screen.getByText('Filters').className).toContain('snc:uppercase');
  });

  it('applies a subtle primary background with a stronger primary border and text color', () => {
    render(<Tag>Filters</Tag>);

    expect(screen.getByText('Filters').className).toContain('snc:bg-snc-primary-subtle-bg');
    expect(screen.getByText('Filters').className).toContain('snc:border-snc-primary');
    expect(screen.getByText('Filters').className).toContain('snc:text-snc-primary');
  });

  it('merges a consumer-supplied className with the base classes', () => {
    render(<Tag className="custom-class">Filters</Tag>);

    expect(screen.getByText('Filters').className).toContain('custom-class');
  });

  it('forwards additional HTML attributes to the root element', () => {
    render(<Tag data-testid="tag">Filters</Tag>);

    expect(screen.getByTestId('tag')).toBeInTheDocument();
  });
});
