import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { actionLabels, pressureLabels, regionLabels } from '../data/displayLabels';
import { MAKEUP_ACTIONS, MAKEUP_REGIONS } from '../types/makeup';
import type { ActionPressure, MakeupActionType, MakeupRegion } from '../types/makeup';
import { useTemplateStore } from '../store/templateStore';

const pressureOptions: ActionPressure[] = ['light', 'medium', 'firm'];

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

export function StepEditor() {
  const steps = useTemplateStore((state) => state.template.steps);
  const selectedRegion = useTemplateStore((state) => state.selectedRegion);
  const selectedStepId = useTemplateStore((state) => state.selectedStepId);
  const addStep = useTemplateStore((state) => state.addStep);
  const updateStep = useTemplateStore((state) => state.updateStep);
  const updateStepTool = useTemplateStore((state) => state.updateStepTool);
  const updateStepProduct = useTemplateStore((state) => state.updateStepProduct);
  const updateStepAction = useTemplateStore((state) => state.updateStepAction);
  const updateStepPlacement = useTemplateStore((state) => state.updateStepPlacement);
  const updateStepEffect = useTemplateStore((state) => state.updateStepEffect);
  const removeStep = useTemplateStore((state) => state.removeStep);
  const moveStep = useTemplateStore((state) => state.moveStep);
  const setSelectedStepId = useTemplateStore((state) => state.setSelectedStepId);
  const activeStep = steps.find((step) => step.step_id === selectedStepId) ?? steps[0];

  return (
    <div className="min-w-0 rounded-lg border border-stone-200 bg-white/85 shadow-soft">
      <div className="flex items-center justify-between gap-3 border-b border-stone-200 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-stone-950">步骤</h2>
          <p className="text-xs text-stone-500">按 step.schema.json 编辑步骤 payload</p>
        </div>
        <button
          className="grid h-9 w-9 place-items-center rounded-md bg-stone-950 text-white transition hover:bg-teal-700"
          onClick={() => addStep(selectedRegion)}
          title="添加步骤"
          type="button"
        >
          <Plus aria-hidden="true" size={17} />
        </button>
      </div>

      <div className="grid gap-4 p-5">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {steps.map((step, index) => (
            <button
              className={`min-h-10 shrink-0 rounded-md border px-3 text-sm transition ${
                step.step_id === activeStep?.step_id
                  ? 'border-teal-600 bg-teal-50 text-teal-900'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
              }`}
              key={step.step_id}
              onClick={() => setSelectedStepId(step.step_id)}
              type="button"
            >
              {index + 1}. {regionLabels[step.region]}
            </button>
          ))}
        </div>

        {activeStep ? (
          <div className="grid gap-4">
            <div className="flex items-center justify-between gap-3 rounded-md bg-stone-50 px-3 py-2">
              <span className="text-sm font-medium text-stone-700">
                正在编辑第 {steps.findIndex((step) => step.step_id === activeStep.step_id) + 1} 步
              </span>
              <div className="flex gap-1">
                <button
                  className="grid h-8 w-8 place-items-center rounded-md text-stone-500 hover:bg-white hover:text-stone-950"
                  onClick={() => moveStep(activeStep.step_id, 'up')}
                  title="上移步骤"
                  type="button"
                >
                  <ArrowUp aria-hidden="true" size={15} />
                </button>
                <button
                  className="grid h-8 w-8 place-items-center rounded-md text-stone-500 hover:bg-white hover:text-stone-950"
                  onClick={() => moveStep(activeStep.step_id, 'down')}
                  title="下移步骤"
                  type="button"
                >
                  <ArrowDown aria-hidden="true" size={15} />
                </button>
                <button
                  className="grid h-8 w-8 place-items-center rounded-md text-rose-600 hover:bg-rose-50"
                  onClick={() => removeStep(activeStep.step_id)}
                  title="删除步骤"
                  type="button"
                >
                  <Trash2 aria-hidden="true" size={15} />
                </button>
              </div>
            </div>

            <FieldGroup title="Step">
              <TextField
                label="step_id"
                onChange={(step_id) => updateStep(activeStep.step_id, { step_id })}
                value={activeStep.step_id}
              />
              <label className="grid gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  region
                </span>
                <select
                  className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm"
                  onChange={(event) =>
                    updateStep(activeStep.step_id, {
                      region: event.target.value as MakeupRegion,
                    })
                  }
                  value={activeStep.region}
                >
                  {MAKEUP_REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {regionLabels[region]}
                    </option>
                  ))}
                </select>
              </label>
            </FieldGroup>

            <label className="grid gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                goal
              </span>
              <textarea
                className="min-h-20 resize-y rounded-md border border-stone-200 px-3 py-2 text-sm leading-6"
                onChange={(event) =>
                  updateStep(activeStep.step_id, { goal: event.target.value })
                }
                value={activeStep.goal}
              />
            </label>

            <FieldGroup title="Tool">
              <TextField
                label="type"
                onChange={(type) => updateStepTool(activeStep.step_id, { type })}
                value={activeStep.tool.type}
              />
              <TextField
                label="subtype"
                onChange={(subtype) => updateStepTool(activeStep.step_id, { subtype })}
                value={activeStep.tool.subtype}
              />
            </FieldGroup>

            <FieldGroup title="Product">
              <TextField
                label="category"
                onChange={(category) =>
                  updateStepProduct(activeStep.step_id, { category })
                }
                value={activeStep.product.category}
              />
              <TextField
                label="color_family"
                onChange={(color_family) =>
                  updateStepProduct(activeStep.step_id, { color_family })
                }
                value={activeStep.product.color_family}
              />
              <TextField
                label="finish"
                onChange={(finish) => updateStepProduct(activeStep.step_id, { finish })}
                value={activeStep.product.finish}
              />
            </FieldGroup>

            <FieldGroup title="Action">
              <label className="grid gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  type
                </span>
                <select
                  className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm"
                  onChange={(event) =>
                    updateStepAction(activeStep.step_id, {
                      type: event.target.value as MakeupActionType,
                    })
                  }
                  value={activeStep.action.type}
                >
                  {MAKEUP_ACTIONS.map((action) => (
                    <option key={action} value={action}>
                      {actionLabels[action]}
                    </option>
                  ))}
                </select>
              </label>
              <TextField
                label="direction"
                onChange={(direction) =>
                  updateStepAction(activeStep.step_id, { direction })
                }
                value={activeStep.action.direction}
              />
              <label className="grid gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  pressure
                </span>
                <select
                  className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm"
                  onChange={(event) =>
                    updateStepAction(activeStep.step_id, {
                      pressure: event.target.value as ActionPressure,
                    })
                  }
                  value={activeStep.action.pressure}
                >
                  {pressureOptions.map((pressure) => (
                    <option key={pressure} value={pressure}>
                      {pressureLabels[pressure]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  repeat
                </span>
                <input
                  className="h-10 rounded-md border border-stone-200 px-3 text-sm"
                  min="1"
                  onChange={(event) =>
                    updateStepAction(activeStep.step_id, {
                      repeat: Number(event.target.value),
                    })
                  }
                  type="number"
                  value={activeStep.action.repeat}
                />
              </label>
            </FieldGroup>

            <FieldGroup title="Placement">
              <TextField
                label="anchor"
                onChange={(anchor) =>
                  updateStepPlacement(activeStep.step_id, { anchor })
                }
                value={activeStep.placement.anchor}
              />
              <TextField
                label="shape"
                onChange={(shape) => updateStepPlacement(activeStep.step_id, { shape })}
                value={activeStep.placement.shape}
              />
              <RangeField
                label="size"
                onChange={(size) => updateStepPlacement(activeStep.step_id, { size })}
                value={activeStep.placement.size}
              />
            </FieldGroup>

            <FieldGroup title="Effect">
              <RangeField
                label="contrast"
                onChange={(contrast) => updateStepEffect(activeStep.step_id, { contrast })}
                value={activeStep.effect.contrast}
              />
              <RangeField
                label="softness"
                onChange={(softness) => updateStepEffect(activeStep.step_id, { softness })}
                value={activeStep.effect.softness}
              />
              <RangeField
                label="depth"
                onChange={(depth) => updateStepEffect(activeStep.step_id, { depth })}
                value={activeStep.effect.depth}
              />
            </FieldGroup>
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">
            暂无步骤。
          </div>
        )}
      </div>
    </div>
  );
}
