import type { Options } from '@/Components/OptionsList';
import type { SncComponent } from '@/Types/SncComponent';
import type { Ref } from 'react';

export type CmdKProps = SncComponent<{
  /**
   * Whether the palette is shown. Mirrors `Modal`'s `isOpen` exactly.
   */
  isOpen: boolean;
  /**
   * Called on Escape, a backdrop click, the built-in close button, and after an item is activated.
   * The consumer is expected to flip `isOpen` to `false` in response.
   */
  onClose: () => void;
  /**
   * Current results to render — the same recursive `Options` shape `OptionsList` uses; items may
   * carry `href`/`onClick`. Not filtered internally — see `onSearch`.
   */
  options: Options;
  /**
   * Called with the typed query after the user stops typing for `debounceMs`, mirroring
   * `SearchInput`. The consumer owns filtering/fetching and feeds results back via `options`.
   */
  onSearch: (query: string) => void;
  /**
   * @default 300
   */
  debounceMs?: number;
  /**
   * Swaps the prefix icon for a loading spinner, mirroring `SearchInput`.
   */
  isLoading?: boolean;
  /**
   * @default 'Search...'
   */
  placeholder?: string;
  /**
   * Shown when `options` is empty after a search has run. Passed through to `OptionsList`'s
   * `emptyText`.
   * @default 'No results found'
   */
  emptyText?: string;
  /**
   * Passed through to the underlying `Modal`'s close button label.
   * @default 'Close'
   */
  closeLabel?: string;
  ref?: Ref<HTMLInputElement>;
}>;
