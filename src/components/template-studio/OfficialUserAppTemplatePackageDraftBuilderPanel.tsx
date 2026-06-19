import type {
  OfficialUserAppTemplatePackageDraftBuilderResult,
  OfficialUserAppTemplatePackageDraftHandoff,
  OfficialUserAppTemplatePackageDraftValidationResult,
} from '../../template-engine';

export interface OfficialUserAppTemplatePackageDraftBuilderPanelProps {
  builderResult: OfficialUserAppTemplatePackageDraftBuilderResult;
  validation: OfficialUserAppTemplatePackageDraftValidationResult;
  handoff: OfficialUserAppTemplatePackageDraftHandoff;
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

export function OfficialUserAppTemplatePackageDraftBuilderPanel({
  builderResult,
  validation,
  handoff,
}: OfficialUserAppTemplatePackageDraftBuilderPanelProps) {
  const { draft } = builderResult;
  const failedChecks = validation.checks.filter((check) => !check.passed);

  return (
    <section className="rounded-lg border border-violet-200 bg-violet-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-violet-950">
            正式用户 App 模板包草稿构建器
          </h2>
          <p className="mt-1 text-xs leading-5 text-violet-900">
            10G 只从 10F gate ready 输入构建本地草稿；草稿，不是正式包，不会写入 registry，不会发布，也不会替换当前 User App Shell package。
          </p>
        </div>
        <span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-violet-900">
          Phase 10G draft-only
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Draft Builder</h3>
              <p className="mt-1 text-xs text-stone-500">从 10F gate 构建草稿对象</p>
            </div>
            <span className={`rounded-md border px-2 py-1 text-xs ${statusClass(draft.draftStatus)}`}>
              {draft.draftStatus}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>Title：{draft.title}</p>
            <p>Difficulty：{draft.difficulty}</p>
            <p>Estimated time：{draft.estimatedTime}</p>
            <p>Steps：{draft.stepSequence.length}</p>
            <p>Draft only：{draft.draftOnly ? '是' : '否'}</p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Draft Validation</h3>
              <p className="mt-1 text-xs text-stone-500">检查草稿边界和用户可见字段</p>
            </div>
            <span className={`rounded-md border px-2 py-1 text-xs ${statusClass(validation.status)}`}>
              {validation.status}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>Failed checks：{failedChecks.length}</p>
            <p>不会写入 registry。</p>
            <p>不会发布。</p>
            <p>不会替换当前 User App Shell package。</p>
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
              <h3 className="text-sm font-semibold">Draft Handoff</h3>
              <p className="mt-1 text-xs text-stone-500">交给后续草稿发布闸门</p>
            </div>
            <span className={`rounded-md border px-2 py-1 text-xs ${statusClass(handoff.status)}`}>
              {handoff.status}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>Next action：{handoff.nextAction}</p>
            <p>Decision：{handoff.decision}</p>
            <p>
              {validation.readyForDraftPublishGate
                ? '可进入草稿发布闸门；这仍不是发布。'
                : '不能进入草稿发布闸门。'}
            </p>
          </div>
        </div>
      </div>

      <details className="mt-3 rounded-md border border-violet-200 bg-white p-3">
        <summary className="cursor-pointer text-sm font-semibold text-stone-800">
          查看 draft sections / validation checks / handoff notes
        </summary>
        <div className="mt-3 grid gap-4 text-xs text-stone-600 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold text-stone-900">Sections</h3>
            <ul className="mt-2 grid gap-1">
              {draft.sections.map((section) => (
                <li key={section.id}>
                  {section.label}: {section.status} / {section.items.length}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Validation checks</h3>
            <ul className="mt-2 grid gap-1">
              {validation.checks.slice(0, 8).map((check) => (
                <li key={check.id}>
                  {check.label}: {check.passed ? '通过' : check.severity}
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
