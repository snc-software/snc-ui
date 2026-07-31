import type { SncComponent } from '@/Types/SncComponent';
import type { InputHTMLAttributes, Ref } from 'react';

export type InputProps = SncComponent<
  Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'id' | 'style'> & {
    /**
     * Applies the error treatment and sets `aria-invalid`. Style-affecting, so it selects a variant
     * from `Input.constants` rather than being handled inline.
     */
    hasError?: boolean;
    /**
     * Accepted as a normal prop so React Hook Form can register the field via `{...register('name')}`.
     */
    ref?: Ref<HTMLInputElement>;
  }
>;
