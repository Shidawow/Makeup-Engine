import type { UserAppAnonymousTrialLaunchPack } from '../../user-app';

export interface UserAppAnonymousTrialLaunchPackPanelProps {
  pack: UserAppAnonymousTrialLaunchPack;
}

const statusLabel: Record<UserAppAnonymousTrialLaunchPack['status'], string> = {
  launch_pack_ready: '启动包已准备好',
  launch_pack_ready_with_warnings: '启动包有提醒',
  launch_pack_blocked: '启动包被阻断',
};

export function UserAppAnonymousTrialLaunchPackPanel({
  pack,
}: UserAppAnonymousTrialLaunchPackPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9H anonymous internal trial launch
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">
          匿名内部试用启动包
        </h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          这是匿名 / 内部 / 本地 / 非公开的启动准备，不是公开招募或生产发布。
          不保存真实个人身份、不上传、不训练、不收集照片。
        </p>
      </div>

      <div className="mt-4 rounded-md border border-teal-100 bg-teal-50 p-3">
        <p className="text-xs font-semibold text-teal-700">启动包状态</p>
        <h3 className="mt-1 text-base font-semibold text-teal-950">
          {statusLabel[pack.status]}
        </h3>
        <p className="mt-2 text-xs leading-5 text-teal-900">
          {pack.participantNotice?.copy ?? '缺少参与者说明，不能启动匿名内部试用。'}
        </p>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">启动范围</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {pack.scope.map((item) => (
              <span
                className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-900"
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-stone-800">管理员执行脚本</h3>
          <ol className="mt-2 grid gap-2">
            {(pack.adminScript?.steps ?? ['缺少管理员执行脚本。']).map((step) => (
              <li
                className="rounded-md border border-stone-200 bg-stone-50 p-3 text-xs leading-5 text-stone-700"
                key={step}
              >
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">匿名证据记录模板</h3>
          <div className="mt-2 grid gap-2">
            {(pack.evidenceCaptureSheet?.columns ?? ['缺少匿名证据记录模板。']).map((column) => (
              <p
                className="rounded-md border border-blue-200 bg-blue-50 p-2 text-xs text-blue-900"
                key={column}
              >
                {column}
              </p>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-stone-800">停止 / 暂停条件</h3>
          <div className="mt-2 grid gap-2">
            {pack.stopConditions.map((condition) => (
              <p
                className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900"
                key={condition.conditionId}
              >
                {condition.label}：{condition.trigger} 处理：{condition.action}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-stone-800">禁止记录</h3>
        <div className="mt-2 grid gap-2 lg:grid-cols-2">
          {pack.forbiddenDataRequests.map((item) => (
            <p
              className={`rounded-md border p-3 text-xs leading-5 ${
                item.requested
                  ? 'border-red-200 bg-red-50 text-red-900'
                  : 'border-stone-200 bg-stone-50 text-stone-600'
              }`}
              key={item.requestId}
            >
              {item.label}：{item.reason}
              {item.requested ? ' 当前请求会阻断启动。' : ''}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
