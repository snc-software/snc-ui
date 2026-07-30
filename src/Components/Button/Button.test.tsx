import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Button from './Button';

describe('Button', () => {
  it('renders with the default variant and displays its children', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });

    expect(button).toBeInTheDocument();
  });

  it('applies the primary variant styling by default', () => {
    render(<Button>Primary</Button>);

    const button = screen.getByRole('button', { name: 'Primary' });

    expect(button.className).toContain('snc:bg-snc-primary');
  });

  it('applies the secondary variant styling when variant="secondary"', () => {
    render(<Button variant="secondary">Secondary</Button>);

    const button = screen.getByRole('button', { name: 'Secondary' });

    expect(button.className).toContain('snc:border-snc-primary');
  });

  it('applies the round variant styling when variant="round"', () => {
    render(<Button variant="round">Round</Button>);

    const button = screen.getByRole('button', { name: 'Round' });

    expect(button.className).toContain('snc:rounded-full');
  });

  it('applies the text variant styling when variant="text"', () => {
    render(<Button variant="text">Text</Button>);

    const button = screen.getByRole('button', { name: 'Text' });

    expect(button.className).toContain('snc:bg-transparent');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    await user.click(screen.getByRole('button', { name: 'Click me' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Click me
      </Button>,
    );

    await user.click(screen.getByRole('button', { name: 'Click me' }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when isLoading is true', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button isLoading onClick={onClick}>
        Click me
      </Button>,
    );

    await user.click(screen.getByRole('button', { name: /click me/i }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('disables the button and sets aria-busy when isLoading is true', () => {
    render(<Button isLoading>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('renders a Spinner when isLoading is true', () => {
    render(<Button isLoading>Click me</Button>);

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('paints the Spinner in the button foreground rather than the primary colour', () => {
    render(<Button isLoading>Click me</Button>);

    const spinner = screen.getByRole('status', { name: 'Loading' });

    expect(spinner.className).toContain('snc:text-current');
    expect(spinner.className).not.toContain('snc:text-snc-primary');
  });

  it('does not render a Spinner when isLoading is false', () => {
    render(<Button>Click me</Button>);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('merges a consumer-supplied className with the variant classes', () => {
    render(<Button className="custom-class">Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });

    expect(button.className).toContain('custom-class');
    expect(button.className).toContain('snc:bg-snc-primary');
  });

  it('forwards standard button attributes via passthrough', () => {
    render(
      <Button type="submit" aria-label="Submit form">
        Submit
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Submit form' });

    expect(button).toHaveAttribute('type', 'submit');
  });
});
