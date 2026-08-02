import { cn } from '@/Utils/cn';

import { classes } from '../Sidebar.styles';

import type { SidebarFooterProps } from '../Sidebar.types';

/** Sticky region at the bottom of `Sidebar` — typically a user/account menu trigger. */
export default function SidebarFooter({ ref, className, children, ...rest }: SidebarFooterProps) {
  return (
    <div ref={ref} className={cn(classes.footer, className)} {...rest}>
      {children}
    </div>
  );
}
