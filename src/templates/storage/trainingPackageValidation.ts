import type {
  HumanCorrectionDataset,
  OfflinePackageValidationResult,
  OfflineTrainingPackage,
  SegmentationTrainingManifest,
} from '../schema';
import { OFFLINE_TRAINING_PACKAGE_SCHEMA_VERSION } from '../schema';
import type { CosmeticSegmentationTarget } from '../../vision';

const REGIONS: CosmeticSegmentationTarget[] = [
  'lips',
  'blush',
  'eyeshadow',
  'eyeliner',
  'contour',
  'highlight',
];

export const validateTrainingSampleReferences = (input: {
  dataset: HumanCorrectionDataset;
  manifest: SegmentationTrainingManifest;
}): string[] => {
  const sampleIds = new Set(input.dataset.samples.map((sample) => sample.sampleId));
  const references = [
    ...input.manifest.train.samples,
    ...input.manifest.validation.samples,
    ...input.manifest.test.samples,
  ];

  return references
    .filter((reference) => !sampleIds.has(reference.sampleId))
    .map((reference) => `missing sample:${reference.sampleId}`)
    .sort();
};

export const validateMaskArtifactReferences = (
  trainingPackage: OfflineTrainingPackage,
): string[] => {
  const artifactIds = new Set(
    trainingPackage.maskArtifacts.map((artifact) => artifact.artifactId),
  );

  return trainingPackage.entries
    .flatMap((entry) =>
      [
        entry.maskArtifactIds.originalMask,
        entry.maskArtifactIds.humanEditedMask,
        entry.maskArtifactIds.diffHeatmap,
      ].filter((artifactId) => !artifactIds.has(artifactId)),
    )
    .map((artifactId) => `missing artifact:${artifactId}`)
    .sort();
};

export const validateSplitCompleteness = (
  trainingPackage: OfflineTrainingPackage,
): string[] => [
  ...(trainingPackage.splitSummary.train === 0 ? ['train split is empty'] : []),
  ...(trainingPackage.splitSummary.validation === 0
    ? ['validation split is empty']
    : []),
  ...(trainingPackage.splitSummary.test === 0 ? ['test split is empty'] : []),
];

export const validateRegionCoverage = (
  trainingPackage: OfflineTrainingPackage,
): string[] =>
  REGIONS.filter((region) => trainingPackage.regionSummary[region] === 0)
    .map((region) => `region has no samples:${region}`)
    .sort();

export const validatePackageLeakage = (
  trainingPackage: OfflineTrainingPackage,
): string[] => {
  const imageSplits = new Map<string, Set<string>>();

  for (const entry of trainingPackage.entries) {
    const splits = imageSplits.get(entry.imageId) ?? new Set<string>();
    splits.add(entry.split);
    imageSplits.set(entry.imageId, splits);
  }

  return [...imageSplits.entries()]
    .filter(([, splits]) => splits.has('train') && splits.has('test'))
    .map(([imageId]) => `image leakage train/test:${imageId}`)
    .sort();
};

export const validatePackageReadiness = (
  trainingPackage: OfflineTrainingPackage,
  checkedAt = trainingPackage.createdAt,
): OfflinePackageValidationResult => {
  const artifactErrors = validateMaskArtifactReferences(trainingPackage);
  const splitWarnings = validateSplitCompleteness(trainingPackage);
  const regionWarnings = validateRegionCoverage(trainingPackage);
  const leakageErrors = validatePackageLeakage(trainingPackage);
  const entryErrors = trainingPackage.entries
    .filter((entry) => entry.validationStatus === 'blocked')
    .map((entry) => `blocked entry:${entry.sampleId}`);
  const checksumErrors = trainingPackage.maskArtifacts
    .filter((artifact) => artifact.checksum.length === 0)
    .map((artifact) => `missing checksum:${artifact.artifactId}`);
  const errors = [
    ...artifactErrors,
    ...leakageErrors,
    ...entryErrors,
    ...checksumErrors,
  ].sort();
  const lowQualityExcludedCount =
    trainingPackage.auditSummary.readinessSummary.blockedSamples;

  return {
    schemaVersion: OFFLINE_TRAINING_PACKAGE_SCHEMA_VERSION,
    valid: errors.length === 0,
    checkedAt,
    errors,
    warnings: [...splitWarnings, ...regionWarnings].sort(),
    summary: {
      sampleReferenceCount: trainingPackage.entries.length,
      imageReferenceCount: trainingPackage.imageReferences.length,
      maskArtifactCount: trainingPackage.maskArtifacts.length,
      splitCompleteness: {
        train: trainingPackage.splitSummary.train > 0,
        validation: trainingPackage.splitSummary.validation > 0,
        test: trainingPackage.splitSummary.test > 0,
      },
      leakageIssueCount: leakageErrors.length,
      lowQualityExcludedCount,
    },
  };
};
