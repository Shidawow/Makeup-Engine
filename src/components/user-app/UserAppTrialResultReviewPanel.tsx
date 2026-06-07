import type { UserAppTrialResultReview } from '../../user-app';

export interface UserAppTrialResultReviewPanelProps {
  review: UserAppTrialResultReview;
}

const statusLabel: Record<UserAppTrialResultReview['status'], string> = {
  review_ready: '复盘框架可用',
  review_ready_with_warnings: '可复盘，但有警示',
  review_blocked: '已阻断，先修边界',
};

export function UserAppTrialResultReviewPanel({
  review,
}: UserAppTrialResultReviewPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9B result review
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">试用结果复盘框架</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          这里只展示匿名 / 示例 / 本地复盘框架，不收集真实个人身份，不上传，不训练，
          不接后端，也不用 AI 自动分析反馈。
        </p>
      </div>

      <div className="mt-4 rounded-md border border-stone-200 bg-stone-50 p-3">
        <p className="text-xs font-semibold text-stone-500">复盘状态</p>
        <p className="mt-1 text-base font-semibold text-stone-900">
          {statusLabel[review.status]}
        </p>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          {review.resultSummary.summary}
        </p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {review.signals.map((signal) => (
          <article
            className="rounded-md border border-stone-200 bg-stone-50 p-3"
            key={signal.signalId}
          >
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

      {review.issues.length > 0 ? (
        <div className="mt-4 grid gap-2">
          {review.issues.map((issue) => (
            <p
              className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950"
              key={issue.issueId}
            >
              {issue.category} / {issue.severity}：{issue.recommendation}
            </p>
          ))}
        </div>
      ) : null}
    </section>
  );
}
