import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useSidebar } from '../Sidebar.context';
import SidebarProvider from '../SidebarProvider';
import SidebarRail from './SidebarRail';

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
  const { state } = useSidebar();

  return <span data-testid="state">{state}</span>;
}

describe('SidebarRail', () => {
  beforeEach(() => {
    stubMatchMedia(false);
  });

  it('renders an accessible "Toggle Sidebar" button', () => {
    render(
      <SidebarProvider>
        <SidebarRail />
      </SidebarProvider>,
    );

    expect(screen.getByRole('button', { name: 'Toggle Sidebar' })).toBeInTheDocument();
  });

  it('clicking toggles the sidebar open state', async () => {
    const user = userEvent.setup();
    render(
      <SidebarProvider>
        <SidebarRail />
        <StateLabel />
      </SidebarProvider>,
    );

    expect(screen.getByTestId('state')).toHaveTextContent('expanded');

    await user.click(screen.getByRole('button', { name: 'Toggle Sidebar' }));

    expect(screen.getByTestId('state')).toHaveTextContent('collapsed');
  });
});
