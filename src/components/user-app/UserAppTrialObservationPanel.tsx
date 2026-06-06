import type { UserAppTrialObservationGuide, UserAppTrialObservationSummary } from '../../user-app';

export interface UserAppTrialObservationPanelProps {
  guide: UserAppTrialObservationGuide;
  summary?: UserAppTrialObservationSummary;
}

export function UserAppTrialObservationPanel({
  guide,
  summary,
}: UserAppTrialObservationPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9A observation guide
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">观察记录模板</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          这是本地文档化观察模板，不是后端记录系统。只记录匿名体验现象，
          不收集照片、联系方式、健康信息、敏感身份信息或训练数据。
        </p>
      </div>

      <div className="mt-4 rounded-md border border-stone-200 bg-stone-50 p-3">
        <p className="text-xs font-semibold text-stone-500">模板状态</p>
        <p className="mt-1 font-semibold text-stone-900">
          {guide.status === 'ready' ? '可用于观察' : '已阻断'}
        </p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {guide.signals.map((signal) => (
          <article className="rounded-md border border-stone-200 bg-stone-50 p-3" key={signal.signalId}>
            <p className="text-xs font-semibold text-teal-700">观察 {signal.order}</p>
            <h3 className="text-sm font-semibold text-stone-900">{signal.label}</h3>
            <p className="mt-1 text-xs leading-5 text-stone-600">{signal.observerPrompt}</p>
            <p className="mt-2 text-xs leading-5 text-teal-800">好信号：{signal.goodSignal}</p>
            <p className="mt-1 text-xs leading-5 text-amber-800">风险信号：{signal.riskSignal}</p>
          </article>
        ))}
      </div>

      {summary ? (
        <div className="mt-4 rounded-md border border-teal-100 bg-teal-50 p-3 text-sm leading-6 text-teal-950">
          mock/example 摘要：正向信号 {summary.positiveSignals.length} 条，问题主题 {summary.issueThemes.length} 条。
        </div>
      ) : null}

      {guide.issues.length > 0 ? (
        <div className="mt-4 grid gap-2">
          {guide.issues.map((issue) => (
            <p className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-950" key={issue.issueId}>
              阻断：{issue.message}
            </p>
          ))}
        </div>
      ) : null}
    </section>
  );
}
