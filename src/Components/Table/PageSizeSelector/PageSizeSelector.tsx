import Select from '@/Components/Select';
import { cn } from '@/Utils/cn';

import { classes } from './PageSizeSelector.styles';

import type { PageSizeSelectorProps } from './PageSizeSelector.types';

/**
 * Page size chooser for the table toolbar, built on the public `Select`.
 *
 * Named without the `Table` prefix by explicit developer decision (see `plans/issue-9-table.md`,
 * Scope Decision 11) — it remains a `Table` sub-component and is only meaningful inside one.
 */
export default function PageSizeSelector({
  value,
  options,
  disabled = false,
  onChange,
  className,
  ...rest
}: PageSizeSelectorProps) {
  return (
    <div className={cn(classes.base, className)} {...rest}>
      <Select
        aria-label="Rows per page"
        className={classes.select}
        size="sm"
        disabled={disabled}
        value={String(value)}
        options={options.map((option) => ({ value: String(option), label: String(option) }))}
        onChange={(pageSize) => onChange(Number(pageSize))}
      />
      <span className={classes.label}>per page</span>
    </div>
  );
}
