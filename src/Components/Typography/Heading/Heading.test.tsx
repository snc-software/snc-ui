import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Heading from './Heading';

describe('Heading', () => {
  it('renders with the default level (h2) and displays its children', () => {
    render(<Heading>Section title</Heading>);

    const heading = screen.getByRole('heading', { level: 2, name: 'Section title' });

    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H2');
  });

  it('renders as an <h1> and applies the h1 size styling when level="h1"', () => {
    render(<Heading level="h1">Page title</Heading>);

    const heading = screen.getByRole('heading', { level: 1, name: 'Page title' });

    expect(heading.tagName).toBe('H1');
    expect(heading.className).toContain('snc:text-4xl');
  });

  it('renders as an <h2> and applies the h2 size styling when level="h2"', () => {
    render(<Heading level="h2">Title</Heading>);

    const heading = screen.getByRole('heading', { level: 2, name: 'Title' });

    expect(heading.tagName).toBe('H2');
    expect(heading.className).toContain('snc:text-3xl');
  });

  it('renders as an <h3> and applies the h3 size styling when level="h3"', () => {
    render(<Heading level="h3">Title</Heading>);

    const heading = screen.getByRole('heading', { level: 3, name: 'Title' });

    expect(heading.tagName).toBe('H3');
    expect(heading.className).toContain('snc:text-2xl');
  });

  it('renders as an <h4> and applies the h4 size styling when level="h4"', () => {
    render(<Heading level="h4">Title</Heading>);

    const heading = screen.getByRole('heading', { level: 4, name: 'Title' });

    expect(heading.tagName).toBe('H4');
    expect(heading.className).toContain('snc:text-xl');
  });

  it('renders as an <h5> and applies the h5 size styling when level="h5"', () => {
    render(<Heading level="h5">Title</Heading>);

    const heading = screen.getByRole('heading', { level: 5, name: 'Title' });

    expect(heading.tagName).toBe('H5');
    expect(heading.className).toContain('snc:text-lg');
  });

  it('renders as an <h6> and applies the h6 size styling when level="h6"', () => {
    render(<Heading level="h6">Title</Heading>);

    const heading = screen.getByRole('heading', { level: 6, name: 'Title' });

    expect(heading.tagName).toBe('H6');
    expect(heading.className).toContain('snc:text-base');
  });

  it('merges a consumer-supplied className with the size classes', () => {
    render(<Heading className="custom-class">Title</Heading>);

    const heading = screen.getByRole('heading', { name: 'Title' });

    expect(heading.className).toContain('custom-class');
    expect(heading.className).toContain('snc:text-3xl');
  });

  it('forwards standard attributes (e.g. lang, aria-label) via passthrough', () => {
    render(
      <Heading lang="fr" aria-label="French title">
        Titre
      </Heading>,
    );

    const heading = screen.getByRole('heading', { name: 'French title' });

    expect(heading).toHaveAttribute('lang', 'fr');
  });
});
