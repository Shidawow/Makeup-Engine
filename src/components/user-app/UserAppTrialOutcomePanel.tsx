import type { UserAppTrialOutcomeReview } from '../../user-app';

export interface UserAppTrialOutcomePanelProps {
  review: UserAppTrialOutcomeReview;
}

const decisionLabel: Record<UserAppTrialOutcomeReview['decision'], string> = {
  continue_to_more_internal_trials: '继续更多内部试用',
  revise_content_before_more_trials: '先修订内容',
  revise_shell_before_more_trials: '先修订 Shell',
  block_until_privacy_or_scope_fixed: '暂停，先修隐私或范围',
  ready_for_phase_9B: '可进入 Phase 9B',
};

export function UserAppTrialOutcomePanel({ review }: UserAppTrialOutcomePanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9A outcome review
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">试用结果复盘</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          复盘只使用 mock/example 或匿名汇总信号，不保存真实参与者记录，不写入训练数据，
          不作为正式发布或线上增长审批。
        </p>
      </div>

      <div className="mt-4 rounded-md border border-stone-200 bg-stone-50 p-3">
        <p className="text-xs font-semibold text-stone-500">当前建议</p>
        <p className="mt-1 text-base font-semibold text-stone-900">
          {decisionLabel[review.decision]}
        </p>
        <p className="mt-1 text-sm leading-6 text-stone-600">{review.summary}</p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {review.signals.map((signal) => (
          <article className="rounded-md border border-stone-200 bg-stone-50 p-3" key={signal.signalId}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-stone-900">{signal.label}</h3>
                <p className="mt-1 text-xs leading-5 text-stone-600">{signal.summary}</p>
              </div>
              <span className="w-fit rounded-md bg-white px-2 py-1 text-xs text-stone-700">
                {signal.score}/5
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-2">
        {review.recommendations.map((item) => (
          <p className="rounded-md border border-teal-100 bg-teal-50 p-3 text-sm leading-6 text-teal-950" key={item.recommendationId}>
            {item.message}
          </p>
        ))}
      </div>
    </section>
  );
}
