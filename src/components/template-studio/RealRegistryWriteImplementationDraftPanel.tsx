import type {
  RealRegistryWriteImplementationDraft,
  RealRegistryWriteImplementationDraftHandoff,
  RealRegistryWriteImplementationDraftValidationResult,
} from '../../template-engine';

export interface RealRegistryWriteImplementationDraftPanelProps {
  draft: RealRegistryWriteImplementationDraft;
  validation: RealRegistryWriteImplementationDraftValidationResult;
  handoff: RealRegistryWriteImplementationDraftHandoff;
}

const statusClass = (status: string): string => {
  if (status.includes('blocked')) {
    return 'border-rose-200 bg-rose-50 text-rose-800';
  }
  if (status.includes('warning')) {
    return 'border-amber-200 bg-amber-50 text-amber-900';
  }
  if (status.includes('ready')) {
    return 'border-purple-200 bg-purple-50 text-purple-900';
  }
  return 'border-stone-200 bg-stone-50 text-stone-700';
};

export function RealRegistryWriteImplementationDraftPanel({
  draft,
  validation,
  handoff,
}: RealRegistryWriteImplementationDraftPanelProps) {
  const failedChecks = validation.checks.filter((check) => !check.passed);

  return (
    <section className="rounded-lg border border-purple-200 bg-purple-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-purple-950">
            真实 Registry 写入实现草稿
          </h2>
          <p className="mt-1 text-xs leading-5 text-purple-900">
            10O 只是 implementation draft，不是实际写入，不是 production writer；仍然 dry-run only，不会发布，不会替换当前用户 App 包。未来真实 writer 仍需老板单独授权。
          </p>
        </div>
        <span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-purple-900">
          Phase 10O draft only
        </span>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Draft Status</h3>
              <p className="mt-1 text-xs text-stone-500">
                可进入未来最终真实写入复核闸门
              </p>
            </div>
            <span
              className={`rounded-md border px-2 py-1 text-xs ${statusClass(
                draft.implementationDraftStatus,
              )}`}
            >
              {draft.implementationDraftStatus}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>dry-run only：{draft.dryRunOnly ? '是' : '否'}</p>
            <p>actual write blocked：{draft.actualWriteBlocked ? '是' : '否'}</p>
            <p>production writer blocked：{draft.productionWriterBlocked ? '是' : '否'}</p>
            <p>不是实际写入；不会写入 registry。</p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Draft Validation</h3>
              <p className="mt-1 text-xs text-stone-500">
                校验 interface / transaction / lock / audit / rollback
              </p>
            </div>
            <span
              className={`rounded-md border px-2 py-1 text-xs ${statusClass(
                validation.status,
              )}`}
            >
              {validation.status}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>Checks：{validation.checks.length}</p>
            <p>Failed checks：{failedChecks.length}</p>
            <p>不会发布，也不会替换当前用户 App 包。</p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Draft Handoff</h3>
              <p className="mt-1 text-xs text-stone-500">
                交给 Phase 10P 或以后复核
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
              Final review gate：
              {handoff.readyForFinalRealWriteReviewGate ? '可进入未来复核' : '不可进入'}
            </p>
            <p>未来真实 writer 仍需老板单独授权。</p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-5">
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">Writer Interface</p>
          <p className="mt-1">{draft.writerInterfaceDraft?.label ?? '缺失'}</p>
          <p className="mt-1">Methods：{draft.writerInterfaceDraft?.methods.length ?? 0}</p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">Transaction</p>
          <p className="mt-1">{draft.transactionDraft?.mode ?? '缺失'}</p>
          <p className="mt-1">Steps：{draft.transactionDraft?.steps.length ?? 0}</p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">Write Lock</p>
          <p className="mt-1">{draft.writeLockDraft?.summary ?? '缺失'}</p>
          <p className="mt-1">Locks：{draft.writeLockDraft?.locks.length ?? 0}</p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">Audit Event</p>
          <p className="mt-1">{draft.auditEventDraft?.summary ?? '缺失'}</p>
          <p className="mt-1">Events：{draft.auditEventDraft?.events.length ?? 0}</p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">Rollback Command</p>
          <p className="mt-1">{draft.rollbackCommandDraft?.summary ?? '缺失'}</p>
          <p className="mt-1">Commands：{draft.rollbackCommandDraft?.commands.length ?? 0}</p>
        </div>
      </div>

      {draft.blockedReasons.length > 0 ? (
        <div className="mt-3 rounded-md border border-rose-200 bg-white p-3 text-xs text-rose-800">
          <p className="font-semibold">Blocked reasons</p>
          <ul className="mt-2 grid gap-1">
            {draft.blockedReasons.slice(0, 7).map((reason) => (
              <li key={reason.id}>{reason.message}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-3 rounded-md border border-purple-200 bg-white p-3 text-xs text-purple-900">
          可进入未来最终真实写入复核闸门；这仍然不是实际 registry 写入，也不是 production writer。
        </div>
      )}

      <details className="mt-3 rounded-md border border-purple-200 bg-white p-3">
        <summary className="cursor-pointer text-sm font-semibold text-stone-800">
          查看 implementation draft checks / trace / handoff notes
        </summary>
        <div className="mt-3 grid gap-4 text-xs text-stone-600 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold text-stone-900">Validation checks</h3>
            <ul className="mt-2 grid gap-1">
              {validation.checks.slice(0, 14).map((check) => (
                <li key={check.id}>
                  {check.label}: {check.passed ? '通过' : check.severity}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Trace</h3>
            <ul className="mt-2 grid gap-1">
              <li>Gate：{draft.sourceImplementationGateId}</li>
              <li>Execution：{draft.sourceExecutionDesignId}</li>
              <li>Writer：{draft.sourceWriterDraftId}</li>
              <li>Implementation draft only：是</li>
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
