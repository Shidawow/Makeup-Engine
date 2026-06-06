import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import type { UserAppTemplateCardViewModel } from '../../user-app';

export interface UserTemplateListProps {
  templates: UserAppTemplateCardViewModel[];
  selectedTemplateId?: string;
  onSelectTemplate: (templateId: string) => void;
}

const statusLabel: Record<string, string> = {
  ready: '可用',
  warning: '有提醒',
  blocked: '已阻断',
  empty: '空',
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'blocked') {
    return <XCircle aria-hidden="true" className="text-rose-700" size={16} />;
  }

  if (status === 'warning') {
    return <AlertTriangle aria-hidden="true" className="text-amber-700" size={16} />;
  }

  return <CheckCircle2 aria-hidden="true" className="text-teal-700" size={16} />;
};

export function UserTemplateList({
  templates,
  selectedTemplateId,
  onSelectTemplate,
}: UserTemplateListProps) {
  const blockedCount = templates.filter((template) => template.status === 'blocked').length;

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold text-stone-950">妆容模板</h3>
        <span className="text-xs text-stone-500">
          {templates.length} 个模板，{blockedCount} 个阻断
        </span>
      </div>

      {templates.length === 0 ? (
        <div className="mt-3 rounded-md border border-dashed border-stone-300 bg-stone-50 p-3 text-sm leading-6 text-stone-600">
          暂无可展示妆容。请先加载包含妆容内容的本地包。
        </div>
      ) : null}

      {templates.length > 0 && blockedCount === templates.length ? (
        <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm leading-6 text-rose-950">
          当前模板全部被兼容性检查阻断，不能进入分步指导。
        </div>
      ) : null}

      <div className="mt-3 grid gap-2">
        {templates.map((template) => (
          <button
            className={`rounded-lg border p-3 text-left transition ${
              selectedTemplateId === template.appTemplateId
                ? 'border-teal-500 bg-teal-50'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
            key={template.appTemplateId}
            onClick={() => onSelectTemplate(template.appTemplateId)}
            type="button"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-stone-950">{template.title}</h4>
                <p className="mt-1 text-xs leading-5 text-stone-600">{template.subtitle}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded bg-stone-50 px-2 py-1 text-xs text-stone-700">
                <StatusIcon status={template.status} />
                {statusLabel[template.status]}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-stone-600">
              <span>{template.difficulty}</span>
              <span>{template.estimatedDurationMinutes} 分钟</span>
              <span>{template.stepCount} 步</span>
              <span>{template.suitableOccasions.join('、') || '通用场景'}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {template.styleTags.map((tag) => (
                <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700" key={tag}>
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
