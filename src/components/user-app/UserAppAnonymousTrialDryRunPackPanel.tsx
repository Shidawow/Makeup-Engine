import type { UserAppAnonymousTrialDryRunPack } from '../../user-app';

export interface UserAppAnonymousTrialDryRunPackPanelProps {
  pack: UserAppAnonymousTrialDryRunPack;
}

const statusLabel: Record<UserAppAnonymousTrialDryRunPack['status'], string> = {
  dry_run_ready: 'dry run 已准备好',
  dry_run_ready_with_warnings: 'dry run 有提醒',
  dry_run_blocked: 'dry run 被阻断',
};

export function UserAppAnonymousTrialDryRunPackPanel({
  pack,
}: UserAppAnonymousTrialDryRunPackPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9G anonymous internal trial dry run
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">
          匿名内部试用 dry run
        </h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          这是匿名 / 本地 / 演练阶段，不是真实试用正式开始。管理员只演练流程和匿名记录，
          不保存真实个人身份、不上传、不训练、不收集照片。
        </p>
      </div>

      <div className="mt-4 rounded-md border border-teal-100 bg-teal-50 p-3">
        <p className="text-xs font-semibold text-teal-700">演练状态</p>
        <h3 className="mt-1 text-base font-semibold text-teal-950">
          {statusLabel[pack.status]}
        </h3>
        <p className="mt-2 text-xs leading-5 text-teal-900">
          {pack.participantNotice?.copy ?? '缺少参与者说明，不能开始 dry run。'}
        </p>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">演练场景</h3>
          <div className="mt-2 grid gap-2">
            {pack.scenarios.map((scenario) => (
              <div
                className={`rounded-md border p-3 text-xs leading-5 ${
                  scenario.ready
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    : 'border-amber-200 bg-amber-50 text-amber-900'
                }`}
                key={scenario.scenarioId}
              >
                <p className="font-semibold">{scenario.label}</p>
                <p>{scenario.objective}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-stone-800">允许记录</h3>
          <div className="mt-2 grid gap-2">
            {pack.allowedEvidence.map((item) => (
              <p
                className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs leading-5 text-emerald-900"
                key={item.evidenceId}
              >
                {item.label}：{item.description}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">禁止记录</h3>
          <div className="mt-2 grid gap-2">
            {pack.forbiddenData.map((item) => (
              <p
                className={`rounded-md border p-3 text-xs leading-5 ${
                  item.requested
                    ? 'border-red-200 bg-red-50 text-red-900'
                    : 'border-stone-200 bg-stone-50 text-stone-600'
                }`}
                key={item.dataId}
              >
                {item.label}：{item.reason}
                {item.requested ? ' 当前请求会阻断 dry run。' : ''}
              </p>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-stone-800">停止条件</h3>
          <div className="mt-2 grid gap-2">
            {pack.stopConditions.map((condition) => (
              <p
                className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900"
                key={condition.conditionId}
              >
                {condition.label}：{condition.trigger} 处理：{condition.action}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
