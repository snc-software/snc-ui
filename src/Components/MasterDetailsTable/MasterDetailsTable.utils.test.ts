import { describe, expect, it } from 'vitest';

import { resolveMasterColumn } from './MasterDetailsTable.utils';

import type { TableColumn } from '@/Components/Table';

type Row = { subject: string; from: string };

const columns: Array<TableColumn<Row>> = [
  { id: 'subject', title: 'Subject', accessor: (row) => row.subject },
  { id: 'from', title: 'From', accessor: (row) => row.from },
];

describe('resolveMasterColumn', () => {
  it('returns the column matching the supplied id', () => {
    const column = resolveMasterColumn(columns, 'from');

    expect(column).toBe(columns[1]);
  });

  it('returns the first column when no id is supplied', () => {
    const column = resolveMasterColumn(columns);

    expect(column).toBe(columns[0]);
  });

  it('returns the first column when the id matches no column', () => {
    const column = resolveMasterColumn(columns, 'not-a-column');

    expect(column).toBe(columns[0]);
  });
});
