import type { AutocompleteOption } from './Autocomplete.types';

/**
 * Case-insensitive substring match of `query` against each option's `label`. Returns every option
 * when `query` is empty (after trimming).
 */
export function filterOptions(options: AutocompleteOption[], query: string): AutocompleteOption[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return options;
  }

  return options.filter((option) => option.label.toLowerCase().includes(normalizedQuery));
}
