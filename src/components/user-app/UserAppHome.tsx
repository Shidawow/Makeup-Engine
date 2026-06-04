import { ListChecks, Smartphone } from 'lucide-react';
import type { UserAppShellPackageSummaryViewModel } from '../../user-app';

export interface UserAppHomeProps {
  summary: UserAppShellPackageSummaryViewModel;
  onBrowseTemplates: () => void;
}

export function UserAppHome({ summary, onBrowseTemplates }: UserAppHomeProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">
            本地 contract-driven prototype
          </p>
          <h2 className="mt-1 text-lg font-semibold text-stone-950">User App MVP Shell</h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            只消费 UserAppTemplatePackage，用来验证用户侧模板浏览和分步化妆指导。
          </p>
        </div>
        <Smartphone aria-hidden="true" className="text-teal-700" size={22} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-stone-700 md:grid-cols-4">
        <p className="rounded bg-stone-50 p-2">模板 {summary.templateCount}</p>
        <p className="rounded bg-stone-50 p-2">步骤 {summary.totalSteps}</p>
        <p className="rounded bg-stone-50 p-2">区域 {summary.totalRegionInstructions}</p>
        <p className="rounded bg-stone-50 p-2">
          平均 {summary.averageDurationMinutes} 分钟
        </p>
      </div>

      <div className="mt-3 text-xs text-stone-600">
        <p className="font-medium text-stone-900">{summary.packageName}</p>
        <p className="mt-1">标签：{summary.styleTags.join('、') || '暂无'}</p>
      </div>

      <button
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800"
        onClick={onBrowseTemplates}
        type="button"
      >
        <ListChecks aria-hidden="true" size={16} />
        查看模板
      </button>
    </section>
  );
}
