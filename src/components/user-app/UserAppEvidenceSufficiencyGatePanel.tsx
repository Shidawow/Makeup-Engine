import type { UserAppEvidenceSufficiencyGate } from '../../user-app';

export interface UserAppEvidenceSufficiencyGatePanelProps {
  gate: UserAppEvidenceSufficiencyGate;
}

const decisionLabel: Record<UserAppEvidenceSufficiencyGate['decision'], string> = {
  sufficient_for_next_internal_trial: '足够进入下一轮内部试用',
  sufficient_for_mvp_validation_planning: '足够规划 MVP validation',
  insufficient_collect_more_internal_evidence: '需要更多内部证据',
  blocked_by_privacy_or_scope_issue: '隐私或范围问题阻断',
  blocked_by_missing_trial_evidence: '缺少试用证据',
};

export function UserAppEvidenceSufficiencyGatePanel({
  gate,
}: UserAppEvidenceSufficiencyGatePanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9E sufficiency gate
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">证据充分性判断</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          判断匿名/示例证据是否足够支持下一轮内部试用或 MVP validation planning。
          没有真实证据时不会过度推进；有隐私、上传或训练风险时必须阻断。
        </p>
      </div>

      <div className="mt-4 rounded-md border border-teal-100 bg-teal-50 p-3">
        <p className="text-xs font-semibold text-teal-700">判断结果</p>
        <h3 className="mt-1 text-base font-semibold text-teal-950">
          {decisionLabel[gate.decision]}
        </h3>
        <p className="mt-2 text-xs leading-5 text-teal-900">
          {gate.recommendation.message} 下一步：{gate.recommendation.nextAction}
        </p>
      </div>

      <div className="mt-4 grid gap-2">
        {gate.checks.map((check) => (
          <p
            className={`rounded-md border p-3 text-xs leading-5 ${
              check.passed
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : check.blocking
                  ? 'border-red-200 bg-red-50 text-red-900'
                  : 'border-amber-200 bg-amber-50 text-amber-900'
            }`}
            key={check.checkId}
          >
            {check.label}：{check.message}
          </p>
        ))}
      </div>

      <div className="mt-4 grid gap-2">
        {gate.risks.map((risk) => (
          <p
            className="rounded-md border border-stone-200 bg-stone-50 p-3 text-xs leading-5 text-stone-600"
            key={risk.riskId}
          >
            {risk.message} 处理方式：{risk.mitigation}
          </p>
        ))}
      </div>
    </section>
  );
}
