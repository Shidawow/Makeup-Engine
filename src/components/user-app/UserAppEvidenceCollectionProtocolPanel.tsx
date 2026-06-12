import type { UserAppEvidenceCollectionProtocol } from '../../user-app';

export interface UserAppEvidenceCollectionProtocolPanelProps {
  protocol: UserAppEvidenceCollectionProtocol;
}

const statusLabel: Record<UserAppEvidenceCollectionProtocol['status'], string> = {
  protocol_ready: '协议已准备好',
  protocol_ready_with_warnings: '协议有提醒',
  protocol_blocked: '协议被阻断',
};

export function UserAppEvidenceCollectionProtocolPanel({
  protocol,
}: UserAppEvidenceCollectionProtocolPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9F evidence collection protocol
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">证据收集协议</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          这是匿名 / 本地 / 准备阶段协议。只允许记录匿名观察和聚合摘要，
          不保存真实个人身份、不上传、不训练、不收集照片。
        </p>
      </div>

      <div className="mt-4 rounded-md border border-teal-100 bg-teal-50 p-3">
        <p className="text-xs font-semibold text-teal-700">协议状态</p>
        <h3 className="mt-1 text-base font-semibold text-teal-950">
          {statusLabel[protocol.status]}
        </h3>
        <p className="mt-2 text-xs leading-5 text-teal-900">
          {protocol.participantNotice?.copy ?? '缺少参与者说明。'}
        </p>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">允许记录</h3>
          <div className="mt-2 grid gap-2">
            {protocol.allowedItems.map((item) => (
              <p
                className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs leading-5 text-emerald-900"
                key={item.itemId}
              >
                {item.label}：{item.description}
              </p>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-stone-800">禁止记录</h3>
          <div className="mt-2 grid gap-2">
            {protocol.forbiddenItems.map((item) => (
              <p
                className={`rounded-md border p-3 text-xs leading-5 ${
                  item.requested
                    ? 'border-red-200 bg-red-50 text-red-900'
                    : 'border-stone-200 bg-stone-50 text-stone-600'
                }`}
                key={item.itemId}
              >
                {item.label}：{item.reason}
                {item.requested ? ' 当前请求会阻断。' : ''}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">匿名化规则</h3>
          <ul className="mt-2 grid gap-2">
            {protocol.anonymizationRules.map((rule) => (
              <li
                className="rounded-md border border-stone-200 bg-stone-50 p-3 text-xs leading-5 text-stone-600"
                key={rule.ruleId}
              >
                {rule.label}：{rule.description}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-stone-800">停止条件</h3>
          <ul className="mt-2 grid gap-2">
            {protocol.stopConditions.map((condition) => (
              <li
                className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900"
                key={condition.conditionId}
              >
                {condition.label}：{condition.trigger} 处理：{condition.action}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
