import type {
  HumanCorrectionEditorMetadata,
  HumanCorrectionSample,
  HumanVerificationStatus,
  MakeupStep,
  MakeupTemplate,
  MakeupTemplateRegionEvidence,
  TemplateEvidence,
  TemplateEvidenceBase,
} from '../../templates/schema';
import { TEMPLATE_EVIDENCE_SCHEMA_VERSION } from '../../templates/schema';
import { createHumanMaskCorrectionSample } from '../../templates/storage/datasetExport';
import type {
  CosmeticSegmentationTarget,
  EditableCosmeticMask,
  MakeupAnalysisPipelineResult,
} from '../../vision';

export interface TemplateConvergenceInput {
  template: MakeupTemplate;
  analysis: MakeupAnalysisPipelineResult;
  editableMasks: readonly EditableCosmeticMask[];
  adjustedRegions: readonly CosmeticSegmentationTarget[];
  originalAnalysis?: MakeupAnalysisPipelineResult;
  editorMetadata?: HumanCorrectionEditorMetadata;
  correctionReason?: string;
  exportedAt?: string;
  rejectedReasons?: readonly string[];
}

export interface TemplateConvergenceResult {
  template: MakeupTemplate;
  evidence: TemplateEvidence;
  correctionDatasetSamples: HumanCorrectionSample[];
  humanVerificationStatus: HumanVerificationStatus;
  correctionConfidence: number;
  humanAdjustedRegions: CosmeticSegmentationTarget[];
  evidenceNotes: string[];
}

export type TemplateConvergenceDiffKind =
  | 'mask-changed'
  | 'opacity-changed'
  | 'edge-softness-changed'
  | 'semantic-label-changed'
  | 'confidence-changed'
  | 'generated-steps-changed';

export interface TemplateConvergenceDiffItem {
  id: string;
  kind: TemplateConvergenceDiffKind;
  label: string;
  region?: CosmeticSegmentationTarget;
  before: string;
  after: string;
  changed: boolean;
}

export interface TemplateConvergenceDiffResult {
  source: {
    aiTemplateId: string;
    humanTemplateId: string;
  };
  changedCount: number;
  items: TemplateConvergenceDiffItem[];
}

const unique = <T>(items: readonly T[]): T[] => Array.from(new Set(items));

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const formatNumber = (value: number | undefined): string =>
  value === undefined ? 'n/a' : value.toFixed(3);

const summarizeSteps = (steps: readonly MakeupStep[]): string =>
  steps.map((step) => `${step.order}:${step.region}:${step.action}`).join('|') ||
  'none';

const summarizeSemanticLabels = (template: MakeupTemplate): string =>
  [
    ...template.metadata.styleTags,
    ...template.style.signatureTraits,
    ...(template.notes ?? []).filter((note) => note.includes(':')),
  ]
    .filter(Boolean)
    .join('|') || 'none';

const summarizeRegionConfidence = (
  regions: readonly MakeupTemplateRegionEvidence[],
): string =>
  regions
    .map((region) => `${region.region}:${formatNumber(region.confidence)}`)
    .join('|') || 'none';

const hasMaskChange = (mask: EditableCosmeticMask): boolean =>
  mask.baseMask.grid.alpha.some(
    (value, index) =>
      Math.abs(value - (mask.mergedMask.grid.alpha[index] ?? 0)) > 0.0001,
  );

const maskCoverage = (
  mask: EditableCosmeticMask,
  source: 'base' | 'merged',
): string => {
  const alpha =
    source === 'base' ? mask.baseMask.grid.alpha : mask.mergedMask.grid.alpha;
  const coverage =
    alpha.length === 0
      ? 0
      : alpha.reduce((sum, value) => sum + value, 0) / alpha.length;

  return formatNumber(coverage);
};

const baseEvidence = (input: {
  source: TemplateEvidenceBase['source'];
  confidence: number;
  createdAt: string;
  regionIds: readonly string[];
  debugReferences: readonly string[];
  notes: readonly string[];
}): TemplateEvidenceBase => ({
  source: input.source,
  confidence: clamp01(Number(input.confidence.toFixed(4))),
  version: TEMPLATE_EVIDENCE_SCHEMA_VERSION,
  createdAt: input.createdAt,
  regionIds: [...input.regionIds],
  debugReferences: [...input.debugReferences],
  notes: [...input.notes],
});

export const determineHumanVerificationStatus = (input: {
  adjustedRegions: readonly CosmeticSegmentationTarget[];
  editCount: number;
  correctionConfidence: number;
  rejectedReasons?: readonly string[];
}): HumanVerificationStatus => {
  if ((input.rejectedReasons ?? []).length > 0) {
    return 'rejected';
  }

  if (input.adjustedRegions.length === 0 && input.editCount === 0) {
    return 'ai_generated';
  }

  if (input.correctionConfidence >= 0.82 && input.adjustedRegions.length > 0) {
    return 'ready_for_dataset';
  }

  if (input.correctionConfidence >= 0.7 && input.adjustedRegions.length > 0) {
    return 'human_verified';
  }

  return 'human_corrected';
};

export const createTemplateEvidenceFromConvergence = (input: {
  template: MakeupTemplate;
  analysis: MakeupAnalysisPipelineResult;
  editableMasks: readonly EditableCosmeticMask[];
  adjustedRegions: readonly CosmeticSegmentationTarget[];
  correctionConfidence: number;
  humanVerificationStatus: HumanVerificationStatus;
  evidenceNotes: readonly string[];
  createdAt: string;
  rejectedReasons?: readonly string[];
}): TemplateEvidence => {
  const regionIds = input.analysis.cosmeticRegions.map((region) => region.id);
  const maskIds = input.analysis.cosmeticSegmentation.masks.map((mask) => mask.id);
  const debugReferences = input.analysis.debug.map(
    (artifact) => `${artifact.stage}:${artifact.label}`,
  );
  const editCount = input.editableMasks.reduce(
    (sum, mask) => sum + mask.userModifications.length,
    0,
  );
  const correctionRecordIds = input.editableMasks.map(
    (mask) => `${input.analysis.imageId}:${mask.mergedMask.target}:${mask.id}`,
  );
  const base = {
    createdAt: input.createdAt,
    regionIds,
    debugReferences,
  };

  return {
    schemaVersion: TEMPLATE_EVIDENCE_SCHEMA_VERSION,
    evidenceId: `evidence:${input.template.id}:${input.analysis.imageId}:${input.humanVerificationStatus}`,
    templateId: input.template.id,
    createdAt: input.createdAt,
    sourceImageEvidence: {
      ...baseEvidence({
        ...base,
        source: 'source-image',
        confidence: 1,
        notes: [`image:${input.template.metadata.source.imageId}`],
      }),
      source: 'source-image',
      imageId: input.template.metadata.source.imageId,
      fileName: input.template.metadata.source.fileName,
      sourceType: input.template.metadata.source.sourceType,
    },
    faceGeometryEvidence: {
      ...baseEvidence({
        ...base,
        source: 'facemesh',
        confidence: input.analysis.faceMesh.confidence ?? input.analysis.faceDetection.confidence,
        notes: [`landmarks:${input.analysis.faceMesh.landmarks.length}`],
      }),
      source: 'facemesh',
      faceId: input.analysis.faceMesh.faceId,
      landmarkCount: input.analysis.faceMesh.landmarks.length,
      boundingBox: {
        x: input.analysis.faceMesh.boundingBox.x,
        y: input.analysis.faceMesh.boundingBox.y,
        width: input.analysis.faceMesh.boundingBox.width,
        height: input.analysis.faceMesh.boundingBox.height,
      },
    },
    segmentationEvidence: {
      ...baseEvidence({
        ...base,
        source: 'cosmetic-segmentation',
        confidence:
          input.analysis.cosmeticSegmentation.masks.length === 0
            ? 0
            : input.analysis.cosmeticSegmentation.masks.reduce(
                (sum, mask) => sum + mask.confidence,
                0,
              ) / input.analysis.cosmeticSegmentation.masks.length,
        notes: [`provider:${input.analysis.cosmeticSegmentation.providerId}`],
      }),
      source: 'cosmetic-segmentation',
      providerId: input.analysis.cosmeticSegmentation.providerId,
      maskCount: input.analysis.cosmeticSegmentation.masks.length,
      maskIds,
    },
    weightedSamplingEvidence: {
      ...baseEvidence({
        ...base,
        source: 'weighted-sampling',
        confidence: input.analysis.pixelAnalysis?.weighted ? 0.86 : 0,
        notes: input.analysis.pixelAnalysis?.weighted?.debug.samplingStatistics ?? [],
      }),
      source: 'weighted-sampling',
      sampleGroups: Object.keys(input.analysis.pixelAnalysis?.weighted?.samples ?? {}),
      heatmapReferences:
        input.analysis.pixelAnalysis?.weighted?.debug.weightedHeatmap ?? [],
    },
    skinBaselineEvidence: {
      ...baseEvidence({
        ...base,
        source: 'skin-baseline',
        confidence: input.analysis.pixelAnalysis?.skinBaseline ? 0.82 : 0,
        notes: input.analysis.pixelAnalysis?.skinBaseline?.debug ?? [],
      }),
      source: 'skin-baseline',
      differenceTargets: Object.keys(
        input.analysis.pixelAnalysis?.skinBaseline?.differences ?? {},
      ),
    },
    edgeAnalysisEvidence: {
      ...baseEvidence({
        ...base,
        source: 'edge-analysis',
        confidence: input.analysis.pixelAnalysis?.edgeAnalysis ? 0.82 : 0,
        notes: input.analysis.pixelAnalysis?.edgeAnalysis?.debug ?? [],
      }),
      source: 'edge-analysis',
      edgeTargets: Object.keys(input.analysis.pixelAnalysis?.edgeAnalysis?.features ?? {}),
    },
    semanticEvidence: {
      ...baseEvidence({
        ...base,
        source: 'semantic-analysis',
        confidence: input.analysis.semanticAnalysis ? 0.78 : 0,
        notes: input.analysis.semanticAnalysis?.semanticSummary ?? [],
      }),
      source: 'semantic-analysis',
      labels: input.analysis.semanticAnalysis?.semanticSummary ?? [],
      explanations: input.analysis.semanticAnalysis?.explanations ?? [],
    },
    humanCorrectionEvidence: {
      ...baseEvidence({
        ...base,
        source: 'human-correction',
        confidence: input.correctionConfidence,
        notes: input.evidenceNotes,
      }),
      source: 'human-correction',
      correctionRecordIds,
      adjustedRegions: [...input.adjustedRegions],
      editCount,
    },
    convergenceEvidence: {
      ...baseEvidence({
        ...base,
        source: 'template-convergence',
        confidence: input.correctionConfidence,
        notes: input.evidenceNotes,
      }),
      source: 'template-convergence',
      humanVerificationStatus: input.humanVerificationStatus,
      correctionConfidence: input.correctionConfidence,
      evidenceNotes: [...input.evidenceNotes],
    },
    qualityEvidence: {
      ...baseEvidence({
        ...base,
        source: 'quality-gate',
        confidence: input.correctionConfidence,
        notes: input.rejectedReasons ?? [],
      }),
      source: 'quality-gate',
      humanVerificationStatus: input.humanVerificationStatus,
      readyForDataset: input.humanVerificationStatus === 'ready_for_dataset',
      rejectionReasons: [...(input.rejectedReasons ?? [])],
    },
  };
};

export const convergeTemplateWithHumanCorrections = (
  input: TemplateConvergenceInput,
): TemplateConvergenceResult => {
  const humanAdjustedRegions = unique(input.adjustedRegions);
  const editCount = input.editableMasks.reduce(
    (sum, mask) => sum + mask.userModifications.length,
    0,
  );
  const maskConfidence =
    input.editableMasks.length === 0
      ? 0
      : input.editableMasks.reduce(
          (sum, mask) => sum + mask.mergedMask.confidence,
          0,
        ) / input.editableMasks.length;
  const correctionConfidence = Number(
    Math.min(1, 0.58 + editCount * 0.035 + maskConfidence * 0.25).toFixed(3),
  );
  const humanVerificationStatus = determineHumanVerificationStatus({
    adjustedRegions: humanAdjustedRegions,
    editCount,
    correctionConfidence,
    rejectedReasons: input.rejectedReasons,
  });
  const evidenceNotes = [
    `human_adjusted_regions:${humanAdjustedRegions.join(',') || 'none'}`,
    `mask_edit_count:${editCount}`,
    `pipeline_trace:${input.analysis.trace.join('>')}`,
  ];
  const evidenceCreatedAt = input.exportedAt ?? input.template.metadata.createdAt;
  const evidence = createTemplateEvidenceFromConvergence({
    template: input.template,
    analysis: input.analysis,
    editableMasks: input.editableMasks,
    adjustedRegions: humanAdjustedRegions,
    correctionConfidence,
    humanVerificationStatus,
    evidenceNotes,
    createdAt: evidenceCreatedAt,
    rejectedReasons: input.rejectedReasons,
  });
  const editorMetadata: HumanCorrectionEditorMetadata =
    input.editorMetadata ?? {
      editorId: input.template.metadata.createdBy,
      tool: 'template-studio',
      sessionId: `${input.analysis.imageId}:${input.template.id}`,
      editedAt: evidenceCreatedAt,
      notes: [],
    };
  const correctionDatasetSamples = input.editableMasks
    .filter(
      (mask) =>
        mask.userModifications.length > 0 ||
        humanAdjustedRegions.includes(mask.mergedMask.target),
    )
    .map((editableMask) =>
      createHumanMaskCorrectionSample({
        imageId: input.analysis.imageId,
        templateId: input.template.id,
        editableMask,
        originalAnalysis: input.originalAnalysis ?? input.analysis,
        updatedAnalysis: input.analysis,
        editorMetadata,
        correctionReason: input.correctionReason ?? 'human mask correction',
        correctionConfidence,
        humanVerificationStatus,
        exportedAt: evidenceCreatedAt,
      }),
    );

  return {
    template: {
      ...input.template,
      metadata: {
        ...input.template.metadata,
        visionEvidence: {
          source: humanAdjustedRegions.length > 0 ? 'human-verified' : 'ai-only',
          maskEditCount: editCount,
          adjustedRegions: humanAdjustedRegions,
          evidenceNotes,
        },
        correctionConfidence,
        humanAdjustedRegions,
        analysisVersion: 'vision-first-4c',
        humanVerificationStatus,
        evidenceId: evidence.evidenceId,
        visionMetrics: {
          ...input.template.metadata.visionMetrics,
          opacityConfidence:
            input.analysis.pixelAnalysis?.skinBaseline?.differences.blush
              ?.opacityEstimate ??
            input.template.metadata.visionMetrics?.opacityConfidence,
          edgeSoftness:
            input.analysis.pixelAnalysis?.edgeAnalysis?.features.lips
              ?.edgeSoftnessScore ??
            input.template.metadata.visionMetrics?.edgeSoftness,
          diffusionQuality:
            input.analysis.pixelAnalysis?.edgeAnalysis?.features.blush
              ?.diffusionScore ??
            input.template.metadata.visionMetrics?.diffusionQuality,
          skinRelativeIntensity:
            input.analysis.pixelAnalysis?.skinBaseline?.differences.eyeshadow
              ?.opacityEstimate ??
            input.template.metadata.visionMetrics?.skinRelativeIntensity,
        },
      },
      evidence,
      notes: [...(input.template.notes ?? []), ...evidenceNotes],
    },
    evidence,
    correctionDatasetSamples,
    humanVerificationStatus,
    correctionConfidence,
    humanAdjustedRegions,
    evidenceNotes,
  };
};

export const diffTemplatesForConvergence = (input: {
  aiOnlyTemplate: MakeupTemplate;
  humanVerifiedTemplate: MakeupTemplate;
  editableMasks: readonly EditableCosmeticMask[];
}): TemplateConvergenceDiffResult => {
  const maskItems: TemplateConvergenceDiffItem[] = input.editableMasks.map(
    (mask) => ({
      id: `mask-changed:${mask.mergedMask.target}`,
      kind: 'mask-changed',
      label: `Mask changed: ${mask.mergedMask.target}`,
      region: mask.mergedMask.target,
      before: `coverage:${maskCoverage(mask, 'base')}`,
      after: `coverage:${maskCoverage(mask, 'merged')}`,
      changed: hasMaskChange(mask),
    }),
  );
  const opacityBefore =
    input.aiOnlyTemplate.metadata.visionMetrics?.opacityConfidence;
  const opacityAfter =
    input.humanVerifiedTemplate.metadata.visionMetrics?.opacityConfidence;
  const edgeBefore = input.aiOnlyTemplate.metadata.visionMetrics?.edgeSoftness;
  const edgeAfter =
    input.humanVerifiedTemplate.metadata.visionMetrics?.edgeSoftness;
  const semanticBefore = summarizeSemanticLabels(input.aiOnlyTemplate);
  const semanticAfter = summarizeSemanticLabels(input.humanVerifiedTemplate);
  const confidenceBefore = input.aiOnlyTemplate.metadata.correctionConfidence;
  const confidenceAfter =
    input.humanVerifiedTemplate.metadata.correctionConfidence;
  const stepsBefore = summarizeSteps(input.aiOnlyTemplate.steps);
  const stepsAfter = summarizeSteps(input.humanVerifiedTemplate.steps);
  const regionConfidenceBefore = summarizeRegionConfidence(
    input.aiOnlyTemplate.regions,
  );
  const regionConfidenceAfter = summarizeRegionConfidence(
    input.humanVerifiedTemplate.regions,
  );
  const items: TemplateConvergenceDiffItem[] = [
    ...maskItems,
    {
      id: 'opacity-changed',
      kind: 'opacity-changed',
      label: 'Opacity changed',
      before: formatNumber(opacityBefore),
      after: formatNumber(opacityAfter),
      changed: opacityBefore !== opacityAfter,
    },
    {
      id: 'edge-softness-changed',
      kind: 'edge-softness-changed',
      label: 'Edge softness changed',
      before: formatNumber(edgeBefore),
      after: formatNumber(edgeAfter),
      changed: edgeBefore !== edgeAfter,
    },
    {
      id: 'semantic-label-changed',
      kind: 'semantic-label-changed',
      label: 'Semantic label changed',
      before: semanticBefore,
      after: semanticAfter,
      changed: semanticBefore !== semanticAfter,
    },
    {
      id: 'confidence-changed',
      kind: 'confidence-changed',
      label: 'Confidence changed',
      before: [
        `correction:${formatNumber(confidenceBefore)}`,
        `regions:${regionConfidenceBefore}`,
      ].join(' / '),
      after: [
        `correction:${formatNumber(confidenceAfter)}`,
        `regions:${regionConfidenceAfter}`,
      ].join(' / '),
      changed:
        confidenceBefore !== confidenceAfter ||
        regionConfidenceBefore !== regionConfidenceAfter,
    },
    {
      id: 'generated-steps-changed',
      kind: 'generated-steps-changed',
      label: 'Generated steps changed',
      before: stepsBefore,
      after: stepsAfter,
      changed: stepsBefore !== stepsAfter,
    },
  ];

  return {
    source: {
      aiTemplateId: input.aiOnlyTemplate.id,
      humanTemplateId: input.humanVerifiedTemplate.id,
    },
    changedCount: items.filter((item) => item.changed).length,
    items,
  };
};
