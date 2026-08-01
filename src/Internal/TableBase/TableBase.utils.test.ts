import { describe, expect, it } from 'vitest';

import {
  applyFilters,
  areFiltersEqual,
  clearFilters,
  getNextSortDirection,
  getPageCount,
  getPageNumbers,
  getSelectionState,
  toggleRowSelection,
  toggleSelectAll,
} from './TableBase.utils';

type Row = { id: number; locked?: boolean };

const rows: Row[] = [{ id: 1 }, { id: 2, locked: true }, { id: 3 }];
const isRowSelectable = (row: Row) => !row.locked;

describe('getNextSortDirection', () => {
  it('moves from unsorted to ascending', () => {
    expect(getNextSortDirection(undefined)).toBe('asc');
  });

  it('moves from ascending to descending', () => {
    expect(getNextSortDirection('asc')).toBe('desc');
  });

  it('moves from descending back to unsorted', () => {
    expect(getNextSortDirection('desc')).toBeUndefined();
  });
});

describe('applyFilters', () => {
  it('adds a filter that has a value and was not previously present', () => {
    const result = applyFilters([], [{ id: 'name', title: 'Name', value: 'Ada' }]);

    expect(result).toEqual([{ id: 'name', title: 'Name', value: 'Ada' }]);
  });

  it('replaces an existing filter when a new value is supplied', () => {
    const active = [{ id: 'name', title: 'Name', value: 'Ada' }];

    const result = applyFilters(active, [{ id: 'name', title: 'Name', value: 'Grace' }]);

    expect(result).toEqual([{ id: 'name', title: 'Name', value: 'Grace' }]);
  });

  it('removes an existing filter when the new value is empty', () => {
    const active = [{ id: 'name', title: 'Name', value: 'Ada' }];

    const result = applyFilters(active, [{ id: 'name', title: 'Name', value: '' }]);

    expect(result).toEqual([]);
  });

  it('keeps unrelated filters untouched', () => {
    const active = [{ id: 'name', title: 'Name', value: 'Ada' }];

    const result = applyFilters(active, [{ id: 'status', title: 'Status', value: 'active' }]);

    expect(result).toHaveLength(2);
  });

  it('preserves a value of 0', () => {
    const result = applyFilters([], [{ id: 'count', title: 'Count', value: 0 }]);

    expect(result).toHaveLength(1);
  });
});

describe('clearFilters', () => {
  it('clears only the requested filter ids', () => {
    const active = [
      { id: 'name', title: 'Name', value: 'Ada' },
      { id: 'status', title: 'Status', value: 'active' },
    ];

    const result = clearFilters(active, ['name']);

    expect(result).toEqual([{ id: 'status', title: 'Status', value: 'active' }]);
  });

  it('returns the set unchanged when no ids match', () => {
    const active = [{ id: 'name', title: 'Name', value: 'Ada' }];

    expect(clearFilters(active, ['missing'])).toEqual(active);
  });
});

describe('areFiltersEqual', () => {
  it('reports equal for identical filter sets', () => {
    const filters = [{ id: 'name', title: 'Name', value: 'Ada' }];

    expect(areFiltersEqual(filters, [{ id: 'name', title: 'Name', value: 'Ada' }])).toBe(true);
  });

  it('reports unequal when a value differs', () => {
    const filters = [{ id: 'name', title: 'Name', value: 'Ada' }];

    expect(areFiltersEqual(filters, [{ id: 'name', title: 'Name', value: 'Grace' }])).toBe(false);
  });

  it('reports unequal when lengths differ', () => {
    expect(areFiltersEqual([], [{ id: 'name', title: 'Name', value: 'Ada' }])).toBe(false);
  });
});

describe('getSelectionState', () => {
  it('reports nothing selected for an empty selection', () => {
    expect(getSelectionState(rows, [])).toEqual({ checked: false, indeterminate: false });
  });

  it('reports all selected when every selectable row is selected', () => {
    const result = getSelectionState(rows, [rows[0], rows[2]], isRowSelectable);

    expect(result).toEqual({ checked: true, indeterminate: false });
  });

  it('reports indeterminate when only some selectable rows are selected', () => {
    const result = getSelectionState(rows, [rows[0]], isRowSelectable);

    expect(result).toEqual({ checked: false, indeterminate: true });
  });

  it('reports nothing selected when no rows are selectable', () => {
    const result = getSelectionState(rows, [rows[0]], () => false);

    expect(result).toEqual({ checked: false, indeterminate: false });
  });
});

describe('toggleSelectAll', () => {
  it('selects every selectable row when none are selected', () => {
    const result = toggleSelectAll(rows, [], isRowSelectable);

    expect(result).toEqual([rows[0], rows[2]]);
  });

  it('excludes rows rejected by isRowSelectable', () => {
    const result = toggleSelectAll(rows, [], isRowSelectable);

    expect(result).not.toContain(rows[1]);
  });

  it('deselects every selectable row when all are already selected', () => {
    const result = toggleSelectAll(rows, [rows[0], rows[2]], isRowSelectable);

    expect(result).toEqual([]);
  });

  it('selects all rows when no selectability predicate is supplied', () => {
    expect(toggleSelectAll(rows, [])).toEqual(rows);
  });
});

describe('toggleRowSelection', () => {
  it('adds a row when selecting', () => {
    expect(toggleRowSelection([], rows[0], true)).toEqual([rows[0]]);
  });

  it('removes a row when deselecting', () => {
    expect(toggleRowSelection([rows[0]], rows[0], false)).toEqual([]);
  });

  it('does not duplicate an already-selected row', () => {
    expect(toggleRowSelection([rows[0]], rows[0], true)).toEqual([rows[0]]);
  });
});

describe('getPageCount', () => {
  it('rounds a partial final page up', () => {
    expect(getPageCount(21, 20)).toBe(2);
  });

  it('returns 0 for an empty dataset', () => {
    expect(getPageCount(0, 20)).toBe(0);
  });

  it('returns 0 when the page size is not positive', () => {
    expect(getPageCount(10, 0)).toBe(0);
  });
});

describe('getPageNumbers', () => {
  it('returns an empty window when there are no pages', () => {
    expect(getPageNumbers(1, 0)).toEqual([]);
  });

  it('returns every page when there are fewer than the window length', () => {
    expect(getPageNumbers(1, 3)).toEqual([1, 2, 3]);
  });

  it('centres the window on the current page', () => {
    expect(getPageNumbers(5, 10)).toEqual([3, 4, 5, 6, 7]);
  });

  it('clamps the window at the start of the range', () => {
    expect(getPageNumbers(1, 10)).toEqual([1, 2, 3, 4, 5]);
  });

  it('clamps the window at the end of the range', () => {
    expect(getPageNumbers(10, 10)).toEqual([6, 7, 8, 9, 10]);
  });
});
