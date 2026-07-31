import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import PageSizeSelector from './PageSizeSelector';

function renderSelector(overrides: Partial<Parameters<typeof PageSizeSelector>[0]> = {}) {
  const props = {
    value: 20,
    options: [20, 50, 100],
    onChange: vi.fn(),
    ...overrides,
  };

  render(<PageSizeSelector {...props} />);

  return props;
}

describe('PageSizeSelector', () => {
  it('renders a labelled page size control', () => {
    renderSelector();

    expect(screen.getByRole('combobox', { name: 'Rows per page' })).toBeInTheDocument();
  });

  it('renders an option per supplied page size', async () => {
    const user = userEvent.setup();
    renderSelector();

    await user.click(screen.getByRole('combobox', { name: 'Rows per page' }));

    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('reflects the current page size', () => {
    renderSelector({ value: 50 });

    expect(screen.getByRole('combobox', { name: 'Rows per page' })).toHaveTextContent('50');
  });

  it('renders the per page caption', () => {
    renderSelector();

    expect(screen.getByText('per page')).toBeInTheDocument();
  });

  it('calls onChange with the chosen size as a number', async () => {
    const user = userEvent.setup();
    const props = renderSelector();

    await user.click(screen.getByRole('combobox', { name: 'Rows per page' }));
    await user.click(screen.getByRole('option', { name: '50' }));

    expect(props.onChange).toHaveBeenCalledWith(50);
  });

  it('does not allow selection when disabled', () => {
    renderSelector({ disabled: true });

    expect(screen.getByRole('combobox', { name: 'Rows per page' })).toBeDisabled();
  });
});
