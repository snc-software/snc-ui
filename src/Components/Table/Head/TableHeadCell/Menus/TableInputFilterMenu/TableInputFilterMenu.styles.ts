import { cn } from '@/Utils/cn';

export const classes = {
  base: cn('snc:flex snc:min-w-max snc:flex-col snc:gap-2 snc:p-2'),
  actions: cn('snc:flex snc:gap-2'),
  primaryActions: cn('snc:flex snc:flex-1 snc:gap-2'),
} as const;
