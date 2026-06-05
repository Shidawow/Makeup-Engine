import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  ClipboardCheck,
  FileJson,
  ListFilter,
  PackagePlus,
  Play,
  RefreshCw,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react';
import type { SourceImageManifest } from '../../../training/schema';
import type {
  SourceImageArtifactBindingMap,
  TemplateAnalysisSeed,
} from '../../../templates/schema';
import {
  TEMPLATE_PRODUCTION_REVIEW_REASON_LABELS,
  TEMPLATE_PRODUCTION_REVIEW_REASONS,
  type TemplateProductionReviewReason,
} from '../../../templates/schema/template-production-qa.schema';
import type {
  TemplateProductionBatch,
  TemplateProductionTask,
  TemplateProductionTaskStatus,
} from '../../../templates/schema/template-production-batch.schema';
import {
  createSeedTasksWithArtifactBindingState,
  exportProductionBatchOperatorHandoff,
  exportTemplateProductionBatchJson,
  importTemplateProductionBatchJson,
  saveTemplateProductionBatch,
} from '../../../templates/storage';
import {
  applyRebindingRecoveryToTask,
  confirmPublishProductionTask,
  createTemplateProductionBatchFromSourceImages,
  evaluateProductionBatchQa,
  evaluateProductionTaskQa,
  getNextActionForProductionTask,
  markTaskAnalysisComplete,
  markTaskApproved,
  markTaskEvidenceReady,
  markTaskNeedsMaskReview,
  markTaskReadyForAnalysis,
  publishTemplateProductionTask,
  rejectTemplateProductionTaskWithReason,
  summarizeBatchTaskIssues,
  summarizeTemplateProductionBatch,
} from '../../../template-engine/production';

export type TemplateProductionTaskFilter =
  | 'all'
  | 'blocking'
  | 'warnings'
  | 'needs_binding'
  | 'analysis_failed'
  | 'evidence_missing'
  | 'ready_to_publish'
  | Extract<
      TemplateProductionTaskStatus,
      | 'needs_artifact_binding'
      | 'ready_for_analysis'
      | 'analysis_complete'
      | 'needs_mask_review'
      | 'evidence_ready'
      | 'approved'
      | 'rejected'
      | 'published'
    >;

export interface TemplateProductionBatchPanelProps {
  manifest?: SourceImageManifest | null;
  artifactBindings: SourceImageArtifactBindingMap;
  activeBatch?: TemplateProductionBatch | null;
  selectedTaskId?: string;
  filter?: TemplateProductionTaskFilter;
  onBatchChange: (batch: TemplateProductionBatch | null) => void;
  onSelectedTaskChange?: (task: TemplateProductionTask | null) => void;
  onSeedSelected?: (seed: TemplateAnalysisSeed) => void;
  onFilterChange?: (filter: TemplateProductionTaskFilter) => void;
}

const issueFilters: { value: TemplateProductionTaskFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'blocking', label: '阻断' },
  { value: 'warnings', label: '警告' },
  { value: 'needs_binding', label: '需绑定' },
  { value: 'analysis_failed', label: '分析失败' },
  { value: 'evidence_missing', label: '缺证据' },
  { value: 'rejected', label: '已拒绝' },
  { value: 'ready_to_publish', label: '可发布' },
];

const statusLabels: Record<TemplateProductionTaskStatus, string> = {
  draft: '草稿',
  blocked_by_source_image: '源图阻断',
  needs_artifact_binding: '待绑定 artifact',
  ready_for_analysis: '可分析',
  analyzing: '分析中',
  analysis_failed: '分析失败',
  analysis_complete: '分析完成',
  needs_mask_review: '待蒙版审核',
  needs_human_correction: '待人工修正',
  correction_complete: '修正完成',
  evidence_ready: '证据完成',
  ready_for_template_review: '待模板审核',
  approved: '已批准',
  rejected: '已拒绝',
  published: '本地已发布',
};

const qaStatusLabels = {
  pass: '通过',
  warning: '警告',
  blocked: '阻断',
  needs_operator_action: '需处理',
  ready_for_review: '可审核',
  ready_for_publish: '可发布',
};

const applyQaFields = (task: TemplateProductionTask): TemplateProductionTask => {
  const qa = evaluateProductionTaskQa(task);

  return {
    ...task,
    qaStatus: qa.qaStatus,
    qaIssues: [...qa.blockingIssues, ...qa.warningIssues],
    blockingIssueCount: qa.blockingIssueCount,
    warningIssueCount: qa.warningCount,
    nextOperatorAction: qa.nextOperatorAction,
    needsRebinding: qa.needsRebinding,
  };
};

const cloneBatchWithTasks = (
  batch: TemplateProductionBatch,
  tasks: TemplateProductionTask[],
): TemplateProductionBatch => {
  const updatedAt = new Date().toISOString();
  const qaTasks = tasks.map(applyQaFields);
  const nextBatch = {
    ...batch,
    tasks: qaTasks,
    updatedAt,
    issues: summarizeBatchTaskIssues(qaTasks),
  };

  return {
    ...nextBatch,
    summary: summarizeTemplateProductionBatch(nextBatch),
    status:
      qaTasks.every((task) => task.currentStatus === 'published')
        ? 'completed'
        : qaTasks.some((task) =>
            [
              'ready_for_analysis',
              'analyzing',
              'analysis_complete',
              'needs_mask_review',
              'evidence_ready',
              'approved',
            ].includes(task.currentStatus),
          )
          ? 'active'
          : qaTasks.some((task) => task.currentStatus === 'needs_artifact_binding')
            ? 'blocked'
            : batch.status,
  };
};

const updateTask = (
  batch: TemplateProductionBatch,
  taskId: string,
  updater: (task: TemplateProductionTask) => TemplateProductionTask,
): TemplateProductionBatch =>
  cloneBatchWithTasks(
    batch,
    batch.tasks.map((task) => (task.taskId === taskId ? updater(task) : task)),
  );

const taskMatchesFilter = (
  task: TemplateProductionTask,
  filter: TemplateProductionTaskFilter,
): boolean => {
  const qa = evaluateProductionTaskQa(task);

  switch (filter) {
    case 'all':
      return true;
    case 'blocking':
      return qa.blockingIssueCount > 0;
    case 'warnings':
      return qa.warningCount > 0;
    case 'needs_binding':
      return (
        task.currentStatus === 'needs_artifact_binding' ||
        task.artifactBindingStatus !== 'validated' ||
        qa.needsRebinding
      );
    case 'analysis_failed':
      return task.currentStatus === 'analysis_failed' || task.analysisStatus === 'failed';
    case 'evidence_missing':
      return (
        ['ready_for_template_review', 'approved', 'published'].includes(task.currentStatus) &&
        task.evidenceStatus !== 'ready'
      );
    case 'ready_to_publish':
      return task.currentStatus === 'approved' && Boolean(task.publishConfirmation);
    default:
      return task.currentStatus === filter;
  }
};

const selectTask = (
  task: TemplateProductionTask,
  onSelectedTaskChange?: (task: TemplateProductionTask | null) => void,
) => {
  onSelectedTaskChange?.(task);
};

export function TemplateProductionBatchPanel({
  manifest,
  artifactBindings,
  activeBatch,
  selectedTaskId,
  filter = 'all',
  onBatchChange,
  onSelectedTaskChange,
  onSeedSelected,
  onFilterChange,
}: TemplateProductionBatchPanelProps) {
  const [batchName, setBatchName] = useState('本地模板生产批次');
  const [exchangeJson, setExchangeJson] = useState('');
  const [message, setMessage] = useState('');
  const [rejectReason, setRejectReason] = useState<TemplateProductionReviewReason | ''>('');
  const [rejectNote, setRejectNote] = useState('');
  const [publishNote, setPublishNote] = useState('');
  const [publishLocalConfirmed, setPublishLocalConfirmed] = useState(false);
  const [publishNotOnlineConfirmed, setPublishNotOnlineConfirmed] = useState(false);
  const [publishNoTrainingConfirmed, setPublishNoTrainingConfirmed] = useState(false);

  const qaReport = useMemo(
    () => (activeBatch ? evaluateProductionBatchQa(activeBatch) : null),
    [activeBatch],
  );
  const selectedTask = useMemo(
    () => activeBatch?.tasks.find((task) => task.taskId === selectedTaskId) ?? null,
    [activeBatch, selectedTaskId],
  );
  const selectedTaskQa = useMemo(
    () => (selectedTask ? evaluateProductionTaskQa(selectedTask) : null),
    [selectedTask],
  );
  const visibleTasks = useMemo(
    () => activeBatch?.tasks.filter((task) => taskMatchesFilter(task, filter)) ?? [],
    [activeBatch, filter],
  );

  const createBatch = () => {
    if (!manifest) {
      setMessage('请先导入 source-image-manifest.json。');
      return;
    }

    const batch = createTemplateProductionBatchFromSourceImages({
      manifest,
      artifactBindings,
      name: batchName.trim() || `Production Batch ${manifest.packageId}`,
    });
    const next = cloneBatchWithTasks(batch, batch.tasks);

    saveTemplateProductionBatch(next);
    onBatchChange(next);
    onSelectedTaskChange?.(next.tasks[0] ?? null);
    setMessage('已创建 Production Batch。');
  };

  const refreshArtifactState = () => {
    if (!manifest || !activeBatch) {
      setMessage('请先导入 manifest 并创建批次。');
      return;
    }

    const refreshedTasks = createSeedTasksWithArtifactBindingState({
      manifest,
      artifactBindings,
    });
    const refreshedBySourceImage = new Map(
      refreshedTasks.map((task) => [task.sourceImageId, task]),
    );
    const next = cloneBatchWithTasks(
      activeBatch,
      activeBatch.tasks.map((task) => {
        const refreshed = refreshedBySourceImage.get(task.sourceImageId);

        if (!refreshed) {
          return task;
        }

        if (
          ['needs_artifact_binding', 'ready_for_analysis', 'blocked_by_source_image', 'draft'].includes(
            task.currentStatus,
          )
        ) {
          return refreshed;
        }

        return {
          ...task,
          artifactBindingStatus: refreshed.artifactBindingStatus,
          templateAnalysisSeed: refreshed.templateAnalysisSeed,
          needsRebinding: false,
          issues:
            refreshed.artifactBindingStatus === 'validated'
              ? task.issues.filter((issue) => issue.code !== 'artifact-rebinding-required')
              : task.issues,
          updatedAt: new Date().toISOString(),
        };
      }),
    );

    saveTemplateProductionBatch(next);
    onBatchChange(next);
    setMessage('已刷新 artifact binding 状态。');
  };

  const applyTaskUpdate = (
    taskId: string,
    updater: (task: TemplateProductionTask) => TemplateProductionTask,
    nextMessage: string,
  ) => {
    if (!activeBatch) {
      return;
    }

    const next = updateTask(activeBatch, taskId, updater);
    saveTemplateProductionBatch(next);
    onBatchChange(next);
    onSelectedTaskChange?.(next.tasks.find((task) => task.taskId === taskId) ?? null);
    setMessage(nextMessage);
  };

  const sendSelectedToAnalysis = () => {
    if (!selectedTask?.templateAnalysisSeed) {
      setMessage('当前任务没有 TemplateAnalysisSeed。');
      return;
    }

    if (selectedTask.templateAnalysisSeed.readiness !== 'ready_for_vision_analysis') {
      setMessage('只有 ready_for_vision_analysis seed 才能进入 Vision Analysis。');
      return;
    }

    if (selectedTaskQa?.blockingIssueCount) {
      setMessage('当前任务仍有阻断 QA issue，不能进入 Vision Analysis。');
      return;
    }

    onSeedSelected?.(selectedTask.templateAnalysisSeed);
    setMessage('已把任务 seed 发送到 Vision Analysis。');
  };

  const exportBatch = () => {
    if (!activeBatch) {
      setMessage('没有可导出的批次。');
      return;
    }

    setExchangeJson(exportTemplateProductionBatchJson(activeBatch));
    setMessage('已生成 Production Batch JSON。');
  };

  const exportOperatorHandoff = () => {
    if (!activeBatch) {
      setMessage('没有可导出的批次。');
      return;
    }

    setExchangeJson(exportProductionBatchOperatorHandoff(activeBatch));
    setMessage('已生成 Operator Handoff JSON。');
  };

  const importBatch = () => {
    try {
      const batch = importTemplateProductionBatchJson(exchangeJson);
      const next = cloneBatchWithTasks(batch, batch.tasks);
      saveTemplateProductionBatch(next);
      onBatchChange(next);
      onSelectedTaskChange?.(next.tasks[0] ?? null);
      setMessage('已导入 Production Batch JSON。');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '批次 JSON 导入失败。');
    }
  };

  const rejectSelectedTask = () => {
    if (!selectedTask || !rejectReason) {
      setMessage('reject 前必须选择固定原因。');
      return;
    }

    applyTaskUpdate(
      selectedTask.taskId,
      (task) =>
        rejectTemplateProductionTaskWithReason(task, {
          reason: rejectReason,
          note: rejectNote.trim() || undefined,
        }),
      '已记录 reject reason 并拒绝任务。',
    );
  };

  const publishSelectedTask = () => {
    if (!selectedTask) {
      return;
    }

    if (!publishLocalConfirmed || !publishNotOnlineConfirmed || !publishNoTrainingConfirmed) {
      setMessage('publish 前必须确认本地状态、非线上发布、不会生成 training dataset。');
      return;
    }

    applyTaskUpdate(
      selectedTask.taskId,
      (task) =>
        publishTemplateProductionTask(
          confirmPublishProductionTask(task, {
            operatorNote: publishNote.trim() || undefined,
          }),
        ),
      '已确认并发布本地 production 状态。',
    );
  };

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">模板生产批次 QA</h2>
          <p className="text-xs text-stone-500">
            批量管理 SourceImagePackage 到 Vision Analysis、证据、审核和本地发布状态。
          </p>
        </div>
        <ShieldCheck aria-hidden="true" className="text-teal-700" size={18} />
      </div>

      <div className="mt-4 grid gap-3">
        <label className="grid gap-1.5 text-sm">
          <span className="text-xs font-semibold text-stone-500">批次名称</span>
          <input
            className="h-9 rounded-md border border-stone-200 px-3 text-sm"
            onChange={(event) => setBatchName(event.target.value)}
            value={batchName}
          />
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
          <p className="rounded-md bg-stone-50 p-2">source {manifest?.entries.length ?? 0}</p>
          <p className="rounded-md bg-stone-50 p-2">
            ready{' '}
            {manifest?.entries.filter((entry) => entry.importStatus === 'ready_for_template_analysis').length ?? 0}
          </p>
          <p className="rounded-md bg-stone-50 p-2">
            blocked{' '}
            {manifest?.entries.filter((entry) =>
              ['blocked_by_codec', 'blocked_by_quality'].includes(entry.importStatus),
            ).length ?? 0}
          </p>
          <p className="rounded-md bg-stone-50 p-2">
            failed {manifest?.entries.filter((entry) => entry.importStatus === 'failed').length ?? 0}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="inline-flex h-9 items-center gap-2 rounded-md bg-stone-950 px-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!manifest}
            onClick={createBatch}
            type="button"
          >
            <PackagePlus aria-hidden="true" size={15} />
            创建批次任务
          </button>
          <button
            className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!activeBatch}
            onClick={refreshArtifactState}
            type="button"
          >
            <RefreshCw aria-hidden="true" size={15} />
            刷新绑定状态
          </button>
          <button
            className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!activeBatch}
            onClick={exportBatch}
            type="button"
          >
            <FileJson aria-hidden="true" size={15} />
            导出批次 JSON
          </button>
          <button
            className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!activeBatch}
            onClick={exportOperatorHandoff}
            type="button"
          >
            <ClipboardCheck aria-hidden="true" size={15} />
            导出交接 JSON
          </button>
        </div>
      </div>

      {qaReport ? (
        <>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
            <p className="rounded-md bg-teal-50 p-2">任务 {qaReport.totalTasks}</p>
            <p className="rounded-md bg-teal-50 p-2">可分析 {qaReport.readyForAnalysisCount}</p>
            <p className="rounded-md bg-red-50 p-2">阻断 {qaReport.blockingCount}</p>
            <p className="rounded-md bg-amber-50 p-2">警告 {qaReport.warningCount}</p>
            <p className="rounded-md bg-stone-50 p-2">需处理 {qaReport.needsOperatorActionCount}</p>
            <p className="rounded-md bg-stone-50 p-2">已批准 {qaReport.approvedCount}</p>
            <p className="rounded-md bg-stone-50 p-2">已拒绝 {qaReport.rejectedCount}</p>
            <p className="rounded-md bg-stone-50 p-2">本地发布 {qaReport.publishedCount}</p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500">
              <ListFilter aria-hidden="true" size={14} />
              问题筛选
            </span>
            {issueFilters.map((item) => (
              <button
                className={`h-8 rounded-md px-2 text-xs font-semibold ${
                  filter === item.value
                    ? 'bg-stone-950 text-white'
                    : 'border border-stone-200 text-stone-600'
                }`}
                key={item.value}
                onClick={() => onFilterChange?.(item.value)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-3 grid gap-2">
            {visibleTasks.map((task) => {
              const selected = task.taskId === selectedTaskId;
              const qa = evaluateProductionTaskQa(task);
              const reasonText = task.rejectReason
                ? TEMPLATE_PRODUCTION_REVIEW_REASON_LABELS[task.rejectReason]
                : task.reviewReason
                  ? TEMPLATE_PRODUCTION_REVIEW_REASON_LABELS[task.reviewReason]
                  : '未记录';

              return (
                <button
                  className={`rounded-md border p-3 text-left text-sm ${
                    selected
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                  key={task.taskId}
                  onClick={() => selectTask(task, onSelectedTaskChange)}
                  type="button"
                >
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{task.originalFileName}</span>
                    <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[11px] text-stone-700">
                      QA {qaStatusLabels[qa.qaStatus]}
                    </span>
                    {qa.needsRebinding ? (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[11px] text-amber-800">
                        需重新绑定
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1 block text-xs text-stone-500">
                    {task.sourceImageReadiness} / artifact {task.artifactBindingStatus} / seed{' '}
                    {task.templateAnalysisSeed?.readiness ?? 'none'} / {statusLabels[task.currentStatus]}
                  </span>
                  <span className="mt-1 block text-xs text-stone-600">
                    阻断 {qa.blockingIssueCount} / 警告 {qa.warningCount} / 原因 {reasonText}
                  </span>
                  <span className="mt-1 block text-xs text-teal-800">
                    下一步：{qa.nextOperatorAction || getNextActionForProductionTask(task)}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      ) : null}

      {selectedTask ? (
        <div className="mt-4 grid gap-3 rounded-md border border-stone-200 p-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold">当前任务：{selectedTask.originalFileName}</p>
              <p className="text-xs text-stone-500">
                QA {selectedTaskQa ? qaStatusLabels[selectedTaskQa.qaStatus] : '未评估'} /{' '}
                {statusLabels[selectedTask.currentStatus]}
              </p>
            </div>
            {selectedTask.currentStatus === 'published' ? (
              <p className="rounded-md bg-teal-50 px-2 py-1 text-xs text-teal-800">
                本地 published 仅代表管理员生产状态，不是线上发布。
              </p>
            ) : null}
          </div>

          {selectedTaskQa?.blockingIssues.length ? (
            <div className="grid gap-1 rounded-md bg-red-50 p-2 text-xs text-red-900">
              {selectedTaskQa.blockingIssues.map((issue) => (
                <p key={`${issue.code}-${issue.source}`}>
                  <AlertTriangle aria-hidden="true" className="mr-1 inline" size={13} />
                  {issue.message} 下一步：{issue.nextAction}
                </p>
              ))}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex h-8 items-center gap-1 rounded-md bg-teal-700 px-2 text-xs font-semibold text-white"
              onClick={sendSelectedToAnalysis}
              type="button"
            >
              <Send aria-hidden="true" size={14} />
              发送到分析
            </button>
            <button
              className="inline-flex h-8 items-center gap-1 rounded-md border border-stone-200 px-2 text-xs font-semibold"
              onClick={() =>
                applyTaskUpdate(selectedTask.taskId, markTaskReadyForAnalysis, '已标记为 ready_for_analysis。')
              }
              type="button"
            >
              <Play aria-hidden="true" size={14} />
              标记可分析
            </button>
            <button
              className="h-8 rounded-md border border-stone-200 px-2 text-xs font-semibold"
              onClick={() =>
                applyTaskUpdate(selectedTask.taskId, markTaskAnalysisComplete, '已标记 analysis_complete。')
              }
              type="button"
            >
              分析完成
            </button>
            <button
              className="h-8 rounded-md border border-stone-200 px-2 text-xs font-semibold"
              onClick={() =>
                applyTaskUpdate(selectedTask.taskId, markTaskNeedsMaskReview, '已进入 needs_mask_review。')
              }
              type="button"
            >
              蒙版审核
            </button>
            <button
              className="h-8 rounded-md border border-stone-200 px-2 text-xs font-semibold"
              onClick={() =>
                applyTaskUpdate(selectedTask.taskId, markTaskEvidenceReady, '已标记 evidence_ready。')
              }
              type="button"
            >
              证据完成
            </button>
            <button
              className="inline-flex h-8 items-center gap-1 rounded-md border border-stone-200 px-2 text-xs font-semibold"
              onClick={() =>
                applyTaskUpdate(selectedTask.taskId, markTaskApproved, '已批准模板任务。')
              }
              type="button"
            >
              <Check aria-hidden="true" size={14} />
              批准
            </button>
            <button
              className="h-8 rounded-md border border-amber-200 px-2 text-xs font-semibold text-amber-800"
              onClick={() =>
                applyTaskUpdate(selectedTask.taskId, applyRebindingRecoveryToTask, '已标记为需要重新绑定 artifact。')
              }
              type="button"
            >
              重新绑定恢复
            </button>
          </div>

          <div className="grid gap-2 rounded-md bg-stone-50 p-3">
            <p className="text-xs font-semibold text-stone-600">Reject reason</p>
            <select
              className="h-9 rounded-md border border-stone-200 bg-white px-2 text-sm"
              onChange={(event) =>
                setRejectReason(event.target.value as TemplateProductionReviewReason | '')
              }
              value={rejectReason}
            >
              <option value="">请选择拒绝原因</option>
              {TEMPLATE_PRODUCTION_REVIEW_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {TEMPLATE_PRODUCTION_REVIEW_REASON_LABELS[reason]}
                </option>
              ))}
            </select>
            <input
              className="h-9 rounded-md border border-stone-200 px-3 text-sm"
              onChange={(event) => setRejectNote(event.target.value)}
              placeholder="可选备注"
              value={rejectNote}
            />
            <button
              className="inline-flex h-8 w-fit items-center gap-1 rounded-md border border-stone-200 px-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!rejectReason}
              onClick={rejectSelectedTask}
              type="button"
            >
              <X aria-hidden="true" size={14} />
              拒绝并记录原因
            </button>
          </div>

          <div className="grid gap-2 rounded-md bg-teal-50 p-3">
            <p className="text-xs font-semibold text-teal-900">Publish confirmation</p>
            <label className="flex items-center gap-2 text-xs text-teal-900">
              <input
                checked={publishLocalConfirmed}
                onChange={(event) => setPublishLocalConfirmed(event.target.checked)}
                type="checkbox"
              />
              确认这是本地 published 状态
            </label>
            <label className="flex items-center gap-2 text-xs text-teal-900">
              <input
                checked={publishNotOnlineConfirmed}
                onChange={(event) => setPublishNotOnlineConfirmed(event.target.checked)}
                type="checkbox"
              />
              确认不是线上发布，也不会上传服务器
            </label>
            <label className="flex items-center gap-2 text-xs text-teal-900">
              <input
                checked={publishNoTrainingConfirmed}
                onChange={(event) => setPublishNoTrainingConfirmed(event.target.checked)}
                type="checkbox"
              />
              确认不会生成 training dataset
            </label>
            <input
              className="h-9 rounded-md border border-teal-200 px-3 text-sm"
              onChange={(event) => setPublishNote(event.target.value)}
              placeholder="可选发布备注"
              value={publishNote}
            />
            <button
              className="h-8 w-fit rounded-md bg-teal-700 px-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!publishLocalConfirmed || !publishNotOnlineConfirmed || !publishNoTrainingConfirmed}
              onClick={publishSelectedTask}
              type="button"
            >
              确认并本地发布
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-4 grid gap-2">
        <textarea
          className="min-h-28 rounded-md border border-stone-200 p-2 font-mono text-xs"
          onChange={(event) => setExchangeJson(event.target.value)}
          placeholder="Production Batch JSON / Operator Handoff JSON"
          value={exchangeJson}
        />
        <div className="flex flex-wrap gap-2">
          <button
            className="h-8 rounded-md border border-stone-200 px-2 text-xs font-semibold"
            onClick={importBatch}
            type="button"
          >
            导入批次 JSON
          </button>
          {message ? <p className="text-xs text-stone-600">{message}</p> : null}
        </div>
      </div>
    </section>
  );
}
