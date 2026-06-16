import type {
  CandidateToAppPackageContractPreparation,
  CandidateToAppPackageHandoff,
  CandidateToAppPackageValidationResult,
} from '../../template-engine';

export interface CandidateToAppPackageContractPanelProps {
  preparation: CandidateToAppPackageContractPreparation;
  validation: CandidateToAppPackageValidationResult;
  handoff: CandidateToAppPackageHandoff;
}

const statusClass = (status: string): string => {
  if (status.includes('blocked')) {
    return 'border-rose-200 bg-rose-50 text-rose-800';
  }
  if (status.includes('warning')) {
    return 'border-amber-200 bg-amber-50 text-amber-900';
  }
  if (status.includes('ready')) {
    return 'border-teal-200 bg-teal-50 text-teal-900';
  }
  return 'border-stone-200 bg-stone-50 text-stone-700';
};

export function CandidateToAppPackageContractPanel({
  preparation,
  validation,
  handoff,
}: CandidateToAppPackageContractPanelProps) {
  const failedChecks = validation.checks.filter((check) => !check.passed);
  const previewFields = [
    preparation.titleMapping,
    preparation.summaryMapping,
    preparation.stepSequenceMapping,
    preparation.regionGuidanceMapping,
  ];

  return (
    <section className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-indigo-950">
            候选 App 包契约准备
          </h2>
          <p className="mt-1 text-xs leading-5 text-indigo-900">
            10D 只预览候选模板包到未来用户 App 包字段的映射；不是正式 UserAppTemplatePackage，不会自动生成用户 App 模板包，也不会发布。
          </p>
        </div>
        <span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-indigo-900">
          Phase 10D preview-only
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Contract Preparation</h3>
              <p className="mt-1 text-xs text-stone-500">字段映射预览 / 不写正式包</p>
            </div>
            <span className={`rounded-md border px-2 py-1 text-xs ${statusClass(preparation.contractStatus)}`}>
              {preparation.contractStatus}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>Preparation：{preparation.preparationId}</p>
            <p>Source candidate：{preparation.sourceCandidatePackageId}</p>
            <p>Mapping preview：{preparation.mappingPreviewOnly ? '仅预览' : '异常'}</p>
            <p>不是正式 UserAppTemplatePackage。</p>
          </div>
          {preparation.blockedReasons.length > 0 ? (
            <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 p-2 text-xs text-rose-800">
              <p className="font-semibold">阻断原因</p>
              <ul className="mt-1 grid gap-1">
                {preparation.blockedReasons.slice(0, 4).map((reason) => (
                  <li key={reason.id}>{reason.message}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">App Contract Validation</h3>
              <p className="mt-1 text-xs text-stone-500">检查映射、trace、隐私边界</p>
            </div>
            <span className={`rounded-md border px-2 py-1 text-xs ${statusClass(validation.status)}`}>
              {validation.status}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>JSON round-trip：{validation.jsonRoundTripStable ? '稳定' : '不稳定'}</p>
            <p>草稿准备：{validation.readyForUserAppPackageDraftPreview ? '可进入下一阶段' : '已阻断'}</p>
            <p>不会自动生成用户 App 模板包。</p>
          </div>
          {failedChecks.length > 0 ? (
            <details className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs">
              <summary className="cursor-pointer font-semibold text-amber-900">
                查看未通过 checks
              </summary>
              <ul className="mt-2 grid gap-1 text-amber-900">
                {failedChecks.slice(0, 6).map((check) => (
                  <li key={check.id}>{check.label}: {check.message}</li>
                ))}
              </ul>
            </details>
          ) : null}
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">App Package Handoff</h3>
              <p className="mt-1 text-xs text-stone-500">只交给后续草稿预览阶段</p>
            </div>
            <span className={`rounded-md border px-2 py-1 text-xs ${statusClass(handoff.status)}`}>
              {handoff.status}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>Next action：{handoff.nextAction}</p>
            <p>Decision：{handoff.decision}</p>
            <p>当前不写用户 App 包 registry。</p>
          </div>
        </div>
      </div>

      <details className="mt-3 rounded-md border border-indigo-200 bg-white p-3">
        <summary className="cursor-pointer text-sm font-semibold text-stone-800">
          查看 mapping preview / trace / handoff notes
        </summary>
        <div className="mt-3 grid gap-4 text-xs text-stone-600 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold text-stone-900">Mapping Preview</h3>
            <ul className="mt-2 grid gap-1">
              {previewFields.map((field) => (
                <li key={field.id}>
                  {field.sourceField} → {field.targetContractField}: {field.previewValue}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Trace</h3>
            <ul className="mt-2 grid gap-1">
              <li>QA trace：{preparation.trace.qaTracePreserved ? 'preserved' : 'missing'}</li>
              <li>Human review：{preparation.trace.humanReviewTracePreserved ? 'preserved' : 'missing'}</li>
              <li>Privacy：{preparation.trace.privacyTracePreserved ? 'preserved' : 'missing'}</li>
              <li>No registry write：{preparation.trace.noUserAppPackageRegistryWrite ? 'yes' : 'no'}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Handoff Notes</h3>
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
