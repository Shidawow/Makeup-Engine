import { describe, expect, it } from 'vitest';
import {
  applyRebindingRecoveryToTask,
  createRebindingRecoveryPlan,
  detectTasksNeedingRebinding,
  summarizeRebindingRecovery,
  validateRebindingAfterSessionRestore,
} from '../src/template-engine/production';
import {
  createSeedTasksWithArtifactBindingState,
  exportTemplateProductionBatchJson,
  importTemplateProductionBatchJson,
} from '../src/templates/storage';
import { createTemplateProductionBatchFromSourceImages } from '../src/template-engine/production';
import {
  createReadySourceImageBinding,
  createTemplateProductionTestManifest,
} from './templateProductionTestUtils';

describe('template production rebinding recovery', () => {
  it('detects session-restored tasks whose temporary object URL is gone', async () => {
    const manifest = createTemplateProductionTestManifest();
    const binding = await createReadySourceImageBinding(manifest);
    const batch = createTemplateProductionBatchFromSourceImages({
      manifest,
      artifactBindings: { [binding.bindingId]: binding },
    });
    const restored = importTemplateProductionBatchJson(exportTemplateProductionBatchJson(batch));
    const needingRebinding = detectTasksNeedingRebinding(restored);
    const plan = createRebindingRecoveryPlan(restored, '2026-05-31T03:00:00.000Z');
    const recovered = applyRebindingRecoveryToTask(needingRebinding[0]!, '2026-05-31T03:01:00.000Z');
    const refreshed = createSeedTasksWithArtifactBindingState({
      manifest,
      artifactBindings: { [binding.bindingId]: binding },
    }).find((task) => task.sourceImageId === recovered.sourceImageId)!;

    expect(needingRebinding.map((task) => task.sourceImageId)).toContain('ready-with-binding');
    expect(plan.taskCount).toBe(1);
    expect(validateRebindingAfterSessionRestore(restored).valid).toBe(false);
    expect(summarizeRebindingRecovery(plan)).toContain('ready-with-binding.png');
    expect(recovered.currentStatus).toBe('needs_artifact_binding');
    expect(recovered.needsRebinding).toBe(true);
    expect(recovered.templateAnalysisSeed?.readiness).toBe('blocked_by_missing_artifact');
    expect(refreshed.currentStatus).toBe('ready_for_analysis');
  });
});
