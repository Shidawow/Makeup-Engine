import { describe, expect, it } from 'vitest';
import {
  createBatchTemplateAnalysisSeeds,
  createSeedsForReadySourceImages,
  validateBatchSeedReadiness,
} from '../src/templates/storage';
import { createTemplateProductionBatchFromSourceImages } from '../src/template-engine/production';
import {
  createReadySourceImageBinding,
  createTemplateProductionTestManifest,
} from './templateProductionTestUtils';

describe('batch template analysis seed creation', () => {
  it('upgrades only bound ready source images to ready_for_vision_analysis', async () => {
    const manifest = createTemplateProductionTestManifest();
    const binding = await createReadySourceImageBinding(manifest);
    const result = createBatchTemplateAnalysisSeeds({
      manifest,
      artifactBindings: { [binding.bindingId]: binding },
      createdAt: manifest.createdAt,
    });
    const readyOnly = createSeedsForReadySourceImages({
      manifest,
      artifactBindings: { [binding.bindingId]: binding },
      createdAt: manifest.createdAt,
    });
    const batch = createTemplateProductionBatchFromSourceImages({
      manifest,
      artifactBindings: { [binding.bindingId]: binding },
      createdAt: manifest.createdAt,
    });

    expect(result.summary.totalSourceImages).toBe(4);
    expect(result.summary.readySourceImages).toBe(2);
    expect(result.summary.readyForAnalysisTasks).toBe(1);
    expect(result.summary.needsArtifactBindingTasks).toBe(1);
    expect(readyOnly.tasks).toHaveLength(2);
    expect(
      result.tasks.find((task) => task.sourceImageId === 'ready-with-binding')?.templateAnalysisSeed
        ?.readiness,
    ).toBe('ready_for_vision_analysis');
    expect(
      result.tasks.find((task) => task.sourceImageId === 'ready-without-binding')?.templateAnalysisSeed
        ?.readiness,
    ).toBe('blocked_by_missing_artifact');
    expect(validateBatchSeedReadiness(batch).valid).toBe(true);
  });
});
