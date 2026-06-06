import type { UserAppInternalTrialOpsPack } from '../../user-app';

export interface UserAppInternalTrialOpsPanelProps {
  pack: UserAppInternalTrialOpsPack;
}

const statusLabel: Record<UserAppInternalTrialOpsPack['status'], string> = {
  ready_for_internal_trial_ops: '可准备内部试用',
  ready_with_warnings: '可准备但需补提醒',
  blocked: '阻断试用准备',
};

const participantLabel: Record<UserAppInternalTrialOpsPack['participantTypes'][number], string> = {
  complete_beginner: '完全新手',
  light_makeup_user: '轻度化妆用户',
  frequent_makeup_user: '高频化妆用户',
  beauty_advisor_or_makeup_reviewer: '懂妆 reviewer',
  internal_product_reviewer: '内部产品 reviewer',
};

export function UserAppInternalTrialOpsPanel({ pack }: UserAppInternalTrialOpsPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">
            Phase 9A Internal Trial Operations
          </p>
          <h2 className="mt-1 text-lg font-semibold text-stone-950">内部试用运营</h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            这是一份管理员运营准备包，用来组织内部小范围试用。它不是正式发布，
            不收集照片、不上传、不训练、不收集真实姓名、联系方式、健康或敏感身份信息。
          </p>
        </div>
        <span className="w-fit rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-xs text-teal-800">
          {statusLabel[pack.status]}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
        <p className="rounded-md bg-stone-50 p-3">
          参与者类型：{pack.participantTypes.length}
        </p>
        <p className="rounded-md bg-stone-50 p-3">
          流程时长：约 {pack.sessionPlan.estimatedMinutes} 分钟
        </p>
        <p className="rounded-md bg-stone-50 p-3">问题：{pack.issues.length}</p>
      </div>

      <div className="mt-4 rounded-md border border-teal-200 bg-teal-50 p-3 text-sm leading-6 text-teal-950">
        参与者只按类型筛选，不记录真实身份：{pack.participantTypes.map((type) => participantLabel[type]).join('、')}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <article className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <h3 className="font-semibold text-stone-950">{pack.sessionPlan.title}</h3>
          <ol className="mt-2 grid gap-2 text-sm leading-6 text-stone-600">
            {pack.sessionPlan.steps.map((step, index) => (
              <li key={step}>{index + 1}. {step}</li>
            ))}
          </ol>
        </article>

        <article className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <h3 className="font-semibold text-stone-950">{pack.executionChecklist.title}</h3>
          <ul className="mt-2 grid gap-2 text-sm leading-6 text-stone-600">
            {pack.executionChecklist.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {pack.risks.map((risk) => (
          <article className="rounded-md border border-amber-200 bg-amber-50 p-3" key={risk.riskId}>
            <h3 className="text-sm font-semibold text-amber-950">{risk.label}</h3>
            <p className="mt-1 text-xs leading-5 text-amber-900">暂停条件：{risk.stopCondition}</p>
            <p className="mt-1 text-xs leading-5 text-amber-900">处理：{risk.mitigation}</p>
          </article>
        ))}
      </div>

      {pack.issues.length > 0 ? (
        <div className="mt-4 grid gap-2">
          {pack.issues.map((issue) => (
            <p className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-950" key={issue.issueId}>
              {issue.severity === 'blocking' ? '阻断' : '提醒'}：{issue.message}
            </p>
          ))}
        </div>
      ) : null}
    </section>
  );
}
