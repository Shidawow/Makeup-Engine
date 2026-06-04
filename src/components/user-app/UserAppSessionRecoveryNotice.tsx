import type { UserAppSessionRecoveryReport } from '../../user-app';

export interface UserAppSessionRecoveryNoticeProps {
  report?: UserAppSessionRecoveryReport | null;
}

const statusLabel: Record<UserAppSessionRecoveryReport['status'], string> = {
  restored: '本地状态已恢复',
  partially_restored: '本地状态已部分恢复',
  reset: '本地状态已重置',
  blocked: '暂不能恢复步骤指导',
};

export function UserAppSessionRecoveryNotice({
  report,
}: UserAppSessionRecoveryNoticeProps) {
  if (!report) {
    return (
      <section className="rounded-lg border border-stone-200 bg-white p-4 text-sm text-stone-600">
        <p className="font-semibold text-stone-900">本地状态恢复</p>
        <p className="mt-1">当前没有需要展示的恢复提示。</p>
      </section>
    );
  }

  const tone =
    report.status === 'blocked'
      ? 'border-rose-200 bg-rose-50 text-rose-900'
      : report.status === 'partially_restored'
        ? 'border-amber-200 bg-amber-50 text-amber-900'
        : 'border-teal-200 bg-teal-50 text-teal-900';

  return (
    <section className={`rounded-lg border p-4 ${tone}`}>
      <p className="text-xs font-semibold uppercase">Session recovery</p>
      <h3 className="mt-1 text-base font-semibold">{statusLabel[report.status]}</h3>
      <p className="mt-2 text-sm leading-6">
        {report.canRestoreStepGuide
          ? '刷新后可以继续使用当前模板和步骤进度。'
          : '当前只恢复安全的本地状态，步骤指导需要重新确认模板兼容性后再开始。'}
      </p>

      {report.warnings.length > 0 || report.issues.length > 0 ? (
        <ul className="mt-3 grid gap-2 text-sm">
          {report.warnings.map((warning) => (
            <li className="rounded-md bg-white/70 px-3 py-2" key={warning.code}>
              {warning.message}
            </li>
          ))}
          {report.issues.map((issue) => (
            <li className="rounded-md bg-white/70 px-3 py-2" key={`${issue.code}-${issue.message}`}>
              {issue.message}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
