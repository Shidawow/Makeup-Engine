import type { UserTemplateRecommendation } from '../../user-app';
import { createWhyNotRecommendedMessage } from '../../user-app';

export interface UserRecommendationReasonPanelProps {
  recommendation?: UserTemplateRecommendation | null;
}

export function UserRecommendationReasonPanel({
  recommendation,
}: UserRecommendationReasonPanelProps) {
  if (!recommendation) {
    return (
      <section className="rounded-lg border border-dashed border-stone-300 bg-white p-4 text-sm text-stone-600">
        选择一套推荐妆容后，这里会显示为什么推荐。当前没有使用真实 AI 推荐。
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-teal-200 bg-teal-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">
            Recommendation reasons
          </p>
          <h3 className="text-base font-semibold text-stone-950">
            为什么推荐「{recommendation.title}」
          </h3>
        </div>
        <span className="rounded-md bg-white px-2 py-1 text-xs text-stone-600">
          本地规则排序 #{recommendation.rank}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-stone-700">
        {recommendation.whyRecommended}
      </p>
      {recommendation.warningMessages.length > 0 ? (
        <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          {createWhyNotRecommendedMessage(recommendation.reasons)}
        </div>
      ) : null}
      <ul className="mt-3 grid gap-2 text-sm text-stone-700">
        {recommendation.reasons.map((reason) => (
          <li
            className="rounded-md border border-white bg-white px-3 py-2"
            key={`${recommendation.appTemplateId}-${reason.code}`}
          >
            {reason.message}
          </li>
        ))}
      </ul>
    </section>
  );
}
