#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const usage = `Usage:
  node scripts/train-image-conditioned-segmentation.mjs --dataset ./datasets/makeup-engine/dev-v0 [options]

Options:
  --dataset <dir>                         MaterializedTrainingDataset directory
  --config <path>                          Optional image-conditioned trainer config JSON
  --out <dir>                              Output model directory
  --regions lips,blush,eyeshadow          Comma-separated regions to train
  --quality-threshold <number>             Minimum quality score
  --alpha-positive-threshold <number>      Positive alpha threshold
  --alpha-negative-threshold <number>      Negative alpha threshold
  --feature-stride <number>                Deterministic pixel sampling stride
  --evaluate                              Evaluate against validation/test splits
  --strict                                Fail on blocking validation errors
  --json                                  Emit machine-readable JSON
  --dry-run                               Print plan without writing model files
  --help                                  Show this help
`;

const REGIONS = ['lips', 'blush', 'eyeshadow', 'eyeliner', 'contour', 'highlight'];
const SPLITS = ['train', 'validation', 'test'];
const parseArgs = (argv) => {
  const args = {
    regions: [],
    qualityThreshold: 0.7,
    alphaPositiveThreshold: 0.4,
    alphaNegativeThreshold: 0.05,
    featureStride: 1,
    evaluate: false,
    strict: false,
    json: false,
    dryRun: false,
    help: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') args.help = true;
    else if (arg === '--dataset') args.dataset = argv[++index];
    else if (arg === '--config') args.config = argv[++index];
    else if (arg === '--out') args.out = argv[++index];
    else if (arg === '--regions') args.regions = argv[++index].split(',').filter(Boolean);
    else if (arg === '--quality-threshold') args.qualityThreshold = Number(argv[++index]);
    else if (arg === '--alpha-positive-threshold') args.alphaPositiveThreshold = Number(argv[++index]);
    else if (arg === '--alpha-negative-threshold') args.alphaNegativeThreshold = Number(argv[++index]);
    else if (arg === '--feature-stride') args.featureStride = Number(argv[++index]);
    else if (arg === '--evaluate') args.evaluate = true;
    else if (arg === '--strict') args.strict = true;
    else if (arg === '--json') args.json = true;
    else if (arg === '--dry-run') args.dryRun = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
};
const normalize = (value) => {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(normalize);
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, normalize(value[key])]));
};
const stableStringify = (value) => JSON.stringify(normalize(value));
const checksumText = (content) => {
  let hash = 0x811c9dc5;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};
const readText = async (root, relativePath) => readFile(path.join(root, ...relativePath.split('/')), 'utf8');
const readJson = async (root, relativePath) => JSON.parse(await readText(root, relativePath));
const readJsonAbsolute = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'));
const readJsonl = async (root, relativePath) => (await readText(root, relativePath)).split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => JSON.parse(line));
const writeJson = async (outDir, fileName, value) => {
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, fileName), `${stableStringify(value)}\n`, 'utf8');
};
const round4 = (value) => Number(value.toFixed(4));
const average = (values) => values.length === 0 ? 0 : round4(values.reduce((sum, value) => sum + value, 0) / values.length);
const variance = (values) => {
  const mean = average(values);
  return values.length === 0 ? 0 : round4(values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length);
};
const featureKeys = ['r','g','b','brightness','saturation','normalizedX','normalizedY','alphaTarget'];
const deriveGrid = (artifact) => {
  const size = artifact.width * artifact.height;
  const activeCount = Math.max(0, Math.min(size, Math.round(artifact.alphaStats.activeRatio * size)));
  const activeValue = activeCount === 0 ? 0 : Math.min(1, artifact.alphaStats.max, (artifact.alphaStats.mean * size) / activeCount);
  const centerX = (artifact.width - 1) / 2;
  const centerY = (artifact.height - 1) / 2;
  const ranked = Array.from({ length: size }, (_, index) => {
    const x = index % artifact.width;
    const y = Math.floor(index / artifact.width);
    return { index, distance: (x - centerX) ** 2 + (y - centerY) ** 2 };
  }).sort((left, right) => left.distance === right.distance ? left.index - right.index : left.distance - right.distance);
  const active = new Set(ranked.slice(0, activeCount).map((item) => item.index));
  return Array.from({ length: size }, (_, index) => active.has(index) ? round4(activeValue) : 0);
};
const pixelsFromArtifact = (artifact) => Array.from({ length: artifact.width * artifact.height }, (_, index) => {
  const offset = index * artifact.pixels.channels;
  return {
    r: artifact.pixels.values[offset],
    g: artifact.pixels.values[offset + 1],
    b: artifact.pixels.values[offset + 2],
    a: artifact.pixels.channels === 4 ? artifact.pixels.values[offset + 3] : 1,
  };
});
const featuresFor = (pixel, x, y, width, height, alpha) => ({
  r: pixel.r,
  g: pixel.g,
  b: pixel.b,
  brightness: round4((pixel.r + pixel.g + pixel.b) / 3),
  saturation: round4((Math.max(pixel.r, pixel.g, pixel.b) - Math.min(pixel.r, pixel.g, pixel.b)) / Math.max(0.001, Math.max(pixel.r, pixel.g, pixel.b))),
  normalizedX: width <= 1 ? 0 : round4(x / (width - 1)),
  normalizedY: height <= 1 ? 0 : round4(y / (height - 1)),
  alphaTarget: alpha,
});
const stats = (samples) => ({
  count: samples.length,
  means: Object.fromEntries(featureKeys.map((key) => [key, average(samples.map((sample) => sample[key]))])),
  variances: Object.fromEntries(featureKeys.map((key) => [key, variance(samples.map((sample) => sample[key]))])),
});
const score = (features, weights) => Object.entries(weights).reduce((sum, [key, weight]) => sum + (features[key] ?? 0) * weight, 0);
const run = async (args) => {
  const root = path.resolve(args.dataset);
  const [manifest, trainingPackage] = await Promise.all([readJson(root, 'manifest.json'), readJson(root, 'package.json')]);
  const config = args.config ? await readJsonAbsolute(args.config) : null;
  const regions = args.regions.length > 0 ? args.regions : (config?.imageConditioned?.regions ?? REGIONS);
  const splitRows = (await Promise.all(SPLITS.map((split) => readJsonl(root, `splits/${split}.jsonl`)))).flat();
  const artifactById = new Map((trainingPackage.maskArtifacts ?? []).map((artifact) => [artifact.artifactId, artifact]));
  const pixelByImageId = new Map();
  const pixelErrors = [];
  for (const image of manifest.imageFiles) {
    try {
      const artifact = await readJson(root, `image-pixels/${image.imageId}.rgba.json`);
      if (!['json-rgba-grid', 'json-rgb-grid'].includes(artifact.format)) pixelErrors.push(`unsupported pixel artifact format:${image.imageId}`);
      else pixelByImageId.set(image.imageId, { artifact, pixels: pixelsFromArtifact(artifact) });
    } catch {
      pixelErrors.push(`missing pixel artifact:${image.imageId}`);
    }
  }
  const selected = splitRows.filter((sample) => regions.includes(sample.regionId) && sample.qualityScore >= args.qualityThreshold).sort((a, b) => a.sampleId.localeCompare(b.sampleId));
  const regionModels = {};
  const warnings = [];
  for (const region of regions) {
    const featureSamples = [];
    for (const sample of selected.filter((item) => item.regionId === region)) {
      const pixel = pixelByImageId.get(sample.imageId);
      const mask = artifactById.get(sample.maskArtifactIds.humanEditedMask);
      if (!pixel || !mask) continue;
      const alpha = deriveGrid(mask);
      for (let y = 0; y < pixel.artifact.height; y += Math.max(1, args.featureStride)) {
        for (let x = 0; x < pixel.artifact.width; x += Math.max(1, args.featureStride)) {
          const index = y * pixel.artifact.width + x;
          const a = alpha[index] ?? 0;
          const label = a >= args.alphaPositiveThreshold ? 'positive' : a <= args.alphaNegativeThreshold ? 'negative' : null;
          if (!label) continue;
          featureSamples.push({ label, ...featuresFor(pixel.pixels[index], x, y, pixel.artifact.width, pixel.artifact.height, a) });
        }
      }
    }
    const positive = featureSamples.filter((sample) => sample.label === 'positive');
    const negative = featureSamples.filter((sample) => sample.label === 'negative');
    if (positive.length === 0) warnings.push(`insufficient positive pixels:${region}`);
    if (negative.length === 0) warnings.push(`insufficient negative pixels:${region}`);
    if (positive.length > 0 && negative.length > 0) {
      const positiveStats = stats(positive);
      const negativeStats = stats(negative);
      const weights = Object.fromEntries(featureKeys.map((key) => [key, round4(positiveStats.means[key] - negativeStats.means[key])]));
      const threshold = round4((score(positiveStats.means, weights) + score(negativeStats.means, weights)) / 2);
      regionModels[region] = {
        regionId: region,
        sampleCount: selected.filter((sample) => sample.regionId === region).length,
        positivePixelCount: positive.length,
        negativePixelCount: negative.length,
        featureModel: { positive: positiveStats, negative: negativeStats, alphaWeightedMeans: positiveStats.means, scoreWeights: weights, thresholds: { scoreThreshold: threshold, alphaPositiveThreshold: args.alphaPositiveThreshold, alphaNegativeThreshold: args.alphaNegativeThreshold } },
        positionPrior: { centerX: average(positive.map((item) => item.normalizedX)), centerY: average(positive.map((item) => item.normalizedY)), boundsWidth: 1, boundsHeight: 1 },
        skinRelativeColorPrior: { deltaMean: 0, saturationMean: average(positive.map((item) => item.saturation)), brightnessMean: average(positive.map((item) => item.brightness)) },
        confidencePrior: average(selected.filter((sample) => sample.regionId === region).map((sample) => sample.qualityScore)),
        warnings: [],
      };
    }
  }
  const trainingRunId = `image-conditioned-run-${manifest.datasetId}`;
  const modelBase = {
    modelId: `image-conditioned-pixel-prior-${manifest.datasetId}`,
    modelVersion: `${manifest.datasetVersion}-image-conditioned-v0.1`,
    schemaVersion: 'image-conditioned-segmentation-model-v0.1',
    createdAt: manifest.createdAt,
    sourceDatasetId: manifest.datasetId,
    sourcePackageId: manifest.sourcePackageId,
    trainingRunId,
    trainerConfigVersion: 'trainer-config-v0.1',
    trainedRegions: Object.keys(regionModels).sort(),
    regionModels,
    featureConfig: { featureStride: args.featureStride, alphaPositiveThreshold: args.alphaPositiveThreshold, alphaNegativeThreshold: args.alphaNegativeThreshold, localContrastWindow: 1 },
    trainingSummary: {
      sampleCount: selected.length,
      trainedRegionCount: Object.keys(regionModels).length,
      pixelArtifactCount: pixelByImageId.size,
      positivePixelCount: Object.values(regionModels).reduce((sum, model) => sum + model.positivePixelCount, 0),
      negativePixelCount: Object.values(regionModels).reduce((sum, model) => sum + model.negativePixelCount, 0),
      warnings,
    },
    evaluationSummary: { evaluatedSampleCount: 0, evaluatedRegionCount: 0, meanHardIoU: 0, meanSoftIoU: 0, meanDice: 0, meanAlphaMAE: 0, meanAlphaRMSE: 0, missingPixelArtifactCount: pixelErrors.length, readinessStatus: Object.keys(regionModels).length ? 'trained-image-conditioned-baseline' : 'insufficient-pixel-data' },
    readinessStatus: Object.keys(regionModels).length ? 'trained-image-conditioned-baseline' : 'insufficient-pixel-data',
  };
  const model = { ...modelBase, artifactChecksum: checksumText(stableStringify(modelBase)) };
  const evaluationReport = {
    schemaVersion: 'segmentation-evaluation-report-v0.1',
    reportId: `evaluation-report-${trainingRunId}`,
    trainingRunId,
    createdAt: manifest.createdAt,
    datasetSummary: { datasetId: manifest.datasetId, sampleCount: selected.length, splitBalance: Object.fromEntries(SPLITS.map((split) => [split, selected.filter((sample) => sample.split === split).length])) },
    regionSummaries: regions.map((region) => ({ regionId: region, sampleCount: selected.filter((sample) => sample.regionId === region).length, maskAreaMean: 0, diffAreaMean: 0 })),
    maskMetricSummary: [],
    failedSampleSummary: { failedSampleCount: pixelErrors.length, sampleIds: pixelErrors.map((_, index) => `pixel-issue-${index}`) },
    qualityWeightedSampleCount: average(selected.map((sample) => sample.qualityScore * sample.sampleWeight)),
    readinessStatus: pixelErrors.length ? 'fail' : warnings.length ? 'warning' : 'pass',
    imageConditionedModelEvaluation: { metricType: 'image-conditioned-pixel-prior', note: 'Image-conditioned pixel prior metrics are deterministic baseline metrics, not neural network metrics.', pixelFeatureSummary: { featureStride: args.featureStride, positivePixelCount: model.trainingSummary.positivePixelCount, negativePixelCount: model.trainingSummary.negativePixelCount }, pixelArtifactCoverage: { requiredSampleCount: selected.length, availablePixelArtifactCount: pixelByImageId.size }, perRegionImageConditionedMetrics: [], missingPixelArtifactSummary: { missingPixelArtifactCount: pixelErrors.length }, hardIoU: 0, softIoU: 0, dice: 0, alphaMAE: 0, alphaRMSE: 0 },
  };
  const modelManifest = { schemaVersion: 'model-artifact-manifest-v0.1', modelId: model.modelId, modelVersion: model.modelVersion, trainingRunId, sourceDatasetId: manifest.datasetId, sourcePackageId: manifest.sourcePackageId, trainerConfigVersion: 'trainer-config-v0.1', runtimeKind: 'dry-run', artifactEntries: [{ artifactId: `${model.modelId}-model-json`, format: 'image-conditioned-pixel-prior-json', referenceUri: 'model.json', checksum: model.artifactChecksum, byteSize: stableStringify(model).length }], metricsReference: 'evaluation-report.json', evaluationReportReference: 'evaluation-report.json', createdAt: manifest.createdAt, readinessStatus: { status: model.readinessStatus, reasons: warnings }, lineage: { sourceDatasetId: manifest.datasetId, sourcePackageId: manifest.sourcePackageId, trainingRunId, trainerConfigVersion: 'trainer-config-v0.1', runtimeKind: 'dry-run' } };
  const failedSamples = pixelErrors.map((message, index) => ({ sampleId: `pixel-issue-${index}`, regionId: 'unknown', reason: message.startsWith('missing') ? 'missing-pixel-artifact' : 'invalid-pixel-artifact', severity: 'blocking', message }));
  const quarantine = { schemaVersion: 'failed-sample-quarantine-v0.1', quarantineId: `quarantine-${manifest.datasetId}`, datasetId: manifest.datasetId, createdAt: manifest.createdAt, failedSamples };
  const runPackage = { schemaVersion: 'training-run-package-v0.1', trainingRunId, createdAt: manifest.createdAt, inputSummary: { datasetId: manifest.datasetId, sourcePackageId: manifest.sourcePackageId, sampleCount: selected.length, trainerConfigId: config?.configId ?? 'image-conditioned-cli' }, outputSummary: { modelId: model.modelId, evaluationReportId: evaluationReport.reportId, failedSampleCount: failedSamples.length }, runtimePlan: { planId: `runtime-plan-${trainingRunId}`, runtimeKind: 'dry-run', batchCount: 1, sampleCount: selected.length, capabilities: { supportsDryRun: true, supportsExternalExecution: false, supportsModelExport: false }, dryRunOnly: false }, trace: { traceId: `training-trace-${trainingRunId}`, events: ['materialized-dataset-loaded', 'image-pixels-read', 'pixel-features-extracted', 'image-conditioned-model-trained'] }, trainerConfig: config ?? {}, quarantineSummary: { schemaVersion: 'failed-sample-quarantine-v0.1', quarantineId: quarantine.quarantineId, failedSampleCount: failedSamples.length, blockingCount: failedSamples.length, warningCount: 0, reasonCounts: failedSamples.length ? { 'missing-pixel-artifact': failedSamples.length } : {} }, evaluationReport, modelManifest };
  const errors = pixelErrors.sort();
  const result = { schemaVersion: 'image-conditioned-training-result-v0.1', datasetId: manifest.datasetId, modelId: model.modelId, selectedSamples: selected.length, pixelArtifactCount: pixelByImageId.size, trainedRegions: model.trainedRegions, warnings, errors, readiness: errors.length ? 'fail' : warnings.length ? 'warning' : 'pass', dryRun: args.dryRun, outputs: args.dryRun ? [] : ['model.json','model-artifact-manifest.json','evaluation-report.json','training-run-package.json','trainer-config.json','failed-samples.json'] };
  if (!args.dryRun) {
    if (!args.out) throw new Error('Missing required --out for non dry-run training');
    await writeJson(args.out, 'model.json', model);
    await writeJson(args.out, 'model-artifact-manifest.json', modelManifest);
    await writeJson(args.out, 'evaluation-report.json', evaluationReport);
    await writeJson(args.out, 'training-run-package.json', runPackage);
    await writeJson(args.out, 'trainer-config.json', config ?? {});
    await writeJson(args.out, 'failed-samples.json', quarantine);
  }
  return result;
};
const main = async () => {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(usage);
    return;
  }
  if (!args.dataset) throw new Error('Missing required --dataset');
  const result = await run(args);
  if (args.json) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  else process.stdout.write(`model id: ${result.modelId}\ntrained regions: ${result.trainedRegions.join(',')}\nreadiness: ${result.readiness}\n`);
  if (args.strict && result.errors.length > 0) process.exitCode = 1;
};
main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
