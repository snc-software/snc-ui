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
  store,
  columns,
  isSelectionEnabled = false,
  selectionState,
  onSelectAllClicked,
  sortBy,
  sortDirection,
  onSortChanged,
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
            className={classes.selectionCheckbox}
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
          store={store}
          column={column}
          sortDirection={sortBy === column.id ? sortDirection : undefined}
          onSortChanged={column.isSortable ? onSortChanged : undefined}
        />
      ))}
    </tr>
  );
}
