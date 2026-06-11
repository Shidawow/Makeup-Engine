import type { UserAppInternalTrialEvidencePack } from '../../user-app';

export interface UserAppInternalTrialEvidencePackPanelProps {
  evidencePack: UserAppInternalTrialEvidencePack;
}

const statusLabel: Record<UserAppInternalTrialEvidencePack['status'], string> = {
  evidence_pack_ready: '证据包可用',
  evidence_pack_ready_with_warnings: '证据包有缺口',
  evidence_pack_blocked: '证据包被阻断',
};

export function UserAppInternalTrialEvidencePackPanel({
  evidencePack,
}: UserAppInternalTrialEvidencePackPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9E evidence pack
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">内部试用证据包</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          把 9A/9B/9C/9D 的匿名/示例/本地摘要整理成可复盘证据链。
          这不是正式用户数据系统，不保存真实个人身份、不上传、不训练。
        </p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-500">状态</p>
          <p className="mt-1 font-semibold text-stone-900">
            {statusLabel[evidencePack.status]}
          </p>
        </div>
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-500">证据条目</p>
          <p className="mt-1 font-semibold text-stone-900">
            {evidencePack.evidenceItems.length}
          </p>
        </div>
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-500">证据类型</p>
          <p className="mt-1 font-semibold text-stone-900">
            {evidencePack.evidenceTypes.length}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {evidencePack.evidenceTypes.map((type) => (
          <p
            className="rounded-md border border-stone-200 bg-stone-50 p-3 text-xs leading-5 text-stone-600"
            key={type}
          >
            {type}
          </p>
        ))}
      </div>

      <div className="mt-4 grid gap-2">
        {evidencePack.risks.map((risk) => (
          <p
            className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900"
            key={risk.riskId}
          >
            {risk.message} 处理方式：{risk.mitigation}
          </p>
        ))}
      </div>
    </section>
  );
}
