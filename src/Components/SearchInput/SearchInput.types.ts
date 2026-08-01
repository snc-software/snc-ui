import type { Sizes } from './SearchInput.constants';
import type { SncComponent } from '@/Types/SncComponent';
import type { InputHTMLAttributes, ReactNode, Ref } from 'react';

export type SearchInputOption = {
  /**
   * Value reported to `onChange` when the option is chosen.
   */
  value: string;
  /**
   * User-facing option text.
   */
  label: string;
  disabled?: boolean;
};

export type SearchInputProps = SncComponent<
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'className' | 'id' | 'style' | 'value' | 'defaultValue' | 'onChange' | 'type' | 'size'
  > & {
    /**
     * The consumer's current search results, rendered as the listbox contents as-is — this
     * component performs no filtering of its own.
     */
    options: SearchInputOption[];
    /**
     * Called with the typed text after the user stops typing for `debounceMs`. The consumer owns
     * the actual external fetch (and its own loading/cancellation) entirely.
     */
    onSearch: (query: string) => void;
    /**
     * How long to wait, after the last keystroke, before calling `onSearch`.
     * @default 300
     */
    debounceMs?: number;
    /**
     * Whether a search is currently in flight. Swaps the prefix search icon for a loading spinner
     * and sets `aria-busy`. Driven entirely by the consumer — this component has no way to know
     * when their external fetch resolves.
     */
    isLoading?: boolean;
    /**
     * Visible label rendered above the control via the shared `InputLabel`, associated to it via
     * `htmlFor`/`id`. When omitted, an accessible name must be supplied via
     * `aria-label`/`aria-labelledby` instead.
     */
    label?: ReactNode;
    /**
     * Selected value. Supplying this makes selection controlled.
     */
    value?: string;
    /**
     * Initially selected value when selection is left uncontrolled.
     */
    defaultValue?: string;
    /**
     * Called with the chosen option's `value` once picked from the listbox.
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
     * Shown as a non-interactive row inside the listbox once a search completes with no matches.
     * @default 'No results found'
     */
    noResultsMessage?: string;
    /**
     * Disables the input and prevents opening the listbox.
     */
    disabled?: boolean;
    /**
     * Mirrors the selection into a hidden input for form submission. React Hook Form should drive
     * this component through `Controller` rather than `register`, since the trigger raises no
     * native change event to register against.
     */
    name?: string;
    ref?: Ref<HTMLInputElement>;
  }
>;
