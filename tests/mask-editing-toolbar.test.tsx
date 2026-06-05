import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MaskEditingToolbar } from '../src/components/template-studio/MaskEditingToolbar';

const noop = () => undefined;

describe('MaskEditingToolbar', () => {
  it('renders region selection, brush tools, sliders, history actions, save, and reanalysis controls', () => {
    const html = renderToStaticMarkup(
      <MaskEditingToolbar
        activeRegion="lips"
        brushSize={0.08}
        brushTool="brush-add"
        canRedo={false}
        canReanalyze
        canSaveCorrection
        canUndo
        dirtyRegions={['lips', 'blush']}
        featherStrength={0.5}
        onActiveRegionChange={noop}
        onBrushSizeChange={noop}
        onBrushToolChange={noop}
        onFeatherStrengthChange={noop}
        onReanalyzeRegion={noop}
        onRedo={noop}
        onResetRegion={noop}
        onSaveCorrection={noop}
        onUndo={noop}
      />,
    );

    expect(html).toContain('蒙版编辑工具');
    expect(html).toContain('唇部');
    expect(html).toContain('腮红');
    expect(html).toContain('眼影');
    expect(html).toContain('眼线');
    expect(html).toContain('修容');
    expect(html).toContain('高光');
    expect(html).toContain('添加');
    expect(html).toContain('擦除');
    expect(html).toContain('羽化');
    expect(html).toContain('撤销');
    expect(html).toContain('重做');
    expect(html).toContain('重置');
    expect(html).toContain('保存修正');
    expect(html.length).toBeGreaterThan(0);
    expect(html).toContain('lips');
  });
});
