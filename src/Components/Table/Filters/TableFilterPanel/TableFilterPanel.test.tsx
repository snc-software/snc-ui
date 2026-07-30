import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import TableFilterPanel from './TableFilterPanel';

import type { TableFilter } from '../../Table.types';

const filters: TableFilter[] = [
  { id: 'name', title: 'Name', text: 'Ada', value: 'Ada' },
  { id: 'status', title: 'Status', text: 'Active', value: 'active' },
];

function renderPanel(overrides: Partial<Parameters<typeof TableFilterPanel>[0]> = {}) {
  const props = {
    filters,
    onFilterCleared: vi.fn(),
    onAllFiltersCleared: vi.fn(),
    ...overrides,
  };

  render(<TableFilterPanel {...props} />);

  return props;
}

describe('TableFilterPanel', () => {
  it('renders one chip per active filter', () => {
    renderPanel();

    expect(screen.getByText('Name:')).toBeInTheDocument();
    expect(screen.getByText('Status:')).toBeInTheDocument();
  });

  it('renders the user-friendly filter text on the chip', () => {
    renderPanel();

    expect(screen.getByText('Ada')).toBeInTheDocument();
  });

  it('falls back to the raw value when no display text is supplied', () => {
    renderPanel({ filters: [{ id: 'name', title: 'Name', value: 'Grace' }] });

    expect(screen.getByText('Grace')).toBeInTheDocument();
  });

  it('calls onFilterCleared with the filter id when a chip is cleared', async () => {
    const user = userEvent.setup();
    const props = renderPanel();

    await user.click(screen.getByRole('button', { name: 'Clear name filter' }));

    expect(props.onFilterCleared).toHaveBeenCalledWith('name');
  });

  it('calls onAllFiltersCleared when Clear All is activated', async () => {
    const user = userEvent.setup();
    const props = renderPanel();

    await user.click(screen.getByRole('button', { name: 'Clear All' }));

    expect(props.onAllFiltersCleared).toHaveBeenCalledTimes(1);
  });

  it('hides the scroll controls when the chips fit', () => {
    renderPanel();

    expect(screen.queryByRole('button', { name: 'Scroll filters left' })).not.toBeInTheDocument();
  });

  it('renders no chips when there are no filters', () => {
    renderPanel({ filters: [] });

    expect(screen.queryByText('Name:')).not.toBeInTheDocument();
  });
});
