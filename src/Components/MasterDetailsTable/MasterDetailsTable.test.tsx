import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import MasterDetailsTable from './MasterDetailsTable';

import type { TableColumn } from '@/Components/Table';

type Message = { subject: string; from: string; body: string };

const columns: Array<TableColumn<Message>> = [
  { id: 'subject', title: 'Subject', accessor: (row) => row.subject, isSortable: true },
  { id: 'from', title: 'From', accessor: (row) => row.from },
];

const messages: Message[] = [
  { subject: 'Release notes', from: 'Ada', body: 'Ships Friday' },
  { subject: 'Standup', from: 'Grace', body: 'Ten past nine' },
];

function renderMasterDetailsTable(
  overrides: Partial<Parameters<typeof MasterDetailsTable<Message>>[0]> = {},
) {
  const props = {
    columns,
    data: messages,
    // Larger than the page size so the pagination controls have somewhere to go.
    total: 40,
    onFetchRequested: vi.fn(),
    detail: (row: Message) => <p>{row.body}</p>,
    ...overrides,
  };

  render(<MasterDetailsTable<Message> {...props} />);

  return props;
}

describe('MasterDetailsTable', () => {
  it('renders a column header for every column while no row is open', () => {
    renderMasterDetailsTable();

    expect(screen.getByRole('columnheader', { name: /subject/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /from/i })).toBeInTheDocument();
  });

  it('renders one row per data item', () => {
    renderMasterDetailsTable();

    expect(screen.getByRole('cell', { name: 'Release notes' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Standup' })).toBeInTheDocument();
  });

  it('does not render the detail pane before a row is opened', () => {
    renderMasterDetailsTable();

    expect(screen.queryByText('Ships Friday')).not.toBeInTheDocument();
  });

  it('opens the detail pane when a row is clicked', async () => {
    const user = userEvent.setup();
    renderMasterDetailsTable();

    await user.click(screen.getByRole('button', { name: /Release notes/ }));

    expect(screen.getByText('Ships Friday')).toBeInTheDocument();
  });

  it('opens the detail pane when Enter is pressed on a row', async () => {
    const user = userEvent.setup();
    renderMasterDetailsTable();

    screen.getByRole('button', { name: /Release notes/ }).focus();
    await user.keyboard('{Enter}');

    expect(screen.getByText('Ships Friday')).toBeInTheDocument();
  });

  it('collapses the master list to the master column once a row is open', async () => {
    const user = userEvent.setup();
    renderMasterDetailsTable();

    await user.click(screen.getByRole('button', { name: /Release notes/ }));

    expect(screen.getByRole('columnheader', { name: /subject/i })).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: /from/i })).not.toBeInTheDocument();
  });

  it('calls onSelectedRowChanged with the clicked row', async () => {
    const user = userEvent.setup();
    const onSelectedRowChanged = vi.fn();
    renderMasterDetailsTable({ onSelectedRowChanged });

    await user.click(screen.getByRole('button', { name: /Release notes/ }));

    expect(onSelectedRowChanged).toHaveBeenCalledWith(messages[0]);
  });

  it('closes the detail pane when the close control is clicked', async () => {
    const user = userEvent.setup();
    renderMasterDetailsTable({ defaultSelectedRow: messages[0] });

    await user.click(screen.getByRole('button', { name: 'Close detail' }));

    expect(screen.queryByText('Ships Friday')).not.toBeInTheDocument();
  });

  it('restores every column when the detail pane is closed', async () => {
    const user = userEvent.setup();
    renderMasterDetailsTable({ defaultSelectedRow: messages[0] });

    await user.click(screen.getByRole('button', { name: 'Close detail' }));

    expect(screen.getByRole('columnheader', { name: /from/i })).toBeInTheDocument();
  });

  it('calls onSelectedRowChanged with undefined when the detail pane is closed', async () => {
    const user = userEvent.setup();
    const onSelectedRowChanged = vi.fn();
    renderMasterDetailsTable({ defaultSelectedRow: messages[0], onSelectedRowChanged });

    await user.click(screen.getByRole('button', { name: 'Close detail' }));

    expect(onSelectedRowChanged).toHaveBeenCalledWith(undefined);
  });

  it('switches the detail pane contents when a different row is clicked', async () => {
    const user = userEvent.setup();
    renderMasterDetailsTable({ defaultSelectedRow: messages[0] });

    await user.click(screen.getByRole('button', { name: /Standup/ }));

    expect(screen.getByText('Ten past nine')).toBeInTheDocument();
    expect(screen.queryByText('Ships Friday')).not.toBeInTheDocument();
  });

  it('calls onFetchRequested once on mount with the default parameters', () => {
    const { onFetchRequested } = renderMasterDetailsTable();

    expect(onFetchRequested).toHaveBeenCalledTimes(1);
    expect(onFetchRequested).toHaveBeenCalledWith({
      filters: [],
      page: 1,
      pageSize: 20,
      sortBy: undefined,
      sortDirection: undefined,
    });
  });

  it('requests a sorted fetch when a sortable header is sorted', async () => {
    const user = userEvent.setup();
    const { onFetchRequested } = renderMasterDetailsTable();

    await user.click(screen.getByRole('button', { name: 'Sort by subject' }));

    expect(onFetchRequested).toHaveBeenLastCalledWith(
      expect.objectContaining({ sortBy: 'subject', sortDirection: 'asc' }),
    );
  });

  it('requests the new page when a pagination control is used', async () => {
    const user = userEvent.setup();
    const { onFetchRequested } = renderMasterDetailsTable();

    await user.click(screen.getByRole('button', { name: 'Go to page 2' }));

    expect(onFetchRequested).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }));
  });

  it('renders the selection column when selection actions are available', () => {
    renderMasterDetailsTable({
      getSelectionActions: () => [{ id: 'archive', label: 'Archive' }],
    });

    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toBeInTheDocument();
  });

  it('collapses to the column named by masterColumnId', async () => {
    const user = userEvent.setup();
    renderMasterDetailsTable({ masterColumnId: 'from' });

    await user.click(screen.getByRole('button', { name: /Release notes/ }));

    expect(screen.getByRole('columnheader', { name: /from/i })).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: /subject/i })).not.toBeInTheDocument();
  });

  it('falls back to the first column when masterColumnId matches no column', async () => {
    const user = userEvent.setup();
    renderMasterDetailsTable({ masterColumnId: 'not-a-column' });

    await user.click(screen.getByRole('button', { name: /Release notes/ }));

    expect(screen.getByRole('columnheader', { name: /subject/i })).toBeInTheDocument();
  });

  it('opens with defaultSelectedRow already showing', () => {
    renderMasterDetailsTable({ defaultSelectedRow: messages[0] });

    expect(screen.getByText('Ships Friday')).toBeInTheDocument();
  });

  it('renders the row supplied by the controlled selectedRow prop', () => {
    renderMasterDetailsTable({ selectedRow: messages[1] });

    expect(screen.getByText('Ten past nine')).toBeInTheDocument();
  });

  it('renders detailTitle in the detail pane header', () => {
    renderMasterDetailsTable({
      defaultSelectedRow: messages[0],
      detailTitle: (row) => row.subject,
    });

    expect(screen.getByRole('heading', { name: 'Release notes' })).toBeInTheDocument();
  });

  it('renders the empty message when there is no data', () => {
    renderMasterDetailsTable({ data: [], total: 0, emptyMessage: 'No messages' });

    expect(screen.getByText('No messages')).toBeInTheDocument();
  });

  it('shows a loading indicator when isLoading is true', () => {
    renderMasterDetailsTable({ isLoading: true });

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('hides pagination when isPaginated is false', () => {
    renderMasterDetailsTable({ isPaginated: false });

    expect(screen.queryByRole('navigation', { name: 'Pagination' })).not.toBeInTheDocument();
  });

  it('spreads className and passthrough props onto the root element', () => {
    const { container } = render(
      <MasterDetailsTable<Message>
        columns={columns}
        data={messages}
        total={40}
        onFetchRequested={vi.fn()}
        detail={(row) => <p>{row.body}</p>}
        className="custom-class"
        data-testid="my-master-details"
      />,
    );

    expect(container.querySelector('.custom-class')).toHaveAttribute(
      'data-testid',
      'my-master-details',
    );
  });

  it('marks the open row with aria-current', async () => {
    const user = userEvent.setup();
    renderMasterDetailsTable();

    await user.click(screen.getByRole('button', { name: /Release notes/ }));

    expect(screen.getByRole('button', { name: /Release notes/ })).toHaveAttribute(
      'aria-current',
      'true',
    );
  });

  it('labels the close control with closeLabel', () => {
    renderMasterDetailsTable({ defaultSelectedRow: messages[0], closeLabel: 'Close message' });

    expect(screen.getByRole('button', { name: 'Close message' })).toBeInTheDocument();
  });

  it('gives the close control a default accessible name', () => {
    renderMasterDetailsTable({ defaultSelectedRow: messages[0] });

    expect(screen.getByRole('button', { name: 'Close detail' })).toBeInTheDocument();
  });
});
