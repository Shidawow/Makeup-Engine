import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';
import { materializedFixtureRoot } from './training-bridge-fixtures';

let tempDirs: string[] = [];

const runCli = (args: readonly string[]) =>
  spawnSync('node', ['scripts/training-preflight.mjs', ...args], {
    cwd: '.',
    encoding: 'utf8',
  });

afterEach(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
  tempDirs = [];
});

describe('training preflight CLI Phase 6B exports', () => {
  it('exports run package, quarantine, evaluation, and model manifest', () => {
    const out = mkdtempSync(join(tmpdir(), 'phase6b-preflight-'));
    tempDirs.push(out);
    const runPackage = join(out, 'training-run-package.json');
    const quarantine = join(out, 'failed-samples.json');
    const evaluation = join(out, 'evaluation-report.json');
    const model = join(out, 'model-artifact-manifest.json');
    const result = runCli([
      '--dataset',
      materializedFixtureRoot,
      '--runtime',
      'dry-run',
      '--export-run-package',
      runPackage,
      '--export-quarantine',
      quarantine,
      '--export-evaluation',
      evaluation,
      '--export-model-manifest',
      model,
      '--json',
    ]);
    const parsed = JSON.parse(result.stdout.toString()) as {
      runtimePlanSummary: string;
      trainingRunPackageSummary: string;
    };

    expect(result.status).toBe(0);
    expect(parsed.runtimePlanSummary).toContain('dry-run');
    expect(parsed.trainingRunPackageSummary).toContain('training-run-');
    expect(existsSync(runPackage)).toBe(true);
    expect(readFileSync(model, 'utf8')).toContain('model-artifact-manifest-v0.1');
    expect(readFileSync(evaluation, 'utf8')).toContain('segmentation-evaluation-report-v0.1');
    expect(readFileSync(quarantine, 'utf8')).toContain('failed-sample-quarantine-v0.1');
  });

  it('returns strict failure for invalid dataset', () => {
    const result = runCli(['--dataset', 'tests/fixtures/missing-dataset', '--runtime', 'dry-run', '--strict']);

    expect(result.status).not.toBe(0);
  });
});
