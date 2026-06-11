import type { UserAppProductDecisionGate } from '../../user-app';

export interface UserAppProductDecisionGatePanelProps {
  gate: UserAppProductDecisionGate;
}

const statusLabel: Record<UserAppProductDecisionGate['status'], string> = {
  product_decision_ready: '可决策',
  product_decision_needs_more_evidence: '需要更多证据',
  product_decision_blocked: '已阻断',
};

export function UserAppProductDecisionGatePanel({
  gate,
}: UserAppProductDecisionGatePanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9D product decision gate
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">产品决策门</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          根据匿名/示例学习总结判断继续试用、修内容、修 Shell、修 trial ops、暂停，
          或准备 MVP validation planning。production app discovery 只代表探索，不代表开始开发。
        </p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-500">状态</p>
          <p className="mt-1 font-semibold text-stone-900">{statusLabel[gate.status]}</p>
        </div>
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-500">决策</p>
          <p className="mt-1 font-semibold text-stone-900">{gate.decision}</p>
        </div>
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-500">生产开发</p>
          <p className="mt-1 font-semibold text-stone-900">
            {gate.productionBuildApproved ? '已批准' : '未批准'}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-teal-100 bg-teal-50 p-3">
        <h3 className="text-sm font-semibold text-teal-950">
          {gate.recommendation.message}
        </h3>
        <p className="mt-2 text-xs leading-5 text-teal-900">
          下一步：{gate.recommendation.nextAction}
        </p>
      </div>

      <div className="mt-4 grid gap-2">
        {gate.rationale.map((item) => (
          <p
            className="rounded-md border border-stone-200 bg-stone-50 p-3 text-xs leading-5 text-stone-600"
            key={item}
          >
            {item}
          </p>
        ))}
      </div>

      <div className="mt-4 grid gap-2">
        {gate.risks.map((risk) => (
          <p
            className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900"
            key={risk.riskId}
          >
            {risk.message}
            {risk.blocksProductionApp ? ' 当前阻止 production app 开发。' : ''}
          </p>
        ))}
      </div>
    </section>
  );
}
