import type {
  MaterializedDatasetEntry,
  MaterializedDatasetManifest,
  MaterializedDatasetValidationResult,
  MaterializedDiffFile,
  MaterializedImageFile,
  MaterializedMaskFile,
  MaterializedSplitFile,
  MaterializedTrainingDataset,
  OfflineMaskArtifact,
  OfflineOperatorAuditReport,
  OfflineTrainingPackage,
  OfflineTrainingPackageManifest,
} from '../schema';
import { MATERIALIZED_DATASET_SCHEMA_VERSION } from '../schema';
import type { DatasetSplit } from '../schema/dataset-review.schema';
import {
  createPortableArtifactUri,
  normalizeDatasetPath,
  resolveAuditReportPath,
  resolveChecksumsPath,
  resolveDiffArtifactPath,
  resolveImageReferencePath,
  resolveImagePixelArtifactPath,
  resolveManifestPath,
  resolveMaskArtifactPath,
  resolvePackagePath,
  resolveSplitFilePath,
} from './artifactPathResolver';
import type { DatasetChecksumFileInput, DatasetChecksums } from './datasetChecksums';
import {
  createDatasetChecksums,
  exportDatasetChecksumsJson,
} from './datasetChecksums';
import { stableHash, stableStringify } from './datasetExport';
import { validateMaterializedDatasetIntegrity } from './materializedDatasetValidation';

const WRITABLE_SPLITS = ['train', 'validation', 'test'] as const;

export interface MaterializedDatasetWriterAdapter {
  mkdirp(path: string): Promise<void>;
  writeFile(path: string, content: string): Promise<void>;
}

export interface MaterializedDatasetWritePlan {
  dataset: MaterializedTrainingDataset;
  checksums: DatasetChecksums;
  files: DatasetChecksumFileInput[];
  summary: string;
}

export interface CreateMaterializedTrainingDatasetInput {
  trainingPackage: OfflineTrainingPackage;
  packageManifest?: OfflineTrainingPackageManifest;
  auditReport?: OfflineOperatorAuditReport;
  outputRootDir: string;
  createdAt?: string;
  allowAbsolutePaths?: boolean;
}

const fileId = (prefix: string, identity: unknown): string =>
  `${prefix}-${stableHash(identity)}`;

const artifactById = (
  artifacts: readonly OfflineMaskArtifact[],
  artifactId: string,
): OfflineMaskArtifact | undefined =>
  artifacts.find((artifact) => artifact.artifactId === artifactId);

const splitEntries = (
  trainingPackage: OfflineTrainingPackage,
  split: Extract<DatasetSplit, 'train' | 'validation' | 'test'>,
) =>
  trainingPackage.entries
    .filter((entry) => entry.split === split)
    .sort((left, right) => left.sampleId.localeCompare(right.sampleId));

const buildImageFiles = (
  trainingPackage: OfflineTrainingPackage,
): MaterializedImageFile[] =>
  trainingPackage.imageReferences
    .map((imageReference) => {
      const relativePath = resolveImageReferencePath(imageReference);

      return {
        imageFileId: fileId('image-file', imageReference.imageReferenceId),
        imageReferenceId: imageReference.imageReferenceId,
        imageId: imageReference.imageId,
        split: imageReference.split,
        relativePath,
        portableUri: createPortableArtifactUri(relativePath),
        checksum: imageReference.checksum,
        sampleIds: [...imageReference.sampleIds].sort(),
      };
    })
    .sort((left, right) => left.imageFileId.localeCompare(right.imageFileId));

const buildMaskFile = (artifact: OfflineMaskArtifact): MaterializedMaskFile => {
  const relativePath = resolveMaskArtifactPath(artifact);

  return {
    maskFileId: fileId('mask-file', artifact.artifactId),
    artifactId: artifact.artifactId,
    sampleId: artifact.sampleId,
    regionId: artifact.regionId,
    artifactKind: artifact.artifactKind as 'original_mask' | 'human_edited_mask',
    relativePath,
    portableUri: createPortableArtifactUri(relativePath),
    checksum: artifact.checksum,
  };
};

const buildDiffFile = (artifact: OfflineMaskArtifact): MaterializedDiffFile => {
  const relativePath = resolveDiffArtifactPath(artifact);

  return {
    diffFileId: fileId('diff-file', artifact.artifactId),
    artifactId: artifact.artifactId,
    sampleId: artifact.sampleId,
    regionId: artifact.regionId,
    relativePath,
    portableUri: createPortableArtifactUri(relativePath),
    checksum: artifact.checksum,
  };
};

const buildMaskFiles = (
  trainingPackage: OfflineTrainingPackage,
): MaterializedMaskFile[] =>
  trainingPackage.maskArtifacts
    .filter((artifact) => artifact.artifactKind !== 'diff_heatmap')
    .map(buildMaskFile)
    .sort((left, right) => left.maskFileId.localeCompare(right.maskFileId));

const buildDiffFiles = (
  trainingPackage: OfflineTrainingPackage,
): MaterializedDiffFile[] =>
  trainingPackage.maskArtifacts
    .filter((artifact) => artifact.artifactKind === 'diff_heatmap')
    .map(buildDiffFile)
    .sort((left, right) => left.diffFileId.localeCompare(right.diffFileId));

const buildSplitFiles = (
  trainingPackage: OfflineTrainingPackage,
): MaterializedSplitFile[] =>
  WRITABLE_SPLITS.map((split) => {
    const relativePath = resolveSplitFilePath(split);

    return {
      splitFileId: fileId('split-file', split),
      split,
      relativePath,
      portableUri: createPortableArtifactUri(relativePath),
      checksum: stableHash(splitEntries(trainingPackage, split)),
      sampleCount: splitEntries(trainingPackage, split).length,
    };
  });

const buildEntries = (input: {
  trainingPackage: OfflineTrainingPackage;
  imageFiles: readonly MaterializedImageFile[];
  maskFiles: readonly MaterializedMaskFile[];
  diffFiles: readonly MaterializedDiffFile[];
}): MaterializedDatasetEntry[] =>
  input.trainingPackage.entries
    .map((entry) => {
      const image = input.imageFiles.find(
        (file) => file.imageReferenceId === entry.imageReferenceId,
      );
      const original = input.maskFiles.find(
        (file) => file.artifactId === entry.maskArtifactIds.originalMask,
      );
      const edited = input.maskFiles.find(
        (file) => file.artifactId === entry.maskArtifactIds.humanEditedMask,
      );
      const diff = input.diffFiles.find(
        (file) => file.artifactId === entry.maskArtifactIds.diffHeatmap,
      );
      const imagePath = image?.relativePath ?? 'missing';
      const originalPath = original?.relativePath ?? 'missing';
      const editedPath = edited?.relativePath ?? 'missing';
      const diffPath = diff?.relativePath ?? 'missing';

      return {
        entryId: fileId('materialized-entry', entry.entryId),
        sampleId: entry.sampleId,
        imageId: entry.imageId,
        templateId: entry.templateId,
        split: entry.split,
        regionId: entry.regionId,
        qualityScore: entry.qualityScore,
        sampleWeight: entry.sampleWeight,
        imageFileId: image?.imageFileId ?? 'missing',
        originalMaskFileId: original?.maskFileId ?? 'missing',
        humanEditedMaskFileId: edited?.maskFileId ?? 'missing',
        diffFileId: diff?.diffFileId ?? 'missing',
        relativePaths: {
          image: imagePath,
          originalMask: originalPath,
          humanEditedMask: editedPath,
          diffHeatmap: diffPath,
        },
        portableUris: {
          image: createPortableArtifactUri(imagePath),
          originalMask: createPortableArtifactUri(originalPath),
          humanEditedMask: createPortableArtifactUri(editedPath),
          diffHeatmap: createPortableArtifactUri(diffPath),
        },
      };
    })
    .sort((left, right) => left.sampleId.localeCompare(right.sampleId));

const emptyValidation = (input: {
  createdAt: string;
  entryCount: number;
  imageFileCount: number;
  maskFileCount: number;
  diffFileCount: number;
  splitFileCount: number;
}): MaterializedDatasetValidationResult => ({
  schemaVersion: MATERIALIZED_DATASET_SCHEMA_VERSION,
  valid: false,
  checkedAt: input.createdAt,
  errors: [],
  warnings: [],
  summary: {
    entryCount: input.entryCount,
    imageFileCount: input.imageFileCount,
    maskFileCount: input.maskFileCount,
    diffFileCount: input.diffFileCount,
    splitFileCount: input.splitFileCount,
    checksumMismatchCount: 0,
    absolutePathLeakCount: 0,
    splitCompleteness: {
      train: false,
      validation: false,
      test: false,
    },
    missingArtifactLinkCount: 0,
  },
});

export const createMaterializedTrainingDataset = (
  input: CreateMaterializedTrainingDatasetInput,
): MaterializedTrainingDataset => {
  const createdAt = input.createdAt ?? input.trainingPackage.createdAt;
  const rootDir = normalizeDatasetPath(input.outputRootDir, {
    allowAbsolutePaths: input.allowAbsolutePaths,
  });
  const imageFiles = buildImageFiles(input.trainingPackage);
  const maskFiles = buildMaskFiles(input.trainingPackage);
  const diffFiles = buildDiffFiles(input.trainingPackage);
  const splitFiles = buildSplitFiles(input.trainingPackage);
  const entries = buildEntries({
    trainingPackage: input.trainingPackage,
    imageFiles,
    maskFiles,
    diffFiles,
  });
  const base: MaterializedTrainingDataset = {
    datasetId: `materialized-${stableHash({
      sourcePackageId: input.trainingPackage.packageId,
      datasetVersion: input.trainingPackage.datasetVersion.versionId,
      entries: entries.map((entry) => entry.entryId),
    })}`,
    schemaVersion: MATERIALIZED_DATASET_SCHEMA_VERSION,
    sourcePackageId: input.trainingPackage.packageId,
    datasetVersion: input.trainingPackage.datasetVersion.versionId,
    createdAt,
    rootDir,
    entries,
    imageFiles,
    maskFiles,
    diffFiles,
    splitFiles,
    manifestPath: resolveManifestPath(),
    packagePath: resolvePackagePath(),
    auditReportPath: resolveAuditReportPath(),
    checksumsPath: resolveChecksumsPath(),
    validationResult: emptyValidation({
      createdAt,
      entryCount: entries.length,
      imageFileCount: imageFiles.length,
      maskFileCount: maskFiles.length,
      diffFileCount: diffFiles.length,
      splitFileCount: splitFiles.length,
    }),
  };

  const validationResult = validateMaterializedDatasetIntegrity({
    dataset: base,
    checkedAt: createdAt,
  });

  return {
    ...base,
    validationResult,
  };
};

export const writeMaskArtifactJson = (
  artifact: OfflineMaskArtifact,
): string => stableStringify(artifact);

export const writeDiffArtifactJson = (
  artifact: OfflineMaskArtifact,
): string => stableStringify(artifact);

export const writeImagePixelArtifactJson = (artifact: unknown): string =>
  stableStringify(artifact);

export const writeMaterializedManifest = (
  dataset: MaterializedDatasetManifest,
): string => stableStringify(dataset);

export const writeMaterializedPackageJson = (
  trainingPackage: OfflineTrainingPackage,
): string => stableStringify(trainingPackage);

export const writeMaterializedAuditReport = (
  auditReport: OfflineOperatorAuditReport,
): string => stableStringify(auditReport);

export const writeSplitJsonlFiles = (
  trainingPackage: OfflineTrainingPackage,
): Record<(typeof WRITABLE_SPLITS)[number], string> =>
  Object.fromEntries(
    WRITABLE_SPLITS.map((split) => [
      split,
      splitEntries(trainingPackage, split)
        .map((entry) => stableStringify(entry))
        .join('\n'),
    ]),
  ) as Record<(typeof WRITABLE_SPLITS)[number], string>;

const buildFileRecords = (input: {
  dataset: MaterializedTrainingDataset;
  trainingPackage: OfflineTrainingPackage;
  packageManifest: OfflineTrainingPackageManifest;
  auditReport: OfflineOperatorAuditReport;
}): DatasetChecksumFileInput[] => {
  const artifactMap = new Map(
    input.trainingPackage.maskArtifacts.map((artifact) => [
      artifact.artifactId,
      artifact,
    ]),
  );
  const splitContent = writeSplitJsonlFiles(input.trainingPackage);
  const fileRecords: DatasetChecksumFileInput[] = [
    {
      path: input.dataset.packagePath,
      content: writeMaterializedPackageJson(input.trainingPackage),
    },
    {
      path: input.dataset.auditReportPath,
      content: writeMaterializedAuditReport(input.auditReport),
    },
    ...input.trainingPackage.imageReferences.map((imageReference) => ({
      path: resolveImageReferencePath(imageReference),
      content: stableStringify(imageReference),
    })),
    ...input.dataset.maskFiles.map((file) => {
      const artifact = artifactMap.get(file.artifactId);

      return {
        path: file.relativePath,
        content: artifact ? writeMaskArtifactJson(artifact) : '{}',
      };
    }),
    ...input.dataset.diffFiles.map((file) => {
      const artifact = artifactById(
        input.trainingPackage.maskArtifacts,
        file.artifactId,
      );

      return {
        path: file.relativePath,
        content: artifact ? writeDiffArtifactJson(artifact) : '{}',
      };
    }),
    ...WRITABLE_SPLITS.map((split) => ({
      path: resolveSplitFilePath(split),
      content: splitContent[split],
    })),
  ];
  const preliminaryDataset: MaterializedTrainingDataset = {
    ...input.dataset,
    validationResult: validateMaterializedDatasetIntegrity({
      dataset: input.dataset,
      availablePaths: [
        input.dataset.manifestPath,
        input.dataset.checksumsPath,
        ...fileRecords.map((file) => file.path),
      ],
      checkedAt: input.dataset.createdAt,
    }),
  };
  const manifestRecord = {
    path: input.dataset.manifestPath,
    content: writeMaterializedManifest(preliminaryDataset),
  };
  const checksumInputs = [manifestRecord, ...fileRecords];
  const checksums = createDatasetChecksums({
    files: checksumInputs,
    createdAt: input.dataset.createdAt,
  });
  const finalDataset: MaterializedTrainingDataset = {
    ...input.dataset,
    validationResult: validateMaterializedDatasetIntegrity({
      dataset: input.dataset,
      availablePaths: [
        input.dataset.manifestPath,
        input.dataset.checksumsPath,
        ...fileRecords.map((file) => file.path),
      ],
      checksums,
      files: checksumInputs,
      checkedAt: input.dataset.createdAt,
    }),
  };
  const finalManifestRecord = {
    path: input.dataset.manifestPath,
    content: writeMaterializedManifest(finalDataset),
  };
  const finalChecksums = createDatasetChecksums({
    files: [finalManifestRecord, ...fileRecords],
    createdAt: input.dataset.createdAt,
  });

  return [
    finalManifestRecord,
    ...fileRecords,
    {
      path: input.dataset.checksumsPath,
      content: exportDatasetChecksumsJson(finalChecksums),
    },
  ].sort((left, right) => left.path.localeCompare(right.path));
};

export const summarizeMaterializedDataset = (
  dataset: MaterializedTrainingDataset,
): string =>
  [
    `dataset:${dataset.datasetId}`,
    `sourcePackage:${dataset.sourcePackageId}`,
    `entries:${dataset.entries.length}`,
    `masks:${dataset.maskFiles.length}`,
    `diffs:${dataset.diffFiles.length}`,
    `valid:${dataset.validationResult.valid}`,
  ].join('\n');

export const validateMaterializedDataset = validateMaterializedDatasetIntegrity;

const joinRoot = (rootDir: string, relativePath: string): string =>
  `${rootDir.replace(/[\\/]+$/, '')}/${relativePath}`;

export const writeMaterializedDataset = async (input: {
  trainingPackage: OfflineTrainingPackage;
  packageManifest?: OfflineTrainingPackageManifest;
  auditReport?: OfflineOperatorAuditReport;
  outputRootDir: string;
  writer?: MaterializedDatasetWriterAdapter;
  allowAbsolutePaths?: boolean;
  dryRun?: boolean;
}): Promise<MaterializedDatasetWritePlan> => {
  const dataset = createMaterializedTrainingDataset({
    trainingPackage: input.trainingPackage,
    packageManifest: input.packageManifest,
    auditReport: input.auditReport,
    outputRootDir: input.outputRootDir,
    allowAbsolutePaths: input.allowAbsolutePaths,
  });
  const files = buildFileRecords({
    dataset,
    trainingPackage: input.trainingPackage,
    packageManifest: input.packageManifest ?? input.trainingPackage.manifest,
    auditReport: input.auditReport ?? input.trainingPackage.auditSummary,
  });
  const checksumsRecord = files.find((file) => file.path === dataset.checksumsPath);
  const checksums = checksumsRecord
    ? (JSON.parse(checksumsRecord.content) as DatasetChecksums)
    : createDatasetChecksums({
        files,
        createdAt: dataset.createdAt,
      });
  const finalDataset: MaterializedTrainingDataset = {
    ...dataset,
    validationResult: validateMaterializedDatasetIntegrity({
      dataset,
      availablePaths: files.map((file) => file.path),
      checksums,
      files: files.filter((file) => file.path !== dataset.checksumsPath),
    }),
  };

  if (!input.dryRun) {
    if (!input.writer) {
      throw new Error(
        'writeMaterializedDataset requires a writer adapter outside dry-run mode',
      );
    }

    await input.writer.mkdirp(finalDataset.rootDir);

    for (const file of files) {
      const fullPath = joinRoot(finalDataset.rootDir, file.path);
      const parent = fullPath.replace(/\/[^/]+$/, '');
      await input.writer.mkdirp(parent);
      await input.writer.writeFile(fullPath, file.content);
    }
  }

  return {
    dataset: finalDataset,
    checksums,
    files,
    summary: summarizeMaterializedDataset(finalDataset),
  };
};
