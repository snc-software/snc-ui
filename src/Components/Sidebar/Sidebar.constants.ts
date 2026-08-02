import { cn } from '@/Utils/cn';

// No spacing/breakpoint scale exists in design-tokens.json (color/mode/typography/icons only,
// confirmed by reading the file fresh) — these are literal, named constants rather than a
// fabricated token, the same treatment CmdK's INDENT_STEP_PX got for the same reason.
export const SIDEBAR_WIDTH = '16rem';
export const SIDEBAR_WIDTH_ICON = '3rem';
export const SIDEBAR_WIDTH_MOBILE = '18rem';
export const SIDEBAR_BREAKPOINT_PX = 768;

export const SIDEBAR_COOKIE_NAME = 'sidebar_state';
export const SIDEBAR_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

export const Sizes = {
  sm: cn('snc:h-7 snc:text-xs'),
  md: cn('snc:h-8 snc:text-sm'),
  lg: cn('snc:h-12 snc:text-sm'),
} as const;
