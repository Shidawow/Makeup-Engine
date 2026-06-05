import { GitCompareArrows, X } from 'lucide-react';
import type { DatasetReplayPayload } from '../../../templates/schema';

export interface DatasetReplayViewerProps {
  payload: DatasetReplayPayload | null;
  onClose?: () => void;
}

const maskSummary = (alpha: readonly number[]): string => {
  const total = Math.max(1, alpha.length);
  const active = alpha.filter((value) => value > 0.025).length;
  const mean =
    alpha.reduce((sum, value) => sum + value, 0) / Math.max(1, alpha.length);

  return `有效 ${Math.round((active / total) * 100)}% / 均值 ${mean.toFixed(3)}`;
};

const semanticSummary = (
  payload: DatasetReplayPayload,
  side: 'original' | 'updated',
): string =>
  (side === 'original'
    ? payload.originalSemantics?.semanticSummary
    : payload.updatedSemantics?.semanticSummary
  )?.join(', ') || '无';

const pixelSummary = (
  payload: DatasetReplayPayload,
  side: 'original' | 'updated',
): string => {
  const pixelAnalysis =
    side === 'original' ? payload.originalPixelAnalysis : payload.updatedPixelAnalysis;

  if (!pixelAnalysis) {
    return '无';
  }

  return [
    `唇色 hue ${pixelAnalysis.lips.dominantHue.toFixed(1)}`,
    `腮红透明度 ${pixelAnalysis.blush.opacity.toFixed(2)}`,
    `眼影深度 ${pixelAnalysis.eyes.eyeshadowDarkness.toFixed(2)}`,
  ].join(' / ');
};

export function DatasetReplayViewer({
  payload,
  onClose,
}: DatasetReplayViewerProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">数据回放</h2>
          <p className="text-xs font-medium text-stone-500">
            {payload ? `${payload.sampleId} / ${payload.regionId}` : '暂无样本'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <GitCompareArrows aria-hidden="true" className="text-teal-700" size={18} />
          {onClose ? (
            <button
              aria-label="关闭回放"
              className="grid h-8 w-8 place-items-center rounded-md border border-stone-200 text-stone-600"
              onClick={onClose}
              type="button"
            >
              <X aria-hidden="true" size={15} />
            </button>
          ) : null}
        </div>
      </div>

      {!payload ? (
        <div className="mt-4 rounded-md border border-dashed border-stone-200 p-3 text-sm text-stone-500">
          打开审核项后，可以在这里回放该样本的修正证据。
        </div>
      ) : (
        <div className="mt-4 grid gap-3">
          <div className="grid gap-2 md:grid-cols-3">
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <p className="text-xs font-semibold uppercase text-stone-500">
                AI 原始蒙版
              </p>
              <p className="mt-2 text-sm text-stone-700">
                {payload.originalMask.id}
              </p>
              <p className="text-xs text-stone-500">
                {maskSummary(payload.originalMask.grid.alpha)}
              </p>
            </div>
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <p className="text-xs font-semibold uppercase text-stone-500">
                人工编辑蒙版
              </p>
              <p className="mt-2 text-sm text-stone-700">
                {payload.humanEditedMask.id}
              </p>
              <p className="text-xs text-stone-500">
                {maskSummary(payload.humanEditedMask.grid.alpha)}
              </p>
            </div>
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <p className="text-xs font-semibold uppercase text-stone-500">
                差异热力图
              </p>
              <p className="mt-2 text-sm text-stone-700">
                {payload.diffHeatmap.width}x{payload.diffHeatmap.height}
              </p>
              <p className="text-xs text-stone-500">
                {maskSummary(payload.diffHeatmap.alpha)}
              </p>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <p className="text-sm font-semibold text-stone-900">
                修正前像素分析
              </p>
              <p className="mt-2 text-xs leading-5 text-stone-600">
                {pixelSummary(payload, 'original')}
              </p>
            </div>
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <p className="text-sm font-semibold text-stone-900">
                修正后像素分析
              </p>
              <p className="mt-2 text-xs leading-5 text-stone-600">
                {pixelSummary(payload, 'updated')}
              </p>
            </div>
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <p className="text-sm font-semibold text-stone-900">
                修正前语义
              </p>
              <p className="mt-2 text-xs leading-5 text-stone-600">
                {semanticSummary(payload, 'original')}
              </p>
            </div>
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <p className="text-sm font-semibold text-stone-900">
                修正后语义
              </p>
              <p className="mt-2 text-xs leading-5 text-stone-600">
                {semanticSummary(payload, 'updated')}
              </p>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <p className="text-sm font-semibold text-stone-900">
                修正前模板
              </p>
              <p className="mt-2 text-xs leading-5 text-stone-600">
                {payload.templateBefore
                  ? `${payload.templateBefore.name} / ${payload.templateBefore.status} / ${payload.templateBefore.stepCount} 步`
                  : '无'}
              </p>
            </div>
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <p className="text-sm font-semibold text-stone-900">
                修正后模板
              </p>
              <p className="mt-2 text-xs leading-5 text-stone-600">
                {payload.templateAfter
                  ? `${payload.templateAfter.name} / ${payload.templateAfter.status} / ${payload.templateAfter.stepCount} 步`
                  : '无'}
              </p>
            </div>
          </div>

          <div className="rounded-md border border-teal-100 bg-teal-50 p-3">
            <p className="text-sm font-semibold text-teal-950">证据摘要</p>
            <p className="mt-2 text-xs leading-5 text-teal-900">
              置信度 {payload.evidenceSummary.correctionConfidence.toFixed(3)} /
              变化 {payload.evidenceSummary.changedAreaRatio.toFixed(3)} /
              边缘偏移 {payload.evidenceSummary.edgeShiftScore.toFixed(3)} /
              建议 {payload.evidenceSummary.suggestedDecision}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
