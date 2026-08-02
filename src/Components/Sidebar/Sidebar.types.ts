import type { Sizes } from './Sidebar.constants';
import type { InputProps } from '@/Components/Input';
import type { SncComponent, SncComponentWithChildren } from '@/Types/SncComponent';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, Ref } from 'react';

export type SidebarState = 'expanded' | 'collapsed';
export type SidebarSide = 'left' | 'right';
export type SidebarVariant = 'sidebar' | 'floating' | 'inset';
export type SidebarCollapsible = 'offcanvas' | 'icon' | 'none';

export type SidebarContextValue = {
  state: SidebarState;
  open: boolean;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
  side: SidebarSide;
  variant: SidebarVariant;
  collapsible: SidebarCollapsible;
};

type OmittedDivAttributes = Omit<
  HTMLAttributes<HTMLDivElement>,
  'className' | 'id' | 'style' | 'children'
>;
type OmittedButtonAttributes = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className' | 'id' | 'style' | 'children'
>;

export type SidebarProviderProps = SncComponentWithChildren<
  OmittedDivAttributes & {
    /**
     * Uncontrolled initial open state, seeded from the `sidebar_state` cookie when present.
     * @default true
     */
    defaultOpen?: boolean;
    /**
     * Controlled open state. Supplying this takes over from the cookie/`defaultOpen`, matching
     * `Accordion`'s controlled/uncontrolled convention.
     */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    ref?: Ref<HTMLDivElement>;
  }
>;

export type SidebarProps = SncComponentWithChildren<
  Omit<OmittedDivAttributes, 'onClick'> & {
    /** @default 'left' */
    side?: SidebarSide;
    /** @default 'sidebar' */
    variant?: SidebarVariant;
    /** @default 'offcanvas' */
    collapsible?: SidebarCollapsible;
    /**
     * Renders a `SidebarTrigger` internally, owned by the nav itself, pinned to the given edge.
     * Intended for `collapsible="icon"`, where the rail stays on screen while collapsed. Under
     * `collapsible="offcanvas"` (the default) or on mobile-closed, the sidebar itself disappears,
     * taking an internal trigger with it — place a standalone `<SidebarTrigger />` in the main
     * content area for those cases instead (it works anywhere, not just inside `Sidebar`).
     */
    triggerPlacement?: 'top' | 'bottom';
    ref?: Ref<HTMLElement>;
  }
>;

export type SidebarTriggerProps = SncComponent<
  Omit<OmittedButtonAttributes, 'onClick'> & {
    /** Accessible name for the icon-only trigger button. @default 'Toggle Sidebar' */
    label?: string;
    onClick?: () => void;
    ref?: Ref<HTMLButtonElement>;
  }
>;

export type SidebarRailProps = SncComponent<
  OmittedButtonAttributes & {
    ref?: Ref<HTMLButtonElement>;
  }
>;

export type SidebarInsetProps = SncComponentWithChildren<
  OmittedDivAttributes & { ref?: Ref<HTMLElement> }
>;

export type SidebarInputProps = InputProps;

export type SidebarHeaderProps = SncComponentWithChildren<
  OmittedDivAttributes & { ref?: Ref<HTMLDivElement> }
>;

export type SidebarFooterProps = SncComponentWithChildren<
  OmittedDivAttributes & { ref?: Ref<HTMLDivElement> }
>;

export type SidebarSeparatorProps = SncComponent<{ ref?: Ref<HTMLHRElement> }>;

export type SidebarContentProps = SncComponentWithChildren<
  OmittedDivAttributes & { ref?: Ref<HTMLDivElement> }
>;

export type SidebarGroupProps = SncComponentWithChildren<
  OmittedDivAttributes & { ref?: Ref<HTMLDivElement> }
>;

export type SidebarGroupLabelProps = SncComponentWithChildren<
  OmittedDivAttributes & { ref?: Ref<HTMLDivElement> }
>;

export type SidebarGroupActionProps = SncComponentWithChildren<
  Omit<OmittedButtonAttributes, 'onClick'> & {
    /** Accessible name for the icon-only action button. */
    label: string;
    onClick?: () => void;
    ref?: Ref<HTMLButtonElement>;
  }
>;

export type SidebarGroupContentProps = SncComponentWithChildren<
  OmittedDivAttributes & { ref?: Ref<HTMLDivElement> }
>;

export type SidebarMenuProps = SncComponentWithChildren<{ ref?: Ref<HTMLUListElement> }>;

export type SidebarMenuItemProps = SncComponentWithChildren<{ ref?: Ref<HTMLLIElement> }>;

export type SidebarMenuButtonProps = SncComponentWithChildren<{
  /** @default 'md' */
  size?: keyof typeof Sizes;
  /** Applies the `primarySubtleBg`/`primary` active-row treatment. @default false */
  isActive?: boolean;
  /** Renders as `<a href>` instead of `<button>`, matching `ComplexNavigationMenu`'s idiom. */
  href?: string;
  onClick?: () => void;
  /**
   * Label shown in a `Tooltip` when the parent `Sidebar` is icon-collapsed on desktop. Omit to
   * show nothing while collapsed.
   */
  tooltip?: ReactNode;
  disabled?: boolean;
  ref?: Ref<HTMLAnchorElement | HTMLButtonElement>;
}>;

export type SidebarMenuActionProps = SncComponentWithChildren<{
  /** Accessible name for the icon-only action button. */
  label: string;
  onClick?: () => void;
  /** Only visible on row hover/focus. Still reachable by keyboard when `false`. @default false */
  isVisibleOnHover?: boolean;
  ref?: Ref<HTMLButtonElement>;
}>;

export type SidebarMenuBadgeProps = SncComponentWithChildren<
  OmittedDivAttributes & { ref?: Ref<HTMLDivElement> }
>;

export type SidebarMenuSkeletonProps = SncComponent<
  OmittedDivAttributes & {
    /** Shows the leading icon-sized placeholder circle too. @default true */
    hasIcon?: boolean;
    ref?: Ref<HTMLDivElement>;
  }
>;

export type SidebarMenuSubProps = SncComponentWithChildren<{ ref?: Ref<HTMLUListElement> }>;

export type SidebarMenuSubItemProps = SncComponentWithChildren<{ ref?: Ref<HTMLLIElement> }>;

export type SidebarMenuSubButtonProps = SncComponentWithChildren<{
  isActive?: boolean;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  ref?: Ref<HTMLAnchorElement | HTMLButtonElement>;
}>;
