import DesignTokenPreviewCell from './DesignTokenPreviewCell';

import type { DesignTokenEntry } from './designTokens.data';
import type { TableColumn } from '@/Components/Table';

export const designTokenColumns: Array<TableColumn<DesignTokenEntry>> = [
  {
    id: 'variable',
    title: 'Variable',
    accessor: (entry) => entry.variable,
  },
  {
    id: 'preview',
    title: 'Preview',
    accessor: (entry) => entry.variable,
    cell: (_value, entry) => <DesignTokenPreviewCell entry={entry} />,
  },
  {
    id: 'description',
    title: 'Description',
    accessor: (entry) => entry.description,
  },
];
