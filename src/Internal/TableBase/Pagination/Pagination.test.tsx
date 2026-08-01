import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { createTableStore } from '@/States/useTableState';

import Pagination from './Pagination';

import type { TableStore } from '@/States/useTableState';

type Row = { id: number };

function createStore(page = 5, pageSize = 10) {
  const store = createTableStore<Row>({
    filters: [],
    initialPageSize: pageSize,
    pageSizeOptions: [pageSize],
  });
  act(() => store.getState().setPage(page));

  return store;
}

function renderPagination(overrides: Partial<{ store: TableStore<Row>; total: number }> = {}) {
  const props = {
    store: createStore(),
    total: 100,
    ...overrides,
  };

  render(<Pagination<Row> {...props} />);

  return props;
}

describe('Pagination', () => {
  it('renders nothing when there are no pages', () => {
    renderPagination({ total: 0 });

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('renders a labelled navigation landmark', () => {
    renderPagination();

    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });

  it('renders a control per page in the current window', () => {
    renderPagination();

    expect(screen.getByRole('button', { name: 'Go to page 3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 7' })).toBeInTheDocument();
  });

  it('marks the current page for assistive technology', () => {
    renderPagination();

    expect(screen.getByRole('button', { name: 'Go to page 5' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('sets the page on the store when a page number is selected', async () => {
    const user = userEvent.setup();
    const { store } = renderPagination();

    await user.click(screen.getByRole('button', { name: 'Go to page 6' }));

    expect(store.getState().page).toBe(6);
  });

  it('does not change the page when the current page is re-selected', async () => {
    const user = userEvent.setup();
    const { store } = renderPagination();

    await user.click(screen.getByRole('button', { name: 'Go to page 5' }));

    expect(store.getState().page).toBe(5);
  });

  it('moves to the first page via the jump control', async () => {
    const user = userEvent.setup();
    const { store } = renderPagination();

    await user.click(screen.getByRole('button', { name: 'Go to first page' }));

    expect(store.getState().page).toBe(1);
  });

  it('moves to the last page via the jump control', async () => {
    const user = userEvent.setup();
    const { store } = renderPagination();

    await user.click(screen.getByRole('button', { name: 'Go to last page' }));

    expect(store.getState().page).toBe(10);
  });

  it('moves to the previous page', async () => {
    const user = userEvent.setup();
    const { store } = renderPagination();

    await user.click(screen.getByRole('button', { name: 'Go to previous page' }));

    expect(store.getState().page).toBe(4);
  });

  it('moves to the next page', async () => {
    const user = userEvent.setup();
    const { store } = renderPagination();

    await user.click(screen.getByRole('button', { name: 'Go to next page' }));

    expect(store.getState().page).toBe(6);
  });

  it('hides the backward controls on the first page', () => {
    renderPagination({ store: createStore(1) });

    expect(screen.queryByRole('button', { name: 'Go to first page' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Go to previous page' })).not.toBeInTheDocument();
  });

  it('hides the forward controls on the final page', () => {
    renderPagination({ store: createStore(10) });

    expect(screen.queryByRole('button', { name: 'Go to next page' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Go to last page' })).not.toBeInTheDocument();
  });
});
