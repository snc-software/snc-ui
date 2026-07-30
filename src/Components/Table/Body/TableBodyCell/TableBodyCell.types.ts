import type { SncComponent } from '@/Types/SncComponent';
import type { ReactNode } from 'react';

export type TableBodyCellProps<TRow extends object, TValue = unknown> = SncComponent<{
  /**
   * Value read from the row by the column's accessor.
   */
  value: TValue;
  /**
   * The whole row, so a custom cell can render from fields beyond its own accessor.
   */
  row: TRow;
  /**
   * Custom cell renderer. Defaults to the value's string representation.
   */
  contents?: (value: TValue, row: TRow) => ReactNode;
  /**
   * Fixed cell width, in px.
   */
  width?: number;
}>;
