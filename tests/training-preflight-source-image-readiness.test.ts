import { execFile } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const exec = promisify(execFile);
const script = path.resolve('scripts/training-preflight.mjs');

describe('training preflight source image readiness', () => {
  it('reports source image import readiness without requiring a dataset', async () => {
    const { stdout } = await exec(process.execPath, [script, '--json']);
    const result = JSON.parse(stdout) as { sourceImageImportReady: boolean; recommendedImportCommand: string; jpegCodecReady: boolean };
    expect(result.sourceImageImportReady).toBe(true);
    expect(result.jpegCodecReady).toBe(false);
    expect(result.recommendedImportCommand).toContain('import-source-images.mjs');
  });
});
