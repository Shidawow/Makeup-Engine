#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const usage = `Usage:
  node scripts/training-preflight.mjs --dataset ./datasets/makeup-engine/dev-v0 [options]

Options:
  --dataset <dir>                         MaterializedTrainingDataset directory
  --split train|validation|test            Filter one split
  --region <region>                       Filter one or more regions
  --quality-threshold <number>             Minimum quality score
  --batch-size <number>                    Batch size for dry-run iterator summary
  --config <path>                          Optional trainer config JSON
  --runtime <kind>                         dry-run | external-python-placeholder | webgpu-placeholder | onnx-export-placeholder
  --export-run-package <path>              Write training run package JSON
  --export-quarantine <path>               Write failed sample quarantine JSON
  --export-evaluation <path>               Write evaluation report JSON
  --export-model-manifest <path>           Write model artifact manifest JSON
  --classifier nearest-centroid|logistic-linear|hybrid-threshold
  --strict                                Exit non-zero when readiness is fail
  --json                                  Emit machine-readable JSON
  --help                                  Show this help
`;

const SPLITS = ['train', 'validation', 'test'];
const REGIONS = ['lips', 'blush', 'eyeshadow', 'eyeliner', 'contour', 'highlight'];
const RUNTIMES = ['dry-run', 'external-python-placeholder', 'webgpu-placeholder', 'onnx-export-placeholder'];

const parseArgs = (argv) => {
  const args = {
    regions: [],
    batchSize: 8,
    qualityThreshold: 0,
    runtime: 'dry-run',
    classifier: 'nearest-centroid',
    strict: false,
    json: false,
    help: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') args.help = true;
    else if (arg === '--dataset') args.dataset = argv[++index];
    else if (arg === '--split') args.split = argv[++index];
    else if (arg === '--region') args.regions.push(argv[++index]);
    else if (arg === '--quality-threshold') args.qualityThreshold = Number(argv[++index]);
    else if (arg === '--batch-size') args.batchSize = Number(argv[++index]);
    else if (arg === '--config') args.config = argv[++index];
    else if (arg === '--runtime') args.runtime = argv[++index];
    else if (arg === '--export-run-package') args.exportRunPackage = argv[++index];
    else if (arg === '--export-quarantine') args.exportQuarantine = argv[++index];
    else if (arg === '--export-evaluation') args.exportEvaluation = argv[++index];
    else if (arg === '--export-model-manifest') args.exportModelManifest = argv[++index];
    else if (arg === '--classifier') args.classifier = argv[++index];
    else if (arg === '--strict') args.strict = true;
    else if (arg === '--json') args.json = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
};

const stableStringify = (value) => {
  const normalize = (input) => {
    if (input === null || typeof input !== 'object') return input;
    if (Array.isArray(input)) return input.map(normalize);
    return Object.fromEntries(Object.keys(input).sort().map((key) => [key, normalize(input[key])]));
  };
  return JSON.stringify(normalize(value));
};

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
const writeJsonAbsolute = async (filePath, value) => {
  await mkdir(path.dirname(path.resolve(filePath)), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

const readJsonl = async (root, relativePath) =>
  (await readText(root, relativePath))
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));

const validateChecksums = async (root, checksums) => {
  const errors = [];
  for (const file of checksums.files ?? []) {
    const actual = checksumText(await readText(root, file.path));
    if (actual !== file.checksum) errors.push(`checksum mismatch:${file.path}`);
  }
  return errors;
};

const createDefaultConfig = (args) => ({
  schemaVersion: 'trainer-config-v0.1',
  configId: 'trainer-config-cli-v0.1',
  batchSize: args.batchSize,
  regions: { enabledRegions: REGIONS, minSamplesPerRegion: 1 },
  artifacts: { maskFormat: 'json-alpha-grid', diffFormat: 'json-diff-grid' },
  splitPolicy: { requireTrainValidationTest: true, allowTrainTestLeakage: false },
  quality: { minQualityScore: args.qualityThreshold, excludeLowQuality: true },
  runtime: { runtimeKind: args.runtime, runtimeVersion: `${args.runtime}-v0.1` },
});

const createBatches = (samples, batchSize) => {
  const size = Math.max(1, batchSize);
  const batches = [];
  const sorted = [...samples].sort((left, right) => left.sampleId.localeCompare(right.sampleId));
  for (let index = 0; index < sorted.length; index += size) batches.push(sorted.slice(index, index + size));
  return batches;
};

const average = (values) => values.length === 0 ? 0 : Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(4));

const reasonFor = (message) => {
  if (message.includes('checksum')) return 'checksum-mismatch';
  if (message.includes('mask')) return 'missing-mask-artifact';
  if (message.includes('diff')) return 'missing-diff-artifact';
  if (message.includes('image')) return 'missing-image-reference';
  if (message.includes('region')) return 'unsupported-region';
  return 'artifact-format-unsupported';
};

const run = async () => {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(usage);
    return;
  }
  const sourceImageReadiness = {
    binaryFileReaderReady: true,
    pngCodecHardenedReady: true,
    jpegCodecReady: false,
    exifOrientationReady: true,
    sourceImageImportReady: true,
    sourceImageQualityGateReady: true,
    sourceImagePackageReady: true,
    sourceImageToTemplateSeedReady: true,
    recommendedImportCommand:
      'node scripts/import-source-images.mjs --input ./tests/fixtures/source-images --out ./tmp/source-images/admin-batch-v0 --codec-preference png,jpeg --materialize-normalized-png --materialize-raw-rgba --materialize-json-rgba --write-manifest --quality-gate --json',
  };
  if (!args.dataset) {
    const result = {
      schemaVersion: 'segmentation-training-bridge-v0.1',
      readiness: 'warning',
      warnings: ['No --dataset provided; source image import readiness only'],
      errors: [],
      ...sourceImageReadiness,
    };
    if (args.json) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    else process.stdout.write(`source image import readiness: ${sourceImageReadiness.sourceImageImportReady ? 'ready' : 'blocked'}\nnext command: ${sourceImageReadiness.recommendedImportCommand}\n`);
    return;
  }
  if (args.split && !SPLITS.includes(args.split)) throw new Error(`Unsupported split: ${args.split}`);
  if (!RUNTIMES.includes(args.runtime)) throw new Error(`Unsupported runtime: ${args.runtime}`);
  for (const region of args.regions) if (!REGIONS.includes(region)) throw new Error(`Unsupported region: ${region}`);

  const root = path.resolve(args.dataset);
  const [manifest, trainingPackage, audit, checksums] = await Promise.all([
    readJson(root, 'manifest.json'),
    readJson(root, 'package.json'),
    readJson(root, 'audit-report.json'),
    readJson(root, 'checksums.json'),
  ]);
  const config = args.config ? await readJsonAbsolute(args.config) : createDefaultConfig(args);
  const checksumErrors = await validateChecksums(root, checksums);
  const splitRows = (await Promise.all(SPLITS.map((split) => readJsonl(root, `splits/${split}.jsonl`)))).flat();
  const selectedRegions = new Set(args.regions);
  const samples = splitRows
    .filter((sample) => !args.split || sample.split === args.split)
    .filter((sample) => args.regions.length === 0 || selectedRegions.has(sample.regionId))
    .filter((sample) => sample.qualityScore >= (args.qualityThreshold || config.quality?.minQualityScore || 0))
    .sort((left, right) => left.sampleId.localeCompare(right.sampleId));
  const artifactIds = new Set([
    ...(trainingPackage.maskArtifacts ?? []).map((artifact) => artifact.artifactId),
    ...(trainingPackage.syntheticMaskArtifacts
      ? splitRows.flatMap((sample) => [
        sample.maskArtifactIds?.originalMask,
        sample.maskArtifactIds?.humanEditedMask,
        sample.maskArtifactIds?.diffHeatmap,
      ]).filter(Boolean)
      : []),
  ]);
  const binaryMaskReady = await Promise.all((manifest.maskFiles ?? []).map(async (file) => {
    try {
      await readText(root, `masks-binary/${file.artifactId}-binary.meamask.json`);
      return true;
    } catch {
      return false;
    }
  }));
  const binaryDiffReady = await Promise.all((manifest.diffFiles ?? []).map(async (file) => {
    try {
      await readText(root, `diffs-binary/${file.artifactId}-binary.meadiff.json`);
      return true;
    } catch {
      return false;
    }
  }));
  const pixelArtifactReady = await Promise.all((manifest.imageFiles ?? []).map(async (file) => {
    try {
      await readText(root, `image-pixels/${file.imageId}.rgba.json`);
      return true;
    } catch {
      return false;
    }
  }));
  const rawRgbaReady = await Promise.all((manifest.imageFiles ?? []).map(async (file) => {
    try {
      await readText(root, `image-pixels-raw/${file.imageId}.rgba.bin.json`);
      return true;
    } catch {
      return false;
    }
  }));
  let artifactManifestReady = false;
  try {
    await readText(root, 'artifact-manifest.json');
    artifactManifestReady = true;
  } catch {
    artifactManifestReady = false;
  }
  const pngMaskChecks = await Promise.all(splitRows.map(async (sample) => {
    try {
      await readText(root, `masks-png/${sample.sampleId}-${sample.regionId}.png`);
      await readText(root, `masks-png/${sample.sampleId}-${sample.regionId}.png.meta.json`);
      return true;
    } catch {
      return false;
    }
  }));
  const pngImageChecks = await Promise.all((manifest.imageFiles ?? []).map(async (image) => {
    try {
      await readText(root, `images-png/${image.imageId}.png`);
      await readText(root, `images-png/${image.imageId}.png.meta.json`);
      return true;
    } catch {
      return false;
    }
  }));
  let pngImageDecodeReady = false;
  try {
    const report = await readJson(root, 'image-codec-report.json');
    pngImageDecodeReady = report.readiness === 'ready' || report.readiness === 'pass';
  } catch {
    pngImageDecodeReady = false;
  }
  let pngRoundTripReady = false;
  try {
    const report = await readJson(root, 'codec-roundtrip-report.json');
    pngRoundTripReady = report.readiness === 'ready' || report.readiness === 'pass';
  } catch {
    pngRoundTripReady = false;
  }
  const artifactErrors = splitRows.flatMap((sample) =>
    [sample.maskArtifactIds?.originalMask, sample.maskArtifactIds?.humanEditedMask, sample.maskArtifactIds?.diffHeatmap]
      .filter((artifactId) => !artifactIds.has(artifactId))
      .map((artifactId) => `missing artifact:${sample.sampleId}:${artifactId}`),
  );
  const splitCounts = Object.fromEntries(SPLITS.map((split) => [split, splitRows.filter((sample) => sample.split === split).length]));
  const regionCoverage = Object.fromEntries(REGIONS.map((region) => [region, splitRows.filter((sample) => sample.regionId === region).length]));
  const warnings = [
    ...SPLITS.flatMap((split) => splitCounts[split] === 0 ? [`split is empty:${split}`] : []),
    ...REGIONS.flatMap((region) => regionCoverage[region] === 0 ? [`region has no samples:${region}`] : []),
    `${args.runtime} runtime is dry-run/placeholder only`,
    ...(binaryMaskReady.every(Boolean) ? [] : ['binary mask artifacts are incomplete']),
    ...(binaryDiffReady.every(Boolean) ? [] : ['binary diff artifacts are incomplete']),
    ...(pixelArtifactReady.every(Boolean) ? [] : ['pixel artifacts are incomplete']),
    ...(rawRgbaReady.every(Boolean) ? [] : ['raw RGBA artifacts are incomplete']),
    ...(artifactManifestReady ? [] : ['artifact manifest links are missing']),
    ...(pngImageChecks.every(Boolean) ? [] : ['png image artifacts are incomplete']),
    ...(pngImageDecodeReady ? [] : ['png image decode report is missing or not ready']),
    ...(pngMaskChecks.every(Boolean) ? [] : ['png alpha mask artifacts are incomplete']),
    ...(pngRoundTripReady ? [] : ['png mask round-trip report is missing or not ready']),
  ];
  const errors = [
    ...(manifest.sourcePackageId !== trainingPackage.packageId ? ['manifest sourcePackageId does not match packageId'] : []),
    ...(audit.packageId !== trainingPackage.packageId ? ['audit packageId does not match packageId'] : []),
    ...checksumErrors,
    ...artifactErrors,
  ].sort();
  const batches = createBatches(samples, config.batchSize ?? args.batchSize);
  const readiness = errors.length > 0 ? 'fail' : warnings.length > 0 ? 'warning' : 'pass';
  const trainingRunId = `training-run-${manifest.datasetId}`;
  const quarantine = {
    schemaVersion: 'failed-sample-quarantine-v0.1',
    quarantineId: `quarantine-${manifest.datasetId}`,
    datasetId: manifest.datasetId,
    createdAt: manifest.createdAt,
    failedSamples: errors.map((message, index) => ({
      sampleId: `dataset-issue-${index}`,
      regionId: 'unknown',
      reason: reasonFor(message),
      severity: 'blocking',
      message,
    })),
  };
  const quarantineSummary = {
    schemaVersion: 'failed-sample-quarantine-v0.1',
    quarantineId: quarantine.quarantineId,
    failedSampleCount: quarantine.failedSamples.length,
    blockingCount: quarantine.failedSamples.length,
    warningCount: 0,
    reasonCounts: quarantine.failedSamples.reduce((counts, sample) => {
      counts[sample.reason] = (counts[sample.reason] ?? 0) + 1;
      return counts;
    }, {}),
  };
  const evaluationReport = {
    schemaVersion: 'segmentation-evaluation-report-v0.1',
    reportId: `evaluation-report-${trainingRunId}`,
    trainingRunId,
    createdAt: manifest.createdAt,
    datasetSummary: { datasetId: manifest.datasetId, sampleCount: samples.length, splitBalance: splitCounts },
    regionSummaries: REGIONS.map((region) => ({
      regionId: region,
      sampleCount: samples.filter((sample) => sample.regionId === region).length,
      maskAreaMean: 0,
      diffAreaMean: 0,
    })),
    maskMetricSummary: [
      { metricName: 'dry_run_proxy_mask_area', value: 0, note: 'dry-run proxy, not real model IoU/Dice' },
      { metricName: 'dry_run_proxy_diff_area', value: 0, note: 'dry-run proxy, not real model IoU/Dice' },
    ],
    failedSampleSummary: { failedSampleCount: quarantine.failedSamples.length, sampleIds: quarantine.failedSamples.map((sample) => sample.sampleId) },
    qualityWeightedSampleCount: Number(samples.reduce((sum, sample) => sum + sample.qualityScore * sample.sampleWeight, 0).toFixed(4)),
    readinessStatus: readiness,
  };
  const runtimePlan = {
    planId: `runtime-plan-${args.runtime}-${batches.length}`,
    runtimeKind: args.runtime,
    batchCount: batches.length,
    sampleCount: samples.length,
    capabilities: {
      supportsDryRun: true,
      supportsExternalExecution: args.runtime === 'external-python-placeholder',
      supportsModelExport: args.runtime === 'onnx-export-placeholder',
    },
    dryRunOnly: true,
  };
  const modelManifest = {
    schemaVersion: 'model-artifact-manifest-v0.1',
    modelId: `model-placeholder-${manifest.datasetId}`,
    modelVersion: 'placeholder-v0.1',
    trainingRunId,
    sourceDatasetId: manifest.datasetId,
    sourcePackageId: manifest.sourcePackageId,
    trainerConfigVersion: config.schemaVersion ?? 'trainer-config-v0.1',
    runtimeKind: args.runtime,
    artifactEntries: [{ artifactId: `model-artifact-${trainingRunId}`, format: 'placeholder-json', referenceUri: `placeholder://models/${trainingRunId}.json`, checksum: 'placeholder', byteSize: 0 }],
    metricsReference: `placeholder://metrics/${trainingRunId}.json`,
    evaluationReportReference: `placeholder://evaluation/${trainingRunId}.json`,
    createdAt: manifest.createdAt,
    readinessStatus: { status: 'placeholder', reasons: ['Phase 6B does not produce real model artifacts'] },
    lineage: { sourceDatasetId: manifest.datasetId, sourcePackageId: manifest.sourcePackageId, trainingRunId, trainerConfigVersion: config.schemaVersion ?? 'trainer-config-v0.1', runtimeKind: args.runtime },
  };
  const runPackage = {
    schemaVersion: 'training-run-package-v0.1',
    trainingRunId,
    createdAt: manifest.createdAt,
    inputSummary: { datasetId: manifest.datasetId, sourcePackageId: manifest.sourcePackageId, sampleCount: samples.length, trainerConfigId: config.configId ?? 'trainer-config-cli-v0.1' },
    outputSummary: { modelId: modelManifest.modelId, evaluationReportId: evaluationReport.reportId, failedSampleCount: quarantineSummary.failedSampleCount },
    runtimePlan,
    trace: { traceId: `training-trace-${trainingRunId}`, events: ['materialized-dataset-loaded', 'split-jsonl-read', 'artifact-json-read', 'runtime-dry-run', 'model-placeholder-created'] },
    trainerConfig: config,
    quarantineSummary,
    evaluationReport,
    modelManifest,
  };
  const result = {
    schemaVersion: 'segmentation-training-bridge-v0.1',
    datasetId: manifest.datasetId,
    datasetVersion: manifest.datasetVersion,
    sourcePackageId: manifest.sourcePackageId,
    totalSamples: splitRows.length,
    selectedSamples: samples.length,
    splitCounts,
    regionCoverage,
    qualitySummary: { min: samples.length ? Math.min(...samples.map((sample) => sample.qualityScore)) : 0, max: samples.length ? Math.max(...samples.map((sample) => sample.qualityScore)) : 0, average: average(samples.map((sample) => sample.qualityScore)) },
    checksumStatus: checksumErrors.length === 0 ? 'passed' : 'failed',
    artifactStatus: artifactErrors.length === 0 ? 'passed' : 'failed',
    splitStatus: SPLITS.every((split) => splitCounts[split] > 0) ? 'passed' : 'warning',
    batchIteratorSummary: { batchSize: config.batchSize ?? args.batchSize, batchCount: batches.length, batchSampleCounts: batches.map((batch) => batch.length) },
    trainerConfigSummary: `${config.configId ?? 'trainer-config-cli-v0.1'}:${args.runtime}:batchSize=${config.batchSize ?? args.batchSize}`,
    runtimePlanSummary: `${runtimePlan.runtimeKind}:batches=${runtimePlan.batchCount}:samples=${runtimePlan.sampleCount}:dryRun=true`,
    quarantineSummary,
    evaluationSummary: `${evaluationReport.reportId}:samples=${evaluationReport.datasetSummary.sampleCount}:readiness=${evaluationReport.readinessStatus}`,
    modelArtifactSummary: `${modelManifest.modelId}:${modelManifest.runtimeKind}:${modelManifest.readinessStatus.status}`,
    trainingRunPackageSummary: `${runPackage.trainingRunId}:dataset=${runPackage.inputSummary.datasetId}:model=${runPackage.outputSummary.modelId}`,
    warnings,
    errors,
    readiness,
    nextBaselineTrainingCommand:
      errors.length === 0
        ? `node scripts/train-baseline-segmentation.mjs --dataset ${args.dataset} --regions ${REGIONS.filter((region) => regionCoverage[region] > 0).join(',')} --out ./tmp/models/makeup-segmentation-baseline/dev-v0 --evaluate --strict`
        : null,
    nextLightweightTrainingCommand:
      errors.length === 0
        ? `node scripts/train-lightweight-segmentation.mjs --dataset ${args.dataset} --regions ${REGIONS.filter((region) => regionCoverage[region] > 0).join(',')} --classifier ${args.classifier} --out ./tmp/models/makeup-segmentation-lightweight-classifier/dev-v0 --evaluate --strict`
        : null,
    nextExportModelPackageCommand:
      errors.length === 0
        ? 'node scripts/export-model-package.mjs --model ./tmp/models/makeup-segmentation-lightweight-classifier/dev-v0/model.json --manifest ./tmp/models/makeup-segmentation-lightweight-classifier/dev-v0/model-artifact-manifest.json --evaluation ./tmp/models/makeup-segmentation-lightweight-classifier/dev-v0/evaluation-report.json --out ./tmp/exports/makeup-segmentation/dev-v0 --target typescript-provider,browser-provider,onnx-placeholder,webgpu-placeholder --include-runtime-smoke --include-onnx-prototype --strict'
        : null,
    lightweightReadiness: {
      binaryMaskReady: binaryMaskReady.every(Boolean),
      binaryDiffReady: binaryDiffReady.every(Boolean),
      pixelMaskAlignmentReady: pixelArtifactReady.every(Boolean),
      featureCoverage: samples.length,
      positiveNegativeSampleReadiness: samples.length > 0 ? 'ready' : 'warning',
    },
    phase6fReadiness: {
      pngImageCodecReady: pngImageChecks.every(Boolean),
      pngImageDecodeReady,
      pngAlphaMaskCodecReady: pngMaskChecks.every(Boolean),
      pngDiffHeatmapReady: false,
      rawRgbaReady: rawRgbaReady.every(Boolean),
      realisticSyntheticFixtureReady: manifest.datasetId?.includes('realistic') || manifest.datasetId?.includes('full-region') || false,
      artifactManifestReady,
      strictAlignmentReady: pixelArtifactReady.every(Boolean),
      fullRegionCoverageReady: REGIONS.every((region) => regionCoverage[region] > 0),
      providerCompatibilityReady: samples.length > 0,
      exportPackageReady: errors.length === 0,
      exportRuntimeSmokeReady: errors.length === 0,
      onnxExportPreparation: 'preparation-only',
      webgpuExportPreparation: 'preparation-only',
    },
    nextCodecBuildCommand:
      pngMaskChecks.every(Boolean)
        ? `node scripts/build-training-dataset.mjs --fixture ${args.dataset} --mask-codec png --materialize-png-masks --write-artifact-manifest --write-codec-sidecars --validate-codec-roundtrip --json`
        : `node scripts/build-training-dataset.mjs --fixture ${args.dataset} --mask-codec binary --materialize-binary-masks --write-artifact-manifest --validate-strict-alignment --json`,
    pngMaskCodecReadiness: {
      pngAlphaMaskCodecReady: pngMaskChecks.every(Boolean),
      pngMaskSidecarReady: pngMaskChecks.every(Boolean),
      pngMaskRoundTripReady: pngRoundTripReady,
      maskFormatPreferenceReadiness: pngMaskChecks.every(Boolean) ? 'ready' : 'fallback',
      recommendedNextCommand: pngMaskChecks.every(Boolean)
        ? `node scripts/build-training-dataset.mjs --fixture ${args.dataset} --mask-codec png --materialize-png-masks --write-artifact-manifest --write-codec-sidecars --validate-codec-roundtrip --json`
        : `node scripts/build-training-dataset.mjs --fixture ${args.dataset} --mask-codec binary --materialize-binary-masks --write-artifact-manifest --json`,
    },
    nextRealisticSyntheticTrainingCommand:
      errors.length === 0
        ? `node scripts/train-lightweight-segmentation.mjs --dataset ${args.dataset} --regions ${REGIONS.filter((region) => regionCoverage[region] > 0).join(',')} --classifier ${args.classifier} --out ./tmp/models/makeup-segmentation-lightweight-classifier/realistic-synthetic-v0 --evaluate --strict --json`
        : null,
    regionCoverageGuidance:
      errors.length === 0 && warnings.some((warning) => warning.startsWith('region has no samples:'))
        ? 'Coverage warnings do not block baseline training. Train covered regions with --regions, or add more reviewed samples for missing regions.'
        : null,
    packageFingerprint: checksumText(stableStringify(trainingPackage)),
    ...sourceImageReadiness,
  };

  if (args.exportRunPackage) await writeJsonAbsolute(args.exportRunPackage, runPackage);
  if (args.exportQuarantine) await writeJsonAbsolute(args.exportQuarantine, quarantine);
  if (args.exportEvaluation) await writeJsonAbsolute(args.exportEvaluation, evaluationReport);
  if (args.exportModelManifest) await writeJsonAbsolute(args.exportModelManifest, modelManifest);

  if (args.json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else {
    process.stdout.write([
      `dataset id: ${result.datasetId}`,
      `dataset version: ${result.datasetVersion}`,
      `total samples: ${result.totalSamples}`,
      `train / validation / test: ${splitCounts.train} / ${splitCounts.validation} / ${splitCounts.test}`,
      `region coverage: ${REGIONS.map((region) => `${region}:${regionCoverage[region]}`).join(', ')}`,
      `quality average: ${result.qualitySummary.average}`,
      `checksum status: ${result.checksumStatus}`,
      `artifact status: ${result.artifactStatus}`,
      `split status: ${result.splitStatus}`,
      `batch count: ${result.batchIteratorSummary.batchCount}`,
      `trainer config: ${result.trainerConfigSummary}`,
      `runtime plan: ${result.runtimePlanSummary}`,
      `quarantine: ${quarantineSummary.failedSampleCount} failed`,
      `evaluation: ${result.evaluationSummary}`,
      `model artifact: ${result.modelArtifactSummary}`,
      `training run package: ${result.trainingRunPackageSummary}`,
      ...warnings.map((warning) => `warning: ${warning}`),
      ...errors.map((error) => `error: ${error}`),
      ...(result.regionCoverageGuidance ? [`next: ${result.regionCoverageGuidance}`] : []),
      ...(result.nextBaselineTrainingCommand ? [`next command: ${result.nextBaselineTrainingCommand}`] : []),
      ...(result.nextLightweightTrainingCommand ? [`next lightweight command: ${result.nextLightweightTrainingCommand}`] : []),
      ...(result.nextExportModelPackageCommand ? [`next export command: ${result.nextExportModelPackageCommand}`] : []),
      `readiness: ${readiness}`,
    ].join('\n') + '\n');
  }

  if (args.strict && errors.length > 0) process.exitCode = 1;
};

run().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
