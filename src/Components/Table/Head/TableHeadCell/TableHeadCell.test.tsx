import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import TableHeadCell from './TableHeadCell';

import type { TableColumn, TableFilter } from '../../Table.types';

type Row = { name: string; status: string };

const basicColumn: TableColumn<Row> = {
  id: 'name',
  title: 'Name',
  accessor: (row) => row.name,
};

function renderCell(overrides: Partial<Parameters<typeof TableHeadCell<Row>>[0]> = {}) {
  const props = {
    column: basicColumn,
    filters: [] as TableFilter[],
    onFiltersSet: vi.fn(),
    onFiltersCleared: vi.fn(),
    ...overrides,
  };

  render(
    <table>
      <thead>
        <tr>
          <TableHeadCell<Row> {...props} />
        </tr>
      </thead>
    </table>,
  );

  return props;
}

describe('TableHeadCell', () => {
  it('renders the column title as a column header', () => {
    renderCell();

    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
  });

  it('renders custom header content when the column supplies header', () => {
    renderCell({
      column: { ...basicColumn, header: (title) => <em>{title} column</em> },
    });

    expect(screen.getByText('Name column')).toBeInTheDocument();
  });

  it('does not render a sort control when no sort handler is supplied', () => {
    renderCell();

    expect(screen.queryByRole('button', { name: /sort by/i })).not.toBeInTheDocument();
  });

  it('renders a sort control when a sort handler is supplied', () => {
    renderCell({ onSortChanged: vi.fn() });

    expect(screen.getByRole('button', { name: 'Sort by name' })).toBeInTheDocument();
  });

  it('requests ascending sort from the unsorted state', async () => {
    const user = userEvent.setup();
    const onSortChanged = vi.fn();
    renderCell({ onSortChanged });

    await user.click(screen.getByRole('button', { name: 'Sort by name' }));

    expect(onSortChanged).toHaveBeenCalledWith('name', 'asc');
  });

  it('requests descending sort from the ascending state', async () => {
    const user = userEvent.setup();
    const onSortChanged = vi.fn();
    renderCell({ onSortChanged, sortDirection: 'asc' });

    await user.click(screen.getByRole('button', { name: 'Sort by name' }));

    expect(onSortChanged).toHaveBeenCalledWith('name', 'desc');
  });

  it('requests unsorted from the descending state', async () => {
    const user = userEvent.setup();
    const onSortChanged = vi.fn();
    renderCell({ onSortChanged, sortDirection: 'desc' });

    await user.click(screen.getByRole('button', { name: 'Sort by name' }));

    expect(onSortChanged).toHaveBeenCalledWith('name', undefined);
  });

  it('reports aria-sort none while sortable but unsorted', () => {
    renderCell({ onSortChanged: vi.fn() });

    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'none');
  });

  it('reports aria-sort ascending when sorted ascending', () => {
    renderCell({ onSortChanged: vi.fn(), sortDirection: 'asc' });

    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'ascending');
  });

  it('reports aria-sort descending when sorted descending', () => {
    renderCell({ onSortChanged: vi.fn(), sortDirection: 'desc' });

    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'descending');
  });

  it('omits aria-sort entirely when the column is not sortable', () => {
    renderCell();

    expect(screen.getByRole('columnheader')).not.toHaveAttribute('aria-sort');
  });

  it('does not render a filter trigger for a column without a filterType', () => {
    renderCell();

    expect(screen.queryByRole('button', { name: /filter by/i })).not.toBeInTheDocument();
  });

  it('renders a filter trigger for a column with a filterType', () => {
    renderCell({ column: { ...basicColumn, filterType: 'input' } });

    expect(screen.getByRole('button', { name: 'Filter by name' })).toBeInTheDocument();
  });

  it('reports the filter trigger as collapsed while closed', () => {
    renderCell({ column: { ...basicColumn, filterType: 'input' } });

    expect(screen.getByRole('button', { name: 'Filter by name' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('opens the input filter menu when the trigger is activated', async () => {
    const user = userEvent.setup();
    renderCell({ column: { ...basicColumn, filterType: 'input' } });

    await user.click(screen.getByRole('button', { name: 'Filter by name' }));

    expect(screen.getByRole('textbox', { name: 'Filter by name' })).toBeInTheDocument();
  });

  it('opens the dropdown filter menu when the trigger is activated', async () => {
    const user = userEvent.setup();
    renderCell({
      column: {
        ...basicColumn,
        filterType: 'dropdown',
        options: [{ value: 'active', label: 'Active' }],
      },
    });

    await user.click(screen.getByRole('button', { name: 'Filter by name' }));

    expect(screen.getByRole('combobox', { name: 'Filter by name' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  // Regression: the Select portals its panel outside the popover's subtree, so without layer
  // tracking the popover reads an option click as an outside click and closes.
  it('keeps the dropdown filter menu open while choosing from its select', async () => {
    const user = userEvent.setup();
    renderCell({
      column: {
        ...basicColumn,
        filterType: 'dropdown',
        options: [{ value: 'active', label: 'Active' }],
      },
    });

    await user.click(screen.getByRole('button', { name: 'Filter by name' }));
    await user.click(screen.getByRole('combobox', { name: 'Filter by name' }));
    await user.click(screen.getByRole('option', { name: 'Active' }));

    expect(screen.getByRole('combobox', { name: 'Filter by name' })).toHaveTextContent('Active');
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('closes only the select, not the whole menu, when Escape is pressed in the select', async () => {
    const user = userEvent.setup();
    renderCell({
      column: {
        ...basicColumn,
        filterType: 'dropdown',
        options: [{ value: 'active', label: 'Active' }],
      },
    });

    await user.click(screen.getByRole('button', { name: 'Filter by name' }));
    await user.click(screen.getByRole('combobox', { name: 'Filter by name' }));
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('renders custom filter menu content for a custom filter column', async () => {
    const user = userEvent.setup();
    renderCell({
      column: {
        ...basicColumn,
        filterType: 'custom',
        filterIcon: () => <span>icon</span>,
        menu: () => <p>Custom menu</p>,
      },
    });

    await user.click(screen.getByRole('button', { name: 'Filter by name' }));

    expect(screen.getByText('Custom menu')).toBeInTheDocument();
  });

  it('applies a fixed column width when the column supplies one', () => {
    renderCell({ column: { ...basicColumn, width: 240 } });

    expect(screen.getByRole('columnheader')).toHaveStyle({ width: '240px' });
  });
});
