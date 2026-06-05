import { stableStringify } from '../../templates/storage/datasetExport';
import type {
  ExportReadyModelPackage,
  ExportRuntimeCompatibility,
  ExportRuntimeTarget,
} from '../schema/export-ready-model-package.schema';
import { EXPORT_READY_MODEL_PACKAGE_SCHEMA_VERSION } from '../schema/export-ready-model-package.schema';
import type { LightweightSegmentationClassifier } from '../schema';
import { validateModelProviderCompatibility } from './providerCompatibilityValidation';
import { createExportPreparationManifest } from './exportPreparationManifest';

export interface ExportPackageWriterAdapter {
  mkdirp(path: string): Promise<void>;
  writeFile(path: string, content: string): Promise<void>;
}

const checksumText = (content: string): string => {
  let hash = 0x811c9dc5;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};

export const createRuntimeCompatibilitySpec = (
  targets: readonly ExportRuntimeTarget[],
): ExportRuntimeCompatibility[] =>
  [...targets].sort().map((target) => ({
    target,
    supported: target === 'typescript-provider' || target === 'browser-provider' || target === 'node-provider',
    notes:
      target.endsWith('placeholder')
        ? [`${target} is preparation-only in Phase 6F`]
        : ['supported by JSON lightweight classifier provider'],
  }));

export const createProviderCompatibilitySpec = (
  model: LightweightSegmentationClassifier,
) =>
  validateModelProviderCompatibility({
    model,
    providerId: 'lightweight-classifier',
    inputSpec: {
      requiresPixelData: true,
      pixelFormat: 'json-rgba-grid',
      featureNames: model.featureConfig.featureNames,
    },
    outputSpec: {
      outputType: 'CosmeticSegmentationMask',
      alphaFormat: 'float-alpha-grid',
      coordinateSpace: 'normalized-image',
    },
  });

export const createExportReadyModelPackage = (input: {
  model: LightweightSegmentationClassifier;
  targets: readonly ExportRuntimeTarget[];
  createdAt?: string;
}): ExportReadyModelPackage => {
  const runtimeCompatibility = createRuntimeCompatibilitySpec(input.targets);
  const providerCompatibility = createProviderCompatibilitySpec(input.model);
  const packageBase = {
    schemaVersion: EXPORT_READY_MODEL_PACKAGE_SCHEMA_VERSION,
    packageId: `export-package-${input.model.modelId}`,
    packageVersion: `${input.model.modelVersion}-export-v0.1`,
    sourceModelId: input.model.modelId,
    sourceModelVersion: input.model.modelVersion,
    modelKind: 'lightweight-segmentation-classifier' as const,
    classifierKind: input.model.classifierKind,
    artifactFormat: 'lightweight-classifier-json' as const,
    inputSpec: {
      requiresPixelData: true,
      pixelFormat: 'json-rgba-grid' as const,
      featureNames: input.model.featureConfig.featureNames,
    },
    outputSpec: {
      outputType: 'CosmeticSegmentationMask' as const,
      alphaFormat: 'float-alpha-grid' as const,
      coordinateSpace: 'normalized-image' as const,
    },
    featureSpec: {
      featureNames: input.model.featureConfig.featureNames,
    },
    regionSpec: {
      trainedRegions: input.model.trainedRegions,
    },
    runtimeCompatibility,
    providerCompatibility,
    lineage: {
      sourceDatasetId: input.model.sourceDatasetId,
      sourcePackageId: input.model.sourcePackageId,
      trainingRunId: input.model.trainingRunId,
      sourceModelId: input.model.modelId,
    },
    checksums: {
      'model.json': input.model.artifactChecksum,
    },
    sourceImageReadiness: {
      sourceImageCodecReadiness: 'ready' as const,
      sourceImagePackageCompatibility: 'not-provided' as const,
      realPhotoImportReadiness: 'warning' as const,
      jpegBoundaryStatus: 'metadata-only' as const,
      pngCodecSupportSummary: 'png-support:8-bit non-interlaced color types 0,2,6; filters 0-4; stored-deflate project codec',
    },
    readinessStatus: providerCompatibility.compatible
      ? 'export-ready-typescript-provider' as const
      : 'blocked-by-provider-compatibility' as const,
    createdAt: input.createdAt ?? input.model.createdAt,
  };
  return {
    ...packageBase,
    checksums: {
      ...packageBase.checksums,
      'export-package.json': checksumText(stableStringify(packageBase)),
    },
  };
};

export const validateExportReadyModelPackage = (
  pkg: ExportReadyModelPackage,
): string[] => [
  ...(pkg.schemaVersion !== EXPORT_READY_MODEL_PACKAGE_SCHEMA_VERSION ? ['invalid export package schemaVersion'] : []),
  ...(pkg.regionSpec.trainedRegions.length === 0 ? ['export package requires trained regions'] : []),
  ...(pkg.providerCompatibility.compatible ? [] : ['provider compatibility failed']),
];

export const summarizeExportReadyModelPackage = (
  pkg: ExportReadyModelPackage,
): string =>
  `${pkg.packageId}:model=${pkg.sourceModelId}:readiness=${pkg.readinessStatus}`;

export const exportModelPackageJson = (
  pkg: ExportReadyModelPackage,
): string => stableStringify(pkg);

export const writeExportReadyModelPackage = async (input: {
  adapter: ExportPackageWriterAdapter;
  outDir: string;
  model: LightweightSegmentationClassifier;
  targets: readonly ExportRuntimeTarget[];
}): Promise<ExportReadyModelPackage> => {
  const pkg = createExportReadyModelPackage({ model: input.model, targets: input.targets });
  const preparation = createExportPreparationManifest({
    model: input.model,
    targets: [...input.targets],
  });
  await input.adapter.mkdirp(input.outDir);
  await input.adapter.writeFile(`${input.outDir}/export-package.json`, `${stableStringify(pkg)}\n`);
  await input.adapter.writeFile(`${input.outDir}/model.json`, `${stableStringify(input.model)}\n`);
  await input.adapter.writeFile(`${input.outDir}/provider-spec.json`, `${stableStringify(pkg.providerCompatibility)}\n`);
  await input.adapter.writeFile(`${input.outDir}/runtime-compatibility.json`, `${stableStringify(pkg.runtimeCompatibility)}\n`);
  await input.adapter.writeFile(`${input.outDir}/export-preparation-manifest.json`, `${stableStringify(preparation)}\n`);
  await input.adapter.writeFile(`${input.outDir}/checksums.json`, `${stableStringify(pkg.checksums)}\n`);
  await input.adapter.writeFile(`${input.outDir}/README.md`, `# ${pkg.packageId}\n\nExport-ready lightweight classifier package.\n`);
  return pkg;
};
