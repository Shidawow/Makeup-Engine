import { CheckCircle2, RotateCcw, Search } from 'lucide-react';

export interface UserAppCompletionProps {
  completedSteps: number;
  totalSteps: number;
  onRestart: () => void;
  onChooseAnother: () => void;
}

export function UserAppCompletion({
  completedSteps,
  totalSteps,
  onRestart,
  onChooseAnother,
}: UserAppCompletionProps) {
  return (
    <section className="rounded-lg border border-teal-200 bg-teal-50 p-4 shadow-soft">
      <div className="flex items-start gap-3">
        <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-teal-700" size={24} />
        <div>
          <p className="text-xs font-semibold text-teal-800">完成页</p>
          <h2 className="mt-1 text-xl font-semibold text-stone-950">
            已完成本次妆容练习
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-700">
            你完成了 {completedSteps} / {totalSteps} 个步骤。当前结果只保留在本地进度中，
            不上传照片，不生成分享内容，也不会用于训练。
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-800"
          onClick={onRestart}
          type="button"
        >
          <RotateCcw aria-hidden="true" size={18} />
          重新开始这套妆容
        </button>
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-teal-300 bg-white px-4 py-3 text-sm font-semibold text-teal-900"
          onClick={onChooseAnother}
          type="button"
        >
          <Search aria-hidden="true" size={18} />
          返回模板选择
        </button>
      </div>
    </section>
  );
}
