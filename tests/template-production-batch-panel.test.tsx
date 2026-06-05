import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TemplateProductionBatchPanel } from '../src/components/template-studio/template-production-batch-panel';
import { createTemplateProductionBatchFromSourceImages } from '../src/template-engine/production';
import {
  createReadySourceImageBinding,
  createTemplateProductionTestManifest,
} from './templateProductionTestUtils';

describe('TemplateProductionBatchPanel', () => {
  it('renders batch creation, task statuses, filters, and handoff actions', async () => {
    const manifest = createTemplateProductionTestManifest();
    const binding = await createReadySourceImageBinding(manifest);
    const batch = createTemplateProductionBatchFromSourceImages({
      manifest,
      artifactBindings: { [binding.bindingId]: binding },
      name: 'Panel Batch',
    });
    const html = renderToStaticMarkup(
      <TemplateProductionBatchPanel
        activeBatch={batch}
        artifactBindings={{ [binding.bindingId]: binding }}
        filter="all"
        manifest={manifest}
        onBatchChange={() => undefined}
        onSelectedTaskChange={() => undefined}
        selectedTaskId={batch.tasks[0]?.taskId}
      />,
    );

    expect(html).toContain('模板生产批次 QA');
    expect(html).toContain('创建批次任务');
    expect(html).toContain('ready-with-binding.png');
    expect(html).toContain('ready-with-binding.png');
    expect(html).toContain('ready_for_vision_analysis');
    expect(html).toContain('需绑定');
    expect(html).toContain('发送到分析');
    expect(html).toContain('导出批次 JSON');
    expect(html).toContain('Publish confirmation');
  });
});
