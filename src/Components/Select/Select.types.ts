import type { Sizes } from './Select.constants';
import type { SncComponent } from '@/Types/SncComponent';
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';

export type SelectOption = {
  /**
   * Value reported to `onChange` when the option is chosen.
   */
  value: string;
  /**
   * User-facing option text.
   */
  label: ReactNode;
  disabled?: boolean;
};

export type SelectProps = SncComponent<
  // A `<button>` trigger, not a native `<select>` — an OS-drawn dropdown cannot take the design
  // system's styling. `value`/`defaultValue`/`onChange` are redeclared below accordingly.
  Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'className' | 'id' | 'style' | 'children' | 'type' | 'value' | 'defaultValue' | 'onChange'
  > & {
    /**
     * Options to choose from.
     */
    options: SelectOption[];
    /**
     * Visible label rendered above the control via the shared `InputLabel`, associated to it via
     * `htmlFor`/`id`. When omitted, an accessible name must be supplied via
     * `aria-label`/`aria-labelledby` instead.
     */
    label?: ReactNode;
    /**
     * Selected value. Supplying this makes the component controlled — it then only changes when the
     * consumer passes a new one.
     */
    value?: string;
    /**
     * Initially selected value when the component is left uncontrolled.
     */
    defaultValue?: string;
    /**
     * Called with the chosen option's `value`. Note this is the value itself rather than a change
     * event, because there is no native `<select>` behind the control to raise one.
     */
    onChange?: (value: string) => void;
    /**
     * Shown while nothing is selected.
     * @default 'Select'
     */
    placeholder?: ReactNode;
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
     * How many options are visible before the panel starts scrolling.
     * @default 7
     */
    visibleOptions?: number;
    /**
     * Submitted with the surrounding form via a hidden input mirroring the selected value. React Hook
     * Form should drive this component through `Controller` rather than `register`, since the trigger
     * is a button and so raises no native change event to register against.
     */
    name?: string;
    ref?: Ref<HTMLButtonElement>;
  }
>;
