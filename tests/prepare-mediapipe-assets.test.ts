import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';

const scriptPath = path.resolve('scripts/prepare-mediapipe-assets.mjs');
const wasmFileNames = [
  'vision_wasm_internal.js',
  'vision_wasm_internal.wasm',
  'vision_wasm_module_internal.js',
  'vision_wasm_module_internal.wasm',
  'vision_wasm_nosimd_internal.js',
  'vision_wasm_nosimd_internal.wasm',
];

let tempRoots: string[] = [];

const createTempRoot = () => {
  const root = mkdtempSync(path.join(tmpdir(), 'makeup-engine-mediapipe-'));
  tempRoots.push(root);
  return root;
};

const createWasmFixture = (root: string) => {
  const sourceWasmDir = path.join(root, 'tasks-vision-wasm');
  mkdirSync(sourceWasmDir, { recursive: true });

  for (const fileName of wasmFileNames) {
    writeFileSync(path.join(sourceWasmDir, fileName), `fixture:${fileName}`);
  }

  return sourceWasmDir;
};

const runScript = (args: string[]) =>
  spawnSync('node', [scriptPath, ...args, '--json'], {
    cwd: path.resolve('.'),
    encoding: 'utf8',
  });

const parseJson = (stdout: string) => JSON.parse(stdout) as {
  ok: boolean;
  copied: string[];
  missing: string[];
  present: Array<{ path: string; sizeBytes: number; size: string }>;
};

describe('prepare-mediapipe-assets script', () => {
  afterEach(() => {
    for (const root of tempRoots) {
      rmSync(root, { recursive: true, force: true });
    }
    tempRoots = [];
  });

  it('reports missing model and wasm files in check mode', () => {
    const projectRoot = createTempRoot();
    const sourceWasmDir = createWasmFixture(projectRoot);
    const result = runScript([
      '--check',
      '--project-root',
      projectRoot,
      '--tasks-vision-dir',
      sourceWasmDir,
    ]);
    const json = parseJson(result.stdout);

    expect(result.status).toBe(1);
    expect(json.ok).toBe(false);
    expect(json.missing).toContain('public/mediapipe/face_landmarker.task');
    expect(json.missing).toContain('public/mediapipe/wasm/vision_wasm_internal.js');
  });

  it('copies wasm files and leaves the official model as the remaining missing item', () => {
    const projectRoot = createTempRoot();
    const sourceWasmDir = createWasmFixture(projectRoot);
    const result = runScript([
      '--project-root',
      projectRoot,
      '--tasks-vision-dir',
      sourceWasmDir,
    ]);
    const json = parseJson(result.stdout);

    expect(result.status).toBe(1);
    expect(json.copied).toHaveLength(wasmFileNames.length);
    expect(json.missing).toEqual(['public/mediapipe/face_landmarker.task']);
    expect(readFileSync(
      path.join(projectRoot, 'public', 'mediapipe', 'wasm', 'vision_wasm_internal.js'),
      'utf8',
    )).toBe('fixture:vision_wasm_internal.js');
  });
});
