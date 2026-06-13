import type { UserAppAnonymousTrialGapActionPlan } from '../../user-app';

export interface UserAppAnonymousTrialGapActionPlanPanelProps {
  actionPlan: UserAppAnonymousTrialGapActionPlan;
}

const priorityLabel: Record<UserAppAnonymousTrialGapActionPlan['actions'][number]['priority'], string> = {
  p0_privacy_blocker: 'P0 隐私 blocker',
  p1_required_before_next_trial: 'P1 下一轮前必须修',
  p2_should_fix: 'P2 应修复',
  p3_observe: 'P3 继续观察',
  no_action: '无需行动',
};

export function UserAppAnonymousTrialGapActionPlanPanel({
  actionPlan,
}: UserAppAnonymousTrialGapActionPlanPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9J gap action plan
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">
          证据缺口行动计划
        </h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          这是匿名 / 内部 / 本地 / 后续迭代计划。它只把证据缺口转成管理员行动项，
          不保存真实个人身份、不上传、不训练、不收集照片。
        </p>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {actionPlan.actions.map((action) => (
          <div
            className={`rounded-md border p-3 ${
              action.priority === 'p0_privacy_blocker'
                ? 'border-red-200 bg-red-50 text-red-900'
                : action.priority === 'p1_required_before_next_trial'
                  ? 'border-amber-200 bg-amber-50 text-amber-900'
                  : 'border-blue-200 bg-blue-50 text-blue-900'
            }`}
            key={action.actionId}
          >
            <p className="text-xs font-semibold">{priorityLabel[action.priority]}</p>
            <h3 className="mt-1 text-sm font-semibold">{action.label}</h3>
            <p className="mt-2 text-xs leading-5">
              负责人范围：{action.ownerArea}。{action.recommendedFix}
            </p>
            <div className="mt-2 grid gap-1">
              {action.acceptanceCriteria.map((criteria) => (
                <p className="text-xs leading-5" key={criteria.criteriaId}>
                  {criteria.satisfied ? '已满足' : '待满足'}：{criteria.label}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
