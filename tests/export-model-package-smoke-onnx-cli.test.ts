import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { promisify } from 'node:util';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const exec = promisify(execFile);
const trainScript = path.resolve('scripts/train-lightweight-segmentation.mjs');
const exportScript = path.resolve('scripts/export-model-package.mjs');
const dataset = path.resolve('tests/fixtures/materialized-dataset-realistic-synthetic.sample');

describe('export-model-package smoke and ONNX CLI', () => {
  it('writes runtime smoke report and ONNX prototype package', async () => {
    const modelOut = await mkdtemp(path.join(tmpdir(), 'realistic-model-'));
    const exportOut = await mkdtemp(path.join(tmpdir(), 'realistic-export-'));
    try {
      await exec(process.execPath, [
        trainScript,
        '--dataset', dataset,
        '--config', path.resolve('tests/fixtures/trainer-config.realistic-synthetic.lightweight.json'),
        '--regions', 'lips,blush,eyeshadow,eyeliner,contour,highlight',
        '--classifier', 'nearest-centroid',
        '--out', modelOut,
        '--evaluate',
        '--strict',
        '--json',
      ]);
      const { stdout } = await exec(process.execPath, [
        exportScript,
        '--model', path.join(modelOut, 'model.json'),
        '--manifest', path.join(modelOut, 'model-artifact-manifest.json'),
        '--evaluation', path.join(modelOut, 'evaluation-report.json'),
        '--out', exportOut,
        '--target', 'typescript-provider,browser-provider,onnx-placeholder,webgpu-placeholder',
        '--include-runtime-smoke',
        '--include-onnx-prototype',
        '--strict',
        '--json',
      ]);
      const result = JSON.parse(stdout) as { runtimeSmoke: { passed: boolean }; onnxPrototype: { graphCount: number }; outputs: string[] };
      expect(result.runtimeSmoke.passed).toBe(true);
      expect(result.onnxPrototype.graphCount).toBe(6);
      expect(result.outputs).toContain('runtime-smoke-report.json');
      await expect(readFile(path.join(exportOut, 'onnx-prototype/onnx-prototype.json'), 'utf8')).resolves.toContain('onnx-export-prototype-v0.1');
    } finally {
      await rm(modelOut, { recursive: true, force: true });
      await rm(exportOut, { recursive: true, force: true });
    }
  });
});
