import type { PhotoToTemplateHumanReviewEditingSession } from '../../template-engine';

export interface PhotoToTemplateHumanReviewEditingPanelProps {
  session: PhotoToTemplateHumanReviewEditingSession;
}

const statusClass = (status: string): string => {
  if (status.includes('blocked')) {
    return 'border-rose-200 bg-rose-50 text-rose-800';
  }
  if (status.includes('needs')) {
    return 'border-amber-200 bg-amber-50 text-amber-900';
  }
  return 'border-teal-200 bg-teal-50 text-teal-900';
};

export function PhotoToTemplateHumanReviewEditingPanel({
  session,
}: PhotoToTemplateHumanReviewEditingPanelProps) {
  const visibleFields = session.editableFields.slice(0, 8);

  return (
    <section className="rounded-lg border border-orange-200 bg-orange-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-orange-950">
            Photo-to-Template Human Review Editing
          </h2>
          <p className="mt-1 text-xs leading-5 text-orange-900">
            本地人工编辑草稿：显示候选字段、证据和限制，可模拟 accept / edit / reject / insufficient / block。接受候选也只是进入 draft，不是 final / publish。
          </p>
        </div>
        <span className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${statusClass(session.status)}`}>
          {session.status}
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-orange-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Draft QA readiness</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>ready for draft QA：{session.readyForDraftQa ? 'yes' : 'no'}</p>
            <p>accepted fields draft-only：{session.allAcceptedFieldsRemainDraftOnly ? 'yes' : 'no'}</p>
            <p>original candidate trace：{session.originalCandidateTracePreserved ? 'preserved' : 'missing'}</p>
            <p>human review trace：{session.humanReviewRequiredTracePreserved ? 'preserved' : 'missing'}</p>
          </div>
        </div>
        <div className="rounded-md border border-orange-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Boundary</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>AI auto confirmation：blocked</p>
            <p>publish：blocked</p>
            <p>registry write：blocked</p>
            <p>production writer：blocked</p>
          </div>
        </div>
        <div className="rounded-md border border-orange-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Checklist</h3>
          <ul className="mt-2 grid gap-1 text-xs text-stone-600">
            {session.checklist.slice(0, 4).map((item) => (
              <li key={item.id}>{item.checked ? '已确认' : '待确认'}：{item.label}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border border-orange-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Issues</h3>
          <ul className="mt-2 grid gap-1 text-xs text-stone-600">
            {session.issues.length === 0 ? (
              <li>暂无阻断。</li>
            ) : (
              session.issues.slice(0, 4).map((issue) => (
                <li key={issue.id}>{issue.severity}: {issue.message}</li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {visibleFields.map((field) => (
          <div className="rounded-md border border-orange-200 bg-white p-3" key={field.field}>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold">{field.label}</h3>
              <span className="rounded-md bg-orange-100 px-2 py-1 text-xs text-orange-900">
                {field.reviewerDecision}
              </span>
            </div>
            <div className="mt-2 grid gap-1 text-xs text-stone-600">
              <p>source type：{field.sourceType}</p>
              <p>confidence band：{field.confidenceBand}</p>
              <p>original candidate：{field.originalCandidateValue}</p>
              <p>editable draft value：{field.editableDraftValue}</p>
              <p>reviewer note：{field.reviewerNote}</p>
              <p>enters draft：{field.entersDraft ? 'yes, draft only' : 'no'}</p>
            </div>
            <details className="mt-2 rounded-md border border-stone-200 bg-stone-50 p-2">
              <summary className="cursor-pointer text-xs font-semibold text-stone-800">
                evidence / limitations
              </summary>
              <div className="mt-2 grid gap-2 text-xs text-stone-600">
                <div>
                  <p className="font-semibold text-stone-800">evidence</p>
                  <ul className="mt-1 grid gap-1">
                    {field.evidence.slice(0, 3).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-stone-800">limitations</p>
                  <ul className="mt-1 grid gap-1">
                    {field.limitations.slice(0, 3).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </details>
          </div>
        ))}
      </div>
    </section>
  );
}
