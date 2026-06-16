import type {
  TemplateDraftHumanReview,
  TemplateDraftQaResult,
  TemplateDraftReviewWorkflow,
  TemplateStudioWorkflowReport,
} from '../../template-engine';

export interface TemplateDraftReviewWorkflowPanelProps {
  draftQa: TemplateDraftQaResult;
  humanReview: TemplateDraftHumanReview;
  reviewWorkflow: TemplateDraftReviewWorkflow;
  studioWorkflow: TemplateStudioWorkflowReport;
}

const stepStatusLabel: Record<string, string> = {
  not_started: '未开始',
  ready: '就绪',
  warning: '警告',
  blocked: '阻断',
  needs_review: '待审核',
  approved_candidate: '候选就绪',
};

const statusClass = (status: string): string => {
  if (status === 'blocked') {
    return 'border-rose-200 bg-rose-50 text-rose-800';
  }
  if (status === 'warning' || status === 'needs_review') {
    return 'border-amber-200 bg-amber-50 text-amber-900';
  }
  if (status === 'approved_candidate' || status === 'ready') {
    return 'border-teal-200 bg-teal-50 text-teal-900';
  }
  return 'border-stone-200 bg-stone-50 text-stone-600';
};

export function TemplateDraftReviewWorkflowPanel({
  draftQa,
  humanReview,
  reviewWorkflow,
  studioWorkflow,
}: TemplateDraftReviewWorkflowPanelProps) {
  const blockingIssues = [...draftQa.issues, ...humanReview.issues].filter(
    (issue) => issue.severity === 'blocking',
  );
  const visibleChecklist = humanReview.checklist.slice(0, 6);

  return (
    <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-amber-950">
            模板草稿审核工作流
          </h2>
          <p className="mt-1 text-xs leading-5 text-amber-900">
            模板工作台只处理候选属性、步骤草稿、草稿 QA、人工审核和候选入库；不会直接发布，也不会自动生成 UserAppTemplatePackage。
          </p>
        </div>
        <span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-amber-900">
          {reviewWorkflow.queueItem.status}
        </span>
      </div>

      <div className="mt-4 rounded-md border border-amber-200 bg-white p-3">
        <p className="text-xs font-semibold uppercase text-stone-500">下一步</p>
        <p className="mt-1 text-sm font-semibold text-stone-950">
          {studioWorkflow.nextAction.message}
        </p>
        <p className="mt-1 text-xs text-stone-500">
          推荐进入：
          {studioWorkflow.tabRecommendation.activeTab === 'vision_analysis'
            ? '视觉分析 Tab'
            : '模板工作台 Tab'}
          {' '} / {studioWorkflow.tabRecommendation.reason}
        </p>
      </div>

      {blockingIssues.length > 0 ? (
        <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          <p className="font-semibold">阻断原因</p>
          <ul className="mt-2 grid gap-1 text-xs">
            {blockingIssues.slice(0, 3).map((issue) => (
              <li key={issue.id}>{issue.message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <ol className="mt-4 grid gap-2 sm:grid-cols-2">
        {studioWorkflow.steps.map((step, index) => (
          <li
            className={`rounded-md border p-2 text-xs ${statusClass(step.status)}`}
            key={step.id}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold">
                {index + 1}. {step.label}
              </span>
              <span>{stepStatusLabel[step.status]}</span>
            </div>
            <p className="mt-1 opacity-80">
              {step.ownerTab === 'vision_analysis' ? '视觉分析 Tab' : '模板工作台 Tab'}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div className="rounded-md bg-white p-3">
          <h3 className="text-sm font-semibold">草稿 QA</h3>
          <p className="mt-1 text-xs text-stone-600">{draftQa.status}</p>
          <p className="mt-2 text-xs text-stone-500">
            草稿可进入人工审核，但不能发布。
          </p>
        </div>
        <div className="rounded-md bg-white p-3">
          <h3 className="text-sm font-semibold">人工审核 checklist</h3>
          <ul className="mt-2 grid gap-1 text-xs text-stone-600">
            {visibleChecklist.map((item) => (
              <li key={item.id}>
                {item.checked ? '已确认' : '待确认'}：{item.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-md bg-white p-3">
          <h3 className="text-sm font-semibold">候选入库 handoff</h3>
          <p className="mt-1 text-xs text-stone-600">
            {reviewWorkflow.candidateHandoff.label}
          </p>
          <p className="mt-2 text-xs text-stone-500">
            候选入库不是发布模板；用户 App 契约仍需后续阶段单独生成。
          </p>
        </div>
      </div>

      <details className="mt-3 rounded-md border border-amber-200 bg-white p-3">
        <summary className="cursor-pointer text-sm font-semibold text-stone-800">
          查看 QA checks / 决策选项 / handoff 细节
        </summary>
        <div className="mt-3 grid gap-4 text-xs text-stone-600 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold text-stone-900">QA checks</h3>
            <ul className="mt-2 grid gap-1">
              {draftQa.checks.map((check) => (
                <li key={check.id}>
                  {check.passed ? '通过' : '需处理'}：{check.label}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">可选审核决策</h3>
            <ul className="mt-2 grid gap-1">
              <li>作为模板库候选</li>
              <li>请求修改</li>
              <li>拒绝草稿</li>
              <li>因区域质量阻断</li>
              <li>因隐私或范围阻断</li>
              <li>仅保留为示例</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">边界</h3>
            <ul className="mt-2 grid gap-1">
              <li>所有属性仍是候选。</li>
              <li>所有步骤仍是草稿。</li>
              <li>Approve 只是模板库候选。</li>
              <li>不会自动生成 UserAppTemplatePackage。</li>
            </ul>
          </div>
        </div>
      </details>
    </section>
  );
}
