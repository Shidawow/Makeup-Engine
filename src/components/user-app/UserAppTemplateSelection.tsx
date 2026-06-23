import { Clock, Sparkles } from 'lucide-react';
import type { UserAppTemplateCardViewModel } from '../../user-app';

export interface UserAppTemplateSelectionProps {
  templates: UserAppTemplateCardViewModel[];
  selectedTemplateId?: string;
  onSelectTemplate: (templateId: string) => void;
}

const difficultyLabel: Record<string, string> = {
  easy: '新手友好',
  medium: '进阶练习',
  hard: '熟练挑战',
  beginner: '新手友好',
  intermediate: '进阶练习',
  advanced: '熟练挑战',
};

const statusLabel: Record<string, string> = {
  ready: '可以开始',
  warning: '有提醒',
  blocked: '暂不可用',
  empty: '暂无内容',
};

export function UserAppTemplateSelection({
  templates,
  selectedTemplateId,
  onSelectTemplate,
}: UserAppTemplateSelectionProps) {
  const visibleTemplates = templates.slice(0, 3);

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-teal-700">模板选择</p>
          <h2 className="text-lg font-semibold text-stone-950">选择今天要练的妆容</h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            先看风格、难度和预计时间，再选择一套进入详情。当前只使用本地示例内容。
          </p>
        </div>
        <span className="w-fit rounded bg-stone-100 px-2 py-1 text-xs text-stone-600">
          {templates.length} 套可预览
        </span>
      </div>

      {visibleTemplates.length === 0 ? (
        <div className="mt-4 rounded-md border border-dashed border-stone-300 bg-stone-50 p-3 text-sm text-stone-600">
          暂无可选择妆容。请加载本地妆容包后再试。
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {visibleTemplates.map((template) => (
          <button
            className={`min-h-[180px] rounded-lg border p-3 text-left transition ${
              selectedTemplateId === template.appTemplateId
                ? 'border-teal-600 bg-teal-50'
                : 'border-stone-200 bg-white hover:border-teal-300'
            }`}
            key={template.appTemplateId}
            onClick={() => onSelectTemplate(template.appTemplateId)}
            type="button"
          >
            <div className="flex items-start justify-between gap-3">
              <Sparkles aria-hidden="true" className="mt-0.5 shrink-0 text-teal-700" size={18} />
              <span className="rounded bg-stone-100 px-2 py-1 text-xs text-stone-600">
                {statusLabel[template.status]}
              </span>
            </div>
            <h3 className="mt-3 text-base font-semibold text-stone-950">{template.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-stone-600">
              {template.subtitle}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-stone-600">
              <span className="rounded bg-stone-50 px-2 py-1">
                {difficultyLabel[template.difficulty] ?? template.difficulty}
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-stone-50 px-2 py-1">
                <Clock aria-hidden="true" size={12} />
                {template.estimatedDurationMinutes} 分钟
              </span>
              <span className="rounded bg-stone-50 px-2 py-1">{template.stepCount} 步</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {template.styleTags.slice(0, 4).map((tag) => (
                <span className="rounded bg-teal-100 px-2 py-0.5 text-xs text-teal-900" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
