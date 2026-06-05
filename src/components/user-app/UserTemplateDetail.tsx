import type { UserAppTemplateDetailViewModel } from '../../user-app';

export interface UserTemplateDetailProps {
  template: UserAppTemplateDetailViewModel | null;
  canEnterStepGuide: boolean;
  onStartGuidance: () => void;
  onShowTools: () => void;
}

const statusLabel: Record<string, string> = {
  ready: '可以开始',
  warning: '有提醒',
  blocked: '已阻断',
  empty: '空状态',
};

export function UserTemplateDetail({
  template,
  canEnterStepGuide,
  onStartGuidance,
  onShowTools,
}: UserTemplateDetailProps) {
  if (!template) {
    return (
      <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
        <h3 className="text-base font-semibold text-stone-950">模板详情</h3>
        <p className="mt-3 rounded-md border border-dashed border-stone-300 bg-stone-50 p-3 text-sm text-stone-600">
          请选择一套妆容模板。
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-teal-700">模板详情</p>
          <h3 className="text-lg font-semibold text-stone-950">{template.title}</h3>
          <p className="mt-1 text-sm leading-6 text-stone-600">{template.subtitle}</p>
        </div>
        <span className="w-fit rounded bg-stone-100 px-2 py-1 text-xs text-stone-600">
          {statusLabel[template.status]}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {template.styleTags.map((tag) => (
          <span className="rounded bg-teal-50 px-2 py-0.5 text-xs text-teal-800" key={tag}>
            {tag}
          </span>
        ))}
      </div>

      <dl className="mt-3 grid gap-2 text-xs text-stone-600 sm:grid-cols-3">
        <div className="rounded bg-stone-50 p-2">
          <dt className="font-medium text-stone-900">难度</dt>
          <dd>{template.difficulty}</dd>
        </div>
        <div className="rounded bg-stone-50 p-2">
          <dt className="font-medium text-stone-900">预计时长</dt>
          <dd>{template.estimatedDurationMinutes} 分钟</dd>
        </div>
        <div className="rounded bg-stone-50 p-2">
          <dt className="font-medium text-stone-900">适合场景</dt>
          <dd>{template.suitableOccasions.join('、') || '通用'}</dd>
        </div>
      </dl>

      {template.blockingIssues.length > 0 ? (
        <ul className="mt-3 grid gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm leading-6 text-rose-950">
          {template.blockingIssues.map((item) => (
            <li key={item}>阻断：{item}</li>
          ))}
        </ul>
      ) : null}

      {template.warnings.length > 0 ? (
        <ul className="mt-3 grid gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
          {template.warnings.map((item) => (
            <li key={item}>提醒：{item}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-3">
        <p className="text-sm font-semibold text-stone-900">步骤概览</p>
        <ol className="mt-2 grid gap-2 text-sm text-stone-700">
          {template.steps.map((step) => (
            <li className="rounded bg-stone-50 p-2" key={step.stepId}>
              {step.guidance.progressLabel}：{step.title || '未命名步骤'}
            </li>
          ))}
          {template.steps.length === 0 ? (
            <li className="rounded border border-dashed border-stone-300 bg-stone-50 p-2 text-stone-500">
              暂无可展示步骤。
            </li>
          ) : null}
        </ol>
      </div>

      <div className="mt-3">
        <p className="text-sm font-semibold text-stone-900">安全提示</p>
        <ul className="mt-2 grid gap-1 text-xs leading-5 text-stone-600">
          {template.safetyNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
          {template.safetyNotes.length === 0 ? <li>暂无额外安全提示。</li> : null}
        </ul>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button
          className="rounded-md bg-teal-700 px-3 py-3 text-sm font-semibold text-white disabled:opacity-40"
          disabled={!canEnterStepGuide}
          onClick={onStartGuidance}
          type="button"
        >
          开始分步指导
        </button>
        <button
          className="rounded-md border border-stone-300 px-3 py-3 text-sm text-stone-700"
          onClick={onShowTools}
          type="button"
        >
          查看工具和产品
        </button>
      </div>
    </section>
  );
}
