import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Input from './Input';

describe('Input', () => {
  it('renders a textbox with its accessible name from the associated label', () => {
    render(
      <>
        <label htmlFor="first-name">First name</label>
        <Input id="first-name" />
      </>,
    );

    expect(screen.getByRole('textbox', { name: 'First name' })).toBeInTheDocument();
  });

  it('updates the displayed value as the user types when uncontrolled', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Name" defaultValue="" />);

    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Ada');

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Ada');
  });

  it('calls onChange for each keystroke when controlled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input aria-label="Name" value="" onChange={onChange} />);

    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Ada');

    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it('applies error styling and sets aria-invalid when hasError is true', () => {
    render(<Input aria-label="Name" hasError />);

    const input = screen.getByRole('textbox', { name: 'Name' });

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.className).toContain('snc:border-snc-error-border');
  });

  it('does not set aria-invalid by default', () => {
    render(<Input aria-label="Name" />);

    expect(screen.getByRole('textbox', { name: 'Name' })).not.toHaveAttribute('aria-invalid');
  });

  it('does not accept input when disabled', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Name" disabled />);

    const input = screen.getByRole('textbox', { name: 'Name' });
    await user.type(input, 'Ada');

    expect(input).toHaveValue('');
  });

  it('renders its placeholder', () => {
    render(<Input aria-label="Name" placeholder="Start typing name" />);

    expect(screen.getByPlaceholderText('Start typing name')).toBeInTheDocument();
  });

  it('forwards name and ref so React Hook Form can register the field', () => {
    const ref = vi.fn();
    render(<Input aria-label="Name" name="firstName" ref={ref} />);

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAttribute('name', 'firstName');
    expect(ref).toHaveBeenCalled();
  });

  it('calls onBlur when focus leaves the field', async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    render(<Input aria-label="Name" onBlur={onBlur} />);

    await user.click(screen.getByRole('textbox', { name: 'Name' }));
    await user.tab();

    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('merges a consumer-supplied className with the variant classes', () => {
    render(<Input aria-label="Name" className="custom-class" />);

    const input = screen.getByRole('textbox', { name: 'Name' });

    expect(input.className).toContain('custom-class');
    expect(input.className).toContain('snc:rounded-md');
  });
});
