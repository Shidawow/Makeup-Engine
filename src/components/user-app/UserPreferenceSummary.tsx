import type { UserLocalPreferences } from '../../user-app';
import {
  createGuidanceHintsFromPreferences,
  createPreferenceReadiness,
  summarizeUserLocalPreferences,
} from '../../user-app';

export interface UserPreferenceSummaryProps {
  preferences: UserLocalPreferences;
  onResetPreferences?: () => void;
}

export function UserPreferenceSummary({
  preferences,
  onResetPreferences,
}: UserPreferenceSummaryProps) {
  const summary = summarizeUserLocalPreferences(preferences);
  const readiness = createPreferenceReadiness(preferences);
  const hints = createGuidanceHintsFromPreferences(preferences);

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">
            Preference summary
          </p>
          <h2 className="text-base font-semibold text-stone-950">偏好摘要</h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            当前偏好只用于本地步骤提示，不是账号资料，不会写入模板包或 project-state。
          </p>
        </div>
        <span className="w-fit rounded-md bg-stone-100 px-3 py-1 text-xs text-stone-600">
          {readiness.ready ? '可用于提示' : '需要检查'}
        </span>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-stone-200 p-3">
          <dt className="text-xs font-semibold uppercase text-stone-500">熟练度</dt>
          <dd className="mt-1 text-sm font-medium text-stone-900">{summary.skillLevel}</dd>
        </div>
        <div className="rounded-md border border-stone-200 p-3">
          <dt className="text-xs font-semibold uppercase text-stone-500">指导</dt>
          <dd className="mt-1 text-sm font-medium text-stone-900">
            {summary.guidanceVerbosity}
          </dd>
        </div>
        <div className="rounded-md border border-stone-200 p-3">
          <dt className="text-xs font-semibold uppercase text-stone-500">时间</dt>
          <dd className="mt-1 text-sm font-medium text-stone-900">
            {summary.availableTime}
          </dd>
        </div>
        <div className="rounded-md border border-stone-200 p-3">
          <dt className="text-xs font-semibold uppercase text-stone-500">工具数量</dt>
          <dd className="mt-1 text-sm font-medium text-stone-900">
            {summary.availableToolsCount}
          </dd>
        </div>
      </dl>

      <div className="mt-4 rounded-md border border-teal-100 bg-teal-50 p-3 text-sm leading-6 text-teal-950">
        <p className="font-medium">对指导的影响</p>
        <ul className="mt-2 grid gap-1">
          <li>{hints.skillLevelHint}</li>
          <li>{hints.timeHint}</li>
          <li>{hints.toolAvailabilityHint}</li>
        </ul>
      </div>

      {readiness.blockingIssues.length > 0 ? (
        <ul className="mt-4 grid gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-950">
          {readiness.blockingIssues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4 rounded-md border border-stone-200 bg-stone-50 p-3 text-sm leading-6 text-stone-700">
        <p>本地-only：不登录、不云同步、不上传、不训练、不修改 UserAppTemplatePackage。</p>
      </div>

      {onResetPreferences ? (
        <button
          className="mt-4 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700"
          onClick={onResetPreferences}
          type="button"
        >
          重置偏好
        </button>
      ) : null}
    </section>
  );
}
