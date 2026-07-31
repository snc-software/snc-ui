import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import FileUpload from './FileUpload';
import { DefaultInstructionsAction } from './FileUpload.constants';

function createFile(name: string, sizeBytes = 1024, type = 'text/plain'): File {
  return new File([new Uint8Array(sizeBytes)], name, { type });
}

// jsdom does not implement FileList/DataTransfer, so drop events need a minimal stand-in — the same
// shape @testing-library/user-event builds internally for its own upload() helper.
function createFileList(files: File[]): FileList {
  return {
    ...files,
    length: files.length,
    item: (index: number) => files[index] ?? null,
    [Symbol.iterator]: function* iterator() {
      yield* files;
    },
  } as unknown as FileList;
}

function dropFiles(dropzone: Element, files: File[]) {
  fireEvent.drop(dropzone, {
    dataTransfer: { files: createFileList(files) } as unknown as DataTransfer,
  });
}

function getDropzone(): HTMLLabelElement {
  const dropzone = screen.getByText(DefaultInstructionsAction).closest('label');

  if (!dropzone) {
    throw new Error('Dropzone label not found');
  }

  return dropzone;
}

describe('FileUpload', () => {
  it('renders the dropzone with instructional text and no files listed initially', () => {
    render(<FileUpload aria-label="Attachments" />);

    expect(screen.getByText(DefaultInstructionsAction)).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('renders restriction text describing accepted extensions when accept includes dot-prefixed tokens', () => {
    render(<FileUpload aria-label="Attachments" accept=".png,.jpg" />);

    expect(screen.getByText(/Accepted files: \.png, \.jpg/)).toBeInTheDocument();
  });

  it('renders restriction text describing the max size when maxSizeBytes is provided', () => {
    render(<FileUpload aria-label="Attachments" maxSizeBytes={1024} />);

    expect(screen.getByText(/Max size: 1 KB/)).toBeInTheDocument();
  });

  it('renders restriction text describing the max file name length when maxFileNameLength is provided', () => {
    render(<FileUpload aria-label="Attachments" maxFileNameLength={50} />);

    expect(screen.getByText(/Max file name length: 50 characters/)).toBeInTheDocument();
  });

  it('renders restriction text describing the max number of files when maxFiles is provided', () => {
    render(<FileUpload aria-label="Attachments" maxFiles={3} />);

    expect(screen.getByText(/Max 3 files/)).toBeInTheDocument();
  });

  it('does not render restriction text when no restriction props are provided', () => {
    render(<FileUpload aria-label="Attachments" />);

    expect(
      screen.queryByText(/Accepted files:|Max size:|Max file name length:|Max \d/),
    ).not.toBeInTheDocument();
  });

  it('adds a file to the list and calls onChange when a file is chosen via the browse input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const file = createFile('report.pdf');
    render(<FileUpload aria-label="Attachments" onChange={onChange} />);

    await user.upload(screen.getByLabelText('Attachments'), file);

    expect(onChange).toHaveBeenCalledWith([file]);
    expect(screen.getByText('report.pdf')).toBeInTheDocument();
  });

  it('adds multiple files via the browse input when multiple is true', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const fileA = createFile('a.pdf');
    const fileB = createFile('b.pdf');
    render(<FileUpload aria-label="Attachments" onChange={onChange} />);

    await user.upload(screen.getByLabelText('Attachments'), [fileA, fileB]);

    expect(onChange).toHaveBeenCalledWith([fileA, fileB]);
    expect(screen.getByText('a.pdf')).toBeInTheDocument();
    expect(screen.getByText('b.pdf')).toBeInTheDocument();
  });

  it('replaces the current file via the browse input when multiple is false', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const fileA = createFile('a.pdf');
    const fileB = createFile('b.pdf');
    render(
      <FileUpload
        aria-label="Attachments"
        multiple={false}
        defaultValue={[fileA]}
        onChange={onChange}
      />,
    );

    await user.upload(screen.getByLabelText('Attachments'), fileB);

    expect(onChange).toHaveBeenCalledWith([fileB]);
    expect(screen.queryByText('a.pdf')).not.toBeInTheDocument();
    expect(screen.getByText('b.pdf')).toBeInTheDocument();
  });

  it('adds files dropped onto the dropzone and calls onChange', () => {
    const onChange = vi.fn();
    const file = createFile('drawing.png');
    render(<FileUpload aria-label="Attachments" onChange={onChange} />);

    dropFiles(getDropzone(), [file]);

    expect(onChange).toHaveBeenCalledWith([file]);
    expect(screen.getByText('drawing.png')).toBeInTheDocument();
  });

  it('applies drag-active styling while a file is dragged over the dropzone', () => {
    render(<FileUpload aria-label="Attachments" />);
    const dropzone = getDropzone();

    fireEvent.dragEnter(dropzone);

    expect(dropzone.className).toContain('snc:border-snc-accent');
  });

  it('clears drag-active styling when the drag leaves the dropzone without a drop', () => {
    render(<FileUpload aria-label="Attachments" />);
    const dropzone = getDropzone();

    fireEvent.dragEnter(dropzone);
    fireEvent.dragLeave(dropzone, { relatedTarget: document.body });

    expect(dropzone.className).not.toContain('snc:border-snc-accent');
  });

  it("rejects a file whose extension isn't in accept and reports it via onError without adding it to the list", () => {
    const onChange = vi.fn();
    const onError = vi.fn();
    const file = createFile('notes.txt');
    render(
      <FileUpload aria-label="Attachments" accept=".png" onChange={onChange} onError={onError} />,
    );

    dropFiles(getDropzone(), [file]);

    expect(onChange).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith([
      { file, reason: expect.stringContaining('File type not accepted') },
    ]);
    expect(screen.queryByText('notes.txt', { selector: 'li *' })).not.toBeInTheDocument();
  });

  it('rejects a file exceeding maxSizeBytes and reports it via onError without adding it to the list', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onError = vi.fn();
    const file = createFile('large.pdf', 2048);
    render(
      <FileUpload
        aria-label="Attachments"
        maxSizeBytes={1024}
        onChange={onChange}
        onError={onError}
      />,
    );

    await user.upload(screen.getByLabelText('Attachments'), file);

    expect(onChange).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith([
      { file, reason: expect.stringContaining('exceeds the maximum size') },
    ]);
  });

  it('rejects a file whose name exceeds maxFileNameLength and reports it via onError without adding it to the list', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onError = vi.fn();
    const file = createFile('a-very-long-file-name.pdf');
    render(
      <FileUpload
        aria-label="Attachments"
        maxFileNameLength={5}
        onChange={onChange}
        onError={onError}
      />,
    );

    await user.upload(screen.getByLabelText('Attachments'), file);

    expect(onChange).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith([
      { file, reason: expect.stringContaining('exceeds the maximum length') },
    ]);
  });

  it('rejects files beyond maxFiles, keeping the earliest-selected files', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onError = vi.fn();
    const fileA = createFile('a.pdf');
    const fileB = createFile('b.pdf');
    render(
      <FileUpload aria-label="Attachments" maxFiles={1} onChange={onChange} onError={onError} />,
    );

    await user.upload(screen.getByLabelText('Attachments'), [fileA, fileB]);

    expect(onChange).toHaveBeenCalledWith([fileA]);
    expect(onError).toHaveBeenCalledWith([
      { file: fileB, reason: 'Maximum number of files exceeded' },
    ]);
  });

  it('renders rejected files with their rejection reason in an accessible region', () => {
    const file = createFile('notes.txt');
    render(<FileUpload aria-label="Attachments" accept=".png" />);

    dropFiles(getDropzone(), [file]);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('notes.txt');
    expect(alert).toHaveTextContent('File type not accepted');
  });

  it('removes a file from the list when its remove button is clicked, calling onChange with the remaining files', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const fileA = createFile('a.pdf');
    const fileB = createFile('b.pdf');
    render(
      <FileUpload aria-label="Attachments" defaultValue={[fileA, fileB]} onChange={onChange} />,
    );

    await user.click(screen.getByRole('button', { name: 'Remove a.pdf' }));

    expect(onChange).toHaveBeenCalledWith([fileB]);
    expect(screen.queryByText('a.pdf')).not.toBeInTheDocument();
    expect(screen.getByText('b.pdf')).toBeInTheDocument();
  });

  it('does not accept dropped files when disabled', () => {
    const onChange = vi.fn();
    const file = createFile('report.pdf');
    render(<FileUpload aria-label="Attachments" disabled onChange={onChange} />);

    expect(screen.getByLabelText('Attachments')).toBeDisabled();

    dropFiles(getDropzone(), [file]);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('starts from defaultValue when left uncontrolled', () => {
    const file = createFile('report.pdf');
    render(<FileUpload aria-label="Attachments" defaultValue={[file]} />);

    expect(screen.getByText('report.pdf')).toBeInTheDocument();
  });

  it('does not change a controlled value on its own after a new file is selected (calls onChange only)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const file = createFile('report.pdf');
    render(<FileUpload aria-label="Attachments" value={[]} onChange={onChange} />);

    await user.upload(screen.getByLabelText('Attachments'), file);

    expect(onChange).toHaveBeenCalledWith([file]);
    expect(screen.queryByText('report.pdf')).not.toBeInTheDocument();
  });

  it('applies error styling and aria-invalid when hasError is true', () => {
    render(<FileUpload aria-label="Attachments" hasError />);

    expect(screen.getByLabelText('Attachments')).toHaveAttribute('aria-invalid', 'true');
    expect(getDropzone().className).toContain('snc:border-snc-error-border');
  });

  it('forwards name to the underlying file input', () => {
    render(<FileUpload aria-label="Attachments" name="attachments" />);

    expect(screen.getByLabelText('Attachments')).toHaveAttribute('name', 'attachments');
  });

  it('forwards a callback ref and an object ref to the underlying file input', () => {
    const callbackRef = vi.fn();
    const objectRef = createRef<HTMLInputElement>();

    const { rerender } = render(<FileUpload aria-label="Attachments" ref={callbackRef} />);
    expect(callbackRef).toHaveBeenCalledWith(expect.any(HTMLInputElement));

    rerender(<FileUpload aria-label="Attachments" ref={objectRef} />);
    expect(objectRef.current).toBeInstanceOf(HTMLInputElement);
  });

  it('merges a consumer-supplied className onto the wrapper', () => {
    const { container } = render(<FileUpload aria-label="Attachments" className="custom-class" />);

    expect(container.firstElementChild).toHaveClass('custom-class');
  });

  it('forwards additional HTML attributes to the underlying input', () => {
    render(<FileUpload aria-label="Attachments" data-testid="file-upload-input" />);

    expect(screen.getByTestId('file-upload-input')).toBeInTheDocument();
  });
});
