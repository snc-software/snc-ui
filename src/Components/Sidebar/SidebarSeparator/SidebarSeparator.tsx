import Separator from '@/Components/Separator';
import { cn } from '@/Utils/cn';

import { classes } from '../Sidebar.styles';

import type { SidebarSeparatorProps } from '../Sidebar.types';

/** `Separator`, restyled with the sidebar's own inset margin. */
export default function SidebarSeparator({ ref, className, ...rest }: SidebarSeparatorProps) {
  return <Separator ref={ref} className={cn(classes.separator, className)} {...rest} />;
}
