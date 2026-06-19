import type {
  ControlledRegistryWriterDraft,
  ControlledRegistryWriterHandoff,
  ControlledRegistryWriterValidationResult,
} from '../../template-engine';

export interface ControlledUserAppTemplatePackageRegistryWriterDraftPanelProps {
  draft: ControlledRegistryWriterDraft;
  validation: ControlledRegistryWriterValidationResult;
  handoff: ControlledRegistryWriterHandoff;
}

const statusClass = (status: string): string => {
  if (status.includes('blocked')) {
    return 'border-rose-200 bg-rose-50 text-rose-800';
  }
  if (status.includes('warning')) {
    return 'border-amber-200 bg-amber-50 text-amber-900';
  }
  if (status.includes('ready')) {
    return 'border-cyan-200 bg-cyan-50 text-cyan-900';
  }
  return 'border-stone-200 bg-stone-50 text-stone-700';
};

export function ControlledUserAppTemplatePackageRegistryWriterDraftPanel({
  draft,
  validation,
  handoff,
}: ControlledUserAppTemplatePackageRegistryWriterDraftPanelProps) {
  const failedChecks = validation.checks.filter((check) => !check.passed);

  return (
    <section className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-cyan-950">
            受控 Registry 写入器草稿
          </h2>
          <p className="mt-1 text-xs leading-5 text-cyan-900">
            10K 是 dry-run only，不是实际写入；不会发布，也不会替换当前用户 App 包。
          </p>
        </div>
        <span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-cyan-900">
          Phase 10K dry-run writer draft
        </span>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Writer Draft</h3>
              <p className="mt-1 text-xs text-stone-500">
                只生成 dry-run write plan
              </p>
            </div>
            <span
              className={`rounded-md border px-2 py-1 text-xs ${statusClass(
                draft.writerDraftStatus,
              )}`}
            >
              {draft.writerDraftStatus}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>Package id：{draft.packageIdCandidate}</p>
            <p>Version：{draft.packageVersionCandidate}</p>
            <p>dry-run only：{draft.dryRunOnly ? '是' : '否'}</p>
            <p>actual write blocked：{draft.actualWriteBlocked ? '是' : '否'}</p>
            <p>不是实际写入，不会写入 registry。</p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Write Plan / Diff Preview</h3>
              <p className="mt-1 text-xs text-stone-500">
                可审核计划，不执行 mutation
              </p>
            </div>
            <span
              className={`rounded-md border px-2 py-1 text-xs ${statusClass(
                failedChecks.length > 0 ? 'blocked' : validation.status,
              )}`}
            >
              {failedChecks.length} issues
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>Write plan：{draft.writePlan.operations.length} dry-run operation</p>
            <p>Diff added：{draft.diffPreview.added.join(', ')}</p>
            <p>Rollback steps：{draft.rollbackPlan.steps.length}</p>
            <p>不会发布，也不会替换当前用户 App 包。</p>
          </div>
          {draft.blockedReasons.length > 0 ? (
            <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 p-2 text-xs text-rose-800">
              <p className="font-semibold">Blocked reasons</p>
              <ul className="mt-1 grid gap-1">
                {draft.blockedReasons.slice(0, 5).map((reason) => (
                  <li key={reason.id}>{reason.message}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Writer Handoff</h3>
              <p className="mt-1 text-xs text-stone-500">
                交给未来显式写入授权闸门
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
            <p>Validation：{validation.status}</p>
            <p>Next action：{handoff.nextAction}</p>
            <p>
              Future authorization：
              {handoff.readyForExplicitWriteAuthorizationGate ? '可进入' : '不可进入'}
            </p>
            <p>可进入未来显式写入授权闸门，但不能写入。</p>
          </div>
        </div>
      </div>

      <details className="mt-3 rounded-md border border-cyan-200 bg-white p-3">
        <summary className="cursor-pointer text-sm font-semibold text-stone-800">
          查看 write plan / diff preview / rollback plan / validation
        </summary>
        <div className="mt-3 grid gap-4 text-xs text-stone-600 lg:grid-cols-4">
          <div>
            <h3 className="font-semibold text-stone-900">Write plan</h3>
            <ul className="mt-2 grid gap-1">
              {draft.writePlan.operations.map((operation) => (
                <li key={operation.operationId}>
                  {operation.operationType}: {operation.status}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Diff preview</h3>
            <ul className="mt-2 grid gap-1">
              <li>Before：{draft.diffPreview.before.status}</li>
              <li>Added：{draft.diffPreview.added.join(', ')}</li>
              <li>Changed：{draft.diffPreview.changed.length}</li>
              <li>Removed：{draft.diffPreview.removed.length}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Rollback plan</h3>
            <ul className="mt-2 grid gap-1">
              {draft.rollbackPlan.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Validation / notes</h3>
            <ul className="mt-2 grid gap-1">
              {validation.checks.slice(0, 10).map((check) => (
                <li key={check.id}>
                  {check.label}: {check.passed ? '通过' : check.severity}
                </li>
              ))}
            </ul>
            <ul className="mt-3 grid gap-1">
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
