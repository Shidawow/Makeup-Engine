import type { UserAppReadinessReport } from '../../user-app';
import { UserAppReadinessGate } from './UserAppReadinessGate';

export interface UserAppReadinessPanelProps {
  report: UserAppReadinessReport;
}

const checkStatusLabel: Record<UserAppReadinessReport['checks'][number]['status'], string> = {
  passed: '通过',
  warning: '提醒',
  blocked: '阻断',
};

const checkStatusClass: Record<UserAppReadinessReport['checks'][number]['status'], string> = {
  passed: 'bg-teal-50 text-teal-800 border-teal-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  blocked: 'bg-rose-50 text-rose-800 border-rose-200',
};

export function UserAppReadinessPanel({ report }: UserAppReadinessPanelProps) {
  return (
    <section className="grid gap-4">
      <UserAppReadinessGate report={report} />

      <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-teal-700">Phase 7G readiness</p>
            <h2 className="text-lg font-semibold text-stone-950">App 就绪度检查</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
              这里从模板包、步骤指导、本地引导、偏好、发现、会话、隐私和移动端交互做本地门禁判断。
              它只用于产品/QA 复核，不会创建生产 App、账号、后端、相机、AR 或训练数据。
            </p>
          </div>
          <span className="w-fit rounded-md bg-stone-50 px-3 py-2 text-xs text-stone-600">
            {report.schemaVersion}
          </span>
        </div>

        <div className="mt-4 grid gap-3">
          {report.checks.map((check) => (
            <article
              className="rounded-md border border-stone-200 bg-stone-50 p-3"
              key={check.checkId}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-stone-950">{check.label}</h3>
                  <p className="mt-1 text-sm leading-6 text-stone-600">{check.summary}</p>
                </div>
                <span
                  className={`w-fit rounded-md border px-2 py-1 text-xs ${checkStatusClass[check.status]}`}
                >
                  {checkStatusLabel[check.status]}
                </span>
              </div>

              <div className="mt-3 grid gap-2 text-sm text-stone-600 sm:grid-cols-2">
                {check.evidence.map((evidence) => (
                  <span className="rounded-md bg-white px-3 py-2" key={evidence}>
                    {evidence}
                  </span>
                ))}
              </div>

              {check.issues.length > 0 ? (
                <div className="mt-3 grid gap-2">
                  {check.issues.map((issue) => (
                    <p
                      className="rounded-md border border-amber-200 bg-white px-3 py-2 text-sm text-stone-700"
                      key={issue.issueId}
                    >
                      {issue.severity === 'blocking' ? '阻断' : '提醒'}：{issue.message}
                    </p>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
