import type { OptionItem } from '../OptionsList.types';
import type { SncComponent } from '@/Types/SncComponent';

export type OptionItemProps = SncComponent<
  OptionItem & {
    /**
     * Toggle rendering of a checkbox. When `false`, the row renders as a real `<a>`/`<button>`
     * instead of a `<label>`+checkbox pairing — see `OptionItem.tsx` for why the two never nest.
     * @default true
     */
    checkbox?: boolean;
    /**
     * Number of layers by which to indent the content.
     * @default 0
     */
    indent?: number;
    /**
     * Fires with the new selected state when the row is toggled/activated.
     */
    onChange?: (selected: boolean) => void;
    /**
     * Toggle selected state.
     */
    selected?: boolean;
    /**
     * Additive — not part of the ported legacy shape. Purely-visual keyboard-highlight state, set by
     * `OptionsList` from its own `activeId` prop.
     * @default false
     */
    isActive?: boolean;
  }
>;
