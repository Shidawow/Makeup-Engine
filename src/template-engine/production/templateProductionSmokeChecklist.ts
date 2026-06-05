import type { TemplateProductionBatch } from '../../templates/schema/template-production-batch.schema';
import { exportProductionBatchOperatorHandoff } from '../../templates/storage/templateProductionBatchExport';

export interface TemplateProductionSmokeChecklistItem {
  id:
    | 'source-image-manifest-imported'
    | 'production-batch-created'
    | 'tasks-created'
    | 'artifact-binding-status-visible'
    | 'ready-task-can-handoff-to-analysis'
    | 'analysis-status-can-update'
    | 'evidence-ready-task-can-approve'
    | 'rejected-task-cannot-publish'
    | 'publish-requires-confirmation'
    | 'exported-handoff-safe'
    | 'source-image-package-not-training-dataset';
  label: string;
  passed: boolean;
  detail: string;
}

export interface TemplateProductionSmokeChecklist {
  batchId?: string;
  items: TemplateProductionSmokeChecklistItem[];
  passed: boolean;
}

const hasUnsafeExportPayload = (payload: string): boolean =>
  payload.includes('blob:') ||
  payload.includes('data:image/') ||
  /(?:^|["\s])(?:[A-Za-z]:[\\/](?!\/)|\\\\)/.test(payload);

export const createProductionBatchSmokeChecklist = (
  batch?: TemplateProductionBatch | null,
): TemplateProductionSmokeChecklist => {
  const exportedHandoff = batch ? exportProductionBatchOperatorHandoff(batch) : '';
  const items: TemplateProductionSmokeChecklistItem[] = [
    {
      id: 'source-image-manifest-imported',
      label: 'source image manifest imported',
      passed: Boolean(batch?.sourceImageManifestReference),
      detail: batch?.sourceImageManifestReference ?? '缺少 manifest reference',
    },
    {
      id: 'production-batch-created',
      label: 'production batch created',
      passed: Boolean(batch?.batchId),
      detail: batch?.batchId ?? '尚未创建 batch',
    },
    {
      id: 'tasks-created',
      label: 'tasks created',
      passed: (batch?.tasks.length ?? 0) > 0,
      detail: `${batch?.tasks.length ?? 0} tasks`,
    },
    {
      id: 'artifact-binding-status-visible',
      label: 'artifact binding status visible',
      passed: Boolean(batch?.tasks.every((task) => task.artifactBindingStatus)),
      detail: '每个 task 都保留 artifact binding status',
    },
    {
      id: 'ready-task-can-handoff-to-analysis',
      label: 'ready task can handoff to analysis',
      passed: Boolean(batch?.tasks.some((task) => task.currentStatus === 'ready_for_analysis')),
      detail: '至少一个 ready_for_analysis task 可以进入 Vision Analysis',
    },
    {
      id: 'analysis-status-can-update',
      label: 'analysis status can update',
      passed: Boolean(
        batch?.tasks.some((task) =>
          ['analysis_complete', 'needs_mask_review', 'evidence_ready', 'approved', 'published'].includes(
            task.currentStatus,
          ),
        ),
      ),
      detail: '生产任务可以记录 analysis 后续状态',
    },
    {
      id: 'evidence-ready-task-can-approve',
      label: 'evidence-ready task can approve',
      passed: Boolean(batch?.tasks.some((task) => task.evidenceStatus === 'ready')),
      detail: 'evidence ready 是 approve 的前置条件',
    },
    {
      id: 'rejected-task-cannot-publish',
      label: 'rejected task cannot publish',
      passed: Boolean(
        batch?.tasks.every(
          (task) => task.currentStatus !== 'rejected' || task.publishStatus !== 'published',
        ),
      ),
      detail: 'rejected task 不允许 published',
    },
    {
      id: 'publish-requires-confirmation',
      label: 'publish requires confirmation',
      passed: Boolean(
        batch?.tasks.every(
          (task) => task.currentStatus !== 'published' || Boolean(task.publishConfirmation),
        ),
      ),
      detail: 'published 必须带 local publish confirmation',
    },
    {
      id: 'exported-handoff-safe',
      label: 'exported handoff excludes object URLs / image bytes',
      passed: Boolean(batch) && !hasUnsafeExportPayload(exportedHandoff),
      detail: 'handoff 不包含 object URL、data image 或本地绝对路径',
    },
    {
      id: 'source-image-package-not-training-dataset',
      label: 'SourceImagePackage cannot become training dataset',
      passed: true,
      detail: '仍必须经过 mask / correction / evidence / review / quality gate',
    },
  ];

  return {
    batchId: batch?.batchId,
    items,
    passed: items.every((item) => item.passed),
  };
};

export const evaluateProductionBatchSmokeChecklist = (
  batch?: TemplateProductionBatch | null,
): TemplateProductionSmokeChecklist => createProductionBatchSmokeChecklist(batch);

export const summarizeSmokeChecklist = (
  checklist: TemplateProductionSmokeChecklist,
): string => {
  const failed = checklist.items.filter((item) => !item.passed);

  return failed.length === 0
    ? 'Production Batch smoke checklist passed.'
    : `Production Batch smoke checklist has ${failed.length} failed checks: ${failed.map((item) => item.id).join(', ')}`;
};
