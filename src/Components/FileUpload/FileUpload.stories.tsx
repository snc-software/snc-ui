import FileUpload from './FileUpload';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  argTypes: {
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
    hasError: { control: 'boolean' },
    maxSizeBytes: { control: { type: 'number' } },
    maxFileNameLength: { control: { type: 'number' } },
    maxFiles: { control: { type: 'number' } },
    onChange: { action: 'changed' },
    onError: { action: 'rejected' },
  },
  args: {
    'aria-label': 'Attachments',
  },
} satisfies Meta<typeof FileUpload>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * Restrictions (accepted extensions, max size, max file name length, max file count) are enforced
 * identically for browse and drag-and-drop, and documented as helper text inside the dropzone.
 */
export const WithRestrictions: Story = {
  args: {
    accept: '.png,.jpg,.pdf',
    maxSizeBytes: 5 * 1024 * 1024,
    maxFileNameLength: 100,
    maxFiles: 3,
  },
};

export const SingleFile: Story = {
  args: { multiple: false },
};

export const HasError: Story = {
  args: { hasError: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: [new File(['sample content'], 'example.pdf', { type: 'application/pdf' })],
  },
};
