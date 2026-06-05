import { describe, expect, it } from 'vitest';
import {
  addEntryToTemplateLibrary,
  createLibraryEntryFromProductionTask,
  createTemplateLibrary,
} from '../src/template-engine/library';
import {
  exportTemplateLibraryJson,
  loadTemplateLibrary,
  saveTemplateLibrary,
} from '../src/templates/storage';
import { createMemoryStorage } from './templateProductionTestUtils';
import { createReviewedProductionBatchFixture } from './templateLibraryTestUtils';

describe('Template Library storage', () => {
  it('stores local library JSON without object URLs, large image bytes, or absolute paths', async () => {
    const { batch, approvedTask, template } = await createReviewedProductionBatchFixture();
    const unsafeTemplate = {
      ...template,
      metadata: {
        ...template.metadata,
        source: {
          ...template.metadata.source,
          fileName: 'C:/unsafe/source-image.png',
        },
      },
      notes: [...(template.notes ?? []), 'blob:runtime-object-url', 'data:image/png;base64,abc'],
    };
    const entry = createLibraryEntryFromProductionTask({
      task: approvedTask,
      template: unsafeTemplate,
      sourceProductionBatchId: batch.batchId,
    });
    const library = addEntryToTemplateLibrary(
      createTemplateLibrary({ libraryId: 'storage-library' }),
      entry,
    );
    const storage = createMemoryStorage();
    const json = saveTemplateLibrary(library, { storage });
    const loaded = loadTemplateLibrary(library.libraryId, { storage });
    const exported = exportTemplateLibraryJson(library);

    expect(loaded?.entries[0]?.makeupTemplate.metadata.source.fileName).toBe('source-image.png');
    expect(json).not.toMatch(/(?:^|["\s])(?:[A-Za-z]:[\\/](?!\/)|\\\\)/);
    expect(exported).not.toMatch(/(?:^|["\s])(?:[A-Za-z]:[\\/](?!\/)|\\\\)/);
  });
});
