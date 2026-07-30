import { cn } from '@/Utils/cn';

export const classes = {
  base: cn(
    'snc:font-snc-body snc:text-snc-primary snc:underline snc:underline-offset-2',
    'snc:transition-colors snc:duration-150',
    'snc:hover:text-snc-primary-hover',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-snc-primary snc:focus-visible:ring-offset-2',
  ),
} as const;
