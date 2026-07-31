import { classes as baseClasses } from '@/Internal/InputBase';
import { cn } from '@/Utils/cn';

export const classes = {
  base: cn(
    baseClasses.base,
    'snc:rounded-md snc:block snc:w-full snc:px-3 snc:py-2 snc:resize-y',
  ),
} as const;
