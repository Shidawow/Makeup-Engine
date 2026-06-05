import type { MakeupTemplate } from '../../templates/schema';
import type {
  CosmeticSegmentationTarget,
  EditableCosmeticMask,
  MakeupAnalysisPipelineResult,
  MaskEditTool,
} from '../../vision';

export interface VisionQaPanelProps {
  analysis: MakeupAnalysisPipelineResult | null;
  template: MakeupTemplate | null;
  editableMasks?: readonly EditableCosmeticMask[];
  activeRegion?: CosmeticSegmentationTarget;
  brushTool?: MaskEditTool;
  brushRadius?: number;
  visibleRegions?: readonly CosmeticSegmentationTarget[];
  onActiveRegionChange?: (region: CosmeticSegmentationTarget) => void;
  onBrushToolChange?: (tool: MaskEditTool) => void;
  onBrushRadiusChange?: (radius: number) => void;
  onToggleRegion?: (region: CosmeticSegmentationTarget) => void;
  onReanalyze?: () => void;
}

const formatPercent = (value: number): string => `${Math.round(value * 100)}%`;

const editableTargets: CosmeticSegmentationTarget[] = [
  'lips',
  'eyeshadow',
  'eyeliner',
  'blush',
  'contour',
  'highlight',
];

const regionLabels: Record<CosmeticSegmentationTarget, string> = {
  lips: '唇部',
  eyeshadow: '眼影',
  eyeliner: '眼线',
  blush: '腮红',
  contour: '修容',
  highlight: '高光',
};

const brushTools: MaskEditTool[] = [
  'brush-add',
  'brush-erase',
  'feather-brush',
  'smooth-local',
];

const brushToolLabels: Record<MaskEditTool, string> = {
  'brush-add': '添加',
  'brush-erase': '擦除',
  'feather-brush': '羽化',
  'smooth-local': '局部平滑',
};

const labelRegion = (region: string): string =>
  region in regionLabels
    ? regionLabels[region as CosmeticSegmentationTarget]
    : region;

export function VisionQaPanel({
  analysis,
  template,
  editableMasks = [],
  activeRegion = 'lips',
  brushTool = 'brush-add',
  brushRadius = 0.06,
  visibleRegions = [],
  onActiveRegionChange,
  onBrushToolChange,
  onBrushRadiusChange,
  onToggleRegion,
  onReanalyze,
}: VisionQaPanelProps) {
  if (!analysis) {
    return (
      <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
        <h2 className="text-base font-semibold">视觉质检</h2>
        <p className="mt-2 text-sm text-stone-500">
          运行视觉分析后，这里会显示区域调试、蒙版修正、像素采样、语义标签和模板收敛信息。
        </p>
      </section>
    );
  }

  const pixel = analysis.pixelAnalysis;
  const semantics = analysis.semanticAnalysis;
  const editCount = editableMasks.reduce(
    (sum, mask) => sum + mask.userModifications.length,
    0,
  );

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">视觉质检</h2>
          <p className="text-xs text-stone-500">
            查看人工蒙版修正、局部重算和模板收敛的关键状态。
          </p>
        </div>
        <span className="rounded-md bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-900">
          {analysis.providerId}
        </span>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="rounded-md bg-stone-50 p-3">
          <h3 className="text-sm font-semibold">快速编辑</h3>
          <div className="mt-3 grid gap-3 text-xs text-stone-600">
            <label className="grid gap-1">
              <span className="font-medium text-stone-500">当前区域</span>
              <select
                className="rounded-md border border-stone-200 bg-white px-2 py-2"
                onChange={(event) =>
                  onActiveRegionChange?.(
                    event.target.value as CosmeticSegmentationTarget,
                  )
                }
                value={activeRegion}
              >
                {editableTargets.map((target) => (
                  <option key={target} value={target}>
                    {regionLabels[target]}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-2">
              {brushTools.map((tool) => (
                <button
                  className={`rounded-md border px-2 py-1.5 ${
                    brushTool === tool
                      ? 'border-teal-700 bg-teal-50 text-teal-900'
                      : 'border-stone-200 bg-white'
                  }`}
                  key={tool}
                  onClick={() => onBrushToolChange?.(tool)}
                  type="button"
                >
                  {brushToolLabels[tool]}
                </button>
              ))}
            </div>

            <label className="grid gap-1">
              <span className="font-medium text-stone-500">
                笔刷半径 {brushRadius.toFixed(2)}
              </span>
              <input
                max="0.18"
                min="0.02"
                onChange={(event) => onBrushRadiusChange?.(Number(event.target.value))}
                step="0.01"
                type="range"
                value={brushRadius}
              />
            </label>

            <button
              className="rounded-md bg-stone-950 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={editCount === 0}
              onClick={onReanalyze}
              type="button"
            >
              重新分析已编辑蒙版
            </button>
          </div>
        </div>

        <div className="rounded-md bg-stone-50 p-3">
          <h3 className="text-sm font-semibold">区域显示</h3>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {editableTargets.map((target) => (
              <button
                className={`rounded-md border px-2 py-1 ${
                  visibleRegions.includes(target)
                    ? 'border-teal-700 bg-teal-50 text-teal-900'
                    : 'border-stone-200 bg-white text-stone-600'
                }`}
                key={target}
                onClick={() => onToggleRegion?.(target)}
                type="button"
              >
                {regionLabels[target]}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-stone-500">
            编辑次数 {editCount} / 可编辑蒙版 {editableMasks.length}
          </p>
        </div>

        <div className="rounded-md bg-stone-50 p-3">
          <h3 className="text-sm font-semibold">区域调试</h3>
          <div className="mt-2 grid gap-2 text-xs text-stone-600">
            {analysis.cosmeticRegions.map((region) => (
              <div className="flex items-center justify-between gap-3" key={region.id}>
                <span>{region.kind}</span>
                <span>
                  {region.polygon.points.length} 点 / {formatPercent(region.confidence)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md bg-stone-50 p-3">
          <h3 className="text-sm font-semibold">颜色采样预览</h3>
          {pixel ? (
            <div className="mt-2 grid gap-2 text-xs text-stone-600">
              <p>唇色 hue: {pixel.lips.dominantHue} / saturation: {pixel.lips.saturation}</p>
              <p>腮红 opacity: {pixel.blush.opacity} / tone: {pixel.blush.tone}</p>
              <p>
                眼影 darkness: {pixel.eyes.eyeshadowDarkness} / shimmer:{' '}
                {pixel.eyes.shimmerEstimation}
              </p>
              <p>
                边缘柔和度:{' '}
                {pixel.edgeAnalysis?.features.lips?.edgeSoftnessScore ?? '暂无'} /
                扩散: {pixel.edgeAnalysis?.features.blush?.diffusionScore ?? '暂无'}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-xs text-stone-500">当前分析没有提供像素数据。</p>
          )}
        </div>

        <div className="rounded-md bg-stone-50 p-3">
          <h3 className="text-sm font-semibold">语义标签</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {(semantics?.semanticSummary ?? ['semantic:unavailable']).map((label) => (
              <span
                className="rounded-md bg-rose-50 px-2 py-1 text-xs text-rose-900"
                key={label}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-md bg-stone-50 p-3">
          <h3 className="text-sm font-semibold">模板收敛</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>视觉区域：{analysis.cosmeticRegions.length}</p>
            <p>模板区域：{template?.regions.length ?? 0}</p>
            <p>模板步骤：{template?.steps.length ?? 0}</p>
            <p>修正置信度：{template?.metadata.correctionConfidence ?? '暂无'}</p>
            <p>
              人工修正区域：
              {template?.metadata.humanAdjustedRegions
                ?.map(labelRegion)
                .join('、') || '暂无'}
            </p>
          </div>
        </div>

        <div className="rounded-md bg-stone-50 p-3">
          <h3 className="text-sm font-semibold">前后对比</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>修正前：AI 分割蒙版 + 加权采样</p>
            <p>修正后：人工调整蒙版 + 局部重分析 + 收敛模板元数据</p>
          </div>
        </div>
      </div>
    </section>
  );
}
