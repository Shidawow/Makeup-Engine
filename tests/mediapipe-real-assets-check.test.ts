import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
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

const createReadyTempRoot = () => {
  const root = mkdtempSync(path.join(tmpdir(), 'makeup-engine-mediapipe-ready-'));
  tempRoots.push(root);
  const assetRoot = path.join(root, 'public', 'mediapipe');
  const wasmRoot = path.join(assetRoot, 'wasm');
  mkdirSync(wasmRoot, { recursive: true });
  writeFileSync(path.join(assetRoot, 'face_landmarker.task'), 'fixture-model');

  for (const fileName of wasmFileNames) {
    writeFileSync(path.join(wasmRoot, fileName), `fixture:${fileName}`);
  }

  return root;
};

const runJson = (args: string[]) => {
  const result = spawnSync('node', [scriptPath, ...args, '--json'], {
    cwd: path.resolve('.'),
    encoding: 'utf8',
  });

  return {
    ...result,
    json: JSON.parse(result.stdout) as {
      ok: boolean;
      missing: string[];
      present: Array<{ path: string; sizeBytes: number; size: string }>;
    },
  };
};

describe('MediaPipe real assets readiness checks', () => {
  afterEach(() => {
    for (const root of tempRoots) {
      rmSync(root, { recursive: true, force: true });
    }
    tempRoots = [];
  });

  it('passes check mode when model and wasm assets exist', () => {
    const projectRoot = createReadyTempRoot();
    const result = runJson(['--check', '--project-root', projectRoot]);

    expect(result.status).toBe(0);
    expect(result.json.ok).toBe(true);
    expect(result.json.missing).toEqual([]);
    expect(result.json.present.map((item) => item.path)).toContain(
      'public/mediapipe/face_landmarker.task',
    );
    expect(result.json.present.map((item) => item.path)).toContain(
      'public/mediapipe/wasm/vision_wasm_internal.js',
    );
  });

  it('keeps public/mediapipe ignored by git', () => {
    const result = spawnSync(
      'git',
      ['check-ignore', '-v', 'public/mediapipe/face_landmarker.task', 'public/mediapipe/wasm/vision_wasm_internal.js'],
      {
        cwd: path.resolve('.'),
        encoding: 'utf8',
      },
    );

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('public/mediapipe/face_landmarker.task');
    expect(result.stdout).toContain('public/mediapipe/wasm/vision_wasm_internal.js');
  });
});
