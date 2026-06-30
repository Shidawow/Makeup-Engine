import { ChevronRight, ListChecks, ShieldCheck, Sparkles } from 'lucide-react';
import type {
  UserAppShellPackageSummaryViewModel,
  UserAppTemplateCardViewModel,
  UserAppTemplateDetailViewModel,
} from '../../user-app';

export interface UserAppMobileHomeProps {
  summary: UserAppShellPackageSummaryViewModel;
  templates: UserAppTemplateCardViewModel[];
  selectedTemplate: UserAppTemplateDetailViewModel | null;
  onBrowseTemplates: () => void;
  onStartGuidance: () => void;
  onOpenPrivacy: () => void;
}

const difficultyLabel: Record<string, string> = {
  beginner: '新手友好',
  intermediate: '进阶练习',
  advanced: '熟练挑战',
};

export function UserAppMobileHome({
  summary,
  templates,
  selectedTemplate,
  onBrowseTemplates,
  onStartGuidance,
  onOpenPrivacy,
}: UserAppMobileHomeProps) {
  const firstReadyTemplate = templates.find((template) => template.status === 'ready');
  const recommendedTitle =
    selectedTemplate?.title ?? firstReadyTemplate?.title ?? '先选择一套妆容';
  const recommendedSubtitle =
    selectedTemplate?.subtitle ??
    firstReadyTemplate?.subtitle ??
    '浏览适合今天练习的模板，再进入分步跟练。';
  const canStart = Boolean(selectedTemplate && selectedTemplate.status !== 'blocked');
  const duration =
    selectedTemplate?.estimatedDurationMinutes ?? firstReadyTemplate?.estimatedDurationMinutes ?? 0;
  const difficulty = selectedTemplate?.difficulty ?? firstReadyTemplate?.difficulty;

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="grid gap-4">
        <div className="rounded-lg bg-teal-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-teal-800">移动端练习入口</p>
              <h2 className="mt-1 text-xl font-semibold text-stone-950">
                化妆指导 MVP，从一套模板开始
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                选择一个妆容模板，查看工具准备，然后跟着步骤完成妆容练习。
                当前是本地 MVP 演示，照片、相机和 AR 暂未启用，不上传，也不会用于训练。
              </p>
            </div>
            <Sparkles aria-hidden="true" className="shrink-0 text-teal-700" size={24} />
          </div>

          <ol className="mt-4 grid gap-2 text-sm leading-6 text-stone-700 sm:grid-cols-3">
            {['选择妆容模板', '查看工具和准备事项', '跟着步骤完成练习'].map((item, index) => (
              <li className="rounded-md bg-white p-3" key={item}>
                <span className="mr-2 inline-flex size-6 items-center justify-center rounded-full bg-teal-700 text-xs font-semibold text-white">
                  {index + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>

          <div className="mt-4 rounded-lg border border-teal-100 bg-white p-3">
            <p className="text-xs font-semibold text-teal-700">当前推荐</p>
            <h3 className="mt-1 text-base font-semibold text-stone-950">{recommendedTitle}</h3>
            <p className="mt-1 text-sm leading-6 text-stone-600">{recommendedSubtitle}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-stone-600">
              <span className="rounded bg-stone-50 px-2 py-1">{duration || summary.averageDurationMinutes} 分钟</span>
              <span className="rounded bg-stone-50 px-2 py-1">
                {difficulty ? difficultyLabel[difficulty] ?? difficulty : '难度待选择'}
              </span>
              <span className="rounded bg-stone-50 px-2 py-1">{summary.totalSteps} 个步骤</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-stone-700">
          <p className="rounded bg-stone-50 p-3">妆容 {summary.templateCount}</p>
          <p className="rounded bg-stone-50 p-3">步骤 {summary.totalSteps}</p>
          <p className="rounded bg-stone-50 p-3">区域 {summary.totalRegionInstructions}</p>
          <p className="rounded bg-stone-50 p-3">平均 {summary.averageDurationMinutes} 分钟</p>
        </div>

        <div className="grid gap-2">
          <button
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-40"
            disabled={!canStart}
            onClick={onStartGuidance}
            type="button"
          >
            <ChevronRight aria-hidden="true" size={18} />
            开始跟练
          </button>
          <button
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-800"
            onClick={onBrowseTemplates}
            type="button"
          >
            <ListChecks aria-hidden="true" size={18} />
            浏览妆容
          </button>
          <button
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-900"
            onClick={onOpenPrivacy}
            type="button"
          >
            <ShieldCheck aria-hidden="true" size={18} />
            查看隐私说明
          </button>
        </div>
      </div>
    </section>
  );
}
