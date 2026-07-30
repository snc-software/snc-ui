import { cn } from '@/Utils/cn';

export const classes = {
  base: cn('snc:flex snc:min-w-max snc:flex-col snc:gap-3 snc:p-3'),
  // Matches `TableInputFilterMenu`: the popover takes the column's width, which is not necessarily
  // wide enough for the control and its three buttons.
  select: cn('snc:min-w-56'),
  actions: cn('snc:flex snc:gap-3'),
  primaryActions: cn('snc:flex snc:flex-1 snc:gap-2'),
} as const;
