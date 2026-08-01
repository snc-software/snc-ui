import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useTableController } from './useTableController';

import type { UseTableControllerOptions } from './useTableController.types';
import type { TableFilter } from '@/Internal/TableBase';

type Row = { id: number };

const rows: Row[] = [{ id: 1 }, { id: 2 }];

function renderController(overrides: Partial<UseTableControllerOptions<Row>> = {}) {
  const options: UseTableControllerOptions<Row> = {
    filters: [],
    onFetchRequested: vi.fn(),
    pageSizeOptions: [20, 50, 100],
    actions: [],
    isPaginated: true,
    ...overrides,
  };

  const { result, rerender } = renderHook(
    (props: UseTableControllerOptions<Row>) => useTableController(props),
    { initialProps: options },
  );

  return {
    result,
    options,
    onFetchRequested: options.onFetchRequested,
    // Re-runs the hook with `changes` merged over the options it was first rendered with, so a test
    // only has to state the prop it is changing.
    rerender: (changes: Partial<UseTableControllerOptions<Row>>) =>
      rerender({ ...options, ...changes }),
  };
}

describe('useTableController', () => {
  it('requests a fetch on mount with the default parameters', () => {
    const { onFetchRequested } = renderController();

    expect(onFetchRequested).toHaveBeenCalledTimes(1);
    expect(onFetchRequested).toHaveBeenCalledWith({
      filters: [],
      page: 1,
      pageSize: 20,
      sortBy: undefined,
      sortDirection: undefined,
    });
  });

  it('requests a fetch when the sort changes', () => {
    const { result, onFetchRequested } = renderController();

    act(() => result.current.onSortChanged('name', 'asc'));

    expect(onFetchRequested).toHaveBeenLastCalledWith(
      expect.objectContaining({ sortBy: 'name', sortDirection: 'asc' }),
    );
  });

  it('clears the sort after cycling past descending', () => {
    const { result, onFetchRequested } = renderController();

    act(() => result.current.onSortChanged('name', 'asc'));
    act(() => result.current.onSortChanged('name', 'desc'));
    act(() => result.current.onSortChanged('name', undefined));

    expect(onFetchRequested).toHaveBeenLastCalledWith(
      expect.objectContaining({ sortBy: undefined, sortDirection: undefined }),
    );
  });

  it('re-applies filters supplied via the filters prop when they change', () => {
    const filters: TableFilter[] = [{ id: 'status', title: 'Status', value: 'active' }];
    const { rerender, onFetchRequested } = renderController();

    rerender({ filters });

    expect(onFetchRequested).toHaveBeenLastCalledWith(expect.objectContaining({ filters }));
  });

  it('does not refetch when an equal filters array is supplied again', () => {
    const { rerender, onFetchRequested } = renderController({
      filters: [{ id: 'status', title: 'Status', value: 'active' }],
    });

    rerender({ filters: [{ id: 'status', title: 'Status', value: 'active' }] });

    expect(onFetchRequested).toHaveBeenCalledTimes(1);
  });

  it('does not refetch when only the onFetchRequested identity changes', () => {
    const { rerender, onFetchRequested } = renderController();

    rerender({ onFetchRequested: vi.fn() });

    expect(onFetchRequested).toHaveBeenCalledTimes(1);
  });

  it('clears the selection after a selection action runs', () => {
    const onSelectionActionClicked = vi.fn();
    const { result } = renderController({
      getSelectionActions: () => [{ id: 'archive', label: 'Archive' }],
      onSelectionActionClicked,
    });

    act(() => result.current.store.getState().toggleRowSelection(rows[0], true));
    act(() => result.current.onSelectionActionClicked('archive', rows));

    expect(onSelectionActionClicked).toHaveBeenCalledWith('archive', rows);
    expect(result.current.store.getState().selected).toEqual([]);
  });

  it('reports the toolbar as hidden when there are no actions, no selection and no pagination', () => {
    const { result } = renderController({ isPaginated: false });

    expect(result.current.isToolbarVisible).toBe(false);
  });
});
