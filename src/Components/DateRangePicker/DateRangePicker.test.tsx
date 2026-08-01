import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import DateRangePicker from './DateRangePicker';

const getTrigger = () => screen.getByRole('combobox', { name: 'Date range' });
const getGrids = () => screen.getAllByRole('grid');

const getDayCell = (grid: HTMLElement, day: number) =>
  within(grid)
    .getAllByRole('gridcell')
    .find((cell) => cell.textContent === String(day)) as HTMLElement;

// The Popout panel is the portalled element itself — walk up from a grid to the node whose parent is
// document.body, since neither Popout nor RangeCalendar exposes a dedicated test id.
function getPanel(): HTMLElement {
  let node: HTMLElement | null = getGrids()[0];

  while (node && node.parentElement !== document.body) {
    node = node.parentElement;
  }

  return node as HTMLElement;
}

describe('DateRangePicker', () => {
  it('renders a collapsed trigger input with no calendar panel visible', () => {
    render(<DateRangePicker aria-label="Date range" />);

    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  it('shows the placeholder when nothing is selected', () => {
    render(<DateRangePicker aria-label="Date range" placeholder="Choose a date range" />);

    expect(getTrigger()).toHaveAttribute('placeholder', 'Choose a date range');
  });

  it('opens the calendar panel when the input is clicked', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker aria-label="Date range" />);

    await user.click(getTrigger());

    expect(getGrids()).toHaveLength(2);
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
  });

  it('opens the calendar panel when the calendar icon button is clicked', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker aria-label="Date range" />);

    await user.click(screen.getByRole('button', { name: 'Open calendar' }));

    expect(getGrids()).toHaveLength(2);
  });

  it('opens the calendar panel with ArrowDown on a focused trigger', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker aria-label="Date range" />);

    getTrigger().focus();
    await user.keyboard('{ArrowDown}');

    expect(getGrids()).toHaveLength(2);
  });

  it('displays the formatted range in the trigger once both dates are picked', async () => {
    const user = userEvent.setup();
    render(
      <DateRangePicker
        aria-label="Date range"
        defaultValue={{ start: '2026-07-01', end: '2026-07-01' }}
      />,
    );

    await user.click(getTrigger());
    const [leftGrid] = getGrids();

    await user.click(getDayCell(leftGrid, 5));
    await user.click(getDayCell(leftGrid, 15));

    expect(getTrigger()).toHaveValue('2026-07-05 – 2026-07-15');
  });

  it('calls onChange with plain yyyy-MM-dd start/end strings by default', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DateRangePicker
        aria-label="Date range"
        defaultValue={{ start: '2026-07-01', end: '2026-07-01' }}
        onChange={onChange}
      />,
    );

    await user.click(getTrigger());
    const [leftGrid] = getGrids();

    await user.click(getDayCell(leftGrid, 5));
    await user.click(getDayCell(leftGrid, 15));

    expect(onChange).toHaveBeenCalledExactlyOnceWith({ start: '2026-07-05', end: '2026-07-15' });
  });

  it('calls onChange with a UTC-midnight start and a UTC 23:59:59 end when includeTime is true', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DateRangePicker
        aria-label="Date range"
        defaultValue={{ start: '2026-07-01', end: '2026-07-01' }}
        includeTime
        onChange={onChange}
      />,
    );

    await user.click(getTrigger());
    const [leftGrid] = getGrids();

    await user.click(getDayCell(leftGrid, 5));
    await user.click(getDayCell(leftGrid, 15));

    expect(onChange).toHaveBeenCalledExactlyOnceWith({
      start: '2026-07-05T00:00:00.000Z',
      end: '2026-07-15T23:59:59.000Z',
    });
  });

  it('does not call onChange after only the first day is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DateRangePicker
        aria-label="Date range"
        defaultValue={{ start: '2026-07-01', end: '2026-07-01' }}
        onChange={onChange}
      />,
    );

    await user.click(getTrigger());
    const [leftGrid] = getGrids();

    await user.click(getDayCell(leftGrid, 5));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('completes and commits a range whose start and end are more than one calendar month apart', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DateRangePicker
        aria-label="Date range"
        defaultValue={{ start: '2026-08-01', end: '2026-08-01' }}
        onChange={onChange}
      />,
    );

    await user.click(getTrigger());
    const [leftGrid] = getGrids();

    await user.click(getDayCell(leftGrid, 1));

    const nextRightButton = screen.getByRole('button', { name: 'Next month (right)' });
    await user.click(nextRightButton);
    await user.click(nextRightButton);

    const rightGrid = getGrids()[1];
    expect(rightGrid).toHaveAttribute('aria-label', 'November 2026');

    await user.click(getDayCell(rightGrid, 30));

    expect(onChange).toHaveBeenCalledExactlyOnceWith({ start: '2026-08-01', end: '2026-11-30' });
  });

  it('restarts the selection (new pending start, stays open, no onChange) when a click lands before the current pending start', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DateRangePicker
        aria-label="Date range"
        defaultValue={{ start: '2026-07-01', end: '2026-07-01' }}
        onChange={onChange}
      />,
    );

    await user.click(getTrigger());
    const [leftGrid] = getGrids();

    await user.click(getDayCell(leftGrid, 15));
    await user.click(getDayCell(leftGrid, 5));

    expect(onChange).not.toHaveBeenCalled();
    expect(getGrids()).toHaveLength(2);

    await user.click(getDayCell(leftGrid, 20));

    expect(onChange).toHaveBeenCalledExactlyOnceWith({ start: '2026-07-05', end: '2026-07-20' });
  });

  it('does not change a controlled value on its own after selecting a range', async () => {
    const user = userEvent.setup();
    render(
      <DateRangePicker
        aria-label="Date range"
        value={{ start: '2026-07-01', end: '2026-07-10' }}
      />,
    );

    await user.click(getTrigger());
    const [leftGrid] = getGrids();

    await user.click(getDayCell(leftGrid, 5));
    await user.click(getDayCell(leftGrid, 15));

    expect(getTrigger()).toHaveValue('2026-07-01 – 2026-07-10');
  });

  it('starts from defaultValue when left uncontrolled', () => {
    render(
      <DateRangePicker
        aria-label="Date range"
        defaultValue={{ start: '2026-07-01', end: '2026-07-10' }}
      />,
    );

    expect(getTrigger()).toHaveValue('2026-07-01 – 2026-07-10');
  });

  it('closes the panel once the second click completes the range', async () => {
    const user = userEvent.setup();
    render(
      <DateRangePicker
        aria-label="Date range"
        defaultValue={{ start: '2026-07-01', end: '2026-07-01' }}
      />,
    );

    await user.click(getTrigger());
    const [leftGrid] = getGrids();

    await user.click(getDayCell(leftGrid, 5));
    await user.click(getDayCell(leftGrid, 15));

    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  it('discards an in-progress (start-only) selection on Escape without calling onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DateRangePicker
        aria-label="Date range"
        defaultValue={{ start: '2026-07-01', end: '2026-07-01' }}
        onChange={onChange}
      />,
    );

    await user.click(getTrigger());
    const [leftGrid] = getGrids();

    await user.click(getDayCell(leftGrid, 5));
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker aria-label="Date range" />);

    await user.click(getTrigger());
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    expect(getTrigger()).toHaveFocus();
  });

  it('closes when clicking outside the panel', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker aria-label="Date range" />);

    await user.click(getTrigger());
    await user.click(document.body);

    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  it('applies error styling and sets aria-invalid when hasError is true', () => {
    render(<DateRangePicker aria-label="Date range" hasError />);

    expect(getTrigger()).toHaveAttribute('aria-invalid', 'true');
    expect(getTrigger().className).toContain('snc:border-snc-error-border');
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker aria-label="Date range" disabled />);

    expect(getTrigger()).toBeDisabled();

    await user.click(getTrigger());

    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  it('forwards minYear/maxYear through to the rendered calendars', async () => {
    const user = userEvent.setup();
    render(
      <DateRangePicker
        aria-label="Date range"
        defaultValue={{ start: '2020-01-01', end: '2020-01-01' }}
        minYear={2020}
        maxYear={2022}
      />,
    );

    await user.click(getTrigger());

    expect(screen.getByRole('button', { name: 'Previous month (left)' })).toBeDisabled();
  });

  it('mirrors the committed range into ${name}Start/${name}End hidden inputs when name is supplied', () => {
    const { container } = render(
      <DateRangePicker
        aria-label="Date range"
        name="range"
        defaultValue={{ start: '2026-07-01', end: '2026-07-15' }}
      />,
    );

    const startInput = container.querySelector('input[name="rangeStart"]');
    const endInput = container.querySelector('input[name="rangeEnd"]');

    expect(startInput).toHaveValue('2026-07-01');
    expect(endInput).toHaveValue('2026-07-15');
  });

  it('forwards a callback ref to the trigger input', () => {
    const ref = vi.fn();
    render(<DateRangePicker aria-label="Date range" ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });

  it('forwards an object ref to the trigger input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<DateRangePicker aria-label="Date range" ref={ref} />);

    expect(ref.current).toBe(getTrigger());
  });

  it('merges a consumer-supplied className onto the wrapper', () => {
    const { container } = render(
      <DateRangePicker aria-label="Date range" className="custom-class" />,
    );

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('renders no label element when label is omitted', () => {
    render(<DateRangePicker aria-label="Date range" />);

    expect(screen.queryByText('Date range', { selector: 'label' })).not.toBeInTheDocument();
  });

  it('renders the accessible name from the label prop', () => {
    render(<DateRangePicker label="Date range" />);

    expect(screen.getByRole('combobox', { name: 'Date range' })).toBeInTheDocument();
  });

  it('aligns the calendar panel to the left edge by default', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker aria-label="Date range" />);

    await user.click(getTrigger());

    expect(getPanel().style.left).not.toBe('');
    expect(getPanel().style.right).toBe('');
  });

  it('aligns the calendar panel to the right edge when align is "right"', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker aria-label="Date range" align="right" />);

    await user.click(getTrigger());

    expect(getPanel().style.right).not.toBe('');
    expect(getPanel().style.left).toBe('');
  });
});
