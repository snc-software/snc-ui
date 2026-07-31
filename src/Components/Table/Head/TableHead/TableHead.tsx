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
  columns,
  data = [],
  filters,
  isSelectionEnabled = false,
  selectedRows = [],
  isRowSelectable,
  onSelectAllClicked,
  sortBy,
  sortDirection,
  onSortChanged,
  onFiltersSet,
  onFiltersCleared,
  className,
  ...rest
}: TableHeadProps<TRow>) {
  const selectionState = getSelectionState(data, selectedRows, isRowSelectable);

  return (
    <thead className={cn(classes.base, className)} {...rest}>
      <TableHeadRow<TRow>
        columns={columns}
        filters={filters}
        isSelectionEnabled={isSelectionEnabled}
        selectionState={selectionState}
        onSelectAllClicked={onSelectAllClicked}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChanged={onSortChanged}
        onFiltersSet={onFiltersSet}
        onFiltersCleared={onFiltersCleared}
      />
    </thead>
  );
}
