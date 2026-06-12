import type { UserAppAnonymousTrialDryRunReview } from '../../user-app';

export interface UserAppAnonymousTrialDryRunReviewPanelProps {
  review: UserAppAnonymousTrialDryRunReview;
}

const decisionLabel: Record<UserAppAnonymousTrialDryRunReview['decision'], string> = {
  ready_for_anonymous_internal_trial: '可以准备匿名内部试用',
  ready_with_warnings: '可带提醒准备',
  repeat_dry_run: '建议重复 dry run',
  revise_protocol_before_trial: '先修订协议',
  revise_checklist_before_trial: '先修订 checklist',
  blocked_by_privacy_scope_issue: '隐私或范围阻断',
  blocked_by_missing_notice: '缺少参与者说明',
  blocked_by_forbidden_data_request: '存在禁止数据请求',
};

export function UserAppAnonymousTrialDryRunReviewPanel({
  review,
}: UserAppAnonymousTrialDryRunReviewPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9G dry run review
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">dry run 复盘</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          复盘只判断匿名内部试用 launch pack 是否可以准备。它不是正式数据采集系统，
          不上传、不训练、不用 AI 自动分析、不收集照片或真实个人资料。
        </p>
      </div>

      <div className="mt-4 rounded-md border border-teal-100 bg-teal-50 p-3">
        <p className="text-xs font-semibold text-teal-700">复盘结论</p>
        <h3 className="mt-1 text-base font-semibold text-teal-950">
          {decisionLabel[review.decision]}
        </h3>
        <p className="mt-2 text-xs leading-5 text-teal-900">
          {review.recommendation.message} 下一步：{review.recommendation.nextAction}
        </p>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">复盘信号</h3>
          <div className="mt-2 grid gap-2">
            {review.signals.map((signal) => (
              <p
                className={`rounded-md border p-3 text-xs leading-5 ${
                  signal.passed
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    : 'border-amber-200 bg-amber-50 text-amber-900'
                }`}
                key={signal.signalId}
              >
                {signal.label}：{signal.message}
              </p>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-stone-800">问题与处理</h3>
          <div className="mt-2 grid gap-2">
            {review.issues.length > 0 ? (
              review.issues.map((issue) => (
                <p
                  className={`rounded-md border p-3 text-xs leading-5 ${
                    issue.severity === 'critical'
                      ? 'border-red-200 bg-red-50 text-red-900'
                      : 'border-amber-200 bg-amber-50 text-amber-900'
                  }`}
                  key={issue.issueId}
                >
                  {issue.message} 处理方式：{issue.mitigation}
                </p>
              ))
            ) : (
              <p className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs leading-5 text-emerald-900">
                未发现阻断问题。仍需保持匿名、本地、不上传、不训练。
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
