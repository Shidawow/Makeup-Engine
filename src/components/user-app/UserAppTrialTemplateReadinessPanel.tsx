import type {
  UserAppTrialContentReadinessReport,
  UserAppTrialTemplateSelectionReport,
} from '../../user-app';

export interface UserAppTrialTemplateReadinessPanelProps {
  selectionReport: UserAppTrialTemplateSelectionReport;
  readinessReport: UserAppTrialContentReadinessReport;
}

const selectionStatusLabel: Record<UserAppTrialTemplateSelectionReport['status'], string> = {
  ready: '选择可用',
  ready_with_warnings: '有备用警告',
  blocked: '选择阻断',
};

const readinessStatusLabel: Record<UserAppTrialContentReadinessReport['status'], string> = {
  ready_for_real_user_trial: '可进入真实小范围试用',
  ready_with_warnings: '可评审但需标注 warning',
  blocked: '阻断真实试用',
};

export function UserAppTrialTemplateReadinessPanel({
  selectionReport,
  readinessReport,
}: UserAppTrialTemplateReadinessPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Phase 8D Trial Content Readiness
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">试用模板选择与内容就绪度</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          管理员用于确认哪些模板能进入真实小范围试用。blocked 模板不能进入试用；
          warning 模板只能作为备用并标注。
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-500">模板选择状态</p>
          <p className="mt-1 text-base font-semibold text-stone-900">
            {selectionStatusLabel[selectionReport.status]}
          </p>
          <p className="mt-1 text-xs leading-5 text-stone-600">
            beginner: {String(selectionReport.coverage.hasBeginnerFriendlyTemplate)} / short:{' '}
            {String(selectionReport.coverage.hasShortDurationTemplate)} / natural:{' '}
            {String(selectionReport.coverage.hasNaturalDailyTemplate)}
          </p>
        </div>
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-500">试用内容就绪度</p>
          <p className="mt-1 text-base font-semibold text-stone-900">
            {readinessStatusLabel[readinessReport.status]}
          </p>
          <p className="mt-1 text-xs leading-5 text-stone-600">{readinessReport.summary}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <TemplateList
          items={selectionReport.trialReadyTemplates}
          label="Trial-ready"
        />
        <TemplateList
          items={selectionReport.backupTemplates}
          label="备用 warning"
        />
        <TemplateList
          items={selectionReport.blockedTemplates}
          label="Blocked"
        />
      </div>

      {readinessReport.issues.length > 0 ? (
        <ul className="mt-4 grid gap-2">
          {readinessReport.issues.map((issue) => (
            <li
              className="rounded-md border border-amber-200 bg-amber-50 p-2 text-xs leading-5 text-amber-900"
              key={issue.issueId}
            >
              <strong>{issue.severity}</strong>: {issue.message} {issue.recommendation}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-800">
          内容选择、隐私边界和本地边界均满足真实小范围试用前置条件。
        </p>
      )}
    </section>
  );
}

function TemplateList({
  items,
  label,
}: {
  items: UserAppTrialTemplateSelectionReport['trialReadyTemplates'];
  label: string;
}) {
  return (
    <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
      <p className="text-xs font-semibold text-stone-500">{label}</p>
      {items.length > 0 ? (
        <ul className="mt-2 grid gap-2">
          {items.map((item) => (
            <li className="rounded-md bg-white p-2 text-xs leading-5" key={item.templateId}>
              <span className="font-semibold text-stone-800">{item.title}</span>
              <br />
              <span className="text-stone-500">
                {item.estimatedDurationMinutes} 分钟 / {item.difficulty}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-stone-500">暂无</p>
      )}
    </div>
  );
}
