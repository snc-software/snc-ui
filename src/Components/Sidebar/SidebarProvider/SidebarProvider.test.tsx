import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SIDEBAR_COOKIE_NAME } from '../Sidebar.constants';
import { useSidebar } from '../Sidebar.context';
import SidebarProvider from './SidebarProvider';

import type { SidebarProviderProps } from '../Sidebar.types';

function StateConsumer() {
  const { state, openMobile, toggleSidebar } = useSidebar();

  return (
    <div>
      <span data-testid="state">{state}</span>
      <span data-testid="open-mobile">{String(openMobile)}</span>
      <button type="button" onClick={() => toggleSidebar()}>
        Toggle
      </button>
    </div>
  );
}

function ControlledHarness(
  props: Omit<SidebarProviderProps, 'open' | 'onOpenChange' | 'children'>,
) {
  const [open, setOpen] = useState(true);

  return (
    <SidebarProvider {...props} open={open} onOpenChange={setOpen}>
      <StateConsumer />
    </SidebarProvider>
  );
}

function clearCookie() {
  document.cookie = `${SIDEBAR_COOKIE_NAME}=; path=/; max-age=0`;
}

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

describe('SidebarProvider', () => {
  beforeEach(() => {
    stubMatchMedia(false);
  });

  afterEach(() => {
    clearCookie();
    vi.unstubAllGlobals();
  });

  it('renders its children', () => {
    render(
      <SidebarProvider>
        <div>App shell content</div>
      </SidebarProvider>,
    );

    expect(screen.getByText('App shell content')).toBeInTheDocument();
  });

  it('defaults to state="expanded" when defaultOpen is unset', () => {
    render(
      <SidebarProvider>
        <StateConsumer />
      </SidebarProvider>,
    );

    expect(screen.getByTestId('state')).toHaveTextContent('expanded');
  });

  it('defaultOpen={false} seeds state="collapsed"', () => {
    render(
      <SidebarProvider defaultOpen={false}>
        <StateConsumer />
      </SidebarProvider>,
    );

    expect(screen.getByTestId('state')).toHaveTextContent('collapsed');
  });

  it('in controlled mode, toggling calls onOpenChange and the reflected state updates', async () => {
    const user = userEvent.setup();
    render(<ControlledHarness />);

    expect(screen.getByTestId('state')).toHaveTextContent('expanded');

    await user.click(screen.getByRole('button', { name: 'Toggle' }));

    expect(screen.getByTestId('state')).toHaveTextContent('collapsed');
  });

  it('pressing Cmd/Ctrl+B toggles open', async () => {
    const user = userEvent.setup();
    render(
      <SidebarProvider>
        <StateConsumer />
      </SidebarProvider>,
    );

    expect(screen.getByTestId('state')).toHaveTextContent('expanded');

    await user.keyboard('{Control>}b{/Control}');

    expect(screen.getByTestId('state')).toHaveTextContent('collapsed');
  });

  it('persists open changes to the sidebar_state cookie', async () => {
    const user = userEvent.setup();
    render(
      <SidebarProvider>
        <StateConsumer />
      </SidebarProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Toggle' }));

    expect(document.cookie).toContain(`${SIDEBAR_COOKIE_NAME}=false`);
  });

  it('seeds initial state from an existing cookie when defaultOpen/open are not otherwise supplied', () => {
    document.cookie = `${SIDEBAR_COOKIE_NAME}=false; path=/`;

    render(
      <SidebarProvider>
        <StateConsumer />
      </SidebarProvider>,
    );

    expect(screen.getByTestId('state')).toHaveTextContent('collapsed');
  });

  it('toggleSidebar changes openMobile instead of open when the viewport is mobile', async () => {
    stubMatchMedia(true);
    const user = userEvent.setup();
    render(
      <SidebarProvider>
        <StateConsumer />
      </SidebarProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Toggle' }));

    expect(screen.getByTestId('open-mobile')).toHaveTextContent('true');
    expect(screen.getByTestId('state')).toHaveTextContent('expanded');
  });
});
