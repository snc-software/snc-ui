import type { SncComponent } from '@/Types/SncComponent';
import type { InputHTMLAttributes, ReactNode, Ref } from 'react';

export type CheckboxProps = SncComponent<
  Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'id' | 'style' | 'type'> & {
    /**
     * Renders the "some but not all" state. `indeterminate` is a DOM property rather than an HTML
     * attribute, so it is applied to the node via a ref effect and mirrored to `aria-checked="mixed"`.
     */
    indeterminate?: boolean;
    /**
     * Visible label. When omitted an `aria-label` MUST be supplied instead, so the control always has
     * an accessible name.
     */
    label?: ReactNode;
    /**
     * Applies the error treatment. Style-affecting, so it selects a variant from
     * `Checkbox.constants`.
     */
    hasError?: boolean;
    /**
     * Accepted as a normal prop so React Hook Form can register the field.
     */
    ref?: Ref<HTMLInputElement>;
  }
>;
