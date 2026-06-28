import type { PhotoToTemplateOperatorWorkflowReport } from '../../template-engine';

export interface PhotoToTemplateOperatorWorkflowPanelProps {
  report: PhotoToTemplateOperatorWorkflowReport;
}

const statusClass = (status: string): string => {
  if (status === 'blocked') {
    return 'border-rose-200 bg-rose-50 text-rose-800';
  }
  if (status === 'ready_with_warnings' || status === 'not_started') {
    return 'border-amber-200 bg-amber-50 text-amber-900';
  }
  if (status === 'not_applicable') {
    return 'border-stone-200 bg-stone-50 text-stone-700';
  }
  return 'border-teal-200 bg-teal-50 text-teal-900';
};

export function PhotoToTemplateOperatorWorkflowPanel({
  report,
}: PhotoToTemplateOperatorWorkflowPanelProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-950">
            Photo-to-Template Operator Workflow
          </h2>
          <p className="mt-1 text-xs leading-5 text-slate-700">
            当前是 operator workflow，不是用户 App 页面。它把 12A Reality Check、12B Semantic Extraction、12C Draft Integration / Human Review Editing 和 12D Draft Preview QA 串成后台验收流程。
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-700">
            当前是 draft preview QA，不是发布；仍需人工审核；不能写 registry / 不能 publish / 不能创建 production writer。
          </p>
        </div>
        <span className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${statusClass(report.status)}`}>
          {report.status}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Workflow summary</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>ready：{report.readyStepCount}</p>
            <p>warnings：{report.warningStepCount}</p>
            <p>blocked：{report.blockedStepCount}</p>
            <p>operator only：{report.operatorOnly ? 'yes' : 'no'}</p>
          </div>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Handoff</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>Status：{report.handoff.status}</p>
            <p>Next action：{report.handoff.nextAction}</p>
            <p>{report.handoff.message}</p>
          </div>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Allowed destinations</h3>
          <ul className="mt-2 grid gap-1 text-xs text-stone-600">
            {report.handoff.allowedDestinations.map((destination) => (
              <li key={destination}>{destination}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Forbidden destinations</h3>
          <ul className="mt-2 grid gap-1 text-xs text-stone-600">
            {report.handoff.forbiddenDestinations.map((destination) => (
              <li key={destination}>{destination}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <h3 className="text-sm font-semibold text-slate-950">Workflow stepper / checklist</h3>
        {report.steps.map((step, index) => (
          <div
            className={`rounded-md border bg-white p-3 ${statusClass(step.status)}`}
            key={step.id}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide">Step {index + 1}</p>
                <h4 className="text-sm font-semibold">{step.label}</h4>
                <p className="mt-1 text-xs leading-5">{step.summary}</p>
              </div>
              <span className="rounded-md border bg-white/70 px-2 py-1 text-xs font-semibold">
                {step.status}
              </span>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-4">
              <div>
                <p className="text-xs font-semibold">Required inputs</p>
                <ul className="mt-1 grid gap-1 text-xs">
                  {step.requiredInputs.map((input) => (
                    <li key={input}>{input}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold">Produced outputs</p>
                <ul className="mt-1 grid gap-1 text-xs">
                  {step.producedOutputs.map((output) => (
                    <li key={output}>{output}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold">Flags</p>
                <div className="mt-1 grid gap-1 text-xs">
                  <p>human review required：{step.humanReviewRequired ? 'yes' : 'no'}</p>
                  <p>internal only：{step.internalOnly ? 'yes' : 'no'}</p>
                  <p>next action：{step.nextAction}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold">Issues</p>
                <ul className="mt-1 grid gap-1 text-xs">
                  {[...step.blockingIssues, ...step.warnings].length === 0 ? (
                    <li>暂无阻断或警告。</li>
                  ) : (
                    [...step.blockingIssues, ...step.warnings].map((issue) => (
                      <li key={issue.id}>{issue.severity}: {issue.message}</li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-md border border-slate-200 bg-white p-3">
        <h3 className="text-sm font-semibold">Workflow recommendations</h3>
        <ul className="mt-2 grid gap-1 text-xs text-stone-600">
          {report.recommendations.map((item) => (
            <li key={item.id}>{item.nextAction}: {item.message}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
