import { GitCompareArrows } from 'lucide-react';
import type { TemplateConvergenceDiffResult } from '../../template-engine';

export interface ConvergenceDiffPanelProps {
  diff: TemplateConvergenceDiffResult | null;
}

const emptyDiff: TemplateConvergenceDiffResult = {
  source: {
    aiTemplateId: 'n/a',
    humanTemplateId: 'n/a',
  },
  changedCount: 0,
  items: [],
};

const truncate = (value: string): string =>
  value.length <= 72 ? value : `${value.slice(0, 69)}...`;

const readableValue = (value: string): string => {
  if (value === 'none' || value === 'n/a') {
    return value === 'none' ? '无' : '暂无';
  }

  if (value.includes('|')) {
    const parts = value
      .split('|')
      .map((part) => part.replace(/^[^:]+:/, '').replace(/_/g, ' '))
      .filter(Boolean)
      .slice(0, 3);

    return truncate(parts.join(', ') || value);
  }

  return truncate(value.replace(/_/g, ' '));
};

const readableLabel = (label: string): string =>
  label
    .replace('Mask changed:', '蒙版')
    .replace('Semantic label changed', '语义标签')
    .replace('Edge softness changed', '边缘柔和度')
    .replace('Opacity changed', '透明度')
    .replace('Confidence changed', '置信度')
    .replace('Generated steps changed', '生成步骤');

export function ConvergenceDiffPanel({ diff }: ConvergenceDiffPanelProps) {
  const current = diff ?? emptyDiff;

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">模板差异</h2>
          <p className="text-xs font-medium text-stone-500">
            AI 初稿 vs 人工确认 / {current.changedCount} 项变化
          </p>
        </div>
        <GitCompareArrows aria-hidden="true" className="text-teal-700" size={18} />
      </div>

      <div className="mt-4 grid gap-2">
        {current.items.length === 0 ? (
          <div className="rounded-md border border-dashed border-stone-200 p-3 text-sm text-stone-500">
            暂无模板差异。编辑并重新分析区域后，这里会对比 AI 初稿和人工修正后的模板。
          </div>
        ) : (
          current.items.map((item) => (
            <div
              className={`rounded-md border p-3 ${
                item.changed
                  ? 'border-rose-200 bg-rose-50/70'
                  : 'border-stone-200 bg-stone-50'
              }`}
              key={item.id}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-stone-900">
                  {readableLabel(item.label)}
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium ${
                    item.changed
                      ? 'bg-rose-100 text-rose-900'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {item.changed ? '有变化' : '一致'}
                </span>
              </div>
              <div className="mt-2 grid gap-1 text-xs leading-5 text-stone-600">
                <p>修正前：{readableValue(item.before)}</p>
                <p>修正后：{readableValue(item.after)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
