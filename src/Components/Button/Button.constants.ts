import { cn } from '@/Utils/cn';

export const Variants = {
  primary: cn('snc:bg-snc-primary snc:text-snc-surface', 'snc:hover:bg-snc-primary-hover'),
  secondary: cn(
    'snc:border-snc-primary snc:bg-transparent snc:text-snc-primary',
    'snc:hover:bg-snc-primary-subtle-bg',
  ),
  round: cn(
    'snc:rounded-full snc:bg-snc-primary snc:text-snc-surface',
    'snc:hover:bg-snc-primary-hover',
  ),
  text: cn(
    'snc:border-transparent snc:bg-transparent snc:text-snc-primary',
    'snc:hover:bg-snc-primary-subtle-bg',
  ),
} as const;
