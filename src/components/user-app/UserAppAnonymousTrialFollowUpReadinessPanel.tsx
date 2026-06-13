import type { UserAppAnonymousTrialFollowUpReadiness } from '../../user-app';

export interface UserAppAnonymousTrialFollowUpReadinessPanelProps {
  readiness: UserAppAnonymousTrialFollowUpReadiness;
}

const decisionLabel: Record<UserAppAnonymousTrialFollowUpReadiness['decision'], string> = {
  ready_for_next_anonymous_internal_trial: '可以进入下一轮匿名内部试用',
  ready_with_warnings: '可带提醒继续',
  repeat_dry_run_before_trial: '先重复 dry run',
  revise_protocol_before_trial: '先修订协议',
  revise_launch_pack_before_trial: '先修订启动包',
  pause_for_privacy_or_scope_fix: '因隐私或范围问题暂停',
  ready_for_mvp_validation_preconditions: '可准备 MVP validation 前置条件',
  do_not_advance: '不要推进',
};

export function UserAppAnonymousTrialFollowUpReadinessPanel({
  readiness,
}: UserAppAnonymousTrialFollowUpReadinessPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9J follow-up readiness
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">
          后续试用就绪度
        </h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          这是进入下一轮匿名内部试用或准备 MVP validation 前置条件前的本地质量门。
          不保存真实个人身份、不上传、不训练、不收集照片。
        </p>
      </div>

      <div className="mt-4 rounded-md border border-teal-100 bg-teal-50 p-3">
        <p className="text-xs font-semibold text-teal-700">就绪度结论</p>
        <h3 className="mt-1 text-base font-semibold text-teal-950">
          {decisionLabel[readiness.decision]}
        </h3>
        <p className="mt-2 text-xs leading-5 text-teal-900">
          生产 App、公开招募、后端、上传、AI 分析和训练仍然不在本阶段启动。
        </p>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">检查项</h3>
          <div className="mt-2 grid gap-2">
            {readiness.checks.map((check) => (
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
                <span className="font-semibold">{check.label}</span>：{check.message}
              </p>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-stone-800">建议 / 风险</h3>
          <div className="mt-2 grid gap-2">
            {readiness.recommendations.map((recommendation) => (
              <p
                className="rounded-md border border-blue-200 bg-blue-50 p-3 text-xs leading-5 text-blue-900"
                key={recommendation.recommendationId}
              >
                {recommendation.nextAction}
              </p>
            ))}
            {readiness.risks.map((risk) => (
              <p
                className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900"
                key={risk.riskId}
              >
                {risk.message} 处理：{risk.mitigation}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
