import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import TableBodyCell from './TableBodyCell';

type Row = { name: string; status: string };

const row: Row = { name: 'Ada', status: 'active' };

function renderCell(ui: React.ReactNode) {
  return render(
    <table>
      <tbody>
        <tr>{ui}</tr>
      </tbody>
    </table>,
  );
}

describe('TableBodyCell', () => {
  it('renders the value as text when no custom renderer is supplied', () => {
    renderCell(<TableBodyCell<Row, string> value="Ada" row={row} />);

    expect(screen.getByRole('cell', { name: 'Ada' })).toBeInTheDocument();
  });

  it('renders a numeric value as text', () => {
    renderCell(<TableBodyCell<Row, number> value={42} row={row} />);

    expect(screen.getByRole('cell', { name: '42' })).toBeInTheDocument();
  });

  it('renders an empty cell for a null value', () => {
    renderCell(<TableBodyCell<Row, string | null> value={null} row={row} />);

    expect(screen.getByRole('cell')).toBeEmptyDOMElement();
  });

  it('renders an empty cell for an undefined value', () => {
    renderCell(<TableBodyCell<Row, string | undefined> value={undefined} row={row} />);

    expect(screen.getByRole('cell')).toBeEmptyDOMElement();
  });

  it('renders custom React content when a renderer is supplied', () => {
    renderCell(
      <TableBodyCell<Row, string>
        value="active"
        row={row}
        contents={(value) => <span data-testid="status-pill">{value}</span>}
      />,
    );

    expect(screen.getByTestId('status-pill')).toHaveTextContent('active');
  });

  it('passes both the value and the whole row to the renderer', () => {
    const contents = vi.fn(() => null);
    renderCell(<TableBodyCell<Row, string> value="active" row={row} contents={contents} />);

    expect(contents).toHaveBeenCalledWith('active', row);
  });

  it('applies a fixed width when supplied', () => {
    renderCell(<TableBodyCell<Row, string> value="Ada" row={row} width={200} />);

    expect(screen.getByRole('cell')).toHaveStyle({ width: '200px' });
  });

  it('merges a consumer-supplied className with the shared cell classes', () => {
    renderCell(<TableBodyCell<Row, string> value="Ada" row={row} className="custom-class" />);

    const cell = screen.getByRole('cell');

    expect(cell.className).toContain('custom-class');
    expect(cell.className).toContain('snc:p-3');
  });
});
