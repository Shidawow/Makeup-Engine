import { describe, expect, it } from 'vitest';
import {
  buildMakeupTemplateFromVisionAnalysis,
  convergeTemplateWithHumanCorrections,
} from '../src/template-engine';
import { TEMPLATE_EVIDENCE_SCHEMA_VERSION } from '../src/templates/schema';
import {
  applyMaskBrushEdit,
  createEditableCosmeticMask,
  runMakeupAnalysisPipeline,
  type ImagePixelData,
  type MakeupPhotoInput,
} from '../src/vision';
import { createMockVisionProvider } from '../src/vision/providers/mock';
import { createMockSegmentationProvider } from '../src/vision/segmentation/providers/mock';

const image: MakeupPhotoInput = {
  id: 'evidence-image',
  fileName: 'evidence.jpg',
  mimeType: 'image/jpeg',
  sizeBytes: 120000,
  source: 'fixture',
  uploadedAt: '2026-05-28T00:00:00.000Z',
};

const pixelData: ImagePixelData = {
  width: 8,
  height: 8,
  data: new Uint8ClampedArray(
    Array.from({ length: 8 * 8 }).flatMap((_, index) => {
      const y = Math.floor(index / 8);

      return y > 5 ? [220, 80, 100, 255] : [180, 160, 145, 255];
    }),
  ),
};

describe('template evidence schema', () => {
  it('attaches formal TemplateEvidence and verification status to converged templates', async () => {
    const analysis = await runMakeupAnalysisPipeline({
      image,
      provider: createMockVisionProvider(),
      segmentationProvider: createMockSegmentationProvider(),
      pixelData,
    });
    const template = buildMakeupTemplateFromVisionAnalysis({
      image,
      templateName: 'Evidence Template',
      createdBy: 'tester',
      analysis,
    });
    const editableMasks = analysis.cosmeticSegmentation.masks.map((mask) =>
      mask.target === 'lips'
        ? applyMaskBrushEdit(createEditableCosmeticMask(mask), {
            id: 'evidence-edit',
            target: 'lips',
            tool: 'brush-add',
            point: { x: 0.5, y: 0.7, space: 'normalized-image' },
            radius: 0.2,
            strength: 0.9,
            createdAt: '2026-05-28T00:00:00.000Z',
          })
        : createEditableCosmeticMask(mask),
    );
    const converged = convergeTemplateWithHumanCorrections({
      template,
      analysis,
      editableMasks,
      adjustedRegions: ['lips'],
      exportedAt: '2026-05-28T00:01:00.000Z',
    });

    expect(converged.evidence.schemaVersion).toBe(TEMPLATE_EVIDENCE_SCHEMA_VERSION);
    expect(converged.template.evidence?.humanCorrectionEvidence.adjustedRegions).toEqual(['lips']);
    expect(converged.template.metadata.evidenceId).toBe(converged.evidence.evidenceId);
    expect(converged.humanVerificationStatus).toBe('ready_for_dataset');
    expect(converged.correctionDatasetSamples).toHaveLength(1);
    expect(converged.evidence.sourceImageEvidence.imageId).toBe(image.id);
    expect(converged.evidence.qualityEvidence.readyForDataset).toBe(true);
  });
});
