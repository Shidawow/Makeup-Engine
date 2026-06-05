import { describe, expect, it } from 'vitest';
import {
  createPortableArtifactUri,
  normalizeDatasetPath,
  resolveAuditReportPath,
  resolveChecksumsPath,
  resolveDatasetRootDir,
  resolveManifestPath,
  resolvePackagePath,
  resolveSplitFilePath,
} from '../src/templates/storage';

describe('artifact path resolver', () => {
  it('normalizes Windows and POSIX paths without leaking absolute roots', () => {
    expect(normalizeDatasetPath('datasets\\makeup-engine\\dev-v0')).toBe(
      'datasets/makeup-engine/dev-v0',
    );
    expect(normalizeDatasetPath('./datasets/../datasets/makeup-engine')).toBe(
      'datasets/makeup-engine',
    );
    expect(() => normalizeDatasetPath('C:\\tmp\\dataset')).toThrow(
      'Absolute dataset paths are not allowed',
    );
    expect(
      normalizeDatasetPath('C:\\tmp\\dataset', { allowAbsolutePaths: true }),
    ).toBe('C:/tmp/dataset');
  });

  it('resolves stable package paths and portable URIs', () => {
    expect(resolveDatasetRootDir({ datasetVersion: 'dev-v0' })).toBe(
      'datasets/makeup-engine/dev-v0',
    );
    expect(resolveManifestPath()).toBe('manifest.json');
    expect(resolvePackagePath()).toBe('package.json');
    expect(resolveAuditReportPath()).toBe('audit-report.json');
    expect(resolveChecksumsPath()).toBe('checksums.json');
    expect(resolveSplitFilePath('train')).toBe('splits/train.jsonl');
    expect(createPortableArtifactUri('masks\\mask-a.json')).toBe(
      'materialized://masks/mask-a.json',
    );
  });
});
