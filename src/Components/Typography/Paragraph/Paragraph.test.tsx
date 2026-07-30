import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Paragraph from './Paragraph';

describe('Paragraph', () => {
  it('renders as a <p> element and displays its children', () => {
    render(<Paragraph>Body copy</Paragraph>);

    const paragraph = screen.getByText('Body copy');

    expect(paragraph.tagName).toBe('P');
  });

  it('applies the base body typography styling', () => {
    render(<Paragraph>Body copy</Paragraph>);

    const paragraph = screen.getByText('Body copy');

    expect(paragraph.className).toContain('snc:font-snc-body');
  });

  it('merges a consumer-supplied className with the base classes', () => {
    render(<Paragraph className="custom-class">Body copy</Paragraph>);

    const paragraph = screen.getByText('Body copy');

    expect(paragraph.className).toContain('custom-class');
    expect(paragraph.className).toContain('snc:font-snc-body');
  });

  it('forwards standard attributes (e.g. lang, aria-label) via passthrough', () => {
    render(
      <Paragraph lang="fr" aria-label="French copy">
        Texte
      </Paragraph>,
    );

    const paragraph = screen.getByText('Texte');

    expect(paragraph).toHaveAttribute('lang', 'fr');
  });
});
