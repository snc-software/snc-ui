import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import Autocomplete from './Autocomplete';

const options = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
];

const getTrigger = () => screen.getByRole('combobox', { name: 'Status' });

describe('Autocomplete', () => {
  it('renders a collapsed combobox input with no listbox visible', () => {
    render(<Autocomplete aria-label="Status" options={options} />);

    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('renders no placeholder attribute when placeholder is not supplied', () => {
    render(<Autocomplete aria-label="Status" options={options} />);

    expect(getTrigger()).not.toHaveAttribute('placeholder');
  });

  it('shows the given placeholder when supplied and nothing is selected', () => {
    render(<Autocomplete aria-label="Status" options={options} placeholder="Search status" />);

    expect(getTrigger()).toHaveAttribute('placeholder', 'Search status');
  });

  it("displays the selected option's label in the input by default", () => {
    render(<Autocomplete aria-label="Status" options={options} value="active" />);

    expect(getTrigger()).toHaveValue('Active');
  });

  it('starts from defaultValue when left uncontrolled', () => {
    render(<Autocomplete aria-label="Status" options={options} defaultValue="archived" />);

    expect(getTrigger()).toHaveValue('Archived');
  });

  it('opens the listbox and shows all options when the input receives focus', async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="Status" options={options} />);

    await user.click(getTrigger());

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
  });

  it('filters the visible options as the user types, case-insensitively', async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="Status" options={options} />);

    await user.click(getTrigger());
    await user.type(getTrigger(), 'AC');

    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option', { name: 'Active' })).toBeInTheDocument();
  });

  it('shows the default "No results found" row when no option matches the typed text', async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="Status" options={options} />);

    await user.click(getTrigger());
    await user.type(getTrigger(), 'zzz');

    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });

  it('shows a custom noResultsMessage when supplied and no option matches', async () => {
    const user = userEvent.setup();
    render(
      <Autocomplete
        aria-label="Status"
        options={options}
        noResultsMessage="Nothing matches"
      />,
    );

    await user.click(getTrigger());
    await user.type(getTrigger(), 'zzz');

    expect(screen.getByText('Nothing matches')).toBeInTheDocument();
    expect(screen.queryByText('No results found')).not.toBeInTheDocument();
  });

  it('selects an option and calls onChange with its value when clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Autocomplete aria-label="Status" options={options} onChange={onChange} />);

    await user.click(getTrigger());
    await user.click(screen.getByRole('option', { name: 'Active' }));

    expect(onChange).toHaveBeenCalledExactlyOnceWith('active');
  });

  it("updates the input's text to the selected option's label after selecting", async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="Status" options={options} />);

    await user.click(getTrigger());
    await user.click(screen.getByRole('option', { name: 'Active' }));

    expect(getTrigger()).toHaveValue('Active');
  });

  it('closes the panel after selecting an option', async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="Status" options={options} />);

    await user.click(getTrigger());
    await user.click(screen.getByRole('option', { name: 'Active' }));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('does not change a controlled value on its own after selecting', async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="Status" options={options} value="draft" />);

    await user.click(getTrigger());
    await user.click(screen.getByRole('option', { name: 'Active' }));

    expect(getTrigger()).toHaveValue('Active');
  });

  it('reverts the input text to the current selection when closed without a selection', async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="Status" options={options} value="active" />);

    await user.click(getTrigger());
    await user.type(getTrigger(), 'zzz');
    await user.click(document.body);

    expect(getTrigger()).toHaveValue('Active');
  });

  it('reverts to an empty input when closed without a selection and nothing was previously selected', async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="Status" options={options} />);

    await user.click(getTrigger());
    await user.type(getTrigger(), 'zzz');
    await user.click(document.body);

    expect(getTrigger()).toHaveValue('');
  });

  it('opens the panel with ArrowDown when closed', async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="Status" options={options} />);

    // Open and close it first (focus alone would already open it, which wouldn't exercise the
    // "closed" branch) — Escape closes the panel but leaves the input focused.
    await user.click(getTrigger());
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('moves the highlighted option with ArrowDown/ArrowUp, updating aria-activedescendant, without moving DOM focus off the input', async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="Status" options={options} />);

    // Focus alone already opens the panel and highlights the first option (per the "opens on focus"
    // requirement), so the assertions below start from Draft already highlighted.
    await user.click(getTrigger());

    expect(getTrigger()).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Draft' }).id,
    );
    expect(getTrigger()).toHaveFocus();

    await user.keyboard('{ArrowDown}');

    expect(getTrigger()).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Active' }).id,
    );
    expect(getTrigger()).toHaveFocus();
  });

  it('wraps highlighting around the ends of the filtered list', async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="Status" options={options} />);

    // Focus already highlights the first option (Draft); moving up from there should wrap to the end.
    await user.click(getTrigger());
    await user.keyboard('{ArrowUp}');

    expect(getTrigger()).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Archived' }).id,
    );
  });

  it('jumps to the first/last filtered option with Home/End', async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="Status" options={options} />);

    await user.click(getTrigger());
    await user.keyboard('{ArrowDown}{End}');

    expect(getTrigger()).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Archived' }).id,
    );

    await user.keyboard('{Home}');

    expect(getTrigger()).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Draft' }).id,
    );
  });

  it('selects the highlighted option with Enter', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Autocomplete aria-label="Status" options={options} onChange={onChange} />);

    // Focus already highlights Draft; one ArrowDown moves to Active.
    await user.click(getTrigger());
    await user.keyboard('{ArrowDown}{Enter}');

    expect(onChange).toHaveBeenCalledExactlyOnceWith('active');
  });

  it('skips disabled options when moving the highlight', async () => {
    const user = userEvent.setup();
    render(
      <Autocomplete
        aria-label="Status"
        options={[options[0], { value: 'deleted', label: 'Deleted', disabled: true }, options[1]]}
      />,
    );

    // Focus already highlights Draft (index 0); one ArrowDown skips the disabled option and lands on
    // Active.
    await user.click(getTrigger());
    await user.keyboard('{ArrowDown}');

    expect(getTrigger()).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Active' }).id,
    );
  });

  it('does not select a disabled option when clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Autocomplete
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

  it('closes on Escape, reverts unmatched text, and keeps focus on the input', async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="Status" options={options} value="active" />);

    await user.click(getTrigger());
    await user.type(getTrigger(), 'zzz');
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(getTrigger()).toHaveValue('Active');
    expect(getTrigger()).toHaveFocus();
  });

  it('closes when clicking outside the panel', async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="Status" options={options} />);

    await user.click(getTrigger());
    await user.click(document.body);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('applies the medium size classes by default', () => {
    render(<Autocomplete aria-label="Status" options={options} />);

    expect(getTrigger().className).toContain('snc:h-12');
  });

  it('applies the small size classes when size="sm"', () => {
    render(<Autocomplete aria-label="Status" options={options} size="sm" />);

    expect(getTrigger().className).toContain('snc:h-8');
  });

  it('applies error styling and sets aria-invalid when hasError is true', () => {
    render(<Autocomplete aria-label="Status" options={options} hasError />);

    expect(getTrigger()).toHaveAttribute('aria-invalid', 'true');
    expect(getTrigger().className).toContain('snc:border-snc-error-border');
  });

  it('caps the panel height at the requested number of visible options', async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="Status" options={options} visibleOptions={2} />);

    await user.click(getTrigger());

    // The cap sits on the Popout panel, which is the scrolling element.
    expect(screen.getByRole('listbox').parentElement).toHaveStyle({ maxHeight: '5.5rem' });
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="Status" options={options} disabled />);

    expect(getTrigger()).toBeDisabled();

    await user.click(getTrigger());

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('mirrors the selection into a hidden input when a name is supplied', () => {
    const { container } = render(
      <Autocomplete aria-label="Status" options={options} name="status" value="active" />,
    );

    expect(container.querySelector('input[type="hidden"]')).toHaveValue('active');
    expect(container.querySelector('input[type="hidden"]')).toHaveAttribute('name', 'status');
  });

  it('forwards a callback ref to the input', () => {
    const ref = vi.fn();
    render(<Autocomplete aria-label="Status" options={options} ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });

  it('forwards an object ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Autocomplete aria-label="Status" options={options} ref={ref} />);

    expect(ref.current).toBe(getTrigger());
  });

  it('merges a consumer-supplied className onto the wrapper', () => {
    const { container } = render(
      <Autocomplete aria-label="Status" options={options} className="custom-class" />,
    );

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('renders no label element when label is omitted', () => {
    render(<Autocomplete aria-label="Status" options={options} />);

    expect(screen.queryByText('Status', { selector: 'label' })).not.toBeInTheDocument();
  });

  it('renders the accessible name from the label prop', () => {
    render(<Autocomplete label="Status" options={options} />);

    expect(screen.getByRole('combobox', { name: 'Status' })).toBeInTheDocument();
  });
});
