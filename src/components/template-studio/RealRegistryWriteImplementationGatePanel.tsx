import type {
  RealRegistryWriteImplementationChecklist,
  RealRegistryWriteImplementationGateResult,
  RealRegistryWriteImplementationHandoff,
} from '../../template-engine';

export interface RealRegistryWriteImplementationGatePanelProps {
  gate: RealRegistryWriteImplementationGateResult;
  checklist: RealRegistryWriteImplementationChecklist;
  handoff: RealRegistryWriteImplementationHandoff;
}

const statusClass = (status: string): string => {
  if (status.includes('blocked')) {
    return 'border-rose-200 bg-rose-50 text-rose-800';
  }
  if (status.includes('warning')) {
    return 'border-amber-200 bg-amber-50 text-amber-900';
  }
  if (status.includes('ready')) {
    return 'border-violet-200 bg-violet-50 text-violet-900';
  }
  return 'border-stone-200 bg-stone-50 text-stone-700';
};

export function RealRegistryWriteImplementationGatePanel({
  gate,
  checklist,
  handoff,
}: RealRegistryWriteImplementationGatePanelProps) {
  const failedChecks = gate.checks.filter((check) => !check.passed);
  const unconfirmedItems = checklist.items.filter((item) => !item.confirmed);

  return (
    <section className="rounded-lg border border-violet-200 bg-violet-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-violet-950">
            真实 Registry 写入实现闸门
          </h2>
          <p className="mt-1 text-xs leading-5 text-violet-900">
            10N 是 implementation gate，不是实际写入，不是 production writer；仍然 dry-run only，不会发布，不会替换当前用户 App 包。未来真实实现仍需老板单独授权。
          </p>
        </div>
        <span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-violet-900">
          Phase 10N gate only
        </span>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Gate Status</h3>
              <p className="mt-1 text-xs text-stone-500">
                只判断是否可进入未来实现草稿
              </p>
            </div>
            <span className={`rounded-md border px-2 py-1 text-xs ${statusClass(gate.status)}`}>
              {gate.status}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>Decision：{gate.decision}</p>
            <p>dry-run only：{gate.dryRunOnly ? '是' : '否'}</p>
            <p>production write disabled：{gate.productionWriteStillDisabled ? '是' : '否'}</p>
            <p>不是实际写入，不会写入 registry。</p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Checklist</h3>
              <p className="mt-1 text-xs text-stone-500">
                确认不写入 / 不发布 / 不替换
              </p>
            </div>
            <span className={`rounded-md border px-2 py-1 text-xs ${statusClass(checklist.status)}`}>
              {checklist.status}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>Required items：{checklist.items.length}</p>
            <p>Unconfirmed：{unconfirmedItems.length}</p>
            <p>不是 production writer。</p>
            <p>未来真实实现仍需老板单独授权。</p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Handoff</h3>
              <p className="mt-1 text-xs text-stone-500">
                交给未来真实写入实现草稿
              </p>
            </div>
            <span className={`rounded-md border px-2 py-1 text-xs ${statusClass(handoff.status)}`}>
              {handoff.status}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>Next action：{handoff.nextAction}</p>
            <p>
              Future implementation draft：
              {handoff.readyForFutureRealWriteImplementationDraft ? '可进入未来草稿' : '不可进入'}
            </p>
            <p>不会发布，也不会替换当前用户 App 包。</p>
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
        <div className="mt-3 rounded-md border border-violet-200 bg-white p-3 text-xs text-violet-900">
          可进入未来真实写入实现草稿；这仍然不是实际 registry 写入，也不是生产 writer。
        </div>
      )}

      <details className="mt-3 rounded-md border border-violet-200 bg-white p-3">
        <summary className="cursor-pointer text-sm font-semibold text-stone-800">
          查看 gate checks / checklist / handoff notes
        </summary>
        <div className="mt-3 grid gap-4 text-xs text-stone-600 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold text-stone-900">Gate checks</h3>
            <ul className="mt-2 grid gap-1">
              {gate.checks.slice(0, 14).map((check) => (
                <li key={check.id}>
                  {check.label}: {check.passed ? '通过' : check.severity}
                </li>
              ))}
            </ul>
            {failedChecks.length > 0 ? (
              <p className="mt-2 text-rose-700">Failed checks：{failedChecks.length}</p>
            ) : null}
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Checklist</h3>
            <ul className="mt-2 grid gap-1">
              {checklist.items.slice(0, 10).map((item) => (
                <li key={item.id}>
                  {item.label}: {item.confirmed ? '已确认' : '未确认'}
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
