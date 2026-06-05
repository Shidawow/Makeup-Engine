import { describe, expect, it } from 'vitest';
import { createDemoSourceImageManifest } from '../src/components/template-studio/source-image-intake-panel';
import {
  createTemplateAnalysisSeedFromEntry,
  validateTemplateAnalysisSeedReadiness,
} from '../src/templates/storage';
import { TEMPLATE_ANALYSIS_SEED_SCHEMA_VERSION } from '../src/templates/schema';

describe('TemplateAnalysisSeed schema', () => {
  it('creates a deterministic seed from a ready source image entry', () => {
    const manifest = createDemoSourceImageManifest();
    const entry = manifest.entries[0]!;
    const first = createTemplateAnalysisSeedFromEntry(manifest, entry);
    const second = createTemplateAnalysisSeedFromEntry(manifest, entry);

    expect(first.schemaVersion).toBe(TEMPLATE_ANALYSIS_SEED_SCHEMA_VERSION);
    expect(first.seedId).toBe(second.seedId);
    expect(first.sourceImagePackageId).toBe(manifest.packageId);
    expect(first.sourceImageId).toBe(entry.sourceImageId);
    expect(first.readiness).toBe('ready_for_vision_analysis');
    expect(first.selectedArtifactPreference).toBe('normalized-png');
    expect(first.normalizedPngReference?.browserReadable).toBe(true);
    expect(first.qualityReport.qualityScore).toBe(0.92);
  });

  it('keeps blocked source images out of runnable vision analysis', () => {
    const manifest = createDemoSourceImageManifest();
    const blocked = manifest.entries[1]!;
    const validation = validateTemplateAnalysisSeedReadiness(blocked);
    const seed = createTemplateAnalysisSeedFromEntry(manifest, blocked);

    expect(validation.valid).toBe(false);
    expect(seed.readiness).toBe('blocked_by_codec');
    expect(seed.issues.map((issue) => issue.code)).toContain(
      'source-image-not-ready',
    );
  });
});
