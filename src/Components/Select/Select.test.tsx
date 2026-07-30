import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Select from './Select';

const options = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
];

describe('Select', () => {
  it('renders a combobox with an option per supplied option', () => {
    render(<Select aria-label="Status" options={options} />);

    expect(screen.getByRole('combobox', { name: 'Status' })).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(2);
  });

  it('selects an option and calls onChange with its value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select aria-label="Status" options={options} onChange={onChange} />);

    await user.selectOptions(screen.getByRole('combobox', { name: 'Status' }), 'active');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('combobox', { name: 'Status' })).toHaveValue('active');
  });

  it('renders the placeholder as a disabled leading option', () => {
    render(
      <Select
        aria-label="Status"
        options={options}
        placeholder="Choose a status"
        defaultValue=""
      />,
    );

    expect(screen.getByRole('option', { name: 'Choose a status' })).toBeDisabled();
  });

  it('marks individually disabled options as disabled', () => {
    render(
      <Select
        aria-label="Status"
        options={[...options, { value: 'deleted', label: 'Deleted', disabled: true }]}
      />,
    );

    expect(screen.getByRole('option', { name: 'Deleted' })).toBeDisabled();
  });

  it('applies the medium size classes by default', () => {
    render(<Select aria-label="Status" options={options} />);

    expect(screen.getByRole('combobox', { name: 'Status' }).className).toContain('snc:h-10');
  });

  it('applies the small size classes when size="sm"', () => {
    render(<Select aria-label="Status" options={options} size="sm" />);

    expect(screen.getByRole('combobox', { name: 'Status' }).className).toContain('snc:h-8');
  });

  it('applies error styling and sets aria-invalid when hasError is true', () => {
    render(<Select aria-label="Status" options={options} hasError />);

    const select = screen.getByRole('combobox', { name: 'Status' });

    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(select.className).toContain('snc:border-snc-error-border');
  });

  it('does not allow selection when disabled', () => {
    render(<Select aria-label="Status" options={options} disabled />);

    expect(screen.getByRole('combobox', { name: 'Status' })).toBeDisabled();
  });

  it('forwards name and ref so React Hook Form can register the field', () => {
    const ref = vi.fn();
    render(<Select aria-label="Status" options={options} name="status" ref={ref} />);

    expect(screen.getByRole('combobox', { name: 'Status' })).toHaveAttribute('name', 'status');
    expect(ref).toHaveBeenCalled();
  });

  it('merges a consumer-supplied className onto the wrapper', () => {
    const { container } = render(
      <Select aria-label="Status" options={options} className="custom-class" />,
    );

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});
