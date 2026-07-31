import { Xmark } from 'iconoir-react';
import { useStore } from 'zustand';

import Button from '@/Components/Button';
import { cn } from '@/Utils/cn';

import PageSizeSelector from '../PageSizeSelector';
import { DefaultActionVariant, DefaultLeadingActionVariant } from './TableToolbar.constants';
import { classes } from './TableToolbar.styles';

import type { TableAction } from '../Table.types';
import type { TableToolbarProps } from './TableToolbar.types';

function getActionVariant(action: TableAction, index: number) {
  return action.variant ?? (index === 0 ? DefaultLeadingActionVariant : DefaultActionVariant);
}

/**
 * The bar above the grid: row count, selection summary and actions, and the page size chooser.
 *
 * Only meaningful as a child of `Table`.
 */
export default function TableToolbar<TRow extends object>({
  store,
  dataLength,
  total,
  pageSizeOptions,
  isPaginated = true,
  actions = [],
  onActionClicked,
  hideActionsWhenRowsSelected = false,
  selectionActions = [],
  onSelectionActionClicked,
  className,
  ...rest
}: TableToolbarProps<TRow>) {
  const page = useStore(store, (state) => state.page);
  const pageSize = useStore(store, (state) => state.pageSize);
  const selected = useStore(store, (state) => state.selected);
  const setPageSize = useStore(store, (state) => state.setPageSize);
  const clearSelection = useStore(store, (state) => state.clearSelection);

  const previousRowsCount = (page - 1) * pageSize;
  const firstRow = dataLength === 0 ? 0 : previousRowsCount + 1;
  const lastRow = previousRowsCount + dataLength;

  const hasSelection = selected.length > 0;
  const areActionsVisible = (!hideActionsWhenRowsSelected || !hasSelection) && actions.length > 0;

  return (
    <div className={cn(classes.base, className)} {...rest}>
      {hasSelection && (
        <>
          {selectionActions.length > 0 && (
            <div className={classes.actionGroup}>
              {selectionActions.map((action, index) => (
                <Button
                  key={action.id}
                  variant={getActionVariant(action, index)}
                  disabled={action.disabled}
                  onClick={() => onSelectionActionClicked?.(action.id, selected)}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
          <span className={classes.divider} />
          <span className={classes.caption}>{selected.length} selected</span>
          <Button variant="text" className={classes.clearSelection} onClick={clearSelection}>
            <Xmark width={14} height={14} aria-hidden="true" />
            Clear
          </Button>
          <span className={classes.divider} />
        </>
      )}

      <span className={cn(classes.caption, !isPaginated && classes.captionGrows)}>
        Showing {firstRow} - {lastRow} of {total}
      </span>

      {isPaginated && (
        <>
          <span className={classes.divider} />
          <PageSizeSelector
            className={classes.pageSize}
            value={pageSize}
            options={pageSizeOptions}
            onChange={setPageSize}
          />
        </>
      )}

      {areActionsVisible && (
        <div className={classes.actionGroup}>
          {actions.map((action, index) => (
            <Button
              key={action.id}
              variant={getActionVariant(action, index)}
              disabled={action.disabled}
              onClick={() => onActionClicked?.(action.id)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
