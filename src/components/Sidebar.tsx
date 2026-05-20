import { ChevronsUpDown, Sparkles } from 'lucide-react';
import { regionLabels } from '../data/displayLabels';
import { MAKEUP_REGIONS } from '../types/makeup';
import { useTemplateStore } from '../store/templateStore';

export function Sidebar() {
  const template = useTemplateStore((state) => state.template);
  const selectedRegion = useTemplateStore((state) => state.selectedRegion);
  const setSelectedRegion = useTemplateStore((state) => state.setSelectedRegion);

  return (
    <aside className="flex w-full flex-col border-b border-stone-200 bg-stone-950 px-4 py-5 text-white lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-rose-300 text-stone-950">
          <Sparkles aria-hidden="true" size={20} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{template.metadata.name}</p>
          <p className="text-xs text-stone-400">{template.metadata.version}</p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
            妆容区域
          </p>
          <ChevronsUpDown aria-hidden="true" className="text-stone-500" size={15} />
        </div>
        <nav className="mt-3 grid gap-1">
          {MAKEUP_REGIONS.map((region) => {
            const isSelected = selectedRegion === region;
            const regionConfig = template.regions[region];

            return (
              <button
                className={`flex min-h-11 items-center justify-between rounded-md px-3 text-left text-sm transition ${
                  isSelected
                    ? 'bg-teal-500 text-white'
                    : 'text-stone-300 hover:bg-white/10 hover:text-white'
                }`}
                key={region}
                onClick={() => setSelectedRegion(region)}
                type="button"
              >
                <span>{regionLabels[region]}</span>
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    regionConfig.enabled ? 'bg-emerald-300' : 'bg-stone-600'
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-md bg-white/5 px-2 py-3">
          <p className="text-lg font-semibold">{template.steps.length}</p>
          <p className="text-[11px] uppercase tracking-wide text-stone-500">步骤</p>
        </div>
        <div className="rounded-md bg-white/5 px-2 py-3">
          <p className="text-lg font-semibold">{template.styleTags.length}</p>
          <p className="text-[11px] uppercase tracking-wide text-stone-500">标签</p>
        </div>
        <div className="rounded-md bg-white/5 px-2 py-3">
          <p className="text-lg font-semibold">
            {MAKEUP_REGIONS.filter((region) => template.regions[region].enabled).length}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-stone-500">启用</p>
        </div>
      </div>
    </aside>
  );
}
