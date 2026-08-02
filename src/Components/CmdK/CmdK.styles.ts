import { cn } from '@/Utils/cn';

export const classes = {
  // Overrides Modal's default centred-card padding — CmdK owns its own search-row/listbox layout
  // instead, matching shadcn's own wider, edge-to-edge Command dialog.
  panel: cn('snc:w-full snc:max-w-lg snc:overflow-hidden snc:p-0'),
  searchRow: cn('snc:relative snc:flex snc:items-center snc:border-b snc:border-snc-border'),
  prefixIcon: cn(
    'snc:pointer-events-none snc:absolute snc:left-4 snc:flex snc:items-center',
    'snc:text-snc-text-secondary',
  ),
  input: cn(
    'snc:w-full snc:bg-transparent snc:py-4 snc:pl-11 snc:pr-4',
    'snc:font-snc-body snc:text-sm snc:text-snc-text-primary',
    'snc:placeholder:text-snc-text-secondary',
    'snc:focus:outline-none',
  ),
  listbox: cn('snc:max-h-80 snc:overflow-y-auto'),
  // Applied to `listbox` only when results/empty-state content is actually rendered inside it — kept
  // separate so an empty/pre-search listbox collapses to 0px instead of showing padding with nothing in it.
  listboxContent: cn('snc:py-2'),
} as const;
