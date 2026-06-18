import type {
  UserAppPackageDraftPreview,
  UserAppPackageDraftPreviewHandoff,
  UserAppPackageDraftPreviewValidationResult,
} from '../../template-engine';

export interface UserAppPackageDraftPreviewPanelProps {
  preview: UserAppPackageDraftPreview;
  validation: UserAppPackageDraftPreviewValidationResult;
  handoff: UserAppPackageDraftPreviewHandoff;
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

const PreviewList = ({ items }: { items: string[] }) => (
  <ul className="mt-2 grid gap-1 text-xs text-stone-600">
    {items.slice(0, 5).map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

export function UserAppPackageDraftPreviewPanel({
  preview,
  validation,
  handoff,
}: UserAppPackageDraftPreviewPanelProps) {
  const failedChecks = validation.checks.filter((check) => !check.passed);

  return (
    <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-emerald-950">
            用户 App 包草稿预览
          </h2>
          <p className="mt-1 text-xs leading-5 text-emerald-900">
            10E 只把 10D 契约准备预览成用户侧草稿体验；不是正式 UserAppTemplatePackage，不会写入用户 App 包 registry，也不会发布。
          </p>
        </div>
        <span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-emerald-900">
          Phase 10E draft preview
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Draft Preview</h3>
              <p className="mt-1 text-xs text-stone-500">用户侧字段草稿 / 管理员预览</p>
            </div>
            <span className={`rounded-md border px-2 py-1 text-xs ${statusClass(preview.previewStatus)}`}>
              {preview.previewStatus}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>标题：{preview.titlePreview}</p>
            <p>摘要：{preview.summaryPreview}</p>
            <p>难度：{preview.difficultyPreview}</p>
            <p>预计耗时：{preview.estimatedTimePreview}</p>
            <p>不是正式 UserAppTemplatePackage。</p>
          </div>
          {preview.blockedReasons.length > 0 ? (
            <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 p-2 text-xs text-rose-800">
              <p className="font-semibold">Validation blocked reasons</p>
              <ul className="mt-1 grid gap-1">
                {preview.blockedReasons.slice(0, 5).map((reason) => (
                  <li key={reason.id}>{reason.message}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Preview Validation</h3>
              <p className="mt-1 text-xs text-stone-500">检查文案、步骤、隐私和边界</p>
            </div>
            <span className={`rounded-md border px-2 py-1 text-xs ${statusClass(validation.status)}`}>
              {validation.status}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>JSON round-trip：{validation.jsonRoundTripStable ? '稳定' : '不稳定'}</p>
            <p>
              10F gate：
              {validation.readyForOfficialUserAppPackageDraftGate ? '可进入正式草稿准备' : '已阻断'}
            </p>
            <p>不会写入用户 App 包 registry。</p>
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
              <h3 className="text-sm font-semibold">Preview Handoff</h3>
              <p className="mt-1 text-xs text-stone-500">交给后续 official draft gate</p>
            </div>
            <span className={`rounded-md border px-2 py-1 text-xs ${statusClass(handoff.status)}`}>
              {handoff.status}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>Next action：{handoff.nextAction}</p>
            <p>Decision：{handoff.decision}</p>
            <p>草稿可进入人工 gate，但不能发布。</p>
          </div>
        </div>
      </div>

      <details className="mt-3 rounded-md border border-emerald-200 bg-white p-3">
        <summary className="cursor-pointer text-sm font-semibold text-stone-800">
          查看用户侧预览字段 / trace / boundary
        </summary>
        <div className="mt-3 grid gap-4 text-xs text-stone-600 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold text-stone-900">适用场景</h3>
            <PreviewList items={preview.suitableScenariosPreview} />
            <h3 className="mt-3 font-semibold text-stone-900">工具清单</h3>
            <PreviewList items={preview.toolsChecklistPreview} />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">步骤引导</h3>
            <PreviewList items={preview.stepGuidancePreview} />
            <h3 className="mt-3 font-semibold text-stone-900">区域说明</h3>
            <PreviewList items={preview.regionGuidancePreview} />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">隐私说明</h3>
            <p className="mt-2 leading-5">{preview.privacyNoticePreview}</p>
            <h3 className="mt-3 font-semibold text-stone-900">Trace</h3>
            <ul className="mt-2 grid gap-1">
              <li>QA trace：{preview.qaTrace}</li>
              <li>Human review：{preview.humanReviewTrace}</li>
              <li>Candidate：{preview.candidateTrace}</li>
              <li>Contract：{preview.contractTrace}</li>
            </ul>
          </div>
        </div>
      </details>
    </section>
  );
}
