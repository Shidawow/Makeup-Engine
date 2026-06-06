import type { UserAppTrialGoNoGoDecision } from '../../user-app';

export interface UserAppTrialGoNoGoPanelProps {
  decision: UserAppTrialGoNoGoDecision;
}

const decisionLabel: Record<UserAppTrialGoNoGoDecision['decision'], string> = {
  go_for_internal_trial: 'Go：进入内部试用准备',
  go_with_warnings: 'Go with warnings：带 warning 进入准备',
  no_go: 'No-go：先修复阻断项',
};

export function UserAppTrialGoNoGoPanel({ decision }: UserAppTrialGoNoGoPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 8E Trial Go/No-Go
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">试用 Go/No-Go</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          这是内部小范围试用的 go/no-go 决策，不是正式生产发布。Go 也仍然表示不接后端、
          不采集照片、不启用相机或 AR、不调用外部 API、不训练模型。
        </p>
      </div>

      <div className="mt-4 rounded-md border border-stone-200 bg-stone-50 p-3">
        <p className="text-xs font-semibold text-stone-500">决策结果</p>
        <p className="mt-1 text-base font-semibold text-stone-900">
          {decisionLabel[decision.decision]}
        </p>
        <p className="mt-1 text-sm leading-6 text-stone-600">{decision.summary}</p>
        <p className="mt-2 text-xs text-stone-500">
          下一建议阶段：{decision.nextRecommendedPhase} - {decision.nextRecommendedPhaseName}
        </p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {decision.signals.map((signal) => (
          <article
            className="rounded-md border border-stone-200 bg-stone-50 p-3"
            key={signal.signalId}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-stone-900">{signal.label}</h3>
                <p className="mt-1 text-xs leading-5 text-stone-600">{signal.summary}</p>
              </div>
              <span className="w-fit rounded-md bg-white px-2 py-1 text-xs font-semibold text-stone-700">
                {signal.status}
              </span>
            </div>
            {signal.issues.length > 0 ? (
              <ul className="mt-2 grid gap-2">
                {signal.issues.map((issue) => (
                  <li
                    className="rounded-md border border-amber-200 bg-amber-50 p-2 text-xs leading-5 text-amber-900"
                    key={issue.issueId}
                  >
                    <strong>{issue.severity}</strong>: {issue.message} {issue.recommendation}
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-2">
        {decision.recommendations.map((item) => (
          <p
            className="rounded-md border border-teal-100 bg-teal-50 p-2 text-xs leading-5 text-teal-900"
            key={item.recommendationId}
          >
            <strong>{item.priority}</strong>: {item.message}
          </p>
        ))}
      </div>
    </section>
  );
}
