import { History, Image, Images } from 'lucide-react';
import type { EditableCosmeticMask } from '../../vision';
import type { OverlayBeforeAfterMode } from './vision-debug-overlay';

export interface MaskHistoryPanelProps {
  editableMask?: EditableCosmeticMask;
  beforeAfterMode: OverlayBeforeAfterMode;
  onBeforeAfterModeChange: (mode: OverlayBeforeAfterMode) => void;
  onRestoreSnapshot: (snapshotId: string) => void;
}

export function MaskHistoryPanel({
  editableMask,
  beforeAfterMode,
  onBeforeAfterModeChange,
  onRestoreSnapshot,
}: MaskHistoryPanelProps) {
  const snapshots = [...(editableMask?.history.undo ?? [])].reverse();
  const edits = editableMask?.userModifications ?? [];
  const modeLabels: Record<OverlayBeforeAfterMode, string> = {
    before: '修正前',
    after: '修正后',
  };

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">编辑历史</h2>
          <p className="text-xs font-medium text-stone-500">
            {editableMask?.mergedMask.target ?? '未选择区域'} / {edits.length} 次编辑
          </p>
        </div>
        <div className="inline-flex rounded-md border border-stone-200 bg-stone-50 p-1">
          {(['before', 'after'] as OverlayBeforeAfterMode[]).map((mode) => {
            const Icon = mode === 'before' ? Image : Images;

            return (
              <button
                aria-pressed={beforeAfterMode === mode}
                className={`inline-flex h-8 items-center gap-1.5 rounded px-2 text-xs font-medium ${
                  beforeAfterMode === mode
                    ? 'bg-white text-teal-800 shadow-sm'
                    : 'text-stone-500'
                }`}
                key={mode}
                onClick={() => onBeforeAfterModeChange(mode)}
                type="button"
              >
                <Icon aria-hidden="true" size={14} />
                {modeLabels[mode]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {snapshots.length === 0 ? (
          <div className="rounded-md border border-dashed border-stone-200 p-3 text-sm text-stone-500">
            还没有蒙版编辑。请先选择区域并在图片上涂抹，之后这里会显示撤销检查点和修正前后恢复点。
          </div>
        ) : (
          snapshots.map((snapshot, index) => (
            <button
              className="grid gap-1 rounded-md border border-stone-200 bg-stone-50 p-3 text-left text-sm hover:border-teal-500 hover:bg-teal-50/60"
              key={snapshot.id}
              onClick={() => onRestoreSnapshot(snapshot.id)}
              type="button"
            >
              <span className="inline-flex items-center gap-2 font-medium text-stone-800">
                <History aria-hidden="true" size={14} />
                {snapshot.reason}
              </span>
              <span className="text-xs text-stone-500">
                检查点 {snapshots.length - index} / {snapshot.alpha.length} 个透明度单元
              </span>
            </button>
          ))
        )}
      </div>
    </section>
  );
}
