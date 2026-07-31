import { cn } from '@/Utils/cn';

export const classes = {
  wrapper: cn('snc:flex snc:w-full snc:flex-col snc:gap-3'),
  dropzone: cn(
    'snc:flex snc:w-full snc:cursor-pointer snc:flex-col snc:items-center snc:justify-center snc:gap-2',
    'snc:rounded-md snc:border snc:border-dashed',
    'snc:bg-snc-surface snc:p-6 snc:text-center',
    'snc:transition-colors snc:duration-150',
    'snc:focus-within:outline-none snc:focus-within:ring-2 snc:focus-within:ring-snc-primary snc:focus-within:ring-offset-2',
  ),
  // Visually hidden but still keyboard-focusable — the focus ring lives on `dropzone` above via
  // `focus-within`, since the input itself is never visible.
  input: cn('snc:sr-only'),
  icon: cn('snc:text-snc-text-secondary'),
  instructions: cn('snc:font-snc-body snc:text-sm snc:text-snc-text-primary'),
  instructionsAction: cn('snc:text-snc-primary snc:underline'),
  restrictionsList: cn('snc:flex snc:flex-col snc:gap-0.5'),
  restrictions: cn('snc:font-snc-body snc:text-xs snc:text-snc-text-secondary'),
  fileList: cn('snc:flex snc:list-none snc:flex-col snc:gap-2'),
  fileRow: cn(
    'snc:flex snc:items-center snc:gap-2',
    'snc:rounded-md snc:border snc:border-snc-border snc:bg-snc-surface',
    'snc:px-3 snc:py-2',
  ),
  fileName: cn('snc:flex-1 snc:truncate snc:font-snc-body snc:text-sm snc:text-snc-text-primary'),
  fileSize: cn('snc:shrink-0 snc:font-snc-body snc:text-xs snc:text-snc-text-secondary'),
  removeButton: cn(
    'snc:flex snc:shrink-0 snc:items-center snc:justify-center',
    'snc:rounded snc:text-snc-text-secondary',
    'snc:transition-colors snc:duration-150 snc:hover:text-snc-primary',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-snc-primary snc:focus-visible:ring-offset-2',
    'snc:disabled:cursor-not-allowed snc:disabled:opacity-60',
  ),
  rejectionList: cn(
    'snc:flex snc:flex-col snc:gap-1',
    'snc:rounded-md snc:border snc:border-snc-error-border snc:bg-snc-error-bg',
    'snc:p-3',
  ),
  rejectionRow: cn(
    'snc:flex snc:items-center snc:gap-2 snc:font-snc-body snc:text-sm snc:text-snc-error-text',
  ),
  rejectionIcon: cn('snc:shrink-0 snc:text-snc-error-border'),
} as const;
