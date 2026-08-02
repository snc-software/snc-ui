import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import SidebarGroupAction from '../SidebarGroupAction';
import SidebarGroupContent from '../SidebarGroupContent';
import SidebarGroupLabel from '../SidebarGroupLabel';
import SidebarProvider from '../SidebarProvider';
import SidebarGroup from './SidebarGroup';

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

describe('SidebarGroup', () => {
  beforeEach(() => {
    stubMatchMedia(false);
  });

  it('renders a label, action, and content together with the standardised group class applied', () => {
    const { container } = render(
      <SidebarProvider>
        <SidebarGroup data-testid="group">
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupAction label="Add project">+</SidebarGroupAction>
          <SidebarGroupContent>Content</SidebarGroupContent>
        </SidebarGroup>
      </SidebarProvider>,
    );

    expect(screen.getByText('Platform')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add project' })).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="group"]')?.className).toContain('snc:p-2');
  });

  it('renders the same standardised spacing class regardless of which optional children are supplied', () => {
    const { container } = render(
      <SidebarProvider>
        <SidebarGroup data-testid="group">
          <SidebarGroupContent>Only content</SidebarGroupContent>
        </SidebarGroup>
      </SidebarProvider>,
    );

    expect(container.querySelector('[data-testid="group"]')?.className).toContain('snc:p-2');
  });
});
