import type { FaceMeshRegionQaReport } from '../../../vision';

export interface VisionAnalysisReadinessSummaryProps {
  regionQa: FaceMeshRegionQaReport | null;
  runtimeNotice?: string | null;
}

const formatPercent = (value: number): string => `${Math.round(value * 100)}%`;

export function VisionAnalysisReadinessSummary({
  regionQa,
  runtimeNotice = null,
}: VisionAnalysisReadinessSummaryProps) {
  if (!regionQa) {
    return (
      <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
        <h2 className="text-base font-semibold">视觉分析 readiness</h2>
        <p className="mt-2 text-sm text-stone-500">
          上传图片并运行 FaceMesh 后，这里只汇总图像理解、区域 QA、图片质量和 runtime 状态。
        </p>
      </section>
    );
  }

  const blocked = regionQa.status === 'region_qa_blocked';

  return (
    <section
      className={`rounded-lg border p-4 shadow-soft ${
        blocked ? 'border-rose-200 bg-rose-50' : 'border-teal-100 bg-white'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">视觉分析 readiness</h2>
          <p className="mt-1 text-xs leading-5 text-stone-600">
            视觉分析 Tab 负责 FaceMesh、overlay、mask、区域 QA 和图片质量判断；模板草稿审核请进入模板工作台。
          </p>
        </div>
        <span className="rounded-md bg-stone-950 px-2.5 py-1 text-xs font-semibold text-white">
          {regionQa.provider === 'mock' ? 'mock fallback' : regionQa.provider}
        </span>
      </div>

      <div className="mt-3 grid gap-2 text-xs text-stone-700 sm:grid-cols-3">
        <p>Landmarks：{regionQa.landmarkCount}</p>
        <p>Confidence：{formatPercent(regionQa.confidence)}</p>
        <p>Region QA：{regionQa.status}</p>
      </div>

      {runtimeNotice ? (
        <p className="mt-3 whitespace-pre-line rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
          {runtimeNotice}
        </p>
      ) : null}

      <p
        className={`mt-3 rounded-md p-3 text-sm font-semibold ${
          blocked ? 'bg-white text-rose-800' : 'bg-teal-50 text-teal-900'
        }`}
      >
        {blocked
          ? '区域 QA 阻断：请先修正图片、FaceMesh 或区域质量，再进入模板工作台。'
          : '可以进入模板工作台生成/审核模板草稿。'}
      </p>
    </section>
  );
}
