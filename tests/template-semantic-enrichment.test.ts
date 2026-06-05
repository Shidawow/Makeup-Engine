import { describe, expect, it } from 'vitest';
import {
  buildMakeupTemplateFromVisionAnalysis,
  enrichMakeupTemplateWithSemanticProvider,
} from '../src/template-engine';
import type { MakeupAnalysisPipelineResult, MakeupPhotoInput } from '../src/vision';
import { createOpenAISemanticProvider } from '../src/vision';
import {
  makeupParametersFixture,
} from './semantic-provider-fixtures';
import {
  pixelAnalysisFixture,
  semanticsFixture,
} from './dataset-review-fixtures';

const image: MakeupPhotoInput = {
  id: 'semantic-template-image',
  fileName: 'semantic-template.jpg',
  mimeType: 'image/jpeg',
  sizeBytes: 1000,
  source: 'fixture',
  uploadedAt: '2026-05-29T00:00:00.000Z',
};

const analysis: MakeupAnalysisPipelineResult = {
  imageId: image.id,
  providerId: 'local-cv',
  faceDetection: {
    detected: true,
    confidence: 0.9,
    box: { x: 0.2, y: 0.2, width: 0.5, height: 0.5, space: 'normalized-image' },
  },
  faceMesh: {
    faceId: 'face-semantic',
    imageId: image.id,
    landmarks: [],
    boundingBox: { x: 0.2, y: 0.2, width: 0.5, height: 0.5, space: 'normalized-image' },
    debug: [],
  },
  segmentationMasks: [],
  cosmeticRegions: [],
  cosmeticSegmentation: {
    imageId: image.id,
    providerId: 'local-segmentation',
    masks: [],
    debug: [],
  },
  pixelAnalysis: pixelAnalysisFixture(image.id),
  semanticAnalysis: semanticsFixture(image.id, ['lip_style:defined_satin']),
  parameters: {
    ...makeupParametersFixture(),
    imageId: image.id,
    semanticAnalysis: semanticsFixture(image.id, ['lip_style:defined_satin']),
    pixelAnalysis: pixelAnalysisFixture(image.id),
  },
  trace: ['image-input', 'face-detection', 'landmarks', 'template-parameterization'],
  debug: [],
};

describe('template semantic enrichment', () => {
  it('optionally enriches copy while preserving local CV template structure', async () => {
    const baseTemplate = buildMakeupTemplateFromVisionAnalysis({
      image,
      templateName: 'Local CV Template',
      createdBy: 'tester',
      analysis,
    });
    const enriched = await enrichMakeupTemplateWithSemanticProvider({
      template: baseTemplate,
      analysis,
      semanticProvider: createOpenAISemanticProvider(),
    });
    const fallback = await enrichMakeupTemplateWithSemanticProvider({
      template: baseTemplate,
      analysis,
    });

    expect(enriched.name).not.toBe(baseTemplate.name);
    expect(enriched.metadata.semanticEnrichment?.providerId).toBe(
      'openai-semantic-placeholder',
    );
    expect(enriched.steps).toHaveLength(baseTemplate.steps.length);
    expect(fallback).toBe(baseTemplate);
  });
});
