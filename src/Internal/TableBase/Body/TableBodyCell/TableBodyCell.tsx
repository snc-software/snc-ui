import { cn } from '@/Utils/cn';

import { classes } from './TableBodyCell.styles';
import { classes as tableClasses } from '../../TableBase.styles';

import type { TableBodyCellProps } from './TableBodyCell.types';

function defaultContents(value: unknown) {
  if (value === null || value === undefined) {
    return null;
  }

  return String(value);
}

/**
 * A single body cell. Renders the column's `cell` render prop when supplied — which is what lets
 * consumers put typography, status pills or any other React node in the body — and otherwise falls
 * back to the value's string representation.
 *
 * Only meaningful as a child of `TableBodyRow`.
 */
export default function TableBodyCell<TRow extends object, TValue = unknown>({
  value,
  row,
  contents,
  width,
  className,
  style,
  ...rest
}: TableBodyCellProps<TRow, TValue>) {
  return (
    <td
      className={cn(tableClasses.cell, tableClasses.cellOverlap, classes.cell, className)}
      style={{ width, ...style }}
      {...rest}
    >
      {contents ? contents(value, row) : defaultContents(value)}
    </td>
  );
}
