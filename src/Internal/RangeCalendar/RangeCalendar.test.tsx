import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import RangeCalendar from './RangeCalendar';

const getGrids = () => screen.getAllByRole('grid');

const getDayCell = (grid: HTMLElement, day: number) =>
  within(grid)
    .getAllByRole('gridcell')
    .find((cell) => cell.textContent === String(day)) as HTMLElement;

const hasClass = (element: HTMLElement, className: string) =>
  element.className.split(/\s+/).includes(className);

describe('RangeCalendar', () => {
  it('renders two month grids labelled with consecutive months by default', () => {
    render(<RangeCalendar rangeStart={new Date(2026, 6, 1)} onSelect={vi.fn()} />);

    const grids = getGrids();

    expect(grids).toHaveLength(2);
    expect(grids[0]).toHaveAttribute('aria-label', 'July 2026');
    expect(grids[1]).toHaveAttribute('aria-label', 'August 2026');
  });

  it('calls onSelect with the clicked date when a day cell in either month is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<RangeCalendar rangeStart={new Date(2026, 6, 1)} onSelect={onSelect} />);

    const [leftGrid, rightGrid] = getGrids();

    await user.click(getDayCell(leftGrid, 15));
    expect(onSelect).toHaveBeenLastCalledWith(new Date(2026, 6, 15));

    await user.click(getDayCell(rightGrid, 10));
    expect(onSelect).toHaveBeenLastCalledWith(new Date(2026, 7, 10));
  });

  it('highlights the rangeStart and rangeEnd cells with a solid boundary fill, not the subtle trail fill', () => {
    render(
      <RangeCalendar
        rangeStart={new Date(2026, 6, 5)}
        rangeEnd={new Date(2026, 6, 10)}
        onSelect={vi.fn()}
      />,
    );

    const [leftGrid] = getGrids();
    const startCell = getDayCell(leftGrid, 5);
    const endCell = getDayCell(leftGrid, 10);

    expect(hasClass(startCell, 'snc:bg-snc-primary')).toBe(true);
    expect(hasClass(startCell, 'snc:bg-snc-primary-subtle-bg')).toBe(false);
    expect(startCell.className).toContain('snc:rounded-l-full');

    expect(hasClass(endCell, 'snc:bg-snc-primary')).toBe(true);
    expect(hasClass(endCell, 'snc:bg-snc-primary-subtle-bg')).toBe(false);
    expect(endCell.className).toContain('snc:rounded-r-full');
  });

  it('highlights the days strictly between rangeStart and rangeEnd with only the subtle trail fill', () => {
    render(
      <RangeCalendar
        rangeStart={new Date(2026, 6, 5)}
        rangeEnd={new Date(2026, 6, 10)}
        onSelect={vi.fn()}
      />,
    );

    const [leftGrid] = getGrids();
    const betweenCell = getDayCell(leftGrid, 7);

    expect(hasClass(betweenCell, 'snc:bg-snc-primary-subtle-bg')).toBe(true);
    expect(hasClass(betweenCell, 'snc:bg-snc-primary')).toBe(false);
  });

  it('previews the range between rangeStart and a hovered day when rangeEnd is not yet set', async () => {
    const user = userEvent.setup();
    render(<RangeCalendar rangeStart={new Date(2026, 6, 5)} onSelect={vi.fn()} />);

    const [leftGrid] = getGrids();

    await user.hover(getDayCell(leftGrid, 10));

    expect(hasClass(getDayCell(leftGrid, 7), 'snc:bg-snc-primary-subtle-bg')).toBe(true);
    expect(getDayCell(leftGrid, 10).className).toContain('snc:rounded-r-full');
  });

  it('clears the hover preview on mouse leave', async () => {
    const user = userEvent.setup();
    render(<RangeCalendar rangeStart={new Date(2026, 6, 5)} onSelect={vi.fn()} />);

    const [leftGrid] = getGrids();

    await user.hover(getDayCell(leftGrid, 10));
    await user.unhover(getDayCell(leftGrid, 10));

    expect(hasClass(getDayCell(leftGrid, 7), 'snc:bg-snc-primary-subtle-bg')).toBe(false);
  });

  it('seeds the left and right panels directly from rangeStart/rangeEnd, even when they are several months apart', () => {
    render(
      <RangeCalendar
        rangeStart={new Date(2026, 7, 1)}
        rangeEnd={new Date(2026, 10, 30)}
        onSelect={vi.fn()}
      />,
    );

    const grids = getGrids();

    expect(grids[0]).toHaveAttribute('aria-label', 'August 2026');
    expect(grids[1]).toHaveAttribute('aria-label', 'November 2026');
    expect(hasClass(getDayCell(grids[0], 1), 'snc:bg-snc-primary')).toBe(true);
    expect(hasClass(getDayCell(grids[1], 30), 'snc:bg-snc-primary')).toBe(true);
  });

  it('renders independent month/year Select controls for the left and right panels, each labelled distinctly', () => {
    render(<RangeCalendar rangeStart={new Date(2026, 6, 1)} onSelect={vi.fn()} />);

    expect(screen.getByRole('combobox', { name: 'Month (left)' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Year (left)' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Month (right)' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Year (right)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous month (left)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next month (left)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous month (right)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next month (right)' })).toBeInTheDocument();
  });

  it('pushes the right panel forward to stay ahead when the left month Select jumps past it', async () => {
    const user = userEvent.setup();
    render(<RangeCalendar rangeStart={new Date(2026, 6, 1)} onSelect={vi.fn()} />);

    await user.click(screen.getByRole('combobox', { name: 'Month (left)' }));
    await user.click(screen.getByRole('option', { name: 'December' }));

    const grids = getGrids();

    expect(grids[0]).toHaveAttribute('aria-label', 'December 2026');
    expect(grids[1]).toHaveAttribute('aria-label', 'January 2027');
  });

  it('pushes the left panel back to stay behind when the right month Select jumps before it', async () => {
    const user = userEvent.setup();
    render(<RangeCalendar rangeStart={new Date(2026, 6, 1)} onSelect={vi.fn()} />);

    await user.click(screen.getByRole('combobox', { name: 'Month (right)' }));
    await user.click(screen.getByRole('option', { name: 'January' }));

    const grids = getGrids();

    expect(grids[0]).toHaveAttribute('aria-label', 'December 2025');
    expect(grids[1]).toHaveAttribute('aria-label', 'January 2026');
  });

  it("disables the left panel's Next button one month short of maxYear, regardless of the right panel", () => {
    render(
      <RangeCalendar
        rangeStart={new Date(2026, 10, 1)}
        onSelect={vi.fn()}
        minYear={2026}
        maxYear={2026}
      />,
    );

    expect(screen.getByRole('button', { name: 'Next month (left)' })).toBeDisabled();
  });

  it("disables the right panel's Previous button one month past minYear, regardless of the left panel", () => {
    render(
      <RangeCalendar
        rangeStart={new Date(2026, 0, 1)}
        onSelect={vi.fn()}
        minYear={2026}
        maxYear={2026}
      />,
    );

    expect(screen.getByRole('button', { name: 'Previous month (right)' })).toBeDisabled();
  });

  it('moves the left panel back by one when its Previous button is clicked', async () => {
    const user = userEvent.setup();
    render(<RangeCalendar rangeStart={new Date(2026, 6, 1)} onSelect={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Previous month (left)' }));

    expect(getGrids()[0]).toHaveAttribute('aria-label', 'June 2026');
  });

  it('moves the right panel forward by one when its Next button is clicked', async () => {
    const user = userEvent.setup();
    render(<RangeCalendar rangeStart={new Date(2026, 6, 1)} onSelect={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Next month (right)' }));

    expect(getGrids()[1]).toHaveAttribute('aria-label', 'September 2026');
  });

  it("keeps arrow-key day navigation within a single month's grid", async () => {
    const user = userEvent.setup();
    render(<RangeCalendar rangeStart={new Date(2026, 6, 1)} onSelect={vi.fn()} />);

    const [leftGrid] = getGrids();
    const firstDay = getDayCell(leftGrid, 1);

    firstDay.focus();
    await user.keyboard('{ArrowLeft}');

    expect(firstDay).toHaveFocus();
  });
});
