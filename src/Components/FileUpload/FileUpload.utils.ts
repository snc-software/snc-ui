const BYTE_UNITS = ['B', 'KB', 'MB', 'GB'] as const;

/**
 * Human-readable file size, stepping through B/KB/MB/GB at the 1024 boundary and rounding to one
 * decimal place.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), BYTE_UNITS.length - 1);
  const value = bytes / 1024 ** exponent;
  const rounded = Math.round(value * 10) / 10;

  return `${rounded} ${BYTE_UNITS[exponent]}`;
}

/**
 * Extracts lowercase, dot-prefixed extension tokens (e.g. `.png`) from a native `accept` string,
 * ignoring MIME-type tokens (e.g. `image/*`) — those are only meaningful to the OS file picker and
 * are forwarded to the native attribute as-is, never JS-validated.
 */
export function parseAcceptedExtensions(accept: string | undefined): string[] {
  if (!accept) {
    return [];
  }

  return accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.startsWith('.'));
}

export type FileValidationConstraints = {
  acceptedExtensions: string[];
  maxSizeBytes?: number;
  maxFileNameLength?: number;
};

/**
 * Validates a single file against whichever constraints are supplied, returning a human-readable
 * rejection reason, or `null` when the file satisfies all of them.
 */
export function validateFile(file: File, constraints: FileValidationConstraints): string | null {
  const { acceptedExtensions, maxSizeBytes, maxFileNameLength } = constraints;

  if (acceptedExtensions.length > 0) {
    const lowerCaseName = file.name.toLowerCase();
    const hasAcceptedExtension = acceptedExtensions.some((extension) =>
      lowerCaseName.endsWith(extension),
    );

    if (!hasAcceptedExtension) {
      return `File type not accepted (allowed: ${acceptedExtensions.join(', ')})`;
    }
  }

  if (maxSizeBytes !== undefined && file.size > maxSizeBytes) {
    return `File exceeds the maximum size of ${formatFileSize(maxSizeBytes)}`;
  }

  if (maxFileNameLength !== undefined && file.name.length > maxFileNameLength) {
    return `File name exceeds the maximum length of ${maxFileNameLength} characters`;
  }

  return null;
}

export type RestrictionsTextOptions = {
  accept?: string;
  maxSizeBytes?: number;
  maxFileNameLength?: number;
  maxFiles?: number;
};

/**
 * Composes the "documented in the area" restrictions summary from whichever constraints are
 * supplied, one entry per active constraint, omitting the array entirely when none are set.
 */
export function buildRestrictionsText(options: RestrictionsTextOptions): string[] | undefined {
  const { accept, maxSizeBytes, maxFileNameLength, maxFiles } = options;
  const segments: string[] = [];

  const extensions = parseAcceptedExtensions(accept);

  if (extensions.length > 0) {
    segments.push(`Accepted files: ${extensions.join(', ')}`);
  }

  if (maxSizeBytes !== undefined) {
    segments.push(`Max size: ${formatFileSize(maxSizeBytes)}`);
  }

  if (maxFileNameLength !== undefined) {
    segments.push(`Max file name length: ${maxFileNameLength} characters`);
  }

  if (maxFiles !== undefined) {
    segments.push(`Max ${maxFiles} file${maxFiles === 1 ? '' : 's'}`);
  }

  return segments.length > 0 ? segments : undefined;
}
