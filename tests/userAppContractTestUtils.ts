import {
  addEntryToTemplateLibrary,
  createLibraryEntryFromProductionTask,
  createTemplateLibrary,
  markEntryReadyForPackage,
} from '../src/template-engine/library';
import { buildTemplatePublishPackage } from '../src/templates/storage';
import type { TemplatePublishPackage } from '../src/templates/schema';
import { createReviewedProductionBatchFixture } from './templateLibraryTestUtils';

export const createUserAppContractPublishPackageFixture =
  async (): Promise<TemplatePublishPackage> => {
    const { batch, approvedTask, template } = await createReviewedProductionBatchFixture();
    const entry = markEntryReadyForPackage(
      createLibraryEntryFromProductionTask({
        task: approvedTask,
        template,
        sourceProductionBatchId: batch.batchId,
      }),
    );

    return buildTemplatePublishPackage({
      library: addEntryToTemplateLibrary(createTemplateLibrary(), entry),
    });
  };

