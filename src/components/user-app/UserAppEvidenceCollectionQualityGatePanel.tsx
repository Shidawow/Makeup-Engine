import type { UserAppEvidenceCollectionQualityGate } from '../../user-app';

export interface UserAppEvidenceCollectionQualityGatePanelProps {
  gate: UserAppEvidenceCollectionQualityGate;
}

const decisionLabel: Record<UserAppEvidenceCollectionQualityGate['decision'], string> = {
  ready_to_collect_anonymous_internal_evidence: '可以准备匿名内部 dry run',
  ready_with_warnings: '可带提醒准备',
  blocked_by_privacy_scope: '隐私或范围阻断',
  blocked_by_missing_protocol: '缺少协议',
  blocked_by_missing_notice: '缺少参与者说明',
  blocked_by_forbidden_data_request: '存在禁止数据请求',
};

export function UserAppEvidenceCollectionQualityGatePanel({
  gate,
}: UserAppEvidenceCollectionQualityGatePanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9F evidence collection quality gate
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">证据收集质量门</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          只判断是否可以准备匿名内部 dry run。它不是正式数据采集系统，不接后端、
          不上传、不训练、不收集照片或真实个人资料。
        </p>
      </div>

      <div className="mt-4 rounded-md border border-teal-100 bg-teal-50 p-3">
        <p className="text-xs font-semibold text-teal-700">质量门结论</p>
        <h3 className="mt-1 text-base font-semibold text-teal-950">
          {decisionLabel[gate.decision]}
        </h3>
        <p className="mt-2 text-xs leading-5 text-teal-900">
          {gate.recommendation.message} 下一步：{gate.recommendation.nextAction}
        </p>
      </div>

      <div className="mt-4 grid gap-2">
        {gate.checks.map((check) => (
          <p
            className={`rounded-md border p-3 text-xs leading-5 ${
              check.passed
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : check.blocking
                  ? 'border-red-200 bg-red-50 text-red-900'
                  : 'border-amber-200 bg-amber-50 text-amber-900'
            }`}
            key={check.checkId}
          >
            {check.label}：{check.message}
          </p>
        ))}
      </div>

      <div className="mt-4 grid gap-2">
        {gate.risks.map((risk) => (
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
