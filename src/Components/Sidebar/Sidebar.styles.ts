import { cn } from '@/Utils/cn';

export const classes = {
  provider: cn('snc:flex snc:min-h-full snc:w-full'),

  // Desktop <aside>. Width itself is set via inline style (SIDEBAR_WIDTH/_ICON constants) since
  // Tailwind can't express an animated width between two dynamic values as a static utility.
  root: cn(
    'snc:flex snc:h-full snc:flex-col',
    'snc:bg-snc-surface snc:text-snc-text-primary',
    'snc:transition-[width] snc:duration-200 snc:ease-linear',
    'snc:overflow-x-hidden',
  ),
  rootSideLeft: cn('snc:border-r snc:border-snc-border'),
  rootSideRight: cn('snc:border-l snc:border-snc-border snc:order-1'),
  rootVariantFloating: cn(
    'snc:m-2 snc:h-[calc(100%-1rem)] snc:rounded-lg snc:border snc:border-snc-border snc:shadow-lg',
  ),
  rootVariantInset: cn('snc:bg-transparent'),
  rootCollapsedOffcanvasLeft: cn('snc:-ml-[16rem]'),
  rootCollapsedOffcanvasRight: cn('snc:-mr-[16rem]'),

  // Mobile off-canvas sheet — same overlay/portal/focus-trap idiom as `Modal`, but edge-anchored
  // and sliding rather than centred.
  sheetOverlay: cn(
    'snc:fixed snc:inset-0 snc:z-50',
    'snc:bg-snc-neutral-950/60 snc:backdrop-blur-sm',
  ),
  sheetPanel: cn(
    'snc:fixed snc:inset-y-0 snc:z-50',
    'snc:flex snc:w-[18rem] snc:flex-col',
    'snc:bg-snc-surface snc:text-snc-text-primary snc:shadow-xl',
    'snc:transition-transform snc:duration-200 snc:ease-in-out',
  ),
  sheetPanelLeft: cn('snc:left-0 snc:border-r snc:border-snc-border'),
  sheetPanelRight: cn('snc:right-0 snc:border-l snc:border-snc-border'),

  rail: cn(
    'snc:absolute snc:inset-y-0 snc:z-20 snc:w-4',
    'snc:cursor-pointer snc:appearance-none snc:bg-transparent',
    'snc:after:absolute snc:after:inset-y-0 snc:after:left-1/2 snc:after:w-px',
    'snc:after:bg-snc-border snc:after:opacity-0 snc:after:transition-opacity',
    'snc:hover:after:opacity-100',
    'snc:focus-visible:outline-none snc:focus-visible:after:opacity-100',
  ),
  railLeft: cn('snc:-right-2'),
  railRight: cn('snc:-left-2'),

  inset: cn('snc:flex snc:flex-1 snc:flex-col snc:bg-snc-background'),
  insetVariantInset: cn('snc:m-2 snc:ml-0 snc:rounded-lg snc:bg-snc-surface snc:shadow-sm'),

  input: cn('snc:h-8 snc:bg-snc-surface-accent'),

  triggerRegion: cn('snc:flex snc:items-center snc:p-2'),
  triggerRegionSideLeft: cn('snc:justify-end'),
  triggerRegionCollapsed: cn('snc:justify-center'),
  triggerIconMirrored: cn('snc:-scale-x-100'),

  header: cn('snc:flex snc:flex-col snc:gap-2 snc:p-2'),
  footer: cn('snc:flex snc:flex-col snc:gap-2 snc:p-2'),
  separator: cn('snc:mx-2 snc:my-1 snc:w-auto'),
  content: cn('snc:flex snc:flex-1 snc:flex-col snc:gap-4 snc:overflow-y-auto'),

  group: cn('snc:relative snc:flex snc:w-full snc:min-w-0 snc:flex-col snc:p-2'),
  groupLabel: cn(
    'snc:flex snc:h-8 snc:items-center snc:px-2',
    'snc:font-snc-body snc:text-xs snc:font-medium snc:tracking-wide snc:uppercase',
    'snc:text-snc-text-secondary',
    'snc:transition-opacity snc:duration-200',
  ),
  groupLabelCollapsed: cn('snc:pointer-events-none snc:opacity-0'),
  groupAction: cn(
    'snc:absolute snc:top-2.5 snc:right-2',
    'snc:inline-flex snc:h-5 snc:w-5 snc:items-center snc:justify-center snc:rounded-md',
    'snc:text-snc-text-secondary',
    'snc:hover:bg-snc-primary-subtle-bg snc:hover:text-snc-primary',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-snc-primary',
  ),
  groupContent: cn('snc:w-full snc:text-sm'),

  menu: cn('snc:flex snc:w-full snc:min-w-0 snc:flex-col snc:gap-1'),
  menuItem: cn('snc:group/menu-item snc:relative'),

  menuButtonBase: cn(
    'snc:flex snc:w-full snc:items-center snc:gap-2 snc:overflow-hidden snc:rounded-md snc:px-2',
    'snc:font-snc-body snc:text-left',
    'snc:text-snc-text-primary snc:transition-colors snc:duration-150',
    'snc:hover:bg-snc-primary-subtle-bg snc:hover:text-snc-primary',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-snc-primary',
    'snc:disabled:pointer-events-none snc:disabled:opacity-50',
    'snc:[&>svg]:size-4 snc:[&>svg]:shrink-0',
  ),
  menuButtonActive: cn('snc:bg-snc-primary-subtle-bg snc:font-medium snc:text-snc-primary'),
  menuButtonCollapsedIcon: cn('snc:size-8 snc:justify-center snc:px-0 snc:[&>span]:hidden'),

  menuAction: cn(
    'snc:absolute snc:top-1.5 snc:right-1.5',
    'snc:inline-flex snc:h-5 snc:w-5 snc:items-center snc:justify-center snc:rounded-md',
    'snc:text-snc-text-secondary',
    'snc:hover:bg-snc-surface-accent snc:hover:text-snc-primary',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-snc-primary',
  ),
  menuActionVisibleOnHover: cn(
    'snc:opacity-0 snc:transition-opacity snc:duration-150',
    'snc:group-hover/menu-item:opacity-100 snc:focus-visible:opacity-100',
  ),

  menuBadge: cn(
    'snc:pointer-events-none snc:absolute snc:top-1.5 snc:right-2',
    'snc:font-snc-body snc:text-xs snc:font-medium snc:text-snc-text-secondary',
  ),

  skeleton: cn('snc:flex snc:h-8 snc:items-center snc:gap-2 snc:rounded-md snc:px-2'),
  skeletonIcon: cn('snc:size-4 snc:shrink-0 snc:animate-pulse snc:rounded-full snc:bg-snc-border'),
  skeletonText: cn(
    'snc:h-3 snc:flex-1 snc:max-w-[70%] snc:animate-pulse snc:rounded snc:bg-snc-border',
  ),

  menuSub: cn(
    'snc:ml-3.5 snc:flex snc:min-w-0 snc:flex-col snc:gap-1',
    'snc:border-l snc:border-snc-border snc:px-2.5 snc:py-0.5',
  ),
  menuSubItem: cn('snc:relative'),
  menuSubButtonBase: cn(
    'snc:flex snc:min-w-0 snc:items-center snc:gap-2 snc:overflow-hidden snc:rounded-md snc:px-2 snc:py-1',
    'snc:font-snc-body snc:text-sm snc:text-left',
    'snc:text-snc-text-primary snc:transition-colors snc:duration-150',
    'snc:hover:bg-snc-primary-subtle-bg snc:hover:text-snc-primary',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-snc-primary',
    'snc:disabled:pointer-events-none snc:disabled:opacity-50',
  ),
  menuSubButtonActive: cn('snc:bg-snc-primary-subtle-bg snc:font-medium snc:text-snc-primary'),
} as const;
