import type { SncComponent } from '@/Types/SncComponent';
import type { Ref, TextareaHTMLAttributes } from 'react';

export type TextAreaProps = SncComponent<
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'id' | 'style'> & {
    /**
     * Applies the error treatment and sets `aria-invalid`. Style-affecting, so it selects a variant
     * from `TextArea.constants` rather than being handled inline.
     */
    hasError?: boolean;
    /**
     * Accepted as a normal prop so React Hook Form can register the field via `{...register('name')}`.
     */
    ref?: Ref<HTMLTextAreaElement>;
  }
>;
