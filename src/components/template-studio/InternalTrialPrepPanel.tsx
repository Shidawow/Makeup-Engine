import type {
  InternalTrialPrepReport,
  InternalTrialPrepValidationResult,
  InternalTrialStatus,
} from '../../template-engine';

export interface InternalTrialPrepPanelProps {
  report: InternalTrialPrepReport;
  validation: InternalTrialPrepValidationResult;
}

const statusClass = (status: InternalTrialStatus | string): string => {
  if (status.includes('blocked')) return 'border-rose-200 bg-rose-50 text-rose-800';
  if (status.includes('warning')) return 'border-amber-200 bg-amber-50 text-amber-900';
  return 'border-emerald-200 bg-emerald-50 text-emerald-900';
};

export function InternalTrialPrepPanel({
  report,
  validation,
}: InternalTrialPrepPanelProps) {
  return (
    <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-emerald-950">
            Internal Trial Prep
          </h2>
          <p className="mt-1 text-xs leading-5 text-emerald-900">
            Internal Trial Prep，不是公开试用；不是真实用户研究系统；当前仍是本地 MVP demo。
          </p>
          <p className="mt-1 text-xs leading-5 text-emerald-900">
            只使用角色画像，不保存真实个人信息；不接 analytics；不上传照片 / 不保存照片。
          </p>
          <p className="mt-1 text-xs leading-5 text-emerald-900">
            不能写 registry / 不能 publish / 不能创建 production writer / 不能替换普通 User App Shell。
          </p>
        </div>
        <span className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${statusClass(report.status)}`}>
          {report.status}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div className="rounded-md border border-emerald-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Trial readiness</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>Validation：{validation.status}</p>
            <p>Decision：{report.decision}</p>
            <p>Next：{report.nextRecommendedPhase}</p>
          </div>
        </div>
        <div className="rounded-md border border-emerald-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Participant role profiles</h3>
          <p className="mt-2 text-xs leading-5 text-stone-600">
            {report.participantProfiles.length} 个角色画像；不记录真实姓名、联系方式或身份资料。
          </p>
        </div>
        <div className="rounded-md border border-emerald-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Safe feedback prompts</h3>
          <p className="mt-2 text-xs leading-5 text-stone-600">
            {report.feedbackPrompts.length} 个安全反馈问题；只记录匿名理解、困惑、偏好和可用性备注。
          </p>
        </div>
        <div className="rounded-md border border-emerald-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Safety boundaries</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>No data / no analytics / no photo storage：yes</p>
            <p>Registry chain paused after Phase 10U：yes</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <section className="rounded-md border border-emerald-200 bg-white p-3">
          <h3 className="text-sm font-semibold text-emerald-950">
            Participant role profiles
          </h3>
          <div className="mt-2 grid gap-2">
            {report.participantProfiles.map((profile) => (
              <article className="rounded-md border border-stone-200 bg-stone-50 p-2" key={profile.id}>
                <p className="text-xs font-semibold">{profile.label}</p>
                <p className="mt-1 text-xs leading-5 text-stone-600">{profile.purpose}</p>
                <p className="mt-1 text-xs text-stone-500">
                  role-only：{profile.roleOnly ? 'yes' : 'no'}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-emerald-200 bg-white p-3">
          <h3 className="text-sm font-semibold text-emerald-950">Trial routes</h3>
          <div className="mt-2 grid gap-2">
            {report.trialRoutes.map((route) => (
              <article className={`rounded-md border p-2 ${statusClass(route.status)}`} key={route.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-semibold">{route.label}</p>
                  <span className="rounded-md bg-white/80 px-2 py-1 text-xs font-semibold">
                    {route.status}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-5">{route.goal}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <section className="rounded-md border border-emerald-200 bg-white p-3">
          <h3 className="text-sm font-semibold text-emerald-950">
            Safe feedback prompts
          </h3>
          <ul className="mt-2 grid gap-2 text-xs leading-5 text-stone-600">
            {report.feedbackPrompts.map((prompt) => (
              <li className="rounded-md border border-stone-200 bg-stone-50 p-2" key={prompt.id}>
                <p className="font-semibold">{prompt.question}</p>
                <p className="mt-1 text-stone-500">
                  safeToRecord：{prompt.safeToRecord ? 'yes' : 'no'} / {prompt.promptType}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-md border border-emerald-200 bg-white p-3">
          <h3 className="text-sm font-semibold text-emerald-950">
            Privacy / data boundary checklist
          </h3>
          <ul className="mt-2 grid gap-1 text-xs leading-5 text-stone-600">
            {report.checklist.map((item) => (
              <li key={item.id}>
                {item.completed ? '✓' : '•'} {item.label}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {validation.blockedReasons.length > 0 || report.risks.length > 0 ? (
        <div className="mt-4 rounded-md border border-rose-200 bg-white p-3">
          <h3 className="text-sm font-semibold text-rose-900">Blockers / warnings</h3>
          <ul className="mt-2 grid gap-1 text-xs leading-5 text-stone-600">
            {[...validation.blockedReasons, ...report.risks.map((risk) => risk.message)].map(
              (reason) => (
                <li key={reason}>{reason}</li>
              ),
            )}
          </ul>
        </div>
      ) : null}

      <div className="mt-4 rounded-md border border-emerald-200 bg-white p-3">
        <h3 className="text-sm font-semibold text-emerald-950">Decision / next action</h3>
        <p className="mt-2 text-xs leading-5 text-stone-600">{report.operatorSummary}</p>
        <p className="mt-1 text-xs leading-5 text-stone-600">{report.nextAction}</p>
      </div>
    </section>
  );
}
