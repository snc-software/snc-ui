import { useStore } from 'zustand';

import { cn } from '@/Utils/cn';

import { getSelectionState } from '../../Table.utils';
import TableHeadRow from '../TableHeadRow';
import { classes } from './TableHead.styles';

import type { TableHeadProps } from './TableHead.types';

/**
 * The table's `<thead>`. Derives the select-all checkbox state from the rows on screen and hands it to
 * `TableHeadRow`.
 *
 * Only meaningful as a child of `Table`.
 */
export default function TableHead<TRow extends object>({
  store,
  columns,
  data = [],
  isSelectionEnabled = false,
  isRowSelectable,
  sortBy,
  sortDirection,
  onSortChanged,
  className,
  ...rest
}: TableHeadProps<TRow>) {
  const filters = useStore(store, (state) => state.activeFilters);
  const selectedRows = useStore(store, (state) => state.selected);
  const toggleSelectAll = useStore(store, (state) => state.toggleSelectAll);
  const applyFilters = useStore(store, (state) => state.applyFilters);
  const clearFilters = useStore(store, (state) => state.clearFilters);

  const selectionState = getSelectionState(data, selectedRows, isRowSelectable);

  return (
    <thead className={cn(classes.base, className)} {...rest}>
      <TableHeadRow<TRow>
        columns={columns}
        filters={filters}
        isSelectionEnabled={isSelectionEnabled}
        selectionState={selectionState}
        onSelectAllClicked={() => toggleSelectAll(data, isRowSelectable)}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChanged={onSortChanged}
        onFiltersSet={applyFilters}
        onFiltersCleared={clearFilters}
      />
    </thead>
  );
}
