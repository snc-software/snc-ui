import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import TableInputFilterMenu from './TableInputFilterMenu';

import type { TableFilter } from '../../../../Table.types';

function renderMenu(overrides: Partial<Parameters<typeof TableInputFilterMenu>[0]> = {}) {
  const props = {
    columnId: 'name',
    title: 'Name',
    filters: [] as TableFilter[],
    onClose: vi.fn(),
    onFiltersSet: vi.fn(),
    onFiltersCleared: vi.fn(),
    ...overrides,
  };

  render(<TableInputFilterMenu {...props} />);

  return props;
}

describe('TableInputFilterMenu', () => {
  it('renders a labelled filter field', () => {
    renderMenu();

    expect(screen.getByRole('textbox', { name: 'Filter by name' })).toBeInTheDocument();
  });

  it('renders a default placeholder derived from the column title', () => {
    renderMenu();

    expect(screen.getByPlaceholderText('Start typing name')).toBeInTheDocument();
  });

  it('renders a consumer-supplied placeholder', () => {
    renderMenu({ placeholder: 'Find a person' });

    expect(screen.getByPlaceholderText('Find a person')).toBeInTheDocument();
  });

  it('pre-populates the field from the active filter', () => {
    renderMenu({ filters: [{ id: 'name', title: 'Name', value: 'Ada' }] });

    expect(screen.getByRole('textbox', { name: 'Filter by name' })).toHaveValue('Ada');
  });

  it('disables the search control while the field is empty', () => {
    renderMenu();

    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
  });

  it('applies the filter and calls onFiltersSet when Search is activated', async () => {
    const user = userEvent.setup();
    const props = renderMenu();

    await user.type(screen.getByRole('textbox', { name: 'Filter by name' }), 'Ada');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(props.onFiltersSet).toHaveBeenCalledWith([
      { id: 'name', title: 'Name', text: 'Ada', value: 'Ada' },
    ]);
  });

  it('closes after applying the filter', async () => {
    const user = userEvent.setup();
    const props = renderMenu();

    await user.type(screen.getByRole('textbox', { name: 'Filter by name' }), 'Ada');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('submits the filter on Enter', async () => {
    const user = userEvent.setup();
    const props = renderMenu();

    await user.type(screen.getByRole('textbox', { name: 'Filter by name' }), 'Ada{Enter}');

    expect(props.onFiltersSet).toHaveBeenCalledTimes(1);
  });

  it('does not submit on Enter while the field is empty', async () => {
    const user = userEvent.setup();
    const props = renderMenu();

    await user.type(screen.getByRole('textbox', { name: 'Filter by name' }), '{Enter}');

    expect(props.onFiltersSet).not.toHaveBeenCalled();
  });

  it('disables the clear control when no filter is active', () => {
    renderMenu();

    expect(screen.getByRole('button', { name: 'Clear' })).toBeDisabled();
  });

  it('clears the filter and calls onFiltersCleared with the column id', async () => {
    const user = userEvent.setup();
    const props = renderMenu({ filters: [{ id: 'name', title: 'Name', value: 'Ada' }] });

    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(props.onFiltersCleared).toHaveBeenCalledWith(['name']);
  });

  it('hides the clear control when isClearable is false', () => {
    renderMenu({ isClearable: false });

    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('closes without changes when Cancel is activated', async () => {
    const user = userEvent.setup();
    const props = renderMenu();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(props.onClose).toHaveBeenCalledTimes(1);
    expect(props.onFiltersSet).not.toHaveBeenCalled();
  });
});
