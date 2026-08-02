import { cn } from '@/Utils/cn';

import { useSidebar } from '../Sidebar.context';
import { classes } from '../Sidebar.styles';

import type { SidebarInsetProps } from '../Sidebar.types';

/**
 * Wraps the page's main content area alongside `Sidebar`. Applies the floating "inset" panel
 * treatment when the sibling `Sidebar`'s `variant` is `'inset'`.
 */
export default function SidebarInset({ ref, className, children, ...rest }: SidebarInsetProps) {
  const { variant } = useSidebar();

  return (
    <main
      ref={ref}
      className={cn(classes.inset, variant === 'inset' && classes.insetVariantInset, className)}
      {...rest}
    >
      {children}
    </main>
  );
}
