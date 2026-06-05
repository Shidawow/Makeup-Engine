import { Clipboard, Download, FileCheck2 } from 'lucide-react';
import type { SegmentationTrainingManifest } from '../../../templates/schema';

export interface TrainingAdapterPanelProps {
  manifest: SegmentationTrainingManifest | null;
  onExportManifest: () => void;
  onExportTrain: () => void;
  onExportValidation: () => void;
  onExportTest: () => void;
  onCopySummary: () => void;
}

const preflightCommand =
  'node scripts/training-preflight.mjs --dataset ./datasets/makeup-engine/dev-v0 --config ./trainer-config.json --runtime dry-run --export-run-package ./exports/training-run-package.json --export-quarantine ./exports/failed-samples.json --export-evaluation ./exports/evaluation-report.json --export-model-manifest ./exports/model-artifact-manifest.json --strict';

export function TrainingAdapterPanel({
  manifest,
  onExportManifest,
  onExportTrain,
  onExportValidation,
  onExportTest,
  onCopySummary,
}: TrainingAdapterPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">训练适配器</h2>
          <p className="text-xs font-medium text-stone-500">
            {manifest
              ? `${manifest.targetSummary.totalSamples} 条训练引用`
              : '暂无训练清单'}
          </p>
        </div>
        <FileCheck2 aria-hidden="true" className="text-teal-700" size={18} />
      </div>

      <div className="mt-3 rounded-md border border-teal-100 bg-teal-50 p-3 text-xs leading-5 text-teal-950">
        Phase 6A 之后训练桥接只消费 MaterializedTrainingDataset。下一步使用
        training-preflight 生成 training run package、quarantine、evaluation report
        和 model artifact manifest；浏览器不运行训练。
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!manifest}
          onClick={onExportManifest}
          type="button"
        >
          <Download aria-hidden="true" size={15} />
          导出清单
        </button>
        <button className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50" disabled={!manifest} onClick={onExportTrain} type="button">
          训练集
        </button>
        <button className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50" disabled={!manifest} onClick={onExportValidation} type="button">
          验证集
        </button>
        <button className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50" disabled={!manifest} onClick={onExportTest} type="button">
          测试集
        </button>
        <button className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50" disabled={!manifest} onClick={onCopySummary} type="button">
          <Clipboard aria-hidden="true" size={15} />
          复制摘要
        </button>
      </div>

      {!manifest ? (
        <div className="mt-4 rounded-md border border-dashed border-stone-200 p-3 text-sm text-stone-500">
          先审核并接受可训练样本，生成 segmentation training manifest 后才会出现分割训练清单。
        </div>
      ) : (
        <div className="mt-4 grid gap-2 text-sm text-stone-700">
          <p>
            训练集 {manifest.train.sampleCount} / 验证集{' '}
            {manifest.validation.sampleCount} / 测试集 {manifest.test.sampleCount}
          </p>
          <p>
            校验：{manifest.validationResult.valid ? '通过' : '阻断'} / 警告：{' '}
            {manifest.validationResult.warnings.length > 0
              ? manifest.validationResult.warnings.join(', ')
              : '无'}
          </p>
          <p>
            已排除：{' '}
            {manifest.targetSummary.excludedSampleIds.length > 0
              ? manifest.targetSummary.excludedSampleIds.join(', ')
              : '无'}
          </p>
          <p>
            区域目标：{' '}
            {Object.entries(manifest.targetSummary.regionCounts)
              .map(([region, count]) => `${region}:${count}`)
              .join(', ')}
          </p>
        </div>
      )}

      <details className="mt-4 rounded-md border border-stone-200 bg-stone-50 p-3">
        <summary className="cursor-pointer text-sm font-semibold text-stone-700">
          training-preflight 命令示例
        </summary>
        <pre className="mt-3 max-h-[180px] overflow-auto rounded-md bg-white p-3 text-xs leading-5 text-stone-700">
          <code>{preflightCommand}</code>
        </pre>
      </details>
    </section>
  );
}
