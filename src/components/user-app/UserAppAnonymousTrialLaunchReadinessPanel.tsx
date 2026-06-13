import type { UserAppAnonymousTrialLaunchReadiness } from '../../user-app';

export interface UserAppAnonymousTrialLaunchReadinessPanelProps {
  readiness: UserAppAnonymousTrialLaunchReadiness;
}

const decisionLabel: Record<UserAppAnonymousTrialLaunchReadiness['decision'], string> = {
  ready_to_launch_anonymous_internal_trial: '可以启动匿名内部试用',
  ready_with_warnings: '可带提醒启动',
  blocked_by_missing_notice: '缺少参与者说明',
  blocked_by_missing_admin_script: '缺少管理员脚本',
  blocked_by_missing_stop_conditions: '缺少停止条件',
  blocked_by_forbidden_data_request: '禁止数据请求阻断',
  blocked_by_privacy_scope_issue: '隐私或范围阻断',
};

export function UserAppAnonymousTrialLaunchReadinessPanel({
  readiness,
}: UserAppAnonymousTrialLaunchReadinessPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 9H launch readiness
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">启动就绪度</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          该判断只面向管理员，用于确认匿名内部试用是否可以启动。它不代表 production
          approval，也不会接后端、上传、训练或保存真实用户记录。
        </p>
      </div>

      <div className="mt-4 rounded-md border border-teal-100 bg-teal-50 p-3">
        <p className="text-xs font-semibold text-teal-700">就绪结论</p>
        <h3 className="mt-1 text-base font-semibold text-teal-950">
          {decisionLabel[readiness.decision]}
        </h3>
        <p className="mt-2 text-xs leading-5 text-teal-900">
          {readiness.recommendation.message} 下一步：{readiness.recommendation.nextAction}
        </p>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">检查项</h3>
          <div className="mt-2 grid gap-2">
            {readiness.checks.map((check) => (
              <p
                className={`rounded-md border p-3 text-xs leading-5 ${
                  check.passed
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    : 'border-red-200 bg-red-50 text-red-900'
                }`}
                key={check.checkId}
              >
                <span className="font-semibold">{check.label}</span>：{check.message}
              </p>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-stone-800">风险和处理</h3>
          <div className="mt-2 grid gap-2">
            {readiness.risks.map((risk) => (
              <p
                className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900"
                key={risk.riskId}
              >
                {risk.message} 处理：{risk.mitigation}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
