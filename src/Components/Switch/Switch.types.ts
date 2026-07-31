import type { SncComponent } from '@/Types/SncComponent';
import type { InputHTMLAttributes, ReactNode, Ref } from 'react';

export type SwitchProps = SncComponent<
  Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'id' | 'style' | 'type'> & {
    /**
     * Visible label. When omitted an `aria-label` MUST be supplied instead, so the control always has
     * an accessible name.
     */
    label?: ReactNode;
    /**
     * Applies the error treatment. Style-affecting, so it selects a variant from `Switch.constants`.
     */
    hasError?: boolean;
    /**
     * Accepted as a normal prop so React Hook Form can register the field.
     */
    ref?: Ref<HTMLInputElement>;
  }
>;
