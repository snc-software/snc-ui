import type { NavigationLink } from '@/Internal/NavigationMenuBase';
import type { SncComponent } from '@/Types/SncComponent';

export type { NavigationLink } from '@/Internal/NavigationMenuBase';

export type BasicNavigationMenuProps = SncComponent<{
  items: NavigationLink[];
  /** Accessible name for the `<nav>` landmark. @default 'Main' */
  label?: string;
}>;
