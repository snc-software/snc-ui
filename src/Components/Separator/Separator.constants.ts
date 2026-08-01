import { cn } from '@/Utils/cn';

/**
 * `margin`, not `padding`, is what puts a gap on both sides of the line: in the box model, `border`
 * sits outside `padding` (margin -> border -> padding -> content), so padding on this `<hr>` would
 * only ever push its empty content area further from the border, i.e. a gap on one side of the line.
 * `margin` sits outside `border`, so it lands evenly on both sides of the line instead.
 */
export const Variants = {
  horizontal: cn('snc:w-full snc:border-t snc:my-2'),
  vertical: cn('snc:h-full snc:self-stretch snc:border-l snc:mx-2'),
} as const;
