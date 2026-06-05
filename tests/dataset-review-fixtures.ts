import type {
  HumanCorrectionDataset,
  HumanMaskCorrectionSample,
  MakeupTemplate,
  TemplateEvidence,
} from '../src/templates/schema';
import { HUMAN_CORRECTION_DATASET_SCHEMA_VERSION } from '../src/templates/schema';
import type {
  CosmeticSegmentationMask,
  CosmeticSegmentationTarget,
  MakeupPixelAnalysis,
  MakeupSemanticAnalysis,
} from '../src/vision';
import { diffSegmentationMasks } from '../src/vision';

const createdAt = '2026-05-28T00:00:00.000Z';

export const maskFixture = (
  id: string,
  target: CosmeticSegmentationTarget,
  alpha: readonly number[],
): CosmeticSegmentationMask => ({
  id,
  target,
  polygon: {
    space: 'normalized-image',
    points: [
      { x: 0.2, y: 0.2 },
      { x: 0.8, y: 0.2 },
      { x: 0.8, y: 0.8 },
      { x: 0.2, y: 0.8 },
    ],
  },
  bounds: {
    x: 0.2,
    y: 0.2,
    width: 0.6,
    height: 0.6,
    space: 'normalized-image',
  },
  grid: {
    width: 3,
    height: 3,
    alpha,
  },
  confidence: 0.9,
  debug: [],
});

export const pixelAnalysisFixture = (imageId: string): MakeupPixelAnalysis => ({
  version: '0.1',
  imageId,
  lips: {
    dominantHue: 345,
    saturation: 0.6,
    brightness: 0.7,
    edgeSoftness: 0.35,
    gradientDirection: 'center',
  },
  blush: {
    blushCenter: { x: 0.48, y: 0.52 },
    spreadRadius: 0.22,
    opacity: 0.42,
    tone: 'warm',
  },
  eyes: {
    eyeshadowDarkness: 0.36,
    shimmerEstimation: 0.18,
    eyelinerDirection: 'upward',
  },
  debug: [],
});

export const semanticsFixture = (
  imageId: string,
  semanticSummary: readonly string[],
): MakeupSemanticAnalysis => ({
  version: '0.1',
  sourcePixelAnalysis: pixelAnalysisFixture(imageId),
  lipStyle: 'defined_satin',
  lipFinish: 'satin',
  blushStyle: 'soft_diffused',
  eyeStyle: 'clean_defined',
  semanticSummary: [...semanticSummary],
  explanations: ['fixture'],
});

export const sampleFixture = (input: {
  sampleId: string;
  target?: CosmeticSegmentationTarget;
  imageId?: string;
  templateId?: string;
  correctionConfidence?: number;
  humanVerificationStatus?: HumanMaskCorrectionSample['humanVerificationStatus'];
  originalAlpha?: readonly number[];
  editedAlpha?: readonly number[];
  originalSemantics?: readonly string[];
  updatedSemantics?: readonly string[];
}): HumanMaskCorrectionSample => {
  const target = input.target ?? 'lips';
  const imageId = input.imageId ?? 'image-a';
  const originalMask = maskFixture(
    `${input.sampleId}-original`,
    target,
    input.originalAlpha ?? [0, 0, 0, 0, 0.5, 0, 0, 0, 0],
  );
  const humanEditedMask = maskFixture(
    `${input.sampleId}-edited`,
    target,
    input.editedAlpha ?? [0, 0, 0, 0.25, 0.65, 0.25, 0, 0, 0],
  );

  return {
    schemaVersion: HUMAN_CORRECTION_DATASET_SCHEMA_VERSION,
    sampleId: input.sampleId,
    sampleKind: 'mask-correction',
    imageId,
    templateId: input.templateId ?? 'template-a',
    regionId: target,
    originalSegmentationMask: originalMask,
    humanEditedMask,
    maskDiff: diffSegmentationMasks(originalMask, humanEditedMask),
    originalPixelAnalysis: pixelAnalysisFixture(imageId),
    updatedPixelAnalysis: pixelAnalysisFixture(imageId),
    originalSemantics: semanticsFixture(
      imageId,
      input.originalSemantics ?? ['lip_style:defined_satin'],
    ),
    updatedSemantics: semanticsFixture(
      imageId,
      input.updatedSemantics ?? ['lip_style:defined_satin'],
    ),
    editorMetadata: {
      editorId: 'fixture-editor',
      tool: 'template-studio',
      sessionId: 'fixture-session',
      editedAt: createdAt,
      notes: [],
    },
    correctionReason: 'fixture correction',
    correctionConfidence: input.correctionConfidence ?? 0.9,
    exportedAt: '2026-05-28T00:01:00.000Z',
    humanVerificationStatus: input.humanVerificationStatus ?? 'ready_for_dataset',
    editCount: 1,
  };
};

export const datasetFixture = (
  samples: readonly HumanMaskCorrectionSample[],
): HumanCorrectionDataset => ({
  schemaVersion: HUMAN_CORRECTION_DATASET_SCHEMA_VERSION,
  datasetId: 'dataset-fixture',
  templateId: 'template-a',
  imageId: 'image-a',
  createdAt,
  exportedAt: '2026-05-28T00:01:00.000Z',
  sampleCount: samples.length,
  humanVerificationStatus: 'ready_for_dataset',
  samples: [...samples],
  summary: {
    regions: [...new Set(samples.map((sample) => sample.regionId))].sort(),
    averageCorrectionConfidence:
      samples.reduce((sum, sample) => sum + sample.correctionConfidence, 0) /
      Math.max(1, samples.length),
    readyForTraining: samples.length > 0,
    notes: [],
  },
});

const baseEvidence = {
  confidence: 0.9,
  version: 'template-evidence-v0.1' as const,
  createdAt,
  regionIds: ['lips'],
  debugReferences: ['fixture'],
  notes: ['fixture'],
};

export const evidenceFixture = (): TemplateEvidence => ({
  schemaVersion: 'template-evidence-v0.1',
  evidenceId: 'evidence-fixture',
  templateId: 'template-a',
  createdAt,
  sourceImageEvidence: {
    ...baseEvidence,
    source: 'source-image',
    imageId: 'image-a',
    fileName: 'fixture.jpg',
    sourceType: 'fixture',
  },
  faceGeometryEvidence: {
    ...baseEvidence,
    source: 'facemesh',
    faceId: 'face-a',
    landmarkCount: 36,
    boundingBox: { x: 0.2, y: 0.1, width: 0.6, height: 0.8 },
  },
  segmentationEvidence: {
    ...baseEvidence,
    source: 'cosmetic-segmentation',
    providerId: 'fixture',
    maskCount: 1,
    maskIds: ['mask-a'],
  },
  weightedSamplingEvidence: {
    ...baseEvidence,
    source: 'weighted-sampling',
    sampleGroups: ['lips'],
    heatmapReferences: ['lips:3x3'],
  },
  skinBaselineEvidence: {
    ...baseEvidence,
    source: 'skin-baseline',
    differenceTargets: ['lips'],
  },
  edgeAnalysisEvidence: {
    ...baseEvidence,
    source: 'edge-analysis',
    edgeTargets: ['lips'],
  },
  semanticEvidence: {
    ...baseEvidence,
    source: 'semantic-analysis',
    labels: ['lip_style:defined_satin'],
    explanations: ['fixture'],
  },
  humanCorrectionEvidence: {
    ...baseEvidence,
    source: 'human-correction',
    correctionRecordIds: ['correction-a'],
    adjustedRegions: ['lips'],
    editCount: 1,
  },
  convergenceEvidence: {
    ...baseEvidence,
    source: 'template-convergence',
    humanVerificationStatus: 'ready_for_dataset',
    correctionConfidence: 0.9,
    evidenceNotes: ['fixture'],
  },
  qualityEvidence: {
    ...baseEvidence,
    source: 'quality-gate',
    humanVerificationStatus: 'ready_for_dataset',
    readyForDataset: true,
    rejectionReasons: [],
  },
});

export const templateFixture = (id: string): MakeupTemplate => ({
  id,
  name: `${id} template`,
  goals: ['fixture'],
  faceStrategy: {
    id: 'strategy-fixture',
    summary: 'fixture strategy',
    goals: ['balanced fixture'],
    suitableFaceTypes: ['oval'],
    reasoning: ['fixture'],
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
    signatureTraits: ['fixture'],
    confidence: 0.9,
    evidence: ['fixture'],
  },
  faceSuitability: {
    profile: {
      faceShapes: ['oval'],
      skinTypes: ['combination'],
      skinTones: ['neutral'],
      eyeTypes: ['double'],
      lipShapes: ['full'],
    },
    confidence: 0.9,
    rationale: ['fixture'],
  },
  regions: [],
  eyeDesign: {
    summary: 'soft wash',
    effects: ['widen'],
    emphasis: 'outer corner',
  },
  lipDesign: {
    summary: 'defined rose',
    effects: ['balance'],
    emphasis: 'lip line',
  },
  contourDesign: {
    summary: 'soft contour',
    effects: ['lift'],
    emphasis: 'cheekbone',
  },
  steps: [],
  metadata: {
    version: '0.1',
    status: 'validated',
    createdAt,
    createdBy: 'fixture',
    source: {
      imageId: 'image-a',
      fileName: 'fixture.jpg',
      sourceType: 'fixture',
    },
    styleTags: ['fixture'],
    humanVerificationStatus: 'ready_for_dataset',
  },
});
