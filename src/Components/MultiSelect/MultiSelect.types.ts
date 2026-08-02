import type { Sizes } from './MultiSelect.constants';
import type { Options } from '@/Components/OptionsList';
import type { SncComponent } from '@/Types/SncComponent';
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';

export type MultiSelectProps = SncComponent<
  // A `<button>` trigger, not a native `<select multiple>` — an OS-drawn dropdown cannot take the
  // design system's styling. `value`/`defaultValue`/`onChange` are redeclared below accordingly.
  Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'className' | 'id' | 'style' | 'children' | 'type' | 'value' | 'defaultValue' | 'onChange'
  > & {
    /**
     * The same recursive shape `OptionsList`/`CmdK` use — a flat array, a single item, a collapsible
     * `OptionsGroup`, or a `Tag`-headed `OptionsCollection`, arbitrarily nested.
     */
    options: Options;
    /**
     * Visible label rendered above the control via the shared `InputLabel`, associated to it via
     * `htmlFor`/`id`. When omitted, an accessible name must be supplied via
     * `aria-label`/`aria-labelledby` instead.
     */
    label?: ReactNode;
    /**
     * Selected ids. Supplying this makes the component controlled — it then only changes when the
     * consumer passes a new array.
     */
    value?: string[];
    /**
     * Initially selected ids when the component is left uncontrolled.
     */
    defaultValue?: string[];
    /**
     * Called with the full updated array of selected ids on every toggle.
     */
    onChange?: (values: string[]) => void;
    /**
     * Shown while nothing is selected.
     * @default 'Select'
     */
    placeholder?: ReactNode;
    /**
     * Control height/padding. Style-affecting, so it maps to a key of {@link Sizes}. Only affects the
     * trigger — option rows are rendered by `OptionsList`/`OptionItem`, which has no `size` prop.
     */
    size?: keyof typeof Sizes;
    /**
     * Applies the error treatment and sets `aria-invalid`.
     */
    hasError?: boolean;
    /**
     * How many option rows are visible before the panel starts scrolling.
     * @default 7
     */
    visibleOptions?: number;
    /**
     * Mirrors selection into the surrounding form as one hidden input per selected id, sharing
     * `name` — the standard multi-value form-field convention.
     */
    name?: string;
    disabled?: boolean;
    ref?: Ref<HTMLButtonElement>;
  }
>;
