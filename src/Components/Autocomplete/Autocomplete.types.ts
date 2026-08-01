import type { Sizes } from './Autocomplete.constants';
import type { SncComponent } from '@/Types/SncComponent';
import type { InputHTMLAttributes, ReactNode, Ref } from 'react';

export type AutocompleteOption = {
  /**
   * Value reported to `onChange` when the option is chosen.
   */
  value: string;
  /**
   * User-facing option text. Plain `string` (not `ReactNode` as in `SelectOption`) since it is
   * matched against the typed query.
   */
  label: string;
  disabled?: boolean;
};

export type AutocompleteProps = SncComponent<
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'className' | 'id' | 'style' | 'value' | 'defaultValue' | 'onChange' | 'type' | 'size'
  > & {
    /**
     * Options to search/select from.
     */
    options: AutocompleteOption[];
    /**
     * Visible label rendered above the control via the shared `InputLabel`, associated to it via
     * `htmlFor`/`id`. When omitted, an accessible name must be supplied via
     * `aria-label`/`aria-labelledby` instead.
     */
    label?: ReactNode;
    /**
     * Selected value. Supplying this makes the component controlled.
     */
    value?: string;
    /**
     * Initially selected value when the component is left uncontrolled.
     */
    defaultValue?: string;
    /**
     * Called with the chosen option's `value` once picked from the filtered list.
     */
    onChange?: (value: string) => void;
    /**
     * Shown while the input is empty. Only rendered when supplied — there is no fallback text.
     */
    placeholder?: string;
    /**
     * Control height/padding. Style-affecting, so it maps to a key of {@link Sizes}.
     */
    size?: keyof typeof Sizes;
    /**
     * Applies the error treatment and sets `aria-invalid`.
     */
    hasError?: boolean;
    /**
     * How many options are visible before the panel starts scrolling.
     * @default 7
     */
    visibleOptions?: number;
    /**
     * Shown as a non-interactive row inside the listbox when no option matches the typed text.
     * @default 'No results found'
     */
    noResultsMessage?: string;
    /**
     * Disables the input and prevents opening the listbox.
     */
    disabled?: boolean;
    /**
     * Mirrors the selection into a hidden input for form submission. React Hook Form should drive
     * this component through `Controller` rather than `register`, since the trigger raises no native
     * change event to register against.
     */
    name?: string;
    ref?: Ref<HTMLInputElement>;
  }
>;
