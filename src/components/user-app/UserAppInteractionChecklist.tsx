import type { UserAppMobileQaCheck, UserAppReadinessReport } from '../../user-app';

export interface UserAppInteractionChecklistProps {
  mobileChecks: UserAppMobileQaCheck[];
  readinessReport: UserAppReadinessReport;
}

const toLabel = (status: UserAppMobileQaCheck['status']): string =>
  status === 'passed' ? '通过' : status === 'warning' ? '提醒' : '阻断';

export function UserAppInteractionChecklist({
  mobileChecks,
  readinessReport,
}: UserAppInteractionChecklistProps) {
  const requiredChecks = mobileChecks.filter((check) => check.required);
  const optionalChecks = mobileChecks.filter((check) => !check.required);

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">Interaction checklist</p>
          <h2 className="text-lg font-semibold text-stone-950">交互检查清单</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
            QA 可以按这份清单检查手机端主流程：选择模板、进入步骤、查看提醒、保存/恢复本地状态、
            处理空状态和阻断状态。清单只读本地 contract 和状态，不写真实用户数据。
          </p>
        </div>
        <span className="w-fit rounded-md bg-stone-50 px-3 py-2 text-xs text-stone-600">
          {readinessReport.gateLabel}
        </span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-stone-950">必测项</h3>
          <div className="mt-2 grid gap-2">
            {requiredChecks.map((check) => (
              <div className="rounded-md border border-stone-200 bg-stone-50 p-3" key={check.checkId}>
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-stone-900">{check.label}</p>
                  <span className="rounded-md bg-white px-2 py-1 text-xs text-stone-600">
                    {toLabel(check.status)}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-6 text-stone-600">{check.recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-stone-950">补充项</h3>
          <div className="mt-2 grid gap-2">
            {optionalChecks.map((check) => (
              <div className="rounded-md border border-stone-200 bg-stone-50 p-3" key={check.checkId}>
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-stone-900">{check.label}</p>
                  <span className="rounded-md bg-white px-2 py-1 text-xs text-stone-600">
                    {toLabel(check.status)}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-6 text-stone-600">{check.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-md border border-teal-200 bg-teal-50 p-3 text-sm leading-6 text-teal-900">
            下一步：阻断项为 0 后，可以用真实手机或浏览器窄屏继续人工验收；不要把本地 shell 当作生产 App 发布。
          </div>
        </div>
      </div>
    </section>
  );
}
