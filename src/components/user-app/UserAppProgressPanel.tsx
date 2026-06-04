import type { UserAppTemplateProgress } from '../../user-app';

export interface UserAppProgressPanelProps {
  progress?: UserAppTemplateProgress;
  totalSteps: number;
  onReset: () => void;
}

export function UserAppProgressPanel({
  progress,
  totalSteps,
  onReset,
}: UserAppProgressPanelProps) {
  const percent = progress?.progressPercent ?? 0;
  const completed = progress?.completedStepIds.length ?? 0;
  const skipped = progress?.skippedStepIds.length ?? 0;
  const remaining = Math.max(totalSteps - completed - skipped, 0);

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">Local progress</p>
          <h3 className="text-base font-semibold text-stone-950">本地跟练进度</h3>
        </div>
        <button
          className="w-fit rounded-md border border-stone-300 px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 disabled:opacity-40"
          disabled={!progress || totalSteps === 0}
          onClick={onReset}
          type="button"
        >
          重置进度
        </button>
      </div>

      <div className="mt-3 h-3 overflow-hidden rounded-full bg-stone-100">
        <div className="h-full bg-teal-700" style={{ width: `${percent}%` }} />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-md bg-stone-50 p-2">
          <span className="block text-lg font-semibold text-stone-950">{completed}</span>
          <span className="text-stone-500">已完成</span>
        </div>
        <div className="rounded-md bg-stone-50 p-2">
          <span className="block text-lg font-semibold text-stone-950">{skipped}</span>
          <span className="text-stone-500">已跳过</span>
        </div>
        <div className="rounded-md bg-stone-50 p-2">
          <span className="block text-lg font-semibold text-stone-950">{remaining}</span>
          <span className="text-stone-500">待完成</span>
        </div>
      </div>

      <p className="mt-3 text-xs leading-5 text-stone-600">
        进度只保存在当前本地 UI 状态中，不会上传、同步、导出，也不会成为训练数据。
      </p>
    </section>
  );
}
