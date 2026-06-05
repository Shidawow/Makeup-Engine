import type { MakeupTemplate } from '../src/templates/schema';
import type {
  TemplateProductionBatch,
  TemplateProductionTask,
} from '../src/templates/schema/template-production-batch.schema';
import {
  confirmPublishProductionTask,
  createTemplateProductionBatchFromSourceImages,
  markTaskAnalysisComplete,
  markTaskApproved,
  markTaskEvidenceReady,
  markTaskNeedsMaskReview,
  publishTemplateProductionTask,
  rejectTemplateProductionTaskWithReason,
} from '../src/template-engine/production';
import {
  createReadySourceImageBinding,
  createTemplateProductionTestManifest,
} from './templateProductionTestUtils';

export const createTemplateLibraryTestTemplate = (
  id = 'template-library-test-template',
): MakeupTemplate => ({
  id,
  name: 'Library Test Template',
  goals: ['photo_to_template_conversion', 'future_coaching'],
  faceStrategy: {
    id: `strategy-${id}`,
    summary: 'Library test strategy',
    goals: ['preserve_detected_style'],
    suitableFaceTypes: ['unknown'],
    reasoning: ['deterministic test fixture'],
  },
  style: {
    family: 'natural',
    finish: 'satin',
    contrast: 'medium',
    palette: {
      temperature: 'neutral',
      dominantFamilies: ['rose'],
      accentFamilies: ['taupe'],
    },
    signatureTraits: ['rose lip', 'soft blush'],
    confidence: 0.82,
    evidence: ['test-evidence'],
  },
  faceSuitability: {
    profile: {
      faceShapes: ['oval'],
      skinTypes: ['combination'],
      skinTones: ['neutral'],
      eyeTypes: ['double'],
      lipShapes: ['full'],
    },
    confidence: 0.76,
    rationale: ['broad test fixture suitability'],
  },
  regions: [
    {
      region: 'lip',
      detected: true,
      confidence: 0.91,
      cues: ['test-lip'],
    },
    {
      region: 'blush',
      detected: true,
      confidence: 0.84,
      cues: ['test-blush'],
    },
  ],
  eyeDesign: {
    summary: 'Soft eye definition',
    effects: ['lift'],
    emphasis: 'outer eye',
  },
  lipDesign: {
    summary: 'Soft rose lip',
    effects: ['soften'],
    emphasis: 'lip center',
  },
  contourDesign: {
    summary: 'Minimal contour',
    effects: ['balance'],
    emphasis: 'cheekbone',
  },
  steps: [
    {
      id: `step-lip-${id}`,
      order: 1,
      region: 'lip',
      action: 'fill',
      tool: 'finger',
      intensity: 'medium',
      layerOrder: 'color',
      placement: {
        region: 'lip',
        area: 'lip polygon',
        coverage: 'medium',
      },
      productCategory: 'lip color',
      finish: 'satin',
      colorFamily: 'rose',
      visualEffects: ['soften'],
      instruction: 'Apply soft rose color inside the detected lip region.',
      rationale: 'Generated from reviewed production task.',
      sourceRegionId: 'lip',
    },
    {
      id: `step-blush-${id}`,
      order: 2,
      region: 'blush',
      action: 'blend',
      tool: 'brush',
      intensity: 'low',
      layerOrder: 'color',
      placement: {
        region: 'blush',
        area: 'cheek color center',
        coverage: 'medium',
      },
      productCategory: 'blush',
      finish: 'satin',
      colorFamily: 'rose',
      visualEffects: ['lift', 'soften'],
      instruction: 'Blend blush around the reviewed cheek mask.',
      rationale: 'Generated from reviewed evidence.',
      sourceRegionId: 'blush',
    },
  ],
  metadata: {
    version: '0.1',
    status: 'draft',
    createdAt: '2026-05-31T00:00:00.000Z',
    createdBy: 'template-library-test',
    source: {
      imageId: 'test-image',
      fileName: 'test-image.png',
      sourceType: 'import',
    },
    styleTags: ['natural', 'rose'],
    visionMetrics: {
      opacityConfidence: 0.8,
      edgeSoftness: 0.75,
      diffusionQuality: 0.7,
      skinRelativeIntensity: 0.65,
    },
    humanVerificationStatus: 'human_verified',
    evidenceId: 'test-evidence',
  },
  notes: ['library test template'],
});

export const createReviewedProductionBatchFixture = async (): Promise<{
  batch: TemplateProductionBatch;
  approvedTask: TemplateProductionTask;
  publishedTask: TemplateProductionTask;
  rejectedTask: TemplateProductionTask;
  template: MakeupTemplate;
}> => {
  const manifest = createTemplateProductionTestManifest();
  const binding = await createReadySourceImageBinding(manifest);
  const batch = createTemplateProductionBatchFromSourceImages({
    manifest,
    artifactBindings: { [binding.bindingId]: binding },
    name: 'Library Test Batch',
  });
  const ready = batch.tasks.find((task) => task.sourceImageId === 'ready-with-binding');
  const rejectable = batch.tasks.find((task) => task.sourceImageId === 'ready-without-binding');

  if (!ready || !rejectable) {
    throw new Error('missing production test tasks');
  }

  const template = createTemplateLibraryTestTemplate();
  const withAnalysisSummary: TemplateProductionTask = {
    ...ready,
    analysisSummary: {
      templateId: template.id,
      previewId: 'template-preview-test',
      traceSummary: ['image-input', 'vision-analysis', 'template-evidence'],
      evidenceReady: true,
      sourceImageId: ready.sourceImageId,
      seedId: ready.templateAnalysisSeed?.seedId,
    },
  };
  const approvedTask = markTaskApproved(
    markTaskEvidenceReady(markTaskNeedsMaskReview(markTaskAnalysisComplete(withAnalysisSummary))),
  );
  const publishedTask = publishTemplateProductionTask(
    confirmPublishProductionTask(approvedTask, {
      confirmedAt: '2026-05-31T06:00:00.000Z',
      operatorNote: 'local library fixture',
    }),
  );
  const rejectedTask = rejectTemplateProductionTaskWithReason(rejectable, {
    reason: 'bad_source_image',
    note: 'fixture rejection',
    rejectedAt: '2026-05-31T06:05:00.000Z',
  });

  return {
    batch: {
      ...batch,
      tasks: batch.tasks.map((task) =>
        task.taskId === approvedTask.taskId
          ? approvedTask
          : task.taskId === rejectedTask.taskId
            ? rejectedTask
            : task,
      ),
    },
    approvedTask,
    publishedTask,
    rejectedTask,
    template,
  };
};
