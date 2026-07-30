import { cn } from '@/Utils/cn';

export const classes = {
  base: cn('snc:flex snc:min-w-max snc:flex-col snc:gap-3 snc:p-3'),
  // The popover matches the column's width, which for a narrow column left the input and its three
  // buttons crammed together. This floors the panel at a width the controls actually fit in.
  input: cn('snc:min-w-56'),
  actions: cn('snc:flex snc:gap-3'),
  primaryActions: cn('snc:flex snc:flex-1 snc:gap-2'),
} as const;
