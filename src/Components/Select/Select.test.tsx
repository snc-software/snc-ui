import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import Select from './Select';

const options = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
];

const getTrigger = () => screen.getByRole('combobox', { name: 'Status' });

describe('Select', () => {
  it('renders a collapsed combobox with no options visible', () => {
    render(<Select aria-label="Status" options={options} />);

    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens a custom listbox panel rather than a native dropdown', async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Status" options={options} />);

    await user.click(getTrigger());

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
  });

  it('selects an option and calls onChange with its value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select aria-label="Status" options={options} onChange={onChange} />);

    await user.click(getTrigger());
    await user.click(screen.getByRole('option', { name: 'Active' }));

    expect(onChange).toHaveBeenCalledExactlyOnceWith('active');
  });

  it('displays the selected option and closes the panel after choosing', async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Status" options={options} />);

    await user.click(getTrigger());
    await user.click(screen.getByRole('option', { name: 'Active' }));

    expect(getTrigger()).toHaveTextContent('Active');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows the placeholder while nothing is selected', () => {
    render(<Select aria-label="Status" options={options} placeholder="Choose a status" />);

    expect(getTrigger()).toHaveTextContent('Choose a status');
  });

  it('marks the selected option with aria-selected', async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Status" options={options} value="archived" />);

    await user.click(getTrigger());

    expect(screen.getByRole('option', { name: 'Archived' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('does not change a controlled value on its own', async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Status" options={options} value="draft" />);

    await user.click(getTrigger());
    await user.click(screen.getByRole('option', { name: 'Active' }));

    expect(getTrigger()).toHaveTextContent('Draft');
  });

  it('starts from defaultValue when left uncontrolled', () => {
    render(<Select aria-label="Status" options={options} defaultValue="archived" />);

    expect(getTrigger()).toHaveTextContent('Archived');
  });

  it('opens with the arrow keys and moves focus between options', async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Status" options={options} />);

    getTrigger().focus();
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('option', { name: 'Draft' })).toHaveFocus();

    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('option', { name: 'Active' })).toHaveFocus();
  });

  it('wraps focus around the ends of the list', async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Status" options={options} />);

    getTrigger().focus();
    await user.keyboard('{ArrowDown}{ArrowUp}');

    expect(screen.getByRole('option', { name: 'Archived' })).toHaveFocus();
  });

  it('jumps to the first and last options with Home and End', async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Status" options={options} />);

    getTrigger().focus();
    await user.keyboard('{ArrowDown}{End}');

    expect(screen.getByRole('option', { name: 'Archived' })).toHaveFocus();

    await user.keyboard('{Home}');

    expect(screen.getByRole('option', { name: 'Draft' })).toHaveFocus();
  });

  it('selects the focused option with Enter', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select aria-label="Status" options={options} onChange={onChange} />);

    getTrigger().focus();
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');

    expect(onChange).toHaveBeenCalledExactlyOnceWith('active');
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Status" options={options} />);

    await user.click(getTrigger());
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(getTrigger()).toHaveFocus();
  });

  it('closes on Tab without pulling focus back to the trigger', async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Status" options={options} />);

    await user.click(getTrigger());
    await user.tab();

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(getTrigger()).not.toHaveFocus();
  });

  it('closes when clicking outside the panel', async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Status" options={options} />);

    await user.click(getTrigger());
    await user.click(document.body);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('skips disabled options when moving focus', async () => {
    const user = userEvent.setup();
    render(
      <Select
        aria-label="Status"
        options={[options[0], { value: 'deleted', label: 'Deleted', disabled: true }, options[1]]}
      />,
    );

    getTrigger().focus();
    await user.keyboard('{ArrowDown}{ArrowDown}');

    expect(screen.getByRole('option', { name: 'Active' })).toHaveFocus();
  });

  it('does not select a disabled option', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Select
        aria-label="Status"
        options={[...options, { value: 'deleted', label: 'Deleted', disabled: true }]}
        onChange={onChange}
      />,
    );

    await user.click(getTrigger());
    await user.click(screen.getByRole('option', { name: 'Deleted' }));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('applies the medium size classes by default', () => {
    render(<Select aria-label="Status" options={options} />);

    expect(getTrigger().className).toContain('snc:h-12');
  });

  it('applies the small size classes when size="sm"', () => {
    render(<Select aria-label="Status" options={options} size="sm" />);

    expect(getTrigger().className).toContain('snc:h-8');
  });

  it('applies error styling and sets aria-invalid when hasError is true', () => {
    render(<Select aria-label="Status" options={options} hasError />);

    expect(getTrigger()).toHaveAttribute('aria-invalid', 'true');
    expect(getTrigger().className).toContain('snc:border-snc-error-border');
  });

  it('caps the panel height at the requested number of visible options', async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Status" options={options} visibleOptions={2} />);

    await user.click(getTrigger());

    // The cap sits on the Popout panel, which is the scrolling element.
    expect(screen.getByRole('listbox').parentElement).toHaveStyle({ maxHeight: '5.5rem' });
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Status" options={options} disabled />);

    expect(getTrigger()).toBeDisabled();

    await user.click(getTrigger());

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('mirrors the selection into a hidden input when a name is supplied', () => {
    const { container } = render(
      <Select aria-label="Status" options={options} name="status" value="active" />,
    );

    expect(container.querySelector('input[type="hidden"]')).toHaveValue('active');
    expect(container.querySelector('input[type="hidden"]')).toHaveAttribute('name', 'status');
  });

  it('forwards a callback ref to the trigger', () => {
    const ref = vi.fn();
    render(<Select aria-label="Status" options={options} ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });

  it('forwards an object ref to the trigger', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Select aria-label="Status" options={options} ref={ref} />);

    expect(ref.current).toBe(getTrigger());
  });

  it('merges a consumer-supplied className onto the wrapper', () => {
    const { container } = render(
      <Select aria-label="Status" options={options} className="custom-class" />,
    );

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('renders no label element when label is omitted', () => {
    render(<Select aria-label="Status" options={options} />);

    expect(screen.queryByText('Status', { selector: 'label' })).not.toBeInTheDocument();
  });

  it('renders the accessible name from the label prop', () => {
    render(<Select label="Status" options={options} />);

    expect(screen.getByRole('combobox', { name: 'Status' })).toBeInTheDocument();
  });
});
