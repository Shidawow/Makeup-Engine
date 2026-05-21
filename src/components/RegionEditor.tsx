import { SlidersHorizontal } from 'lucide-react';
import type { ReactNode } from 'react';
import { regionLabels } from '../data/displayLabels';
import { useTemplateStore } from '../store/templateStore';
import type {
  BlushParameters,
  BrowParameters,
  EyeParameters,
  LipParameters,
} from '../types/makeup';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

interface RangeFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

function TextField({ label, value, onChange }: TextFieldProps) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
        {label}
      </span>
      <input
        className="h-10 rounded-md border border-stone-200 px-3 text-sm"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

function RangeField({ label, value, onChange }: RangeFieldProps) {
  return (
    <label className="grid gap-2">
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-stone-500">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <input
        className="w-full accent-teal-700"
        max="100"
        min="0"
        onChange={(event) => onChange(Number(event.target.value))}
        type="range"
        value={value}
      />
    </label>
  );
}

function FieldGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-4 rounded-md border border-stone-200 bg-stone-50 p-3">
      <h3 className="text-sm font-semibold text-stone-800">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

export function RegionEditor() {
  const selectedRegion = useTemplateStore((state) => state.selectedRegion);
  const region = useTemplateStore((state) => state.template.regions[state.selectedRegion]);
  const updateRegion = useTemplateStore((state) => state.updateRegion);
  const updateRegionParameters = useTemplateStore(
    (state) => state.updateRegionParameters,
  );
  const updateEyeParameters = useTemplateStore((state) => state.updateEyeParameters);

  const renderParameters = () => {
    if (selectedRegion === 'brow') {
      const parameters = region.parameters as BrowParameters;

      return (
        <FieldGroup title="眉毛参数">
          <TextField
            label="shape"
            onChange={(shape) => updateRegionParameters('brow', { shape })}
            value={parameters.shape}
          />
          <RangeField
            label="thickness"
            onChange={(thickness) => updateRegionParameters('brow', { thickness })}
            value={parameters.thickness}
          />
          <RangeField
            label="arch_height"
            onChange={(arch_height) => updateRegionParameters('brow', { arch_height })}
            value={parameters.arch_height}
          />
          <RangeField
            label="tail_length"
            onChange={(tail_length) => updateRegionParameters('brow', { tail_length })}
            value={parameters.tail_length}
          />
          <RangeField
            label="edge_softness"
            onChange={(edge_softness) =>
              updateRegionParameters('brow', { edge_softness })
            }
            value={parameters.edge_softness}
          />
        </FieldGroup>
      );
    }

    if (selectedRegion === 'eye') {
      const parameters = region.parameters as EyeParameters;

      return (
        <div className="grid gap-4">
          <FieldGroup title="Eye Shadow">
            <TextField
              label="placement"
              onChange={(placement) => updateEyeParameters('eye_shadow', { placement })}
              value={parameters.eye_shadow.placement}
            />
            <RangeField
              label="intensity"
              onChange={(intensity) => updateEyeParameters('eye_shadow', { intensity })}
              value={parameters.eye_shadow.intensity}
            />
            <RangeField
              label="edge_softness"
              onChange={(edge_softness) =>
                updateEyeParameters('eye_shadow', { edge_softness })
              }
              value={parameters.eye_shadow.edge_softness}
            />
            <TextField
              label="finish"
              onChange={(finish) => updateEyeParameters('eye_shadow', { finish })}
              value={parameters.eye_shadow.finish}
            />
            <TextField
              label="color_family"
              onChange={(color_family) =>
                updateEyeParameters('eye_shadow', { color_family })
              }
              value={parameters.eye_shadow.color_family}
            />
          </FieldGroup>

          <FieldGroup title="Eye Liner">
            <TextField
              label="direction"
              onChange={(direction) => updateEyeParameters('eye_liner', { direction })}
              value={parameters.eye_liner.direction}
            />
            <RangeField
              label="thickness"
              onChange={(thickness) => updateEyeParameters('eye_liner', { thickness })}
              value={parameters.eye_liner.thickness}
            />
            <RangeField
              label="length_ratio"
              onChange={(length_ratio) =>
                updateEyeParameters('eye_liner', { length_ratio })
              }
              value={parameters.eye_liner.length_ratio}
            />
            <RangeField
              label="sharpness"
              onChange={(sharpness) => updateEyeParameters('eye_liner', { sharpness })}
              value={parameters.eye_liner.sharpness}
            />
          </FieldGroup>

          <FieldGroup title="Lash">
            <RangeField
              label="curl"
              onChange={(curl) => updateEyeParameters('lash', { curl })}
              value={parameters.lash.curl}
            />
            <RangeField
              label="density"
              onChange={(density) => updateEyeParameters('lash', { density })}
              value={parameters.lash.density}
            />
            <TextField
              label="length_focus"
              onChange={(length_focus) => updateEyeParameters('lash', { length_focus })}
              value={parameters.lash.length_focus}
            />
          </FieldGroup>
        </div>
      );
    }

    if (selectedRegion === 'blush') {
      const parameters = region.parameters as BlushParameters;

      return (
        <FieldGroup title="腮红参数">
          <TextField
            label="placement"
            onChange={(placement) => updateRegionParameters('blush', { placement })}
            value={parameters.placement}
          />
          <RangeField
            label="spread"
            onChange={(spread) => updateRegionParameters('blush', { spread })}
            value={parameters.spread}
          />
          <RangeField
            label="saturation"
            onChange={(saturation) => updateRegionParameters('blush', { saturation })}
            value={parameters.saturation}
          />
          <TextField
            label="finish"
            onChange={(finish) => updateRegionParameters('blush', { finish })}
            value={parameters.finish}
          />
        </FieldGroup>
      );
    }

    if (selectedRegion === 'lip') {
      const parameters = region.parameters as LipParameters;

      return (
        <FieldGroup title="唇妆参数">
          <TextField
            label="shape"
            onChange={(shape) => updateRegionParameters('lip', { shape })}
            value={parameters.shape}
          />
          <RangeField
            label="overline"
            onChange={(overline) => updateRegionParameters('lip', { overline })}
            value={parameters.overline}
          />
          <TextField
            label="texture"
            onChange={(texture) => updateRegionParameters('lip', { texture })}
            value={parameters.texture}
          />
          <RangeField
            label="color_depth"
            onChange={(color_depth) => updateRegionParameters('lip', { color_depth })}
            value={parameters.color_depth}
          />
        </FieldGroup>
      );
    }

    return (
      <div className="rounded-md border border-dashed border-stone-300 p-4 text-sm leading-6 text-stone-500">
        当前 taxonomy 未定义 {regionLabels[selectedRegion]} 的专属参数；此区域仅编辑启用状态与视觉目标。
      </div>
    );
  };

  return (
    <div className="min-w-0 rounded-lg border border-stone-200 bg-white/85 shadow-soft">
      <div className="flex items-center justify-between gap-3 border-b border-stone-200 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-stone-950">
            {regionLabels[selectedRegion]}区域
          </h2>
          <p className="text-xs text-stone-500">按 taxonomy 编辑区域参数</p>
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
            goal
          </span>
          <textarea
            className="min-h-20 resize-y rounded-md border border-stone-200 px-3 py-2 text-sm leading-6"
            onChange={(event) =>
              updateRegion(selectedRegion, { goal: event.target.value })
            }
            value={region.goal}
          />
        </label>

        {renderParameters()}
      </div>
    </div>
  );
}
