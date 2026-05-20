import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import {
  actionLabels,
  pressureLabels,
  regionLabels,
  speedLabels,
} from '../data/displayLabels';
import { MAKEUP_ACTIONS, MAKEUP_REGIONS } from '../types/makeup';
import type {
  ActionPressure,
  ActionSpeed,
  MakeupActionType,
  MakeupRegion,
} from '../types/makeup';
import { useTemplateStore } from '../store/templateStore';

const pressureOptions: ActionPressure[] = ['light', 'medium', 'firm'];
const speedOptions: ActionSpeed[] = ['slow', 'steady', 'quick'];

export function StepEditor() {
  const steps = useTemplateStore((state) => state.template.steps);
  const selectedRegion = useTemplateStore((state) => state.selectedRegion);
  const selectedStepId = useTemplateStore((state) => state.selectedStepId);
  const addStep = useTemplateStore((state) => state.addStep);
  const updateStep = useTemplateStore((state) => state.updateStep);
  const updateStepAction = useTemplateStore((state) => state.updateStepAction);
  const removeStep = useTemplateStore((state) => state.removeStep);
  const moveStep = useTemplateStore((state) => state.moveStep);
  const setSelectedStepId = useTemplateStore((state) => state.setSelectedStepId);
  const activeStep = steps.find((step) => step.id === selectedStepId) ?? steps[0];

  return (
    <div className="min-w-0 rounded-lg border border-stone-200 bg-white/85 shadow-soft">
      <div className="flex items-center justify-between gap-3 border-b border-stone-200 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-stone-950">步骤</h2>
          <p className="text-xs text-stone-500">说明流程与动作 DSL</p>
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
                step.id === activeStep?.id
                  ? 'border-teal-600 bg-teal-50 text-teal-900'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
              }`}
              key={step.id}
              onClick={() => setSelectedStepId(step.id)}
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
                正在编辑第 {steps.findIndex((step) => step.id === activeStep.id) + 1} 步
              </span>
              <div className="flex gap-1">
                <button
                  className="grid h-8 w-8 place-items-center rounded-md text-stone-500 hover:bg-white hover:text-stone-950"
                  onClick={() => moveStep(activeStep.id, 'up')}
                  title="上移步骤"
                  type="button"
                >
                  <ArrowUp aria-hidden="true" size={15} />
                </button>
                <button
                  className="grid h-8 w-8 place-items-center rounded-md text-stone-500 hover:bg-white hover:text-stone-950"
                  onClick={() => moveStep(activeStep.id, 'down')}
                  title="下移步骤"
                  type="button"
                >
                  <ArrowDown aria-hidden="true" size={15} />
                </button>
                <button
                  className="grid h-8 w-8 place-items-center rounded-md text-rose-600 hover:bg-rose-50"
                  onClick={() => removeStep(activeStep.id)}
                  title="删除步骤"
                  type="button"
                >
                  <Trash2 aria-hidden="true" size={15} />
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  区域
                </span>
                <select
                  className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm capitalize"
                  onChange={(event) =>
                    updateStep(activeStep.id, {
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
              <label className="grid gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  工具
                </span>
                <input
                  className="h-10 rounded-md border border-stone-200 px-3 text-sm"
                  onChange={(event) =>
                    updateStep(activeStep.id, { tool: event.target.value })
                  }
                  value={activeStep.tool}
                />
              </label>
            </div>

            <label className="grid gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                视觉目标
              </span>
              <textarea
                className="min-h-20 resize-y rounded-md border border-stone-200 px-3 py-2 text-sm leading-6"
                onChange={(event) =>
                  updateStep(activeStep.id, { visualGoal: event.target.value })
                }
                value={activeStep.visualGoal}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  动作
                </span>
                <select
                  className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm"
                  onChange={(event) =>
                    updateStepAction(activeStep.id, {
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
              <label className="grid gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  方向
                </span>
                <input
                  className="h-10 rounded-md border border-stone-200 px-3 text-sm"
                  onChange={(event) =>
                    updateStepAction(activeStep.id, { direction: event.target.value })
                  }
                  value={activeStep.action.direction}
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  力度
                </span>
                <select
                  className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm"
                  onChange={(event) =>
                    updateStepAction(activeStep.id, {
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
                  速度
                </span>
                <select
                  className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm"
                  onChange={(event) =>
                    updateStepAction(activeStep.id, {
                      speed: event.target.value as ActionSpeed,
                    })
                  }
                  value={activeStep.action.speed}
                >
                  {speedOptions.map((speed) => (
                    <option key={speed} value={speed}>
                      {speedLabels[speed]}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="grid gap-2">
              <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-stone-500">
                <span>重复次数</span>
                <span>{activeStep.action.repeat}</span>
              </div>
              <input
                className="w-full accent-teal-700"
                max="8"
                min="1"
                onChange={(event) =>
                  updateStepAction(activeStep.id, {
                    repeat: Number(event.target.value),
                  })
                }
                type="range"
                value={activeStep.action.repeat}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  位置
                </span>
                <textarea
                  className="min-h-20 resize-y rounded-md border border-stone-200 px-3 py-2 text-sm leading-6"
                  onChange={(event) =>
                    updateStep(activeStep.id, { placement: event.target.value })
                  }
                  value={activeStep.placement}
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  效果
                </span>
                <textarea
                  className="min-h-20 resize-y rounded-md border border-stone-200 px-3 py-2 text-sm leading-6"
                  onChange={(event) =>
                    updateStep(activeStep.id, { effect: event.target.value })
                  }
                  value={activeStep.effect}
                />
              </label>
            </div>
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
