import { describe, expect, it } from 'vitest';
import {
  addEntryToTemplateLibrary,
  createLibraryEntryFromProductionTask,
  createTemplateLibrary,
  markEntryPackaged,
  markEntryReadyForPackage,
  rejectLibraryEntry,
} from '../src/template-engine/library';
import { buildTemplatePublishPackage } from '../src/templates/storage';
import { createReviewedProductionBatchFixture } from './templateLibraryTestUtils';

describe('Template Publish Package builder', () => {
  it('includes only ready/package/local-published entries and validates evidence and lineage', async () => {
    const { batch, approvedTask, template } = await createReviewedProductionBatchFixture();
    const ready = markEntryReadyForPackage(
      createLibraryEntryFromProductionTask({
        task: approvedTask,
        template,
        sourceProductionBatchId: batch.batchId,
      }),
    );
    const packaged = markEntryPackaged(ready);
    const rejected = {
      ...rejectLibraryEntry(
      createLibraryEntryFromProductionTask({ task: approvedTask, template }),
      'bad library candidate',
      ),
      libraryEntryId: 'rejected-library-entry-test',
    };
    const library = addEntryToTemplateLibrary(
      addEntryToTemplateLibrary(
        createTemplateLibrary({ libraryId: 'package-builder-library' }),
        packaged,
      ),
      rejected,
    );
    const packageData = buildTemplatePublishPackage({ library });

    expect(packageData.entries).toHaveLength(1);
    expect(packageData.entries[0]?.libraryEntryId).toBe(packaged.libraryEntryId);
    expect(packageData.validation.valid).toBe(true);
    expect(packageData.exportNotes).toContain('no object URLs');
  });
});
