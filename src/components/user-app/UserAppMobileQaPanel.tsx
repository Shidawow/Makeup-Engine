import type { UserAppMobileQaResult } from '../../user-app';

export interface UserAppMobileQaPanelProps {
  result: UserAppMobileQaResult;
}

const statusLabel: Record<UserAppMobileQaResult['status'], string> = {
  passed: '通过',
  warning: '有提醒',
  blocked: '阻断',
};

const statusClass: Record<UserAppMobileQaResult['checks'][number]['status'], string> = {
  passed: 'border-teal-200 bg-teal-50 text-teal-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  blocked: 'border-rose-200 bg-rose-50 text-rose-800',
};

export function UserAppMobileQaPanel({ result }: UserAppMobileQaPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">Mobile QA</p>
          <h2 className="text-lg font-semibold text-stone-950">移动端交互 QA</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
            检查窄屏布局、触控尺寸、核心入口、步骤指导、空状态、阻断状态、本地会话和隐私边界。
            当前是确定性清单检查，不依赖真实浏览器自动化。
          </p>
        </div>
        <span className="w-fit rounded-md bg-stone-50 px-3 py-2 text-xs text-stone-600">
          {statusLabel[result.status]}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-4">
        {result.viewportProfiles.map((viewport) => (
          <div className="rounded-md bg-stone-50 p-3" key={viewport.viewportId}>
            <span className="block text-xs text-stone-500">{viewport.label}</span>
            <span className="mt-1 block font-semibold text-stone-900">
              {viewport.width} x {viewport.height}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3">
        {result.checks.map((check) => (
          <article className="rounded-md border border-stone-200 bg-stone-50 p-3" key={check.checkId}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="font-semibold text-stone-950">{check.label}</h3>
                <p className="mt-1 text-sm leading-6 text-stone-600">{check.description}</p>
              </div>
              <span className={`w-fit rounded-md border px-2 py-1 text-xs ${statusClass[check.status]}`}>
                {check.status === 'passed' ? '通过' : check.status === 'warning' ? '提醒' : '阻断'}
              </span>
            </div>
            <p className="mt-2 text-sm text-stone-600">{check.evidence[0]}</p>
            <p className="mt-1 text-xs text-stone-500">建议：{check.recommendation}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
