import type { PhotoToTemplateDraftIntegrationReport } from '../../template-engine';

export interface PhotoToTemplateDraftIntegrationPanelProps {
  report: PhotoToTemplateDraftIntegrationReport;
}

const statusClass = (status: string): string => {
  if (status.includes('blocked')) {
    return 'border-rose-200 bg-rose-50 text-rose-800';
  }
  if (status.includes('warning') || status.includes('insufficient') || status.includes('demo')) {
    return 'border-amber-200 bg-amber-50 text-amber-900';
  }
  return 'border-teal-200 bg-teal-50 text-teal-900';
};

export function PhotoToTemplateDraftIntegrationPanel({
  report,
}: PhotoToTemplateDraftIntegrationPanelProps) {
  const visibleBindings = report.bindings.slice(0, 8);

  return (
    <section className="rounded-lg border border-lime-200 bg-lime-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-lime-950">
            Photo-to-Template Draft Integration
          </h2>
          <p className="mt-1 text-xs leading-5 text-lime-900">
            语义候选接入草稿，不是最终模板；需要人工审核。接受候选也只是进入草稿，不能发布 / 不能写 registry。
          </p>
        </div>
        <span className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${statusClass(report.status)}`}>
          {report.status}
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-lime-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Binding summary</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>Bindings：{report.bindings.length}</p>
            <p>Human review：{report.allBindingsHumanReviewRequired ? 'required' : 'missing'}</p>
            <p>notFinal：{report.allBindingsNotFinal ? 'true' : 'broken'}</p>
            <p>metadata：{report.sourceMetadataPreserved ? 'preserved' : 'missing'}</p>
          </div>
        </div>
        <div className="rounded-md border border-lime-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Edit state</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>accepted into draft：{report.editState.acceptedIntoDraftCount}</p>
            <p>rejected：{report.editState.rejectedCount}</p>
            <p>blocked：{report.editState.blockedCount}</p>
            <p>pending review：{report.editState.pendingReviewCount}</p>
          </div>
        </div>
        <div className="rounded-md border border-lime-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Boundary</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>publish blocked：{report.publishBlocked ? 'yes' : 'no'}</p>
            <p>registry write blocked：{report.registryWriteBlocked ? 'yes' : 'no'}</p>
            <p>production writer blocked：{report.productionWriterBlocked ? 'yes' : 'no'}</p>
            <p>User App Shell replacement：blocked</p>
          </div>
        </div>
        <div className="rounded-md border border-lime-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Next action</h3>
          <ul className="mt-2 grid gap-1 text-xs text-stone-600">
            {report.recommendations.slice(0, 3).map((item) => (
              <li key={item.id}>{item.nextAction}: {item.message}</li>
            ))}
          </ul>
        </div>
      </div>

      {report.issues.length > 0 ? (
        <div className="mt-3 rounded-md border border-amber-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Issues</h3>
          <ul className="mt-2 grid gap-1 text-xs text-stone-600">
            {report.issues.slice(0, 5).map((issue) => (
              <li key={issue.id}>
                {issue.severity}: {issue.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-lime-950">
            semantic candidate → draft field binding matrix
          </h3>
          <p className="text-xs text-lime-900">
            source type / confidence band / evidence / limitations are retained
          </p>
        </div>
        <div className="mt-2 overflow-x-auto rounded-md border border-lime-200 bg-white">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-lime-100 text-lime-950">
              <tr>
                <th className="px-3 py-2">draft field</th>
                <th className="px-3 py-2">semantic candidate</th>
                <th className="px-3 py-2">source type</th>
                <th className="px-3 py-2">confidence band</th>
                <th className="px-3 py-2">original candidate</th>
                <th className="px-3 py-2">editable draft</th>
                <th className="px-3 py-2">reviewer decision</th>
              </tr>
            </thead>
            <tbody>
              {visibleBindings.map((binding) => (
                <tr className="border-t border-lime-100" key={binding.bindingId}>
                  <td className="px-3 py-2 font-semibold text-stone-900">{binding.label}</td>
                  <td className="px-3 py-2 text-stone-600">{binding.semanticCandidateKey}</td>
                  <td className="px-3 py-2 text-stone-600">{binding.sourceType}</td>
                  <td className="px-3 py-2 text-stone-600">{binding.confidenceBand}</td>
                  <td className="px-3 py-2 text-stone-600">{binding.originalCandidateValue}</td>
                  <td className="px-3 py-2 text-stone-600">{binding.editableDraftValue}</td>
                  <td className="px-3 py-2 text-stone-600">{binding.reviewerDecision}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <details className="mt-3 rounded-md border border-lime-200 bg-white p-3">
        <summary className="cursor-pointer text-sm font-semibold text-stone-800">
          查看 evidence / limitations / reviewer notes
        </summary>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {visibleBindings.map((binding) => (
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3 text-xs" key={`${binding.bindingId}-details`}>
              <h4 className="font-semibold text-stone-900">{binding.label}</h4>
              <p className="mt-1 text-stone-600">reviewer note：{binding.reviewerNote}</p>
              <p className="mt-2 font-semibold text-stone-700">evidence</p>
              <ul className="mt-1 grid gap-1 text-stone-600">
                {binding.evidence.slice(0, 4).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-2 font-semibold text-stone-700">limitations</p>
              <ul className="mt-1 grid gap-1 text-stone-600">
                {binding.limitations.slice(0, 4).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}
