import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import MultiSelect from './MultiSelect';

const options = [
  { id: 'draft', title: 'Draft' },
  { id: 'active', title: 'Active' },
  { id: 'archived', title: 'Archived' },
];

const getTrigger = () => screen.getByRole('button', { name: 'Status' });

describe('MultiSelect', () => {
  it('renders a collapsed trigger with no panel visible', () => {
    render(<MultiSelect aria-label="Status" options={options} />);

    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('group')).not.toBeInTheDocument();
  });

  it('opens the panel showing one checkbox per option', async () => {
    const user = userEvent.setup();
    render(<MultiSelect aria-label="Status" options={options} />);

    await user.click(getTrigger());

    expect(screen.getByRole('group')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
  });

  it('selects multiple options and calls onChange with the accumulated array of ids each time', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MultiSelect aria-label="Status" options={options} onChange={onChange} />);

    await user.click(getTrigger());
    await user.click(screen.getByRole('checkbox', { name: 'Active' }));

    expect(onChange).toHaveBeenLastCalledWith(['active']);

    await user.click(screen.getByRole('checkbox', { name: 'Draft' }));

    expect(onChange).toHaveBeenLastCalledWith(['active', 'draft']);
  });

  it('panel remains open after selecting an option', async () => {
    const user = userEvent.setup();
    render(<MultiSelect aria-label="Status" options={options} />);

    await user.click(getTrigger());
    await user.click(screen.getByRole('checkbox', { name: 'Active' }));

    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('unchecking a selected option removes it from the onChange array', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultiSelect
        aria-label="Status"
        options={options}
        defaultValue={['active', 'draft']}
        onChange={onChange}
      />,
    );

    await user.click(getTrigger());
    await user.click(screen.getByRole('checkbox', { name: 'Active' }));

    expect(onChange).toHaveBeenLastCalledWith(['draft']);
  });

  it('displays the joined titles of every selected option in the trigger', () => {
    render(<MultiSelect aria-label="Status" options={options} defaultValue={['draft', 'archived']} />);

    expect(getTrigger()).toHaveTextContent('Draft, Archived');
  });

  it('shows the placeholder while nothing is selected', () => {
    render(<MultiSelect aria-label="Status" options={options} placeholder="Choose statuses" />);

    expect(getTrigger()).toHaveTextContent('Choose statuses');
  });

  it('starts from defaultValue when left uncontrolled', () => {
    render(<MultiSelect aria-label="Status" options={options} defaultValue={['archived']} />);

    expect(getTrigger()).toHaveTextContent('Archived');
  });

  it('does not change a controlled value on its own', async () => {
    const user = userEvent.setup();
    render(<MultiSelect aria-label="Status" options={options} value={['draft']} />);

    await user.click(getTrigger());
    await user.click(screen.getByRole('checkbox', { name: 'Active' }));

    expect(getTrigger()).toHaveTextContent('Draft');
    expect(getTrigger()).not.toHaveTextContent('Active');
  });

  it('does not select a disabled option', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultiSelect
        aria-label="Status"
        options={[...options, { id: 'deleted', title: 'Deleted', disabled: true }]}
        onChange={onChange}
      />,
    );

    await user.click(getTrigger());
    await user.click(screen.getByRole('checkbox', { name: 'Deleted' }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies the medium size classes by default', () => {
    render(<MultiSelect aria-label="Status" options={options} />);

    expect(getTrigger().className).toContain('snc:h-12');
  });

  it('applies the small size classes when size="sm"', () => {
    render(<MultiSelect aria-label="Status" options={options} size="sm" />);

    expect(getTrigger().className).toContain('snc:h-8');
  });

  it('applies error styling when hasError is true', () => {
    render(<MultiSelect aria-label="Status" options={options} hasError />);

    expect(getTrigger().className).toContain('snc:border-snc-error-border');
  });

  it('caps the panel height at the requested number of visible options', async () => {
    const user = userEvent.setup();
    render(<MultiSelect aria-label="Status" options={options} visibleOptions={2} />);

    await user.click(getTrigger());

    // The cap sits on the Popout panel, which is the scrolling element.
    expect(screen.getByRole('group').parentElement).toHaveStyle({ maxHeight: '4.5rem' });
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    render(<MultiSelect aria-label="Status" options={options} disabled />);

    expect(getTrigger()).toBeDisabled();

    await user.click(getTrigger());

    expect(screen.queryByRole('group')).not.toBeInTheDocument();
  });

  it('mirrors each selected value into its own hidden input sharing the given name', () => {
    const { container } = render(
      <MultiSelect aria-label="Status" options={options} name="statuses" value={['draft', 'active']} />,
    );

    const hiddenInputs = container.querySelectorAll('input[type="hidden"][name="statuses"]');

    expect(hiddenInputs).toHaveLength(2);
    expect(hiddenInputs[0]).toHaveValue('draft');
    expect(hiddenInputs[1]).toHaveValue('active');
  });

  it('opens the panel with ArrowDown when closed', async () => {
    const user = userEvent.setup();
    render(<MultiSelect aria-label="Status" options={options} />);

    getTrigger().focus();
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<MultiSelect aria-label="Status" options={options} />);

    await user.click(getTrigger());
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('group')).not.toBeInTheDocument();
    expect(getTrigger()).toHaveFocus();
  });

  it('closes when clicking outside the panel', async () => {
    const user = userEvent.setup();
    render(<MultiSelect aria-label="Status" options={options} />);

    await user.click(getTrigger());
    await user.click(document.body);

    expect(screen.queryByRole('group')).not.toBeInTheDocument();
  });

  it('forwards a callback ref to the trigger', () => {
    const ref = vi.fn();
    render(<MultiSelect aria-label="Status" options={options} ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });

  it('forwards an object ref to the trigger', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<MultiSelect aria-label="Status" options={options} ref={ref} />);

    expect(ref.current).toBe(getTrigger());
  });

  it('merges a consumer-supplied className onto the wrapper', () => {
    const { container } = render(
      <MultiSelect aria-label="Status" options={options} className="custom-class" />,
    );

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('renders no label element when label is omitted', () => {
    render(<MultiSelect aria-label="Status" options={options} />);

    expect(screen.queryByText('Status', { selector: 'label' })).not.toBeInTheDocument();
  });

  it('renders the accessible name from the label prop', () => {
    render(<MultiSelect label="Status" options={options} />);

    expect(screen.getByRole('button', { name: 'Status' })).toBeInTheDocument();
  });

  it("renders a collapsible OptionsGroup's children as checkboxes and reports their ids via onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultiSelect
        aria-label="Status"
        options={{ title: 'Statuses', childOptions: options }}
        onChange={onChange}
      />,
    );

    await user.click(getTrigger());
    await user.click(screen.getByRole('button', { name: 'Statuses' }));
    await user.click(screen.getByRole('checkbox', { name: 'Active' }));

    expect(onChange).toHaveBeenLastCalledWith(['active']);
  });

  it("renders an OptionsCollection's groups under their own headings and reports ids via onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultiSelect
        aria-label="Status"
        options={{
          Open: [options[0], options[1]],
          Closed: [options[2]],
        }}
        onChange={onChange}
      />,
    );

    await user.click(getTrigger());

    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();

    await user.click(screen.getByRole('checkbox', { name: 'Archived' }));

    expect(onChange).toHaveBeenLastCalledWith(['archived']);
  });
});
