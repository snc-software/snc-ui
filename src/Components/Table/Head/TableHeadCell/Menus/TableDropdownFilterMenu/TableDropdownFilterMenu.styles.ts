import { cn } from '@/Utils/cn';

export const classes = {
  base: cn('snc:max-h-[400px] snc:overflow-y-auto', 'snc:py-1'),
  list: cn('snc:flex snc:flex-col'),
  option: cn(
    'snc:flex snc:w-full snc:items-center snc:gap-2',
    'snc:px-3 snc:py-2 snc:text-left',
    'snc:font-snc-body snc:text-sm snc:text-snc-text-primary',
    'snc:transition-colors snc:duration-150',
    'snc:hover:bg-snc-accent-subtle-bg',
    'snc:focus-visible:outline-none snc:focus-visible:bg-snc-accent-subtle-bg',
  ),
  optionSelected: cn('snc:bg-snc-primary-subtle-bg snc:font-medium'),
  clearOption: cn('snc:text-snc-text-secondary'),
} as const;
