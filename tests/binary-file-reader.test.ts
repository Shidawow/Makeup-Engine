import { describe, expect, it } from 'vitest';
import { createBinaryFileChecksum, detectBinaryFileKind, readBinaryFileFromFixture } from '../src/training/artifacts';

describe('binary file reader', () => {
  it('detects supported source image byte signatures deterministically', () => {
    expect(detectBinaryFileKind(Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]))).toBe('png');
    expect(detectBinaryFileKind(Uint8Array.from([0xff, 0xd8, 0xff, 0xe0]))).toBe('jpeg');
    expect(detectBinaryFileKind(new TextEncoder().encode('{"a":1}'))).toBe('json');
    expect(readBinaryFileFromFixture([1, 2, 3], 'bad').issues[0]?.code).toBe('unknown-file-kind');
    expect(createBinaryFileChecksum(Uint8Array.from([1, 2, 3]))).toBe(createBinaryFileChecksum(Uint8Array.from([1, 2, 3])));
  });
});
