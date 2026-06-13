import type { UserAppAnonymousTrialEvidenceReview } from '../../user-app';

export interface UserAppAnonymousTrialEvidenceReviewPanelProps {
  review: UserAppAnonymousTrialEvidenceReview;
}

const statusLabel: Record<UserAppAnonymousTrialEvidenceReview['status'], string> = {
  evidence_review_ready: '证据复盘完整',
  evidence_review_ready_with_warnings: '证据复盘有提醒',
  evidence_review_blocked: '证据复盘被阻断',
};

export function UserAppAnonymousTrialEvidenceReviewPanel({
  review,
}: UserAppAnonymousTrialEvidenceReviewPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9I anonymous evidence review
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">
          匿名试用证据复盘
        </h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          这是匿名 / 内部 / 本地 / 复盘阶段，只处理匿名摘要和聚合证据。
          不保存真实个人身份、不上传、不训练、不收集照片。
        </p>
      </div>

      <div className="mt-4 rounded-md border border-teal-100 bg-teal-50 p-3">
        <p className="text-xs font-semibold text-teal-700">复盘状态</p>
        <h3 className="mt-1 text-base font-semibold text-teal-950">
          {statusLabel[review.status]}
        </h3>
        <p className="mt-2 text-xs leading-5 text-teal-900">
          样本量：{review.sampleSize}；来源：{review.source}。
          {review.mockOrExampleOnly ? ' 当前仍是 mock/example，不得当作真实 validation evidence。' : ''}
        </p>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">Evidence completeness</h3>
          <div className="mt-2 grid gap-2">
            {review.completenessChecks.map((check) => (
              <p
                className={`rounded-md border p-3 text-xs leading-5 ${
                  check.passed
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    : 'border-amber-200 bg-amber-50 text-amber-900'
                }`}
                key={check.checkId}
              >
                <span className="font-semibold">{check.label}</span>：{check.message}
              </p>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-stone-800">隐私边界检查</h3>
          <div className="mt-2 grid gap-2">
            {review.privacyChecks.map((check) => (
              <p
                className={`rounded-md border p-3 text-xs leading-5 ${
                  check.passed
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    : 'border-red-200 bg-red-50 text-red-900'
                }`}
                key={check.checkId}
              >
                <span className="font-semibold">{check.label}</span>：{check.message}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">复盘证据项</h3>
          <div className="mt-2 grid gap-2">
            {review.items.map((item) => (
              <p
                className={`rounded-md border p-3 text-xs leading-5 ${
                  item.present
                    ? 'border-blue-200 bg-blue-50 text-blue-900'
                    : 'border-amber-200 bg-amber-50 text-amber-900'
                }`}
                key={item.itemId}
              >
                {item.label}：{item.summary}
              </p>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-stone-800">风险 / 停止事件</h3>
          <div className="mt-2 grid gap-2">
            {review.risks.length > 0 ? (
              review.risks.map((risk) => (
                <p
                  className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900"
                  key={risk.riskId}
                >
                  {risk.message} 处理：{risk.mitigation}
                </p>
              ))
            ) : (
              <p className="rounded-md border border-stone-200 bg-stone-50 p-3 text-xs text-stone-600">
                当前复盘没有阻断风险。
              </p>
            )}
            {review.privacyIncidents.map((incident) => (
              <p
                className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-900"
                key={incident}
              >
                隐私事件：{incident}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
