import { describe, expect, it } from 'vitest';
import {
  addEntryToTemplateLibrary,
  createLibraryEntryFromProductionTask,
  createTemplateLibrary,
  markEntryReadyForPackage,
} from '../src/template-engine/library';
import {
  createTemplateLibraryCodexHandoff,
  createTemplateLibraryOperatorSummary,
  exportTemplateLibraryHandoff,
  summarizeLibraryNextActions,
} from '../src/templates/storage';
import { createReviewedProductionBatchFixture } from './templateLibraryTestUtils';

describe('Template Library handoff', () => {
  it('exports recovery-safe library summaries for Codex and operators', async () => {
    const { batch, approvedTask, template } = await createReviewedProductionBatchFixture();
    const entry = markEntryReadyForPackage(
      createLibraryEntryFromProductionTask({
        task: approvedTask,
        template,
        sourceProductionBatchId: batch.batchId,
      }),
    );
    const library = addEntryToTemplateLibrary(
      createTemplateLibrary({ libraryId: 'handoff-library' }),
      entry,
    );
    const handoff = exportTemplateLibraryHandoff(library);

    expect(handoff).toContain('ready_for_package');
    expect(handoff).toContain('local published is not online publication');
    expect(createTemplateLibraryOperatorSummary(library)).toContain('readyForPackage');
    expect(createTemplateLibraryCodexHandoff(library)).toContain('template-library-manifest');
    expect(summarizeLibraryNextActions(library)).toContain(`package ${entry.templateId}`);
    expect(handoff).not.toContain('blob:');
    expect(handoff).not.toMatch(/(?:^|["\s])(?:[A-Za-z]:[\\/](?!\/)|\\\\)/);
  });
});
