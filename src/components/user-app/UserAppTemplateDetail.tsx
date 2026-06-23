import { ArrowRight, Brush, Clock, ListChecks } from 'lucide-react';
import type { UserAppTemplateDetailViewModel } from '../../user-app';

export interface UserAppTemplateDetailProps {
  template: UserAppTemplateDetailViewModel | null;
  canEnterStepGuide: boolean;
  onStartGuidance: () => void;
  onShowPreparation: () => void;
}

const difficultyLabel: Record<string, string> = {
  easy: '新手友好',
  medium: '进阶练习',
  hard: '熟练挑战',
  beginner: '新手友好',
  intermediate: '进阶练习',
  advanced: '熟练挑战',
};

export function UserAppTemplateDetail({
  template,
  canEnterStepGuide,
  onStartGuidance,
  onShowPreparation,
}: UserAppTemplateDetailProps) {
  if (!template) {
    return (
      <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
        <h2 className="text-lg font-semibold text-stone-950">妆容详情</h2>
        <p className="mt-3 rounded-md border border-dashed border-stone-300 bg-stone-50 p-3 text-sm text-stone-600">
          请先选择一套妆容。
        </p>
      </section>
    );
  }

  const requiredTools = template.toolsAndProducts.requiredTools.slice(0, 4);
  const products = template.toolsAndProducts.productSuggestions.slice(0, 4);

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-teal-700">妆容详情</p>
          <h2 className="text-xl font-semibold text-stone-950">{template.title}</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">{template.subtitle}</p>
        </div>
        <span className="w-fit rounded bg-teal-50 px-3 py-1 text-xs font-medium text-teal-900">
          本地预览
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-stone-700 sm:grid-cols-3">
        <div className="rounded-md bg-stone-50 p-3">
          <span className="block text-xs text-stone-500">难度</span>
          <span className="font-semibold text-stone-950">
            {difficultyLabel[template.difficulty] ?? template.difficulty}
          </span>
        </div>
        <div className="rounded-md bg-stone-50 p-3">
          <span className="block text-xs text-stone-500">预计时间</span>
          <span className="inline-flex items-center gap-1 font-semibold text-stone-950">
            <Clock aria-hidden="true" size={14} />
            {template.estimatedDurationMinutes} 分钟
          </span>
        </div>
        <div className="rounded-md bg-stone-50 p-3">
          <span className="block text-xs text-stone-500">步骤数量</span>
          <span className="inline-flex items-center gap-1 font-semibold text-stone-950">
            <ListChecks aria-hidden="true" size={14} />
            {template.steps.length} 步
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-stone-200 p-3">
          <p className="text-sm font-semibold text-stone-950">适合场景</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(template.suitableOccasions.length > 0 ? template.suitableOccasions : ['日常练习']).map(
              (occasion) => (
                <span className="rounded bg-stone-100 px-2 py-1 text-xs text-stone-700" key={occasion}>
                  {occasion}
                </span>
              ),
            )}
          </div>
        </div>
        <div className="rounded-lg border border-stone-200 p-3">
          <p className="text-sm font-semibold text-stone-950">风格关键词</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(template.styleTags.length > 0 ? template.styleTags : ['自然']).map((tag) => (
              <span className="rounded bg-teal-50 px-2 py-1 text-xs text-teal-800" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-stone-200 p-3">
        <div className="flex items-center gap-2">
          <Brush aria-hidden="true" className="text-teal-700" size={16} />
          <p className="text-sm font-semibold text-stone-950">准备工具</p>
        </div>
        <div className="mt-2 grid gap-2 text-sm text-stone-700 md:grid-cols-2">
          <p>
            工具：
            {requiredTools.map((tool) => tool.displayName).join('、') || '暂未列出'}
          </p>
          <p>
            产品：
            {products.map((product) => product.displayName).join('、') || '暂未列出'}
          </p>
        </div>
      </div>

      {template.warnings.length > 0 ? (
        <ul className="mt-4 grid gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
          {template.warnings.map((item) => (
            <li key={item}>提醒：{item}</li>
          ))}
        </ul>
      ) : null}

      {template.blockingIssues.length > 0 ? (
        <ul className="mt-4 grid gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm leading-6 text-rose-950">
          {template.blockingIssues.map((item) => (
            <li key={item}>暂不能开始：{item}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-800"
          onClick={onShowPreparation}
          type="button"
        >
          <Brush aria-hidden="true" size={18} />
          查看准备工具
        </button>
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-40"
          disabled={!canEnterStepGuide}
          onClick={onStartGuidance}
          type="button"
        >
          开始分步骤跟练
          <ArrowRight aria-hidden="true" size={18} />
        </button>
      </div>
    </section>
  );
}
