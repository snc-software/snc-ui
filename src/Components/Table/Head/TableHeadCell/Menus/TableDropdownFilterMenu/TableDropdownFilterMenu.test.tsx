import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import TableDropdownFilterMenu from './TableDropdownFilterMenu';

import type { TableFilter } from '../../../../Table.types';

const options = [
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
];

function renderMenu(overrides: Partial<Parameters<typeof TableDropdownFilterMenu>[0]> = {}) {
  const props = {
    columnId: 'status',
    title: 'Status',
    options,
    filters: [] as TableFilter[],
    onClose: vi.fn(),
    onFiltersSet: vi.fn(),
    onFiltersCleared: vi.fn(),
    ...overrides,
  };

  render(<TableDropdownFilterMenu {...props} />);

  return props;
}

describe('TableDropdownFilterMenu', () => {
  it('renders a labelled listbox', () => {
    renderMenu();

    expect(screen.getByRole('listbox', { name: 'Filter by status' })).toBeInTheDocument();
  });

  it('renders an option per supplied option plus the clear option', () => {
    renderMenu();

    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('omits the clear option when isClearable is false', () => {
    renderMenu({ isClearable: false });

    expect(screen.getAllByRole('option')).toHaveLength(2);
  });

  it('applies the filter when an option is selected', async () => {
    const user = userEvent.setup();
    const props = renderMenu();

    await user.click(screen.getByRole('option', { name: 'Active' }));

    expect(props.onFiltersSet).toHaveBeenCalledWith([
      { id: 'status', title: 'Status', text: 'Active', value: 'active' },
    ]);
  });

  it('closes after applying the filter', async () => {
    const user = userEvent.setup();
    const props = renderMenu();

    await user.click(screen.getByRole('option', { name: 'Active' }));

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('marks the active filter option as selected', () => {
    renderMenu({ filters: [{ id: 'status', title: 'Status', value: 'active' }] });

    expect(screen.getByRole('option', { name: 'Active' })).toHaveAttribute('aria-selected', 'true');
  });

  it('marks the clear option as selected when no filter is active', () => {
    renderMenu();

    expect(screen.getByRole('option', { name: 'All' })).toHaveAttribute('aria-selected', 'true');
  });

  it('clears the filter when the clear option is selected', async () => {
    const user = userEvent.setup();
    const props = renderMenu({ filters: [{ id: 'status', title: 'Status', value: 'active' }] });

    await user.click(screen.getByRole('option', { name: 'All' }));

    expect(props.onFiltersCleared).toHaveBeenCalledWith(['status']);
  });

  it('selects the focused option with Enter', async () => {
    const user = userEvent.setup();
    const props = renderMenu({ isClearable: false });

    await user.tab();
    await user.keyboard('{Enter}');

    expect(props.onFiltersSet).toHaveBeenCalledWith([
      { id: 'status', title: 'Status', text: 'Active', value: 'active' },
    ]);
  });

  it('moves focus to the next option with ArrowDown', async () => {
    const user = userEvent.setup();
    renderMenu({ isClearable: false });

    await user.tab();
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('option', { name: 'Archived' })).toHaveFocus();
  });

  it('moves focus to the previous option with ArrowUp', async () => {
    const user = userEvent.setup();
    renderMenu({ isClearable: false });

    await user.tab();
    await user.keyboard('{ArrowDown}{ArrowUp}');

    expect(screen.getByRole('option', { name: 'Active' })).toHaveFocus();
  });

  it('wraps focus from the last option back to the first', async () => {
    const user = userEvent.setup();
    renderMenu({ isClearable: false });

    await user.tab();
    await user.keyboard('{ArrowDown}{ArrowDown}');

    expect(screen.getByRole('option', { name: 'Active' })).toHaveFocus();
  });
});
