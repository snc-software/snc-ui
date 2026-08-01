import { Xmark } from 'iconoir-react';

import { classes as tableClasses } from '@/Internal/TableBase';
import { cn } from '@/Utils/cn';

import { CloseIconSize, DefaultCloseLabel } from '../MasterDetailsTable.constants';
import { classes } from './MasterDetailsTablePanel.styles';

import type { MasterDetailsTablePanelProps } from './MasterDetailsTablePanel.types';

/**
 * The detail (right-hand) pane: a header carrying the title and the close control, over an
 * independently scrollable body.
 *
 * Only meaningful as a child of `MasterDetailsTable`, which owns the open row and supplies `onClose`.
 */
export default function MasterDetailsTablePanel({
  title,
  closeLabel = DefaultCloseLabel,
  onClose,
  className,
  children,
  ...rest
}: MasterDetailsTablePanelProps) {
  return (
    <section className={cn(tableClasses.surface, classes.root, className)} {...rest}>
      <div className={classes.header}>
        {title !== undefined && <h2 className={classes.title}>{title}</h2>}

        <button
          type="button"
          aria-label={closeLabel}
          className={classes.closeButton}
          onClick={onClose}
        >
          <Xmark width={CloseIconSize} height={CloseIconSize} />
        </button>
      </div>

      <div className={classes.body}>{children}</div>
    </section>
  );
}
