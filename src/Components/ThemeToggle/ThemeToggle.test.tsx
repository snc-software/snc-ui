import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import ThemeToggle from './ThemeToggle';

// iconoir-react doesn't add a distinguishing class or testid to its icons, so identify which
// icon rendered by its unique path data instead.
const SUN_PATH_D = 'M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6';
const MOON_PATH_D = 'M3 11.5066C3 16.7497 7.25034 21 12.4934 21';

describe('ThemeToggle', () => {
  it('renders with its accessible name from the default label', () => {
    render(<ThemeToggle />);

    expect(screen.getByRole('button', { name: 'Toggle theme' })).toBeInTheDocument();
  });

  it('renders with its accessible name from a custom label', () => {
    render(<ThemeToggle label="Switch theme" />);

    expect(screen.getByRole('button', { name: 'Switch theme' })).toBeInTheDocument();
  });

  it('renders with its accessible name from aria-label when no label is supplied', () => {
    render(<ThemeToggle label="" aria-label="Switch theme" />);

    expect(screen.getByRole('button', { name: 'Switch theme' })).toBeInTheDocument();
  });

  it('shows the sun icon when in light theme by default', () => {
    const { container } = render(<ThemeToggle />);

    expect(container.querySelector(`path[d^="${SUN_PATH_D}"]`)).toBeInTheDocument();
  });

  it('shows the moon icon when in dark theme', () => {
    const { container } = render(<ThemeToggle defaultTheme="dark" />);

    expect(container.querySelector(`path[d^="${MOON_PATH_D}"]`)).toBeInTheDocument();
  });

  it('toggles from light to dark when clicked, updating the icon and aria-pressed', async () => {
    const user = userEvent.setup();
    const { container } = render(<ThemeToggle />);

    await user.click(screen.getByRole('button', { name: 'Toggle theme' }));

    expect(screen.getByRole('button', { name: 'Toggle theme' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(container.querySelector(`path[d^="${MOON_PATH_D}"]`)).toBeInTheDocument();
  });

  it('toggles from dark to light when clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle defaultTheme="dark" />);

    await user.click(screen.getByRole('button', { name: 'Toggle theme' }));

    expect(screen.getByRole('button', { name: 'Toggle theme' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('calls onToggle with the new theme value when clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<ThemeToggle onToggle={onToggle} />);

    await user.click(screen.getByRole('button', { name: 'Toggle theme' }));

    expect(onToggle).toHaveBeenCalledWith('dark');
  });

  it('supports controlled usage via the theme prop', () => {
    const { container, rerender } = render(<ThemeToggle theme="light" onToggle={vi.fn()} />);

    expect(container.querySelector(`path[d^="${SUN_PATH_D}"]`)).toBeInTheDocument();

    rerender(<ThemeToggle theme="dark" onToggle={vi.fn()} />);

    expect(container.querySelector(`path[d^="${MOON_PATH_D}"]`)).toBeInTheDocument();
  });

  it('supports uncontrolled usage via defaultTheme', () => {
    render(<ThemeToggle defaultTheme="dark" />);

    expect(screen.getByRole('button', { name: 'Toggle theme' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle disabled />);

    await user.click(screen.getByRole('button', { name: 'Toggle theme' }));

    expect(screen.getByRole('button', { name: 'Toggle theme' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('toggles with the keyboard when focused', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.tab();
    await user.keyboard('{Enter}');

    expect(screen.getByRole('button', { name: 'Toggle theme' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('calls a consumer-supplied onClick in addition to the internal toggle logic', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ThemeToggle onClick={onClick} />);

    await user.click(screen.getByRole('button', { name: 'Toggle theme' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('forwards ref to the root button element', () => {
    const ref = vi.fn();
    render(<ThemeToggle ref={ref} />);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it('merges a consumer-supplied className onto the root element', () => {
    render(<ThemeToggle className="custom-class" />);

    expect(screen.getByRole('button', { name: 'Toggle theme' })).toHaveClass('custom-class');
  });
});
