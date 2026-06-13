import type { UserAppAnonymousTrialFollowUpIteration } from '../../user-app';

export interface UserAppAnonymousTrialFollowUpIterationPanelProps {
  iteration: UserAppAnonymousTrialFollowUpIteration;
}

const statusLabel: Record<UserAppAnonymousTrialFollowUpIteration['status'], string> = {
  follow_up_ready: '后续迭代就绪',
  follow_up_ready_with_warnings: '后续迭代有提醒',
  follow_up_blocked: '后续迭代被阻断',
};

const recommendationLabel: Record<UserAppAnonymousTrialFollowUpIteration['recommendation'], string> = {
  revise_launch_pack: '先修订启动包',
  revise_evidence_collection_protocol: '先修订证据收集协议',
  repeat_dry_run: '先重复 dry run',
  continue_anonymous_internal_trial: '继续匿名内部试用',
  pause_for_privacy_or_scope_fix: '因隐私或范围问题暂停',
  prepare_mvp_validation_plan_preconditions: '准备 MVP validation 前置条件',
  do_not_advance: '不要推进',
};

export function UserAppAnonymousTrialFollowUpIterationPanel({
  iteration,
}: UserAppAnonymousTrialFollowUpIterationPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9J follow-up iteration
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">
          匿名试用后续迭代
        </h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          这里把 9I 证据复盘转成下一轮保守行动。它不是 production roadmap，
          不接后端、不保存真实用户记录、不用 AI 自动分析、不写训练数据。
        </p>
      </div>

      <div className="mt-4 rounded-md border border-teal-100 bg-teal-50 p-3">
        <p className="text-xs font-semibold text-teal-700">迭代建议</p>
        <h3 className="mt-1 text-base font-semibold text-teal-950">
          {recommendationLabel[iteration.recommendation]}
        </h3>
        <p className="mt-2 text-xs leading-5 text-teal-900">
          状态：{statusLabel[iteration.status]}。仍然只允许匿名、本地、聚合摘要。
        </p>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">后续目标</h3>
          <div className="mt-2 grid gap-2">
            {iteration.goals.map((goal) => (
              <p
                className="rounded-md border border-blue-200 bg-blue-50 p-3 text-xs leading-5 text-blue-900"
                key={goal.goalId}
              >
                <span className="font-semibold">{goal.label}</span>：{goal.summary}
              </p>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-stone-800">行动项</h3>
          <div className="mt-2 grid gap-2">
            {iteration.actions.map((action) => (
              <p
                className={`rounded-md border p-3 text-xs leading-5 ${
                  action.blocksNextAnonymousTrial
                    ? 'border-red-200 bg-red-50 text-red-900'
                    : action.blocksMvpValidationPreconditions
                      ? 'border-amber-200 bg-amber-50 text-amber-900'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-900'
                }`}
                key={action.actionId}
              >
                <span className="font-semibold">{action.label}</span>：
                {action.summary} {action.completed ? '已完成。' : '待完成。'}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
