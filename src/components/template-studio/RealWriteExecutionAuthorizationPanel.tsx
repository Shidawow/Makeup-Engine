import type {
  RealWriteExecutionAuthorizationChecklist,
  RealWriteExecutionAuthorizationHandoff,
  RealWriteExecutionAuthorizationResult,
} from '../../template-engine';

export interface RealWriteExecutionAuthorizationPanelProps {
  authorization: RealWriteExecutionAuthorizationResult;
  checklist: RealWriteExecutionAuthorizationChecklist;
  handoff: RealWriteExecutionAuthorizationHandoff;
}

const statusClass = (status: string): string => {
  if (status.includes('blocked')) {
    return 'border-rose-200 bg-rose-50 text-rose-800';
  }
  if (status.includes('warning')) {
    return 'border-amber-200 bg-amber-50 text-amber-900';
  }
  if (status.includes('ready')) {
    return 'border-emerald-200 bg-emerald-50 text-emerald-900';
  }
  return 'border-stone-200 bg-stone-50 text-stone-700';
};

export function RealWriteExecutionAuthorizationPanel({
  authorization,
  checklist,
  handoff,
}: RealWriteExecutionAuthorizationPanelProps) {
  const failedChecks = authorization.checks.filter((check) => !check.passed);
  const checklistBlocked = checklist.items.filter(
    (item) => item.status === 'blocked',
  );

  return (
    <section className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-cyan-950">
            真实写入执行授权
          </h2>
          <p className="mt-1 text-xs leading-5 text-cyan-900">
            老板授权范围：只授权进入 10Q 授权阶段；不授权真实写入 registry，不授权发布，不授权替换当前用户 App 包，不授权创建 production writer。10Q 不是实际写入，仍然 dry-run only。
          </p>
        </div>
        <span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-cyan-900">
          Phase 10Q authorization model only
        </span>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Authorization Status</h3>
              <p className="mt-1 text-xs text-stone-500">
                只判断能否进入未来真实写入执行计划
              </p>
            </div>
            <span
              className={`rounded-md border px-2 py-1 text-xs ${statusClass(
                authorization.status,
              )}`}
            >
              {authorization.status}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>owner scope：{authorization.ownerAuthorizationScope}</p>
            <p>dry-run only：{authorization.dryRunOnly ? '是' : '否'}</p>
            <p>
              actual write blocked：
              {authorization.actualWriteBlocked ? '是' : '否'}
            </p>
            <p>不是实际写入；不会写入 registry。</p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Authorization Checklist</h3>
              <p className="mt-1 text-xs text-stone-500">
                复核 owner scope、dry-run、no write、no publish、no production writer
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
            <p>Blocked items：{checklistBlocked.length}</p>
            <p>不会发布，也不会替换当前用户 App 包。</p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Authorization Handoff</h3>
              <p className="mt-1 text-xs text-stone-500">
                只交给 Phase 10R 或以后执行计划
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
              Future execution plan：
              {handoff.readyForFutureRealWriteExecutionPlan
                ? '可进入未来计划'
                : '不可进入'}
            </p>
            <p>未来真实写入仍需老板另行明确授权。</p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">Owner Authorization</p>
          <p className="mt-1">{authorization.ownerAuthorizationText}</p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">No Actual Write</p>
          <p className="mt-1">
            actual write blocked：
            {authorization.actualWriteBlocked ? '是' : '否'}
          </p>
          <p className="mt-1">
            production write disabled：
            {authorization.productionWriteStillDisabled ? '是' : '否'}
          </p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">No Publish / Shell Swap</p>
          <p className="mt-1">
            publish blocked：{authorization.publishBlocked ? '是' : '否'}
          </p>
          <p className="mt-1">
            shell replacement blocked：
            {authorization.packageReplacementBlocked ? '是' : '否'}
          </p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">No Production Writer</p>
          <p className="mt-1">
            production writer blocked：
            {authorization.productionWriterBlocked ? '是' : '否'}
          </p>
          <p className="mt-1">
            separate approval：
            {authorization.futureActualWriteRequiresSeparateApproval
              ? '需要'
              : '缺失'}
          </p>
        </div>
      </div>

      {authorization.blockedReasons.length > 0 ? (
        <div className="mt-3 rounded-md border border-rose-200 bg-white p-3 text-xs text-rose-800">
          <p className="font-semibold">Blocked reasons</p>
          <ul className="mt-2 grid gap-1">
            {authorization.blockedReasons.slice(0, 7).map((reason) => (
              <li key={reason.id}>{reason.message}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-3 rounded-md border border-emerald-200 bg-white p-3 text-xs text-emerald-900">
          可进入未来真实写入执行计划；这仍然不是实际 registry 写入，也不是 production writer。
        </div>
      )}

      <details className="mt-3 rounded-md border border-cyan-200 bg-white p-3">
        <summary className="cursor-pointer text-sm font-semibold text-stone-800">
          查看 authorization checks / checklist / handoff notes
        </summary>
        <div className="mt-3 grid gap-4 text-xs text-stone-600 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold text-stone-900">Authorization checks</h3>
            <ul className="mt-2 grid gap-1">
              {authorization.checks.slice(0, 14).map((check) => (
                <li key={check.id}>
                  {check.label}: {check.passed ? '通过' : check.severity}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Checklist</h3>
            <ul className="mt-2 grid gap-1">
              {checklist.items.slice(0, 10).map((item) => (
                <li key={item.id}>
                  {item.label}: {item.status}
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
        <p className="mt-3 text-xs text-stone-500">
          ready checks：{authorization.checks.length - failedChecks.length}
        </p>
      </details>
    </section>
  );
}
