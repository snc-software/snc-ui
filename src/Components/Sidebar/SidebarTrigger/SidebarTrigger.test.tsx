import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Sidebar from '../Sidebar';
import { useSidebar } from '../Sidebar.context';
import SidebarProvider from '../SidebarProvider';
import SidebarTrigger from './SidebarTrigger';

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

function StateLabel() {
  const { state, openMobile } = useSidebar();

  return <span data-testid="state">{`${state}/${openMobile}`}</span>;
}

describe('SidebarTrigger', () => {
  beforeEach(() => {
    stubMatchMedia(false);
  });

  it('defaults its accessible name to "Toggle Sidebar"', () => {
    render(
      <SidebarProvider>
        <SidebarTrigger />
      </SidebarProvider>,
    );

    expect(screen.getByRole('button', { name: 'Toggle Sidebar' })).toBeInTheDocument();
  });

  it('accepts a custom accessible name via label', () => {
    render(
      <SidebarProvider>
        <SidebarTrigger label="Show navigation" />
      </SidebarProvider>,
    );

    expect(screen.getByRole('button', { name: 'Show navigation' })).toBeInTheDocument();
  });

  it('clicking toggles the desktop open state', async () => {
    const user = userEvent.setup();
    render(
      <SidebarProvider>
        <SidebarTrigger />
        <StateLabel />
      </SidebarProvider>,
    );

    expect(screen.getByTestId('state')).toHaveTextContent('expanded/false');

    await user.click(screen.getByRole('button', { name: 'Toggle Sidebar' }));

    expect(screen.getByTestId('state')).toHaveTextContent('collapsed/false');
  });

  it('calls a consumer-supplied onClick alongside the toggle', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <SidebarProvider>
        <SidebarTrigger onClick={onClick} />
      </SidebarProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Toggle Sidebar' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows a different icon when expanded vs collapsed', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <SidebarProvider>
        <SidebarTrigger />
      </SidebarProvider>,
    );

    const expandedIconMarkup = container.querySelector('svg')?.innerHTML;

    await user.click(screen.getByRole('button', { name: 'Toggle Sidebar' }));

    const collapsedIconMarkup = container.querySelector('svg')?.innerHTML;

    expect(collapsedIconMarkup).not.toEqual(expandedIconMarkup);
  });

  it('mirrors the icon when the parent Sidebar side is "right"', () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar side="right">
          <SidebarTrigger />
        </Sidebar>
      </SidebarProvider>,
    );

    expect(container.querySelector('svg')).toHaveClass('snc:-scale-x-100');
  });

  it('does not mirror the icon when the parent Sidebar side is "left" (default)', () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar>
          <SidebarTrigger />
        </Sidebar>
      </SidebarProvider>,
    );

    expect(container.querySelector('svg')).not.toHaveClass('snc:-scale-x-100');
  });
});
