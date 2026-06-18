import type {
  OfficialUserAppPackageDraftGateHandoff,
  OfficialUserAppPackageDraftGateResult,
} from '../../template-engine';

export interface OfficialUserAppPackageDraftGatePanelProps {
  gate: OfficialUserAppPackageDraftGateResult;
  handoff: OfficialUserAppPackageDraftGateHandoff;
}

const statusClass = (status: string): string => {
  if (status.includes('blocked')) {
    return 'border-rose-200 bg-rose-50 text-rose-800';
  }
  if (status.includes('warning')) {
    return 'border-amber-200 bg-amber-50 text-amber-900';
  }
  if (status.includes('ready')) {
    return 'border-blue-200 bg-blue-50 text-blue-900';
  }
  return 'border-stone-200 bg-stone-50 text-stone-700';
};

export function OfficialUserAppPackageDraftGatePanel({
  gate,
  handoff,
}: OfficialUserAppPackageDraftGatePanelProps) {
  const failedChecks = gate.checks.filter((check) => !check.passed);

  return (
    <section className="rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-blue-950">
            正式用户 App 包草稿闸门
          </h2>
          <p className="mt-1 text-xs leading-5 text-blue-900">
            10F 只判断 10E 草稿预览是否可进入后续正式包草稿构建器；不是正式 UserAppTemplatePackage，不会写入 registry，不会发布。
          </p>
        </div>
        <span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-blue-900">
          Phase 10F gate-only
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Draft Gate</h3>
              <p className="mt-1 text-xs text-stone-500">只做进入构建器前的 gate</p>
            </div>
            <span className={`rounded-md border px-2 py-1 text-xs ${statusClass(gate.status)}`}>
              {gate.status}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>Decision：{gate.decision}</p>
            <p>Source preview：{gate.sourcePreviewId}</p>
            <p>可进入正式包草稿构建器：{gate.eligibleForOfficialUserAppPackageDraftBuilder ? '是' : '否'}</p>
            <p>不是正式 UserAppTemplatePackage。</p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Gate Checks</h3>
              <p className="mt-1 text-xs text-stone-500">检查文案、步骤、隐私和边界</p>
            </div>
            <span className={`rounded-md border px-2 py-1 text-xs ${statusClass(gate.status)}`}>
              {failedChecks.length} issues
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>JSON round-trip：{gate.jsonRoundTripStable ? '稳定' : '不稳定'}</p>
            <p>不会写入 registry。</p>
            <p>不会发布。</p>
          </div>
          {gate.blockedReasons.length > 0 ? (
            <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 p-2 text-xs text-rose-800">
              <p className="font-semibold">Blocked reasons</p>
              <ul className="mt-1 grid gap-1">
                {gate.blockedReasons.slice(0, 5).map((reason) => (
                  <li key={reason.id}>{reason.message}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Gate Handoff</h3>
              <p className="mt-1 text-xs text-stone-500">交给后续正式包草稿构建器</p>
            </div>
            <span className={`rounded-md border px-2 py-1 text-xs ${statusClass(handoff.status)}`}>
              {handoff.status}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>Next action：{handoff.nextAction}</p>
            <p>Gate decision：{handoff.gateDecision}</p>
            <p>只可进入构建器准备，不能生成正式用户模板包。</p>
          </div>
        </div>
      </div>

      <details className="mt-3 rounded-md border border-blue-200 bg-white p-3">
        <summary className="cursor-pointer text-sm font-semibold text-stone-800">
          查看 gate checks / trace / handoff notes
        </summary>
        <div className="mt-3 grid gap-4 text-xs text-stone-600 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold text-stone-900">Checks</h3>
            <ul className="mt-2 grid gap-1">
              {gate.checks.slice(0, 8).map((check) => (
                <li key={check.id}>
                  {check.label}: {check.passed ? '通过' : check.severity}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Trace</h3>
            <ul className="mt-2 grid gap-1">
              <li>Preview：{gate.trace.sourcePreviewStatus}</li>
              <li>Validation：{gate.trace.sourcePreviewValidationStatus}</li>
              <li>QA trace：{gate.trace.qaTracePreserved ? '保留' : '缺失'}</li>
              <li>Human review trace：{gate.trace.humanReviewTracePreserved ? '保留' : '缺失'}</li>
              <li>Candidate trace：{gate.trace.candidateTracePreserved ? '保留' : '缺失'}</li>
              <li>Contract trace：{gate.trace.contractTracePreserved ? '保留' : '缺失'}</li>
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
