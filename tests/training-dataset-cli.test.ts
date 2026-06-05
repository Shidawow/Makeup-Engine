import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { stableStringify } from '../src/templates/storage/datasetExport';
import { createOfflineTrainingPackage } from '../src/templates/storage/offlineTrainingPackage';
import { offlinePackageFixture } from './offline-package-fixtures';

let tempDirs: string[] = [];

const fixtureFiles = () => {
  const root = mkdtempSync(join(tmpdir(), 'makeup-cli-'));
  tempDirs.push(root);
  const { dataset, manifest, queue } = offlinePackageFixture();
  const trainingPackage = createOfflineTrainingPackage({
    dataset,
    trainingManifest: manifest,
    reviewQueue: queue,
  });
  const packagePath = join(root, 'offline-package.json');
  const manifestPath = join(root, 'offline-package-manifest.json');
  const auditPath = join(root, 'audit-report.json');

  writeFileSync(packagePath, stableStringify(trainingPackage), 'utf8');
  writeFileSync(manifestPath, stableStringify(trainingPackage.manifest), 'utf8');
  writeFileSync(auditPath, stableStringify(trainingPackage.auditSummary), 'utf8');

  return { root, packagePath, manifestPath, auditPath, trainingPackage };
};

const runCli = (args: readonly string[]) =>
  spawnSync('node', ['scripts/build-training-dataset.mjs', ...args], {
    cwd: resolve('.'),
    encoding: 'utf8',
  });

afterEach(() => {
  for (const dir of tempDirs) {
    rmSync(dir, { recursive: true, force: true });
  }
  tempDirs = [];
});

describe('build-training-dataset CLI', () => {
  it('prints help', () => {
    const result = runCli(['--help']);

    expect(result.status).toBe(0);
    expect(result.stdout.toString()).toContain('--package');
    expect(result.stdout.toString()).toContain('--dry-run');
  });

  it('supports dry-run and validate-only without writing files', () => {
    const { root, packagePath, manifestPath, auditPath } = fixtureFiles();
    const out = join(root, 'dataset-out');
    const dryRun = runCli([
      '--package',
      packagePath,
      '--manifest',
      manifestPath,
      '--audit',
      auditPath,
      '--out',
      out,
      '--dry-run',
      '--strict',
    ]);
    const validateOnly = runCli([
      '--package',
      packagePath,
      '--manifest',
      manifestPath,
      '--audit',
      auditPath,
      '--validate-only',
      '--strict',
    ]);

    expect(dryRun.status).toBe(0);
    expect(dryRun.stdout.toString()).toContain('mode: dry-run');
    expect(validateOnly.status).toBe(0);
    expect(validateOnly.stdout.toString()).toContain('mode: validate-only');
    expect(existsSync(out)).toBe(false);
  });

  it('writes a materialized dataset directory and split JSONL files', () => {
    const { root, packagePath, manifestPath, auditPath } = fixtureFiles();
    const out = join(root, 'dataset-out');
    mkdirSync(out, { recursive: true });
    const result = runCli([
      '--package',
      packagePath,
      '--manifest',
      manifestPath,
      '--audit',
      auditPath,
      '--out',
      out,
      '--strict',
    ]);

    expect(result.status).toBe(0);
    expect(existsSync(join(out, 'manifest.json'))).toBe(true);
    expect(existsSync(join(out, 'package.json'))).toBe(true);
    expect(existsSync(join(out, 'audit-report.json'))).toBe(true);
    expect(existsSync(join(out, 'checksums.json'))).toBe(true);
    expect(readFileSync(join(out, 'splits', 'train.jsonl'), 'utf8')).toContain(
      'sample-offline-train',
    );
    expect(readFileSync(join(out, 'manifest.json'), 'utf8')).not.toContain(
      root.replace(/\\/g, '/'),
    );
  });

  it('returns non-zero in strict mode for invalid packages', () => {
    const { root, packagePath, manifestPath, auditPath, trainingPackage } =
      fixtureFiles();
    writeFileSync(
      packagePath,
      stableStringify({ ...trainingPackage, entries: [] }),
      'utf8',
    );
    const result = runCli([
      '--package',
      packagePath,
      '--manifest',
      manifestPath,
      '--audit',
      auditPath,
      '--validate-only',
      '--strict',
    ]);

    expect(result.status).not.toBe(0);
    expect(result.stdout.toString()).toContain('offline package has no entries');
  });
});
