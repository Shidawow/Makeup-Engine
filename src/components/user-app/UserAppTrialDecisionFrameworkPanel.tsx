import type { UserAppTrialDecisionFramework } from '../../user-app';

export interface UserAppTrialDecisionFrameworkPanelProps {
  framework: UserAppTrialDecisionFramework;
}

const decisionLabel: Record<UserAppTrialDecisionFramework['decision'], string> = {
  continue_internal_trials: '继续内部试用',
  revise_template_content: '先修订模板内容',
  revise_user_app_shell: '先修订 App Shell',
  revise_trial_pack: '先修订试用包',
  pause_for_privacy_or_scope_fix: '暂停，先修隐私或范围',
  ready_for_phase_9C: '可进入 Phase 9C',
};

const statusLabel: Record<UserAppTrialDecisionFramework['status'], string> = {
  decision_ready: '决策建议可用',
  decision_needs_more_trials: '需要更多匿名信号',
  decision_blocked: '已阻断',
};

export function UserAppTrialDecisionFrameworkPanel({
  framework,
}: UserAppTrialDecisionFrameworkPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9B decision framework
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">下一步决策框架</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          根据匿名示例复盘信号判断继续试用、修模板内容、修 Shell、修试用包、
          暂停修边界，或进入 Phase 9C。这里不上传、不训练、不做真实用户数据分析。
        </p>
      </div>

      <div className="mt-4 rounded-md border border-stone-200 bg-stone-50 p-3">
        <p className="text-xs font-semibold text-stone-500">当前决策</p>
        <p className="mt-1 text-base font-semibold text-stone-900">
          {decisionLabel[framework.decision]}
        </p>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          {statusLabel[framework.status]}
        </p>
      </div>

      <div className="mt-4 grid gap-2">
        {framework.rationale.map((item) => (
          <p
            className="rounded-md border border-stone-200 bg-stone-50 p-3 text-sm leading-6 text-stone-700"
            key={item}
          >
            {item}
          </p>
        ))}
      </div>

      <div className="mt-4 grid gap-2">
        {framework.recommendations.map((item) => (
          <p
            className="rounded-md border border-teal-100 bg-teal-50 p-3 text-sm leading-6 text-teal-950"
            key={item.recommendationId}
          >
            {item.message}
          </p>
        ))}
      </div>
    </section>
  );
}
