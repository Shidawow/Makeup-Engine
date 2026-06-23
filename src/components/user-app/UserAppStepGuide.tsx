import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { UserAppTemplateDetailViewModel } from '../../user-app';

export interface UserAppStepGuideProps {
  template: UserAppTemplateDetailViewModel;
  canEnterStepGuide: boolean;
  onPreviousStep: (stepId: string) => void;
  onNextStep: (stepId: string) => void;
  onCompleteStep: (stepId: string) => void;
}

export function UserAppStepGuide({
  template,
  canEnterStepGuide,
  onPreviousStep,
  onNextStep,
  onCompleteStep,
}: UserAppStepGuideProps) {
  const step = template.currentStep;
  const progressPercent = template.progress?.progressPercent ?? 0;
  const blockedReason = !canEnterStepGuide
    ? '当前妆容暂时不能开始跟练。'
    : step?.guidance.blockedReason;
  const canAct = Boolean(step && canEnterStepGuide && !blockedReason);
  const isLastStep = Boolean(step && !template.nextStepId);

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-teal-700">分步骤跟练</p>
          <h2 className="text-lg font-semibold text-stone-950">
            {step?.title || '准备开始'}
          </h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            一次只看当前步骤，完成后再进入下一步。
          </p>
        </div>
        <span className="w-fit rounded bg-stone-100 px-3 py-1 text-xs text-stone-600">
          {step?.guidance.progressLabel ?? `共 ${template.steps.length} 步`}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>跟练进度</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-stone-100">
          <div className="h-full bg-teal-700" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {blockedReason ? (
        <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm leading-6 text-rose-950">
          <p className="font-semibold">暂时不能继续</p>
          <p>{blockedReason}</p>
        </div>
      ) : null}

      {step ? (
        <article className="mt-4 grid gap-4">
          <div className="rounded-lg bg-teal-50 p-4">
            <p className="text-xs font-semibold text-teal-800">当前目标</p>
            <p className="mt-2 text-base leading-7 text-stone-950">
              {step.guidance.userFriendlyInstructionText}
            </p>
            <p className="mt-2 rounded-md bg-white p-3 text-sm leading-6 text-teal-950">
              {step.guidance.shortInstructionSummary}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-stone-200 p-4">
              <h3 className="text-sm font-semibold text-stone-950">区域和目的</h3>
              <dl className="mt-2 grid gap-2 text-sm leading-6 text-stone-700">
                <div>
                  <dt className="font-medium text-stone-950">上妆区域</dt>
                  <dd>{step.guidance.regionGuidanceSummary}</dd>
                </div>
                <div>
                  <dt className="font-medium text-stone-950">目标效果</dt>
                  <dd>{step.targetEffect || '完成当前区域效果'}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg border border-stone-200 p-4">
              <h3 className="text-sm font-semibold text-stone-950">操作提示</h3>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                {step.guidance.detailedInstruction}
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                手法：{step.technique || '按模板建议上妆'}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 p-4">
            <h3 className="text-sm font-semibold text-stone-950">本步骤需要</h3>
            <div className="mt-2 grid gap-2 text-sm text-stone-700 md:grid-cols-2">
              <p>
                工具：
                {step.guidance.toolChecklist.map((item) => item.label).join('、') || '未列出'}
              </p>
              <p>
                产品：
                {step.guidance.productChecklist.map((item) => item.label).join('、') || '未列出'}
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-stone-200 p-4">
              <h3 className="text-sm font-semibold text-stone-950">注意事项</h3>
              <ul className="mt-2 grid gap-2 text-sm leading-6 text-stone-700">
                {[...step.guidance.warningMessages, ...step.guidance.commonMistakes].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-stone-200 p-4">
              <h3 className="text-sm font-semibold text-stone-950">修正建议</h3>
              <ul className="mt-2 grid gap-2 text-sm leading-6 text-stone-700">
                {step.guidance.correctionTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-800 disabled:opacity-40"
              disabled={!template.previousStepId}
              onClick={() => template.previousStepId && onPreviousStep(template.previousStepId)}
              type="button"
            >
              <ArrowLeft aria-hidden="true" size={18} />
              上一步
            </button>
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
              disabled={!canAct}
              onClick={() => onCompleteStep(step.stepId)}
              type="button"
            >
              <CheckCircle2 aria-hidden="true" size={18} />
              {isLastStep ? '完成本次妆容' : '标记完成'}
            </button>
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-800 disabled:opacity-40"
              disabled={!template.nextStepId || !canAct}
              onClick={() => template.nextStepId && onNextStep(template.nextStepId)}
              type="button"
            >
              下一步
              <ArrowRight aria-hidden="true" size={18} />
            </button>
          </div>
        </article>
      ) : (
        <div className="mt-4 rounded-md border border-dashed border-stone-300 bg-stone-50 p-3 text-sm text-stone-600">
          这套妆容还没有步骤，暂时不能跟练。
        </div>
      )}
    </section>
  );
}
