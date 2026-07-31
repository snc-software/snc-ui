import { NavArrowLeft, NavArrowRight } from 'iconoir-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from 'zustand';

import Button from '@/Components/Button';
import { cn } from '@/Utils/cn';

import TableFilterChip from '../TableFilterChip';
import { classes } from './TableFilterPanel.styles';

import type { TableFilterPanelProps } from './TableFilterPanel.types';

const ScrollStep = 200;

/**
 * The active-filter bar shown above the grid: one chip per filter, scroll controls when they overflow,
 * and a clear-all control.
 *
 * Only meaningful as a child of `Table`.
 */
export default function TableFilterPanel<TRow extends object>({
  store,
  className,
  ...rest
}: TableFilterPanelProps<TRow>) {
  const filters = useStore(store, (state) => state.activeFilters);
  const clearFilters = useStore(store, (state) => state.clearFilters);
  const clearAllFilters = useStore(store, (state) => state.clearAllFilters);

  const chipsRef = useRef<HTMLDivElement | null>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  const measureOverflow = useCallback(() => {
    const chips = chipsRef.current;

    setHasOverflow(chips ? chips.scrollWidth > chips.clientWidth : false);
  }, []);

  useEffect(() => {
    measureOverflow();

    window.addEventListener('resize', measureOverflow);

    return () => {
      window.removeEventListener('resize', measureOverflow);
    };
  }, [filters, measureOverflow]);

  const scrollBy = (offset: number) => {
    chipsRef.current?.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <div className={cn(classes.base, className)} {...rest}>
      <div ref={chipsRef} className={classes.chips}>
        {filters.map((filter) => (
          <TableFilterChip
            key={filter.id}
            title={filter.title}
            value={filter.text ?? String(filter.value ?? '')}
            onClear={() => clearFilters([filter.id])}
          />
        ))}
      </div>

      {hasOverflow && (
        <>
          <button
            type="button"
            aria-label="Scroll filters left"
            className={classes.scrollControl}
            onClick={() => scrollBy(-ScrollStep)}
          >
            <NavArrowLeft width={18} height={18} />
          </button>
          <button
            type="button"
            aria-label="Scroll filters right"
            className={classes.scrollControl}
            onClick={() => scrollBy(ScrollStep)}
          >
            <NavArrowRight width={18} height={18} />
          </button>
        </>
      )}

      <Button variant="text" onClick={clearAllFilters}>
        Clear All
      </Button>
    </div>
  );
}
