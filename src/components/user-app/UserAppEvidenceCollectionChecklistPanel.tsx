import type { UserAppEvidenceCollectionChecklist } from '../../user-app';

export interface UserAppEvidenceCollectionChecklistPanelProps {
  checklist: UserAppEvidenceCollectionChecklist;
}

const statusLabel: Record<UserAppEvidenceCollectionChecklist['status'], string> = {
  checklist_ready: 'checklist 已准备好',
  checklist_ready_with_warnings: 'checklist 有提醒',
  checklist_blocked: 'checklist 被阻断',
};

export function UserAppEvidenceCollectionChecklistPanel({
  checklist,
}: UserAppEvidenceCollectionChecklistPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9F evidence collection checklist
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">证据收集 checklist</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          管理员在内部 dry run 前、中、后确认隐私边界、匿名观察、停止条件和复盘交接。
          这里不是后端表单，也不保存真实用户记录。
        </p>
      </div>

      <div className="mt-4 rounded-md border border-teal-100 bg-teal-50 p-3">
        <p className="text-xs font-semibold text-teal-700">Checklist 状态</p>
        <h3 className="mt-1 text-base font-semibold text-teal-950">
          {statusLabel[checklist.status]}
        </h3>
        <p className="mt-2 text-xs leading-5 text-teal-900">
          {checklist.recommendation.message} 下一步：{checklist.recommendation.nextAction}
        </p>
      </div>

      <div className="mt-4 grid gap-2">
        {checklist.items.map((item) => (
          <p
            className={`rounded-md border p-3 text-xs leading-5 ${
              item.passed
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : item.blocking
                  ? 'border-red-200 bg-red-50 text-red-900'
                  : 'border-amber-200 bg-amber-50 text-amber-900'
            }`}
            key={item.itemId}
          >
            {item.label}：{item.message}
          </p>
        ))}
      </div>
    </section>
  );
}
