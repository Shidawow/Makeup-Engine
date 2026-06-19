import type {
  UserAppTemplatePackageDraftPublishGateHandoff,
  UserAppTemplatePackageDraftPublishGateResult,
} from '../../template-engine';

export interface UserAppTemplatePackageDraftPublishGatePanelProps {
  gate: UserAppTemplatePackageDraftPublishGateResult;
  handoff: UserAppTemplatePackageDraftPublishGateHandoff;
}

const statusClass = (status: string): string => {
  if (status.includes('blocked')) {
    return 'border-rose-200 bg-rose-50 text-rose-800';
  }
  if (status.includes('warning')) {
    return 'border-amber-200 bg-amber-50 text-amber-900';
  }
  if (status.includes('ready')) {
    return 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-900';
  }
  return 'border-stone-200 bg-stone-50 text-stone-700';
};

export function UserAppTemplatePackageDraftPublishGatePanel({
  gate,
  handoff,
}: UserAppTemplatePackageDraftPublishGatePanelProps) {
  const failedChecks = gate.checks.filter((check) => !check.passed);

  return (
    <section className="rounded-lg border border-fuchsia-200 bg-fuchsia-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-fuchsia-950">
            用户 App 模板包草稿发布闸门
          </h2>
          <p className="mt-1 text-xs leading-5 text-fuchsia-900">
            10H 只是发布前闸门，不是发布；不会写入 registry，不会替换当前用户 App 包，只判断草稿是否可进入未来 registry 准备。
          </p>
        </div>
        <span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-fuchsia-900">
          Phase 10H gate-only
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Publish Gate</h3>
              <p className="mt-1 text-xs text-stone-500">只做发布前资格判断</p>
            </div>
            <span className={`rounded-md border px-2 py-1 text-xs ${statusClass(gate.status)}`}>
              {gate.status}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>Decision：{gate.decision}</p>
            <p>Source draft：{gate.sourceDraftId}</p>
            <p>
              {gate.eligibleForFutureRegistryPreparation
                ? '可进入未来 registry 准备；这仍不是发布。'
                : '不能进入未来 registry 准备。'}
            </p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Gate Checks</h3>
              <p className="mt-1 text-xs text-stone-500">检查草稿字段、隐私和边界</p>
            </div>
            <span className={`rounded-md border px-2 py-1 text-xs ${statusClass(gate.status)}`}>
              {failedChecks.length} issues
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>JSON round-trip：{gate.jsonRoundTripStable ? '稳定' : '不稳定'}</p>
            <p>不会写入 registry。</p>
            <p>不会替换当前用户 App 包。</p>
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
              <p className="mt-1 text-xs text-stone-500">交给后续 registry preparation</p>
            </div>
            <span className={`rounded-md border px-2 py-1 text-xs ${statusClass(handoff.status)}`}>
              {handoff.status}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>Next action：{handoff.nextAction}</p>
            <p>Gate decision：{handoff.gateDecision}</p>
            <p>保持 draft-only，不替换 User App Shell package。</p>
          </div>
        </div>
      </div>

      <details className="mt-3 rounded-md border border-fuchsia-200 bg-white p-3">
        <summary className="cursor-pointer text-sm font-semibold text-stone-800">
          查看 publish gate checks / trace / handoff notes
        </summary>
        <div className="mt-3 grid gap-4 text-xs text-stone-600 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold text-stone-900">Checks</h3>
            <ul className="mt-2 grid gap-1">
              {gate.checks.slice(0, 10).map((check) => (
                <li key={check.id}>
                  {check.label}: {check.passed ? '通过' : check.severity}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Trace</h3>
            <ul className="mt-2 grid gap-1">
              <li>Draft：{gate.trace.sourceDraftStatus}</li>
              <li>Validation：{gate.trace.sourceOfficialDraftValidationStatus}</li>
              <li>Draft only：{gate.trace.draftOnly ? '是' : '否'}</li>
              <li>Publish blocked：{gate.trace.publishBlocked ? '是' : '否'}</li>
              <li>Registry write：{gate.trace.noRegistryWrite ? '阻断' : '风险'}</li>
              <li>Shell package replacement：{gate.trace.noUserAppShellPackageReplacement ? '阻断' : '风险'}</li>
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
