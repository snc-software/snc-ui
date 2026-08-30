import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Sidebar from '../Sidebar';
import SidebarProvider from '../SidebarProvider';
import SidebarMenuButton from './SidebarMenuButton';

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

describe('SidebarMenuButton', () => {
  beforeEach(() => {
    stubMatchMedia(false);
  });

  it('renders an <a href> when href is supplied', () => {
    render(
      <SidebarProvider>
        <SidebarMenuButton href="/dashboard">Dashboard</SidebarMenuButton>
      </SidebarProvider>,
    );

    const link = screen.getByRole('link', { name: 'Dashboard' });

    expect(link).toHaveAttribute('href', '/dashboard');
  });

  it('renders a <button type="button"> when href is not supplied', () => {
    render(
      <SidebarProvider>
        <SidebarMenuButton>Dashboard</SidebarMenuButton>
      </SidebarProvider>,
    );

    expect(screen.getByRole('button', { name: 'Dashboard' })).toHaveAttribute('type', 'button');
  });

  it('applies the active-row treatment when isActive is true', () => {
    render(
      <SidebarProvider>
        <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
      </SidebarProvider>,
    );

    const button = screen.getByRole('button', { name: 'Dashboard' });

    expect(button.className).toContain('snc:bg-snc-primary-subtle-bg');
    expect(button).toHaveAttribute('aria-current', 'page');
  });

  it.each(['sm', 'md', 'lg'] as const)('applies the %s size class', (size) => {
    render(
      <SidebarProvider>
        <SidebarMenuButton size={size}>Dashboard</SidebarMenuButton>
      </SidebarProvider>,
    );

    const button = screen.getByRole('button', { name: 'Dashboard' });

    expect(button.className).toContain('snc:h-');
  });

  it('disabled prevents onClick from firing and disables the native button', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <SidebarProvider>
        <SidebarMenuButton disabled onClick={onClick}>
          Dashboard
        </SidebarMenuButton>
      </SidebarProvider>,
    );

    const button = screen.getByRole('button', { name: 'Dashboard' });

    expect(button).toBeDisabled();

    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('calls the supplied onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <SidebarProvider>
        <SidebarMenuButton onClick={onClick}>Dashboard</SidebarMenuButton>
      </SidebarProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Dashboard' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is not wrapped in a tooltip when the sidebar is not icon-collapsed', () => {
    render(
      <SidebarProvider>
        <SidebarMenuButton tooltip="Dashboard">
          <span>D</span>
        </SidebarMenuButton>
      </SidebarProvider>,
    );

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('is wrapped in a visible tooltip when the sidebar is icon-collapsed and tooltip is supplied', async () => {
    const user = userEvent.setup();
    render(
      <SidebarProvider defaultOpen={false}>
        <Sidebar collapsible="icon">
          <SidebarMenuButton tooltip="Dashboard">
            <span>D</span>
          </SidebarMenuButton>
        </Sidebar>
      </SidebarProvider>,
    );

    await user.hover(screen.getByRole('button'));

    // `Tooltip` waits for its default 2000ms show delay before appearing.
    expect(await screen.findByRole('tooltip', {}, { timeout: 3000 })).toHaveTextContent(
      'Dashboard',
    );
  });
});
