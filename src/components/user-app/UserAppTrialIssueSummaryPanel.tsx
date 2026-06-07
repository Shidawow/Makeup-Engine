import type { UserAppTrialIssueSummary } from '../../user-app';

export interface UserAppTrialIssueSummaryPanelProps {
  summary: UserAppTrialIssueSummary;
}

const statusLabel: Record<UserAppTrialIssueSummary['status'], string> = {
  summary_ready: '问题汇总可用',
  summary_ready_with_warnings: '有可修订问题',
  summary_blocked: '发现阻断边界',
};

export function UserAppTrialIssueSummaryPanel({
  summary,
}: UserAppTrialIssueSummaryPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9B issue taxonomy
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">问题分类汇总</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          将匿名试用信号分为内容问题、Shell 体验问题、隐私边界问题和试用流程问题。
          这不是用户数据库，不保存真实试用记录，不写入训练数据。
        </p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-500">汇总状态</p>
          <p className="mt-1 font-semibold text-stone-900">{statusLabel[summary.status]}</p>
        </div>
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-500">信号数</p>
          <p className="mt-1 font-semibold text-stone-900">{summary.signalsReviewed}</p>
        </div>
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-500">问题数</p>
          <p className="mt-1 font-semibold text-stone-900">{summary.issues.length}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {summary.issues.length === 0 ? (
          <p className="rounded-md border border-teal-100 bg-teal-50 p-3 text-sm leading-6 text-teal-950">
            当前匿名示例信号没有形成阻断或明确修订问题。
          </p>
        ) : (
          summary.issues.map((issue) => (
            <article
              className="rounded-md border border-stone-200 bg-stone-50 p-3"
              key={issue.issueId}
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-stone-900">{issue.title}</h3>
                <span className="rounded-md bg-white px-2 py-1 text-xs text-stone-700">
                  {issue.severity}
                </span>
                <span className="rounded-md bg-white px-2 py-1 text-xs text-stone-700">
                  {issue.actionability}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-stone-600">{issue.summary}</p>
              <p className="mt-2 text-xs leading-5 text-teal-800">{issue.recommendation}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
