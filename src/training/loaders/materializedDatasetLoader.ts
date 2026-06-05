import type {
  OfflineOperatorAuditReport,
  OfflineTrainingPackage,
} from '../../templates/schema';
import type { DatasetChecksums } from '../../templates/storage';
import { validateDatasetChecksums } from '../../templates/storage';
import type { MaterializedTrainingDataset } from '../../templates/schema';
import type {
  LoadedTrainingDataset,
  LoadedTrainingSample,
  TrainingBridgeSummary,
  TrainingBridgeValidationIssue,
} from '../schema';
import { TRAINING_BRIDGE_SCHEMA_VERSION } from '../schema';
import {
  normalizeDiffArtifact,
  normalizeMaskArtifact,
  readDiffArtifact,
  readImageReferenceArtifact,
  readMaskArtifact,
  validateDiffArtifactForTraining,
  validateMaskArtifactForTraining,
} from './artifactReader';
import type { TrainingDatasetFileReader } from './fileReader';
import { parseJsonFile } from './fileReader';
import { readSplitJsonl } from './splitJsonlReader';
import {
  createRegionTrainingTargets,
  TRAINING_REGIONS,
} from './regionTargetLoader';
import { normalizeTrainingSample } from '../normalization/trainingSampleNormalizer';
import { normalizeImageReference } from '../normalization/trainingSampleNormalizer';

const REQUIRED_FILES = [
  'manifest.json',
  'package.json',
  'audit-report.json',
  'checksums.json',
] as const;

const errorIssue = (
  code: string,
  message: string,
  path?: string,
  sampleId?: string,
): TrainingBridgeValidationIssue => ({
  severity: 'error',
  code,
  message,
  path,
  sampleId,
});

const warningIssue = (
  code: string,
  message: string,
): TrainingBridgeValidationIssue => ({
  severity: 'warning',
  code,
  message,
});

export const loadMaterializedManifest = (
  reader: TrainingDatasetFileReader,
): Promise<MaterializedTrainingDataset> =>
  parseJsonFile<MaterializedTrainingDataset>(reader, 'manifest.json');

export const loadMaterializedPackage = (
  reader: TrainingDatasetFileReader,
): Promise<OfflineTrainingPackage> =>
  parseJsonFile<OfflineTrainingPackage>(reader, 'package.json');

export const loadMaterializedAuditReport = (
  reader: TrainingDatasetFileReader,
): Promise<OfflineOperatorAuditReport> =>
  parseJsonFile<OfflineOperatorAuditReport>(reader, 'audit-report.json');

export const loadDatasetChecksums = (
  reader: TrainingDatasetFileReader,
): Promise<DatasetChecksums> =>
  parseJsonFile<DatasetChecksums>(reader, 'checksums.json');

const average = (values: readonly number[]): number =>
  values.length === 0
    ? 0
    : Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(4));

export const summarizeLoadedDataset = (
  dataset: LoadedTrainingDataset,
): string =>
  [
    `dataset:${dataset.summary.datasetId}`,
    `version:${dataset.summary.datasetVersion}`,
    `samples:${dataset.summary.totalSamples}`,
    `readiness:${dataset.summary.readiness}`,
  ].join('\n');

export const validateLoadedDataset = async (input: {
  reader: TrainingDatasetFileReader;
  manifest: MaterializedTrainingDataset;
  trainingPackage: OfflineTrainingPackage;
  auditReport: OfflineOperatorAuditReport;
  checksums: DatasetChecksums;
}): Promise<TrainingBridgeValidationIssue[]> => {
  const existence = await Promise.all(
    REQUIRED_FILES.map(async (path) => ({
      path,
      exists: await input.reader.exists(path),
    })),
  );
  const missing = existence
    .filter((file) => !file.exists)
    .map((file) =>
      errorIssue('materialized-file-missing', 'required file is missing', file.path),
    );
  const identityIssues = [
    ...(input.manifest.sourcePackageId !== input.trainingPackage.packageId
      ? [
          errorIssue(
            'source-package-mismatch',
            'manifest sourcePackageId does not match packageId',
            'manifest.json',
          ),
        ]
      : []),
    ...(input.manifest.datasetVersion !== input.trainingPackage.datasetVersion.versionId
      ? [
          errorIssue(
            'dataset-version-mismatch',
            'manifest datasetVersion does not match package dataset version',
            'manifest.json',
          ),
        ]
      : []),
    ...(input.auditReport.packageId !== input.trainingPackage.packageId
      ? [
          errorIssue(
            'audit-package-mismatch',
            'audit report packageId does not match packageId',
            'audit-report.json',
          ),
        ]
      : []),
  ];
  const checksumFiles = await Promise.all(
    input.checksums.files.map(async (file) => ({
      path: file.path,
      content: await input.reader.readText(file.path),
    })),
  );
  const checksumValidation = validateDatasetChecksums({
    checksums: input.checksums,
    files: checksumFiles,
  });

  return [
    ...missing,
    ...identityIssues,
    ...checksumValidation.errors.map((message) =>
      errorIssue('checksum-invalid', message),
    ),
    ...checksumValidation.warnings.map((message) =>
      warningIssue('checksum-warning', message),
    ),
  ];
};

export const loadMaterializedDataset = async (input: {
  reader: TrainingDatasetFileReader;
}): Promise<LoadedTrainingDataset> => {
  const [manifest, trainingPackage, auditReport, checksums] = await Promise.all([
    loadMaterializedManifest(input.reader),
    loadMaterializedPackage(input.reader),
    loadMaterializedAuditReport(input.reader),
    loadDatasetChecksums(input.reader),
  ]);
  const baseIssues = await validateLoadedDataset({
    reader: input.reader,
    manifest,
    trainingPackage,
    auditReport,
    checksums,
  });
  const splitLoads = await Promise.all([
    readSplitJsonl(input.reader, 'train'),
    readSplitJsonl(input.reader, 'validation'),
    readSplitJsonl(input.reader, 'test'),
  ]);
  const splitEntryBySampleId = new Map(
    splitLoads.flatMap((split) =>
      split.samples.map((sample) => [sample.sampleId, sample] as const),
    ),
  );
  const samples = await Promise.all(
    manifest.entries.map(async (entry): Promise<LoadedTrainingSample> => {
      const splitEntry = splitEntryBySampleId.get(entry.sampleId);
      const [imageReference, originalMaskArtifact, editedMaskArtifact, diffArtifact] =
        await Promise.all([
          readImageReferenceArtifact(input.reader, entry.relativePaths.image),
          readMaskArtifact(input.reader, entry.relativePaths.originalMask),
          readMaskArtifact(input.reader, entry.relativePaths.humanEditedMask),
          readDiffArtifact(input.reader, entry.relativePaths.diffHeatmap),
        ]);
      const originalMask = normalizeMaskArtifact(originalMaskArtifact);
      const editedMask = normalizeMaskArtifact(editedMaskArtifact);
      const diff = normalizeDiffArtifact(diffArtifact);
      const normalized = normalizeTrainingSample({
        entry,
        imageReference: normalizeImageReference(imageReference),
        originalMask,
        humanEditedMask: editedMask,
        diffSignal: diff,
      });
      const validationIssues = [
        ...(splitEntry
          ? []
          : [
              errorIssue(
                'split-entry-missing',
                'sample is not present in split JSONL',
                entry.split,
                entry.sampleId,
              ),
            ]),
        ...validateMaskArtifactForTraining(
          originalMaskArtifact,
          entry.relativePaths.originalMask,
        ),
        ...validateMaskArtifactForTraining(
          editedMaskArtifact,
          entry.relativePaths.humanEditedMask,
        ),
        ...validateDiffArtifactForTraining(
          diffArtifact,
          entry.relativePaths.diffHeatmap,
        ),
      ];

      return {
        datasetId: manifest.datasetId,
        sourcePackageId: manifest.sourcePackageId,
        datasetVersion: manifest.datasetVersion,
        split: entry.split,
        sampleId: entry.sampleId,
        imageId: entry.imageId,
        templateId: entry.templateId,
        regionId: entry.regionId,
        regionTarget: {
          regionId: entry.regionId,
          sampleIds: [entry.sampleId],
          sampleCount: 1,
          averageQualityScore: entry.qualityScore,
          averageSampleWeight: entry.sampleWeight,
          warnings: [],
        },
        imageReference: {
          artifactId: imageReference.imageReferenceId,
          relativePath: entry.relativePaths.image,
          checksum: imageReference.checksum,
          payload: imageReference,
          validationIssues: [],
        },
        maskArtifact: {
          artifactId: editedMaskArtifact.artifactId,
          relativePath: entry.relativePaths.humanEditedMask,
          checksum: editedMaskArtifact.checksum,
          payload: editedMask,
          validationIssues: validateMaskArtifactForTraining(
            editedMaskArtifact,
            entry.relativePaths.humanEditedMask,
          ),
        },
        diffArtifact: {
          artifactId: diffArtifact.artifactId,
          relativePath: entry.relativePaths.diffHeatmap,
          checksum: diffArtifact.checksum,
          payload: diff,
          validationIssues: validateDiffArtifactForTraining(
            diffArtifact,
            entry.relativePaths.diffHeatmap,
          ),
        },
        input: normalized.input,
        target: normalized.target,
        qualityScore: entry.qualityScore,
        sampleWeight: entry.sampleWeight,
        accepted: splitEntry?.validationStatus === 'ready',
        trainingReady: splitEntry?.validationStatus === 'ready',
        validationIssues,
        sourceEntry: splitEntry ?? entry,
      };
    }),
  );
  const trainingSamples = samples.filter(
    (sample) => sample.accepted && sample.trainingReady,
  );
  const regionTargets = createRegionTrainingTargets(trainingSamples);
  const regionTargetById = new Map(
    regionTargets.map((target) => [target.regionId, target]),
  );
  const normalizedSamples = trainingSamples.map((sample) => ({
    ...sample,
    regionTarget: regionTargetById.get(sample.regionId) ?? sample.regionTarget,
  }));
  const splitIssues = splitLoads.flatMap((split) => split.validationIssues);
  const sampleIssues = samples.flatMap((sample) => sample.validationIssues);
  const regionWarnings = regionTargets.flatMap((target) =>
    target.warnings.map((message) => warningIssue('region-coverage-warning', message)),
  );
  const allIssues = [...baseIssues, ...splitIssues, ...sampleIssues, ...regionWarnings];
  const splitCounts = Object.fromEntries(
    ['train', 'validation', 'test'].map((split) => [
      split,
      normalizedSamples.filter((sample) => sample.split === split).length,
    ]),
  );
  const regionCounts = Object.fromEntries(
    TRAINING_REGIONS.map((region) => [
      region,
      normalizedSamples.filter((sample) => sample.regionId === region).length,
    ]),
  );
  const readiness = allIssues.some((issue) => issue.severity === 'error')
    ? 'fail'
    : allIssues.length > 0
      ? 'warning'
      : 'pass';
  const summary: TrainingBridgeSummary = {
    datasetId: manifest.datasetId,
    sourcePackageId: manifest.sourcePackageId,
    datasetVersion: manifest.datasetVersion,
    totalSamples: normalizedSamples.length,
    splitCounts,
    regionCounts,
    averageQualityScore: average(normalizedSamples.map((sample) => sample.qualityScore)),
    averageSampleWeight: average(normalizedSamples.map((sample) => sample.sampleWeight)),
    readiness,
  };

  return {
    schemaVersion: TRAINING_BRIDGE_SCHEMA_VERSION,
    dataset: manifest,
    samples: normalizedSamples,
    splits: splitLoads.map((split) => ({
      split: split.split,
      samples: normalizedSamples.filter((sample) => sample.split === split.split),
      validationIssues: split.validationIssues,
    })),
    regionTargets,
    validationIssues: allIssues,
    summary,
  };
};
