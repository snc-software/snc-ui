import type { Sizes } from './Select.constants';
import type { SncComponent } from '@/Types/SncComponent';
import type { Ref, SelectHTMLAttributes } from 'react';

export type SelectOption = {
  /**
   * Value submitted/reported when the option is chosen.
   */
  value: string;
  /**
   * User-facing option text.
   */
  label: string;
  disabled?: boolean;
};

export type SelectProps = SncComponent<
  // `size` is omitted from the native attributes deliberately: HTML's `size` is a row count, which
  // would intersect with our `'sm' | 'md'` union and collapse it to `never`.
  Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    'className' | 'id' | 'style' | 'children' | 'size'
  > & {
    /**
     * Options to choose from.
     */
    options: SelectOption[];
    /**
     * Control height/padding. Style-affecting, so it maps to a key of {@link Sizes}.
     */
    size?: keyof typeof Sizes;
    /**
     * Applies the error treatment and sets `aria-invalid`. Style-affecting, so it selects a variant
     * from `Select.constants`.
     */
    hasError?: boolean;
    /**
     * Rendered as a disabled, non-selectable leading option to prompt a choice.
     */
    placeholder?: string;
    /**
     * Accepted as a normal prop so React Hook Form can register the field.
     */
    ref?: Ref<HTMLSelectElement>;
  }
>;
