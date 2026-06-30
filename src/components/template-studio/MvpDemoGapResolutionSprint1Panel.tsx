import type {
  MvpDemoGapResolutionItem,
  MvpDemoGapResolutionSprint1Report,
} from '../../template-engine';

export interface MvpDemoGapResolutionSprint1PanelProps {
  report: MvpDemoGapResolutionSprint1Report;
}

const categoryLabel: Record<MvpDemoGapResolutionItem['category'], string> = {
  first_run_clarity: '首屏理解',
  trial_template_consistency: '试用模板一致性',
  trust_wording: '步骤信任文案',
  mobile_demo_usability: '移动端演示',
  operator_workflow_explanation: '后台流程说明',
};

const statusClass = (status: string): string => {
  if (status === 'not_resolved') return 'border-rose-200 bg-rose-50 text-rose-800';
  if (status === 'resolved_with_warnings') return 'border-amber-200 bg-amber-50 text-amber-900';
  if (status === 'deferred') return 'border-stone-200 bg-stone-50 text-stone-700';
  return 'border-emerald-200 bg-emerald-50 text-emerald-900';
};

function ResolutionItemCard({ item }: { item: MvpDemoGapResolutionItem }) {
  return (
    <article className={`rounded-md border p-3 ${statusClass(item.status)}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold">{categoryLabel[item.category]}</p>
          <h3 className="mt-1 text-sm font-semibold">{item.gapTitle}</h3>
        </div>
        <span className="rounded-md bg-white/80 px-2 py-1 text-xs font-semibold">
          {item.status}
        </span>
      </div>
      <p className="mt-2 text-xs leading-5">{item.resolutionSummary}</p>
      <details className="mt-2 rounded-md bg-white/70 p-2">
        <summary className="cursor-pointer text-xs font-semibold">
          变更区域 / 验收证据 / 下一步
        </summary>
        <div className="mt-2 grid gap-2 text-xs leading-5">
          <p>
            <span className="font-semibold">Changed areas：</span>
            {item.changedAreas.join('、') || '暂无'}
          </p>
          <div>
            <p className="font-semibold">Acceptance criteria</p>
            <ul className="mt-1 list-disc pl-4">
              {item.acceptanceCriteria.map((criterion) => (
                <li key={criterion}>{criterion}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold">Evidence</p>
            <ul className="mt-1 list-disc pl-4">
              {item.evidence.map((evidence) => (
                <li key={evidence.evidenceId}>
                  {evidence.label}：{evidence.detail}
                </li>
              ))}
            </ul>
          </div>
          <p>
            <span className="font-semibold">Next action：</span>
            {item.nextAction}
          </p>
        </div>
      </details>
    </article>
  );
}

export function MvpDemoGapResolutionSprint1Panel({
  report,
}: MvpDemoGapResolutionSprint1PanelProps) {
  return (
    <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-emerald-950">
            MVP Demo Gap Resolution Sprint 1
          </h2>
          <p className="mt-1 text-xs leading-5 text-emerald-900">
            13D resolution report：说明第一批 MVP demo gap 已如何落地修复。
          </p>
          <p className="mt-1 text-xs leading-5 text-emerald-900">
            当前仍是本地演示 polish，不是 production readiness；需要人工审核；
            不写 registry、不发布、不创建 production writer。
          </p>
        </div>
        <span className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${statusClass(report.status)}`}>
          {report.status}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div className="rounded-md border border-emerald-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Resolved gaps</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>Resolved：{report.resolvedItems.length}</p>
            <p>Warnings：{report.warningItems.length}</p>
            <p>Deferred：{report.deferredItems.length}</p>
          </div>
        </div>
        <div className="rounded-md border border-emerald-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Demo boundary</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>Production readiness：no</p>
            <p>Real user research：no</p>
            <p>Analytics / backend：no</p>
          </div>
        </div>
        <div className="rounded-md border border-emerald-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Registry boundary</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>registry chain paused after Phase 10U：yes</p>
            <p>registry write / publish：blocked</p>
            <p>shell replacement：blocked</p>
          </div>
        </div>
        <div className="rounded-md border border-emerald-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Next recommendation</h3>
          <p className="mt-2 text-xs leading-5 text-stone-600">
            {report.nextRecommendedPhase}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {report.items.map((item) => (
          <ResolutionItemCard item={item} key={item.itemId} />
        ))}
      </div>

      <div className="mt-4 rounded-md border border-emerald-200 bg-white p-3">
        <h3 className="text-sm font-semibold text-emerald-950">Recommendations</h3>
        <ul className="mt-2 grid gap-1 text-xs leading-5 text-stone-600">
          {report.recommendations.map((recommendation) => (
            <li key={recommendation.recommendationId}>
              {recommendation.nextPhase}：{recommendation.message}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
