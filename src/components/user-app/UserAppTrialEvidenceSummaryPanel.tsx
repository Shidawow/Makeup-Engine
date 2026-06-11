import type { UserAppTrialEvidenceSummary } from '../../user-app';

export interface UserAppTrialEvidenceSummaryPanelProps {
  evidenceSummary: UserAppTrialEvidenceSummary;
}

export function UserAppTrialEvidenceSummaryPanel({
  evidenceSummary,
}: UserAppTrialEvidenceSummaryPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9E evidence summary
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">试用证据摘要</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          按用户价值、模板内容、Shell、隐私信任、试用流程和决策准备整理证据主题。
          只用于本地管理员复盘，不接后端、不写训练数据。
        </p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-500">主题覆盖</p>
          <p className="mt-1 font-semibold text-stone-900">
            {evidenceSummary.themes.length}
          </p>
        </div>
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-500">证据缺口</p>
          <p className="mt-1 font-semibold text-stone-900">{evidenceSummary.gaps.length}</p>
        </div>
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-500">建议</p>
          <p className="mt-1 font-semibold text-stone-900">
            {evidenceSummary.recommendations.length}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {evidenceSummary.insights.map((insight) => (
          <article
            className="rounded-md border border-stone-200 bg-stone-50 p-3"
            key={insight.insightId}
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-stone-900">{insight.title}</h3>
              <span className="rounded-md bg-white px-2 py-1 text-xs text-stone-600">
                {insight.evidenceIds.length} 条
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-stone-600">{insight.summary}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-2">
        {evidenceSummary.gaps.map((gap) => (
          <p
            className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900"
            key={gap.gapId}
          >
            {gap.message}
            {gap.blocksMvpValidationPlanning ? ' 当前不能直接进入 MVP validation planning。' : ''}
          </p>
        ))}
      </div>
    </section>
  );
}
