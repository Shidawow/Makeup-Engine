import { CheckCircle2, ListChecks, RotateCcw, Search } from 'lucide-react';
import type { UserAppStepViewModel } from '../../user-app';

export interface UserAppCompletionProps {
  templateTitle?: string;
  completedSteps: number;
  totalSteps: number;
  steps?: UserAppStepViewModel[];
  onRestart: () => void;
  onChooseAnother: () => void;
}

export function UserAppCompletion({
  templateTitle,
  completedSteps,
  totalSteps,
  steps = [],
  onRestart,
  onChooseAnother,
}: UserAppCompletionProps) {
  const completedRegionLabels = Array.from(
    new Set(steps.map((step) => step.guidance.stepCategory).filter(Boolean)),
  );

  return (
    <section className="rounded-lg border border-teal-200 bg-teal-50 p-4 shadow-soft">
      <div className="flex items-start gap-3">
        <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-teal-700" size={24} />
        <div>
          <p className="text-xs font-semibold text-teal-800">完成页</p>
          <h2 className="mt-1 text-xl font-semibold text-stone-950">
            已完成本次妆容练习
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-700">
            {templateTitle ? `「${templateTitle}」` : '这套妆容'}已完成 {completedSteps} /{' '}
            {totalSteps} 个步骤。当前结果只保留在本地进度中，不上传照片，
            不生成分享内容，也不会用于训练。
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-3 text-sm">
          <span className="block text-xs text-stone-500">完成步骤</span>
          <span className="font-semibold text-stone-950">
            {completedSteps} / {totalSteps}
          </span>
        </div>
        <div className="rounded-lg bg-white p-3 text-sm">
          <span className="block text-xs text-stone-500">练习区域</span>
          <span className="font-semibold text-stone-950">
            {completedRegionLabels.slice(0, 3).join('、') || '按步骤完成'}
          </span>
        </div>
        <div className="rounded-lg bg-white p-3 text-sm">
          <span className="block text-xs text-stone-500">下一次建议</span>
          <span className="font-semibold text-stone-950">从第一步慢速复盘</span>
        </div>
      </div>

      {steps.length > 0 ? (
        <div className="mt-4 rounded-lg border border-teal-100 bg-white p-3">
          <div className="flex items-center gap-2">
            <ListChecks aria-hidden="true" className="text-teal-700" size={16} />
            <h3 className="text-sm font-semibold text-stone-950">步骤回顾</h3>
          </div>
          <ol className="mt-3 grid gap-2 text-sm text-stone-700">
            {steps.map((step) => (
              <li className="flex items-start gap-2 rounded-md bg-stone-50 p-2" key={step.stepId}>
                <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-teal-700" size={15} />
                <span>
                  <span className="font-medium text-stone-950">
                    {step.order}. {step.title}
                  </span>
                  <span className="block text-xs leading-5 text-stone-500">
                    {step.guidance.stepCategory} / {step.targetEffect || '完成当前区域效果'}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 py-3 text-sm font-semibold text-white"
          onClick={onRestart}
          type="button"
        >
          <RotateCcw aria-hidden="true" size={18} />
          重新开始这套妆容
        </button>
        <button
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-teal-300 bg-white px-4 py-3 text-sm font-semibold text-teal-900"
          onClick={onChooseAnother}
          type="button"
        >
          <Search aria-hidden="true" size={18} />
          返回模板选择
        </button>
      </div>
    </section>
  );
}
