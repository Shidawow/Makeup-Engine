import type {
  UserAppTemplatePackageRegistryPreparation,
  UserAppTemplatePackageRegistryPreparationHandoff,
  UserAppTemplatePackageRegistryPreparationValidationResult,
} from '../../template-engine';

export interface UserAppTemplatePackageRegistryPreparationPanelProps {
  preparation: UserAppTemplatePackageRegistryPreparation;
  validation: UserAppTemplatePackageRegistryPreparationValidationResult;
  handoff: UserAppTemplatePackageRegistryPreparationHandoff;
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

export function UserAppTemplatePackageRegistryPreparationPanel({
  preparation,
  validation,
  handoff,
}: UserAppTemplatePackageRegistryPreparationPanelProps) {
  const failedChecks = validation.checks.filter((check) => !check.passed);

  return (
    <section className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-cyan-950">
            用户 App 模板包 Registry 准备
          </h2>
          <p className="mt-1 text-xs leading-5 text-cyan-900">
            10I 只准备 registry entry 预览和后续闸门材料，不执行写入；不会发布，也不会替换当前用户 App 包。
          </p>
        </div>
        <span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-cyan-900">
          Phase 10I preparation-only
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Registry Entry Preview</h3>
              <p className="mt-1 text-xs text-stone-500">仅供管理员审核的条目预览</p>
            </div>
            <span
              className={`rounded-md border px-2 py-1 text-xs ${statusClass(
                preparation.preparationStatus,
              )}`}
            >
              {preparation.preparationStatus}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>Package id：{preparation.packageIdCandidate}</p>
            <p>Version：{preparation.packageVersionCandidate}</p>
            <p>Title：{preparation.title}</p>
            <p>Steps：{preparation.stepCount}</p>
            <p>只是 registry 准备，不是写入。</p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Registry Preparation Validation</h3>
              <p className="mt-1 text-xs text-stone-500">
                检查 draft-only、隐私和边界
              </p>
            </div>
            <span
              className={`rounded-md border px-2 py-1 text-xs ${statusClass(
                validation.status,
              )}`}
            >
              {failedChecks.length} issues
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>
              Future write gate：
              {validation.readyForRegistryWriteGate ? '可进入未来闸门' : '不可进入'}
            </p>
            <p>JSON round-trip：{validation.jsonRoundTripStable ? '稳定' : '不稳定'}</p>
            <p>不会写入用户 App package registry。</p>
            <p>不会替换当前 User App Shell package。</p>
          </div>
          {preparation.blockedReasons.length > 0 ? (
            <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 p-2 text-xs text-rose-800">
              <p className="font-semibold">Blocked reasons</p>
              <ul className="mt-1 grid gap-1">
                {preparation.blockedReasons.slice(0, 5).map((reason) => (
                  <li key={reason.id}>{reason.message}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Registry Handoff</h3>
              <p className="mt-1 text-xs text-stone-500">交给后续 registry 写入闸门</p>
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
            <p>Source draft：{handoff.sourceOfficialDraftId}</p>
            <p>保持 draft-only；不会发布。</p>
            <p>不会替换用户 App Shell 当前消费的包。</p>
          </div>
        </div>
      </div>

      <details className="mt-3 rounded-md border border-cyan-200 bg-white p-3">
        <summary className="cursor-pointer text-sm font-semibold text-stone-800">
          查看 registry preparation checks / trace / handoff notes
        </summary>
        <div className="mt-3 grid gap-4 text-xs text-stone-600 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold text-stone-900">Checks</h3>
            <ul className="mt-2 grid gap-1">
              {validation.checks.slice(0, 12).map((check) => (
                <li key={check.id}>
                  {check.label}: {check.passed ? '通过' : check.severity}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Trace</h3>
            <ul className="mt-2 grid gap-1">
              <li>Publish gate：{preparation.trace.source.draftPublishGateStatus}</li>
              <li>Source ready：{preparation.trace.source.sourceReadyForRegistryPreparation ? '是' : '否'}</li>
              <li>Draft only：{preparation.draftTrace.draftOnly ? '是' : '否'}</li>
              <li>Publish blocked：{preparation.draftTrace.publishBlocked ? '是' : '否'}</li>
              <li>Registry write：{preparation.trace.noActualRegistryWrite ? '阻断' : '风险'}</li>
              <li>Shell replacement：{preparation.trace.noUserAppShellPackageReplacement ? '阻断' : '风险'}</li>
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
