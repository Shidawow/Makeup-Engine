import type { SourceImageEntry, SourceImageManifest } from '../../../training/schema';

export interface SourceImageQuarantinePanelProps {
  manifest: SourceImageManifest | null;
  onSelectEntry?: (sourceImageId: string) => void;
}

const blockingReasonCodes = (entry: SourceImageEntry): string[] => [
  ...(entry.importStatus === 'blocked_by_codec' ? ['codec-blocked'] : []),
  ...(entry.importStatus === 'blocked_by_quality' ? ['quality-blocked'] : []),
  ...(entry.importStatus === 'failed' ? ['import-failed'] : []),
  ...entry.codecReport.issueCodes,
  ...entry.qualityReport.issueCodes,
];

const summarizeReasons = (entries: readonly SourceImageEntry[]): Record<string, number> =>
  entries.reduce<Record<string, number>>((acc, entry) => {
    const codes = blockingReasonCodes(entry);

    return codes.reduce<Record<string, number>>(
      (nextAcc, code) => ({ ...nextAcc, [code]: (nextAcc[code] ?? 0) + 1 }),
      acc,
    );
  }, {});

export function SourceImageQuarantinePanel({
  manifest,
  onSelectEntry,
}: SourceImageQuarantinePanelProps) {
  const blockedEntries =
    manifest?.entries
      .filter((entry) => entry.importStatus !== 'ready_for_template_analysis')
      .sort((left, right) => left.sourceImageId.localeCompare(right.sourceImageId)) ?? [];
  const reasons = summarizeReasons(blockedEntries);

  return (
    <section className="rounded-md border border-amber-200 bg-amber-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-amber-950">隔离与阻断摘要</h3>
          <p className="text-xs text-amber-800">
            这里只读展示 source image 问题，不会把图片直接送入训练数据集。
          </p>
        </div>
        <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-amber-900">
          {blockedEntries.length} 张
        </span>
      </div>

      {blockedEntries.length === 0 ? (
        <p className="mt-3 rounded-md border border-dashed border-amber-200 bg-white/70 p-3 text-sm text-amber-800">
          当前 manifest 没有被隔离的图片。可以从 ready 列表创建 TemplateAnalysisSeed。
        </p>
      ) : (
        <div className="mt-3 grid gap-3">
          <div className="grid gap-1 text-xs text-amber-900">
            {Object.entries(reasons).map(([code, count]) => (
              <p className="flex items-center justify-between gap-3" key={code}>
                <span className="truncate">{code}</span>
                <span className="font-semibold">{count}</span>
              </p>
            ))}
          </div>

          <div className="grid gap-2">
            {blockedEntries.map((entry) => (
              <button
                className="rounded-md border border-amber-200 bg-white p-2 text-left text-xs text-amber-950 hover:border-amber-400"
                key={entry.sourceImageId}
                onClick={() => onSelectEntry?.(entry.sourceImageId)}
                type="button"
              >
                <span className="block font-semibold">{entry.originalFileName}</span>
                <span className="mt-1 block text-amber-800">
                  {entry.importStatus} / {blockingReasonCodes(entry).join(', ') || '无原因码'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
