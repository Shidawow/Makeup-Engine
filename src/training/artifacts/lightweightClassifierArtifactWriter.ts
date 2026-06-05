import { stableStringify } from '../../templates/storage/datasetExport';
import type {
  FailedSampleQuarantine,
  LightweightClassifierModelArtifact,
  LightweightSegmentationClassifier,
  ModelArtifactManifest,
  SegmentationEvaluationReport,
} from '../schema';
import type { TrainerConfig } from '../config';
import type { TrainingRunPackage } from '../run';

export interface LightweightClassifierModelWriterAdapter {
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

export const exportLightweightClassifierJson = (
  model: LightweightSegmentationClassifier,
): string => stableStringify(model);

export const validateLightweightClassifierArtifact = (
  model: LightweightSegmentationClassifier,
) => ({
  valid: model.trainedRegions.length > 0 && model.artifactChecksum.length > 0,
  errors: [
    ...(model.trainedRegions.length === 0 ? ['classifier has no trained regions'] : []),
    ...(model.artifactChecksum.length === 0 ? ['artifactChecksum is required'] : []),
  ],
  warnings: model.trainingSummary.warnings,
});

export const writeLightweightClassifierModel = async (input: {
  adapter: LightweightClassifierModelWriterAdapter;
  outDir: string;
  model: LightweightSegmentationClassifier;
}): Promise<LightweightClassifierModelArtifact> => {
  const content = `${exportLightweightClassifierJson(input.model)}\n`;
  await input.adapter.mkdirp(input.outDir);
  await input.adapter.writeFile(`${input.outDir}/model.json`, content);
  return {
    model: input.model,
    relativePath: 'model.json',
    checksum: checksumText(content),
    byteSize: content.length,
  };
};

export const writeLightweightClassifierManifest = async (input: {
  adapter: LightweightClassifierModelWriterAdapter;
  outDir: string;
  manifest: ModelArtifactManifest;
}): Promise<void> =>
  input.adapter.writeFile(`${input.outDir}/model-artifact-manifest.json`, `${stableStringify(input.manifest)}\n`);

export const writeLightweightClassifierEvaluationReport = async (input: {
  adapter: LightweightClassifierModelWriterAdapter;
  outDir: string;
  report: SegmentationEvaluationReport;
}): Promise<void> =>
  input.adapter.writeFile(`${input.outDir}/evaluation-report.json`, `${stableStringify(input.report)}\n`);

export const writeLightweightClassifierTrainingRunPackage = async (input: {
  adapter: LightweightClassifierModelWriterAdapter;
  outDir: string;
  runPackage: TrainingRunPackage;
}): Promise<void> =>
  input.adapter.writeFile(`${input.outDir}/training-run-package.json`, `${stableStringify(input.runPackage)}\n`);

export const writeLightweightClassifierTrainerConfig = async (input: {
  adapter: LightweightClassifierModelWriterAdapter;
  outDir: string;
  config: TrainerConfig;
}): Promise<void> =>
  input.adapter.writeFile(`${input.outDir}/trainer-config.json`, `${stableStringify(input.config)}\n`);

export const writeLightweightClassifierFailedSamples = async (input: {
  adapter: LightweightClassifierModelWriterAdapter;
  outDir: string;
  quarantine: FailedSampleQuarantine;
}): Promise<void> =>
  input.adapter.writeFile(`${input.outDir}/failed-samples.json`, `${stableStringify(input.quarantine)}\n`);

export const summarizeLightweightClassifierArtifact = (
  artifact: LightweightClassifierModelArtifact,
): string =>
  `${artifact.model.modelId}:${artifact.relativePath}:checksum=${artifact.checksum}:bytes=${artifact.byteSize}`;
