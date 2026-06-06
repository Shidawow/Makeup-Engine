import type { UserAppTemplateContentQaReport } from '../../user-app';

export interface UserAppTemplateContentQaPanelProps {
  reports: UserAppTemplateContentQaReport[];
}

const statusLabel: Record<UserAppTemplateContentQaReport['status'], string> = {
  trial_ready: '可试用',
  ready_with_warnings: '可备用',
  needs_content_revision: '需改文案',
  blocked: '阻断',
};

export function UserAppTemplateContentQaPanel({
  reports,
}: UserAppTemplateContentQaPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 8D Template Content QA
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">模板内容 QA</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          管理员用于检查标题、摘要、步骤、区域、工具、产品、推荐理由和技术词。
          这是内容质量闸门，不是正式发布。
        </p>
      </div>

      <div className="mt-4 grid gap-3">
        {reports.map((report) => (
          <article
            className="rounded-md border border-stone-200 bg-stone-50 p-3"
            key={report.templateId}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="font-semibold text-stone-900">{report.templateTitle}</h3>
                <p className="mt-1 text-xs text-stone-500">{report.templateId}</p>
              </div>
              <span className="w-fit rounded-md bg-white px-2 py-1 text-xs font-semibold text-stone-700">
                {statusLabel[report.status]}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              {report.recommendation.recommendation}
            </p>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {report.checks.map((check) => (
                <div
                  className="rounded-md border border-stone-200 bg-white p-2 text-xs"
                  key={`${report.templateId}-${check.checkId}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-stone-800">{check.label}</span>
                    <span className="text-stone-500">{check.status}</span>
                  </div>
                  <p className="mt-1 leading-5 text-stone-600">{check.summary}</p>
                </div>
              ))}
            </div>

            {report.issues.length > 0 ? (
              <ul className="mt-3 grid gap-2">
                {report.issues.slice(0, 4).map((issue) => (
                  <li
                    className="rounded-md border border-amber-200 bg-amber-50 p-2 text-xs leading-5 text-amber-900"
                    key={issue.issueId}
                  >
                    <strong>{issue.severity}</strong>: {issue.message}
                    <br />
                    {issue.recommendation}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-800">
                内容 QA 未发现阻断或 warning。
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
