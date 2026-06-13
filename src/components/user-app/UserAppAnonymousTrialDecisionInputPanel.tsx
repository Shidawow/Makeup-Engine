import type { UserAppAnonymousTrialDecisionInput } from '../../user-app';

export interface UserAppAnonymousTrialDecisionInputPanelProps {
  decisionInput: UserAppAnonymousTrialDecisionInput;
}

const recommendationLabel: Record<UserAppAnonymousTrialDecisionInput['recommendation'], string> = {
  continue_anonymous_internal_trial: '继续匿名内部试用',
  repeat_anonymous_internal_trial: '重复匿名内部试用',
  revise_launch_pack: '修订启动包',
  revise_evidence_collection_protocol: '修订证据收集协议',
  pause_for_privacy_or_scope_fix: '因隐私或范围问题暂停',
  prepare_mvp_validation_plan: '准备 MVP validation plan',
  do_not_advance: '不要推进',
};

export function UserAppAnonymousTrialDecisionInputPanel({
  decisionInput,
}: UserAppAnonymousTrialDecisionInputPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9I decision input
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">
          下一步决策输入
        </h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          这里把匿名内部试用证据复盘转成产品下一步输入。它不是 production analytics，
          不接后端、不保存真实用户记录、不用 AI 自动分析、不写训练数据。
        </p>
      </div>

      <div className="mt-4 rounded-md border border-teal-100 bg-teal-50 p-3">
        <p className="text-xs font-semibold text-teal-700">建议结论</p>
        <h3 className="mt-1 text-base font-semibold text-teal-950">
          {recommendationLabel[decisionInput.recommendation]}
        </h3>
        <p className="mt-2 text-xs leading-5 text-teal-900">
          {decisionInput.nextAction}
        </p>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">学习信号</h3>
          <div className="mt-2 grid gap-2">
            {decisionInput.signals.map((signal) => (
              <p
                className="rounded-md border border-blue-200 bg-blue-50 p-3 text-xs leading-5 text-blue-900"
                key={signal.signalId}
              >
                <span className="font-semibold">{signal.label}</span>（{signal.strength}）：
                {signal.summary}
                {signal.supportsMvpValidationPlanning
                  ? ' 可支持 MVP validation planning 输入。'
                  : ' 不能单独支持 MVP validation planning。'}
              </p>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-stone-800">决策风险</h3>
          <div className="mt-2 grid gap-2">
            {decisionInput.risks.length > 0 ? (
              decisionInput.risks.map((risk) => (
                <p
                  className={`rounded-md border p-3 text-xs leading-5 ${
                    risk.severity === 'critical' || risk.severity === 'high'
                      ? 'border-red-200 bg-red-50 text-red-900'
                      : 'border-amber-200 bg-amber-50 text-amber-900'
                  }`}
                  key={risk.riskId}
                >
                  {risk.message} 处理：{risk.mitigation}
                </p>
              ))
            ) : (
              <p className="rounded-md border border-stone-200 bg-stone-50 p-3 text-xs text-stone-600">
                当前决策输入没有阻断风险。
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
