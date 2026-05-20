import { SlidersHorizontal } from 'lucide-react';
import { regionLabels } from '../data/displayLabels';
import { useTemplateStore } from '../store/templateStore';

const intensityMarks = ['裸感', '柔和', '适中', '浓郁'];

export function RegionEditor() {
  const selectedRegion = useTemplateStore((state) => state.selectedRegion);
  const region = useTemplateStore((state) => state.template.regions[state.selectedRegion]);
  const updateRegion = useTemplateStore((state) => state.updateRegion);
  const updateRegionParameters = useTemplateStore(
    (state) => state.updateRegionParameters,
  );

  return (
    <div className="min-w-0 rounded-lg border border-stone-200 bg-white/85 shadow-soft">
      <div className="flex items-center justify-between gap-3 border-b border-stone-200 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-stone-950">
            {regionLabels[selectedRegion]}区域
          </h2>
          <p className="text-xs text-stone-500">结构化区域参数</p>
        </div>
        <div className="grid h-9 w-9 place-items-center rounded-md bg-teal-50 text-teal-700">
          <SlidersHorizontal aria-hidden="true" size={17} />
        </div>
      </div>

      <div className="grid gap-4 p-5">
        <label className="flex items-center justify-between gap-4 rounded-md border border-stone-200 bg-stone-50 px-3 py-2">
          <span className="text-sm font-medium text-stone-700">启用该区域</span>
          <input
            checked={region.enabled}
            className="h-5 w-5 accent-teal-700"
            onChange={(event) =>
              updateRegion(selectedRegion, { enabled: event.target.checked })
            }
            type="checkbox"
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
            视觉目标
          </span>
          <textarea
            className="min-h-20 resize-y rounded-md border border-stone-200 px-3 py-2 text-sm leading-6"
            onChange={(event) =>
              updateRegion(selectedRegion, { visualGoal: event.target.value })
            }
            value={region.visualGoal}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
              覆盖度
            </span>
            <input
              className="h-10 rounded-md border border-stone-200 px-3 text-sm"
              onChange={(event) =>
                updateRegionParameters(selectedRegion, { coverage: event.target.value })
              }
              value={region.parameters.coverage}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
              妆效
            </span>
            <input
              className="h-10 rounded-md border border-stone-200 px-3 text-sm"
              onChange={(event) =>
                updateRegionParameters(selectedRegion, { finish: event.target.value })
              }
              value={region.parameters.finish}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
              色调
            </span>
            <input
              className="h-10 rounded-md border border-stone-200 px-3 text-sm"
              onChange={(event) =>
                updateRegionParameters(selectedRegion, { undertone: event.target.value })
              }
              value={region.parameters.undertone}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
              产品
            </span>
            <input
              className="h-10 rounded-md border border-stone-200 px-3 text-sm"
              onChange={(event) =>
                updateRegionParameters(selectedRegion, { product: event.target.value })
              }
              value={region.parameters.product}
            />
          </label>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-stone-500">
            <span>强度</span>
            <span>{region.parameters.intensity}</span>
          </div>
          <input
            className="w-full accent-teal-700"
            max="100"
            min="0"
            onChange={(event) =>
              updateRegionParameters(selectedRegion, {
                intensity: Number(event.target.value),
              })
            }
            type="range"
            value={region.parameters.intensity}
          />
          <div className="grid grid-cols-4 text-[11px] text-stone-400">
            {intensityMarks.map((mark) => (
              <span key={mark}>{mark}</span>
            ))}
          </div>
        </div>

        <label className="grid gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
            备注
          </span>
          <textarea
            className="min-h-20 resize-y rounded-md border border-stone-200 px-3 py-2 text-sm leading-6"
            onChange={(event) =>
              updateRegionParameters(selectedRegion, { notes: event.target.value })
            }
            value={region.parameters.notes}
          />
        </label>
      </div>
    </div>
  );
}
