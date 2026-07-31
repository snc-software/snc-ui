import type { SncComponent } from '@/Types/SncComponent';
import type { InputHTMLAttributes, Ref } from 'react';

export type DatePickerProps = SncComponent<
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'className' | 'id' | 'style' | 'value' | 'defaultValue' | 'onChange' | 'type' | 'readOnly'
  > & {
    /**
     * Selected date as an ISO date (`yyyy-MM-dd`) or ISO datetime string; only the date portion is
     * read. Supplying this makes the component controlled.
     */
    value?: string;
    /**
     * Same shape as `value`, for uncontrolled usage.
     */
    defaultValue?: string;
    /**
     * Called once a day is picked, with `yyyy-MM-dd` or, when `includeTime` is `true`, a
     * UTC-midnight ISO 8601 datetime for that date.
     */
    onChange?: (value: string) => void;
    /**
     * Selects which string shape `onChange` emits.
     * @default false
     */
    includeTime?: boolean;
    /**
     * Shown while nothing is selected.
     * @default 'Select date'
     */
    placeholder?: string;
    /**
     * Applies the error treatment and sets `aria-invalid`. Style-affecting, so it selects a variant
     * from `DatePicker.constants`.
     */
    hasError?: boolean;
    /**
     * Disables the trigger input and icon button, and prevents opening the calendar.
     */
    disabled?: boolean;
    /**
     * Earliest year offered in the calendar's year selector.
     * @default currentYear - 20
     */
    minYear?: number;
    /**
     * Latest year offered in the calendar's year selector.
     * @default currentYear + 10
     */
    maxYear?: number;
    /**
     * Mirrors the selection into a hidden input for form submission. React Hook Form should drive
     * this component through `Controller` rather than `register`, since the trigger is read-only and
     * so raises no native change event to register against.
     */
    name?: string;
    ref?: Ref<HTMLInputElement>;
  }
>;
