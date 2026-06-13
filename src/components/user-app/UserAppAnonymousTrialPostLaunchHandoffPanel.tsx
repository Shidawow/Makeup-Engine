import type { UserAppAnonymousTrialPostLaunchHandoff } from '../../user-app';

export interface UserAppAnonymousTrialPostLaunchHandoffPanelProps {
  handoff: UserAppAnonymousTrialPostLaunchHandoff;
}

const statusLabel: Record<UserAppAnonymousTrialPostLaunchHandoff['status'], string> = {
  post_launch_handoff_ready: 'handoff 已准备好',
  post_launch_handoff_ready_with_gaps: 'handoff 有证据缺口',
  post_launch_handoff_stopped: 'handoff 因停止原因阻断',
};

export function UserAppAnonymousTrialPostLaunchHandoffPanel({
  handoff,
}: UserAppAnonymousTrialPostLaunchHandoffPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9H post-launch handoff
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">
          试用后 handoff
        </h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          这里是匿名内部试用后的交接模板，只交接匿名摘要、证据缺口、停止原因和下一步复盘建议。
          不保存真实身份、不上传、不训练。
        </p>
      </div>

      <div className="mt-4 rounded-md border border-teal-100 bg-teal-50 p-3">
        <p className="text-xs font-semibold text-teal-700">handoff 状态</p>
        <h3 className="mt-1 text-base font-semibold text-teal-950">
          {statusLabel[handoff.status]}
        </h3>
        <p className="mt-2 text-xs leading-5 text-teal-900">
          {handoff.recommendation.message} 下一步：{handoff.recommendation.nextAction}
        </p>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">匿名证据交接</h3>
          <div className="mt-2 grid gap-2">
            {handoff.evidenceHandoff.anonymousEvidenceCollected.map((item) => (
              <p
                className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900"
                key={item}
              >
                {item}
              </p>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-stone-800">缺口 / 停止原因</h3>
          <div className="mt-2 grid gap-2">
            {handoff.evidenceHandoff.evidenceGaps.length > 0 ? (
              handoff.evidenceHandoff.evidenceGaps.map((gap) => (
                <p
                  className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900"
                  key={gap}
                >
                  {gap}
                </p>
              ))
            ) : (
              <p className="rounded-md border border-stone-200 bg-stone-50 p-3 text-xs text-stone-600">
                当前模板未记录证据缺口。
              </p>
            )}
            {handoff.evidenceHandoff.stoppedSessionReason ? (
              <p className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-900">
                停止原因：{handoff.evidenceHandoff.stoppedSessionReason}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">复盘步骤</h3>
          <div className="mt-2 grid gap-2">
            {handoff.reviewSteps.map((step) => (
              <p
                className={`rounded-md border p-3 text-xs leading-5 ${
                  step.completed
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    : 'border-amber-200 bg-amber-50 text-amber-900'
                }`}
                key={step.stepId}
              >
                {step.label}（{step.owner}）
              </p>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-stone-800">风险</h3>
          <div className="mt-2 grid gap-2">
            {handoff.risks.length > 0 ? (
              handoff.risks.map((risk) => (
                <p
                  className="rounded-md border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-900"
                  key={risk.riskId}
                >
                  {risk.message} 处理：{risk.mitigation}
                </p>
              ))
            ) : (
              <p className="rounded-md border border-stone-200 bg-stone-50 p-3 text-xs text-stone-600">
                当前模板没有阻断风险。
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
