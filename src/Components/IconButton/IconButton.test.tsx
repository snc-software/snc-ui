import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Heart } from 'iconoir-react';
import { describe, expect, it, vi } from 'vitest';

import IconButton from './IconButton';

describe('IconButton', () => {
  it('renders with its accessible name from the label prop', () => {
    render(
      <IconButton label="Like">
        <Heart />
      </IconButton>,
    );

    expect(screen.getByRole('button', { name: 'Like' })).toBeInTheDocument();
  });

  it('renders with its accessible name from aria-label when explicitly supplied', () => {
    render(
      <IconButton label="Like" aria-label="Add to favorites">
        <Heart />
      </IconButton>,
    );

    expect(screen.getByRole('button', { name: 'Add to favorites' })).toBeInTheDocument();
  });

  it('renders the icon passed as children', () => {
    const { container } = render(
      <IconButton label="Like">
        <Heart data-testid="icon" />
      </IconButton>,
    );

    expect(container.querySelector('[data-testid="icon"]')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <IconButton label="Like" onClick={onClick}>
        <Heart />
      </IconButton>,
    );

    await user.click(screen.getByRole('button', { name: 'Like' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <IconButton label="Like" onClick={onClick} disabled>
        <Heart />
      </IconButton>,
    );

    await user.click(screen.getByRole('button', { name: 'Like' }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards ref to the root button element', () => {
    const ref = vi.fn();
    render(
      <IconButton label="Like" ref={ref}>
        <Heart />
      </IconButton>,
    );

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it('merges a consumer-supplied className onto the root element', () => {
    render(
      <IconButton label="Like" className="custom-class">
        <Heart />
      </IconButton>,
    );

    expect(screen.getByRole('button', { name: 'Like' })).toHaveClass('custom-class');
  });

  it('forwards standard button attributes via passthrough', () => {
    render(
      <IconButton label="Like" aria-pressed data-testid="like-button">
        <Heart />
      </IconButton>,
    );

    const button = screen.getByRole('button', { name: 'Like' });

    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('data-testid', 'like-button');
  });

  it('has a fixed type of "button" regardless of passthrough attempts', () => {
    render(
      // @ts-expect-error -- `type` is intentionally omitted from the props to prevent overriding it.
      <IconButton label="Like" type="submit">
        <Heart />
      </IconButton>,
    );

    expect(screen.getByRole('button', { name: 'Like' })).toHaveAttribute('type', 'button');
  });
});
