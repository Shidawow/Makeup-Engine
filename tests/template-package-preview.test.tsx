import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TemplatePackagePreview } from '../src/components/template-studio/template-package-preview';
import {
  addEntryToTemplateLibrary,
  createLibraryEntryFromProductionTask,
  createTemplateLibrary,
  markEntryReadyForPackage,
} from '../src/template-engine/library';
import { buildTemplatePublishPackage } from '../src/templates/storage';
import { createReviewedProductionBatchFixture } from './templateLibraryTestUtils';

describe('TemplatePackagePreview', () => {
  it('renders package entries, evidence, lineage, and local-only disclaimer', async () => {
    const { batch, approvedTask, template } = await createReviewedProductionBatchFixture();
    const entry = markEntryReadyForPackage(
      createLibraryEntryFromProductionTask({
        task: approvedTask,
        template,
        sourceProductionBatchId: batch.batchId,
      }),
    );
    const packageData = buildTemplatePublishPackage({
      library: addEntryToTemplateLibrary(createTemplateLibrary(), entry),
    });
    const html = renderToStaticMarkup(
      <TemplatePackagePreview packageData={packageData} selectedEntryId={entry.libraryEntryId} />,
    );

    expect(html).toContain('Template Package Preview');
    expect(html).toContain('Template Package Preview');
    expect(html).toContain('evidence: ready');
    expect(html).toContain('lineage');
    expect(html).not.toContain('online release');
    expect(html).not.toContain('blob:');
  });
});
