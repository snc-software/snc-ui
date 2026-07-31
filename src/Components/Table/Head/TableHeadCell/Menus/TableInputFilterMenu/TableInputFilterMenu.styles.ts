import { cn } from '@/Utils/cn';

export const classes = {
  base: cn('snc:flex snc:min-w-max snc:flex-col snc:gap-5 snc:p-3'),
  // The popover inherits the column width, too tight for the controls on a narrow column.
  input: cn('snc:min-w-56'),
  actions: cn('snc:flex snc:gap-3'),
  primaryActions: cn('snc:flex snc:flex-1 snc:gap-2'),
} as const;
