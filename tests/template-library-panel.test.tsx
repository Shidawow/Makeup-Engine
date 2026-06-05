import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TemplateLibraryPanel } from '../src/components/template-studio/template-library-panel';
import {
  addEntryToTemplateLibrary,
  createLibraryEntryFromProductionTask,
  createTemplateLibrary,
  markEntryReadyForPackage,
} from '../src/template-engine/library';
import { createReviewedProductionBatchFixture } from './templateLibraryTestUtils';

describe('TemplateLibraryPanel', () => {
  it('renders library summary, entry actions, and publish package controls', async () => {
    const { batch, approvedTask, template } = await createReviewedProductionBatchFixture();
    const entry = markEntryReadyForPackage(
      createLibraryEntryFromProductionTask({
        task: approvedTask,
        template,
        sourceProductionBatchId: batch.batchId,
      }),
    );
    const library = addEntryToTemplateLibrary(
      createTemplateLibrary({ name: 'Panel Library' }),
      entry,
    );
    const html = renderToStaticMarkup(
      <TemplateLibraryPanel
        activeLibrary={library}
        currentTemplate={template}
        onLibraryChange={() => undefined}
        productionBatch={batch}
        selectedEntryId={entry.libraryEntryId}
        selectedProductionTask={approvedTask}
      />,
    );

    expect(html).toContain('Template Library');
    expect(html).toContain('Production Task');
    expect(html).toContain('ready_for_package');
    expect(html).toContain('build package');
    expect(html).toContain('local_published');
  });
});
