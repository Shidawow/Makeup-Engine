import type { UserAppTrialPack } from '../../user-app';

export interface UserAppTrialPackPanelProps {
  pack: UserAppTrialPack;
}

const statusLabel: Record<UserAppTrialPack['status'], string> = {
  ready: '可试用',
  warning: '有提醒',
  blocked: '阻断',
};

const statusClass: Record<UserAppTrialPack['status'], string> = {
  ready: 'border-teal-200 bg-teal-50 text-teal-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  blocked: 'border-rose-200 bg-rose-50 text-rose-800',
};

export function UserAppTrialPackPanel({ pack }: UserAppTrialPackPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">MVP trial pack</p>
          <h2 className="text-lg font-semibold text-stone-950">MVP 试用包</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
            管理员用这份任务包组织小范围试用。它只是本地试用脚本和验收结构，
            不上传数据、不保存真实用户记录，也不会用于训练。
          </p>
        </div>
        <span className={`w-fit rounded-md border px-3 py-2 text-xs ${statusClass[pack.status]}`}>
          {statusLabel[pack.status]}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
        <p className="rounded-md bg-stone-50 p-3">任务：{pack.scenario.tasks.length}</p>
        <p className="rounded-md bg-stone-50 p-3">覆盖：{pack.scenario.templateCoverage.join('、')}</p>
        <p className="rounded-md bg-stone-50 p-3">问题：{pack.issues.length}</p>
      </div>

      <div className="mt-4 rounded-md border border-teal-200 bg-teal-50 p-3 text-sm leading-6 text-teal-950">
        试用目标：验证用户是否看得懂、愿意跟练、觉得模板和工具建议有价值。
      </div>

      <div className="mt-4 grid gap-3">
        {pack.scenario.instructions.map((instruction) => (
          <article className="rounded-md border border-stone-200 bg-stone-50 p-3" key={instruction.instructionId}>
            <h3 className="font-semibold text-stone-950">{instruction.title}</h3>
            <p className="mt-1 text-sm leading-6 text-stone-600">{instruction.body}</p>
          </article>
        ))}
      </div>

      <ol className="mt-4 grid gap-2">
        {pack.scenario.tasks.map((task) => (
          <li className="rounded-md border border-stone-200 bg-stone-50 p-3" key={task.taskId}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-teal-700">第 {task.order} 项</p>
                <h3 className="font-semibold text-stone-950">{task.title}</h3>
                <p className="mt-1 text-sm leading-6 text-stone-600">{task.successCriteria}</p>
              </div>
              <span className="w-fit rounded-md bg-white px-2 py-1 text-xs text-stone-600">
                约 {task.estimatedMinutes} 分钟
              </span>
            </div>
          </li>
        ))}
      </ol>

      {pack.issues.length > 0 ? (
        <div className="mt-4 grid gap-2">
          {pack.issues.map((issue) => (
            <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950" key={issue.issueId}>
              {issue.severity === 'blocking' ? '阻断' : '提醒'}：{issue.message}
            </p>
          ))}
        </div>
      ) : null}
    </section>
  );
}
