import Checkbox from '@/Components/Checkbox';
import { cn } from '@/Utils/cn';

import { classes as tableClasses } from '../../TableBase.styles';
import TableBodyCell from '../TableBodyCell';
import { classes } from './TableBodyRow.styles';

import type { TableBodyRowProps } from './TableBodyRow.types';
import type { KeyboardEvent } from 'react';

/**
 * A single data row. Only meaningful as a child of `TableBody`.
 *
 * When `onRowClicked` is supplied the row becomes interactive. There is no semantic "activatable row"
 * element in HTML, so the `<tr>` takes `role="button"` plus a tab stop and Enter/Space handling to stay
 * keyboard-operable, rather than being click-only.
 */
export default function TableBodyRow<TRow extends object>({
  columns,
  row,
  rowIndex,
  isSelectionEnabled = false,
  isSelected = false,
  isSelectable = true,
  isActive = false,
  onRowClicked,
  onSelectChanged,
  className,
  ...rest
}: TableBodyRowProps<TRow>) {
  const isClickable = onRowClicked !== undefined;

  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
    if (!isClickable) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onRowClicked?.(row);
    }
  };

  return (
    <tr
      className={cn(
        isClickable && classes.clickable,
        isSelected && classes.selected,
        isActive && classes.active,
        className,
      )}
      data-testid={`body-row-${rowIndex}`}
      aria-current={isActive ? true : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? () => onRowClicked?.(row) : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      {...rest}
    >
      {isSelectionEnabled && (
        <td
          className={cn(tableClasses.cell, tableClasses.cellOverlap, classes.selectionCell)}
          // Keeps a checkbox press from also activating the row.
          onClick={(event) => event.stopPropagation()}
        >
          <Checkbox
            aria-label={`Select row ${rowIndex + 1}`}
            checked={isSelected}
            disabled={!isSelectable}
            onChange={(event) => onSelectChanged?.(row, event.target.checked)}
          />
        </td>
      )}

      {columns.map((column, index) => (
        <TableBodyCell<TRow>
          key={column.id}
          className={cn(
            index === 0 && !isSelectionEnabled && classes.firstColumn,
            index === columns.length - 1 && classes.lastColumn,
          )}
          value={column.accessor(row)}
          row={row}
          contents={column.cell}
          width={column.width}
        />
      ))}
    </tr>
  );
}
