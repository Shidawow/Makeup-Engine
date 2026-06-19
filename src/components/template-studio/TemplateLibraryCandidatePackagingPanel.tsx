import type {
  TemplateLibraryCandidateHandoff,
  TemplateLibraryCandidatePackage,
  TemplateLibraryCandidateValidationResult,
} from '../../template-engine';

export interface TemplateLibraryCandidatePackagePanelProps {
  candidatePackage: TemplateLibraryCandidatePackage;
}

export interface TemplateLibraryCandidateValidationPanelProps {
  validation: TemplateLibraryCandidateValidationResult;
}

export interface TemplateLibraryCandidateHandoffPanelProps {
  handoff: TemplateLibraryCandidateHandoff;
}

export interface TemplateLibraryCandidatePackagingPanelProps {
  candidatePackage: TemplateLibraryCandidatePackage;
  validation: TemplateLibraryCandidateValidationResult;
  handoff: TemplateLibraryCandidateHandoff;
}

const statusClass = (status: string): string => {
  if (status.includes('blocked')) {
    return 'border-rose-200 bg-rose-50 text-rose-800';
  }
  if (status.includes('warning')) {
    return 'border-amber-200 bg-amber-50 text-amber-900';
  }
  if (status.includes('ready')) {
    return 'border-teal-200 bg-teal-50 text-teal-900';
  }
  return 'border-stone-200 bg-stone-50 text-stone-700';
};

export function TemplateLibraryCandidatePackagePanel({
  candidatePackage,
}: TemplateLibraryCandidatePackagePanelProps) {
  return (
    <div className="rounded-md border border-stone-200 bg-white p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">Candidate Package</h3>
          <p className="mt-1 text-xs text-stone-500">模板库候选包 / 仍为候选模板</p>
        </div>
        <span className={`rounded-md border px-2 py-1 text-xs ${statusClass(candidatePackage.packageStatus)}`}>
          {candidatePackage.packageStatus}
        </span>
      </div>
      <div className="mt-3 grid gap-1 text-xs text-stone-600">
        <p>Candidate：{candidatePackage.candidateId}</p>
        <p>Source draft：{candidatePackage.sourceDraftId ?? 'missing'}</p>
        <p>Steps：{candidatePackage.reviewedSteps.length}</p>
        <p>Tools：{candidatePackage.toolsChecklist.join(', ') || 'missing'}</p>
      </div>
      {candidatePackage.blockedReasons.length > 0 ? (
        <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 p-2 text-xs text-rose-800">
          <p className="font-semibold">阻断原因</p>
          <ul className="mt-1 grid gap-1">
            {candidatePackage.blockedReasons.slice(0, 3).map((reason) => (
              <li key={reason.id}>{reason.message}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function TemplateLibraryCandidateValidationPanel({
  validation,
}: TemplateLibraryCandidateValidationPanelProps) {
  const failedChecks = validation.checks.filter((check) => !check.passed);

  return (
    <div className="rounded-md border border-stone-200 bg-white p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">Candidate Validation</h3>
          <p className="mt-1 text-xs text-stone-500">
            验证 approved trace、QA trace、隐私边界和 JSON 稳定性
          </p>
        </div>
        <span className={`rounded-md border px-2 py-1 text-xs ${statusClass(validation.status)}`}>
          {validation.status}
        </span>
      </div>
      <div className="mt-3 grid gap-1 text-xs text-stone-600">
        <p>JSON round-trip：{validation.jsonRoundTripStable ? '稳定' : '不稳定'}</p>
        <p>候选库复核：{validation.candidateReadyForLibraryReview ? '可进入' : '已阻断'}</p>
        <p>不会自动生成 UserAppTemplatePackage。</p>
      </div>
      {failedChecks.length > 0 ? (
        <details className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs">
          <summary className="cursor-pointer font-semibold text-amber-900">
            查看未通过 checks
          </summary>
          <ul className="mt-2 grid gap-1 text-amber-900">
            {failedChecks.slice(0, 6).map((check) => (
              <li key={check.id}>{check.label}: {check.message}</li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}

export function TemplateLibraryCandidateHandoffPanel({
  handoff,
}: TemplateLibraryCandidateHandoffPanelProps) {
  return (
    <div className="rounded-md border border-stone-200 bg-white p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">Candidate Handoff</h3>
          <p className="mt-1 text-xs text-stone-500">
            只交给后续候选库复核，不写正式库
          </p>
        </div>
        <span className={`rounded-md border px-2 py-1 text-xs ${statusClass(handoff.status)}`}>
          {handoff.status}
        </span>
      </div>
      <div className="mt-3 grid gap-1 text-xs text-stone-600">
        <p>Next action：{handoff.nextAction}</p>
        <p>Decision：{handoff.packagingDecision}</p>
        <p>仍为候选模板。</p>
      </div>
    </div>
  );
}

export function TemplateLibraryCandidatePackagingPanel({
  candidatePackage,
  validation,
  handoff,
}: TemplateLibraryCandidatePackagingPanelProps) {
  return (
    <section className="rounded-lg border border-teal-200 bg-teal-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-teal-950">
            模板库候选包
          </h2>
          <p className="mt-1 text-xs leading-5 text-teal-900">
            10C 只把人工审核通过的草稿整理为本地、可验证、可交接的 candidate package；仍为候选模板，不写正式 Template Library，不会自动生成 UserAppTemplatePackage。
          </p>
        </div>
        <span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-teal-900">
          Phase 10C candidate-only
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <TemplateLibraryCandidatePackagePanel candidatePackage={candidatePackage} />
        <TemplateLibraryCandidateValidationPanel validation={validation} />
        <TemplateLibraryCandidateHandoffPanel handoff={handoff} />
      </div>

      <details className="mt-3 rounded-md border border-teal-200 bg-white p-3">
        <summary className="cursor-pointer text-sm font-semibold text-stone-800">
          查看 package trace / placeholders / handoff notes
        </summary>
        <div className="mt-3 grid gap-4 text-xs text-stone-600 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold text-stone-900">Trace</h3>
            <ul className="mt-2 grid gap-1">
              <li>QA：{candidatePackage.qaTrace.qaStatus}</li>
              <li>Human review：{candidatePackage.humanReviewTrace.humanReviewStatus}</li>
              <li>Workflow：{candidatePackage.qaTrace.reviewWorkflowStatus}</li>
              <li>Publish blocked：{candidatePackage.qaTrace.publishBlocked ? 'yes' : 'no'}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Product placeholders</h3>
            <ul className="mt-2 grid gap-1">
              {candidatePackage.productSuggestionPlaceholders.slice(0, 5).map((item, index) => (
                <li key={`${item.category}-${index}`}>
                  {item.category} / placeholder-only
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Handoff notes</h3>
            <ul className="mt-2 grid gap-1">
              {handoff.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      </details>
    </section>
  );
}
