import { describe, expect, it } from 'vitest';
import {
  addEntryToTemplateLibrary,
  createLibraryEntryFromProductionTask,
  createTemplateLibrary,
  markEntryReadyForPackage,
} from '../src/template-engine/library';
import {
  buildTemplatePublishPackage,
  exportTemplatePublishPackageHandoff,
  exportTemplatePublishPackageJson,
} from '../src/templates/storage';
import { createReviewedProductionBatchFixture } from './templateLibraryTestUtils';

describe('Template Publish Package export', () => {
  it('exports handoff-safe JSON without runtime resources', async () => {
    const { batch, approvedTask, template } = await createReviewedProductionBatchFixture();
    const entry = markEntryReadyForPackage(
      createLibraryEntryFromProductionTask({
        task: approvedTask,
        template,
        sourceProductionBatchId: batch.batchId,
      }),
    );
    const library = addEntryToTemplateLibrary(createTemplateLibrary(), entry);
    const packageData = buildTemplatePublishPackage({ library });
    const json = exportTemplatePublishPackageJson(packageData);
    const handoff = exportTemplatePublishPackageHandoff(packageData);

    expect(json).toContain('template-publish-package-v0.1');
    expect(handoff).toContain('local-user-app-contract');
    expect(handoff).toContain('evidenceSummary');
    expect(json).not.toContain('objectUrl');
    expect(handoff).not.toContain('blob:');
    expect(handoff).not.toContain('data:image/');
    expect(handoff).not.toMatch(/(?:^|["\s])(?:[A-Za-z]:[\\/](?!\/)|\\\\)/);
  });
});
