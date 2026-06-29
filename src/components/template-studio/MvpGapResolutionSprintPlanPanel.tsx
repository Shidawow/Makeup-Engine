import type {
  MvpGapResolutionSprintItem,
  MvpGapResolutionSprintPlanReport,
  MvpGapResolutionSprintValidationResult,
} from '../../template-engine';

export interface MvpGapResolutionSprintPlanPanelProps {
  plan: MvpGapResolutionSprintPlanReport;
  validation: MvpGapResolutionSprintValidationResult;
}

const priorityClass = (priority: string): string => {
  if (priority === 'p0') return 'border-rose-200 bg-rose-50 text-rose-800';
  if (priority === 'p1') return 'border-orange-200 bg-orange-50 text-orange-900';
  if (priority === 'p2') return 'border-amber-200 bg-amber-50 text-amber-900';
  return 'border-stone-200 bg-stone-50 text-stone-700';
};

function SprintItemCard({ item }: { item: MvpGapResolutionSprintItem }) {
  return (
    <article className={`rounded-md border p-3 ${priorityClass(item.priority)}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">{item.title}</h3>
          <p className="mt-1 text-xs leading-5">{item.problemStatement}</p>
        </div>
        <span className="rounded-md bg-white/80 px-2 py-1 text-xs font-semibold">
          {item.sprintDecision}
        </span>
      </div>
      <div className="mt-2 grid gap-1 text-[11px] sm:grid-cols-2 lg:grid-cols-4">
        <p>priority：{item.priority}</p>
        <p>impact：{item.impact}</p>
        <p>effort：{item.effort}</p>
        <p>owner：{item.ownerRole}</p>
        <p>category：{item.category}</p>
        <p>founder decision：{item.founderDecisionRequired ? 'required' : 'no'}</p>
      </div>
      <details className="mt-2 rounded-md bg-white/70 p-2">
        <summary className="cursor-pointer text-xs font-semibold">
          Acceptance criteria / risks / out of scope
        </summary>
        <div className="mt-2 grid gap-2 text-xs leading-5">
          <div>
            <p className="font-semibold">Acceptance criteria</p>
            {item.acceptanceCriteria.length > 0 ? (
              <ul className="mt-1 list-disc pl-4">
                {item.acceptanceCriteria.map((criterion) => (
                  <li key={criterion.criterionId}>{criterion.description}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1">No acceptance criteria until this item enters a sprint.</p>
            )}
          </div>
          <div>
            <p className="font-semibold">Out of scope</p>
            <ul className="mt-1 list-disc pl-4">
              {item.outOfScope.map((scope) => (
                <li key={scope}>{scope}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold">Next action</p>
            <p className="mt-1">{item.nextAction}</p>
          </div>
        </div>
      </details>
    </article>
  );
}

export function MvpGapResolutionSprintPlanPanel({
  plan,
  validation,
}: MvpGapResolutionSprintPlanPanelProps) {
  return (
    <section className="rounded-lg border border-lime-200 bg-lime-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-lime-950">
            MVP Gap Resolution Sprint Plan
          </h2>
          <p className="mt-1 text-xs leading-5 text-lime-900">
            Sprint plan，不是正式 roadmap。
          </p>
          <p className="mt-1 text-xs leading-5 text-lime-900">
            不是 production readiness；不接 analytics / backend / registry；不能 publish / registry write。
          </p>
        </div>
        <span className="rounded-md border border-lime-200 bg-white px-2.5 py-1 text-xs font-semibold text-lime-900">
          {plan.nextRecommendedPhase}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div className="rounded-md border border-lime-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Sprint summary</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>13D items：{plan.phase13DItems.length}</p>
            <p>13E / later items：{plan.phase13EItems.length}</p>
            <p>Deferred production gaps：{plan.deferredProductionGaps.length}</p>
            <p>Founder decision items：{plan.founderDecisionItems.length}</p>
          </div>
        </div>
        <div className="rounded-md border border-lime-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Validation status</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>Status：{validation.status}</p>
            <p>Issues：{validation.issues.length}</p>
            <p>JSON round-trip：{validation.jsonRoundTripStable ? 'stable' : 'check failed'}</p>
          </div>
        </div>
        <div className="rounded-md border border-lime-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Boundary</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>registry chain paused after Phase 10U：yes</p>
            <p>Real write authorization：paused</p>
            <p>publish / production writer：blocked</p>
          </div>
        </div>
        <div className="rounded-md border border-lime-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Scope</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>Real user research：no</p>
            <p>Analytics / backend：no</p>
            <p>Photos / base64 / local path：none</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4">
        <section>
          <h3 className="text-sm font-semibold text-lime-950">13D items</h3>
          <div className="mt-2 grid gap-2">
            {plan.phase13DItems.map((item) => (
              <SprintItemCard item={item} key={item.id} />
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-lime-950">13E / later items</h3>
          <div className="mt-2 grid gap-2">
            {plan.phase13EItems.length > 0 ? (
              plan.phase13EItems.map((item) => <SprintItemCard item={item} key={item.id} />)
            ) : (
              <p className="rounded-md border border-lime-200 bg-white p-3 text-xs text-stone-600">
                No 13E items in this fixture; founder decisions can move items here.
              </p>
            )}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-lime-950">Deferred production gaps</h3>
          <div className="mt-2 grid gap-2">
            {plan.deferredProductionGaps.map((item) => (
              <SprintItemCard item={item} key={item.id} />
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-lime-950">Founder decision required</h3>
          <div className="mt-2 grid gap-2">
            {plan.founderDecisionItems.map((item) => (
              <SprintItemCard item={item} key={item.id} />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
