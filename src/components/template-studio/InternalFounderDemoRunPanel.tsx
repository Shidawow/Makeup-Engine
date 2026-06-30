import type {
  InternalFounderDemoRunReport,
  InternalFounderDemoRunValidationResult,
  InternalFounderDemoStatus,
} from '../../template-engine';

export interface InternalFounderDemoRunPanelProps {
  report: InternalFounderDemoRunReport;
  validation: InternalFounderDemoRunValidationResult;
}

const statusClass = (status: InternalFounderDemoStatus | string): string => {
  if (status.includes('blocked')) return 'border-rose-200 bg-rose-50 text-rose-800';
  if (status.includes('warning')) return 'border-amber-200 bg-amber-50 text-amber-900';
  if (status === 'not_run') return 'border-stone-200 bg-stone-50 text-stone-700';
  return 'border-sky-200 bg-sky-50 text-sky-900';
};

export function InternalFounderDemoRunPanel({
  report,
  validation,
}: InternalFounderDemoRunPanelProps) {
  return (
    <section className="rounded-lg border border-sky-200 bg-sky-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-sky-950">
            Internal Founder Demo Run
          </h2>
          <p className="mt-1 text-xs leading-5 text-sky-900">
            Internal Founder Demo Run，不是真实用户研究；不是发布，不是 production readiness。
          </p>
          <p className="mt-1 text-xs leading-5 text-sky-900">
            当前仍是本地 MVP demo：不写 registry / 不 publish / 不创建 production writer /
            不替换普通 User App Shell。
          </p>
        </div>
        <span className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${statusClass(report.status)}`}>
          {report.status}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div className="rounded-md border border-sky-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Founder decision</h3>
          <p className="mt-2 text-xs leading-5 text-stone-600">{report.decision}</p>
          <p className="mt-1 text-xs leading-5 text-stone-500">
            {report.finalFounderDecision}
          </p>
        </div>
        <div className="rounded-md border border-sky-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Validation</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>Status：{validation.status}</p>
            <p>Ready routes：{validation.readyRoutes.length}</p>
            <p>Blocked routes：{validation.blockedRoutes.length}</p>
          </div>
        </div>
        <div className="rounded-md border border-sky-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Boundary</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>Registry chain paused after 10U：yes</p>
            <p>Real user data：no</p>
            <p>Analytics / backend / training：no</p>
          </div>
        </div>
        <div className="rounded-md border border-sky-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Next action</h3>
          <p className="mt-2 text-xs leading-5 text-stone-600">{report.nextAction}</p>
          <p className="mt-1 text-xs leading-5 text-stone-500">
            {report.nextRecommendedPhase}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {report.routes.map((route) => (
          <article className={`rounded-md border p-3 ${statusClass(route.status)}`} key={route.id}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold">{route.label}</p>
                <h3 className="mt-1 text-sm font-semibold">{route.goal}</h3>
              </div>
              <span className="rounded-md bg-white/80 px-2 py-1 text-xs font-semibold">
                {route.status}
              </span>
            </div>
            <details className="mt-2 rounded-md bg-white/70 p-2">
              <summary className="cursor-pointer text-xs font-semibold">
                pass criteria / evidence / next action
              </summary>
              <div className="mt-2 grid gap-2 text-xs leading-5">
                <div>
                  <p className="font-semibold">Pass criteria</p>
                  <ul className="mt-1 list-disc pl-4">
                    {route.passCriteria.map((criterion) => (
                      <li key={criterion}>{criterion}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">Evidence</p>
                  <ul className="mt-1 list-disc pl-4">
                    {route.evidence.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                {route.blockers.length > 0 ? (
                  <div>
                    <p className="font-semibold">Blockers</p>
                    <ul className="mt-1 list-disc pl-4">
                      {route.blockers.map((blocker) => (
                        <li key={blocker}>{blocker}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {route.warnings.length > 0 ? (
                  <div>
                    <p className="font-semibold">Warnings</p>
                    <ul className="mt-1 list-disc pl-4">
                      {route.warnings.map((warning) => (
                        <li key={warning}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <p>
                  <span className="font-semibold">Next action：</span>
                  {route.nextAction}
                </p>
              </div>
            </details>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-md border border-sky-200 bg-white p-3">
        <h3 className="text-sm font-semibold text-sky-950">Recommendations</h3>
        <ul className="mt-2 grid gap-1 text-xs leading-5 text-stone-600">
          {report.recommendations.map((recommendation) => (
            <li key={recommendation}>{recommendation}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
