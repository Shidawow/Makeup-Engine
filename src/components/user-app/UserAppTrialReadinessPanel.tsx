import type { UserAppTrialReadinessReport } from '../../user-app';

export interface UserAppTrialReadinessPanelProps {
  report: UserAppTrialReadinessReport;
}

const statusLabel: Record<UserAppTrialReadinessReport['checks'][number]['status'], string> = {
  passed: '通过',
  warning: '提醒',
  blocked: '阻断',
};

const statusClass: Record<UserAppTrialReadinessReport['checks'][number]['status'], string> = {
  passed: 'border-teal-200 bg-teal-50 text-teal-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  blocked: 'border-rose-200 bg-rose-50 text-rose-800',
};

const reportStatusLabel: Record<UserAppTrialReadinessReport['status'], string> = {
  ready_for_internal_trial: '可进入内部试用',
  ready_with_warnings: '可试用但有提醒',
  blocked: '阻断',
};

export function UserAppTrialReadinessPanel({ report }: UserAppTrialReadinessPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">Trial readiness</p>
          <h2 className="text-lg font-semibold text-stone-950">试用就绪度</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
            管理员用这份报告判断 MVP 试用包能否进入小范围内部试用。
            它不是正式发布、不是 App Store/TestFlight、也不是线上增长审批。
          </p>
        </div>
        <span className="w-fit rounded-md bg-stone-50 px-3 py-2 text-xs text-stone-600">
          {reportStatusLabel[report.status]}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-4">
        <p className="rounded-md bg-stone-50 p-3">试用包：{report.trialPackStatus}</p>
        <p className="rounded-md bg-stone-50 p-3">反馈表：{report.feedbackFormStatus}</p>
        <p className="rounded-md bg-stone-50 p-3">PWA：{report.pwaStatus}</p>
        <p className="rounded-md bg-stone-50 p-3">问题：{report.issues.length}</p>
      </div>

      <div className="mt-4 rounded-md border border-teal-200 bg-teal-50 p-3 text-sm leading-6 text-teal-950">
        {report.summary} 当前保持本地-only、无后端、无上传、无相机、无 AR、无训练。
      </div>

      <div className="mt-4 grid gap-3">
        {report.checks.map((item) => (
          <article className="rounded-md border border-stone-200 bg-stone-50 p-3" key={item.checkId}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="font-semibold text-stone-950">{item.label}</h3>
                <p className="mt-1 text-sm leading-6 text-stone-600">{item.summary}</p>
              </div>
              <span className={`w-fit rounded-md border px-2 py-1 text-xs ${statusClass[item.status]}`}>
                {statusLabel[item.status]}
              </span>
            </div>
            <p className="mt-2 text-xs text-stone-500">建议：{item.recommendation}</p>
            <div className="mt-3 grid gap-2 text-xs text-stone-600 sm:grid-cols-2">
              {item.evidence.map((evidence) => (
                <span className="rounded bg-white px-3 py-2" key={evidence}>{evidence}</span>
              ))}
            </div>
            {item.issues.length > 0 ? (
              <div className="mt-3 grid gap-2">
                {item.issues.map((issue) => (
                  <p className="rounded-md border border-amber-200 bg-white px-3 py-2 text-sm text-stone-700" key={issue.issueId}>
                    {issue.severity === 'blocking' ? '阻断' : '提醒'}：{issue.message}
                  </p>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
