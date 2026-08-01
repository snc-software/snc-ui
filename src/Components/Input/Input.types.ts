import type { SncComponent } from '@/Types/SncComponent';
import type { InputHTMLAttributes, ReactNode, Ref } from 'react';

export type InputProps = SncComponent<
  Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'id' | 'style'> & {
    /**
     * Visible label rendered above the input via the shared `InputLabel`, associated to it via
     * `htmlFor`/`id`. When omitted, an accessible name must be supplied via
     * `aria-label`/`aria-labelledby` instead, and the input renders exactly as it does today (no
     * wrapping element). Supplying it wraps the input in a container, and `className` then targets
     * that wrapper rather than the input itself, matching `Select`/`Autocomplete`/`DatePicker`.
     */
    label?: ReactNode;
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
