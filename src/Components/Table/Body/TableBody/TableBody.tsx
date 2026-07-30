import Spinner from '@/Components/Spinner';
import { cn } from '@/Utils/cn';

import { DefaultEmptyMessage } from '../../Table.constants';
import TableBodyRow from '../TableBodyRow';
import { classes } from './TableBody.styles';

import type { TableBodyProps } from './TableBody.types';

/**
 * The table's `<tbody>`. Renders the loading state, the empty state, or the data rows.
 *
 * Only meaningful as a child of `Table`.
 */
export default function TableBody<TRow extends object>({
  columns,
  data = [],
  isLoading = false,
  emptyMessage = DefaultEmptyMessage,
  isSelectionEnabled = false,
  selectedRows = [],
  isRowSelectable,
  onRowClicked,
  onRowSelectChanged,
  className,
  ...rest
}: TableBodyProps<TRow>) {
  const columnCount = columns.length + (isSelectionEnabled ? 1 : 0);

  return (
    <tbody className={cn(className)} {...rest}>
      {isLoading && (
        <tr>
          <td colSpan={columnCount} className={classes.messageCell}>
            <div className={classes.message}>
              <Spinner size="xl" />
            </div>
          </td>
        </tr>
      )}

      {!isLoading && data.length === 0 && (
        <tr>
          <td colSpan={columnCount} className={classes.messageCell}>
            <div className={classes.message}>{emptyMessage}</div>
          </td>
        </tr>
      )}

      {!isLoading &&
        data.map((row, index) => (
          <TableBodyRow<TRow>
            // The index is the only stable identity available: rows are opaque objects with no
            // consumer-supplied id, and a page's data is replaced wholesale on every fetch rather than
            // being reordered in place. Selection is tracked by object reference, not by key.
            // eslint-disable-next-line react-x/no-array-index-key
            key={index}
            columns={columns}
            row={row}
            rowIndex={index}
            isSelectionEnabled={isSelectionEnabled}
            isSelected={selectedRows.includes(row)}
            isSelectable={isRowSelectable ? isRowSelectable(row) : true}
            onRowClicked={onRowClicked}
            onSelectChanged={onRowSelectChanged}
          />
        ))}
    </tbody>
  );
}
