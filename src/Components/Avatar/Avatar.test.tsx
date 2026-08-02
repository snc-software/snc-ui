import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Avatar from './Avatar';

describe('Avatar', () => {
  it('renders an image with the given src when supplied', () => {
    render(<Avatar name="Ada Lovelace" src="https://example.com/ada.png" />);

    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Ada Lovelace' }).querySelector('img')).toHaveAttribute(
      'src',
      'https://example.com/ada.png',
    );
  });

  it('falls back to initials when src is omitted', () => {
    render(<Avatar name="Ada Lovelace" />);

    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveTextContent('AL');
  });

  it('falls back to initials when the image fails to load', () => {
    render(<Avatar name="Ada Lovelace" src="https://example.com/broken.png" />);

    const image = screen.getByRole('img', { name: 'Ada Lovelace' }).querySelector('img');
    if (image) {
      fireEvent.error(image);
    }

    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveTextContent('AL');
  });

  it('renders the first two characters as initials for a single-word name', () => {
    render(<Avatar name="Cher" />);

    expect(screen.getByRole('img', { name: 'Cher' })).toHaveTextContent('CH');
  });

  it('applies the correct size classes for each size value', () => {
    const { rerender } = render(<Avatar name="Ada Lovelace" size="sm" />);
    expect(screen.getByRole('img', { name: 'Ada Lovelace' }).className).toContain('snc:h-6');

    rerender(<Avatar name="Ada Lovelace" size="lg" />);
    expect(screen.getByRole('img', { name: 'Ada Lovelace' }).className).toContain('snc:h-10');
  });

  it('applies the same palette colour class for the same name across renders', () => {
    const { unmount } = render(<Avatar name="Grace Hopper" />);
    const firstClassName = screen.getByText('GH').className;
    unmount();

    render(<Avatar name="Grace Hopper" />);
    expect(screen.getByText('GH').className).toBe(firstClassName);
  });

  it('applies different palette colour classes for different names', () => {
    const { unmount } = render(<Avatar name="Ada Lovelace" />);
    const firstClassName = screen.getByText('AL').className;
    unmount();

    render(<Avatar name="Grace Hopper" />);
    expect(screen.getByText('GH').className).not.toBe(firstClassName);
  });

  it('renders fallback initials in the heading font', () => {
    render(<Avatar name="Ada Lovelace" />);

    expect(screen.getByRole('img', { name: 'Ada Lovelace' }).className).toContain(
      'snc:font-snc-heading',
    );
  });
});
