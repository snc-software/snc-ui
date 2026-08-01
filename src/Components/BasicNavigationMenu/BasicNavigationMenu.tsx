import { cn } from '@/Utils/cn';

import { classes } from './BasicNavigationMenu.styles';

import type { BasicNavigationMenuProps } from './BasicNavigationMenu.types';

export default function BasicNavigationMenu({
  items,
  label = 'Main',
  className,
  ...rest
}: BasicNavigationMenuProps) {
  return (
    <nav aria-label={label} className={className} {...rest}>
      <ul className={classes.root}>
        {items.map(({ key, label: itemLabel, href, onClick, isActive }) => {
          const linkClassName = cn(classes.link, isActive && classes.linkActive);

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
        })}
      </ul>
    </nav>
  );
}
