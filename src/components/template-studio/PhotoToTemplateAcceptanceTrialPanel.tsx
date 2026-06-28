import type { PhotoToTemplateAcceptanceTrialReport } from '../../template-engine';

export interface PhotoToTemplateAcceptanceTrialPanelProps {
  report: PhotoToTemplateAcceptanceTrialReport;
}

const statusClass = (status: string): string => {
  if (status.includes('blocked')) return 'border-rose-200 bg-rose-50 text-rose-800';
  if (status.includes('warning')) return 'border-amber-200 bg-amber-50 text-amber-900';
  return 'border-emerald-200 bg-emerald-50 text-emerald-900';
};

export function PhotoToTemplateAcceptanceTrialPanel({
  report,
}: PhotoToTemplateAcceptanceTrialPanelProps) {
  return (
    <section className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-indigo-950">
            Photo-to-Template Acceptance Trial
          </h2>
          <p className="mt-1 text-xs leading-5 text-indigo-900">
            Acceptance Trial，不是发布。它只用于老板 / 运营 / 测试人员端到端试跑 User App MVP、Vision Analysis 和 Template Studio operator workflow。
          </p>
          <p className="mt-1 text-xs leading-5 text-indigo-900">
            当前仍是 draft-preview-only，仍需人工审核；不能写 registry / 不能 publish / 不能创建 production writer，也不能替换当前 User App Shell package。
          </p>
        </div>
        <span className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${statusClass(report.status)}`}>
          {report.status}
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-indigo-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Trial decision</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>Decision：{report.decision}</p>
            <p>Next phase：{report.nextRecommendedPhase}</p>
            <p>Human review：required</p>
          </div>
        </div>
        <div className="rounded-md border border-indigo-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Boundary</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>draft preview only：{report.draftPreviewOnly ? 'yes' : 'no'}</p>
            <p>not production readiness：{report.acceptanceTrialNotProductionReady ? 'yes' : 'no'}</p>
            <p>registry chain paused after Phase 10U：{report.registryChainPausedAfter10U ? 'yes' : 'no'}</p>
            <p>real write authorization paused：{report.realWriteAuthorizationPaused ? 'yes' : 'no'}</p>
          </div>
        </div>
        <div className="rounded-md border border-indigo-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Blocked outputs</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>registry write：blocked</p>
            <p>publish：blocked</p>
            <p>production writer：blocked</p>
            <p>User App Shell replacement：blocked</p>
          </div>
        </div>
        <div className="rounded-md border border-indigo-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Source reports</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>Workflow：{report.sourceOperatorWorkflowId}</p>
            <p>Draft Preview QA：{report.sourceDraftPreviewQaId}</p>
            <p>JSON round-trip：{report.jsonRoundTripStable ? 'stable' : 'check failed'}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {report.demoRoutes.map((route) => (
          <div className={`rounded-md border p-3 ${statusClass(route.status)}`} key={route.id}>
            <h3 className="text-sm font-semibold">{route.label}</h3>
            <p className="mt-1 text-xs font-semibold">status：{route.status}</p>
            <ol className="mt-2 grid gap-1 text-xs">
              {route.requiredSteps.map((step, index) => (
                <li key={step}>{index + 1}. {step}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-md border border-indigo-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Acceptance trial checklist</h3>
          <div className="mt-2 grid gap-2 text-xs">
            {report.checks.map((check) => (
              <div
                className={`rounded-md border p-2 ${
                  check.passed
                    ? 'border-teal-100 bg-teal-50 text-teal-900'
                    : check.severity === 'blocking'
                      ? 'border-rose-100 bg-rose-50 text-rose-800'
                      : 'border-amber-100 bg-amber-50 text-amber-900'
                }`}
                key={check.id}
              >
                <p className="font-semibold">{check.passed ? 'pass' : check.severity}: {check.label}</p>
                <p className="mt-1">{check.message}</p>
                <p className="mt-1 text-[11px] opacity-80">route：{check.route}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <div className="rounded-md border border-indigo-200 bg-white p-3">
            <h3 className="text-sm font-semibold">Forbidden claim checks</h3>
            <ul className="mt-2 grid gap-1 text-xs text-stone-600">
              {report.checks
                .filter((check) =>
                  [
                    'no_fully_automatic_claim',
                    'no_ai_confirmed_claim',
                    'no_medical_claim',
                    'no_product_shade_hard_claim',
                    'no_registry_write',
                    'no_publish',
                    'no_production_writer',
                  ].includes(check.id),
                )
                .map((check) => (
                  <li key={check.id}>{check.passed ? 'pass' : check.severity}: {check.label}</li>
                ))}
            </ul>
          </div>
          <div className="rounded-md border border-indigo-200 bg-white p-3">
            <h3 className="text-sm font-semibold">Next action</h3>
            <ul className="mt-2 grid gap-1 text-xs text-stone-600">
              {report.recommendations.map((item) => (
                <li key={item.id}>{item.nextAction}: {item.message}</li>
              ))}
            </ul>
          </div>
          {report.issues.length > 0 ? (
            <div className="rounded-md border border-amber-200 bg-white p-3">
              <h3 className="text-sm font-semibold">Blocked / warning reasons</h3>
              <ul className="mt-2 grid gap-1 text-xs text-stone-600">
                {report.issues.slice(0, 10).map((issue) => (
                  <li key={issue.id}>{issue.severity}: {issue.message} / {issue.recommendation}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
