import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  convertJsonRgbaToRawRgbaBinary,
  createRawRgbaImageArtifactMetadata,
  rawRgbaBinaryToImagePixelData,
  readRawRgbaBinaryArtifact,
  validateRawRgbaBinaryArtifact,
  writeRawRgbaBinaryArtifact,
} from '../src/training/artifacts';
import type { ImagePixelArtifact } from '../src/training/schema';

describe('raw RGBA image materializer', () => {
  it('round-trips JSON RGBA through dependency-free raw RGBA metadata', async () => {
    const source = JSON.parse(await readFile(path.resolve('tests/fixtures/materialized-dataset-with-pixels.sample/image-pixels/image-train.rgba.json'), 'utf8')) as ImagePixelArtifact;
    const raw = convertJsonRgbaToRawRgbaBinary(source);
    const parsed = readRawRgbaBinaryArtifact(writeRawRgbaBinaryArtifact(raw));
    expect(validateRawRgbaBinaryArtifact(parsed)).toEqual([]);
    expect(rawRgbaBinaryToImagePixelData(parsed).pixels).toHaveLength(9);
    expect(createRawRgbaImageArtifactMetadata({ source }).relativePath).toBe('image-pixels-raw/image-train.rgba.bin.json');
  });
});
