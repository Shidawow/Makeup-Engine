import type { UserAppMvpReleaseReadinessReport } from '../../user-app';

export interface UserAppMvpReleaseReadinessPanelProps {
  report: UserAppMvpReleaseReadinessReport;
}

const statusLabel: Record<UserAppMvpReleaseReadinessReport['status'], string> = {
  ready_for_internal_user_trial: '可进入内部小范围试用准备',
  ready_with_warnings: '可进入但需带 warning',
  blocked: '阻断内部试用准备',
};

export function UserAppMvpReleaseReadinessPanel({
  report,
}: UserAppMvpReleaseReadinessPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 8E MVP Release Readiness Gate
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">MVP 发布就绪度</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          管理员用于判断当前 PWA / Mobile Web MVP 是否可以进入内部小范围真实用户试用准备。
          这不是正式发布，不是 App Store/TestFlight，也不启用上传、训练、照片、相机或 AR。
        </p>
      </div>

      <div className="mt-4 rounded-md border border-stone-200 bg-stone-50 p-3">
        <p className="text-xs font-semibold text-stone-500">Gate 状态</p>
        <p className="mt-1 text-base font-semibold text-stone-900">
          {statusLabel[report.status]}
        </p>
        <p className="mt-1 text-sm leading-6 text-stone-600">{report.summary}</p>
        <p className="mt-2 text-xs text-stone-500">
          下一建议阶段：{report.nextRecommendedPhase} - {report.nextRecommendedPhaseName}
        </p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {report.checks.map((check) => (
          <article
            className="rounded-md border border-stone-200 bg-stone-50 p-3"
            key={check.checkId}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-stone-900">{check.label}</h3>
                <p className="mt-1 text-xs leading-5 text-stone-600">{check.summary}</p>
              </div>
              <span className="w-fit rounded-md bg-white px-2 py-1 text-xs font-semibold text-stone-700">
                {check.status}
              </span>
            </div>
            {check.issues.length > 0 ? (
              <ul className="mt-2 grid gap-2">
                {check.issues.map((issue) => (
                  <li
                    className="rounded-md border border-amber-200 bg-amber-50 p-2 text-xs leading-5 text-amber-900"
                    key={issue.issueId}
                  >
                    <strong>{issue.severity}</strong>: {issue.message}
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-2">
        {report.recommendations.map((item) => (
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
