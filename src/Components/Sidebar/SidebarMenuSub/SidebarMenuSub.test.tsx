import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Sidebar from '../Sidebar';
import SidebarMenuSubButton from '../SidebarMenuSubButton';
import SidebarMenuSubItem from '../SidebarMenuSubItem';
import SidebarProvider from '../SidebarProvider';
import SidebarMenuSub from './SidebarMenuSub';

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

describe('SidebarMenuSub', () => {
  beforeEach(() => {
    stubMatchMedia(false);
  });

  it('renders nested sub-items', () => {
    render(
      <SidebarProvider>
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton href="/dashboard/overview">Overview</SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </SidebarProvider>,
    );

    expect(screen.getByRole('link', { name: 'Overview' })).toBeInTheDocument();
  });

  it('is visible when the sidebar is expanded', () => {
    render(
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarMenuSub data-testid="sub">
            <SidebarMenuSubItem>
              <SidebarMenuSubButton>Overview</SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </Sidebar>
      </SidebarProvider>,
    );

    expect(screen.getByTestId('sub')).toBeVisible();
  });

  it('is hidden when the sidebar is icon-collapsed', () => {
    render(
      <SidebarProvider defaultOpen={false}>
        <Sidebar collapsible="icon">
          <SidebarMenuSub data-testid="sub">
            <SidebarMenuSubItem>
              <SidebarMenuSubButton>Overview</SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </Sidebar>
      </SidebarProvider>,
    );

    expect(screen.getByTestId('sub')).not.toBeVisible();
  });
});
