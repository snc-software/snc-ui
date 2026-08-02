import { Community, Home, Plus, Reports, Search, Settings } from 'iconoir-react';
import { useState } from 'react';

import Avatar from '@/Components/Avatar';

import Sidebar from './Sidebar';
import { useSidebar } from './Sidebar.context';
import SidebarContent from './SidebarContent';
import SidebarFooter from './SidebarFooter';
import SidebarGroup from './SidebarGroup';
import SidebarGroupAction from './SidebarGroupAction';
import SidebarGroupContent from './SidebarGroupContent';
import SidebarGroupLabel from './SidebarGroupLabel';
import SidebarHeader from './SidebarHeader';
import SidebarInput from './SidebarInput';
import SidebarInset from './SidebarInset';
import SidebarMenu from './SidebarMenu';
import SidebarMenuButton from './SidebarMenuButton';
import SidebarMenuItem from './SidebarMenuItem';
import SidebarMenuSub from './SidebarMenuSub';
import SidebarMenuSubButton from './SidebarMenuSubButton';
import SidebarMenuSubItem from './SidebarMenuSubItem';
import SidebarProvider from './SidebarProvider';
import SidebarRail from './SidebarRail';
import SidebarSeparator from './SidebarSeparator';
import SidebarTrigger from './SidebarTrigger';

import type { SidebarCollapsible, SidebarSide, SidebarVariant } from './Sidebar.types';
import type { Meta, StoryObj } from '@storybook/react-vite';

type DemoProps = {
  side?: SidebarSide;
  variant?: SidebarVariant;
  collapsible?: SidebarCollapsible;
};

/**
 * Demonstrates rendering different header content per collapse state by reading `useSidebar()`
 * directly — the same pattern `SidebarGroupLabel` uses internally. A search input makes sense
 * next to a full wordmark when expanded, but has no room (and no use) in the icon-only rail, so
 * it's replaced with a compact brand mark instead of being squeezed in.
 */
function SidebarBrandHeader() {
  const { state, collapsible, isMobile } = useSidebar();
  const isCollapsedToIcon = !isMobile && collapsible === 'icon' && state === 'collapsed';

  if (isCollapsedToIcon) {
    return (
      <div
        aria-label="Acme"
        style={{
          display: 'flex',
          height: 32,
          width: 32,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
          fontFamily: 'var(--snc-font-family-heading)',
          fontWeight: 700,
          color: 'var(--snc-primary)',
        }}
      >
        A
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          padding: '0 4px',
          fontFamily: 'var(--snc-font-family-heading)',
          fontWeight: 700,
          color: 'var(--snc-text-primary)',
        }}
      >
        Acme Inc
      </div>
      <SidebarInput aria-label="Search" placeholder="Search..." />
    </>
  );
}

/**
 * A full app-shell demonstration — `SidebarProvider` wrapping a `Sidebar` (collapse-aware header,
 * two standardised `SidebarGroup`s including a nested sub-menu, footer account row) and a
 * `SidebarInset` main content area. When `collapsible="icon"`, the nav owns its own trigger (via
 * `triggerPlacement`) since the rail stays on screen while collapsed; otherwise the main content
 * area keeps its own standalone `SidebarTrigger`, needed to reopen an off-canvas-collapsed sidebar.
 */
function AppShellDemo({ side, variant, collapsible }: DemoProps) {
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <div style={{ height: 560, display: 'flex', overflow: 'hidden' }}>
      <SidebarProvider>
        <Sidebar
          side={side}
          variant={variant}
          collapsible={collapsible}
          triggerPlacement={collapsible === 'icon' ? 'top' : undefined}
        >
          <SidebarHeader>
            <SidebarBrandHeader />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarGroupAction label="Add project">
                <Plus width={16} height={16} />
              </SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeItem === 'dashboard'}
                      tooltip="Dashboard"
                      onClick={() => setActiveItem('dashboard')}
                    >
                      <Home width={16} height={16} />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          isActive={activeItem === 'overview'}
                          onClick={() => setActiveItem('overview')}
                        >
                          Overview
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          isActive={activeItem === 'analytics'}
                          onClick={() => setActiveItem('analytics')}
                        >
                          Analytics
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeItem === 'reports'}
                      tooltip="Reports"
                      onClick={() => setActiveItem('reports')}
                    >
                      <Reports width={16} height={16} />
                      <span>Reports</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeItem === 'team'}
                      tooltip="Team"
                      onClick={() => setActiveItem('team')}
                    >
                      <Community width={16} height={16} />
                      <span>Team</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeItem === 'search'}
                      tooltip="Search"
                      onClick={() => setActiveItem('search')}
                    >
                      <Search width={16} height={16} />
                      <span>Search</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeItem === 'settings'}
                      tooltip="Settings"
                      onClick={() => setActiveItem('settings')}
                    >
                      <Settings width={16} height={16} />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <Avatar name="Ada Lovelace" />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: 12,
              borderBottom: '1px solid var(--snc-border)',
              color: 'var(--snc-text-primary)',
            }}
          >
            {collapsible !== 'icon' && <SidebarTrigger />}
            <span style={{ fontFamily: 'var(--snc-font-family-heading)', fontWeight: 600 }}>
              Dashboard
            </span>
          </div>
          <div style={{ padding: 16, color: 'var(--snc-text-secondary)' }}>Main content area.</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

const meta = {
  title: 'Components/Sidebar',
  component: AppShellDemo,
  tags: ['autodocs'],
} satisfies Meta<typeof AppShellDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * `collapsible="icon"` shrinks to an icon-only rail instead of hiding entirely. Click the
 * trigger (or the rail at the sidebar's edge) to collapse — each nav item's label then appears
 * in a `Tooltip` on hover.
 */
export const IconCollapsible: Story = {
  args: { collapsible: 'icon' },
};

/** `variant="floating"` — the sidebar renders as a bordered, shadowed panel with margin. */
export const FloatingVariant: Story = {
  args: { variant: 'floating', collapsible: 'icon' },
};

/**
 * `variant="inset"` — pairs with `SidebarInset`'s own matching panel treatment, so the main
 * content area reads as a floating card against the app background.
 */
export const InsetVariant: Story = {
  args: { variant: 'inset', collapsible: 'icon' },
};

/**
 * `side="right"` renders the sidebar on the trailing edge instead — paired here with
 * `collapsible="icon"` so the nav-owned trigger (`triggerPlacement`) renders correctly inside the
 * right-positioned rail.
 */
export const RightSide: Story = {
  args: { side: 'right', collapsible: 'icon' },
};

/**
 * Below the sidebar's mobile breakpoint (768px), `Sidebar` renders as a portalled off-canvas
 * sheet instead of the fixed desktop rail. Shrink the Storybook canvas/browser width below
 * 768px and click the trigger to see it.
 */
export const MobileSheet: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shrink the canvas below 768px wide, then click the trigger to open the sheet.',
      },
    },
  },
};
