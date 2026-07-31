import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import TableBodyRow from './TableBodyRow';

import type { TableColumn } from '../../Table.types';

type Row = { name: string; status: string };

const columns: Array<TableColumn<Row>> = [
  { id: 'name', title: 'Name', accessor: (row) => row.name },
  { id: 'status', title: 'Status', accessor: (row) => row.status },
];

const row: Row = { name: 'Ada', status: 'active' };

function renderRow(overrides: Partial<Parameters<typeof TableBodyRow<Row>>[0]> = {}) {
  const props = {
    columns,
    row,
    rowIndex: 0,
    ...overrides,
  };

  render(
    <table>
      <tbody>
        <TableBodyRow<Row> {...props} />
      </tbody>
    </table>,
  );

  return props;
}

describe('TableBodyRow', () => {
  it('renders a cell per column', () => {
    renderRow();

    expect(screen.getAllByRole('cell')).toHaveLength(2);
  });

  it('renders each accessed value', () => {
    renderRow();

    expect(screen.getByRole('cell', { name: 'Ada' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'active' })).toBeInTheDocument();
  });

  it('renders custom cell content supplied by a column', () => {
    renderRow({
      columns: [
        { ...columns[0] },
        { ...columns[1], cell: (value) => <span data-testid="pill">{String(value)}</span> },
      ],
    });

    expect(screen.getByTestId('pill')).toHaveTextContent('active');
  });

  it('is not interactive when no row click handler is supplied', () => {
    renderRow();

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onRowClicked with the row when activated', async () => {
    const user = userEvent.setup();
    const onRowClicked = vi.fn();
    renderRow({ onRowClicked });

    await user.click(screen.getByRole('button'));

    expect(onRowClicked).toHaveBeenCalledWith(row);
  });

  it('is keyboard operable when clickable', async () => {
    const user = userEvent.setup();
    const onRowClicked = vi.fn();
    renderRow({ onRowClicked });

    await user.tab();
    await user.keyboard('{Enter}');

    expect(onRowClicked).toHaveBeenCalledWith(row);
  });

  it('applies the clickable styling when a row click handler is supplied', () => {
    renderRow({ onRowClicked: vi.fn() });

    expect(screen.getByTestId('body-row-0').className).toContain('snc:cursor-pointer');
  });

  it('applies selected styling to a selected row', () => {
    renderRow({ isSelected: true });

    expect(screen.getByTestId('body-row-0').className).toContain('snc:bg-snc-primary-subtle-bg');
  });

  it('renders no selection checkbox when selection is disabled', () => {
    renderRow();

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('renders a labelled selection checkbox when selection is enabled', () => {
    renderRow({ isSelectionEnabled: true });

    expect(screen.getByRole('checkbox', { name: 'Select row 1' })).toBeInTheDocument();
  });

  it('calls onSelectChanged when the row checkbox is activated', async () => {
    const user = userEvent.setup();
    const onSelectChanged = vi.fn();
    renderRow({ isSelectionEnabled: true, onSelectChanged });

    await user.click(screen.getByRole('checkbox', { name: 'Select row 1' }));

    expect(onSelectChanged).toHaveBeenCalledWith(row, true);
  });

  it('does not call onRowClicked when the row checkbox is activated', async () => {
    const user = userEvent.setup();
    const onRowClicked = vi.fn();
    renderRow({ isSelectionEnabled: true, onRowClicked, onSelectChanged: vi.fn() });

    await user.click(screen.getByRole('checkbox', { name: 'Select row 1' }));

    expect(onRowClicked).not.toHaveBeenCalled();
  });

  it('disables the row checkbox when the row is not selectable', () => {
    renderRow({ isSelectionEnabled: true, isSelectable: false });

    expect(screen.getByRole('checkbox', { name: 'Select row 1' })).toBeDisabled();
  });
});
