import { describe, expect, it } from 'vitest';
import { createDemoSourceImageManifest } from '../src/components/template-studio/source-image-intake-panel';
import {
  createTemplateAnalysisSeedFromEntry,
  getSourceImageEntryDetail,
  listSourceImageEntriesByStatus,
  loadTemplateAnalysisSeedImageData,
  parseSourceImageManifestJson,
  resolveBestImageArtifactForAnalysis,
  summarizeSourceImagePackageForStudio,
  validateSourceImageManifestForStudio,
} from '../src/templates/storage';

describe('source image package storage studio helpers', () => {
  it('parses, summarizes, and lists source image entries deterministically', () => {
    const manifest = createDemoSourceImageManifest();
    const parsed = parseSourceImageManifestJson(JSON.stringify(manifest));
    const summary = summarizeSourceImagePackageForStudio(parsed);
    const byStatus = listSourceImageEntriesByStatus(parsed);

    expect(validateSourceImageManifestForStudio(parsed).valid).toBe(true);
    expect(summary).toMatchObject({
      packageId: 'demo-source-image-package',
      imageCount: 2,
      readyCount: 1,
      blockedCount: 1,
      failedCount: 0,
    });
    expect(byStatus.ready_for_template_analysis).toHaveLength(1);
    expect(byStatus.blocked_by_codec).toHaveLength(1);
  });

  it('resolves the best artifact and creates browser-readable analysis seed data', () => {
    const manifest = createDemoSourceImageManifest();
    const ready = manifest.entries[0]!;
    const detail = getSourceImageEntryDetail(manifest, ready.sourceImageId);
    const best = resolveBestImageArtifactForAnalysis(ready);
    const seed = createTemplateAnalysisSeedFromEntry(manifest, ready);
    const imageData = loadTemplateAnalysisSeedImageData(seed);

    expect(detail?.validation.valid).toBe(true);
    expect(best?.kind).toBe('normalized-png');
    expect(imageData.canRunBrowserAnalysis).toBe(true);
    expect(imageData.previewUrl).toContain('data:image/png');
  });

  it('does not expose source image package as a training-ready dataset', () => {
    const manifest = createDemoSourceImageManifest();
    const seed = createTemplateAnalysisSeedFromEntry(manifest, manifest.entries[0]!);

    expect('trainingReady' in seed).toBe(false);
    expect('assignedSplit' in seed).toBe(false);
    expect(seed.readiness).toBe('ready_for_vision_analysis');
  });
});
