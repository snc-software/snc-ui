import Checkbox from '@/Components/Checkbox';
import { cn } from '@/Utils/cn';

import { classes as tableClasses } from '../../Table.styles';
import TableHeadCell from '../TableHeadCell';
import { classes } from './TableHeadRow.styles';

import type { TableHeadRowProps } from './TableHeadRow.types';

/**
 * The header row: an optional select-all cell followed by one `TableHeadCell` per column.
 *
 * Only meaningful as a child of `TableHead`.
 */
export default function TableHeadRow<TRow extends object>({
  columns,
  filters,
  isSelectionEnabled = false,
  selectionState,
  onSelectAllClicked,
  sortBy,
  sortDirection,
  onSortChanged,
  onFiltersSet,
  onFiltersCleared,
  className,
  ...rest
}: TableHeadRowProps<TRow>) {
  return (
    <tr className={className} {...rest}>
      {isSelectionEnabled && (
        <th
          scope="col"
          className={cn(tableClasses.cell, tableClasses.cellOverlap, classes.selectionCell)}
        >
          <Checkbox
            aria-label="Select all rows"
            checked={selectionState.checked}
            indeterminate={selectionState.indeterminate}
            onChange={onSelectAllClicked}
          />
        </th>
      )}

      {columns.map((column, index) => (
        <TableHeadCell<TRow>
          key={column.id}
          className={cn(
            index === 0 && !isSelectionEnabled && classes.firstColumn,
            index === columns.length - 1 && classes.lastColumn,
          )}
          column={column}
          filters={filters}
          sortDirection={sortBy === column.id ? sortDirection : undefined}
          onSortChanged={column.isSortable ? onSortChanged : undefined}
          onFiltersSet={onFiltersSet}
          onFiltersCleared={onFiltersCleared}
        />
      ))}
    </tr>
  );
}
