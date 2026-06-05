import { describe, expect, it } from 'vitest';
import {
  createLibraryEntryFromProductionTask,
  markEntryLocalPublished,
  markEntryPackaged,
  markEntryReadyForPackage,
  rejectLibraryEntry,
  validateLibraryEntryTransition,
  archiveLibraryEntry,
  deprecateLibraryEntry,
} from '../src/template-engine/library';
import { createReviewedProductionBatchFixture } from './templateLibraryTestUtils';

describe('Template Library lifecycle', () => {
  it('requires ready_for_package before packaged and packaged before local_published', async () => {
    const { batch, approvedTask, template } = await createReviewedProductionBatchFixture();
    const entry = createLibraryEntryFromProductionTask({
      task: approvedTask,
      template,
      sourceProductionBatchId: batch.batchId,
    });
    const invalidPackage = validateLibraryEntryTransition(entry, 'packaged');
    const ready = markEntryReadyForPackage(entry);
    const packaged = markEntryPackaged(ready);
    const localPublished = markEntryLocalPublished(packaged);

    expect(invalidPackage.valid).toBe(false);
    expect(ready.status).toBe('ready_for_package');
    expect(packaged.status).toBe('packaged');
    expect(localPublished.status).toBe('local_published');
    expect(localPublished.versionHistory.length).toBeGreaterThan(entry.versionHistory.length);
  });

  it('blocks rejected entries from packaging and preserves archive/deprecate history', async () => {
    const { approvedTask, template } = await createReviewedProductionBatchFixture();
    const rejected = rejectLibraryEntry(
      createLibraryEntryFromProductionTask({ task: approvedTask, template }),
      'operator rejected library quality',
    );
    const packaged = markEntryPackaged(rejected);
    const archived = archiveLibraryEntry(markEntryReadyForPackage(createLibraryEntryFromProductionTask({ task: approvedTask, template })));
    const deprecated = deprecateLibraryEntry(archived, 'superseded');

    expect(rejected.status).toBe('rejected');
    expect(packaged.status).toBe('rejected');
    expect(packaged.issues.map((issue) => issue.code)).toContain('invalid-transition');
    expect(archived.status).toBe('archived');
    expect(deprecated.status).toBe('deprecated');
    expect(deprecated.issues.map((issue) => issue.code)).toContain('deprecation-reason');
  });
});
