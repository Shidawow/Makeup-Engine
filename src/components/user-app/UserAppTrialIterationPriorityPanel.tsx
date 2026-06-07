import type { UserAppTrialIterationPriorityRecommendation } from '../../user-app';

export interface UserAppTrialIterationPriorityPanelProps {
  recommendations: UserAppTrialIterationPriorityRecommendation[];
}

const priorityLabel: Record<UserAppTrialIterationPriorityRecommendation['priority'], string> = {
  p0_blocker: 'P0 阻断',
  p1_high: 'P1 高优先级',
  p2_medium: 'P2 中优先级',
  p3_low: 'P3 低优先级',
  observe_more: '继续观察',
};

export function UserAppTrialIterationPriorityPanel({
  recommendations,
}: UserAppTrialIterationPriorityPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9C iteration priority
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">优先级建议</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          这里只展示匿名/示例/本地迭代优先级，不保存真实个人身份、不上传、不训练。
          隐私或范围边界问题必须先进入 P0 阻断。
        </p>
      </div>

      <div className="mt-4 grid gap-3">
        {recommendations.length === 0 ? (
          <p className="rounded-md border border-teal-100 bg-teal-50 p-3 text-sm leading-6 text-teal-950">
            当前没有立即修复项，可继续小范围内部试用并观察。
          </p>
        ) : (
          recommendations.map((item) => (
            <article
              className="rounded-md border border-stone-200 bg-stone-50 p-3"
              key={item.recommendationId}
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-stone-900">
                  {priorityLabel[item.priority]}
                </h3>
                <span className="rounded-md bg-white px-2 py-1 text-xs text-stone-700">
                  {item.issueCategory}
                </span>
                <span className="rounded-md bg-white px-2 py-1 text-xs text-stone-700">
                  {item.severity}
                </span>
                <span className="rounded-md bg-white px-2 py-1 text-xs text-stone-700">
                  {item.score.confidence}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-stone-600">{item.score.reason}</p>
              <p className="mt-2 text-xs leading-5 text-teal-800">{item.nextAction}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
