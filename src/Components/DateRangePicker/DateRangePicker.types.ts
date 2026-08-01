import type { SncComponent } from '@/Types/SncComponent';
import type { InputHTMLAttributes, ReactNode, Ref } from 'react';

export type DateRangePickerValue = {
  start?: string;
  end?: string;
};

export type DateRangePickerProps = SncComponent<
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'className' | 'id' | 'style' | 'value' | 'defaultValue' | 'onChange' | 'type' | 'readOnly'
  > & {
    /**
     * Visible label rendered above the control via the shared `InputLabel`, associated to it via
     * `htmlFor`/`id`. When omitted, an accessible name must be supplied via
     * `aria-label`/`aria-labelledby` instead.
     */
    label?: ReactNode;
    /**
     * Selected range as ISO date (`yyyy-MM-dd`) or ISO datetime strings; only the date portion of
     * each is read. Supplying this makes the component controlled.
     */
    value?: DateRangePickerValue;
    /**
     * Same shape as `value`, for uncontrolled usage.
     */
    defaultValue?: DateRangePickerValue;
    /**
     * Called once a complete range is picked — never with a partial (start-only) selection.
     */
    onChange?: (value: { start: string; end: string }) => void;
    /**
     * Selects which string shape `onChange` emits. When `true`, `start` is UTC midnight
     * (`...T00:00:00.000Z`) and `end` is UTC 23:59:59 (`...T23:59:59.000Z`) of the respective picked
     * day.
     * @default false
     */
    includeTime?: boolean;
    /**
     * Shown while nothing is selected.
     * @default 'Select date range'
     */
    placeholder?: string;
    /**
     * Applies the error treatment and sets `aria-invalid`. Style-affecting, so it selects a variant
     * from `DateRangePicker.constants`.
     */
    hasError?: boolean;
    /**
     * Disables the trigger input and icon button, and prevents opening the calendar.
     */
    disabled?: boolean;
    /**
     * Which edge of the calendar panel lines up with the trigger's matching edge.
     * @default 'left'
     */
    align?: 'left' | 'right';
    /**
     * Earliest year offered in both months' shared year bounds.
     * @default currentYear - 20
     */
    minYear?: number;
    /**
     * Latest year offered in both months' shared year bounds.
     * @default currentYear + 10
     */
    maxYear?: number;
    /**
     * Mirrors the committed range into two hidden inputs, `${name}Start`/`${name}End`, for form
     * submission. React Hook Form should drive this component through `Controller` rather than
     * `register`, since the trigger is read-only and so raises no native change event to register
     * against.
     */
    name?: string;
    ref?: Ref<HTMLInputElement>;
  }
>;
