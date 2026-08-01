import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import DatePicker from './DatePicker';

const getTrigger = () => screen.getByRole('combobox', { name: 'Date' });
const getGrid = () => screen.getByRole('grid');

const getDayCell = (day: number) =>
  within(getGrid())
    .getAllByRole('gridcell')
    .find((cell) => cell.textContent === String(day)) as HTMLElement;

describe('DatePicker', () => {
  it('renders a collapsed trigger input with no calendar panel visible', () => {
    render(<DatePicker aria-label="Date" />);

    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  it('shows the placeholder when nothing is selected', () => {
    render(<DatePicker aria-label="Date" placeholder="Choose a date" />);

    expect(getTrigger()).toHaveAttribute('placeholder', 'Choose a date');
  });

  it('opens the calendar panel when the input is clicked', async () => {
    const user = userEvent.setup();
    render(<DatePicker aria-label="Date" />);

    await user.click(getTrigger());

    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
  });

  it('opens the calendar panel when the calendar icon button is clicked', async () => {
    const user = userEvent.setup();
    render(<DatePicker aria-label="Date" />);

    await user.click(screen.getByRole('button', { name: 'Open calendar' }));

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('opens the calendar panel with ArrowDown on a focused trigger', async () => {
    const user = userEvent.setup();
    render(<DatePicker aria-label="Date" />);

    getTrigger().focus();
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('displays the selected date (yyyy-MM-dd) in the trigger once a day is picked', async () => {
    const user = userEvent.setup();
    render(<DatePicker aria-label="Date" defaultValue="2026-07-01" />);

    await user.click(getTrigger());
    await user.click(getDayCell(15));

    expect(getTrigger()).toHaveValue('2026-07-15');
  });

  it('calls onChange with a plain yyyy-MM-dd string by default', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker aria-label="Date" defaultValue="2026-07-01" onChange={onChange} />);

    await user.click(getTrigger());
    await user.click(getDayCell(15));

    expect(onChange).toHaveBeenCalledExactlyOnceWith('2026-07-15');
  });

  it('calls onChange with a full UTC-midnight ISO 8601 string when includeTime is true', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker aria-label="Date" defaultValue="2026-07-01" includeTime onChange={onChange} />,
    );

    await user.click(getTrigger());
    await user.click(getDayCell(15));

    expect(onChange).toHaveBeenCalledExactlyOnceWith('2026-07-15T00:00:00.000Z');
  });

  it('does not change a controlled value on its own after selecting a day', async () => {
    const user = userEvent.setup();
    render(<DatePicker aria-label="Date" value="2026-07-01" />);

    await user.click(getTrigger());
    await user.click(getDayCell(15));

    expect(getTrigger()).toHaveValue('2026-07-01');
  });

  it('starts from defaultValue when left uncontrolled', () => {
    render(<DatePicker aria-label="Date" defaultValue="2026-07-01" />);

    expect(getTrigger()).toHaveValue('2026-07-01');
  });

  it('closes the panel after a day is selected', async () => {
    const user = userEvent.setup();
    render(<DatePicker aria-label="Date" defaultValue="2026-07-01" />);

    await user.click(getTrigger());
    await user.click(getDayCell(15));

    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<DatePicker aria-label="Date" />);

    await user.click(getTrigger());
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    expect(getTrigger()).toHaveFocus();
  });

  it('closes when clicking outside the panel', async () => {
    const user = userEvent.setup();
    render(<DatePicker aria-label="Date" />);

    await user.click(getTrigger());
    await user.click(document.body);

    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  it('applies error styling and sets aria-invalid when hasError is true', () => {
    render(<DatePicker aria-label="Date" hasError />);

    expect(getTrigger()).toHaveAttribute('aria-invalid', 'true');
    expect(getTrigger().className).toContain('snc:border-snc-error-border');
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    render(<DatePicker aria-label="Date" disabled />);

    expect(getTrigger()).toBeDisabled();

    await user.click(getTrigger());

    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  it('forwards minYear/maxYear through to the rendered year options', async () => {
    const user = userEvent.setup();
    render(<DatePicker aria-label="Date" minYear={2020} maxYear={2022} />);

    await user.click(getTrigger());
    await user.click(screen.getByRole('combobox', { name: 'Year' }));

    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      '2020',
      '2021',
      '2022',
    ]);
  });

  it('mirrors the selection into a hidden input when a name is supplied', () => {
    const { container } = render(
      <DatePicker aria-label="Date" name="startDate" defaultValue="2026-07-15" />,
    );

    expect(container.querySelector('input[type="hidden"]')).toHaveValue('2026-07-15');
    expect(container.querySelector('input[type="hidden"]')).toHaveAttribute('name', 'startDate');
  });

  it('forwards a callback ref to the trigger input', () => {
    const ref = vi.fn();
    render(<DatePicker aria-label="Date" ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });

  it('forwards an object ref to the trigger input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<DatePicker aria-label="Date" ref={ref} />);

    expect(ref.current).toBe(getTrigger());
  });

  it('merges a consumer-supplied className onto the wrapper', () => {
    const { container } = render(<DatePicker aria-label="Date" className="custom-class" />);

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('renders no label element when label is omitted', () => {
    render(<DatePicker aria-label="Date" />);

    expect(screen.queryByText('Date', { selector: 'label' })).not.toBeInTheDocument();
  });

  it('renders the accessible name from the label prop', () => {
    render(<DatePicker label="Date" />);

    expect(screen.getByRole('combobox', { name: 'Date' })).toBeInTheDocument();
  });
});
