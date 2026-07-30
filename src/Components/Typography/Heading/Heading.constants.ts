import { cn } from '@/Utils/cn';

export const Sizes = {
  h1: cn('snc:text-4xl snc:font-bold snc:tracking-[-0.02em]'),
  h2: cn('snc:text-3xl snc:font-semibold snc:tracking-[-0.02em]'),
  h3: cn('snc:text-2xl snc:font-semibold'),
  h4: cn('snc:text-xl snc:font-medium'),
  h5: cn('snc:text-lg snc:font-medium'),
  h6: cn('snc:text-base snc:font-medium'),
} as const;
