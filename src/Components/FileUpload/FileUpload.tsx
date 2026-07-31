import { CloudUpload, Trash, WarningTriangle } from 'iconoir-react';
import { useCallback, useId, useRef, useState } from 'react';

import { cn } from '@/Utils/cn';

import {
  DefaultInstructionsAction,
  DefaultInstructionsLeadIn,
  DropzoneIconSize,
  DropzoneVariants,
  IconSize,
} from './FileUpload.constants';
import { classes } from './FileUpload.styles';
import {
  buildRestrictionsText,
  formatFileSize,
  parseAcceptedExtensions,
  validateFile,
} from './FileUpload.utils';

import type { FileUploadProps, FileUploadRejection } from './FileUpload.types';
import type { ChangeEvent, DragEvent } from 'react';

/**
 * A `<label>`-wrapped dropzone around a visually-hidden `<input type="file">` — the pairing gives
 * click-to-browse and full keyboard/screen-reader support natively — that also accepts drag-and-drop.
 * Restrictions are enforced identically for both input paths via one shared validation function.
 */
export default function FileUpload({
  ref,
  id,
  value,
  defaultValue,
  onChange,
  onError,
  multiple = true,
  accept,
  maxSizeBytes,
  maxFileNameLength,
  maxFiles,
  disabled = false,
  hasError = false,
  name,
  className,
  ...rest
}: FileUploadProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const [uncontrolledFiles, setUncontrolledFiles] = useState<File[]>(defaultValue ?? []);
  const [rejections, setRejections] = useState<FileUploadRejection[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Controlled as soon as `value` is supplied, as a native input would be.
  const acceptedFiles = value ?? uncontrolledFiles;

  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;

      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  const processFiles = (incoming: File[]) => {
    const acceptedExtensions = parseAcceptedExtensions(accept);
    const validFiles: File[] = [];
    const newRejections: FileUploadRejection[] = [];

    const candidates = multiple ? incoming : incoming.slice(0, 1);
    const overflow = multiple ? [] : incoming.slice(1);

    overflow.forEach((file) => {
      newRejections.push({ file, reason: 'Only one file is allowed' });
    });

    candidates.forEach((file) => {
      const reason = validateFile(file, { acceptedExtensions, maxSizeBytes, maxFileNameLength });

      if (reason) {
        newRejections.push({ file, reason });
      } else {
        validFiles.push(file);
      }
    });

    const existingCount = multiple ? acceptedFiles.length : 0;
    const remainingCapacity =
      maxFiles !== undefined ? Math.max(maxFiles - existingCount, 0) : validFiles.length;
    const keptFiles = validFiles.slice(0, remainingCapacity);

    validFiles.slice(remainingCapacity).forEach((file) => {
      newRejections.push({ file, reason: 'Maximum number of files exceeded' });
    });

    // Only touch the accepted-file list when at least one incoming file actually passed validation —
    // a fully-rejected selection reports via onError/the rejection list but leaves prior files intact.
    if (keptFiles.length > 0) {
      const nextFiles = multiple ? [...acceptedFiles, ...keptFiles] : keptFiles;

      if (value === undefined) {
        setUncontrolledFiles(nextFiles);
      }

      onChange?.(nextFiles);
    }

    setRejections(newRejections);

    if (newRejections.length > 0) {
      onError?.(newRejections);
    }
  };

  const handleBrowseChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';

    if (!disabled && files.length > 0) {
      processFiles(files);
    }
  };

  const handleDragEnter = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();

    if (!disabled) {
      setIsDragActive(true);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();

    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsDragActive(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragActive(false);

    const files = Array.from(event.dataTransfer.files);

    if (!disabled && files.length > 0) {
      processFiles(files);
    }
  };

  const handleRemove = (fileToRemove: File) => {
    const nextFiles = acceptedFiles.filter((file) => file !== fileToRemove);

    if (value === undefined) {
      setUncontrolledFiles(nextFiles);
    }

    onChange?.(nextFiles);
  };

  const restrictionLines = buildRestrictionsText({
    accept,
    maxSizeBytes,
    maxFileNameLength,
    maxFiles,
  });

  return (
    <div className={cn(classes.wrapper, className)}>
      <label
        htmlFor={inputId}
        className={cn(
          classes.dropzone,
          hasError ? DropzoneVariants.error : DropzoneVariants.default,
          isDragActive && DropzoneVariants.dragActive,
          disabled && DropzoneVariants.disabled,
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={setInputRef}
          id={inputId}
          type="file"
          name={name}
          multiple={multiple}
          accept={accept}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          className={classes.input}
          onChange={handleBrowseChange}
          {...rest}
        />

        <CloudUpload
          width={DropzoneIconSize}
          height={DropzoneIconSize}
          className={cn(classes.icon, isDragActive && DropzoneVariants.dragActiveIcon)}
        />
        <span className={classes.instructions}>
          {DefaultInstructionsLeadIn}
          <span className={classes.instructionsAction}>{DefaultInstructionsAction}</span>
        </span>
        {restrictionLines && (
          <span className={classes.restrictionsList}>
            {restrictionLines.map((line) => (
              <span key={line} className={classes.restrictions}>
                {line}
              </span>
            ))}
          </span>
        )}
      </label>

      {acceptedFiles.length > 0 && (
        <ul aria-label="Selected files" className={classes.fileList}>
          {acceptedFiles.map((file) => (
            <li key={`${file.name}-${file.size}-${file.lastModified}`} className={classes.fileRow}>
              <span className={classes.fileName}>{file.name}</span>
              <span className={classes.fileSize}>{formatFileSize(file.size)}</span>
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                className={classes.removeButton}
                disabled={disabled}
                onClick={() => handleRemove(file)}
              >
                <Trash width={IconSize} height={IconSize} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {rejections.length > 0 && (
        <div role="alert" className={classes.rejectionList}>
          {rejections.map((rejection) => (
            <div
              key={`${rejection.file.name}-${rejection.file.size}-${rejection.file.lastModified}-${rejection.reason}`}
              className={classes.rejectionRow}
            >
              <WarningTriangle
                width={IconSize}
                height={IconSize}
                className={classes.rejectionIcon}
              />
              <span>
                {rejection.file.name}: {rejection.reason}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
