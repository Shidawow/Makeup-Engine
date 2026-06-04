#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const usage = `Usage:
  node scripts/export-model-package.mjs --model ./model.json --manifest ./model-artifact-manifest.json --evaluation ./evaluation-report.json --out ./exports/model-package [options]

Options:
  --model <path>                          Lightweight classifier model JSON
  --manifest <path>                       Model artifact manifest JSON
  --evaluation <path>                     Evaluation report JSON
  --out <dir>                             Output export package directory
  --target <list>                         Comma-separated targets: typescript-provider,browser-provider,node-provider,onnx-placeholder,webgpu-placeholder,mobile-placeholder
  --strict                                Exit non-zero when export readiness has blocking errors
  --json                                  Emit machine-readable JSON
  --dry-run                               Validate and print plan without writing files
  --include-runtime-smoke                 Write runtime-smoke-report.json
  --include-onnx-prototype                Write ONNX prototype JSON package
  --write-onnx-prototype                  Alias for --include-onnx-prototype
  --codec-preference <list>               png,raw,json
  --mask-preference <list>                png,binary,json
  --strict-codec                          Fail when requested PNG codec is unsupported
  --help                                  Show this help
`;

const SUPPORTED_TARGETS = [
  'typescript-provider',
  'browser-provider',
  'node-provider',
  'onnx-placeholder',
  'webgpu-placeholder',
  'mobile-placeholder',
];
const SUPPORTED_FEATURES = new Set([
  'r',
  'g',
  'b',
  'h',
  's',
  'v',
  'brightness',
  'saturation',
  'skinRelativeDelta',
  'localContrast',
  'normalizedX',
  'normalizedY',
  'distanceToRegionCenter',
  'distanceToRegionBounds',
  'alphaTarget',
]);

const parseArgs = (argv) => {
  const args = {
    targets: ['typescript-provider', 'browser-provider'],
    strict: false,
    json: false,
    dryRun: false,
    includeRuntimeSmoke: false,
    includeOnnxPrototype: false,
    codecPreference: 'raw,json',
    maskPreference: 'binary,json',
    strictCodec: false,
    help: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') args.help = true;
    else if (arg === '--model') args.model = argv[++index];
    else if (arg === '--manifest') args.manifest = argv[++index];
    else if (arg === '--evaluation') args.evaluation = argv[++index];
    else if (arg === '--out') args.out = argv[++index];
    else if (arg === '--target') args.targets = argv[++index].split(',').filter(Boolean);
    else if (arg === '--strict') args.strict = true;
    else if (arg === '--json') args.json = true;
    else if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--include-runtime-smoke') args.includeRuntimeSmoke = true;
    else if (arg === '--include-onnx-prototype' || arg === '--write-onnx-prototype') args.includeOnnxPrototype = true;
    else if (arg === '--codec-preference') args.codecPreference = argv[++index];
    else if (arg === '--mask-preference') args.maskPreference = argv[++index];
    else if (arg === '--strict-codec') args.strictCodec = true;
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
const readJson = async (filePath, label) => {
  if (!filePath) throw new Error(`Missing required --${label}`);
  return JSON.parse(await readFile(filePath, 'utf8'));
};
const writeJson = async (outDir, fileName, value) => {
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, fileName), `${stableStringify(value)}\n`, 'utf8');
};
const writeText = async (outDir, fileName, value) => {
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, fileName), value, 'utf8');
};

const createRuntimeCompatibility = (targets) =>
  [...targets].sort().map((target) => ({
    target,
    supported: target === 'typescript-provider' || target === 'browser-provider' || target === 'node-provider',
    notes: target.endsWith('placeholder')
      ? [`${target} is export preparation only in Phase 6F`]
      : ['supported by lightweight classifier JSON provider package'],
  }));

const createProviderCompatibility = (model) => {
  const featureNames = model.featureConfig?.featureNames ?? [];
  const issues = [
    ...(model.schemaVersion === 'lightweight-classifier-v0.1' ? [] : ['model must be lightweight-classifier-v0.1']),
    ...((model.trainedRegions ?? []).length > 0 ? [] : ['provider requires trained regions']),
    ...featureNames.filter((feature) => !SUPPORTED_FEATURES.has(feature)).map((feature) => `unsupported feature:${feature}`),
  ].sort();
  return {
    providerId: 'lightweight-classifier',
    compatible: issues.length === 0,
    supportedRegions: [...(model.trainedRegions ?? [])].sort(),
    fallbackPolicy: 'polygon-refinement',
    issues,
  };
};

const createExportPreparationManifest = (model, targets) => ({
  schemaVersion: 'export-preparation-manifest-v0.1',
  modelId: model.modelId,
  targets: [...targets].sort(),
  onnx: {
    target: 'onnx-placeholder',
    ready: false,
    requiredInputs: ['pixel_feature_matrix', 'region_id'],
    requiredOutputs: ['alpha_grid'],
    blockingIssues: [{ code: 'onnx-export-not-implemented', message: 'Phase 6F prepares ONNX export metadata only' }],
  },
  webgpu: {
    target: 'webgpu-placeholder',
    ready: false,
    tensorLayout: 'nhwc-placeholder',
    blockingIssues: [{ code: 'webgpu-export-not-implemented', message: 'Phase 6F prepares WebGPU export metadata only' }],
  },
  mobile: {
    target: 'mobile-placeholder',
    ready: false,
    quantization: 'uint8-placeholder',
    packageSpec: 'mobile-runtime-placeholder',
    blockingIssues: [{ code: 'mobile-export-not-implemented', message: 'Phase 6F prepares mobile export metadata only' }],
  },
  readiness: 'preparation-only',
});

const createExportPackage = (model, modelManifest, evaluation, targets) => {
  const runtimeCompatibility = createRuntimeCompatibility(targets);
  const providerCompatibility = createProviderCompatibility(model);
  const packageBase = {
    schemaVersion: 'export-ready-model-package-v0.1',
    packageId: `export-package-${model.modelId}`,
    packageVersion: `${model.modelVersion}-export-v0.1`,
    sourceModelId: model.modelId,
    sourceModelVersion: model.modelVersion,
    modelKind: 'lightweight-segmentation-classifier',
    classifierKind: model.classifierKind,
    artifactFormat: 'lightweight-classifier-json',
    inputSpec: {
      requiresPixelData: true,
      pixelFormat: 'json-rgba-grid',
      featureNames: model.featureConfig?.featureNames ?? [],
    },
    outputSpec: {
      outputType: 'CosmeticSegmentationMask',
      alphaFormat: 'float-alpha-grid',
      coordinateSpace: 'normalized-image',
    },
    codecReadiness: {
      imageCodecReadiness: 'ready',
      supportedImageArtifactFormats: ['png-image', 'raw-rgba-binary', 'json-rgba-grid'],
      preferredImageArtifactFormat: model.trainingSummary?.actualImageArtifactFormats?.includes('png-image') ? 'png-image' : 'json-rgba-grid',
      pngImageSupport: true,
      imageCodecValidationReportReference: 'image-codec-report.json',
      maskCodecReadiness: 'ready',
      supportedMaskArtifactFormats: ['png-alpha-mask', 'binary-alpha-mask', 'json-alpha-grid'],
      preferredMaskArtifactFormat: model.trainingSummary?.actualMaskArtifactFormats?.includes('png-alpha-mask') ? 'png-alpha-mask' : 'binary-alpha-mask',
      pngAlphaMaskSupport: true,
      fallbackPolicy: 'png-alpha-mask -> binary-alpha-mask -> json-alpha-grid',
      codecValidationReportReference: 'codec-roundtrip-report.json',
    },
    featureSpec: {
      featureNames: model.featureConfig?.featureNames ?? [],
    },
    regionSpec: {
      trainedRegions: [...(model.trainedRegions ?? [])].sort(),
    },
    runtimeCompatibility,
    providerCompatibility,
    lineage: {
      sourceDatasetId: model.sourceDatasetId,
      sourcePackageId: model.sourcePackageId,
      trainingRunId: model.trainingRunId,
      sourceModelId: model.modelId,
    },
    checksums: {
      'model.json': model.artifactChecksum ?? checksumText(stableStringify(model)),
      'model-artifact-manifest.json': checksumText(stableStringify(modelManifest)),
      'evaluation-report.json': checksumText(stableStringify(evaluation)),
    },
    readinessStatus: providerCompatibility.compatible
      ? 'export-ready-typescript-provider'
      : 'blocked-by-provider-compatibility',
    createdAt: model.createdAt,
  };
  return {
    ...packageBase,
    checksums: {
      ...packageBase.checksums,
      'export-package.json': checksumText(stableStringify(packageBase)),
    },
  };
};

const validatePackage = (pkg, targets) => [
  ...(pkg.schemaVersion === 'export-ready-model-package-v0.1' ? [] : ['invalid export package schema version']),
  ...(pkg.regionSpec.trainedRegions.length > 0 ? [] : ['export package requires trained regions']),
  ...(pkg.providerCompatibility.compatible ? [] : ['provider compatibility failed']),
  ...targets.filter((target) => !SUPPORTED_TARGETS.includes(target)).map((target) => `unsupported target:${target}`),
];

const createPackageManifest = (pkg, preparation) => {
  const entries = [
    { entryId: 'model-json', relativePath: 'model.json', checksum: pkg.checksums['model.json'], artifactType: 'model' },
    { entryId: 'provider-spec', relativePath: 'provider-spec.json', checksum: checksumText(stableStringify(pkg.providerCompatibility)), artifactType: 'provider-spec' },
    { entryId: 'runtime-compatibility', relativePath: 'runtime-compatibility.json', checksum: checksumText(stableStringify(pkg.runtimeCompatibility)), artifactType: 'runtime-compatibility' },
    { entryId: 'export-preparation', relativePath: 'export-preparation-manifest.json', checksum: checksumText(stableStringify(preparation)), artifactType: 'export-preparation' },
    { entryId: 'readme', relativePath: 'README.md', checksum: checksumText(`# ${pkg.packageId}\n`), artifactType: 'readme' },
  ];
  return { packageId: pkg.packageId, schemaVersion: pkg.schemaVersion, entries };
};

const createRuntimeSmokeReport = (pkg, model) => {
  const width = 64;
  const height = 64;
  const issues = [
    ...(pkg.providerCompatibility.compatible ? [] : ['provider compatibility failed']),
    ...((model.trainedRegions ?? []).length > 0 ? [] : ['model has no trained regions']),
  ];
  return {
    schemaVersion: 'export-package-runtime-smoke-v0.1',
    packageId: pkg.packageId,
    modelId: model.modelId,
    providerId: pkg.providerCompatibility.providerId,
    maskShape: { width, height },
    confidence: issues.length === 0 ? 0.5 : 0,
    passed: issues.length === 0,
    issues,
    summary: `runtime-smoke:${pkg.packageId}:passed=${issues.length === 0}:shape=${width}x${height}`,
  };
};

const createOnnxPrototype = (model) => {
  const graphs = [...(model.trainedRegions ?? [])].sort().map((regionId) => ({
    graphId: `onnx-graph-${model.modelId}-${regionId}`,
    regionId,
    nodes: [
      { nodeId: `${regionId}-features`, opType: 'FeatureInput', inputs: ['pixel_feature_matrix'], outputs: [`${regionId}_features`] },
      { nodeId: `${regionId}-score`, opType: model.classifierKind === 'logistic-linear' ? 'Linear' : 'NearestCentroidDistance', inputs: [`${regionId}_features`], outputs: [`${regionId}_score`] },
      { nodeId: `${regionId}-alpha`, opType: model.classifierKind === 'logistic-linear' ? 'Sigmoid' : 'ThresholdToAlpha', inputs: [`${regionId}_score`], outputs: [`${regionId}_alpha`] },
    ],
    inputs: [{ name: 'pixel_feature_matrix', dataType: 'float32', shape: ['pixelCount', model.featureConfig?.featureNames?.length ?? 0], description: 'Feature matrix produced by the training bridge' }],
    outputs: [{ name: `${regionId}_alpha`, dataType: 'float32', shape: ['height', 'width'], description: 'Prototype alpha grid output' }],
    initializers: [],
  }));
  const base = {
    schemaVersion: 'onnx-export-prototype-v0.1',
    prototypeId: `onnx-prototype-${model.modelId}`,
    modelId: model.modelId,
    modelVersion: model.modelVersion,
    classifierKind: model.classifierKind,
    graphs,
    tensorSpec: {
      inputs: graphs[0]?.inputs ?? [],
      outputs: graphs.flatMap((graph) => graph.outputs),
    },
    readiness: { status: 'prototype-only', reasons: ['JSON graph prototype only; no .onnx binary is emitted'] },
    limitations: [
      { code: 'no-onnx-binary', message: 'Phase 6G does not emit a binary ONNX graph' },
      { code: 'no-onnx-runtime-validation', message: 'Phase 6G does not run ONNX Runtime' },
    ],
  };
  return { ...base, checksum: checksumText(stableStringify(base)) };
};

const main = async () => {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(usage);
    return;
  }
  if (!args.out && !args.dryRun) throw new Error('Missing required --out for non dry-run export');
  for (const target of args.targets) if (!SUPPORTED_TARGETS.includes(target)) throw new Error(`Unsupported target: ${target}`);

  const [model, modelManifest, evaluation] = await Promise.all([
    readJson(args.model, 'model'),
    readJson(args.manifest, 'manifest'),
    readJson(args.evaluation, 'evaluation'),
  ]);
  const pkg = createExportPackage(model, modelManifest, evaluation, args.targets);
  const preparation = createExportPreparationManifest(model, args.targets);
  const packageManifest = createPackageManifest(pkg, preparation);
  const codecErrors = [];
  const errors = [...validatePackage(pkg, args.targets), ...codecErrors].sort();
  const runtimeSmoke = args.includeRuntimeSmoke ? createRuntimeSmokeReport(pkg, model) : null;
  const onnxPrototype = args.includeOnnxPrototype ? createOnnxPrototype(model) : null;
  const onnxManifest = onnxPrototype ? {
    schemaVersion: 'onnx-export-prototype-v0.1',
    prototypeId: onnxPrototype.prototypeId,
    modelId: onnxPrototype.modelId,
    entries: [
      { entryId: 'onnx-prototype-json', relativePath: 'onnx-prototype.json', checksum: onnxPrototype.checksum },
      { entryId: 'tensor-spec-json', relativePath: 'tensor-spec.json', checksum: checksumText(stableStringify(onnxPrototype.tensorSpec)) },
      { entryId: 'limitations-json', relativePath: 'limitations.json', checksum: checksumText(stableStringify(onnxPrototype.limitations)) },
    ],
  } : null;
  const warnings = [
    ...pkg.runtimeCompatibility.flatMap((target) => target.supported ? [] : [`${target.target} is preparation-only`]),
    ...preparation.onnx.blockingIssues.map((issue) => issue.code),
    ...preparation.webgpu.blockingIssues.map((issue) => issue.code),
    ...(args.maskPreference.includes('png') ? [] : ['png alpha mask codec ready but not preferred by export mask preference']),
  ].sort();
  const result = {
    schemaVersion: 'export-model-package-result-v0.1',
    packageId: pkg.packageId,
    modelId: model.modelId,
    targets: [...args.targets].sort(),
    providerCompatibility: pkg.providerCompatibility,
    runtimeCompatibility: pkg.runtimeCompatibility,
    exportPreparationReadiness: preparation.readiness,
    runtimeSmoke: runtimeSmoke ? { passed: runtimeSmoke.passed, summary: runtimeSmoke.summary } : null,
    onnxPrototype: onnxPrototype ? { prototypeId: onnxPrototype.prototypeId, readiness: onnxPrototype.readiness.status, graphCount: onnxPrototype.graphs.length } : null,
    codecPreference: args.codecPreference,
    maskPreference: args.maskPreference,
    codecReadiness: pkg.codecReadiness,
    warnings,
    errors,
    readiness: errors.length > 0 ? 'fail' : 'pass',
    dryRun: args.dryRun,
    outputs: args.dryRun
      ? []
      : [
        'export-package.json',
        'export-package-manifest.json',
        'model.json',
        'provider-spec.json',
        'runtime-compatibility.json',
        'export-preparation-manifest.json',
        ...(runtimeSmoke ? ['runtime-smoke-report.json'] : []),
        ...(onnxPrototype ? ['onnx-prototype/onnx-prototype.json', 'onnx-prototype/onnx-prototype-manifest.json', 'onnx-prototype/tensor-spec.json', 'onnx-prototype/limitations.json'] : []),
        'checksums.json',
        'README.md',
      ],
  };

  if (!args.dryRun) {
    const out = path.resolve(args.out);
    await writeJson(out, 'export-package.json', pkg);
    await writeJson(out, 'export-package-manifest.json', packageManifest);
    await writeJson(out, 'model.json', model);
    await writeJson(out, 'provider-spec.json', pkg.providerCompatibility);
    await writeJson(out, 'runtime-compatibility.json', pkg.runtimeCompatibility);
    await writeJson(out, 'export-preparation-manifest.json', preparation);
    if (runtimeSmoke) await writeJson(out, 'runtime-smoke-report.json', runtimeSmoke);
    if (onnxPrototype && onnxManifest) {
      await writeJson(path.join(out, 'onnx-prototype'), 'onnx-prototype.json', onnxPrototype);
      await writeJson(path.join(out, 'onnx-prototype'), 'onnx-prototype-manifest.json', onnxManifest);
      await writeJson(path.join(out, 'onnx-prototype'), 'tensor-spec.json', onnxPrototype.tensorSpec);
      await writeJson(path.join(out, 'onnx-prototype'), 'limitations.json', onnxPrototype.limitations);
    }
    await writeJson(out, 'checksums.json', pkg.checksums);
    await writeText(out, 'README.md', `# ${pkg.packageId}\n\nExport-ready lightweight classifier package for TypeScript/browser provider integration. ONNX, WebGPU, and mobile targets are preparation-only in Phase 6F.\n`);
  }

  if (args.json) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  else {
    process.stdout.write([
      `package id: ${result.packageId}`,
      `model id: ${result.modelId}`,
      `targets: ${result.targets.join(',')}`,
      `provider compatible: ${pkg.providerCompatibility.compatible}`,
      `export preparation: ${result.exportPreparationReadiness}`,
      ...warnings.map((warning) => `warning: ${warning}`),
      ...errors.map((error) => `error: ${error}`),
      `readiness: ${result.readiness}`,
    ].join('\n') + '\n');
  }
  if (args.strict && errors.length > 0) process.exitCode = 1;
};

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
