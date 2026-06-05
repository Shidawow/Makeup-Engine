import { Clipboard, Database, Download, Save, ScanSearch } from 'lucide-react';
import type {
  HumanCorrectionDataset,
  HumanCorrectionSample,
} from '../../../templates/schema';

export interface DatasetPanelProps {
  dataset: HumanCorrectionDataset | null;
  samples: readonly HumanCorrectionSample[];
  onExportJson: () => void;
  onExportJsonl: () => void;
  onCopyDatasetSummary: () => void;
  onBatchSave: () => void;
  onBatchReanalysis: () => void;
  canBatchSave: boolean;
  canBatchReanalysis: boolean;
}

const formatRatio = (value: number): string => `${Math.round(value * 1000) / 10}%`;

export function DatasetPanel({
  dataset,
  samples,
  onExportJson,
  onExportJsonl,
  onCopyDatasetSummary,
  onBatchSave,
  onBatchReanalysis,
  canBatchSave,
  canBatchReanalysis,
}: DatasetPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">人工修正数据集</h2>
          <p className="text-xs font-medium text-stone-500">
            {dataset?.datasetId ?? '暂无数据集'} / {samples.length} 个样本
          </p>
        </div>
        <Database aria-hidden="true" className="text-teal-700" size={18} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canBatchSave}
          onClick={onBatchSave}
          type="button"
        >
          <Save aria-hidden="true" size={15} />
          批量保存
        </button>
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canBatchReanalysis}
          onClick={onBatchReanalysis}
          type="button"
        >
          <ScanSearch aria-hidden="true" size={15} />
          批量重分析
        </button>
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!dataset}
          onClick={onExportJson}
          type="button"
        >
          <Download aria-hidden="true" size={15} />
          导出 JSON
        </button>
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!dataset}
          onClick={onExportJsonl}
          type="button"
        >
          <Download aria-hidden="true" size={15} />
          导出 JSONL
        </button>
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!dataset}
          onClick={onCopyDatasetSummary}
          type="button"
        >
          <Clipboard aria-hidden="true" size={15} />
          复制摘要
        </button>
      </div>

      <div className="mt-4 grid gap-2">
        {samples.length === 0 ? (
          <div className="rounded-md border border-dashed border-stone-200 p-3 text-sm text-stone-500">
            还没有修正样本。请先在画布上编辑蒙版并保存修正，系统会生成可审核的 HumanCorrectionSample。
          </div>
        ) : (
          samples.map((sample) => (
            <div
              className="rounded-md border border-stone-200 bg-stone-50 p-3"
              key={sample.sampleId}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-stone-900">
                  {sample.regionId}
                </span>
                <span className="rounded bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-900">
                  {sample.humanVerificationStatus}
                </span>
              </div>
              <div className="mt-2 grid gap-1 text-xs leading-5 text-stone-600">
                <p>样本：{sample.sampleId}</p>
                <p>修正置信度：{sample.correctionConfidence.toFixed(3)}</p>
                <p>
                  变化：{formatRatio(sample.maskDiff.changedAreaRatio)} / 新增：{' '}
                  {formatRatio(sample.maskDiff.addedAreaRatio)} / 移除：{' '}
                  {formatRatio(sample.maskDiff.removedAreaRatio)}
                </p>
                <p>类型：{sample.maskDiff.correctionType}</p>
                <p>
                  人工确认：{' '}
                  {sample.humanVerificationStatus === 'human_verified' ||
                  sample.humanVerificationStatus === 'ready_for_dataset'
                    ? '是'
                    : '否'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
