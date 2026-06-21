import type {
  RealWriteApprovalBoundaryResult,
  RealWriteApprovalChecklist,
  RealWriteApprovalHandoff,
} from '../../template-engine';

export interface RealWriteApprovalBoundaryPanelProps {
  boundary: RealWriteApprovalBoundaryResult;
  checklist: RealWriteApprovalChecklist;
  handoff: RealWriteApprovalHandoff;
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

export function RealWriteApprovalBoundaryPanel({
  boundary,
  checklist,
  handoff,
}: RealWriteApprovalBoundaryPanelProps) {
  const failedChecks = boundary.checks.filter((check) => !check.passed);

  return (
    <section className="rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-blue-950">
            真实写入批准边界
          </h2>
          <p className="mt-1 text-xs leading-5 text-blue-900">
            批准边界，不是实际写入；不授权真实写入 registry，不 mutation registry，不发布，不替换当前用户 App 包，不创建 production writer。未来真实写入仍需老板单独明确授权。
          </p>
        </div>
        <span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-blue-900">
          Phase 10U approval boundary only
        </span>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Boundary Status</h3>
              <p className="mt-1 text-xs text-stone-500">
                只判断是否可进入未来真实写入授权请求
              </p>
            </div>
            <span
              className={`rounded-md border px-2 py-1 text-xs ${statusClass(
                boundary.status,
              )}`}
            >
              {boundary.status}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>approval scope：{boundary.approvalScope}</p>
            <p>decision：{boundary.decision}</p>
            <p>failed checks：{failedChecks.length}</p>
            <p>
              future request：
              {boundary.readyForFutureActualWriteAuthorizationRequest
                ? '可进入'
                : '不可进入'}
            </p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Approval Checklist</h3>
              <p className="mt-1 text-xs text-stone-500">
                复核批准范围、audit requirements、rollback approval requirements
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
            <p>requirements：{checklist.requirements.length}</p>
            <p>
              blocked：
              {
                checklist.requirements.filter(
                  (requirement) => requirement.required && !requirement.satisfied,
                ).length
              }
            </p>
            <p>checklist 不触发写入，也不 mutation registry。</p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Approval Handoff</h3>
              <p className="mt-1 text-xs text-stone-500">
                只交给 Phase 10V 或以后授权请求
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
            <p>next action：{handoff.nextAction}</p>
            <p>未来真实写入仍需老板单独明确授权。</p>
            <p>不会创建 production writer。</p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">No Actual Write</p>
          <p className="mt-1">不授权真实写入 registry。</p>
          <p className="mt-1">
            actual write blocked：{boundary.actualWriteBlocked ? '是' : '否'}
          </p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">No Mutation</p>
          <p className="mt-1">不 mutation registry。</p>
          <p className="mt-1">
            registry mutation blocked：
            {boundary.registryMutationBlocked ? '是' : '否'}
          </p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">No Publish</p>
          <p className="mt-1">不发布。</p>
          <p className="mt-1">publish blocked：{boundary.publishBlocked ? '是' : '否'}</p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">No Shell Replacement</p>
          <p className="mt-1">不替换当前用户 App 包。</p>
          <p className="mt-1">
            replacement blocked：
            {boundary.packageReplacementBlocked ? '是' : '否'}
          </p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">No Production Writer</p>
          <p className="mt-1">不创建 production writer。</p>
          <p className="mt-1">
            writer blocked：{boundary.productionWriterBlocked ? '是' : '否'}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">audit requirements</p>
          <ul className="mt-2 grid gap-1">
            {boundary.auditRequirements.map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">
            rollback approval requirements
          </p>
          <ul className="mt-2 grid gap-1">
            {boundary.rollbackApprovalRequirements.map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
          </ul>
        </div>
      </div>

      {boundary.blockedReasons.length > 0 ? (
        <div className="mt-3 rounded-md border border-rose-200 bg-white p-3 text-xs text-rose-800">
          <p className="font-semibold">Blocked reasons</p>
          <ul className="mt-2 grid gap-1">
            {boundary.blockedReasons.slice(0, 8).map((reason) => (
              <li key={reason.id}>{reason.message}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-3 rounded-md border border-emerald-200 bg-white p-3 text-xs text-emerald-900">
          可进入未来真实写入授权请求；这仍然不是实际 registry 写入，不是 registry mutation，不是发布，不是 production writer。
        </div>
      )}

      <details className="mt-3 rounded-md border border-blue-200 bg-white p-3">
        <summary className="cursor-pointer text-sm font-semibold text-stone-800">
          查看 approval checks / checklist / handoff details
        </summary>
        <div className="mt-3 grid gap-4 text-xs text-stone-600 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold text-stone-900">Approval checks</h3>
            <ul className="mt-2 grid gap-1">
              {boundary.checks.slice(0, 18).map((check) => (
                <li key={check.id}>
                  {check.id}: {check.passed ? 'pass' : 'blocked'}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Checklist items</h3>
            <ul className="mt-2 grid gap-1">
              {checklist.items.map((item) => (
                <li key={item.id}>
                  {item.label}: {item.status}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Handoff notes</h3>
            <ul className="mt-2 grid gap-1">
              {handoff.notes.slice(0, 8).map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      </details>
    </section>
  );
}
