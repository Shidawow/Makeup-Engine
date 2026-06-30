import type { MvpGapPrioritizationReport } from '../../template-engine';

export interface MvpGapPrioritizationPanelProps {
  report: MvpGapPrioritizationReport;
}

const priorityClass = (priority: string): string => {
  if (priority === 'p0') return 'border-rose-200 bg-rose-50 text-rose-800';
  if (priority === 'p1') return 'border-orange-200 bg-orange-50 text-orange-900';
  if (priority === 'p2') return 'border-amber-200 bg-amber-50 text-amber-900';
  return 'border-stone-200 bg-stone-50 text-stone-700';
};

export function MvpGapPrioritizationPanel({
  report,
}: MvpGapPrioritizationPanelProps) {
  return (
    <section className="rounded-lg border border-sky-200 bg-sky-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-sky-950">
            MVP Gap Prioritization
          </h2>
          <p className="mt-1 text-xs leading-5 text-sky-900">
            这是 MVP gap prioritization，不是 product roadmap final。
          </p>
          <p className="mt-1 text-xs leading-5 text-sky-900">
            这个面板只把 founder/internal feedback 分成可演示修复、后续修复和延期生产范围。
            不是 production readiness；不能 publish / registry write。
          </p>
          <p className="mt-1 text-xs leading-5 text-sky-900">
            优先级用于本地 demo 排期，不等于真实用户研究、analytics 或正式路线图。
          </p>
        </div>
        <span className="rounded-md border border-sky-200 bg-white px-2.5 py-1 text-xs font-semibold text-sky-900">
          {report.nextRecommendedPhase}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div className="rounded-md border border-sky-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Gap summary</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>Total gaps：{report.gaps.length}</p>
            <p>Top MVP gaps：{report.topMvpGaps.length}</p>
            <p>Deferred production gaps：{report.deferredProductionGaps.length}</p>
          </div>
        </div>
        <div className="rounded-md border border-sky-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Boundary</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>Production gaps current must-do：no</p>
            <p>registry chain paused after Phase 10U：yes</p>
            <p>publish：blocked</p>
          </div>
        </div>
        <div className="rounded-md border border-sky-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Scope</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>Backend / camera / AR / AI API：no</p>
            <p>Production writer：blocked</p>
            <p>User App Shell replacement：blocked</p>
          </div>
        </div>
        <div className="rounded-md border border-sky-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Round trip</h3>
          <p className="mt-2 text-xs text-stone-600">
            JSON：{report.jsonRoundTripStable ? 'stable' : 'check failed'}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {report.gaps.map((gap) => (
          <article
            className={`rounded-md border p-3 ${priorityClass(gap.priority)}`}
            key={gap.gapId}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold">{gap.title}</h3>
                <p className="mt-1 text-xs leading-5">{gap.rationale}</p>
              </div>
              <span className="rounded-md bg-white/80 px-2 py-1 text-xs font-semibold">
                {gap.priority}
              </span>
            </div>
            <div className="mt-2 grid gap-1 text-[11px] sm:grid-cols-2 lg:grid-cols-4">
              <p>priority：{gap.priority}</p>
              <p>category：{gap.category}</p>
              <p>impact：{gap.impact}</p>
              <p>effort：{gap.effort}</p>
              <p>decision：{gap.decision}</p>
              <p>recommendation：{gap.recommendation}</p>
              <p>founder decision needed：{gap.founderDecisionNeeded ? 'yes' : 'no'}</p>
              <p>MVP demo gap：{gap.isMvpDemoGap ? 'yes' : 'no'}</p>
              <p>production gap：{gap.isProductionGap ? 'yes' : 'no'}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
