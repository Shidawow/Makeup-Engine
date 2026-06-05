import { stableStringify } from '../../templates/storage/datasetExport';
import type { FailedSampleQuarantine } from '../schema';
import type { TrainerConfig } from '../config';
import type { SegmentationEvaluationReport } from '../schema/evaluation-report.schema';
import type { ModelArtifactManifest } from '../schema/model-artifact.schema';
import type { TrainingRunPackage } from '../run';
import type {
  BaselineModelArtifact,
  BaselineModelValidationResult,
  BaselineSegmentationModel,
} from '../schema/baseline-segmentation-model.schema';

export interface BaselineModelWriterAdapter {
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

export const exportBaselineModelJson = (
  model: BaselineSegmentationModel,
): string => stableStringify(model);

export const validateBaselineModelArtifact = (
  model: BaselineSegmentationModel,
): BaselineModelValidationResult => {
  const errors = [
    ...(model.trainedRegions.length === 0 ? ['model has no trained regions'] : []),
    ...(Object.keys(model.regionPriors).length !== model.trainedRegions.length
      ? ['regionPriors count does not match trainedRegions']
      : []),
    ...(model.artifactChecksum.length === 0 ? ['artifactChecksum is required'] : []),
  ];
  return {
    valid: errors.length === 0,
    errors,
    warnings: model.trainingSummary.warnings,
  };
};

export const summarizeBaselineModelArtifact = (
  artifact: BaselineModelArtifact,
): string =>
  `${artifact.model.modelId}:${artifact.relativePath}:checksum=${artifact.checksum}:bytes=${artifact.byteSize}`;

export const writeBaselineSegmentationModel = async (input: {
  adapter: BaselineModelWriterAdapter;
  outDir: string;
  model: BaselineSegmentationModel;
}): Promise<BaselineModelArtifact> => {
  const content = `${exportBaselineModelJson(input.model)}\n`;
  const relativePath = 'model.json';
  await input.adapter.mkdirp(input.outDir);
  await input.adapter.writeFile(`${input.outDir}/${relativePath}`, content);
  return {
    model: input.model,
    relativePath,
    checksum: checksumText(content),
    byteSize: content.length,
  };
};

export const writeBaselineModelManifest = async (input: {
  adapter: BaselineModelWriterAdapter;
  outDir: string;
  manifest: ModelArtifactManifest;
}): Promise<void> =>
  input.adapter.writeFile(
    `${input.outDir}/model-artifact-manifest.json`,
    `${stableStringify(input.manifest)}\n`,
  );

export const writeBaselineEvaluationReport = async (input: {
  adapter: BaselineModelWriterAdapter;
  outDir: string;
  report: SegmentationEvaluationReport;
}): Promise<void> =>
  input.adapter.writeFile(
    `${input.outDir}/evaluation-report.json`,
    `${stableStringify(input.report)}\n`,
  );

export const writeBaselineTrainingRunPackage = async (input: {
  adapter: BaselineModelWriterAdapter;
  outDir: string;
  runPackage: TrainingRunPackage;
}): Promise<void> =>
  input.adapter.writeFile(
    `${input.outDir}/training-run-package.json`,
    `${stableStringify(input.runPackage)}\n`,
  );

export const writeBaselineTrainerConfig = async (input: {
  adapter: BaselineModelWriterAdapter;
  outDir: string;
  config: TrainerConfig;
}): Promise<void> =>
  input.adapter.writeFile(
    `${input.outDir}/trainer-config.json`,
    `${stableStringify(input.config)}\n`,
  );

export const writeBaselineFailedSamples = async (input: {
  adapter: BaselineModelWriterAdapter;
  outDir: string;
  quarantine: FailedSampleQuarantine;
}): Promise<void> =>
  input.adapter.writeFile(
    `${input.outDir}/failed-samples.json`,
    `${stableStringify(input.quarantine)}\n`,
  );
