import { stableStringify } from '../../templates/storage/datasetExport';
import type { FailedSampleQuarantine, ImageConditionedModelArtifact, ImageConditionedSegmentationModel, ModelArtifactManifest, SegmentationEvaluationReport } from '../schema';
import type { TrainerConfig } from '../config';
import type { TrainingRunPackage } from '../run';

export interface ImageConditionedModelWriterAdapter {
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

export const exportImageConditionedModelJson = (
  model: ImageConditionedSegmentationModel,
): string => stableStringify(model);

export const validateImageConditionedModelArtifact = (
  model: ImageConditionedSegmentationModel,
) => ({
  valid: model.trainedRegions.length > 0 && model.artifactChecksum.length > 0,
  errors: [
    ...(model.trainedRegions.length === 0 ? ['model has no trained regions'] : []),
    ...(model.artifactChecksum.length === 0 ? ['artifactChecksum is required'] : []),
  ],
  warnings: model.trainingSummary.warnings,
});

export const writeImageConditionedSegmentationModel = async (input: {
  adapter: ImageConditionedModelWriterAdapter;
  outDir: string;
  model: ImageConditionedSegmentationModel;
}): Promise<ImageConditionedModelArtifact> => {
  const content = `${exportImageConditionedModelJson(input.model)}\n`;
  await input.adapter.mkdirp(input.outDir);
  await input.adapter.writeFile(`${input.outDir}/model.json`, content);
  return {
    model: input.model,
    relativePath: 'model.json',
    checksum: checksumText(content),
    byteSize: content.length,
  };
};

export const writeImageConditionedModelManifest = async (input: {
  adapter: ImageConditionedModelWriterAdapter;
  outDir: string;
  manifest: ModelArtifactManifest;
}): Promise<void> =>
  input.adapter.writeFile(`${input.outDir}/model-artifact-manifest.json`, `${stableStringify(input.manifest)}\n`);

export const writeImageConditionedEvaluationReport = async (input: {
  adapter: ImageConditionedModelWriterAdapter;
  outDir: string;
  report: SegmentationEvaluationReport;
}): Promise<void> =>
  input.adapter.writeFile(`${input.outDir}/evaluation-report.json`, `${stableStringify(input.report)}\n`);

export const writeImageConditionedTrainingRunPackage = async (input: {
  adapter: ImageConditionedModelWriterAdapter;
  outDir: string;
  runPackage: TrainingRunPackage;
}): Promise<void> =>
  input.adapter.writeFile(`${input.outDir}/training-run-package.json`, `${stableStringify(input.runPackage)}\n`);

export const writeImageConditionedTrainerConfig = async (input: {
  adapter: ImageConditionedModelWriterAdapter;
  outDir: string;
  config: TrainerConfig;
}): Promise<void> =>
  input.adapter.writeFile(`${input.outDir}/trainer-config.json`, `${stableStringify(input.config)}\n`);

export const writeImageConditionedFailedSamples = async (input: {
  adapter: ImageConditionedModelWriterAdapter;
  outDir: string;
  quarantine: FailedSampleQuarantine;
}): Promise<void> =>
  input.adapter.writeFile(`${input.outDir}/failed-samples.json`, `${stableStringify(input.quarantine)}\n`);

export const summarizeImageConditionedModelArtifact = (
  artifact: ImageConditionedModelArtifact,
): string =>
  `${artifact.model.modelId}:${artifact.relativePath}:checksum=${artifact.checksum}:bytes=${artifact.byteSize}`;
