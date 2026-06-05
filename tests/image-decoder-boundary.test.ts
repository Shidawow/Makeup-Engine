import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  decodeJsonRgbaImageArtifact,
  decodePngImagePlaceholder,
  decodeRawRgbaImageArtifact,
  convertJsonRgbaToRawRgbaBinary,
  writeRawRgbaBinaryArtifact,
} from '../src/training/artifacts';
import type { ImagePixelArtifact } from '../src/training/schema';

describe('image decoder boundary', () => {
  it('decodes JSON RGBA and raw RGBA while rejecting PNG placeholder', async () => {
    const artifact = JSON.parse(await readFile(path.resolve('tests/fixtures/materialized-dataset-with-pixels.sample/image-pixels/image-train.rgba.json'), 'utf8')) as ImagePixelArtifact;
    const json = decodeJsonRgbaImageArtifact(artifact);
    const raw = decodeRawRgbaImageArtifact(writeRawRgbaBinaryArtifact(convertJsonRgbaToRawRgbaBinary(artifact)), artifact.imageId);
    const png = decodePngImagePlaceholder();
    expect(json.decoded?.width).toBe(3);
    expect(raw.decoded?.pixels).toHaveLength(9);
    expect(png.validation.issues[0]?.code).toBe('png-image-unsupported');
  });
});
