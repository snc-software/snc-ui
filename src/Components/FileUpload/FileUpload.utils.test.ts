import { describe, expect, it } from 'vitest';

import {
  buildRestrictionsText,
  formatFileSize,
  parseAcceptedExtensions,
  validateFile,
} from './FileUpload.utils';

function createFile(name: string, sizeBytes = 1024, type = 'text/plain'): File {
  return new File([new Uint8Array(sizeBytes)], name, { type });
}

describe('formatFileSize', () => {
  it('formats byte counts across B/KB/MB/GB ranges, including the 0-byte and exact-1024 boundary cases', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(1024 * 1024)).toBe('1 MB');
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
  });
});

describe('parseAcceptedExtensions', () => {
  it('extracts lowercase, dot-prefixed tokens from an accept string, ignoring MIME-type tokens', () => {
    expect(parseAcceptedExtensions('.PNG, .jpg, image/*')).toEqual(['.png', '.jpg']);
  });

  it('returns an empty array when accept is undefined or has no extension tokens', () => {
    expect(parseAcceptedExtensions(undefined)).toEqual([]);
    expect(parseAcceptedExtensions('image/*,application/pdf')).toEqual([]);
  });
});

describe('validateFile', () => {
  it("returns a rejection reason when the file's extension isn't in the accepted list", () => {
    const file = createFile('notes.txt');

    const reason = validateFile(file, { acceptedExtensions: ['.png'] });

    expect(reason).toContain('File type not accepted');
  });

  it('returns a rejection reason when the file exceeds maxSizeBytes', () => {
    const file = createFile('large.pdf', 2048);

    const reason = validateFile(file, { acceptedExtensions: [], maxSizeBytes: 1024 });

    expect(reason).toContain('exceeds the maximum size');
  });

  it('returns a rejection reason when the file name exceeds maxFileNameLength', () => {
    const file = createFile('a-very-long-file-name.pdf');

    const reason = validateFile(file, { acceptedExtensions: [], maxFileNameLength: 5 });

    expect(reason).toContain('exceeds the maximum length');
  });

  it('returns null when the file satisfies all supplied constraints', () => {
    const file = createFile('photo.png', 512);

    const reason = validateFile(file, {
      acceptedExtensions: ['.png'],
      maxSizeBytes: 1024,
      maxFileNameLength: 20,
    });

    expect(reason).toBeNull();
  });
});

describe('buildRestrictionsText', () => {
  it('composes one line per active constraint from whichever are set', () => {
    const lines = buildRestrictionsText({
      accept: '.png,.jpg',
      maxSizeBytes: 1024,
      maxFileNameLength: 50,
      maxFiles: 3,
    });

    expect(lines).toEqual([
      'Accepted files: .png, .jpg',
      'Max size: 1 KB',
      'Max file name length: 50 characters',
      'Max 3 files',
    ]);
  });

  it('returns undefined when no constraints are set', () => {
    expect(buildRestrictionsText({})).toBeUndefined();
  });
});
