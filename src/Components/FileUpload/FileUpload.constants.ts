import { cn } from '@/Utils/cn';

// Composable, not single-select like Input's Variants — drag-active/error/disabled can be active
// simultaneously, so the component cn()s together whichever of these apply rather than indexing by
// a single key.
export const DropzoneVariants = {
  default: cn(
    'snc:border-snc-border snc:hover:border-snc-primary snc:hover:bg-snc-primary-subtle-bg',
  ),
  error: cn(
    'snc:border-snc-error-border snc:text-snc-error-text snc:hover:bg-snc-primary-subtle-bg',
  ),
  dragActive: cn('snc:border-snc-accent snc:bg-snc-accent-subtle-bg'),
  dragActiveIcon: cn('snc:text-snc-accent'),
  // `pointer-events-none` also suppresses the hover background above, so a disabled dropzone shows
  // neither the hover cue nor a pointer cursor.
  disabled: cn('snc:cursor-not-allowed snc:pointer-events-none snc:opacity-60'),
} as const;

export const DefaultInstructionsLeadIn = 'Drag and drop files here, or ';
export const DefaultInstructionsAction = 'click to browse';

export const DropzoneIconSize = 32;

export const IconSize = 16;
