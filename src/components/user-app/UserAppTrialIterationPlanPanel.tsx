import type { UserAppTrialIterationPlan } from '../../user-app';

export interface UserAppTrialIterationPlanPanelProps {
  plan: UserAppTrialIterationPlan;
}

const statusLabel: Record<UserAppTrialIterationPlan['status'], string> = {
  iteration_ready: '可进入下一轮内部试用',
  iteration_ready_with_warnings: '可计划，但有警告',
  iteration_blocked: '已阻断，先修边界',
};

export function UserAppTrialIterationPlanPanel({
  plan,
}: UserAppTrialIterationPlanPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9C iteration plan
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">试用迭代计划</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          将匿名/示例/本地复盘结论转成下一轮内容、Shell、试用包或隐私边界行动。
          这不是正式产品 roadmap，不保存真实个人身份、不上传、不训练。
        </p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-500">计划状态</p>
          <p className="mt-1 font-semibold text-stone-900">{statusLabel[plan.status]}</p>
        </div>
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-500">workstream</p>
          <p className="mt-1 font-semibold text-stone-900">{plan.workstreams.length}</p>
        </div>
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-500">下一轮</p>
          <p className="mt-1 font-semibold text-stone-900">
            {plan.nextInternalTrialReady ? '可准备' : '先完成计划'}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {plan.goals.map((goal) => (
          <article
            className="rounded-md border border-stone-200 bg-stone-50 p-3"
            key={goal.goalId}
          >
            <h3 className="text-sm font-semibold text-stone-900">{goal.title}</h3>
            <ul className="mt-2 grid gap-1 text-xs leading-5 text-stone-600">
              {goal.successCriteria.map((criterion) => (
                <li key={criterion}>{criterion}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-3">
        {plan.actions.map((action) => (
          <article
            className="rounded-md border border-teal-100 bg-teal-50 p-3"
            key={action.actionId}
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-teal-950">{action.title}</h3>
              <span className="rounded-md bg-white px-2 py-1 text-xs text-teal-900">
                {action.workstream}
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-teal-900">{action.nextStep}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-2">
        {plan.risks.map((risk) => (
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
