import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import TextArea from './TextArea';

describe('TextArea', () => {
  it('renders a textbox with its accessible name from the associated label', () => {
    render(
      <>
        <label htmlFor="bio">Bio</label>
        <TextArea id="bio" />
      </>,
    );

    expect(screen.getByRole('textbox', { name: 'Bio' })).toBeInTheDocument();
  });

  it('updates the displayed value as the user types when uncontrolled', async () => {
    const user = userEvent.setup();
    render(<TextArea aria-label="Bio" defaultValue="" />);

    await user.type(screen.getByRole('textbox', { name: 'Bio' }), 'Ada');

    expect(screen.getByRole('textbox', { name: 'Bio' })).toHaveValue('Ada');
  });

  it('calls onChange for each keystroke when controlled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextArea aria-label="Bio" value="" onChange={onChange} />);

    await user.type(screen.getByRole('textbox', { name: 'Bio' }), 'Ada');

    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it('applies error styling and sets aria-invalid when hasError is true', () => {
    render(<TextArea aria-label="Bio" hasError />);

    const textarea = screen.getByRole('textbox', { name: 'Bio' });

    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea.className).toContain('snc:border-snc-error-border');
  });

  it('does not set aria-invalid by default', () => {
    render(<TextArea aria-label="Bio" />);

    expect(screen.getByRole('textbox', { name: 'Bio' })).not.toHaveAttribute('aria-invalid');
  });

  it('does not accept input when disabled', async () => {
    const user = userEvent.setup();
    render(<TextArea aria-label="Bio" disabled />);

    const textarea = screen.getByRole('textbox', { name: 'Bio' });
    await user.type(textarea, 'Ada');

    expect(textarea).toHaveValue('');
  });

  it('renders its placeholder', () => {
    render(<TextArea aria-label="Bio" placeholder="Tell us about yourself" />);

    expect(screen.getByPlaceholderText('Tell us about yourself')).toBeInTheDocument();
  });

  it('forwards name and ref so React Hook Form can register the field', () => {
    const ref = vi.fn();
    render(<TextArea aria-label="Bio" name="bio" ref={ref} />);

    expect(screen.getByRole('textbox', { name: 'Bio' })).toHaveAttribute('name', 'bio');
    expect(ref).toHaveBeenCalled();
  });

  it('calls onBlur when focus leaves the field', async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    render(<TextArea aria-label="Bio" onBlur={onBlur} />);

    await user.click(screen.getByRole('textbox', { name: 'Bio' }));
    await user.tab();

    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('merges a consumer-supplied className with the variant classes', () => {
    render(<TextArea aria-label="Bio" className="custom-class" />);

    const textarea = screen.getByRole('textbox', { name: 'Bio' });

    expect(textarea.className).toContain('custom-class');
    expect(textarea.className).toContain('snc:rounded-md');
  });
});
