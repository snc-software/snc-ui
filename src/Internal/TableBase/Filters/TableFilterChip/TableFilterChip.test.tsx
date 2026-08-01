import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import TableFilterChip from './TableFilterChip';

describe('TableFilterChip', () => {
  it('renders the filter title', () => {
    render(<TableFilterChip title="Status" value="Active" onClear={vi.fn()} />);

    expect(screen.getByText('Status:')).toBeInTheDocument();
  });

  it('renders the filter value', () => {
    render(<TableFilterChip title="Status" value="Active" onClear={vi.fn()} />);

    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders a labelled clear control', () => {
    render(<TableFilterChip title="Status" value="Active" onClear={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Clear status filter' })).toBeInTheDocument();
  });

  it('calls onClear when the clear control is activated', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<TableFilterChip title="Status" value="Active" onClear={onClear} />);

    await user.click(screen.getByRole('button', { name: 'Clear status filter' }));

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('applies the status-pill styling from the design system', () => {
    const { container } = render(
      <TableFilterChip title="Status" value="Active" onClear={vi.fn()} />,
    );

    const chip = container.firstElementChild;

    expect(chip?.className).toContain('snc:rounded-full');
    expect(chip?.className).toContain('snc:bg-snc-info-bg');
  });
});
