import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Switch from './Switch';

describe('Switch', () => {
  it('renders a switch with its accessible name from the label', () => {
    render(<Switch label="Enable notifications" />);

    expect(screen.getByRole('switch', { name: 'Enable notifications' })).toBeInTheDocument();
  });

  it('renders a switch with its accessible name from aria-label when no label is supplied', () => {
    render(<Switch aria-label="Enable notifications" />);

    expect(screen.getByRole('switch', { name: 'Enable notifications' })).toBeInTheDocument();
  });

  it('exposes role="switch" for assistive technology', () => {
    render(<Switch label="Enable notifications" />);

    expect(screen.getByRole('switch', { name: 'Enable notifications' })).toHaveAttribute(
      'type',
      'checkbox',
    );
  });

  it('toggles from unchecked to checked when clicked', async () => {
    const user = userEvent.setup();
    render(<Switch label="Enable notifications" />);

    await user.click(screen.getByRole('switch', { name: 'Enable notifications' }));

    expect(screen.getByRole('switch', { name: 'Enable notifications' })).toBeChecked();
  });

  it('calls onChange with the new checked state', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch label="Enable notifications" onChange={onChange} />);

    await user.click(screen.getByRole('switch', { name: 'Enable notifications' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target.checked).toBe(true);
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    render(<Switch label="Enable notifications" disabled />);

    const toggle = screen.getByRole('switch', { name: 'Enable notifications' });
    await user.click(toggle);

    expect(toggle).not.toBeChecked();
  });

  it('toggles with the keyboard when focused', async () => {
    const user = userEvent.setup();
    render(<Switch label="Enable notifications" />);

    await user.tab();
    await user.keyboard(' ');

    expect(screen.getByRole('switch', { name: 'Enable notifications' })).toBeChecked();
  });

  it('applies error styling when hasError is true', () => {
    render(<Switch label="Enable notifications" hasError />);

    expect(screen.getByRole('switch', { name: 'Enable notifications' }).className).toContain(
      'snc:border-snc-error-border',
    );
  });

  it('forwards name and ref so React Hook Form can register the field', () => {
    const ref = vi.fn();
    render(<Switch label="Enable notifications" name="notifications" ref={ref} />);

    expect(screen.getByRole('switch', { name: 'Enable notifications' })).toHaveAttribute(
      'name',
      'notifications',
    );
    expect(ref).toHaveBeenCalled();
  });

  it('supports controlled usage via the checked prop', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Switch label="Enable notifications" checked={false} onChange={onChange} />,
    );

    expect(screen.getByRole('switch', { name: 'Enable notifications' })).not.toBeChecked();

    rerender(<Switch label="Enable notifications" checked={true} onChange={onChange} />);

    expect(screen.getByRole('switch', { name: 'Enable notifications' })).toBeChecked();
  });

  it('supports uncontrolled usage via defaultChecked', () => {
    render(<Switch label="Enable notifications" defaultChecked />);

    expect(screen.getByRole('switch', { name: 'Enable notifications' })).toBeChecked();
  });

  it('merges a consumer-supplied className onto the wrapper', () => {
    const { container } = render(<Switch label="Enable notifications" className="custom-class" />);

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  // Asserts the transition/translate utilities are wired up, not computed motion — jsdom does not
  // resolve Tailwind's output or run CSS transitions. Same caveat `Checkbox` documents for its own
  // class-based assertions.
  it('wires up the transition/translate classes that animate the thumb between states', () => {
    const { container } = render(<Switch label="Enable notifications" />);

    const thumb = container.querySelector('[aria-hidden="true"]');

    expect(thumb?.className).toContain('snc:transition-transform');
    expect(thumb?.className).toContain('snc:peer-checked:translate-x-5');
  });

  it('gives the track a neutral fill in the off state so the thumb stays visible against it', () => {
    render(<Switch label="Enable notifications" />);

    expect(screen.getByRole('switch', { name: 'Enable notifications' }).className).toContain(
      'snc:bg-snc-neutral-400',
    );
  });

  // Asserts the variant is wired up, not computed weight — jsdom does not resolve Tailwind's output.
  it('bolds the label while checked', () => {
    const { container } = render(<Switch label="Enable notifications" />);

    const wrapper = container.firstElementChild;

    expect(wrapper?.className).toContain('snc:has-[:checked]:font-bold');
  });
});
