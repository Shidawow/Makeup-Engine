import {
  Eraser,
  Feather,
  Paintbrush,
  RefreshCw,
  RotateCcw,
  RotateCw,
  Save,
  Undo2,
  type LucideIcon,
} from 'lucide-react';
import type { CosmeticSegmentationTarget, MaskEditTool } from '../../vision';

export const studioMaskRegions: CosmeticSegmentationTarget[] = [
  'lips',
  'blush',
  'eyeshadow',
  'eyeliner',
  'contour',
  'highlight',
];

export type StudioBrushTool = Extract<
  MaskEditTool,
  'brush-add' | 'brush-erase' | 'feather-brush'
>;

const toolLabels: Record<StudioBrushTool, string> = {
  'brush-add': '添加',
  'brush-erase': '擦除',
  'feather-brush': '羽化',
};

const regionLabels: Record<CosmeticSegmentationTarget, string> = {
  lips: '唇部',
  blush: '腮红',
  eyeshadow: '眼影',
  eyeliner: '眼线',
  contour: '修容',
  highlight: '高光',
};

const toolIcons: Record<StudioBrushTool, LucideIcon> = {
  'brush-add': Paintbrush,
  'brush-erase': Eraser,
  'feather-brush': Feather,
};

export interface MaskEditingToolbarProps {
  activeRegion: CosmeticSegmentationTarget;
  brushTool: StudioBrushTool;
  brushSize: number;
  featherStrength: number;
  dirtyRegions: readonly CosmeticSegmentationTarget[];
  canUndo: boolean;
  canRedo: boolean;
  canReanalyze: boolean;
  canSaveCorrection: boolean;
  onActiveRegionChange: (region: CosmeticSegmentationTarget) => void;
  onBrushToolChange: (tool: StudioBrushTool) => void;
  onBrushSizeChange: (size: number) => void;
  onFeatherStrengthChange: (strength: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onResetRegion: () => void;
  onSaveCorrection: () => void;
  onReanalyzeRegion: () => void;
}

export function MaskEditingToolbar({
  activeRegion,
  brushTool,
  brushSize,
  featherStrength,
  dirtyRegions,
  canUndo,
  canRedo,
  canReanalyze,
  canSaveCorrection,
  onActiveRegionChange,
  onBrushToolChange,
  onBrushSizeChange,
  onFeatherStrengthChange,
  onUndo,
  onRedo,
  onResetRegion,
  onSaveCorrection,
  onReanalyzeRegion,
}: MaskEditingToolbarProps) {
  return (
    <section className="min-w-0 rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">蒙版编辑工具</h2>
          <p className="text-xs font-medium text-stone-500">
            待重分析区域：
            {dirtyRegions.map((region) => regionLabels[region]).join('、') || '暂无'}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
          <button
            aria-label="Undo mask edit"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-stone-200 px-2 text-sm text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canUndo}
            onClick={onUndo}
            title="撤销"
            type="button"
          >
            <Undo2 aria-hidden="true" size={15} />
            撤销
          </button>
          <button
            aria-label="Redo mask edit"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-stone-200 px-2 text-sm text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canRedo}
            onClick={onRedo}
            title="重做"
            type="button"
          >
            <RotateCw aria-hidden="true" size={15} />
            重做
          </button>
          <button
            aria-label="Reset active region"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-stone-200 px-2 text-sm text-stone-700"
            onClick={onResetRegion}
            title="重置区域"
            type="button"
          >
            <RotateCcw aria-hidden="true" size={15} />
            重置
          </button>
        </div>
      </div>

      <div className="mt-4 grid min-w-0 gap-4">
        <label className="grid gap-1.5 text-sm">
          <span className="text-xs font-semibold text-stone-500">编辑区域</span>
          <select
            className="h-10 rounded-md border border-stone-200 bg-white px-3"
            onChange={(event) =>
              onActiveRegionChange(event.target.value as CosmeticSegmentationTarget)
            }
            value={activeRegion}
          >
            {studioMaskRegions.map((region) => (
              <option key={region} value={region}>
                {regionLabels[region]}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-1.5 text-sm">
          <span className="text-xs font-semibold text-stone-500">笔刷模式</span>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(toolLabels) as StudioBrushTool[]).map((tool) => {
              const Icon = toolIcons[tool];

              return (
                <button
                  aria-pressed={brushTool === tool}
                  className={`inline-flex h-10 items-center justify-center gap-2 rounded-md border text-sm ${
                    brushTool === tool
                      ? 'border-teal-700 bg-teal-50 text-teal-900'
                      : 'border-stone-200 bg-white text-stone-700'
                  }`}
                  key={tool}
                  onClick={() => onBrushToolChange(tool)}
                  title={toolLabels[tool]}
                  type="button"
                >
                  <Icon aria-hidden="true" size={15} />
                  {toolLabels[tool]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1.5 text-sm">
            <span className="text-xs font-semibold text-stone-500">
              笔刷大小 {brushSize.toFixed(2)}
            </span>
            <input
              max="0.18"
              min="0.01"
              onChange={(event) => onBrushSizeChange(Number(event.target.value))}
              step="0.01"
              type="range"
              value={brushSize}
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-xs font-semibold text-stone-500">
              羽化强度 {featherStrength.toFixed(2)}
            </span>
            <input
              max="1"
              min="0.05"
              onChange={(event) =>
                onFeatherStrengthChange(Number(event.target.value))
              }
              step="0.05"
              type="range"
              value={featherStrength}
            />
          </label>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canSaveCorrection}
          onClick={onSaveCorrection}
          type="button"
        >
          <Save aria-hidden="true" size={16} />
          保存修正
        </button>
        <button
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-teal-700 px-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canReanalyze}
          onClick={onReanalyzeRegion}
          type="button"
        >
          <RefreshCw aria-hidden="true" size={16} />
          重分析区域
        </button>
      </div>
    </section>
  );
}
