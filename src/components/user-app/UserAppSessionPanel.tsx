import {
  summarizeUserAppSession,
  type UserAppSessionRecoveryReport,
  type UserAppSessionState,
} from '../../user-app';

export interface UserAppSessionPanelProps {
  session: UserAppSessionState;
  recoveryReport?: UserAppSessionRecoveryReport | null;
  onSaveSession?: () => void;
  onLoadSession?: () => void;
  onClearTemplateProgress?: () => void;
  onResetPreferences?: () => void;
  onClearSession?: () => void;
}

export function UserAppSessionPanel({
  session,
  recoveryReport,
  onSaveSession,
  onLoadSession,
  onClearTemplateProgress,
  onResetPreferences,
  onClearSession,
}: UserAppSessionPanelProps) {
  const summary = summarizeUserAppSession(session);
  const savedProgress = session.templateProgress;

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">Local session</p>
          <h3 className="text-base font-semibold text-stone-950">本地进度与状态</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            这里只保存当前设备上的轻量状态：模板选择、步骤进度、onboarding、非敏感偏好和筛选条件。
            不上传、不登录、不云同步、不训练，也不保存照片、object URL、本地路径或推荐结果记录。
          </p>
        </div>
        <span className="w-fit rounded-md bg-stone-50 px-3 py-2 text-xs text-stone-600">
          {summary.status} / {summary.scope}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-md bg-stone-50 p-3">
          <span className="block text-xs text-stone-500">当前模板</span>
          <span className="mt-1 block font-semibold text-stone-900">
            {summary.selectedTemplateId ?? '未选择'}
          </span>
        </div>
        <div className="rounded-md bg-stone-50 p-3">
          <span className="block text-xs text-stone-500">当前步骤</span>
          <span className="mt-1 block font-semibold text-stone-900">
            {summary.activeStepId ?? '未开始'}
          </span>
        </div>
        <div className="rounded-md bg-stone-50 p-3">
          <span className="block text-xs text-stone-500">步骤进度</span>
          <span className="mt-1 block font-semibold text-stone-900">
            {summary.completedSteps} 完成 / {summary.skippedSteps} 跳过
          </span>
        </div>
        <div className="rounded-md bg-stone-50 p-3">
          <span className="block text-xs text-stone-500">偏好与筛选</span>
          <span className="mt-1 block font-semibold text-stone-900">
            {summary.onboardingStatus} / {summary.discoverySortMode}
          </span>
        </div>
      </div>

      {savedProgress ? (
        <div className="mt-4 rounded-md border border-stone-200 bg-stone-50 p-3 text-sm text-stone-700">
          <p className="font-semibold text-stone-900">已保存的当前模板进度</p>
          <p className="mt-1">
            {savedProgress.progressPercent}% 完成，保存了 {savedProgress.orderedStepIds.length}{' '}
            个步骤 ID。刷新恢复时会按当前模板包重新校正，不会修改模板包。
          </p>
        </div>
      ) : (
        <div className="mt-4 rounded-md border border-dashed border-stone-300 bg-stone-50 p-3 text-sm text-stone-600">
          当前还没有可保存的模板步骤进度。
        </div>
      )}

      {recoveryReport ? (
        <div className="mt-4 rounded-md bg-stone-50 p-3 text-sm text-stone-700">
          最近恢复状态：{recoveryReport.status}，提示 {recoveryReport.warnings.length} 条。
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="rounded-md border border-teal-700 bg-teal-50 px-3 py-2 text-sm text-teal-900"
          onClick={onSaveSession}
          type="button"
        >
          保存本地状态
        </button>
        <button
          className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700"
          onClick={onLoadSession}
          type="button"
        >
          恢复本地状态
        </button>
        <button
          className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700"
          onClick={onClearTemplateProgress}
          type="button"
        >
          清除步骤进度
        </button>
        <button
          className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700"
          onClick={onResetPreferences}
          type="button"
        >
          重置偏好
        </button>
        <button
          className="rounded-md border border-rose-300 bg-white px-3 py-2 text-sm text-rose-700"
          onClick={onClearSession}
          type="button"
        >
          清除全部本地状态
        </button>
      </div>
    </section>
  );
}
