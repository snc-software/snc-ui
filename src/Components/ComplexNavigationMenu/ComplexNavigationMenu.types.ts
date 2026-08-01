import type { NavigationLink } from '@/Internal/NavigationMenuBase';
import type { SncComponent } from '@/Types/SncComponent';

export type { NavigationLink } from '@/Internal/NavigationMenuBase';

export type ComplexNavigationMenuItem = NavigationLink & {
  /** One-level dropdown links shown beneath this item, if any. */
  items?: NavigationLink[];
};

export type ComplexNavigationMenuProps = SncComponent<{
  items: ComplexNavigationMenuItem[];
  /** Accessible name for the `<nav>` landmark. @default 'Main' */
  label?: string;
}>;
