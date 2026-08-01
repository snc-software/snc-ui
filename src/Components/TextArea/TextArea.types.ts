import type { SncComponent } from '@/Types/SncComponent';
import type { ReactNode, Ref, TextareaHTMLAttributes } from 'react';

export type TextAreaProps = SncComponent<
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'id' | 'style'> & {
    /**
     * Visible label rendered above the textarea via the shared `InputLabel`, associated to it via
     * `htmlFor`/`id`. When omitted, an accessible name must be supplied via
     * `aria-label`/`aria-labelledby` instead, and the textarea renders exactly as it does today (no
     * wrapping element). Supplying it wraps the textarea in a container, and `className` then
     * targets that wrapper rather than the textarea itself, matching
     * `Select`/`Autocomplete`/`DatePicker`.
     */
    label?: ReactNode;
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
