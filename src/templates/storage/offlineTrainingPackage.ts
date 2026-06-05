import type {
  DatasetReviewQueue,
  HumanCorrectionDataset,
  HumanCorrectionSample,
  OfflineDatasetVersion,
  OfflineImageReference,
  OfflineMaskArtifact,
  OfflineOperatorAuditReport,
  OfflinePackageValidationResult,
  OfflineTrainingPackage,
  OfflineTrainingPackageEntry,
  OfflineTrainingPackageManifest,
  SegmentationTrainingManifest,
  TrainingSampleReference,
} from '../schema';
import { OFFLINE_TRAINING_PACKAGE_SCHEMA_VERSION } from '../schema';
import type { CosmeticSegmentationTarget } from '../../vision';
import { createMaskArtifactReference } from '../../vision';
import { stableHash, stableStringify } from './datasetExport';
import { createOperatorAuditReport as buildOperatorAuditReport } from './operatorAuditReport';
import { validatePackageReadiness } from './trainingPackageValidation';

const REGIONS: CosmeticSegmentationTarget[] = [
  'lips',
  'blush',
  'eyeshadow',
  'eyeliner',
  'contour',
  'highlight',
];

const SPLITS = [
  'train',
  'validation',
  'test',
  'holdout',
  'unassigned',
] as const;

const emptyRegionCounts = (): Record<CosmeticSegmentationTarget, number> =>
  Object.fromEntries(REGIONS.map((region) => [region, 0])) as Record<
    CosmeticSegmentationTarget,
    number
  >;

const emptySplitCounts = (): OfflineTrainingPackage['splitSummary'] =>
  Object.fromEntries(SPLITS.map((split) => [split, 0])) as OfflineTrainingPackage['splitSummary'];

export const createOfflineDatasetVersion = (input: {
  dataset: HumanCorrectionDataset;
  manifest: SegmentationTrainingManifest;
  createdAt?: string;
}): OfflineDatasetVersion => {
  const createdAt = input.createdAt ?? input.manifest.createdAt;
  const fingerprint = stableHash({
    datasetId: input.dataset.datasetId,
    manifestId: input.manifest.manifestId,
    sampleIds: input.dataset.samples.map((sample) => sample.sampleId).sort(),
    manifestSamples: input.manifest.targetSummary.totalSamples,
  });

  return {
    versionId: `offline-dataset-version-${fingerprint}`,
    datasetId: input.dataset.datasetId,
    trainingManifestId: input.manifest.manifestId,
    createdAt,
    sampleCount: input.dataset.sampleCount,
    fingerprint,
    labels: [
      'reviewed-dataset',
      'segmentation-training',
      input.dataset.humanVerificationStatus,
    ].sort(),
  };
};

export const materializeMaskArtifacts = (
  samples: readonly HumanCorrectionSample[],
): OfflineMaskArtifact[] =>
  samples
    .flatMap((sample) => [
      createMaskArtifactReference({
        sampleId: sample.sampleId,
        maskId: sample.originalSegmentationMask.id,
        target: sample.regionId,
        grid: sample.originalSegmentationMask.grid,
        bounds: sample.originalSegmentationMask.bounds,
        artifactKind: 'original_mask',
        source: 'human-correction-sample',
      }),
      createMaskArtifactReference({
        sampleId: sample.sampleId,
        maskId: sample.humanEditedMask.id,
        target: sample.regionId,
        grid: sample.humanEditedMask.grid,
        bounds: sample.humanEditedMask.bounds,
        artifactKind: 'human_edited_mask',
        source: 'human-correction-sample',
      }),
      createMaskArtifactReference({
        sampleId: sample.sampleId,
        maskId: `${sample.sampleId}:diffHeatmap`,
        target: sample.regionId,
        grid: sample.maskDiff.diffHeatmap,
        bounds: sample.maskDiff.affectedBounds,
        artifactKind: 'diff_heatmap',
        source: 'mask-diff',
      }),
    ])
    .sort((left, right) => left.artifactId.localeCompare(right.artifactId));

const trainingReferences = (
  manifest: SegmentationTrainingManifest,
): TrainingSampleReference[] =>
  [
    ...manifest.train.samples,
    ...manifest.validation.samples,
    ...manifest.test.samples,
  ].sort((left, right) => left.sampleId.localeCompare(right.sampleId));

const artifactBySampleAndKind = (
  artifacts: readonly OfflineMaskArtifact[],
  sampleId: string,
  artifactKind: OfflineMaskArtifact['artifactKind'],
): OfflineMaskArtifact | undefined =>
  artifacts.find(
    (artifact) =>
      artifact.sampleId === sampleId && artifact.artifactKind === artifactKind,
  );

export const createOfflinePackageEntries = (input: {
  manifest: SegmentationTrainingManifest;
  artifacts: readonly OfflineMaskArtifact[];
}): OfflineTrainingPackageEntry[] =>
  trainingReferences(input.manifest).map((reference) => {
    const originalMask = artifactBySampleAndKind(
      input.artifacts,
      reference.sampleId,
      'original_mask',
    );
    const humanEditedMask = artifactBySampleAndKind(
      input.artifacts,
      reference.sampleId,
      'human_edited_mask',
    );
    const diffHeatmap = artifactBySampleAndKind(
      input.artifacts,
      reference.sampleId,
      'diff_heatmap',
    );
    const warnings = [
      ...(originalMask ? [] : ['missing original mask artifact']),
      ...(humanEditedMask ? [] : ['missing human edited mask artifact']),
      ...(diffHeatmap ? [] : ['missing diff heatmap artifact']),
    ];
    const entryIdentity = {
      sampleId: reference.sampleId,
      split: reference.split,
      regionId: reference.maskTarget.regionId,
    };

    return {
      entryId: `offline-entry-${stableHash(entryIdentity)}`,
      sampleId: reference.sampleId,
      imageId: reference.imageId,
      templateId: reference.templateId,
      split: reference.split,
      regionId: reference.maskTarget.regionId,
      qualityScore: reference.qualityScore,
      sampleWeight: reference.sampleWeight,
      imageReferenceId: `image-ref-${stableHash({
        imageId: reference.imageId,
        split: reference.split,
      })}`,
      maskArtifactIds: {
        originalMask: originalMask?.artifactId ?? 'missing',
        humanEditedMask: humanEditedMask?.artifactId ?? 'missing',
        diffHeatmap: diffHeatmap?.artifactId ?? 'missing',
      },
      validationStatus: warnings.length > 0 ? 'blocked' : 'ready',
      warnings,
    };
  });

const createImageReferences = (
  entries: readonly OfflineTrainingPackageEntry[],
): OfflineImageReference[] => {
  const groups = new Map<string, OfflineTrainingPackageEntry[]>();

  for (const entry of entries) {
    const key = `${entry.imageId}:${entry.split}`;
    groups.set(key, [...(groups.get(key) ?? []), entry]);
  }

  return [...groups.entries()]
    .map(([key, groupedEntries]) => {
      const [imageId, split] = key.split(':') as [
        string,
        OfflineImageReference['split'],
      ];
      const sampleIds = groupedEntries
        .map((entry) => entry.sampleId)
        .sort();
      const imageReferenceId = `image-ref-${stableHash({ imageId, split })}`;

      return {
        imageReferenceId,
        imageId,
        split,
        sampleIds,
        referenceUri: `offline://images/${imageId}`,
        checksum: stableHash({ imageId, sampleIds }),
        source: 'reviewed-dataset' as const,
      };
    })
    .sort((left, right) =>
      left.imageReferenceId.localeCompare(right.imageReferenceId),
    );
};

const splitSummary = (
  entries: readonly OfflineTrainingPackageEntry[],
): OfflineTrainingPackage['splitSummary'] => {
  const summary = emptySplitCounts();

  for (const entry of entries) {
    summary[entry.split] += 1;
  }

  return summary;
};

const regionSummary = (
  entries: readonly OfflineTrainingPackageEntry[],
): OfflineTrainingPackage['regionSummary'] => {
  const summary = emptyRegionCounts();

  for (const entry of entries) {
    summary[entry.regionId] += 1;
  }

  return summary;
};

const qualitySummary = (
  entries: readonly OfflineTrainingPackageEntry[],
): OfflineTrainingPackage['qualitySummary'] => {
  if (entries.length === 0) {
    return {
      minQualityScore: 0,
      maxQualityScore: 0,
      averageQualityScore: 0,
    };
  }

  const scores = entries.map((entry) => entry.qualityScore);

  return {
    minQualityScore: Number(Math.min(...scores).toFixed(4)),
    maxQualityScore: Number(Math.max(...scores).toFixed(4)),
    averageQualityScore: Number(
      (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(4),
    ),
  };
};

const emptyValidation = (
  checkedAt: string,
): OfflinePackageValidationResult => ({
  schemaVersion: OFFLINE_TRAINING_PACKAGE_SCHEMA_VERSION,
  valid: false,
  checkedAt,
  errors: [],
  warnings: [],
  summary: {
    sampleReferenceCount: 0,
    imageReferenceCount: 0,
    maskArtifactCount: 0,
    splitCompleteness: {
      train: false,
      validation: false,
      test: false,
    },
    leakageIssueCount: 0,
    lowQualityExcludedCount: 0,
  },
});

const emptyAudit = (input: {
  packageId: string;
  dataset: HumanCorrectionDataset;
  manifest: SegmentationTrainingManifest;
  createdAt: string;
}): OfflineOperatorAuditReport => ({
  schemaVersion: OFFLINE_TRAINING_PACKAGE_SCHEMA_VERSION,
  reportId: `operator-audit-${stableHash(input)}`,
  packageId: input.packageId,
  sourceReviewedDatasetId: input.dataset.datasetId,
  sourceTrainingManifestId: input.manifest.manifestId,
  createdAt: input.createdAt,
  correctionSummary: {
    totalCorrections: input.dataset.samples.length,
    regionCounts: emptyRegionCounts(),
    averageCorrectionConfidence: 0,
  },
  reviewSummary: {
    accepted: 0,
    rejected: 0,
    needsSecondReview: 0,
    readyForTraining: 0,
    reviewerCounts: {},
  },
  rejectedReasonSummary: {},
  readinessSummary: {
    trainingReadySamples: input.manifest.targetSummary.totalSamples,
    blockedSamples: input.manifest.targetSummary.excludedSampleIds.length,
    validationPassed: false,
    warnings: [],
  },
  recommendations: [],
});

export const summarizeOfflinePackage = (
  trainingPackage: OfflineTrainingPackage,
): string =>
  [
    `package:${trainingPackage.packageId}`,
    `version:${trainingPackage.datasetVersion.versionId}`,
    `entries:${trainingPackage.entries.length}`,
    `artifacts:${trainingPackage.maskArtifacts.length}`,
    `valid:${trainingPackage.validationSummary.valid}`,
  ].join('\n');

export const validateOfflineTrainingPackage = (
  trainingPackage: OfflineTrainingPackage,
): OfflinePackageValidationResult =>
  validatePackageReadiness(trainingPackage, trainingPackage.createdAt);

export const createOfflineOperatorAuditReport = buildOperatorAuditReport;

export const createOfflineTrainingPackage = (input: {
  dataset: HumanCorrectionDataset;
  trainingManifest: SegmentationTrainingManifest;
  reviewQueue?: DatasetReviewQueue | null;
  createdAt?: string;
}): OfflineTrainingPackage => {
  const createdAt = input.createdAt ?? input.trainingManifest.createdAt;
  const datasetVersion = createOfflineDatasetVersion({
    dataset: input.dataset,
    manifest: input.trainingManifest,
    createdAt,
  });
  const trainingSampleIds = new Set(
    trainingReferences(input.trainingManifest).map((reference) => reference.sampleId),
  );
  const packageSamples = input.dataset.samples.filter((sample) =>
    trainingSampleIds.has(sample.sampleId),
  );
  const maskArtifacts = materializeMaskArtifacts(packageSamples);
  const entries = createOfflinePackageEntries({
    manifest: input.trainingManifest,
    artifacts: maskArtifacts,
  });
  const imageReferences = createImageReferences(entries);
  const packageId = `offline-package-${stableHash({
    datasetVersion,
    entries: entries.map((entry) => entry.entryId),
    artifacts: maskArtifacts.map((artifact) => artifact.artifactId),
  })}`;
  const initialValidation = emptyValidation(createdAt);
  const initialAudit = emptyAudit({
    packageId,
    dataset: input.dataset,
    manifest: input.trainingManifest,
    createdAt,
  });
  const base = {
    schemaVersion: OFFLINE_TRAINING_PACKAGE_SCHEMA_VERSION,
    packageId,
    datasetVersion,
    createdAt,
    sourceReviewedDatasetId: input.dataset.datasetId,
    sourceTrainingManifestId: input.trainingManifest.manifestId,
    entryCount: entries.length,
    imageReferenceCount: imageReferences.length,
    maskArtifactCount: maskArtifacts.length,
    splitSummary: splitSummary(entries),
    regionSummary: regionSummary(entries),
    qualitySummary: qualitySummary(entries),
    validationSummary: initialValidation,
    auditSummary: initialAudit,
    entries,
    imageReferences,
    maskArtifacts,
  };
  const initialManifest: OfflineTrainingPackageManifest = {
    schemaVersion: OFFLINE_TRAINING_PACKAGE_SCHEMA_VERSION,
    packageId,
    datasetVersion,
    createdAt,
    sourceReviewedDatasetId: input.dataset.datasetId,
    sourceTrainingManifestId: input.trainingManifest.manifestId,
    entryCount: entries.length,
    imageReferenceCount: imageReferences.length,
    maskArtifactCount: maskArtifacts.length,
    splitSummary: base.splitSummary,
    regionSummary: base.regionSummary,
    qualitySummary: base.qualitySummary,
    validationSummary: initialValidation,
    auditSummary: initialAudit,
  };
  const validationSummary = validatePackageReadiness(
    { ...base, manifest: initialManifest },
    createdAt,
  );
  const auditSummary = buildOperatorAuditReport({
    packageId,
    dataset: input.dataset,
    manifest: input.trainingManifest,
    queue: input.reviewQueue ?? null,
    validation: validationSummary,
    createdAt,
  });
  const manifest: OfflineTrainingPackageManifest = {
    schemaVersion: OFFLINE_TRAINING_PACKAGE_SCHEMA_VERSION,
    packageId,
    datasetVersion,
    createdAt,
    sourceReviewedDatasetId: input.dataset.datasetId,
    sourceTrainingManifestId: input.trainingManifest.manifestId,
    entryCount: entries.length,
    imageReferenceCount: imageReferences.length,
    maskArtifactCount: maskArtifacts.length,
    splitSummary: splitSummary(entries),
    regionSummary: regionSummary(entries),
    qualitySummary: qualitySummary(entries),
    validationSummary,
    auditSummary,
  };

  return {
    ...manifest,
    entries,
    imageReferences,
    maskArtifacts,
    manifest,
  };
};

export const exportOfflineTrainingPackageJson = (
  trainingPackage: OfflineTrainingPackage,
): string => stableStringify(trainingPackage);

export const exportOfflineTrainingPackageManifestJson = (
  trainingPackage: OfflineTrainingPackage,
): string => stableStringify(trainingPackage.manifest);
