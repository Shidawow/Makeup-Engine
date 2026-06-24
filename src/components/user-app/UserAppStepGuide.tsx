import { ArrowLeft, ArrowRight, CheckCircle2, Clock, MapPin, Sparkles } from 'lucide-react';
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
  const currentStepNumber = step
    ? template.steps.findIndex((candidate) => candidate.stepId === step.stepId) + 1
    : 0;
  const completedStepIds = new Set(template.progress?.completedStepIds ?? []);
  const isCurrentStepComplete = step ? completedStepIds.has(step.stepId) : false;
  const estimatedSeconds = step?.estimatedSeconds ?? 0;
  const estimatedLabel =
    estimatedSeconds >= 60
      ? `${Math.round(estimatedSeconds / 60)} 分钟`
      : estimatedSeconds > 0
        ? `${estimatedSeconds} 秒`
        : '按自己的节奏';
  const primaryTools = step?.guidance.toolChecklist.map((item) => item.label).join('、');
  const primaryProducts = step?.guidance.productChecklist.map((item) => item.label).join('、');

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-teal-700">分步骤跟练</p>
          <h2 className="text-lg font-semibold text-stone-950">
            {step?.title || '准备开始'}
          </h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            一次只看当前步骤。看清目标、工具和提示后，再完成本步骤。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="w-fit rounded bg-stone-100 px-3 py-1 text-xs text-stone-600">
            {step?.guidance.progressLabel ?? `共 ${template.steps.length} 步`}
          </span>
          {isCurrentStepComplete ? (
            <span className="w-fit rounded bg-teal-50 px-3 py-1 text-xs font-medium text-teal-900">
              已完成本步骤
            </span>
          ) : null}
        </div>
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

      <ol className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {template.steps.map((candidate, index) => {
          const isActive = step?.stepId === candidate.stepId;
          const isDone = completedStepIds.has(candidate.stepId);

          return (
            <li
              className={`rounded-md border px-2 py-2 text-xs ${
                isActive
                  ? 'border-teal-600 bg-teal-50 text-teal-950'
                  : isDone
                    ? 'border-teal-100 bg-white text-teal-800'
                    : 'border-stone-200 bg-stone-50 text-stone-500'
              }`}
              key={candidate.stepId}
            >
              <span className="block font-semibold">步骤 {index + 1}</span>
              <span className="mt-1 block truncate">{isDone ? '已完成' : candidate.guidance.stepCategory}</span>
            </li>
          );
        })}
      </ol>

      {blockedReason ? (
        <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm leading-6 text-rose-950">
          <p className="font-semibold">暂时不能继续</p>
          <p>{blockedReason}</p>
        </div>
      ) : null}

      {step ? (
        <article className="mt-4 grid gap-4">
          <div className="rounded-lg bg-teal-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-teal-800">
                  当前步骤 {currentStepNumber} / {template.steps.length}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-stone-950">{step.title}</h3>
              </div>
              <span className="inline-flex w-fit items-center gap-1 rounded bg-white px-3 py-1 text-xs font-medium text-teal-900">
                <Clock aria-hidden="true" size={14} />
                建议 {estimatedLabel}
              </span>
            </div>
            <p className="mt-3 text-base leading-7 text-stone-950">
              {step.guidance.userFriendlyInstructionText}
            </p>
            <p className="mt-3 rounded-md bg-white p-3 text-sm leading-6 text-teal-950">
              {step.guidance.shortInstructionSummary}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-stone-200 p-4">
              <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-stone-950">
                <MapPin aria-hidden="true" className="text-teal-700" size={16} />
                区域和目标
              </h3>
              <dl className="mt-2 grid gap-2 text-sm leading-6 text-stone-700">
                <div>
                  <dt className="font-medium text-stone-950">上妆区域</dt>
                  <dd>{step.guidance.stepCategory}</dd>
                </div>
                <div>
                  <dt className="font-medium text-stone-950">目标效果</dt>
                  <dd>{step.targetEffect || '完成当前区域效果'}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg border border-stone-200 p-4">
              <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-stone-950">
                <Sparkles aria-hidden="true" className="text-teal-700" size={16} />
                具体操作
              </h3>
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
            <div className="mt-2 grid gap-2 text-sm leading-6 text-stone-700 md:grid-cols-2">
              <p>
                工具：
                {primaryTools || '未列出'}
              </p>
              <p>
                产品：
                {primaryProducts || '未列出'}
              </p>
            </div>
            <p className="mt-2 rounded-md bg-stone-50 p-3 text-sm leading-6 text-stone-700">
              区域说明：{step.guidance.regionGuidanceSummary}
            </p>
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

          <div className="sticky bottom-3 grid gap-2 rounded-lg border border-stone-200 bg-white/95 p-2 shadow-soft sm:static sm:grid-cols-3 sm:bg-transparent sm:p-0 sm:shadow-none">
            <button
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-800 disabled:opacity-40"
              disabled={!template.previousStepId}
              onClick={() => template.previousStepId && onPreviousStep(template.previousStepId)}
              type="button"
            >
              <ArrowLeft aria-hidden="true" size={18} />
              上一步
            </button>
            <button
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
              disabled={!canAct}
              onClick={() => onCompleteStep(step.stepId)}
              type="button"
            >
              <CheckCircle2 aria-hidden="true" size={18} />
              {isLastStep ? '完成本次妆容' : isCurrentStepComplete ? '已完成，继续' : '完成本步骤'}
            </button>
            <button
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-800 disabled:opacity-40"
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
