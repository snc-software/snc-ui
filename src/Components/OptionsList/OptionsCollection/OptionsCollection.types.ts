import type { OptionsCollection } from '../OptionsList.types';
import type { SncComponent } from '@/Types/SncComponent';

export type OptionsCollectionProps = SncComponent<{
  /**
   * Toggle rendering of checkboxes.
   * @default true
   */
  checkbox?: boolean;
  /**
   * Selects the state of nested groups when the list first renders.
   * @default false
   */
  defaultNestedExpanded?: boolean;
  /**
   * Number of layers by which to indent the content.
   * @default 0
   */
  indent?: number;
  /**
   * Fires with the full updated array of selected ids whenever selection changes.
   */
  onChange?: (selected: string[]) => void;
  /**
   * Options to render, keyed by group heading.
   */
  options: OptionsCollection;
  /**
   * Allow selection of all child options with a single click.
   * @default false
   */
  selectAll?: boolean;
  /**
   * Array of currently selected option ids.
   */
  selected?: string[];
  /**
   * Title text, passed through to each group's nested `OptionsList`.
   */
  title?: string;
  /**
   * Additive — not part of the ported legacy shape. Threaded through to each group's nested
   * `OptionsList` for `CmdK`'s keyboard-highlight state.
   */
  activeId?: string | null;
}>;
