import type { UserAppReadinessReport } from '../../user-app';

export interface UserAppReadinessGateProps {
  report: UserAppReadinessReport;
}

const statusTone: Record<UserAppReadinessReport['status'], string> = {
  ready_for_app_prototype: 'border-teal-200 bg-teal-50 text-teal-950',
  ready_with_warnings: 'border-amber-200 bg-amber-50 text-amber-950',
  needs_qa_hardening: 'border-orange-200 bg-orange-50 text-orange-950',
  blocked: 'border-rose-200 bg-rose-50 text-rose-950',
};

const statusLabel: Record<UserAppReadinessReport['status'], string> = {
  ready_for_app_prototype: '可以进入 App 原型',
  ready_with_warnings: '可进入，但需跟踪提醒',
  needs_qa_hardening: '需要移动端 QA 加固',
  blocked: '阻断',
};

export function UserAppReadinessGate({ report }: UserAppReadinessGateProps) {
  const blockingCount = report.issues.filter((issue) => issue.severity === 'blocking').length;
  const warningCount = report.issues.filter((issue) => issue.severity === 'warning').length;

  return (
    <section className={`rounded-lg border p-4 ${statusTone[report.status]}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide">App readiness gate</p>
          <h3 className="mt-1 text-lg font-semibold">{statusLabel[report.status]}</h3>
          <p className="mt-2 text-sm leading-6">{report.summary}</p>
        </div>
        <div className="rounded-md bg-white/80 px-3 py-2 text-sm font-semibold">
          {report.gateLabel}
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
        <div className="rounded-md bg-white/75 p-3">
          <span className="block text-xs opacity-75">检查项</span>
          <span className="mt-1 block font-semibold">{report.checks.length}</span>
        </div>
        <div className="rounded-md bg-white/75 p-3">
          <span className="block text-xs opacity-75">提醒</span>
          <span className="mt-1 block font-semibold">{warningCount}</span>
        </div>
        <div className="rounded-md bg-white/75 p-3">
          <span className="block text-xs opacity-75">阻断</span>
          <span className="mt-1 block font-semibold">{blockingCount}</span>
        </div>
      </div>

      <p className="mt-3 text-xs leading-5 opacity-80">
        这是本地 QA 门禁，不是生产 App 发布；不会启用后端、相机、AR、训练或外部 API。
      </p>
    </section>
  );
}
