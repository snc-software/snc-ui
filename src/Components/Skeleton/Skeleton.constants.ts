import { cn } from '@/Utils/cn';

export const Variants = {
  text: cn('snc:h-4 snc:w-full snc:rounded'),
  circle: cn('snc:h-10 snc:w-10 snc:rounded-full'),
  rect: cn('snc:h-24 snc:w-full snc:rounded-md'),
} as const;
