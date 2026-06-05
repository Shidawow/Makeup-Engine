import type {
  HumanCorrectionDataset,
  HumanCorrectionEditorMetadata,
  HumanCorrectionSample,
  HumanMaskCorrectionSample,
  HumanTemplateCorrectionSample,
} from '../schema/correction-dataset.schema';
import type {
  DatasetManifest,
  DatasetCurationMetrics,
  DatasetReviewQueue,
  DatasetSplit,
  SegmentationTrainingManifest,
  OfflineOperatorAuditReport,
  OfflineTrainingPackage,
  OfflineTrainingPackageManifest,
} from '../schema';
import type { SourceImageManifest } from '../../training/schema';
import { HUMAN_CORRECTION_DATASET_SCHEMA_VERSION } from '../schema/correction-dataset.schema';
import type { HumanVerificationStatus } from '../schema/evidence.schema';
import type { MakeupTemplate } from '../schema/template.schema';
import {
  diffSegmentationMasks,
  type CosmeticSegmentationMask,
  type EditableCosmeticMask,
  type MakeupAnalysisPipelineResult,
} from '../../vision';

export interface HumanMaskCorrectionSampleInput {
  imageId: string;
  templateId: string;
  editableMask: EditableCosmeticMask;
  originalAnalysis?: MakeupAnalysisPipelineResult | null;
  updatedAnalysis?: MakeupAnalysisPipelineResult | null;
  editorMetadata: HumanCorrectionEditorMetadata;
  correctionReason: string;
  correctionConfidence: number;
  humanVerificationStatus: HumanVerificationStatus;
  exportedAt: string;
}

export interface HumanTemplateCorrectionSampleInput extends HumanMaskCorrectionSampleInput {
  originalTemplate: MakeupTemplate;
  updatedTemplate: MakeupTemplate;
  templateDiffSummary: string[];
}

export interface HumanCorrectionDatasetInput {
  datasetId?: string;
  imageId: string;
  templateId: string;
  samples: readonly HumanCorrectionSample[];
  createdAt: string;
  exportedAt: string;
  humanVerificationStatus: HumanVerificationStatus;
  notes?: readonly string[];
}

export interface WorkbenchCorrectionDatasetInput {
  imageId: string;
  templateId: string;
  editableMasks: readonly EditableCosmeticMask[];
  originalAnalysis?: MakeupAnalysisPipelineResult | null;
  updatedAnalysis?: MakeupAnalysisPipelineResult | null;
  editorMetadata: HumanCorrectionEditorMetadata;
  correctionReason: string;
  correctionConfidence: number;
  humanVerificationStatus: HumanVerificationStatus;
  createdAt: string;
  exportedAt: string;
  selectedRegions?: readonly CosmeticSegmentationMask['target'][];
  notes?: readonly string[];
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  !(value instanceof Uint8ClampedArray);

export const stableStringify = (value: unknown): string => {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (value instanceof Uint8ClampedArray) {
    return stableStringify(Array.from(value));
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  if (isPlainObject(value)) {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(',')}}`;
  }

  return JSON.stringify(String(value));
};

export const stableHash = (value: unknown): string => {
  const input = stableStringify(value);
  let hash = 0x811c9dc5;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return (hash >>> 0).toString(16).padStart(8, '0');
};

const sampleId = (value: unknown): string => `sample-${stableHash(value)}`;

const datasetId = (value: unknown): string => `dataset-${stableHash(value)}`;

const sortedSamples = (
  samples: readonly HumanCorrectionSample[],
): HumanCorrectionSample[] =>
  [...samples].sort((a, b) => a.sampleId.localeCompare(b.sampleId));

const averageConfidence = (
  samples: readonly HumanCorrectionSample[],
): number =>
  samples.length === 0
    ? 0
    : Number(
        (
          samples.reduce((sum, sample) => sum + sample.correctionConfidence, 0) /
          samples.length
        ).toFixed(4),
      );

export const createHumanMaskCorrectionSample = (
  input: HumanMaskCorrectionSampleInput,
): HumanMaskCorrectionSample => {
  const originalSegmentationMask = input.editableMask.baseMask;
  const humanEditedMask = input.editableMask.mergedMask;
  const maskDiff = diffSegmentationMasks(originalSegmentationMask, humanEditedMask);
  const stableIdentity = {
    schemaVersion: HUMAN_CORRECTION_DATASET_SCHEMA_VERSION,
    imageId: input.imageId,
    templateId: input.templateId,
    regionId: humanEditedMask.target,
    originalMaskId: originalSegmentationMask.id,
    humanEditedMaskId: humanEditedMask.id,
    maskDiff,
    correctionReason: input.correctionReason,
    exportedAt: input.exportedAt,
  };

  return {
    schemaVersion: HUMAN_CORRECTION_DATASET_SCHEMA_VERSION,
    sampleId: sampleId(stableIdentity),
    sampleKind: 'mask-correction',
    imageId: input.imageId,
    templateId: input.templateId,
    regionId: humanEditedMask.target,
    originalSegmentationMask,
    humanEditedMask,
    maskDiff,
    originalPixelAnalysis: input.originalAnalysis?.pixelAnalysis ?? null,
    updatedPixelAnalysis: input.updatedAnalysis?.pixelAnalysis ?? null,
    originalSemantics: input.originalAnalysis?.semanticAnalysis ?? null,
    updatedSemantics: input.updatedAnalysis?.semanticAnalysis ?? null,
    editorMetadata: input.editorMetadata,
    correctionReason: input.correctionReason,
    correctionConfidence: Number(input.correctionConfidence.toFixed(4)),
    exportedAt: input.exportedAt,
    humanVerificationStatus: input.humanVerificationStatus,
    editCount: input.editableMask.userModifications.length,
  };
};

export const createHumanTemplateCorrectionSample = (
  input: HumanTemplateCorrectionSampleInput,
): HumanTemplateCorrectionSample => {
  const base = createHumanMaskCorrectionSample(input);
  const stableIdentity = {
    sampleId: base.sampleId,
    originalTemplateId: input.originalTemplate.id,
    updatedTemplateId: input.updatedTemplate.id,
    templateDiffSummary: input.templateDiffSummary,
  };

  return {
    ...base,
    sampleId: sampleId(stableIdentity),
    sampleKind: 'template-correction',
    templateDiffSummary: [...input.templateDiffSummary],
  };
};

export const createHumanCorrectionDataset = (
  input: HumanCorrectionDatasetInput,
): HumanCorrectionDataset => {
  const samples = sortedSamples(input.samples);
  const regions = Array.from(new Set(samples.map((sample) => sample.regionId))).sort();
  const summary = {
    regions,
    averageCorrectionConfidence: averageConfidence(samples),
    readyForTraining:
      samples.length > 0 &&
      input.humanVerificationStatus !== 'ai_generated' &&
      input.humanVerificationStatus !== 'rejected',
    notes: [...(input.notes ?? [])],
  };
  const stableIdentity = {
    schemaVersion: HUMAN_CORRECTION_DATASET_SCHEMA_VERSION,
    imageId: input.imageId,
    templateId: input.templateId,
    sampleIds: samples.map((sample) => sample.sampleId),
    exportedAt: input.exportedAt,
  };

  return {
    schemaVersion: HUMAN_CORRECTION_DATASET_SCHEMA_VERSION,
    datasetId: input.datasetId ?? datasetId(stableIdentity),
    templateId: input.templateId,
    imageId: input.imageId,
    createdAt: input.createdAt,
    exportedAt: input.exportedAt,
    sampleCount: samples.length,
    humanVerificationStatus: input.humanVerificationStatus,
    samples,
    summary,
  };
};

export const createCorrectionSamplesFromEditableMasks = (
  input: WorkbenchCorrectionDatasetInput,
): HumanMaskCorrectionSample[] => {
  const selected = input.selectedRegions
    ? new Set(input.selectedRegions)
    : null;

  return input.editableMasks
    .filter((mask) => !selected || selected.has(mask.mergedMask.target))
    .map((editableMask) =>
      createHumanMaskCorrectionSample({
        imageId: input.imageId,
        templateId: input.templateId,
        editableMask,
        originalAnalysis: input.originalAnalysis,
        updatedAnalysis: input.updatedAnalysis,
        editorMetadata: input.editorMetadata,
        correctionReason: input.correctionReason,
        correctionConfidence: input.correctionConfidence,
        humanVerificationStatus: input.humanVerificationStatus,
        exportedAt: input.exportedAt,
      }),
    );
};

export const createWorkbenchCorrectionDataset = (
  input: WorkbenchCorrectionDatasetInput,
): HumanCorrectionDataset =>
  createHumanCorrectionDataset({
    imageId: input.imageId,
    templateId: input.templateId,
    samples: createCorrectionSamplesFromEditableMasks(input),
    createdAt: input.createdAt,
    exportedAt: input.exportedAt,
    humanVerificationStatus: input.humanVerificationStatus,
    notes: input.notes,
  });

export const exportCorrectionSampleJson = (
  sample: HumanCorrectionSample,
): string => stableStringify(sample);

export const exportCorrectionDatasetJsonBundle = (
  dataset: HumanCorrectionDataset,
): string => stableStringify(dataset);

export const exportCorrectionDatasetJsonl = (
  dataset: HumanCorrectionDataset,
): string => dataset.samples.map((sample) => stableStringify(sample)).join('\n');

export const exportTemplateCorrectionSamples = (input: {
  templateId: string;
  dataset: HumanCorrectionDataset;
}): HumanCorrectionSample[] =>
  sortedSamples(
    input.dataset.samples.filter((sample) => sample.templateId === input.templateId),
  );

const reviewedTrainingSampleIds = (
  queue: DatasetReviewQueue,
  split?: DatasetSplit,
): Set<string> =>
  new Set(
    queue.items
      .filter(
        (item) =>
          (item.currentDecision.status === 'accepted' ||
            item.currentDecision.status === 'ready_for_training') &&
          item.evidenceSummary.isTrainingReady &&
          item.assignedSplit !== 'holdout' &&
          item.assignedSplit !== 'unassigned' &&
          (!split || item.assignedSplit === split),
      )
      .map((item) => item.sampleId),
  );

export interface ReviewedDatasetExportInput {
  dataset: HumanCorrectionDataset;
  queue: DatasetReviewQueue;
  exportedAt?: string;
  split?: DatasetSplit;
}

export const exportReviewedDatasetJson = (
  input: ReviewedDatasetExportInput,
): string => {
  const selectedIds = reviewedTrainingSampleIds(input.queue, input.split);
  const samples = sortedSamples(
    input.dataset.samples.filter((sample) => selectedIds.has(sample.sampleId)),
  );

  return stableStringify({
    schemaVersion: input.dataset.schemaVersion,
    datasetId: `reviewed-${input.dataset.datasetId}`,
    sourceDatasetId: input.dataset.datasetId,
    reviewQueueId: input.queue.queueId,
    templateId: input.dataset.templateId,
    imageId: input.dataset.imageId,
    exportedAt: input.exportedAt ?? input.dataset.exportedAt,
    sampleCount: samples.length,
    split: input.split ?? 'all',
    samples,
  });
};

export const exportReviewedDatasetJsonl = (
  input: ReviewedDatasetExportInput,
): string => {
  const selectedIds = reviewedTrainingSampleIds(input.queue, input.split);

  return sortedSamples(
    input.dataset.samples.filter((sample) => selectedIds.has(sample.sampleId)),
  )
    .map((sample) => stableStringify(sample))
    .join('\n');
};

export const exportManifestJson = (manifest: DatasetManifest): string =>
  stableStringify(manifest);

export const exportTrainSplit = (input: ReviewedDatasetExportInput): string =>
  exportReviewedDatasetJsonl({ ...input, split: 'train' });

export const exportValidationSplit = (
  input: ReviewedDatasetExportInput,
): string => exportReviewedDatasetJsonl({ ...input, split: 'validation' });

export const exportTestSplit = (input: ReviewedDatasetExportInput): string =>
  exportReviewedDatasetJsonl({ ...input, split: 'test' });

export const exportCurationMetricsJson = (
  metrics: DatasetCurationMetrics,
): string => stableStringify(metrics);

export const exportTrainingManifestJson = (
  manifest: SegmentationTrainingManifest,
): string => stableStringify(manifest);

export const exportTrainingSplitManifestJson = (
  manifest: SegmentationTrainingManifest,
  split: DatasetSplit,
): string => {
  const bundle =
    split === 'train'
      ? manifest.train
      : split === 'validation'
        ? manifest.validation
        : split === 'test'
          ? manifest.test
          : split === 'holdout'
            ? manifest.holdout
            : manifest.unassigned;

  return stableStringify({
    schemaVersion: manifest.schemaVersion,
    manifestId: `${manifest.manifestId}-${split}`,
    sourceManifestId: manifest.manifestId,
    split,
    sampleCount: bundle.sampleCount,
    samples: bundle.samples,
  });
};

export const exportTrainSplitManifestJson = (
  manifest: SegmentationTrainingManifest,
): string => exportTrainingSplitManifestJson(manifest, 'train');

export const exportValidationSplitManifestJson = (
  manifest: SegmentationTrainingManifest,
): string => exportTrainingSplitManifestJson(manifest, 'validation');

export const exportTestSplitManifestJson = (
  manifest: SegmentationTrainingManifest,
): string => exportTrainingSplitManifestJson(manifest, 'test');

export const exportOfflineTrainingPackageDatasetJson = (
  trainingPackage: OfflineTrainingPackage,
): string => stableStringify(trainingPackage);

export const exportOfflinePackageManifestDatasetJson = (
  trainingPackage: OfflineTrainingPackage,
): string => stableStringify(trainingPackage.manifest);

export const exportOfflineOperatorAuditReportDatasetJson = (
  report: OfflineOperatorAuditReport,
): string => stableStringify(report);

export interface MaterializedDatasetBuildInputExport {
  schemaVersion: 'materialized-dataset-build-input-v0.1';
  package: OfflineTrainingPackage;
  manifest: OfflineTrainingPackageManifest;
  audit: OfflineOperatorAuditReport;
  options: {
    out: string;
    strict: boolean;
    pretty: boolean;
  };
}

export const exportMaterializedDatasetBuildInputJson = (input: {
  trainingPackage: OfflineTrainingPackage;
  manifest?: OfflineTrainingPackageManifest;
  auditReport?: OfflineOperatorAuditReport;
  out?: string;
  strict?: boolean;
  pretty?: boolean;
}): string =>
  stableStringify({
    schemaVersion: 'materialized-dataset-build-input-v0.1',
    package: input.trainingPackage,
    manifest: input.manifest ?? input.trainingPackage.manifest,
    audit: input.auditReport ?? input.trainingPackage.auditSummary,
    options: {
      out: input.out ?? './datasets/makeup-engine/dev-v0',
      strict: input.strict ?? true,
      pretty: input.pretty ?? false,
    },
  } satisfies MaterializedDatasetBuildInputExport);

export const exportOfflinePackageCliBundleJson = (input: {
  trainingPackage: OfflineTrainingPackage;
  manifest?: OfflineTrainingPackageManifest;
  auditReport?: OfflineOperatorAuditReport;
}): string =>
  stableStringify({
    schemaVersion: 'offline-package-cli-bundle-v0.1',
    package: input.trainingPackage,
    manifest: input.manifest ?? input.trainingPackage.manifest,
    audit: input.auditReport ?? input.trainingPackage.auditSummary,
    command:
      'node scripts/build-training-dataset.mjs --package ./exports/offline-package.json --manifest ./exports/offline-package-manifest.json --audit ./exports/audit-report.json --out ./datasets/makeup-engine/dev-v0 --strict',
  });

export const exportOfflinePackageCliSummary = (input: {
  packagePath?: string;
  manifestPath?: string;
  auditPath?: string;
  out?: string;
  strict?: boolean;
}): string =>
  [
    'CLI 使用说明',
    `package: ${input.packagePath ?? './exports/offline-package.json'}`,
    `manifest: ${input.manifestPath ?? './exports/offline-package-manifest.json'}`,
    `audit: ${input.auditPath ?? './exports/audit-report.json'}`,
    `out: ${input.out ?? './datasets/makeup-engine/dev-v0'}`,
    `strict: ${input.strict ?? true}`,
    `command: node scripts/build-training-dataset.mjs --package ${
      input.packagePath ?? './exports/offline-package.json'
    } --manifest ${
      input.manifestPath ?? './exports/offline-package-manifest.json'
    } --audit ${input.auditPath ?? './exports/audit-report.json'} --out ${
      input.out ?? './datasets/makeup-engine/dev-v0'
    }${input.strict === false ? '' : ' --strict'}`,
  ].join('\n');

export const exportSourceImagePackageCliBundleJson = (input: {
  manifest: SourceImageManifest;
  out?: string;
}): string =>
  stableStringify({
    schemaVersion: 'source-image-package-cli-bundle-v0.1',
    manifest: input.manifest,
    command: `node scripts/import-source-images.mjs --input ./source-images --out ${input.out ?? './tmp/source-images/admin-batch-v0'} --codec-preference png,jpeg --materialize-normalized-png --materialize-raw-rgba --materialize-json-rgba --write-manifest --quality-gate`,
  });

export const exportSourceImageImportCliSummary = (input: {
  inputPath?: string;
  out?: string;
  strict?: boolean;
}): string =>
  [
    'Source image import CLI',
    `input: ${input.inputPath ?? './source-images'}`,
    `out: ${input.out ?? './tmp/source-images/admin-batch-v0'}`,
    'command: node scripts/import-source-images.mjs --input ' +
      `${input.inputPath ?? './source-images'} --out ${input.out ?? './tmp/source-images/admin-batch-v0'} ` +
      `--codec-preference png,jpeg --materialize-normalized-png --materialize-raw-rgba --materialize-json-rgba --write-manifest --quality-gate${input.strict ? ' --strict' : ''}`,
  ].join('\n');
