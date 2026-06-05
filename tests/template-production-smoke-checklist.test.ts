import { describe, expect, it } from 'vitest';
import {
  createProductionBatchSmokeChecklist,
  summarizeSmokeChecklist,
} from '../src/template-engine/production';
import { createTemplateProductionBatchFromSourceImages } from '../src/template-engine/production';
import {
  createReadySourceImageBinding,
  createTemplateProductionTestManifest,
} from './templateProductionTestUtils';

describe('template production smoke checklist', () => {
  it('reports deterministic operator smoke checks without remote dependencies', async () => {
    const manifest = createTemplateProductionTestManifest();
    const binding = await createReadySourceImageBinding(manifest);
    const batch = createTemplateProductionBatchFromSourceImages({
      manifest,
      artifactBindings: { [binding.bindingId]: binding },
    });
    const checklist = createProductionBatchSmokeChecklist(batch);
    const safetyChecks = checklist.items.filter((item) =>
      [
        'rejected-task-cannot-publish',
        'publish-requires-confirmation',
        'exported-handoff-safe',
        'source-image-package-not-training-dataset',
      ].includes(item.id),
    );

    expect(safetyChecks.every((item) => item.passed)).toBe(true);
    expect(summarizeSmokeChecklist(checklist)).toContain('failed checks');
  });
});
