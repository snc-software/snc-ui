import type { SncComponent } from '@/Types/SncComponent';
import type { ReactNode } from 'react';

export type Option = {
  /**
   * Title text.
   */
  title: string;
  /**
   * Description text. Can be a single line, multiple lines, or a render function reflecting the
   * row's current selected/disabled state.
   */
  description?: string | string[] | ((state: { selected: boolean; disabled?: boolean }) => ReactNode);
  /**
   * Toggle disabled state.
   * @default false
   */
  disabled?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  /**
   * Additive — not part of the ported legacy shape. Renders the row's content as a real `<a href>`,
   * for `CmdK`'s navigation-item use case.
   */
  href?: string;
  /**
   * Additive — not part of the ported legacy shape. Called when the row is activated (click or
   * `Enter`), for `CmdK`'s action-item use case.
   */
  onClick?: () => void;
};

export type OptionsCollection = {
  /**
   * Groupable and nestable collections of options, keyed by group heading.
   */
  [group: string]: Options;
};

export type OptionsGroup = Option & {
  /**
   * Child list options. Dynamically nestable and groupable.
   */
  childOptions: Options;
};

export type OptionItem = Option & {
  /**
   * List item id.
   */
  id: string;
};

export type Options = OptionItem | OptionsGroup | Options[] | OptionsCollection;

export type SearchTermMatchOption = 'exact-match' | 'partial-match';

export type SearchOptions = {
  /**
   * If an array, group, or collection only contains one matching option, return the option alone
   * rather than the array, group, or collection containing it. Useful when searching by exact-match
   * id, so only the matched item itself comes back.
   */
  flattenWhenSingleChild?: boolean;
  /**
   * Configures if, and how, to match on option id.
   */
  id?: SearchTermMatchOption;
  /**
   * Configures if, and how, to match on option title.
   */
  title?: SearchTermMatchOption;
};

export type OptionsListProps = SncComponent<{
  /**
   * Toggle rendering of checkboxes.
   * @default true
   */
  checkbox?: boolean;
  /**
   * Selects the state of nested groups when the list first renders.
   * `true`: nested values are expanded by default. `false`: collapsed by default.
   * @default false
   */
  defaultNestedExpanded?: boolean;
  /**
   * Text to display when the options list is empty.
   * @default 'No results found.'
   */
  emptyText?: string;
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
   * Options to render.
   */
  options: Options;
  /**
   * Settings to configure the behaviour of `searchTerm` filtering.
   */
  searchOptions?: SearchOptions;
  /**
   * Search term to filter the options list by.
   */
  searchTerm?: string;
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
   * Toggle rendering of only selected options.
   * @default false
   */
  selectedOnly?: boolean;
  /**
   * Title text.
   */
  title?: string;
  /**
   * Additive — not part of the ported legacy shape. Id of the currently keyboard-highlighted
   * option, purely visual and decoupled from `selected`/`onChange`'s click-activation mechanics. A
   * consumer that never arrow-key-navigates (e.g. a checkbox multi-select) simply never passes it
   * and sees no behaviour change.
   */
  activeId?: string | null;
}>;
