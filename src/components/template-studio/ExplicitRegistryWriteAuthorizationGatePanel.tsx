import type {
  ExplicitRegistryWriteAuthorizationChecklist,
  ExplicitRegistryWriteAuthorizationGateResult,
  ExplicitRegistryWriteAuthorizationHandoff,
} from '../../template-engine';

export interface ExplicitRegistryWriteAuthorizationGatePanelProps {
  gate: ExplicitRegistryWriteAuthorizationGateResult;
  checklist: ExplicitRegistryWriteAuthorizationChecklist;
  handoff: ExplicitRegistryWriteAuthorizationHandoff;
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

export function ExplicitRegistryWriteAuthorizationGatePanel({
  gate,
  checklist,
  handoff,
}: ExplicitRegistryWriteAuthorizationGatePanelProps) {
  const failedChecks = gate.checks.filter((check) => !check.passed);

  return (
    <section className="rounded-lg border border-fuchsia-200 bg-fuchsia-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-fuchsia-950">
            显式 Registry 写入授权闸门
          </h2>
          <p className="mt-1 text-xs leading-5 text-fuchsia-900">
            10L 不是实际写入；仍然 dry-run only，不会发布，不会替换当前用户 App 包。未来真实写入仍需老板单独授权。
          </p>
        </div>
        <span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-fuchsia-900">
          Phase 10L authorization gate only
        </span>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Gate Status</h3>
              <p className="mt-1 text-xs text-stone-500">
                只判断未来执行设计资格
              </p>
            </div>
            <span
              className={`rounded-md border px-2 py-1 text-xs ${statusClass(
                gate.status,
              )}`}
            >
              {gate.status}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>Package id：{gate.packageIdCandidate}</p>
            <p>Version：{gate.packageVersionCandidate}</p>
            <p>Decision：{gate.decision}</p>
            <p>dry-run only：{gate.dryRunOnly ? '是' : '否'}</p>
            <p>不是实际写入，不会写入 registry。</p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Authorization Checklist</h3>
              <p className="mt-1 text-xs text-stone-500">
                老板未来单独授权要求
              </p>
            </div>
            <span
              className={`rounded-md border px-2 py-1 text-xs ${statusClass(
                checklist.status,
              )}`}
            >
              {checklist.status}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>Checklist items：{checklist.items.length}</p>
            <p>Reviewer ack required：{checklist.reviewerAckRequired ? '是' : '否'}</p>
            <p>
              Owner authorization required：
              {checklist.ownerAuthorizationRequired ? '是' : '否'}
            </p>
            <p>Future approval required：{checklist.futureApprovalRequired ? '是' : '否'}</p>
            <p>Checklist 不触发写入。</p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Authorization Handoff</h3>
              <p className="mt-1 text-xs text-stone-500">
                交给未来受控写入执行设计
              </p>
            </div>
            <span
              className={`rounded-md border px-2 py-1 text-xs ${statusClass(
                handoff.status,
              )}`}
            >
              {handoff.status}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>Next action：{handoff.nextAction}</p>
            <p>
              Future design：
              {handoff.readyForFutureControlledWriteExecutionDesign
                ? '可进入未来受控写入执行设计'
                : '不可进入'}
            </p>
            <p>不会发布，也不会替换当前用户 App 包。</p>
            <p>未来真实写入仍需老板单独授权。</p>
          </div>
        </div>
      </div>

      {gate.blockedReasons.length > 0 ? (
        <div className="mt-3 rounded-md border border-rose-200 bg-white p-3 text-xs text-rose-800">
          <p className="font-semibold">Blocked reasons</p>
          <ul className="mt-2 grid gap-1">
            {gate.blockedReasons.slice(0, 6).map((reason) => (
              <li key={reason.id}>{reason.message}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-3 rounded-md border border-fuchsia-200 bg-white p-3 text-xs text-fuchsia-900">
          可进入未来受控写入执行设计；这仍然不是实际写入授权。
        </div>
      )}

      <details className="mt-3 rounded-md border border-fuchsia-200 bg-white p-3">
        <summary className="cursor-pointer text-sm font-semibold text-stone-800">
          查看 checklist / gate checks / handoff notes
        </summary>
        <div className="mt-3 grid gap-4 text-xs text-stone-600 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold text-stone-900">Authorization checklist</h3>
            <ul className="mt-2 grid gap-1">
              {checklist.items.map((item) => (
                <li key={item.id}>
                  {item.label}: {item.status}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Gate checks</h3>
            <ul className="mt-2 grid gap-1">
              {gate.checks.slice(0, 12).map((check) => (
                <li key={check.id}>
                  {check.label}: {check.passed ? '通过' : check.severity}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-stone-500">{failedChecks.length} failed checks</p>
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
