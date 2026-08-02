import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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
import SidebarMenuAction from './SidebarMenuAction';
import SidebarMenuBadge from './SidebarMenuBadge';
import SidebarMenuButton from './SidebarMenuButton';
import SidebarMenuItem from './SidebarMenuItem';
import SidebarMenuSkeleton from './SidebarMenuSkeleton';
import SidebarMenuSub from './SidebarMenuSub';
import SidebarMenuSubButton from './SidebarMenuSubButton';
import SidebarMenuSubItem from './SidebarMenuSubItem';
import SidebarProvider from './SidebarProvider';
import SidebarSeparator from './SidebarSeparator';

function stubMatchMedia(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  );
}

describe('Sidebar', () => {
  beforeEach(() => {
    stubMatchMedia(false);
  });

  it('renders its children inside an <aside> landmark on desktop', () => {
    render(
      <SidebarProvider>
        <Sidebar>Nav content</Sidebar>
      </SidebarProvider>,
    );

    expect(screen.getByText('Nav content').closest('aside')).toBeInTheDocument();
  });

  it('collapses to zero width when collapsible="offcanvas" and state is collapsed', () => {
    render(
      <SidebarProvider defaultOpen={false}>
        <Sidebar collapsible="offcanvas" data-testid="sidebar">
          content
        </Sidebar>
      </SidebarProvider>,
    );

    expect(screen.getByTestId('sidebar')).toHaveStyle({ width: '0px' });
  });

  it('shrinks to the icon-only width when collapsible="icon" and state is collapsed', () => {
    render(
      <SidebarProvider defaultOpen={false}>
        <Sidebar collapsible="icon" data-testid="sidebar">
          content
        </Sidebar>
      </SidebarProvider>,
    );

    expect(screen.getByTestId('sidebar')).toHaveStyle({ width: '3rem' });
  });

  it('never collapses when collapsible="none"', () => {
    render(
      <SidebarProvider defaultOpen={false}>
        <Sidebar collapsible="none" data-testid="sidebar">
          content
        </Sidebar>
      </SidebarProvider>,
    );

    expect(screen.getByTestId('sidebar')).toHaveStyle({ width: '16rem' });
  });

  it('renders on the opposite edge when side="right"', () => {
    render(
      <SidebarProvider>
        <Sidebar side="right" data-testid="sidebar">
          content
        </Sidebar>
      </SidebarProvider>,
    );

    expect(screen.getByTestId('sidebar').className).toContain('snc:border-l');
  });

  it('does not render an internal trigger when triggerPlacement is omitted', () => {
    render(
      <SidebarProvider>
        <Sidebar>content</Sidebar>
      </SidebarProvider>,
    );

    expect(screen.queryByRole('button', { name: 'Toggle Sidebar' })).not.toBeInTheDocument();
  });

  it('renders an internal trigger when triggerPlacement="top"', () => {
    render(
      <SidebarProvider>
        <Sidebar triggerPlacement="top">content</Sidebar>
      </SidebarProvider>,
    );

    expect(screen.getByRole('button', { name: 'Toggle Sidebar' })).toBeInTheDocument();
  });

  it('renders an internal trigger when triggerPlacement="bottom"', () => {
    render(
      <SidebarProvider>
        <Sidebar triggerPlacement="bottom">content</Sidebar>
      </SidebarProvider>,
    );

    expect(screen.getByRole('button', { name: 'Toggle Sidebar' })).toBeInTheDocument();
  });

  it('applies the floating variant treatment', () => {
    render(
      <SidebarProvider>
        <Sidebar variant="floating" data-testid="sidebar">
          content
        </Sidebar>
      </SidebarProvider>,
    );

    expect(screen.getByTestId('sidebar').className).toContain('snc:shadow-lg');
  });

  describe('on mobile', () => {
    beforeEach(() => {
      stubMatchMedia(true);
    });

    it('renders nothing when openMobile is false', () => {
      render(
        <SidebarProvider>
          <Sidebar>Nav content</Sidebar>
        </SidebarProvider>,
      );

      expect(screen.queryByText('Nav content')).not.toBeInTheDocument();
    });

    it('renders as a portalled dialog into document.body when openMobile is true', async () => {
      const user = userEvent.setup();

      function Harness() {
        return (
          <SidebarProvider>
            <SidebarTriggerForTest />
            <Sidebar>
              <button type="button">Inside</button>
            </Sidebar>
          </SidebarProvider>
        );
      }

      const { container } = render(<Harness />);

      await user.click(screen.getByRole('button', { name: 'Open' }));

      expect(container.querySelector('[role="dialog"]')).toBeNull();
      expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('closes on Escape', async () => {
      const user = userEvent.setup();
      render(
        <SidebarProvider>
          <SidebarTriggerForTest />
          <Sidebar>
            <button type="button">Inside</button>
          </Sidebar>
        </SidebarProvider>,
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('closes on a backdrop click', async () => {
      const user = userEvent.setup();
      render(
        <SidebarProvider>
          <SidebarTriggerForTest />
          <Sidebar>
            <button type="button">Inside</button>
          </Sidebar>
        </SidebarProvider>,
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));
      const overlay = screen.getByRole('dialog').parentElement as HTMLElement;
      await user.click(overlay);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('moves focus into the sheet when opened', async () => {
      const user = userEvent.setup();
      render(
        <SidebarProvider>
          <SidebarTriggerForTest />
          <Sidebar>
            <button type="button">Inside</button>
          </Sidebar>
        </SidebarProvider>,
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      expect(screen.getByRole('dialog')).toHaveFocus();
    });

    it('traps Tab focus from the last focusable element back to the first', async () => {
      const user = userEvent.setup();
      render(
        <SidebarProvider>
          <SidebarTriggerForTest />
          <Sidebar>
            <button type="button">First</button>
            <button type="button">Last</button>
          </Sidebar>
        </SidebarProvider>,
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));
      screen.getByRole('button', { name: 'Last' }).focus();
      await user.tab();

      expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
    });

    it('traps Shift+Tab focus from the first focusable element back to the last', async () => {
      const user = userEvent.setup();
      render(
        <SidebarProvider>
          <SidebarTriggerForTest />
          <Sidebar>
            <button type="button">First</button>
            <button type="button">Last</button>
          </Sidebar>
        </SidebarProvider>,
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));
      screen.getByRole('button', { name: 'First' }).focus();
      await user.tab({ shift: true });

      expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus();
    });

    it('does not throw when Tab is pressed with no focusable content in the sheet', async () => {
      const user = userEvent.setup();
      render(
        <SidebarProvider>
          <SidebarTriggerForTest />
          <Sidebar>
            <span>No focusable content</span>
          </Sidebar>
        </SidebarProvider>,
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));
      await user.tab();

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('returns focus to the previously focused element when closed', async () => {
      const user = userEvent.setup();
      render(
        <SidebarProvider>
          <SidebarTriggerForTest />
          <Sidebar>
            <button type="button">Inside</button>
          </Sidebar>
        </SidebarProvider>,
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));
      await user.keyboard('{Escape}');

      expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus();
    });
  });

  describe('presentational leaf sub-components', () => {
    it('renders SidebarHeader, SidebarContent, and SidebarFooter with their children', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>Header</SidebarHeader>
            <SidebarContent>Content</SidebarContent>
            <SidebarFooter>Footer</SidebarFooter>
          </Sidebar>
        </SidebarProvider>,
      );

      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('renders SidebarSeparator as an <hr>', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarSeparator />
          </Sidebar>
        </SidebarProvider>,
      );

      expect(document.querySelector('hr')).toBeInTheDocument();
    });

    it('renders SidebarInput as a text input', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarInput aria-label="Search" placeholder="Search..." />
          </Sidebar>
        </SidebarProvider>,
      );

      expect(screen.getByRole('textbox', { name: 'Search' })).toHaveAttribute(
        'placeholder',
        'Search...',
      );
    });

    it('applies the inset panel treatment to SidebarInset when the sibling Sidebar is variant="inset"', () => {
      render(
        <SidebarProvider>
          <Sidebar variant="inset">nav</Sidebar>
          <SidebarInset data-testid="inset">main</SidebarInset>
        </SidebarProvider>,
      );

      expect(screen.getByTestId('inset').className).toContain('snc:rounded-lg');
    });

    it('renders a full SidebarGroup/SidebarMenu composition', async () => {
      const user = userEvent.setup();
      const onGroupAction = vi.fn();
      const onMenuAction = vi.fn();

      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarGroupAction label="Add" onClick={onGroupAction}>
                +
              </SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Dashboard</SidebarMenuButton>
                    <SidebarMenuAction label="More" onClick={onMenuAction}>
                      ...
                    </SidebarMenuAction>
                    <SidebarMenuBadge>3</SidebarMenuBadge>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="/dashboard/overview">
                          Overview
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </Sidebar>
        </SidebarProvider>,
      );

      expect(screen.getByText('Platform')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Overview' })).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Add' }));
      expect(onGroupAction).toHaveBeenCalledTimes(1);

      await user.click(screen.getByRole('button', { name: 'More' }));
      expect(onMenuAction).toHaveBeenCalledTimes(1);
    });

    it('renders SidebarMenuSkeleton with an icon placeholder by default', () => {
      const { container } = render(
        <SidebarProvider>
          <Sidebar>
            <SidebarMenuSkeleton data-testid="skeleton" />
          </Sidebar>
        </SidebarProvider>,
      );

      expect(screen.getByTestId('skeleton').children.length).toBe(2);
      expect(container.querySelectorAll('.snc\\:animate-pulse').length).toBe(2);
    });

    it('omits the icon placeholder from SidebarMenuSkeleton when hasIcon is false', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarMenuSkeleton hasIcon={false} data-testid="skeleton" />
          </Sidebar>
        </SidebarProvider>,
      );

      expect(screen.getByTestId('skeleton').children.length).toBe(1);
    });
  });
});

// A plain button driving `openMobile` directly via `useSidebar()`, so these tests can open the
// mobile sheet without depending on `SidebarTrigger`'s own test file.
function SidebarTriggerForTest() {
  const { setOpenMobile } = useSidebar();

  return (
    <button type="button" onClick={() => setOpenMobile(true)}>
      Open
    </button>
  );
}
