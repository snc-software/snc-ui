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

const getSelect = () => screen.getByRole('combobox', { name: 'Filter by status' });

describe('TableDropdownFilterMenu', () => {
  it('renders a labelled select rather than a bare option list', () => {
    renderMenu();

    expect(getSelect()).toBeInTheDocument();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('renders the same Search, Clear and Cancel actions as the input menu', () => {
    renderMenu();

    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('omits the clear action when isClearable is false', () => {
    renderMenu({ isClearable: false });

    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('renders an option per supplied option', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(getSelect());

    expect(screen.getAllByRole('option')).toHaveLength(2);
  });

  it('disables Search until an option is chosen', async () => {
    const user = userEvent.setup();
    renderMenu();

    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();

    await user.click(getSelect());
    await user.click(screen.getByRole('option', { name: 'Active' }));

    expect(screen.getByRole('button', { name: 'Search' })).toBeEnabled();
  });

  it('does not apply the filter until Search is pressed', async () => {
    const user = userEvent.setup();
    const props = renderMenu();

    await user.click(getSelect());
    await user.click(screen.getByRole('option', { name: 'Active' }));

    expect(props.onFiltersSet).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(props.onFiltersSet).toHaveBeenCalledWith([
      { id: 'status', title: 'Status', text: 'Active', value: 'active' },
    ]);
  });

  it('closes after applying the filter', async () => {
    const user = userEvent.setup();
    const props = renderMenu();

    await user.click(getSelect());
    await user.click(screen.getByRole('option', { name: 'Active' }));
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('seeds the select from the active filter', () => {
    renderMenu({ filters: [{ id: 'status', title: 'Status', value: 'active' }] });

    expect(getSelect()).toHaveTextContent('Active');
  });

  it('clears the active filter and resets the select without closing', async () => {
    const user = userEvent.setup();
    const props = renderMenu({ filters: [{ id: 'status', title: 'Status', value: 'active' }] });

    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(props.onFiltersCleared).toHaveBeenCalledWith(['status']);
    expect(getSelect()).toHaveTextContent('Select status');
    expect(props.onClose).not.toHaveBeenCalled();
  });

  it('clears an unsubmitted choice without reporting a filter change', async () => {
    const user = userEvent.setup();
    const props = renderMenu();

    await user.click(getSelect());
    await user.click(screen.getByRole('option', { name: 'Active' }));
    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(getSelect()).toHaveTextContent('Select status');
    expect(props.onFiltersCleared).not.toHaveBeenCalled();
  });

  it('closes without applying anything when Cancel is pressed', async () => {
    const user = userEvent.setup();
    const props = renderMenu();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(props.onClose).toHaveBeenCalledTimes(1);
    expect(props.onFiltersSet).not.toHaveBeenCalled();
  });
});
