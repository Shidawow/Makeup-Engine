import type { UserAppNextPhaseRecommendation } from '../../user-app';

export interface UserAppNextPhaseRecommendationPanelProps {
  recommendation: UserAppNextPhaseRecommendation;
}

const readinessLabel: Record<UserAppNextPhaseRecommendation['readiness'], string> = {
  ready: '可进入',
  ready_with_warnings: '可进入，但需保留警告',
  blocked: '已阻断',
};

export function UserAppNextPhaseRecommendationPanel({
  recommendation,
}: UserAppNextPhaseRecommendationPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9D next phase recommendation
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">下一阶段建议</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          只基于匿名/示例/本地决策框架输出下一阶段建议。
          不保存真实个人身份、不上传、不训练，也不默认进入 production app。
        </p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-500">推荐阶段</p>
          <p className="mt-1 font-semibold text-stone-900">
            {recommendation.recommendedPhase}
          </p>
        </div>
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-500">就绪度</p>
          <p className="mt-1 font-semibold text-stone-900">
            {readinessLabel[recommendation.readiness]}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {recommendation.rationale.map((item) => (
          <p
            className="rounded-md border border-teal-100 bg-teal-50 p-3 text-xs leading-5 text-teal-900"
            key={item}
          >
            {item}
          </p>
        ))}
      </div>

      <div className="mt-4 grid gap-2">
        {recommendation.risks.map((risk) => (
          <p
            className="rounded-md border border-stone-200 bg-stone-50 p-3 text-xs leading-5 text-stone-600"
            key={risk.riskId}
          >
            {risk.message} 处理方式：{risk.mitigation}
          </p>
        ))}
      </div>
    </section>
  );
}
