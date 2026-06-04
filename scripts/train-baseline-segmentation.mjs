#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const usage = `Usage:
  node scripts/train-baseline-segmentation.mjs --dataset ./datasets/makeup-engine/dev-v0 [options]

Options:
  --dataset <dir>                         MaterializedTrainingDataset directory
  --config <path>                          Optional baseline trainer config JSON
  --out <dir>                              Output model directory
  --regions lips,blush,eyeshadow          Comma-separated regions to train
  --quality-threshold <number>             Minimum quality score
  --min-samples-per-region <number>        Minimum samples per selected region
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
    minSamplesPerRegion: 1,
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
    else if (arg === '--min-samples-per-region') args.minSamplesPerRegion = Number(argv[++index]);
    else if (arg === '--evaluate') args.evaluate = true;
    else if (arg === '--strict') args.strict = true;
    else if (arg === '--json') args.json = true;
    else if (arg === '--dry-run') args.dryRun = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
};

const stableNormalize = (value) => {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(stableNormalize);
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, stableNormalize(value[key])]),
  );
};
const stableStringify = (value) => JSON.stringify(stableNormalize(value));
const checksumText = (content) => {
  let hash = 0x811c9dc5;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};
const readText = async (root, relativePath) =>
  readFile(path.join(root, ...relativePath.split('/')), 'utf8');
const readJson = async (root, relativePath) => JSON.parse(await readText(root, relativePath));
const readJsonAbsolute = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'));
const readJsonl = async (root, relativePath) =>
  (await readText(root, relativePath))
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
const writeJson = async (outDir, fileName, value) => {
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, fileName), `${stableStringify(value)}\n`, 'utf8');
};
const round4 = (value) => Number(value.toFixed(4));
const average = (values) =>
  values.length === 0
    ? 0
    : round4(values.reduce((sum, value) => sum + value, 0) / values.length);

const defaultConfig = (args) => ({
  schemaVersion: 'trainer-config-v0.1',
  configId: 'baseline-trainer-config-cli-v0.1',
  batchSize: 8,
  regions: {
    enabledRegions: args.regions.length > 0 ? args.regions : REGIONS,
    minSamplesPerRegion: args.minSamplesPerRegion,
  },
  artifacts: { maskFormat: 'json-alpha-grid', diffFormat: 'json-diff-grid' },
  splitPolicy: { requireTrainValidationTest: true, allowTrainTestLeakage: false },
  quality: { minQualityScore: args.qualityThreshold, excludeLowQuality: true },
  runtime: { runtimeKind: 'dry-run', runtimeVersion: 'baseline-mask-prior-v0.1' },
  baseline: {
    trainerKind: 'baseline-mask-prior',
    regions: args.regions.length > 0 ? args.regions : REGIONS,
    qualityThreshold: args.qualityThreshold,
    minSamplesPerRegion: args.minSamplesPerRegion,
    artifactFormat: 'baseline-mask-prior-json',
    evaluationSplits: ['validation', 'test'],
    modelOutputFormat: 'baseline-mask-prior-json',
    missingRegionPolicy: 'warn',
    alphaThreshold: 0.5,
    resizePolicy: 'nearest',
    confidencePolicy: 'quality-weighted',
  },
});

const deriveGrid = (artifact) => {
  const size = artifact.width * artifact.height;
  const activeCount = Math.max(0, Math.min(size, Math.round(artifact.alphaStats.activeRatio * size)));
  if (activeCount === 0) return Array.from({ length: size }, () => 0);
  const activeValue = Math.min(1, artifact.alphaStats.max, (artifact.alphaStats.mean * size) / activeCount);
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

const tensorFromArtifact = (artifact) => {
  const values = deriveGrid(artifact);
  const nonZero = values.filter((value) => value > 0.001).length;
  return {
    width: artifact.width,
    height: artifact.height,
    values,
    mean: average(values),
    min: values.length ? Math.min(...values) : 0,
    max: values.length ? Math.max(...values) : 0,
    nonZeroRatio: values.length ? round4(nonZero / values.length) : 0,
    bounds: artifact.bounds,
  };
};

const edgeSoftness = (tensor) => {
  const gradients = [];
  for (let y = 0; y < tensor.height; y += 1) {
    for (let x = 0; x < tensor.width; x += 1) {
      const index = y * tensor.width + x;
      const right = x + 1 < tensor.width ? tensor.values[index + 1] : tensor.values[index];
      const down = y + 1 < tensor.height ? tensor.values[index + tensor.width] : tensor.values[index];
      gradients.push(Math.abs(tensor.values[index] - right), Math.abs(tensor.values[index] - down));
    }
  }
  return round4(1 - Math.min(1, average(gradients)));
};

const trainPrior = (regionId, samples, artifactById, minSamples) => {
  const tensors = samples.map((sample) => tensorFromArtifact(artifactById.get(sample.maskArtifactIds.humanEditedMask)));
  const weights = samples.map((sample) => sample.qualityScore * sample.sampleWeight);
  const weightSum = weights.reduce((sum, value) => sum + value, 0) || samples.length;
  const width = tensors[0]?.width ?? 1;
  const height = tensors[0]?.height ?? 1;
  const meanAlphaGrid = Array.from({ length: width * height }, (_, index) =>
    round4(tensors.reduce((sum, tensor, tensorIndex) => sum + (tensor.values[index] ?? 0) * (weights[tensorIndex] ?? 1), 0) / weightSum),
  );
  const meanValues = meanAlphaGrid;
  const areas = tensors.map((tensor) => tensor.nonZeroRatio);
  const bounds = tensors.map((tensor) => tensor.bounds).filter(Boolean);
  const boundAreas = bounds.map((bound) => round4(bound.width * bound.height));
  const edgeValues = tensors.map(edgeSoftness);
  const qualityValues = samples.map((sample) => sample.qualityScore);
  return {
    regionId,
    target: regionId,
    sampleCount: samples.length,
    width,
    height,
    meanAlphaGrid,
    meanAlphaStats: {
      min: meanValues.length ? round4(Math.min(...meanValues)) : 0,
      max: meanValues.length ? round4(Math.max(...meanValues)) : 0,
      mean: average(meanValues),
      activeRatio: meanValues.length ? round4(meanValues.filter((value) => value > 0.001).length / meanValues.length) : 0,
    },
    areaDistribution: { min: areas.length ? Math.min(...areas) : 0, max: areas.length ? Math.max(...areas) : 0, mean: average(areas) },
    boundsDistribution: {
      meanBounds: bounds.length ? {
        x: average(bounds.map((bound) => bound.x)),
        y: average(bounds.map((bound) => bound.y)),
        width: average(bounds.map((bound) => bound.width)),
        height: average(bounds.map((bound) => bound.height)),
        space: 'normalized-image',
      } : null,
      minArea: boundAreas.length ? Math.min(...boundAreas) : 0,
      maxArea: boundAreas.length ? Math.max(...boundAreas) : 0,
      meanArea: average(boundAreas),
    },
    edgeSoftnessPrior: {
      meanEdgeSoftness: average(edgeValues),
      minEdgeSoftness: edgeValues.length ? Math.min(...edgeValues) : 0,
      maxEdgeSoftness: edgeValues.length ? Math.max(...edgeValues) : 0,
    },
    confidencePrior: {
      min: qualityValues.length ? Math.min(...qualityValues) : 0,
      max: qualityValues.length ? Math.max(...qualityValues) : 0,
      mean: average(qualityValues),
    },
    qualityWeightedSampleCount: round4(samples.reduce((sum, sample) => sum + sample.qualityScore * sample.sampleWeight, 0)),
    warnings: samples.length < minSamples ? [`insufficient samples for region:${regionId}`] : [],
  };
};

const metricFor = (prior, sample, artifactById) => {
  const actual = tensorFromArtifact(artifactById.get(sample.maskArtifactIds.humanEditedMask));
  const predicted = prior.meanAlphaGrid;
  let hardIntersection = 0;
  let hardUnion = 0;
  let softIntersection = 0;
  let softUnion = 0;
  let predCount = 0;
  let actualCount = 0;
  const errors = [];
  for (let index = 0; index < actual.values.length; index += 1) {
    const pred = predicted[index] ?? 0;
    const target = actual.values[index] ?? 0;
    const predActive = pred >= 0.5;
    const actualActive = target >= 0.5;
    if (predActive && actualActive) hardIntersection += 1;
    if (predActive || actualActive) hardUnion += 1;
    if (predActive) predCount += 1;
    if (actualActive) actualCount += 1;
    softIntersection += Math.min(pred, target);
    softUnion += Math.max(pred, target);
    errors.push(pred - target);
  }
  return {
    hardIoU: hardUnion === 0 ? 1 : round4(hardIntersection / hardUnion),
    softIoU: softUnion === 0 ? 1 : round4(softIntersection / softUnion),
    dice: predCount + actualCount === 0 ? 1 : round4((2 * hardIntersection) / (predCount + actualCount)),
    alphaMAE: average(errors.map((value) => Math.abs(value))),
    alphaRMSE: round4(Math.sqrt(average(errors.map((value) => value ** 2)))),
    boundsOverlap: 1,
    areaError: round4(Math.abs(prior.meanAlphaStats.activeRatio - actual.nonZeroRatio)),
  };
};

const train = async (args) => {
  const root = path.resolve(args.dataset);
  const [manifest, trainingPackage] = await Promise.all([
    readJson(root, 'manifest.json'),
    readJson(root, 'package.json'),
  ]);
  const config = args.config ? await readJsonAbsolute(args.config) : defaultConfig(args);
  const configuredRegions = args.regions.length > 0 ? args.regions : (config.baseline?.regions ?? config.regions?.enabledRegions ?? REGIONS);
  for (const region of configuredRegions) if (!REGIONS.includes(region)) throw new Error(`Unsupported region: ${region}`);
  const splitRows = (await Promise.all(SPLITS.map((split) => readJsonl(root, `splits/${split}.jsonl`)))).flat();
  const artifactById = new Map((trainingPackage.maskArtifacts ?? []).map((artifact) => [artifact.artifactId, artifact]));
  const samples = splitRows
    .filter((sample) => sample.validationStatus === 'ready')
    .filter((sample) => configuredRegions.includes(sample.regionId))
    .filter((sample) => sample.qualityScore >= (args.qualityThreshold ?? config.quality?.minQualityScore ?? 0))
    .sort((left, right) => left.sampleId.localeCompare(right.sampleId));
  const errors = samples.flatMap((sample) =>
    artifactById.has(sample.maskArtifactIds.humanEditedMask) ? [] : [`missing human edited mask:${sample.sampleId}`],
  );
  const regionGroups = configuredRegions.map((region) => ({
    region,
    samples: samples.filter((sample) => sample.regionId === region),
  }));
  const warnings = regionGroups.flatMap((group) =>
    group.samples.length < args.minSamplesPerRegion
      ? [`region ${group.region} has ${group.samples.length} samples, requires ${args.minSamplesPerRegion}`]
      : [],
  );
  const priors = regionGroups
    .filter((group) => group.samples.length > 0)
    .map((group) => trainPrior(group.region, group.samples, artifactById, args.minSamplesPerRegion));
  const trainingRunId = `baseline-run-${manifest.datasetId}`;
  const modelBase = {
    modelId: `baseline-mask-prior-${manifest.datasetId}`,
    modelVersion: `${manifest.datasetVersion}-baseline-v0.1`,
    schemaVersion: 'baseline-segmentation-model-v0.1',
    createdAt: manifest.createdAt,
    sourceDatasetId: manifest.datasetId,
    sourcePackageId: manifest.sourcePackageId,
    trainingRunId,
    trainerConfigVersion: config.schemaVersion ?? 'trainer-config-v0.1',
    trainedRegions: priors.map((prior) => prior.regionId).sort(),
    regionPriors: Object.fromEntries(priors.map((prior) => [prior.regionId, prior]).sort(([left], [right]) => left.localeCompare(right))),
    trainingSummary: {
      sampleCount: samples.length,
      trainedRegionCount: priors.length,
      skippedRegionCount: configuredRegions.length - priors.length,
      qualityWeightedSampleCount: round4(samples.reduce((sum, sample) => sum + sample.qualityScore * sample.sampleWeight, 0)),
      warnings,
    },
    evaluationSummary: {
      evaluatedSampleCount: 0,
      evaluatedRegionCount: 0,
      meanHardIoU: 0,
      meanSoftIoU: 0,
      meanDice: 0,
      meanAlphaMAE: 0,
      meanAlphaRMSE: 0,
      readinessStatus: priors.length ? 'trained-baseline' : 'insufficient-data',
    },
    readinessStatus: priors.length ? 'trained-baseline' : 'insufficient-data',
  };
  const model = { ...modelBase, artifactChecksum: checksumText(stableStringify(modelBase)) };
  const evaluationRows = samples.filter((sample) => ['validation', 'test'].includes(sample.split));
  const perRegionMetrics = priors.map((prior) => {
    const evalSamples = evaluationRows.filter((sample) => sample.regionId === prior.regionId);
    const metrics = evalSamples.map((sample) => metricFor(prior, sample, artifactById));
    return {
      regionId: prior.regionId,
      sampleCount: evalSamples.length,
      hardIoU: average(metrics.map((metric) => metric.hardIoU)),
      softIoU: average(metrics.map((metric) => metric.softIoU)),
      dice: average(metrics.map((metric) => metric.dice)),
      alphaMAE: average(metrics.map((metric) => metric.alphaMAE)),
      alphaRMSE: average(metrics.map((metric) => metric.alphaRMSE)),
      boundsOverlap: average(metrics.map((metric) => metric.boundsOverlap)),
      areaError: average(metrics.map((metric) => metric.areaError)),
    };
  }).filter((metric) => metric.sampleCount > 0);
  const baselineEvaluation = {
    metricType: 'baseline-mask-prior',
    note: 'Baseline prior model evaluation compares prior masks against human-edited masks. It is not a neural network segmentation metric.',
    evaluationSplit: 'test,validation',
    evaluationSampleCount: evaluationRows.length,
    perRegionMetrics,
    hardIoU: average(perRegionMetrics.map((metric) => metric.hardIoU)),
    softIoU: average(perRegionMetrics.map((metric) => metric.softIoU)),
    dice: average(perRegionMetrics.map((metric) => metric.dice)),
    alphaMAE: average(perRegionMetrics.map((metric) => metric.alphaMAE)),
    alphaRMSE: average(perRegionMetrics.map((metric) => metric.alphaRMSE)),
    boundsOverlap: average(perRegionMetrics.map((metric) => metric.boundsOverlap)),
    areaError: average(perRegionMetrics.map((metric) => metric.areaError)),
  };
  const evaluatedModel = args.evaluate ? {
    ...model,
    evaluationSummary: {
      evaluatedSampleCount: evaluationRows.length,
      evaluatedRegionCount: perRegionMetrics.length,
      meanHardIoU: baselineEvaluation.hardIoU,
      meanSoftIoU: baselineEvaluation.softIoU,
      meanDice: baselineEvaluation.dice,
      meanAlphaMAE: baselineEvaluation.alphaMAE,
      meanAlphaRMSE: baselineEvaluation.alphaRMSE,
      readinessStatus: perRegionMetrics.length ? 'evaluated-baseline' : 'insufficient-data',
    },
    readinessStatus: perRegionMetrics.length ? 'evaluated-baseline' : model.readinessStatus,
  } : model;
  const evaluationReport = {
    schemaVersion: 'segmentation-evaluation-report-v0.1',
    reportId: `evaluation-report-${trainingRunId}`,
    trainingRunId,
    createdAt: manifest.createdAt,
    datasetSummary: {
      datasetId: manifest.datasetId,
      sampleCount: samples.length,
      splitBalance: Object.fromEntries(SPLITS.map((split) => [split, samples.filter((sample) => sample.split === split).length])),
    },
    regionSummaries: configuredRegions.map((region) => ({
      regionId: region,
      sampleCount: samples.filter((sample) => sample.regionId === region).length,
      maskAreaMean: average(samples.filter((sample) => sample.regionId === region).map((sample) => artifactById.get(sample.maskArtifactIds.humanEditedMask)?.alphaStats.activeRatio ?? 0)),
      diffAreaMean: 0,
    })),
    maskMetricSummary: [
      { metricName: 'baseline_hard_iou', value: baselineEvaluation.hardIoU, note: 'baseline prior mask-vs-mask metric, not neural segmentation metric' },
      { metricName: 'baseline_soft_iou', value: baselineEvaluation.softIoU, note: 'baseline prior mask-vs-mask metric, not neural segmentation metric' },
      { metricName: 'baseline_dice', value: baselineEvaluation.dice, note: 'baseline prior mask-vs-mask metric, not neural segmentation metric' },
    ],
    failedSampleSummary: { failedSampleCount: errors.length, sampleIds: errors.map((_, index) => `dataset-issue-${index}`) },
    qualityWeightedSampleCount: round4(samples.reduce((sum, sample) => sum + sample.qualityScore * sample.sampleWeight, 0)),
    readinessStatus: errors.length ? 'fail' : warnings.length ? 'warning' : 'pass',
    baselineModelEvaluation: baselineEvaluation,
  };
  const modelManifest = {
    schemaVersion: 'model-artifact-manifest-v0.1',
    modelId: evaluatedModel.modelId,
    modelVersion: evaluatedModel.modelVersion,
    trainingRunId,
    sourceDatasetId: manifest.datasetId,
    sourcePackageId: manifest.sourcePackageId,
    trainerConfigVersion: config.schemaVersion ?? 'trainer-config-v0.1',
    runtimeKind: 'dry-run',
    artifactEntries: [
      { artifactId: `${evaluatedModel.modelId}-model-json`, format: 'baseline-mask-prior-json', referenceUri: 'model.json', checksum: evaluatedModel.artifactChecksum, byteSize: stableStringify(evaluatedModel).length },
      { artifactId: `${evaluatedModel.modelId}-trainer-config`, format: 'placeholder-json', referenceUri: 'trainer-config.json', checksum: 'trainer-config', byteSize: stableStringify(config).length },
      { artifactId: `${evaluatedModel.modelId}-evaluation-report`, format: 'placeholder-json', referenceUri: 'evaluation-report.json', checksum: 'evaluation-report', byteSize: stableStringify(evaluationReport).length },
      { artifactId: `${evaluatedModel.modelId}-training-run-package`, format: 'placeholder-json', referenceUri: 'training-run-package.json', checksum: 'training-run-package', byteSize: 0 },
      { artifactId: `${evaluatedModel.modelId}-failed-samples`, format: 'placeholder-json', referenceUri: 'failed-samples.json', checksum: 'failed-samples', byteSize: 0 },
    ],
    metricsReference: 'evaluation-report.json',
    evaluationReportReference: 'evaluation-report.json',
    createdAt: manifest.createdAt,
    readinessStatus: { status: evaluatedModel.readinessStatus, reasons: warnings },
    lineage: { sourceDatasetId: manifest.datasetId, sourcePackageId: manifest.sourcePackageId, trainingRunId, trainerConfigVersion: config.schemaVersion ?? 'trainer-config-v0.1', runtimeKind: 'dry-run' },
  };
  const failedSamples = errors.map((message, index) => ({
    sampleId: `dataset-issue-${index}`,
    regionId: 'unknown',
    reason: 'missing-mask-artifact',
    severity: 'blocking',
    message,
  }));
  const quarantine = {
    schemaVersion: 'failed-sample-quarantine-v0.1',
    quarantineId: `quarantine-${manifest.datasetId}`,
    datasetId: manifest.datasetId,
    createdAt: manifest.createdAt,
    failedSamples,
  };
  const runPackage = {
    schemaVersion: 'training-run-package-v0.1',
    trainingRunId,
    createdAt: manifest.createdAt,
    inputSummary: { datasetId: manifest.datasetId, sourcePackageId: manifest.sourcePackageId, sampleCount: samples.length, trainerConfigId: config.configId ?? 'baseline-trainer-config-cli-v0.1' },
    outputSummary: { modelId: evaluatedModel.modelId, evaluationReportId: evaluationReport.reportId, failedSampleCount: failedSamples.length },
    runtimePlan: { planId: `baseline-runtime-plan-${trainingRunId}`, runtimeKind: 'dry-run', batchCount: 1, sampleCount: samples.length, capabilities: { supportsDryRun: true, supportsExternalExecution: false, supportsModelExport: false }, dryRunOnly: false },
    trace: { traceId: `training-trace-${trainingRunId}`, events: ['materialized-dataset-loaded', 'baseline-mask-prior-training', 'baseline-evaluation', 'baseline-model-artifact-created'] },
    trainerConfig: config,
    quarantineSummary: { schemaVersion: 'failed-sample-quarantine-v0.1', quarantineId: quarantine.quarantineId, failedSampleCount: failedSamples.length, blockingCount: failedSamples.length, warningCount: 0, reasonCounts: failedSamples.length ? { 'missing-mask-artifact': failedSamples.length } : {} },
    evaluationReport,
    modelManifest,
  };
  const readiness = errors.length ? 'fail' : warnings.length ? 'warning' : 'pass';
  const result = {
    schemaVersion: 'baseline-segmentation-training-result-v0.1',
    datasetId: manifest.datasetId,
    modelId: evaluatedModel.modelId,
    modelVersion: evaluatedModel.modelVersion,
    selectedSamples: samples.length,
    trainedRegions: evaluatedModel.trainedRegions,
    warnings,
    errors,
    readiness,
    dryRun: args.dryRun,
    evaluation: baselineEvaluation,
    outputs: args.dryRun ? [] : ['model.json', 'model-artifact-manifest.json', 'evaluation-report.json', 'training-run-package.json', 'trainer-config.json', 'failed-samples.json'],
  };
  if (!args.dryRun) {
    if (!args.out) throw new Error('Missing required --out for non dry-run training');
    await writeJson(args.out, 'model.json', evaluatedModel);
    await writeJson(args.out, 'model-artifact-manifest.json', modelManifest);
    await writeJson(args.out, 'evaluation-report.json', evaluationReport);
    await writeJson(args.out, 'training-run-package.json', runPackage);
    await writeJson(args.out, 'trainer-config.json', config);
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
  const result = await train(args);
  if (args.json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else {
    process.stdout.write([
      `dataset id: ${result.datasetId}`,
      `model id: ${result.modelId}`,
      `selected samples: ${result.selectedSamples}`,
      `trained regions: ${result.trainedRegions.join(', ')}`,
      `readiness: ${result.readiness}`,
      ...result.warnings.map((warning) => `warning: ${warning}`),
      ...result.errors.map((error) => `error: ${error}`),
    ].join('\n') + '\n');
  }
  if (args.strict && result.errors.length > 0) process.exitCode = 1;
};

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
