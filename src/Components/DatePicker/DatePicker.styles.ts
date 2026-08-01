import { classes as baseClasses } from '@/Internal/InputBase';
import { cn } from '@/Utils/cn';

export const classes = {
  wrapper: cn('snc:inline-flex snc:w-full snc:flex-col snc:gap-1.5'),
  inputWrapper: cn('snc:relative snc:flex snc:w-full snc:items-center'),
  input: cn(baseClasses.base, 'snc:rounded-md snc:block snc:w-full snc:cursor-pointer snc:py-2 snc:pl-3 snc:pr-10'),
  iconButton: cn(
    'snc:absolute snc:right-2 snc:flex snc:items-center snc:justify-center',
    'snc:size-6 snc:shrink-0 snc:rounded snc:text-snc-text-secondary',
    'snc:transition-colors snc:duration-150',
    'snc:hover:text-snc-primary',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-snc-primary snc:focus-visible:ring-offset-2',
    'snc:disabled:cursor-not-allowed snc:disabled:opacity-60',
  ),
  // Delta over Popout's base panel: Calendar supplies its own border/surface/shadow, so Popout is
  // reduced to pure positioning here rather than doubling that box.
  panel: cn('snc:border-none snc:bg-transparent snc:rounded-none snc:shadow-none snc:p-0'),
} as const;
