import type {
  UserAppTemplatePackageRegistryWriteGateHandoff,
  UserAppTemplatePackageRegistryWriteGateResult,
} from '../../template-engine';

export interface UserAppTemplatePackageRegistryWriteGatePanelProps {
  gate: UserAppTemplatePackageRegistryWriteGateResult;
  handoff: UserAppTemplatePackageRegistryWriteGateHandoff;
}

const statusClass = (status: string): string => {
  if (status.includes('blocked')) {
    return 'border-rose-200 bg-rose-50 text-rose-800';
  }
  if (status.includes('warning')) {
    return 'border-amber-200 bg-amber-50 text-amber-900';
  }
  if (status.includes('ready')) {
    return 'border-sky-200 bg-sky-50 text-sky-900';
  }
  return 'border-stone-200 bg-stone-50 text-stone-700';
};

export function UserAppTemplatePackageRegistryWriteGatePanel({
  gate,
  handoff,
}: UserAppTemplatePackageRegistryWriteGatePanelProps) {
  const failedChecks = gate.checks.filter((check) => !check.passed);

  return (
    <section className="rounded-lg border border-sky-200 bg-sky-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-sky-950">
            用户 App 模板包 Registry 写入闸门
          </h2>
          <p className="mt-1 text-xs leading-5 text-sky-900">
            10J 只是写入前闸门，不是实际写入；不会发布，也不会替换当前用户 App 包。
          </p>
        </div>
        <span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-sky-900">
          Phase 10J gate-only
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Write Gate Status</h3>
              <p className="mt-1 text-xs text-stone-500">
                只判断能否进入未来受控 writer
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
            <p>
              Future controlled writer：
              {gate.eligibleForFutureControlledRegistryWriter ? '可进入' : '不可进入'}
            </p>
            <p>只是写入前闸门，不是实际写入。</p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Gate Checks</h3>
              <p className="mt-1 text-xs text-stone-500">
                锁定 draft / publish / registry 边界
              </p>
            </div>
            <span
              className={`rounded-md border px-2 py-1 text-xs ${statusClass(
                failedChecks.length > 0 ? 'blocked' : gate.status,
              )}`}
            >
              {failedChecks.length} issues
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>Draft only：{gate.draftOnly ? '是' : '否'}</p>
            <p>Publish blocked：{gate.publishBlocked ? '是' : '否'}</p>
            <p>Registry write blocked：{gate.registryWriteBlocked ? '是' : '否'}</p>
            <p>不会写入 registry，不会发布。</p>
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
              <h3 className="text-sm font-semibold">Registry Writer Handoff</h3>
              <p className="mt-1 text-xs text-stone-500">交给后续受控 writer 审核</p>
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
            <p>Source preparation：{handoff.sourcePreparationId}</p>
            <p>不会创建生产包。</p>
            <p>不会替换 User App Shell 当前消费的包。</p>
          </div>
        </div>
      </div>

      <details className="mt-3 rounded-md border border-sky-200 bg-white p-3">
        <summary className="cursor-pointer text-sm font-semibold text-stone-800">
          查看 registry write gate checks / trace / handoff notes
        </summary>
        <div className="mt-3 grid gap-4 text-xs text-stone-600 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold text-stone-900">Checks</h3>
            <ul className="mt-2 grid gap-1">
              {gate.checks.slice(0, 14).map((check) => (
                <li key={check.id}>
                  {check.label}: {check.passed ? '通过' : check.severity}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Trace</h3>
            <ul className="mt-2 grid gap-1">
              <li>Source validation：{gate.trace.sourceValidationStatus}</li>
              <li>Source ready：{gate.trace.sourceReadyForRegistryWriteGate ? '是' : '否'}</li>
              <li>Registry write：{gate.trace.noActualRegistryWrite ? '阻断' : '风险'}</li>
              <li>Shell replacement：{gate.trace.noUserAppShellPackageReplacement ? '阻断' : '风险'}</li>
              <li>Production marker：{gate.trace.noProductionPackageMarker ? '无' : '风险'}</li>
              <li>Boundary safe：{gate.trace.userAppContractBoundarySafe ? '是' : '否'}</li>
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
