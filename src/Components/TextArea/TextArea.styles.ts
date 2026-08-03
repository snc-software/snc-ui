import { classes as baseClasses } from '@/Internal/InputBase';
import { cn } from '@/Utils/cn';

export const classes = {
  // Only rendered when `label` is supplied — see TextArea.tsx.
  wrapper: cn('snc:inline-flex snc:w-full snc:flex-col snc:gap-1.5'),
  base: cn(baseClasses.base, 'snc:rounded-md snc:block snc:w-full snc:px-3 snc:py-2 snc:resize-y'),
} as const;
