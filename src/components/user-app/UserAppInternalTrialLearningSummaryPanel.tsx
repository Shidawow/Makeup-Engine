import type { UserAppInternalTrialLearningSummary } from '../../user-app';

export interface UserAppInternalTrialLearningSummaryPanelProps {
  summary: UserAppInternalTrialLearningSummary;
}

const statusLabel: Record<UserAppInternalTrialLearningSummary['status'], string> = {
  learning_summary_ready: '学习总结可用',
  learning_summary_ready_with_warnings: '学习总结有警告',
  learning_summary_blocked: '学习总结被阻断',
};

export function UserAppInternalTrialLearningSummaryPanel({
  summary,
}: UserAppInternalTrialLearningSummaryPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9D learning summary
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">试用学习总结</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          汇总 9A/9B/9C 的匿名/示例/本地信号，形成产品学习主题。
          这不是正式用户数据分析系统，不保存真实个人身份、不上传、不训练。
        </p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-500">状态</p>
          <p className="mt-1 font-semibold text-stone-900">{statusLabel[summary.status]}</p>
        </div>
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-500">主题</p>
          <p className="mt-1 font-semibold text-stone-900">{summary.themes.length}</p>
        </div>
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-500">信号</p>
          <p className="mt-1 font-semibold text-stone-900">{summary.signals.length}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {summary.insights.map((insight) => (
          <article
            className="rounded-md border border-stone-200 bg-stone-50 p-3"
            key={insight.insightId}
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-stone-900">{insight.title}</h3>
              <span className="rounded-md bg-white px-2 py-1 text-xs text-stone-600">
                {insight.theme}
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-stone-600">{insight.summary}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-2">
        {summary.risks.map((risk) => (
          <p
            className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900"
            key={risk.riskId}
          >
            {risk.message} 处理方式：{risk.mitigation}
          </p>
        ))}
      </div>
    </section>
  );
}
