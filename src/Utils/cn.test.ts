import { describe, expect, it } from 'vitest';

import { cn } from './cn';

describe('cn', () => {
  it('joins truthy class values into a single string', () => {
    const result = cn('snc:flex', 'snc:items-center');

    expect(result).toBe('snc:flex snc:items-center');
  });

  it('omits falsy class values', () => {
    const result = cn('snc:flex', false, undefined, null, 'snc:gap-2');

    expect(result).toBe('snc:flex snc:gap-2');
  });

  it('merges conflicting Tailwind classes, keeping the last one', () => {
    const result = cn('snc:bg-snc-primary', 'snc:bg-snc-accent');

    expect(result).toBe('snc:bg-snc-accent');
  });
});
