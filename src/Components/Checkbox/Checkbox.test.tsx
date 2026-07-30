import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Checkbox from './Checkbox';

describe('Checkbox', () => {
  it('renders a checkbox with its accessible name from the label', () => {
    render(<Checkbox label="Select row" />);

    expect(screen.getByRole('checkbox', { name: 'Select row' })).toBeInTheDocument();
  });

  it('renders a checkbox with its accessible name from aria-label when no label is supplied', () => {
    render(<Checkbox aria-label="Select all rows" />);

    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toBeInTheDocument();
  });

  it('toggles from unchecked to checked when clicked', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Select row" />);

    await user.click(screen.getByRole('checkbox', { name: 'Select row' }));

    expect(screen.getByRole('checkbox', { name: 'Select row' })).toBeChecked();
  });

  it('calls onChange with the new checked state', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox label="Select row" onChange={onChange} />);

    await user.click(screen.getByRole('checkbox', { name: 'Select row' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target.checked).toBe(true);
  });

  it('reports aria-checked="mixed" when indeterminate is true', () => {
    render(<Checkbox label="Select all" indeterminate />);

    expect(screen.getByRole('checkbox', { name: 'Select all' })).toHaveAttribute(
      'aria-checked',
      'mixed',
    );
  });

  it('sets the indeterminate DOM property when indeterminate is true', () => {
    render(<Checkbox label="Select all" indeterminate />);

    const checkbox = screen.getByRole('checkbox', { name: 'Select all' }) as HTMLInputElement;

    expect(checkbox.indeterminate).toBe(true);
  });

  it('clears the indeterminate DOM property when indeterminate becomes false', () => {
    const { rerender } = render(<Checkbox label="Select all" indeterminate />);

    rerender(<Checkbox label="Select all" indeterminate={false} />);
    const checkbox = screen.getByRole('checkbox', { name: 'Select all' }) as HTMLInputElement;

    expect(checkbox.indeterminate).toBe(false);
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Select row" disabled />);

    const checkbox = screen.getByRole('checkbox', { name: 'Select row' });
    await user.click(checkbox);

    expect(checkbox).not.toBeChecked();
  });

  it('toggles with the keyboard when focused', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Select row" />);

    await user.tab();
    await user.keyboard(' ');

    expect(screen.getByRole('checkbox', { name: 'Select row' })).toBeChecked();
  });

  it('applies error styling when hasError is true', () => {
    render(<Checkbox label="Select row" hasError />);

    expect(screen.getByRole('checkbox', { name: 'Select row' }).className).toContain(
      'snc:border-snc-error-border',
    );
  });

  it('forwards name and ref so React Hook Form can register the field', () => {
    const ref = vi.fn();
    render(<Checkbox label="Select row" name="selected" ref={ref} />);

    expect(screen.getByRole('checkbox', { name: 'Select row' })).toHaveAttribute(
      'name',
      'selected',
    );
    expect(ref).toHaveBeenCalled();
  });

  // The source library bolds the label whenever the box is ticked or mixed. It is driven from CSS
  // rather than a prop, so the assertion is on the variant being wired up, not on computed weight —
  // jsdom does not resolve Tailwind's generated stylesheet.
  it('bolds the label while checked or indeterminate', () => {
    const { container } = render(<Checkbox label="Select row" />);

    const wrapper = container.firstElementChild;

    expect(wrapper?.className).toContain('snc:has-[:checked]:font-bold');
    expect(wrapper?.className).toContain('snc:has-[:indeterminate]:font-bold');
  });

  it('merges a consumer-supplied className onto the wrapper', () => {
    const { container } = render(<Checkbox label="Select row" className="custom-class" />);

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});
