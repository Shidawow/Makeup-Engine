import { describe, expect, it } from 'vitest';
import { createTemplateProductionBatchFromSourceImages } from '../src/template-engine/production';
import {
  createProductionBatchManifest,
  exportProductionBatchHandoff,
  exportProductionBatchSummary,
  exportProductionBatchTasksJson,
} from '../src/templates/storage';
import {
  createReadySourceImageBinding,
  createTemplateProductionTestManifest,
} from './templateProductionTestUtils';

describe('template production batch export', () => {
  it('exports handoff-safe summaries and manifests', async () => {
    const manifest = createTemplateProductionTestManifest();
    const binding = await createReadySourceImageBinding(manifest);
    const batch = createTemplateProductionBatchFromSourceImages({
      manifest,
      artifactBindings: { [binding.bindingId]: binding },
    });
    const handoff = exportProductionBatchHandoff(batch);
    const summary = JSON.parse(exportProductionBatchSummary(batch)) as { totalTasks: number };
    const tasks = JSON.parse(exportProductionBatchTasksJson(batch)) as unknown[];
    const batchManifest = createProductionBatchManifest(batch);

    expect(summary.totalTasks).toBe(4);
    expect(tasks).toHaveLength(4);
    expect(batchManifest.notes.join('\n')).toContain('SourceImagePackage cannot directly become a training dataset');
    expect(handoff).toContain('No object URL is treated as a long-term artifact reference');
    expect(handoff).not.toContain('blob:phase-6i-test-binding');
    expect(handoff).not.toContain('data:image/');
  });
});
