import type {
  FounderDemoReviewReport,
  MvpTrialContentPack,
} from '../../template-engine';

export interface FounderDemoReviewPanelProps {
  contentPack: MvpTrialContentPack;
  report: FounderDemoReviewReport;
}

const statusClass = (status: string): string => {
  if (status.includes('blocked')) return 'border-rose-200 bg-rose-50 text-rose-800';
  if (status.includes('warning')) return 'border-amber-200 bg-amber-50 text-amber-900';
  return 'border-emerald-200 bg-emerald-50 text-emerald-900';
};

export function FounderDemoReviewPanel({
  contentPack,
  report,
}: FounderDemoReviewPanelProps) {
  const forbiddenClaimChecks = report.checks.filter((check) =>
    [
      'forbidden_claims_absent',
      'photo_to_template_boundary_clear',
      'privacy_boundary_clear',
    ].includes(check.id),
  );

  return (
    <section className="rounded-lg border border-rose-200 bg-rose-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-rose-950">
            Founder Demo Review
          </h2>
          <p className="mt-1 text-xs leading-5 text-rose-900">
            Founder Demo Review，不是发布。当前仍是 MVP trial content。
          </p>
          <p className="mt-1 text-xs leading-5 text-rose-900">
            这个面板用于给老板演示前检查三套本地试用模板、演示路线和禁止声明。
            当前内容可用于演示，不是正式模板库。不能写 registry / 不能 publish。
          </p>
          <p className="mt-1 text-xs leading-5 text-rose-900">
            所有内容仍需人工审核；通过只代表可以继续本地 demo，不代表上线。
          </p>
        </div>
        <span className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${statusClass(report.status)}`}>
          {report.status}
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-rose-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Trial content pack</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>Pack：{contentPack.title}</p>
            <p>Templates：{report.completeTrialTemplateCount} / {report.trialTemplateCount}</p>
            <p>Official library：no</p>
            <p>Real user photo：none</p>
          </div>
        </div>
        <div className="rounded-md border border-rose-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Founder decision</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>Decision：{report.decision}</p>
            <p>Next：{report.nextRecommendedPhase}</p>
            <p>Source：{report.sourceAcceptanceTrialId}</p>
          </div>
        </div>
        <div className="rounded-md border border-rose-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Blocked outputs</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>registry write：blocked</p>
            <p>publish：blocked</p>
            <p>production writer：blocked</p>
            <p>User App Shell replacement：blocked</p>
          </div>
        </div>
        <div className="rounded-md border border-rose-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Privacy boundary</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>upload：no</p>
            <p>training：no</p>
            <p>personal data：no</p>
            <p>JSON round-trip：{report.jsonRoundTripStable ? 'stable' : 'check failed'}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {contentPack.templates.map((template) => (
          <article className="rounded-md border border-rose-200 bg-white p-3" key={template.templateId}>
            <h3 className="text-sm font-semibold">{template.title}</h3>
            <p className="mt-1 text-xs leading-5 text-stone-600">{template.summary}</p>
            <div className="mt-2 grid gap-1 text-xs text-stone-600">
              <p>Difficulty：{template.difficulty}</p>
              <p>Time：{template.estimatedMinutes} min</p>
              <p>Steps：{template.steps.length}</p>
              <p>Human review：required</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-md border border-rose-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Founder checklist</h3>
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
                <p className="mt-1 text-[11px] opacity-80">area：{check.area}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <div className="rounded-md border border-rose-200 bg-white p-3">
            <h3 className="text-sm font-semibold">Forbidden claim checks</h3>
            <ul className="mt-2 grid gap-1 text-xs text-stone-600">
              {forbiddenClaimChecks.map((check) => (
                <li key={check.id}>{check.passed ? 'pass' : check.severity}: {check.label}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-md border border-rose-200 bg-white p-3">
            <h3 className="text-sm font-semibold">Demo route summary</h3>
            <ul className="mt-2 grid gap-1 text-xs text-stone-600">
              {report.demoRoutes.map((route) => (
                <li key={route.id}>{route.label}: {route.status}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-md border border-rose-200 bg-white p-3">
            <h3 className="text-sm font-semibold">Next iteration recommendation</h3>
            <ul className="mt-2 grid gap-1 text-xs text-stone-600">
              {report.recommendations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          {report.issues.length > 0 ? (
            <div className="rounded-md border border-amber-200 bg-white p-3">
              <h3 className="text-sm font-semibold">Warning / blocked reasons</h3>
              <ul className="mt-2 grid gap-1 text-xs text-stone-600">
                {report.issues.map((issue) => (
                  <li key={issue.id}>{issue.severity}: {issue.message}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
