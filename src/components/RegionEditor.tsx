import { SlidersHorizontal } from 'lucide-react';
import type { ReactNode } from 'react';
import { useRegionPanel } from '../runtime/useMakeupRuntime';
import type { RuntimeParameterGroup } from '../runtime/useMakeupRuntime';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

interface RangeFieldProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
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

function RangeField({ label, value, min = 0, max = 100, onChange }: RangeFieldProps) {
  return (
    <label className="grid gap-2">
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-stone-500">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <input
        className="w-full accent-teal-700"
        max={max}
        min={min}
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

function ParameterGroups({
  groups,
  onChange,
}: {
  groups: RuntimeParameterGroup[];
  onChange: (path: string[], value: string | number) => void;
}) {
  return (
    <div className="grid gap-4">
      {groups.map((group) => (
        <FieldGroup key={group.id} title={group.title}>
          {group.fields.map((field) =>
            field.kind === 'range' ? (
              <RangeField
                key={`${group.id}-${field.path.join('.')}`}
                label={field.label}
                max={field.max}
                min={field.min}
                onChange={(value) => onChange(field.path, value)}
                value={typeof field.value === 'number' ? field.value : 0}
              />
            ) : (
              <TextField
                key={`${group.id}-${field.path.join('.')}`}
                label={field.label}
                onChange={(value) => onChange(field.path, value)}
                value={String(field.value)}
              />
            ),
          )}
        </FieldGroup>
      ))}
    </div>
  );
}

export function RegionEditor() {
  const {
    title,
    region,
    parameterGroups,
    emptyParameterText,
    setEnabled,
    setGoal,
    updateParameter,
  } = useRegionPanel();

  return (
    <div className="min-w-0 rounded-lg border border-stone-200 bg-white/85 shadow-soft">
      <div className="flex items-center justify-between gap-3 border-b border-stone-200 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-stone-950">{title}</h2>
          <p className="text-xs text-stone-500">按 runtime schema 编辑区域参数</p>
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
            onChange={(event) => setEnabled(event.target.checked)}
            type="checkbox"
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
            视觉目标
          </span>
          <textarea
            className="min-h-20 resize-y rounded-md border border-stone-200 px-3 py-2 text-sm leading-6"
            onChange={(event) => setGoal(event.target.value)}
            value={region.goal}
          />
        </label>

        {parameterGroups.length > 0 ? (
          <ParameterGroups groups={parameterGroups} onChange={updateParameter} />
        ) : (
          <div className="rounded-md border border-dashed border-stone-300 p-4 text-sm leading-6 text-stone-500">
            {emptyParameterText}
          </div>
        )}
      </div>
    </div>
  );
}
