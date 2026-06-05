import { Clipboard, Download, FileArchive, ShieldCheck } from 'lucide-react';
import type { OfflineTrainingPackage } from '../../../templates/schema';

export interface OfflinePackagePanelProps {
  trainingPackage: OfflineTrainingPackage | null;
  developerMode: boolean;
  rawJson: string;
  onCreatePackage: () => void;
  onValidatePackage: () => void;
  onExportPackageJson: () => void;
  onExportManifestJson: () => void;
  onExportAuditReportJson: () => void;
  onCopySummary: () => void;
}

const cliCommand =
  'node scripts/build-training-dataset.mjs --package ./exports/offline-package.json --manifest ./exports/offline-package-manifest.json --audit ./exports/audit-report.json --out ./datasets/makeup-engine/dev-v0 --strict';

export function OfflinePackagePanel({
  trainingPackage,
  developerMode,
  rawJson,
  onCreatePackage,
  onValidatePackage,
  onExportPackageJson,
  onExportManifestJson,
  onExportAuditReportJson,
  onCopySummary,
}: OfflinePackagePanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">离线训练数据包</h2>
          <p className="text-xs font-medium text-stone-500">
            {trainingPackage
              ? `${trainingPackage.packageId} / ${trainingPackage.entryCount} 条样本`
              : '尚未生成离线包'}
          </p>
        </div>
        <FileArchive aria-hidden="true" className="text-teal-700" size={18} />
      </div>

      <div className="mt-3 rounded-md border border-teal-100 bg-teal-50 p-3 text-xs leading-5 text-teal-950">
        导出 offline package、manifest 和审计报告给 CLI 使用。下一步在本地运行
        build-training-dataset 生成真实训练数据包目录；浏览器只负责导出 JSON，不直接写本地文件系统。
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md bg-stone-950 px-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onCreatePackage}
          type="button"
        >
          <FileArchive aria-hidden="true" size={15} />
          生成离线包
        </button>
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!trainingPackage}
          onClick={onValidatePackage}
          type="button"
        >
          <ShieldCheck aria-hidden="true" size={15} />
          校验
        </button>
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!trainingPackage}
          onClick={onExportPackageJson}
          type="button"
        >
          <Download aria-hidden="true" size={15} />
          导出 Package
        </button>
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!trainingPackage}
          onClick={onExportManifestJson}
          type="button"
        >
          <Download aria-hidden="true" size={15} />
          导出 Manifest
        </button>
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!trainingPackage}
          onClick={onExportAuditReportJson}
          type="button"
        >
          <Download aria-hidden="true" size={15} />
          导出审计报告
        </button>
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!trainingPackage}
          onClick={onCopySummary}
          type="button"
        >
          <Clipboard aria-hidden="true" size={15} />
          复制摘要
        </button>
      </div>

      {!trainingPackage ? (
        <div className="mt-4 rounded-md border border-dashed border-stone-200 p-3 text-sm text-stone-500">
          先完成样本审核并生成训练 manifest，再在这里生成离线包。离线包会作为 CLI
          物化训练数据目录的唯一输入来源。
        </div>
      ) : (
        <div className="mt-4 grid gap-2 text-sm text-stone-700">
          <p>版本：{trainingPackage.datasetVersion.versionId}</p>
          <p>来源清单：{trainingPackage.sourceTrainingManifestId}</p>
          <p>
            训练集 {trainingPackage.splitSummary.train} / 验证集{' '}
            {trainingPackage.splitSummary.validation} / 测试集{' '}
            {trainingPackage.splitSummary.test}
          </p>
          <p>
            mask artifact {trainingPackage.maskArtifactCount} / 图片引用{' '}
            {trainingPackage.imageReferenceCount}
          </p>
          <p>
            校验：
            {trainingPackage.validationSummary.valid ? '通过' : '存在阻断'} /
            警告 {trainingPackage.validationSummary.warnings.length}
          </p>
          <p>
            区域覆盖：{' '}
            {Object.entries(trainingPackage.regionSummary)
              .map(([region, count]) => `${region}:${count}`)
              .join(', ')}
          </p>
          {trainingPackage.validationSummary.errors.length > 0 ? (
            <div className="rounded-md border border-rose-200 bg-rose-50 p-2 text-xs text-rose-800">
              {trainingPackage.validationSummary.errors.join('；')}
            </div>
          ) : null}
          {trainingPackage.auditSummary.recommendations.length > 0 ? (
            <div className="rounded-md border border-teal-100 bg-teal-50 p-2 text-xs text-teal-900">
              {trainingPackage.auditSummary.recommendations.join('；')}
            </div>
          ) : null}
        </div>
      )}

      {developerMode ? (
        <details className="mt-4 rounded-md border border-stone-200 bg-stone-50 p-3">
          <summary className="cursor-pointer text-sm font-semibold text-stone-700">
            CLI 命令示例
          </summary>
          <pre className="mt-3 max-h-[160px] overflow-auto rounded-md bg-white p-3 text-xs leading-5 text-stone-700">
            <code>{cliCommand}</code>
          </pre>
        </details>
      ) : null}

      {developerMode && trainingPackage ? (
        <details className="mt-4 rounded-md border border-stone-200 bg-stone-50 p-3">
          <summary className="cursor-pointer text-sm font-semibold text-stone-700">
            原始离线包 JSON
          </summary>
          <pre className="mt-3 max-h-[260px] overflow-auto text-xs leading-5 text-stone-700">
            <code>{rawJson}</code>
          </pre>
        </details>
      ) : null}
    </section>
  );
}
