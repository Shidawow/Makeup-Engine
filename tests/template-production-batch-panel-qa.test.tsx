import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TemplateProductionBatchPanel } from '../src/components/template-studio/template-production-batch-panel';
import { createTemplateProductionBatchFromSourceImages } from '../src/template-engine/production';
import {
  createReadySourceImageBinding,
  createTemplateProductionTestManifest,
} from './templateProductionTestUtils';

describe('TemplateProductionBatchPanel QA hardening', () => {
  it('renders QA summary, issue filters, reject reason, publish confirmation, and rebinding action', async () => {
    const manifest = createTemplateProductionTestManifest();
    const binding = await createReadySourceImageBinding(manifest);
    const batch = createTemplateProductionBatchFromSourceImages({
      manifest,
      artifactBindings: { [binding.bindingId]: binding },
      name: 'QA Panel Batch',
    });
    const selected = batch.tasks.find((task) => task.sourceImageId === 'ready-with-binding')!;
    const html = renderToStaticMarkup(
      <TemplateProductionBatchPanel
        activeBatch={batch}
        artifactBindings={{ [binding.bindingId]: binding }}
        filter="blocking"
        manifest={manifest}
        onBatchChange={() => undefined}
        onSelectedTaskChange={() => undefined}
        selectedTaskId={selected.taskId}
      />,
    );

    expect(html).toContain('模板生产批次 QA');
    expect(html.length).toBeGreaterThan(0);
    expect(html).toContain('阻断');
    expect(html).toContain('警告');
    expect(html).toContain('需绑定');
    expect(html).toContain('Reject reason');
    expect(html).toContain('请选择拒绝原因');
    expect(html).toContain('Publish confirmation');
    expect(html).toContain('published');
    expect(html).toContain('重新绑定恢复');
  });
});
