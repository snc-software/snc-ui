import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import TableDateFilterMenu from './TableDateFilterMenu';

import type { TableFilter } from '../../../../TableBase.types';

function renderMenu(overrides: Partial<Parameters<typeof TableDateFilterMenu>[0]> = {}) {
  const props = {
    columnId: 'updated',
    title: 'Updated',
    filters: [] as TableFilter[],
    onClose: vi.fn(),
    onFiltersSet: vi.fn(),
    onFiltersCleared: vi.fn(),
    ...overrides,
  };

  render(<TableDateFilterMenu {...props} />);

  return props;
}

const getTrigger = () => screen.getByRole('combobox', { name: 'Filter by updated' });

async function pickDay(user: ReturnType<typeof userEvent.setup>, day: number) {
  await user.click(getTrigger());

  const grid = screen.getByRole('grid');
  const dayCell = within(grid)
    .getAllByRole('gridcell')
    .find((cell) => cell.textContent === String(day)) as HTMLElement;

  await user.click(dayCell);
}

describe('TableDateFilterMenu', () => {
  it('renders a labelled date picker', () => {
    renderMenu();

    expect(getTrigger()).toBeInTheDocument();
  });

  it('pre-populates the picker from the active filter', () => {
    renderMenu({ filters: [{ id: 'updated', title: 'Updated', value: '2026-07-15' }] });

    expect(getTrigger()).toHaveValue('2026-07-15');
  });

  it('disables the search control while no date is picked', () => {
    renderMenu();

    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
  });

  it('applies the filter and calls onFiltersSet when Search is activated', async () => {
    const user = userEvent.setup();
    const props = renderMenu();

    await pickDay(user, 15);
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(props.onFiltersSet).toHaveBeenCalledExactlyOnceWith([
      { id: 'updated', title: 'Updated', text: expect.any(String), value: expect.any(String) },
    ]);
  });

  it('closes after applying the filter', async () => {
    const user = userEvent.setup();
    const props = renderMenu();

    await pickDay(user, 15);
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('disables the clear control when there is nothing to clear', () => {
    renderMenu();

    expect(screen.getByRole('button', { name: 'Clear' })).toBeDisabled();
  });

  it('enables the clear control once a date is picked', async () => {
    const user = userEvent.setup();
    renderMenu();

    await pickDay(user, 15);

    expect(screen.getByRole('button', { name: 'Clear' })).toBeEnabled();
  });

  it('clears the filter and calls onFiltersCleared with the column id', async () => {
    const user = userEvent.setup();
    const props = renderMenu({
      filters: [{ id: 'updated', title: 'Updated', value: '2026-07-15' }],
    });

    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(props.onFiltersCleared).toHaveBeenCalledWith(['updated']);
    expect(getTrigger()).toHaveValue('');
  });

  it('stays open after clearing', async () => {
    const user = userEvent.setup();
    const props = renderMenu({
      filters: [{ id: 'updated', title: 'Updated', value: '2026-07-15' }],
    });

    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(props.onClose).not.toHaveBeenCalled();
  });

  it('does not report a filter change when clearing a picked-but-unsearched date', async () => {
    const user = userEvent.setup();
    const props = renderMenu();

    await pickDay(user, 15);
    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(props.onFiltersCleared).not.toHaveBeenCalled();
  });

  it('hides the clear control when isClearable is false', () => {
    renderMenu({ isClearable: false });

    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('closes without changes when Cancel is activated', async () => {
    const user = userEvent.setup();
    const props = renderMenu();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(props.onClose).toHaveBeenCalledTimes(1);
    expect(props.onFiltersSet).not.toHaveBeenCalled();
  });
});
