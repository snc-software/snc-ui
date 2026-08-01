import { NavArrowDown } from 'iconoir-react';
import { useRef, useState } from 'react';

import Popout from '@/Internal/Popout';
import { cn } from '@/Utils/cn';

import { classes } from './ComplexNavigationMenu.styles';

import type { ComplexNavigationMenuProps } from './ComplexNavigationMenu.types';

export default function ComplexNavigationMenu({
  items,
  label = 'Main',
  className,
  ...rest
}: ComplexNavigationMenuProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const openTriggerRef = useRef<HTMLButtonElement | null>(null);

  const openItem = items.find((item) => item.key === openKey);
  const close = () => setOpenKey(null);

  return (
    <nav aria-label={label} className={className} {...rest}>
      <ul className={classes.root}>
        {items.map(({ key, label: itemLabel, href, onClick, isActive, items: dropdownItems }) => {
          const hasDropdown = dropdownItems !== undefined && dropdownItems.length > 0;
          const linkClassName = cn(classes.link, isActive && classes.linkActive);

          if (!hasDropdown) {
            return (
              <li key={key}>
                {href !== undefined ? (
                  <a
                    href={href}
                    onClick={onClick}
                    aria-current={isActive ? 'page' : undefined}
                    className={linkClassName}
                  >
                    {itemLabel}
                  </a>
                ) : (
                  <button type="button" onClick={onClick} className={linkClassName}>
                    {itemLabel}
                  </button>
                )}
              </li>
            );
          }

          const isOpen = openKey === key;

          return (
            <li key={key} className={classes.item}>
              <button
                ref={(node) => {
                  if (isOpen) {
                    openTriggerRef.current = node;
                  }
                }}
                type="button"
                aria-haspopup="true"
                aria-expanded={isOpen}
                className={cn(linkClassName, classes.trigger)}
                onClick={() => setOpenKey(isOpen ? null : key)}
              >
                {itemLabel}
                <span
                  className={cn(classes.chevron, isOpen && classes.chevronOpen)}
                  aria-hidden="true"
                >
                  <NavArrowDown width={16} height={16} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <Popout
        isOpen={openItem?.items !== undefined}
        anchorRef={openTriggerRef}
        onClose={close}
        hasAdaptiveWidth={false}
        className={classes.panel}
      >
        <ul>
          {openItem?.items?.map((link) => (
            <li key={link.key}>
              {link.href !== undefined ? (
                <a
                  href={link.href}
                  onClick={link.onClick}
                  className={cn(classes.dropdownLink, link.isActive && classes.dropdownLinkActive)}
                >
                  {link.label}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={link.onClick}
                  className={cn(classes.dropdownLink, link.isActive && classes.dropdownLinkActive)}
                >
                  {link.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      </Popout>
    </nav>
  );
}
