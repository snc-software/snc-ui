import type { TableFilter, TableSortDirection } from './Table.types';

/**
 * Advances a column through the sort cycle: unsorted → ascending → descending → unsorted.
 */
export function getNextSortDirection(
  current: TableSortDirection | undefined,
): TableSortDirection | undefined {
  if (current === 'asc') {
    return 'desc';
  }

  if (current === 'desc') {
    return undefined;
  }

  return 'asc';
}

function hasValue(filter: TableFilter): boolean {
  const { value } = filter;

  return value !== undefined && value !== null && value !== '';
}

/**
 * Merges incoming filters into the active set. A filter carrying a value is added or replaces the
 * existing entry for its id; a filter with no value removes it.
 */
export function applyFilters(
  activeFilters: TableFilter[],
  incomingFilters: TableFilter[],
): TableFilter[] {
  return incomingFilters.reduce<TableFilter[]>((filters, incoming) => {
    const existingIndex = filters.findIndex((filter) => filter.id === incoming.id);

    if (!hasValue(incoming)) {
      return existingIndex === -1
        ? filters
        : [...filters.slice(0, existingIndex), ...filters.slice(existingIndex + 1)];
    }

    if (existingIndex === -1) {
      return [...filters, incoming];
    }

    return [...filters.slice(0, existingIndex), incoming, ...filters.slice(existingIndex + 1)];
  }, activeFilters);
}

/**
 * Removes the filters matching the supplied ids, leaving the rest in order.
 */
export function clearFilters(activeFilters: TableFilter[], filterIds: string[]): TableFilter[] {
  return activeFilters.filter((filter) => !filterIds.includes(filter.id));
}

export function areFiltersEqual(left: TableFilter[], right: TableFilter[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((filter, index) => {
    const other = right[index];

    return (
      filter.id === other.id &&
      filter.title === other.title &&
      filter.text === other.text &&
      filter.value === other.value
    );
  });
}

export type TableSelectionState = {
  checked: boolean;
  indeterminate: boolean;
};

/**
 * Derives the select-all checkbox state from the rows currently on screen, ignoring rows that
 * `isRowSelectable` rejects.
 */
export function getSelectionState<TRow extends object>(
  data: TRow[] = [],
  selectedRows: TRow[] = [],
  isRowSelectable?: (row: TRow) => boolean,
): TableSelectionState {
  const selectableRows = getSelectableRows(data, isRowSelectable);

  if (!selectableRows.length || !selectedRows.length) {
    return { checked: false, indeterminate: false };
  }

  const allSelected = selectableRows.every((row) => selectedRows.includes(row));
  const someSelected = selectableRows.some((row) => selectedRows.includes(row));

  return { checked: allSelected, indeterminate: !allSelected && someSelected };
}

export function getSelectableRows<TRow extends object>(
  data: TRow[] = [],
  isRowSelectable?: (row: TRow) => boolean,
): TRow[] {
  return isRowSelectable ? data.filter((row) => isRowSelectable(row)) : data;
}

/**
 * Toggles every selectable row on screen. If all are already selected they are deselected; otherwise
 * the missing ones are added. Rows from other pages already in `selected` are preserved.
 */
export function toggleSelectAll<TRow extends object>(
  data: TRow[],
  selectedRows: TRow[],
  isRowSelectable?: (row: TRow) => boolean,
): TRow[] {
  const selectableRows = getSelectableRows(data, isRowSelectable);
  const allSelected =
    selectableRows.length > 0 && selectableRows.every((row) => selectedRows.includes(row));

  if (allSelected) {
    return selectedRows.filter((row) => !selectableRows.includes(row));
  }

  return [...selectedRows, ...selectableRows.filter((row) => !selectedRows.includes(row))];
}

export function toggleRowSelection<TRow extends object>(
  selectedRows: TRow[],
  row: TRow,
  isSelected: boolean,
): TRow[] {
  if (isSelected) {
    return selectedRows.includes(row) ? selectedRows : [...selectedRows, row];
  }

  return selectedRows.filter((selectedRow) => selectedRow !== row);
}

export function getPageCount(total: number, pageSize: number): number {
  if (pageSize <= 0) {
    return 0;
  }

  return Math.ceil(total / pageSize);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

/**
 * Builds the window of page numbers shown around the current page, clamped so it never runs past
 * either end of the range. `size` is the number of pages shown either side of the current one.
 */
export function getPageNumbers(currentPage: number, pageCount: number, size = 2): number[] {
  if (pageCount <= 0) {
    return [];
  }

  const windowLength = Math.min(pageCount, size * 2 + 1);
  const firstPage = clamp(currentPage - size, 1, Math.max(1, pageCount - windowLength + 1));

  return Array.from({ length: windowLength }, (_, index) => firstPage + index);
}
