import { describe, expect, it } from 'vitest';
import { createTemplateProductionBatchFromSourceImages } from '../src/template-engine/production';
import {
  createReadySourceImageBinding,
  createTemplateProductionTestManifest,
} from './templateProductionTestUtils';

describe('template production queue', () => {
  it('creates deterministic tasks for ready, blocked, and failed source images', async () => {
    const manifest = createTemplateProductionTestManifest();
    const binding = await createReadySourceImageBinding(manifest);
    const batch = createTemplateProductionBatchFromSourceImages({
      manifest,
      artifactBindings: { [binding.bindingId]: binding },
      name: 'Phase 6I Test Batch',
      createdAt: manifest.createdAt,
    });

    expect(batch.schemaVersion).toBe('template-production-batch-v0.1');
    expect(batch.tasks).toHaveLength(4);
    expect(batch.summary.readySourceImageCount).toBe(2);
    expect(batch.summary.blockedSourceImageCount).toBe(2);
    expect(batch.tasks.map((task) => task.sourceImageId)).toEqual([
      'blocked-codec',
      'failed-import',
      'ready-with-binding',
      'ready-without-binding',
    ]);
    expect(
      batch.tasks.find((task) => task.sourceImageId === 'ready-with-binding')?.currentStatus,
    ).toBe('ready_for_analysis');
    expect(
      batch.tasks.find((task) => task.sourceImageId === 'ready-without-binding')?.currentStatus,
    ).toBe('needs_artifact_binding');
    expect(
      batch.tasks.find((task) => task.sourceImageId === 'blocked-codec')?.currentStatus,
    ).toBe('blocked_by_source_image');
  });
});
