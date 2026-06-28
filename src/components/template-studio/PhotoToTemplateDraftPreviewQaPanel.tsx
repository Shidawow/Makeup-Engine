import type { PhotoToTemplateDraftPreviewQaReport } from '../../template-engine';

export interface PhotoToTemplateDraftPreviewQaPanelProps {
  report: PhotoToTemplateDraftPreviewQaReport;
}

const statusClass = (status: string): string => {
  if (status.includes('blocked')) {
    return 'border-rose-200 bg-rose-50 text-rose-800';
  }
  if (status.includes('warning')) {
    return 'border-amber-200 bg-amber-50 text-amber-900';
  }
  return 'border-teal-200 bg-teal-50 text-teal-900';
};

export function PhotoToTemplateDraftPreviewQaPanel({
  report,
}: PhotoToTemplateDraftPreviewQaPanelProps) {
  const visibleFields = report.userVisibleFields.slice(0, 8);

  return (
    <section className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-cyan-950">
            Photo-to-Template Draft Preview QA
          </h2>
          <p className="mt-1 text-xs leading-5 text-cyan-900">
            后台 QA 面板：检查用户可见草稿字段是否完整，并确认 source type / confidence band / evidence / reviewer note 等内部字段不会出现在普通用户路径。
          </p>
          <p className="mt-1 text-xs leading-5 text-cyan-900">
            当前是 draft preview，不是 publish；不能写 registry，不能替换 User App Shell package，也不会生成真实 UserAppTemplatePackage。
          </p>
        </div>
        <span className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${statusClass(report.status)}`}>
          {report.status}
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-cyan-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Preview suitability</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>User App preview suitable：{report.userAppPreviewSuitable ? 'yes' : 'blocked'}</p>
            <p>Privacy notice：{report.localOnlyPrivacyNoticePresent ? 'present' : 'missing'}</p>
            <p>Internal fields hidden：{report.internalFieldsHiddenFromUserPath ? 'yes' : 'no'}</p>
            <p>Human review trace：{report.humanReviewTracePreservedInternally ? 'preserved internally' : 'missing'}</p>
          </div>
        </div>
        <div className="rounded-md border border-cyan-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Boundary</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>not publish ready：{report.notPublishReady ? 'true' : 'false'}</p>
            <p>not production ready：{report.notProductionReady ? 'true' : 'false'}</p>
            <p>registry write：blocked</p>
            <p>production writer：blocked</p>
          </div>
        </div>
        <div className="rounded-md border border-cyan-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Source status</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>Integration：{report.sourceIntegrationId}</p>
            <p>Human review：{report.sourceHumanReviewSessionId}</p>
            <p>Draft QA：{report.sourceDraftQaStatus}</p>
          </div>
        </div>
        <div className="rounded-md border border-cyan-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Next action</h3>
          <ul className="mt-2 grid gap-1 text-xs text-stone-600">
            {report.recommendations.slice(0, 3).map((item) => (
              <li key={item.id}>{item.nextAction}: {item.message}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-md border border-cyan-200 bg-white p-3">
          <h3 className="text-sm font-semibold">User-visible draft fields QA</h3>
          <div className="mt-2 grid gap-2">
            {visibleFields.map((field) => (
              <div className="rounded-md border border-stone-200 bg-stone-50 p-2 text-xs" key={field.field}>
                <p className="font-semibold text-stone-900">{field.label}</p>
                <p className="mt-1 text-stone-600">{field.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-cyan-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Preview QA checks</h3>
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
                key={`${check.id}-${check.message}`}
              >
                <p className="font-semibold">{check.passed ? 'pass' : check.severity}: {check.label}</p>
                <p className="mt-1">{check.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {report.issues.length > 0 ? (
        <div className="mt-3 rounded-md border border-amber-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Blocked / warning reasons</h3>
          <ul className="mt-2 grid gap-1 text-xs text-stone-600">
            {report.issues.slice(0, 8).map((issue) => (
              <li key={issue.id}>
                {issue.severity}: {issue.message} / {issue.recommendation}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
