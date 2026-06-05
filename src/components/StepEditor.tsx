import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useStepPanel } from '../runtime/useMakeupRuntime';
import type {
  ActionPressure,
  MakeupActionType,
  MakeupRegion,
} from '../runtime/useMakeupRuntime';

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
  const {
    steps,
    tabs,
    activeStep,
    activeStepIndex,
    selectedRegion,
    regionOptions,
    actionOptions,
    pressureOptions,
    selectStep,
    addStep,
    updateStep,
    updateStepTool,
    updateStepProduct,
    updateStepAction,
    updateStepPlacement,
    updateStepEffect,
    removeStep,
    moveStep,
  } = useStepPanel();

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
          {tabs.map((tab) => (
            <button
              className={`min-h-10 shrink-0 rounded-md border px-3 text-sm transition ${
                tab.active
                  ? 'border-teal-600 bg-teal-50 text-teal-900'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
              }`}
              key={tab.id}
              onClick={() => selectStep(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeStep ? (
          <div className="grid gap-4">
            <div className="flex items-center justify-between gap-3 rounded-md bg-stone-50 px-3 py-2">
              <span className="text-sm font-medium text-stone-700">
                正在编辑第 {activeStepIndex + 1} 步
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

            <FieldGroup title="步骤基础信息">
              <TextField
                label="步骤 ID"
                onChange={(step_id) => updateStep(activeStep.step_id, { step_id })}
                value={activeStep.step_id}
              />
              <label className="grid gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  区域
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
                  {regionOptions.map((region) => (
                    <option key={region.value} value={region.value}>
                      {region.label}
                    </option>
                  ))}
                </select>
              </label>
            </FieldGroup>

            <label className="grid gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                视觉目标
              </span>
              <textarea
                className="min-h-20 resize-y rounded-md border border-stone-200 px-3 py-2 text-sm leading-6"
                onChange={(event) =>
                  updateStep(activeStep.step_id, { goal: event.target.value })
                }
                value={activeStep.goal}
              />
            </label>

            <FieldGroup title="工具">
              <TextField
                label="类型"
                onChange={(type) => updateStepTool(activeStep.step_id, { type })}
                value={activeStep.tool.type}
              />
              <TextField
                label="子类型"
                onChange={(subtype) => updateStepTool(activeStep.step_id, { subtype })}
                value={activeStep.tool.subtype}
              />
            </FieldGroup>

            <FieldGroup title="产品">
              <TextField
                label="品类"
                onChange={(category) =>
                  updateStepProduct(activeStep.step_id, { category })
                }
                value={activeStep.product.category}
              />
              <TextField
                label="色系"
                onChange={(color_family) =>
                  updateStepProduct(activeStep.step_id, { color_family })
                }
                value={activeStep.product.color_family}
              />
              <TextField
                label="妆效"
                onChange={(finish) => updateStepProduct(activeStep.step_id, { finish })}
                value={activeStep.product.finish}
              />
            </FieldGroup>

            <FieldGroup title="动作">
              <label className="grid gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  类型
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
                  {actionOptions.map((action) => (
                    <option key={action.value} value={action.value}>
                      {action.label}
                    </option>
                  ))}
                </select>
              </label>
              <TextField
                label="方向"
                onChange={(direction) =>
                  updateStepAction(activeStep.step_id, { direction })
                }
                value={activeStep.action.direction}
              />
              <label className="grid gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  力度
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
                    <option key={pressure.value} value={pressure.value}>
                      {pressure.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  重复次数
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

            <FieldGroup title="位置">
              <TextField
                label="锚点"
                onChange={(anchor) =>
                  updateStepPlacement(activeStep.step_id, { anchor })
                }
                value={activeStep.placement.anchor}
              />
              <TextField
                label="形状"
                onChange={(shape) => updateStepPlacement(activeStep.step_id, { shape })}
                value={activeStep.placement.shape}
              />
              <RangeField
                label="范围"
                onChange={(size) => updateStepPlacement(activeStep.step_id, { size })}
                value={activeStep.placement.size}
              />
            </FieldGroup>

            <FieldGroup title="效果">
              <RangeField
                label="对比度"
                onChange={(contrast) => updateStepEffect(activeStep.step_id, { contrast })}
                value={activeStep.effect.contrast}
              />
              <RangeField
                label="柔和度"
                onChange={(softness) => updateStepEffect(activeStep.step_id, { softness })}
                value={activeStep.effect.softness}
              />
              <RangeField
                label="深邃度"
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
