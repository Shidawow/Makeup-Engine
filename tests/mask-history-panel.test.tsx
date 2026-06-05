import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MaskHistoryPanel } from '../src/components/template-studio/MaskHistoryPanel';
import {
  applyMaskBrushEdit,
  createEditableCosmeticMask,
  restoreEditableMaskSnapshot,
  type CosmeticSegmentationMask,
} from '../src/vision';

const createMask = (): CosmeticSegmentationMask => ({
  id: 'history-mask',
  target: 'lips',
  polygon: {
    space: 'normalized-image',
    points: [
      { x: 0.2, y: 0.2 },
      { x: 0.8, y: 0.2 },
      { x: 0.8, y: 0.8 },
      { x: 0.2, y: 0.8 },
    ],
  },
  bounds: {
    x: 0.2,
    y: 0.2,
    width: 0.6,
    height: 0.6,
    space: 'normalized-image',
  },
  grid: {
    width: 3,
    height: 3,
    alpha: [0, 0, 0, 0, 0.2, 0, 0, 0, 0],
  },
  confidence: 0.72,
  debug: [],
});

describe('MaskHistoryPanel', () => {
  it('renders edit history and before/after preview controls', () => {
    const editable = applyMaskBrushEdit(createEditableCosmeticMask(createMask()), {
      id: 'history-edit',
      target: 'lips',
      tool: 'brush-add',
      point: { x: 0.5, y: 0.5, space: 'normalized-image' },
      radius: 0.3,
      strength: 0.8,
      createdAt: '2026-05-28T00:00:00.000Z',
    });
    const html = renderToStaticMarkup(
      <MaskHistoryPanel
        beforeAfterMode="after"
        editableMask={editable}
        onBeforeAfterModeChange={() => undefined}
        onRestoreSnapshot={() => undefined}
      />,
    );

    expect(html).toContain('编辑历史');
    expect(html).toContain('brush-add');
    expect(html.length).toBeGreaterThan(0);
  });

  it('restores a clicked history checkpoint to its saved alpha state', () => {
    const base = createEditableCosmeticMask(createMask());
    const edited = applyMaskBrushEdit(base, {
      id: 'history-restore',
      target: 'lips',
      tool: 'brush-add',
      point: { x: 0.5, y: 0.5, space: 'normalized-image' },
      radius: 0.3,
      strength: 0.8,
      createdAt: '2026-05-28T00:00:00.000Z',
    });
    const snapshot = edited.history.undo[0];
    const restored = restoreEditableMaskSnapshot(
      edited,
      snapshot.id,
      '2026-05-28T00:01:00.000Z',
    );

    expect(restored.mergedMask.grid.alpha).toEqual(snapshot.alpha);
    expect(restored.history.redo.length).toBeGreaterThan(0);
  });
});
