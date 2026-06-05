import { describe, expect, it } from 'vitest';
import { TEMPLATE_PUBLISH_PACKAGE_SCHEMA_VERSION } from '../src/templates/schema';
import { buildTemplatePublishPackage } from '../src/templates/storage';
import {
  addEntryToTemplateLibrary,
  createLibraryEntryFromProductionTask,
  createTemplateLibrary,
  markEntryReadyForPackage,
} from '../src/template-engine/library';
import { createReviewedProductionBatchFixture } from './templateLibraryTestUtils';

describe('Template Publish Package schema', () => {
  it('builds a local-only package schema from ready library entries', async () => {
    const { batch, approvedTask, template } = await createReviewedProductionBatchFixture();
    const entry = markEntryReadyForPackage(
      createLibraryEntryFromProductionTask({
        task: approvedTask,
        template,
        sourceProductionBatchId: batch.batchId,
      }),
    );
    const library = addEntryToTemplateLibrary(
      createTemplateLibrary({ libraryId: 'package-schema-library' }),
      entry,
    );
    const packageData = buildTemplatePublishPackage({ library });

    expect(packageData.schemaVersion).toBe(TEMPLATE_PUBLISH_PACKAGE_SCHEMA_VERSION);
    expect(packageData.manifest.localOnly).toBe(true);
    expect(packageData.manifest.onlinePublished).toBe(false);
    expect(packageData.entries[0]?.templateData.id).toBe(template.id);
    expect(JSON.stringify(packageData)).not.toContain('objectUrl');
    expect(JSON.stringify(packageData)).not.toContain('training-ready');
  });
});
