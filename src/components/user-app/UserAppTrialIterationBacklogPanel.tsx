import type { UserAppTrialIterationBacklog } from '../../user-app';

export interface UserAppTrialIterationBacklogPanelProps {
  backlog: UserAppTrialIterationBacklog;
}

const statusLabel: Record<UserAppTrialIterationBacklog['status'], string> = {
  backlog_ready: 'backlog 可用',
  backlog_ready_with_warnings: 'backlog 有待修订项',
  backlog_blocked: 'backlog 已阻断',
};

export function UserAppTrialIterationBacklogPanel({
  backlog,
}: UserAppTrialIterationBacklogPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9C iteration backlog
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">迭代 backlog</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          把匿名/示例试用复盘问题转成下一轮行动项。这里不是后端工单系统，
          不保存真实试用者记录，不写入训练数据。
        </p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-500">状态</p>
          <p className="mt-1 font-semibold text-stone-900">{statusLabel[backlog.status]}</p>
        </div>
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-500">行动项</p>
          <p className="mt-1 font-semibold text-stone-900">{backlog.items.length}</p>
        </div>
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-500">来源</p>
          <p className="mt-1 font-semibold text-stone-900">{backlog.sources.length}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {backlog.items.length === 0 ? (
          <p className="rounded-md border border-teal-100 bg-teal-50 p-3 text-sm leading-6 text-teal-950">
            当前没有立即修订项，可准备下一轮内部试用观察。
          </p>
        ) : (
          backlog.items.map((item) => (
            <article
              className="rounded-md border border-stone-200 bg-stone-50 p-3"
              key={item.itemId}
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-stone-900">{item.title}</h3>
                <span className="rounded-md bg-white px-2 py-1 text-xs text-stone-700">
                  {item.ownerArea}
                </span>
                <span className="rounded-md bg-white px-2 py-1 text-xs text-stone-700">
                  {item.priorityRecommendation.priority}
                </span>
                <span className="rounded-md bg-white px-2 py-1 text-xs text-stone-700">
                  {item.targetIteration}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-stone-600">
                {item.priorityRecommendation.nextAction}
              </p>
              {item.blockedReason ? (
                <p className="mt-2 text-xs leading-5 text-rose-800">
                  阻断原因：{item.blockedReason}
                </p>
              ) : null}
              <ul className="mt-2 grid gap-1 text-xs leading-5 text-stone-600">
                {item.acceptanceCriteria.map((criterion) => (
                  <li key={criterion}>{criterion}</li>
                ))}
              </ul>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
