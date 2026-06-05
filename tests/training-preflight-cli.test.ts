import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { materializedFixtureRoot } from './training-bridge-fixtures';

const runCli = (args: readonly string[]) =>
  spawnSync('node', ['scripts/training-preflight.mjs', ...args], {
    cwd: '.',
    encoding: 'utf8',
  });

describe('training preflight CLI', () => {
  it('prints help', () => {
    const result = runCli(['--help']);

    expect(result.status).toBe(0);
    expect(result.stdout.toString()).toContain('--dataset');
    expect(result.stdout.toString()).toContain('--json');
  });

  it('preflights a materialized dataset fixture', () => {
    const result = runCli(['--dataset', materializedFixtureRoot, '--strict']);

    expect(result.status).toBe(0);
    expect(result.stdout.toString()).toContain('dataset id: materialized-0b059bd6');
    expect(result.stdout.toString()).toContain('readiness: warning');
  });

  it('outputs machine-readable JSON', () => {
    const result = runCli(['--dataset', materializedFixtureRoot, '--json']);
    const parsed = JSON.parse(result.stdout.toString()) as { datasetId: string };

    expect(result.status).toBe(0);
    expect(parsed.datasetId).toBe('materialized-0b059bd6');
  });

  it('returns non-zero in strict mode for an invalid dataset path', () => {
    const result = runCli(['--dataset', 'tests/fixtures/missing-dataset', '--strict']);

    expect(result.status).not.toBe(0);
    expect(result.stderr.toString()).toContain('manifest.json');
  });
});
