import { NavArrowDown } from 'iconoir-react';
import { useState } from 'react';

import { cn } from '@/Utils/cn';

import { ChevronSize } from './Accordion.constants';
import { classes } from './Accordion.styles';

import type { AccordionProps } from './Accordion.types';

/**
 * A vertical stack of independently-toggleable collapsible sections, following the WAI-ARIA
 * Accordion pattern (`h3` + button header, `role="region"` content panel).
 *
 * Each section's content panel stays mounted with the native `hidden` attribute while closed,
 * rather than being unmounted, so `aria-controls` always points at a real element.
 */
export default function Accordion({
  items,
  openItems,
  defaultOpenItems = [],
  onOpenItemsChanged,
  className,
  ...rest
}: AccordionProps) {
  const [uncontrolledOpenItems, setUncontrolledOpenItems] = useState(defaultOpenItems);

  // Controlled as soon as `openItems` is supplied, as `Select`'s `value` prop behaves.
  const openItemIds = openItems ?? uncontrolledOpenItems;

  const handleToggle = (id: string) => {
    const isOpen = openItemIds.includes(id);
    const next = isOpen ? openItemIds.filter((openId) => openId !== id) : [...openItemIds, id];

    if (openItems === undefined) {
      setUncontrolledOpenItems(next);
    }

    onOpenItemsChanged?.(next);
  };

  return (
    <div className={cn(classes.root, className)} {...rest}>
      {items.map((item) => {
        const isOpen = openItemIds.includes(item.id);
        const headerId = `${item.id}-header`;
        const panelId = `${item.id}-panel`;

        return (
          <div key={item.id}>
            <h3 className={classes.sectionHeading}>
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className={cn(classes.header, isOpen && classes.headerOpen)}
                onClick={() => handleToggle(item.id)}
              >
                <span className={classes.headerText}>{item.header}</span>
                <span
                  className={cn(classes.chevron, isOpen && classes.chevronOpen)}
                  aria-hidden="true"
                >
                  <NavArrowDown width={ChevronSize} height={ChevronSize} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!isOpen}
              className={classes.panel}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
