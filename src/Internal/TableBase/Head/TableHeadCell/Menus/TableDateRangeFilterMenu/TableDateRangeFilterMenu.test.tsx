import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import TableDateRangeFilterMenu from './TableDateRangeFilterMenu';

import type { TableFilter } from '../../../../TableBase.types';

function renderMenu(overrides: Partial<Parameters<typeof TableDateRangeFilterMenu>[0]> = {}) {
  const props = {
    columnId: 'updated',
    title: 'Updated',
    filters: [] as TableFilter[],
    onClose: vi.fn(),
    onFiltersSet: vi.fn(),
    onFiltersCleared: vi.fn(),
    ...overrides,
  };

  render(<TableDateRangeFilterMenu {...props} />);

  return props;
}

const getTrigger = () => screen.getByRole('combobox', { name: 'Filter by updated' });

function getDayCell(grid: HTMLElement, day: number) {
  return within(grid)
    .getAllByRole('gridcell')
    .find((cell) => cell.textContent === String(day)) as HTMLElement;
}

async function pickRange(
  user: ReturnType<typeof userEvent.setup>,
  startDay: number,
  endDay: number,
) {
  await user.click(getTrigger());

  const [leftGrid] = screen.getAllByRole('grid');
  await user.click(getDayCell(leftGrid, startDay));
  await user.click(getDayCell(leftGrid, endDay));
}

describe('TableDateRangeFilterMenu', () => {
  it('renders a labelled date range picker', () => {
    renderMenu();

    expect(getTrigger()).toBeInTheDocument();
  });

  it('renders the same Search, Clear and Cancel actions as the other menus', () => {
    renderMenu();

    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('disables Search until a complete range is picked', async () => {
    const user = userEvent.setup();
    renderMenu();

    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();

    await pickRange(user, 5, 15);

    expect(screen.getByRole('button', { name: 'Search' })).toBeEnabled();
  });

  it('applies the filter and calls onFiltersSet when Search is activated', async () => {
    const user = userEvent.setup();
    const props = renderMenu();

    await pickRange(user, 5, 15);
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(props.onFiltersSet).toHaveBeenCalledExactlyOnceWith([
      {
        id: 'updated',
        title: 'Updated',
        text: expect.any(String),
        value: { start: expect.any(String), end: expect.any(String) },
      },
    ]);
  });

  it('closes after applying the filter', async () => {
    const user = userEvent.setup();
    const props = renderMenu();

    await pickRange(user, 5, 15);
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('seeds the picker from the active filter', () => {
    renderMenu({
      filters: [
        { id: 'updated', title: 'Updated', value: { start: '2026-07-05', end: '2026-07-15' } },
      ],
    });

    expect(getTrigger()).toHaveValue('2026-07-05 – 2026-07-15');
  });

  it('clears the active filter and calls onFiltersCleared with the column id', async () => {
    const user = userEvent.setup();
    const props = renderMenu({
      filters: [
        { id: 'updated', title: 'Updated', value: { start: '2026-07-05', end: '2026-07-15' } },
      ],
    });

    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(props.onFiltersCleared).toHaveBeenCalledWith(['updated']);
    expect(getTrigger()).toHaveValue('');
  });

  it('stays open after clearing', async () => {
    const user = userEvent.setup();
    const props = renderMenu({
      filters: [
        { id: 'updated', title: 'Updated', value: { start: '2026-07-05', end: '2026-07-15' } },
      ],
    });

    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(props.onClose).not.toHaveBeenCalled();
  });

  it('clears an unsubmitted range selection without reporting a filter change', async () => {
    const user = userEvent.setup();
    const props = renderMenu();

    await pickRange(user, 5, 15);
    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(getTrigger()).toHaveValue('');
    expect(props.onFiltersCleared).not.toHaveBeenCalled();
  });

  it('omits the clear action when isClearable is false', () => {
    renderMenu({ isClearable: false });

    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('closes without applying anything when Cancel is activated', async () => {
    const user = userEvent.setup();
    const props = renderMenu();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(props.onClose).toHaveBeenCalledTimes(1);
    expect(props.onFiltersSet).not.toHaveBeenCalled();
  });
});
