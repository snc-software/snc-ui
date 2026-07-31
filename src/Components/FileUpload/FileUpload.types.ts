import type { SncComponent } from '@/Types/SncComponent';
import type { InputHTMLAttributes, Ref } from 'react';

/**
 * A file that failed validation during the most recent browse or drop selection, alongside the
 * reason it was excluded from `value`/`onChange`.
 */
export type FileUploadRejection = {
  file: File;
  reason: string;
};

export type FileUploadProps = SncComponent<
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'className'
    | 'id'
    | 'style'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'type'
    | 'multiple'
    | 'accept'
    | 'disabled'
    | 'name'
  > & {
    /**
     * Accepted files. Supplying this makes the component controlled.
     */
    value?: File[];
    /**
     * Same shape as `value`, for uncontrolled usage.
     */
    defaultValue?: File[];
    /**
     * Called with the full updated accepted-file list after a successful browse/drop selection or a
     * removal.
     */
    onChange?: (files: File[]) => void;
    /**
     * Called with the files rejected by the most recent browse/drop selection, alongside their reason.
     */
    onError?: (rejections: FileUploadRejection[]) => void;
    /**
     * Native attribute name. When `false`, a new selection (browse or drop) replaces the current file
     * entirely, matching a native single-file `<input type="file">`.
     * @default true
     */
    multiple?: boolean;
    /**
     * Forwarded to the native `accept` attribute so the OS file picker can pre-filter during browse.
     * Dot-prefixed tokens (e.g. `.png,.jpg`) are also enforced in JS for both browse and drop, since
     * `accept` has no effect on drag-and-drop.
     */
    accept?: string;
    /**
     * Per-file maximum size in bytes.
     */
    maxSizeBytes?: number;
    /**
     * Maximum character length of `file.name`.
     */
    maxFileNameLength?: number;
    /**
     * Maximum total accepted files, checked against the existing accepted files plus the incoming
     * batch.
     */
    maxFiles?: number;
    /**
     * Disables browsing, drag-and-drop, and each remove button.
     */
    disabled?: boolean;
    /**
     * Applies the error treatment to the dropzone and sets `aria-invalid` on the underlying input.
     * Style-affecting, so it selects a variant from `FileUpload.constants`.
     */
    hasError?: boolean;
    /**
     * Forwarded to the underlying `<input type="file">` for form submission / React Hook Form
     * `Controller` bookkeeping.
     */
    name?: string;
    ref?: Ref<HTMLInputElement>;
  }
>;
