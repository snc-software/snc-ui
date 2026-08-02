import Input from '@/Components/Input';
import { cn } from '@/Utils/cn';

import { classes } from '../Sidebar.styles';

import type { SidebarInputProps } from '../Sidebar.types';

/** `Input`, restyled for the sidebar's own surface (e.g. a header search field). */
export default function SidebarInput({ className, ...rest }: SidebarInputProps) {
  return <Input className={cn(classes.input, className)} {...rest} />;
}
