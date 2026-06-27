import { ArrowRight, Brush, CheckCircle2, Clock, ListChecks, ShieldCheck } from 'lucide-react';
import type { UserAppTemplateDetailViewModel } from '../../user-app';

export interface UserAppPreparationProps {
  template: UserAppTemplateDetailViewModel | null;
  canEnterStepGuide: boolean;
  onStartGuidance: () => void;
}

const difficultyLabel: Record<string, string> = {
  easy: '新手友好',
  medium: '进阶练习',
  hard: '熟练挑战',
  beginner: '新手友好',
  intermediate: '进阶练习',
  advanced: '熟练挑战',
};

export function UserAppPreparation({
  template,
  canEnterStepGuide,
  onStartGuidance,
}: UserAppPreparationProps) {
  if (!template) {
    return (
      <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
        <h2 className="text-lg font-semibold text-stone-950">开始前准备</h2>
        <p className="mt-3 rounded-md border border-dashed border-stone-300 bg-stone-50 p-3 text-sm text-stone-600">
          请先选择一套妆容，再查看需要准备的工具和步骤。
        </p>
      </section>
    );
  }

  const requiredTools = template.toolsAndProducts.requiredTools;
  const optionalTools = template.toolsAndProducts.optionalTools;
  const productSuggestions = template.toolsAndProducts.productSuggestions;
  const stepCount = template.steps.length;
  const firstStep = template.steps[0];

  return (
    <section className="rounded-lg border border-teal-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-teal-700">开始前准备</p>
          <h2 className="text-xl font-semibold text-stone-950">{template.title}</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            先把工具放在手边，再进入分步骤跟练。当前仅做本地化妆指导，
            不保存照片，也不进行医学判断。
          </p>
        </div>
        <span className="w-fit rounded bg-teal-50 px-3 py-1 text-xs font-medium text-teal-900">
          本地练习
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="rounded-md bg-stone-50 p-3 text-sm">
          <span className="block text-xs text-stone-500">难度</span>
          <span className="font-semibold text-stone-950">
            {difficultyLabel[template.difficulty] ?? template.difficulty}
          </span>
        </div>
        <div className="rounded-md bg-stone-50 p-3 text-sm">
          <span className="block text-xs text-stone-500">预计耗时</span>
          <span className="inline-flex items-center gap-1 font-semibold text-stone-950">
            <Clock aria-hidden="true" size={14} />
            {template.estimatedDurationMinutes} 分钟
          </span>
        </div>
        <div className="rounded-md bg-stone-50 p-3 text-sm">
          <span className="block text-xs text-stone-500">本次步骤</span>
          <span className="inline-flex items-center gap-1 font-semibold text-stone-950">
            <ListChecks aria-hidden="true" size={14} />
            {stepCount} 步
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-lg border border-stone-200 p-3">
          <div className="flex items-center gap-2">
            <Brush aria-hidden="true" className="text-teal-700" size={16} />
            <h3 className="text-sm font-semibold text-stone-950">工具 checklist</h3>
          </div>
          <ul className="mt-3 grid gap-2 text-sm text-stone-700">
            {requiredTools.map((tool) => (
              <li className="flex items-start gap-2 rounded-md bg-stone-50 p-3" key={tool.toolId}>
                <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-teal-700" size={16} />
                <span>
                  <span className="font-medium text-stone-950">{tool.displayName}</span>
                  <span className="block text-xs text-stone-500">{tool.toolType}</span>
                </span>
              </li>
            ))}
            {requiredTools.length === 0 ? (
              <li className="rounded-md border border-dashed border-stone-300 bg-stone-50 p-3 text-stone-500">
                暂无必备工具，真实跟练前建议补充。
              </li>
            ) : null}
          </ul>
        </div>

        <div className="grid gap-3">
          <div className="rounded-lg border border-teal-100 bg-teal-50 p-3">
            <h3 className="text-sm font-semibold text-teal-950">今天练什么</h3>
            <p className="mt-2 text-sm leading-6 text-teal-950">
              先完成
              {firstStep ? `「${firstStep.title}」` : '第一步'}
              ，再按顺序看区域、工具和修正提示。每一步都可以返回重看。
            </p>
          </div>

          <div className="rounded-lg border border-stone-200 p-3">
            <h3 className="text-sm font-semibold text-stone-950">开始前注意</h3>
            <ul className="mt-2 grid gap-2 text-sm leading-6 text-stone-700">
              <li>先少量取用产品，颜色可以逐步叠加。</li>
              <li>先看“区域说明”，再动手上妆，避免涂到过大范围。</li>
              <li>如果某一步不顺手，可以返回上一步重新看提示。</li>
              <li>本流程不上传照片，不训练模型，也不会生成医学判断。</li>
            </ul>
          </div>

          <details className="rounded-lg border border-stone-200 p-3 text-sm text-stone-700">
            <summary className="cursor-pointer font-semibold text-stone-950">
              可选工具和产品建议
            </summary>
            <div className="mt-3 grid gap-2">
              <p>
                可选工具：
                {optionalTools.map((tool) => tool.displayName).join('、') || '暂无'}
              </p>
              <p>
                产品：
                {productSuggestions.map((product) => product.displayName).join('、') || '暂未列出'}
              </p>
            </div>
          </details>
        </div>
      </div>

      {template.blockingIssues.length > 0 ? (
        <ul className="mt-4 grid gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm leading-6 text-rose-950">
          {template.blockingIssues.map((issue) => (
            <li key={issue}>暂不能开始：{issue}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4 rounded-lg border border-teal-100 bg-teal-50 p-3">
        <div className="flex items-start gap-2 text-sm leading-6 text-teal-950">
          <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-teal-700" size={16} />
          <p>
            隐私提醒：当前是本地 MVP 预览，不登录、不上传、不保存真实用户资料，
            也不会把跟练状态用于训练。
          </p>
        </div>
      </div>

      <button
        className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-teal-700 px-4 py-3 text-base font-semibold text-white disabled:opacity-40"
        disabled={!canEnterStepGuide}
        onClick={onStartGuidance}
        type="button"
      >
        开始跟练
        <ArrowRight aria-hidden="true" size={18} />
      </button>
    </section>
  );
}
