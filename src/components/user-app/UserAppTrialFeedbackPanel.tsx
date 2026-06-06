import type { UserAppTrialFeedbackForm, UserAppTrialFeedbackSummary } from '../../user-app';

export interface UserAppTrialFeedbackPanelProps {
  form: UserAppTrialFeedbackForm;
  summary?: UserAppTrialFeedbackSummary;
}

const statusLabel: Record<UserAppTrialFeedbackForm['status'], string> = {
  ready: '可预览',
  warning: '有提醒',
  blocked: '阻断',
};

const statusClass: Record<UserAppTrialFeedbackForm['status'], string> = {
  ready: 'border-teal-200 bg-teal-50 text-teal-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  blocked: 'border-rose-200 bg-rose-50 text-rose-800',
};

export function UserAppTrialFeedbackPanel({ form, summary }: UserAppTrialFeedbackPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">Trial feedback preview</p>
          <h2 className="text-lg font-semibold text-stone-950">试用反馈表预览</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
            这里展示本地反馈结构和 mock/example 摘要，不是真实提交表单。
            不收集姓名、联系方式、照片、健康信息或敏感身份信息。
          </p>
        </div>
        <span className={`w-fit rounded-md border px-3 py-2 text-xs ${statusClass[form.status]}`}>
          {statusLabel[form.status]}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
        <p className="rounded-md bg-stone-50 p-3">问题：{form.questions.length}</p>
        <p className="rounded-md bg-stone-50 p-3">后端提交：{form.submitsToBackend ? '是' : '否'}</p>
        <p className="rounded-md bg-stone-50 p-3">训练输入：{form.writesTrainingInput ? '是' : '否'}</p>
      </div>

      {summary ? (
        <div className="mt-4 rounded-md border border-teal-200 bg-teal-50 p-3 text-sm leading-6 text-teal-950">
          Mock 摘要：{summary.answerCount} 条回答，平均评分
          {summary.averageRating ?? '暂无'}，困惑点：
          {summary.confusingStepMentions.join('、') || '暂无'}。这些数据仅为 example。
        </div>
      ) : null}

      <ol className="mt-4 grid gap-2">
        {form.questions.map((question) => (
          <li className="rounded-md border border-stone-200 bg-stone-50 p-3" key={question.questionId}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-teal-700">第 {question.order} 题</p>
                <h3 className="font-semibold text-stone-950">{question.prompt}</h3>
              </div>
              <span className="w-fit rounded-md bg-white px-2 py-1 text-xs text-stone-600">
                {question.kind}
                {question.required ? ' / 必填' : ' / 可选'}
              </span>
            </div>
          </li>
        ))}
      </ol>

      {form.issues.length > 0 ? (
        <div className="mt-4 grid gap-2">
          {form.issues.map((issue) => (
            <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950" key={issue.issueId}>
              {issue.severity === 'blocking' ? '阻断' : '提醒'}：{issue.message}
            </p>
          ))}
        </div>
      ) : null}
    </section>
  );
}
