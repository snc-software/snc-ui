import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { createTableStore } from '@/States/useTableState';

import TableFilterPanel from './TableFilterPanel';

import type { TableFilter } from '../../Table.types';
import type { TableStore } from '@/States/useTableState';

type Row = { id: number };

const filters: TableFilter[] = [
  { id: 'name', title: 'Name', text: 'Ada', value: 'Ada' },
  { id: 'status', title: 'Status', text: 'Active', value: 'active' },
];

function createStore(initialFilters: TableFilter[] = filters) {
  return createTableStore<Row>({
    filters: initialFilters,
    pageSizeOptions: [20],
  });
}

function renderPanel(store: TableStore<Row> = createStore()) {
  render(<TableFilterPanel<Row> store={store} />);

  return store;
}

describe('TableFilterPanel', () => {
  it('renders one chip per active filter', () => {
    renderPanel();

    expect(screen.getByText('Name:')).toBeInTheDocument();
    expect(screen.getByText('Status:')).toBeInTheDocument();
  });

  it('renders the user-friendly filter text on the chip', () => {
    renderPanel();

    expect(screen.getByText('Ada')).toBeInTheDocument();
  });

  it('falls back to the raw value when no display text is supplied', () => {
    renderPanel(createStore([{ id: 'name', title: 'Name', value: 'Grace' }]));

    expect(screen.getByText('Grace')).toBeInTheDocument();
  });

  it('clears the targeted filter when a chip is cleared', async () => {
    const user = userEvent.setup();
    const store = renderPanel();

    await user.click(screen.getByRole('button', { name: 'Clear name filter' }));

    expect(store.getState().activeFilters).toEqual([filters[1]]);
  });

  it('clears every filter when Clear All is activated', async () => {
    const user = userEvent.setup();
    const store = renderPanel();

    await user.click(screen.getByRole('button', { name: 'Clear All' }));

    expect(store.getState().activeFilters).toEqual([]);
  });

  it('hides the scroll controls when the chips fit', () => {
    renderPanel();

    expect(screen.queryByRole('button', { name: 'Scroll filters left' })).not.toBeInTheDocument();
  });

  it('renders no chips when there are no filters', () => {
    renderPanel(createStore([]));

    expect(screen.queryByText('Name:')).not.toBeInTheDocument();
  });

  it('reflects filters applied directly on the store after the initial render', () => {
    const store = createStore([]);
    renderPanel(store);

    act(() => store.getState().applyFilters([filters[0]]));

    expect(screen.getByText('Name:')).toBeInTheDocument();
  });
});
