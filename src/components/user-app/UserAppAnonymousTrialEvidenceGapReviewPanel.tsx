import type { UserAppAnonymousTrialEvidenceGapReview } from '../../user-app';

export interface UserAppAnonymousTrialEvidenceGapReviewPanelProps {
  gapReview: UserAppAnonymousTrialEvidenceGapReview;
}

const statusLabel: Record<UserAppAnonymousTrialEvidenceGapReview['status'], string> = {
  gap_review_clear: '没有关键缺口',
  gap_review_has_gaps: '存在证据缺口',
  gap_review_blocked: '缺口阻断下一步',
};

export function UserAppAnonymousTrialEvidenceGapReviewPanel({
  gapReview,
}: UserAppAnonymousTrialEvidenceGapReviewPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9I evidence gap review
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">证据缺口复盘</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          这里只复盘匿名内部试用的证据缺口，不保存真实身份、不上传、不训练、不收集照片。
          缺口会影响是否继续匿名内部试用或准备 MVP validation planning。
        </p>
      </div>

      <div className="mt-4 rounded-md border border-teal-100 bg-teal-50 p-3">
        <p className="text-xs font-semibold text-teal-700">缺口状态</p>
        <h3 className="mt-1 text-base font-semibold text-teal-950">
          {statusLabel[gapReview.status]}
        </h3>
        <p className="mt-2 text-xs leading-5 text-teal-900">
          缺口数量：{gapReview.gaps.length}。
        </p>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">缺口列表</h3>
          <div className="mt-2 grid gap-2">
            {gapReview.gaps.length > 0 ? (
              gapReview.gaps.map((gap) => (
                <p
                  className={`rounded-md border p-3 text-xs leading-5 ${
                    gap.severity === 'critical' || gap.severity === 'high'
                      ? 'border-red-200 bg-red-50 text-red-900'
                      : 'border-amber-200 bg-amber-50 text-amber-900'
                  }`}
                  key={gap.gapId}
                >
                  <span className="font-semibold">{gap.label}</span>（{gap.severity}）：
                  {gap.message}
                  {gap.blocksMvpValidationPlanning ? ' 该缺口会阻断 MVP validation planning。' : ''}
                </p>
              ))
            ) : (
              <p className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
                当前没有发现关键证据缺口。
              </p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-stone-800">建议</h3>
          <div className="mt-2 grid gap-2">
            {gapReview.recommendations.map((recommendation) => (
              <p
                className="rounded-md border border-blue-200 bg-blue-50 p-3 text-xs leading-5 text-blue-900"
                key={recommendation.recommendationId}
              >
                {recommendation.message} 下一步：{recommendation.nextAction}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
