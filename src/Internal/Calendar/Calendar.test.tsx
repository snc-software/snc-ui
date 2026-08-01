import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { buildMonthGrid } from '@/Utils/calendarGrid';

import Calendar from './Calendar';

const getGrid = () => screen.getByRole('grid');
const getDayCells = () => within(getGrid()).getAllByRole('gridcell');
const getDayCell = (day: number) => screen.getByRole('gridcell', { name: String(day) });
const getMonthSelect = () => screen.getByRole('combobox', { name: 'Month' });
const getYearSelect = () => screen.getByRole('combobox', { name: 'Year' });
const getPreviousMonthButton = () => screen.getByRole('button', { name: 'Previous month' });
const getNextMonthButton = () => screen.getByRole('button', { name: 'Next month' });

describe('Calendar', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders two-letter weekday headers, Monday through Sunday, labelled with the full day name', () => {
    render(<Calendar onSelect={vi.fn()} selectedDate={new Date(2026, 6, 15)} />);

    const headers = screen.getAllByLabelText(
      /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/,
    );

    expect(headers.map((header) => header.getAttribute('aria-label'))).toEqual([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]);
    expect(headers.map((header) => header.textContent)).toEqual([
      'Mo',
      'Tu',
      'We',
      'Th',
      'Fr',
      'Sa',
      'Su',
    ]);
  });

  it('always renders a fixed 6-row grid, with 7 cells per row, regardless of month length', () => {
    render(<Calendar onSelect={vi.fn()} selectedDate={new Date(2026, 1, 1)} />);

    const rows = within(getGrid()).getAllByRole('row');

    expect(rows).toHaveLength(6);
    rows.forEach((row) => expect(row.children).toHaveLength(7));
  });

  it('renders only the requested month as selectable cells, with blank inert placeholders for adjacent-month days', () => {
    render(<Calendar onSelect={vi.fn()} selectedDate={new Date(2026, 6, 15)} />);

    const grid = buildMonthGrid(2026, 6);
    const currentCount = grid.filter((day) => day.origin === 'current').length;

    expect(getDayCells()).toHaveLength(currentCount);

    const rows = within(getGrid()).getAllByRole('row');
    const blankCells = rows
      .flatMap((row) => Array.from(row.children))
      .filter((cell) => cell.getAttribute('role') !== 'gridcell');

    expect(blankCells).toHaveLength(42 - currentCount);
    blankCells.forEach((cell) => {
      expect(cell).toHaveAttribute('aria-hidden', 'true');
      expect(cell).toHaveTextContent('');
    });
  });

  it('initially displays the month/year of selectedDate when supplied', () => {
    render(<Calendar onSelect={vi.fn()} selectedDate={new Date(2020, 2, 10)} />);

    expect(getMonthSelect()).toHaveTextContent('March');
    expect(getYearSelect()).toHaveTextContent('2020');
  });

  it('initially displays the current month/year when selectedDate is not supplied', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 15));

    render(<Calendar onSelect={vi.fn()} />);

    expect(getMonthSelect()).toHaveTextContent('July');
    expect(getYearSelect()).toHaveTextContent('2026');
  });

  it('marks the selected day cell as selected', () => {
    render(<Calendar onSelect={vi.fn()} selectedDate={new Date(2026, 6, 15)} />);

    expect(getDayCell(15)).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onSelect with the correct Date when a day cell in the displayed month is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Calendar onSelect={onSelect} selectedDate={new Date(2026, 6, 1)} />);

    await user.click(getDayCell(20));

    expect(onSelect).toHaveBeenCalledExactlyOnceWith(new Date(2026, 6, 20));
  });

  it('moves to the previous month, rolling the year back at a January boundary', async () => {
    const user = userEvent.setup();
    render(<Calendar onSelect={vi.fn()} selectedDate={new Date(2026, 0, 15)} />);

    await user.click(getPreviousMonthButton());

    expect(getMonthSelect()).toHaveTextContent('December');
    expect(getYearSelect()).toHaveTextContent('2025');
  });

  it('moves to the next month, rolling the year forward at a December boundary', async () => {
    const user = userEvent.setup();
    render(<Calendar onSelect={vi.fn()} selectedDate={new Date(2026, 11, 15)} />);

    await user.click(getNextMonthButton());

    expect(getMonthSelect()).toHaveTextContent('January');
    expect(getYearSelect()).toHaveTextContent('2027');
  });

  it("disables the Previous month button and blocks navigation before minYear's January", async () => {
    const user = userEvent.setup();
    render(
      <Calendar
        onSelect={vi.fn()}
        selectedDate={new Date(2020, 0, 15)}
        minYear={2020}
        maxYear={2025}
      />,
    );

    expect(getPreviousMonthButton()).toBeDisabled();

    await user.click(getPreviousMonthButton());

    expect(getMonthSelect()).toHaveTextContent('January');
    expect(getYearSelect()).toHaveTextContent('2020');
  });

  it("disables the Next month button and blocks navigation past maxYear's December", async () => {
    const user = userEvent.setup();
    render(
      <Calendar
        onSelect={vi.fn()}
        selectedDate={new Date(2025, 11, 15)}
        minYear={2020}
        maxYear={2025}
      />,
    );

    expect(getNextMonthButton()).toBeDisabled();

    await user.click(getNextMonthButton());

    expect(getMonthSelect()).toHaveTextContent('December');
    expect(getYearSelect()).toHaveTextContent('2025');
  });

  it('re-enables the Previous/Next month buttons once navigated away from a year-range boundary', async () => {
    render(
      <Calendar
        onSelect={vi.fn()}
        selectedDate={new Date(2022, 5, 15)}
        minYear={2020}
        maxYear={2025}
      />,
    );

    expect(getPreviousMonthButton()).toBeEnabled();
    expect(getNextMonthButton()).toBeEnabled();
  });

  it('jumps to the chosen month when the month Select changes, without altering the selection', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Calendar onSelect={onSelect} selectedDate={new Date(2026, 6, 15)} />);

    await user.click(getMonthSelect());
    await user.click(screen.getByRole('option', { name: 'March' }));

    expect(getMonthSelect()).toHaveTextContent('March');
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('jumps to the chosen year when the year Select changes, without altering the selection', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Calendar onSelect={onSelect} selectedDate={new Date(2026, 6, 15)} />);

    await user.click(getYearSelect());
    await user.click(screen.getByRole('option', { name: '2020' }));

    expect(getYearSelect()).toHaveTextContent('2020');
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("bounds the year Select's options to an explicit minYear/maxYear", async () => {
    const user = userEvent.setup();
    render(
      <Calendar
        onSelect={vi.fn()}
        selectedDate={new Date(2026, 6, 15)}
        minYear={2020}
        maxYear={2022}
      />,
    );

    await user.click(getYearSelect());

    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      '2020',
      '2021',
      '2022',
    ]);
  });

  it('defaults the year range to current year - 20 / + 10 when minYear/maxYear are omitted', async () => {
    const user = userEvent.setup();
    const currentYear = new Date().getFullYear();

    render(<Calendar onSelect={vi.fn()} />);

    await user.click(getYearSelect());

    const options = screen.getAllByRole('option').map((option) => option.textContent);

    expect(options[0]).toBe(String(currentYear - 20));
    expect(options.at(-1)).toBe(String(currentYear + 10));
    expect(options).toHaveLength(31);
  });

  it('supports arrow-key navigation between day cells within the current month', async () => {
    const user = userEvent.setup();
    render(<Calendar onSelect={vi.fn()} selectedDate={new Date(2026, 6, 1)} />);

    getDayCell(1).focus();

    await user.keyboard('{ArrowRight}');
    expect(getDayCell(2)).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(getDayCell(9)).toHaveFocus();
  });

  it('selects the focused day cell with Enter', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Calendar onSelect={onSelect} selectedDate={new Date(2026, 6, 1)} />);

    getDayCell(10).focus();
    await user.keyboard('{Enter}');

    expect(onSelect).toHaveBeenCalledExactlyOnceWith(new Date(2026, 6, 10));
  });

  it('selects the focused day cell with Space', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Calendar onSelect={onSelect} selectedDate={new Date(2026, 6, 1)} />);

    getDayCell(10).focus();
    await user.keyboard(' ');

    expect(onSelect).toHaveBeenCalledExactlyOnceWith(new Date(2026, 6, 10));
  });

  it('gives the navigation pane a primary-coloured background', () => {
    render(<Calendar onSelect={vi.fn()} selectedDate={new Date(2026, 6, 15)} />);

    expect(getPreviousMonthButton().parentElement?.className).toContain('snc:bg-snc-primary');
  });
});
