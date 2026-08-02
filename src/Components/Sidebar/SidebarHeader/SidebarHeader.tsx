import { cn } from '@/Utils/cn';

import { classes } from '../Sidebar.styles';

import type { SidebarHeaderProps } from '../Sidebar.types';

/**
 * Sticky region at the top of `Sidebar` — typically branding or a `SidebarInput` search field.
 * For content that should differ between expanded and icon-collapsed states (e.g. a full wordmark
 * vs. a compact mark), read `useSidebar()`'s `state` in a child component — the same pattern
 * `SidebarGroupLabel` uses internally — rather than expecting a dedicated prop here. See
 * `Sidebar.stories.tsx`'s `SidebarBrandHeader` for a worked example.
 */
export default function SidebarHeader({ ref, className, children, ...rest }: SidebarHeaderProps) {
  return (
    <div ref={ref} className={cn(classes.header, className)} {...rest}>
      {children}
    </div>
  );
}
