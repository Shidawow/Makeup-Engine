import type {
  UserAppGuidanceChecklistItem,
  UserAppTemplateDetailViewModel,
} from '../../user-app';

export interface UserMakeupStepGuideProps {
  template: UserAppTemplateDetailViewModel;
  canEnterStepGuide: boolean;
  onPreviousStep: (stepId: string) => void;
  onNextStep: (stepId: string) => void;
  onCompleteStep: (stepId: string) => void;
  onSkipStep: (stepId: string) => void;
}

const renderChecklist = (
  items: UserAppGuidanceChecklistItem[],
  emptyText: string,
) => (
  <ul className="mt-2 grid gap-2 text-sm">
    {items.length > 0 ? (
      items.map((item) => (
        <li
          className={`rounded-md border px-3 py-2 ${
            item.missing
              ? 'border-amber-200 bg-amber-50 text-amber-950'
              : 'border-stone-200 bg-white text-stone-700'
          }`}
          key={item.id}
        >
          <span className="font-medium text-stone-950">{item.label}</span>
          <span className="ml-2 text-xs text-stone-500">
            {item.required ? '必备' : '可选'}
          </span>
          {item.usageNotes.length > 0 ? (
            <span className="mt-1 block text-xs leading-5 text-stone-600">
              {item.usageNotes.join('；')}
            </span>
          ) : null}
        </li>
      ))
    ) : (
      <li className="rounded-md border border-dashed border-stone-300 bg-stone-50 px-3 py-2 text-stone-500">
        {emptyText}
      </li>
    )}
  </ul>
);

export function UserMakeupStepGuide({
  template,
  canEnterStepGuide,
  onPreviousStep,
  onNextStep,
  onCompleteStep,
  onSkipStep,
}: UserMakeupStepGuideProps) {
  const step = template.currentStep;
  const blockedReason = !canEnterStepGuide
    ? '当前模板存在阻断问题，暂时不能开始分步指导。'
    : step?.guidance.blockedReason;
  const canActOnStep = Boolean(step && canEnterStepGuide && !blockedReason);

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">
            Step-by-step guidance
          </p>
          <h3 className="text-lg font-semibold text-stone-950">分步化妆指导</h3>
        </div>
        <span className="w-fit rounded-md bg-stone-100 px-3 py-1 text-xs text-stone-600">
          共 {template.steps.length} 步
        </span>
      </div>

      {blockedReason ? (
        <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm leading-6 text-rose-950">
          <p className="font-semibold">暂时不能继续指导</p>
          <p>{blockedReason}</p>
          <p className="mt-1 text-xs">请先修正模板数据，再回到这一步。</p>
        </div>
      ) : null}

      {template.steps.length === 0 ? (
        <div className="mt-3 rounded-md border border-dashed border-stone-300 bg-stone-50 p-3 text-sm text-stone-600">
          当前模板没有可展示的步骤，暂时不能生成用户侧分步指导。
        </div>
      ) : null}

      {step ? (
        <article className="mt-4 grid gap-4">
          <div className="rounded-lg bg-stone-50 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-teal-700">
                  {step.guidance.progressLabel}
                </p>
                <h4 className="mt-1 text-xl font-semibold text-stone-950">
                  {step.title || '未命名步骤'}
                </h4>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded bg-white px-2 py-1 text-stone-600">
                  {step.guidance.stepCategory}
                </span>
                <span className="rounded bg-white px-2 py-1 text-stone-600">
                  约 {step.estimatedSeconds} 秒
                </span>
              </div>
            </div>

            <p className="mt-3 text-base leading-7 text-stone-900">
              {step.guidance.userFriendlyInstructionText}
            </p>
            <p className="mt-2 rounded-md border border-teal-100 bg-teal-50 p-3 text-sm leading-6 text-teal-950">
              {step.guidance.shortInstructionSummary}
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-lg border border-stone-200 p-4">
              <h5 className="text-sm font-semibold text-stone-950">怎么画</h5>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                {step.guidance.detailedInstruction}
              </p>
              <dl className="mt-3 grid gap-2 text-sm text-stone-600 sm:grid-cols-2">
                <div>
                  <dt className="font-medium text-stone-900">上妆区域</dt>
                  <dd>{step.guidance.regionGuidanceSummary}</dd>
                </div>
                <div>
                  <dt className="font-medium text-stone-900">手法</dt>
                  <dd>{step.technique || '按模板建议上妆'}</dd>
                </div>
                <div>
                  <dt className="font-medium text-stone-900">目标效果</dt>
                  <dd>{step.targetEffect || '完成当前区域效果'}</dd>
                </div>
                <div>
                  <dt className="font-medium text-stone-900">颜色 / 强度</dt>
                  <dd>
                    {step.colorHint ?? '未指定颜色'} / {step.intensity}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg border border-stone-200 p-4">
              <h5 className="text-sm font-semibold text-stone-950">本步骤准备</h5>
              <p className="mt-2 text-xs text-stone-500">工具</p>
              {renderChecklist(step.guidance.toolChecklist, '这一步没有列出工具。')}
              <p className="mt-3 text-xs text-stone-500">产品</p>
              {renderChecklist(step.guidance.productChecklist, '这一步没有列出产品。')}
            </div>
          </div>

          {step.guidance.warningMessages.length > 0 ? (
            <ul className="grid gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
              {step.guidance.warningMessages.map((warning) => (
                <li key={warning}>提醒：{warning}</li>
              ))}
            </ul>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-stone-200 p-4">
              <h5 className="text-sm font-semibold text-stone-950">常见错误</h5>
              <ul className="mt-2 grid gap-2 text-sm leading-6 text-stone-700">
                {step.guidance.commonMistakes.map((mistake) => (
                  <li key={mistake}>{mistake}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-stone-200 p-4">
              <h5 className="text-sm font-semibold text-stone-950">修正建议</h5>
              <ul className="mt-2 grid gap-2 text-sm leading-6 text-stone-700">
                {step.guidance.correctionTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-4">
            <button
              className="rounded-md border border-stone-300 px-3 py-3 text-sm text-stone-700 disabled:opacity-40"
              disabled={!template.previousStepId}
              onClick={() => template.previousStepId && onPreviousStep(template.previousStepId)}
              type="button"
            >
              上一步
            </button>
            <button
              className="rounded-md bg-teal-700 px-3 py-3 text-sm font-semibold text-white disabled:opacity-40"
              disabled={!canActOnStep}
              onClick={() => onCompleteStep(step.stepId)}
              type="button"
            >
              标记完成
            </button>
            <button
              className="rounded-md border border-stone-300 px-3 py-3 text-sm text-stone-700 disabled:opacity-40"
              disabled={!canActOnStep}
              onClick={() => onSkipStep(step.stepId)}
              type="button"
            >
              跳过
            </button>
            <button
              className="rounded-md border border-stone-300 px-3 py-3 text-sm text-stone-700 disabled:opacity-40"
              disabled={!template.nextStepId || !canActOnStep}
              onClick={() => template.nextStepId && onNextStep(template.nextStepId)}
              type="button"
            >
              下一步
            </button>
          </div>
        </article>
      ) : null}
    </section>
  );
}
