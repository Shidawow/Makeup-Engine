import { describe, expect, it } from 'vitest';
import { createTemplateProductionBatchFromSourceImages } from '../src/template-engine/production';
import {
  exportTemplateProductionBatchJson,
  importTemplateProductionBatchJson,
  listRecentTemplateProductionBatches,
  loadTemplateProductionBatch,
  saveTemplateProductionBatch,
} from '../src/templates/storage';
import {
  createMemoryStorage,
  createReadySourceImageBinding,
  createTemplateProductionTestManifest,
} from './templateProductionTestUtils';

describe('template production batch storage', () => {
  it('persists local batch metadata without long-term object URLs or local absolute paths', async () => {
    const storage = createMemoryStorage();
    const manifest = createTemplateProductionTestManifest();
    const binding = await createReadySourceImageBinding(manifest);
    const batch = createTemplateProductionBatchFromSourceImages({
      manifest,
      artifactBindings: { [binding.bindingId]: binding },
      manifestReference: 'source-image-package://phase-6i-test-package/manifest.json',
    });

    const json = saveTemplateProductionBatch(batch, { storage });
    const loaded = loadTemplateProductionBatch(batch.batchId, { storage });
    const exported = exportTemplateProductionBatchJson(batch);
    const imported = importTemplateProductionBatchJson(exported);

    expect(json).not.toContain('blob:phase-6i-test-binding');
    expect(json).not.toContain('C:\\');
    expect(loaded?.batchId).toBe(batch.batchId);
    expect(imported.tasks).toHaveLength(batch.tasks.length);
    expect(listRecentTemplateProductionBatches({ storage })).toHaveLength(1);
  });
});
