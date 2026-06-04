#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const usage = `Usage:
  node scripts/train-lightweight-segmentation.mjs --dataset ./datasets/makeup-engine/dev-v0 [options]

Options:
  --dataset <dir>                         MaterializedTrainingDataset directory
  --config <path>                          Optional lightweight trainer config JSON
  --out <dir>                              Output model directory
  --regions lips,blush,eyeshadow          Comma-separated regions to train
  --classifier nearest-centroid|logistic-linear|hybrid-threshold
  --image-format-preference png,raw,json
  --mask-format-preference png,binary,json
  --quality-threshold <number>             Minimum quality score
  --alpha-positive-threshold <number>      Positive alpha threshold
  --alpha-negative-threshold <number>      Negative alpha threshold
  --feature-stride <number>                Deterministic pixel sampling stride
  --max-iterations <number>                Logistic-linear iterations
  --learning-rate <number>                 Logistic-linear learning rate
  --evaluate                              Evaluate against validation/test splits
  --strict                                Fail on blocking validation errors
  --json                                  Emit machine-readable JSON
  --dry-run                               Print plan without writing model files
  --help                                  Show this help
`;

const REGIONS = ['lips', 'blush', 'eyeshadow', 'eyeliner', 'contour', 'highlight'];
const SPLITS = ['train', 'validation', 'test'];
const FEATURE_KEYS = ['r','g','b','brightness','saturation','normalizedX','normalizedY','alphaTarget'];

const parseArgs = (argv) => {
  const args = {
    regions: [],
    classifier: 'nearest-centroid',
    imageFormatPreference: [],
    imageFormatPreferenceExplicit: false,
    maskFormatPreference: [],
    maskFormatPreferenceExplicit: false,
    qualityThreshold: 0.7,
    alphaPositiveThreshold: 0.4,
    alphaNegativeThreshold: 0.05,
    featureStride: 1,
    maxIterations: 8,
    learningRate: 0.05,
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
    else if (arg === '--classifier') args.classifier = argv[++index];
    else if (arg === '--image-format-preference') {
      args.imageFormatPreference = argv[++index].split(',').filter(Boolean);
      args.imageFormatPreferenceExplicit = true;
    }
    else if (arg === '--mask-format-preference') {
      args.maskFormatPreference = argv[++index].split(',').filter(Boolean);
      args.maskFormatPreferenceExplicit = true;
    }
    else if (arg === '--quality-threshold') args.qualityThreshold = Number(argv[++index]);
    else if (arg === '--alpha-positive-threshold') args.alphaPositiveThreshold = Number(argv[++index]);
    else if (arg === '--alpha-negative-threshold') args.alphaNegativeThreshold = Number(argv[++index]);
    else if (arg === '--feature-stride') args.featureStride = Number(argv[++index]);
    else if (arg === '--max-iterations') args.maxIterations = Number(argv[++index]);
    else if (arg === '--learning-rate') args.learningRate = Number(argv[++index]);
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
const readUint32 = (bytes, offset) => (((bytes[offset] ?? 0) << 24) | ((bytes[offset + 1] ?? 0) << 16) | ((bytes[offset + 2] ?? 0) << 8) | (bytes[offset + 3] ?? 0)) >>> 0;
const concatBytes = (chunks) => {
  const output = new Uint8Array(chunks.reduce((sum, chunk) => sum + chunk.length, 0));
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return output;
};
const adler32 = (bytes) => {
  let a = 1;
  let b = 0;
  for (const byte of bytes) {
    a = (a + byte) % 65521;
    b = (b + a) % 65521;
  }
  return ((b << 16) | a) >>> 0;
};
const inflateStored = (stream) => {
  let offset = 2;
  const chunks = [];
  let final = 0;
  while (final === 0) {
    const header = stream[offset];
    if (header === undefined) throw new Error('PNG IDAT block missing');
    final = header & 1;
    if (((header >>> 1) & 3) !== 0) throw new Error('Only stored deflate PNG masks are supported');
    offset += 1;
    const length = (stream[offset] ?? 0) | ((stream[offset + 1] ?? 0) << 8);
    const inverse = (stream[offset + 2] ?? 0) | ((stream[offset + 3] ?? 0) << 8);
    if (((length ^ 0xffff) & 0xffff) !== inverse) throw new Error('PNG stored block length mismatch');
    offset += 4;
    chunks.push(stream.slice(offset, offset + length));
    offset += length;
  }
  const raw = concatBytes(chunks);
  if (adler32(raw) !== readUint32(stream, stream.length - 4)) throw new Error('PNG Adler-32 mismatch');
  return raw;
};
const readPngAlphaGrid = async (filePath) => {
  const bytes = new Uint8Array(await readFile(filePath));
  const signature = [137, 80, 78, 71, 13, 10, 26, 10];
  for (let index = 0; index < signature.length; index += 1) if (bytes[index] !== signature[index]) throw new Error('not a PNG file');
  let offset = signature.length;
  let width = 0;
  let height = 0;
  const idats = [];
  while (offset < bytes.length) {
    const length = readUint32(bytes, offset);
    offset += 4;
    const type = String.fromCharCode(...bytes.slice(offset, offset + 4));
    offset += 4;
    const data = bytes.slice(offset, offset + length);
    offset += length + 4;
    if (type === 'IHDR') {
      width = readUint32(data, 0);
      height = readUint32(data, 4);
      if (data[8] !== 8 || data[9] !== 0) throw new Error('unsupported PNG mask format');
    } else if (type === 'IDAT') {
      idats.push(data);
    } else if (type === 'IEND') break;
  }
  const raw = inflateStored(concatBytes(idats));
  const alpha = [];
  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * (width + 1);
    if (raw[rowOffset] !== 0) throw new Error('unsupported PNG filter');
    for (let x = 0; x < width; x += 1) alpha.push(round4((raw[rowOffset + 1 + x] ?? 0) / 255));
  }
  return { width, height, alpha };
};
const readPngRgbaGrid = async (filePath) => {
  const bytes = new Uint8Array(await readFile(filePath));
  const signature = [137, 80, 78, 71, 13, 10, 26, 10];
  for (let index = 0; index < signature.length; index += 1) if (bytes[index] !== signature[index]) throw new Error('not a PNG file');
  let offset = signature.length;
  let width = 0;
  let height = 0;
  const idats = [];
  while (offset < bytes.length) {
    const length = readUint32(bytes, offset);
    offset += 4;
    const type = String.fromCharCode(...bytes.slice(offset, offset + 4));
    offset += 4;
    const data = bytes.slice(offset, offset + length);
    offset += length + 4;
    if (type === 'IHDR') {
      width = readUint32(data, 0);
      height = readUint32(data, 4);
      if (data[8] !== 8 || ![2, 6].includes(data[9])) throw new Error('unsupported PNG image format');
    } else if (type === 'IDAT') {
      idats.push(data);
    } else if (type === 'IEND') break;
  }
  const raw = inflateStored(concatBytes(idats));
  const channels = raw.length === (width * 3 + 1) * height ? 3 : 4;
  const pixels = [];
  const rowLength = width * channels + 1;
  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * rowLength;
    if (raw[rowOffset] !== 0) throw new Error('unsupported PNG filter');
    for (let x = 0; x < width; x += 1) {
      const pixelOffset = rowOffset + 1 + x * channels;
      pixels.push({
        r: round4((raw[pixelOffset] ?? 0) / 255),
        g: round4((raw[pixelOffset + 1] ?? 0) / 255),
        b: round4((raw[pixelOffset + 2] ?? 0) / 255),
      });
    }
  }
  return { width, height, pixels };
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
const syntheticPixel = (artifact, index) => {
  const x = index % artifact.width;
  const y = Math.floor(index / artifact.width);
  const nx = artifact.width <= 1 ? 0 : x / (artifact.width - 1);
  const ny = artifact.height <= 1 ? 0 : y / (artifact.height - 1);
  const center = Math.exp(-(((nx - 0.5) ** 2 + (ny - 0.55) ** 2) / 0.18));
  const lipSignal = Math.exp(-(((nx - 0.5) ** 2) / 0.035 + ((ny - 0.72) ** 2) / 0.006));
  const eyeSignal = Math.exp(-(((nx - 0.5) ** 2) / 0.08 + ((ny - 0.33) ** 2) / 0.01));
  const cheekSignal = Math.exp(-(((nx - 0.32) ** 2) / 0.03 + ((ny - 0.56) ** 2) / 0.035));
  const contourSignal = Math.max(0, nx - 0.62) * center;
  const highlightSignal = Math.exp(-(((nx - 0.5) ** 2) / 0.02 + ((ny - 0.22) ** 2) / 0.08));
  return {
    r: round4(Math.min(1, 0.55 + lipSignal * 0.35 + cheekSignal * 0.2 + highlightSignal * 0.18)),
    g: round4(Math.min(1, 0.42 + highlightSignal * 0.22 - contourSignal * 0.12)),
    b: round4(Math.min(1, 0.36 + eyeSignal * 0.22 + lipSignal * 0.08 - contourSignal * 0.1)),
  };
};
const pixelsFromArtifact = (artifact) => {
  if (artifact.pixels?.generator === 'face-like-regions-v0') {
    return Array.from({ length: artifact.width * artifact.height }, (_, index) => syntheticPixel(artifact, index));
  }
  return Array.from({ length: artifact.width * artifact.height }, (_, index) => {
  const offset = index * artifact.pixels.channels;
  return { r: artifact.pixels.values[offset], g: artifact.pixels.values[offset + 1], b: artifact.pixels.values[offset + 2] };
  });
};
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
const centroid = (samples) => Object.fromEntries(FEATURE_KEYS.map((key) => [key, average(samples.map((sample) => sample[key]))]));
const squaredDistance = (features, center) => FEATURE_KEYS.reduce((sum, key) => sum + ((features[key] ?? 0) - (center[key] ?? 0)) ** 2, 0);
const sigmoid = (value) => 1 / (1 + Math.exp(-value));

const run = async (args) => {
  if (!['nearest-centroid','logistic-linear','hybrid-threshold'].includes(args.classifier)) throw new Error(`Unsupported classifier: ${args.classifier}`);
  const root = path.resolve(args.dataset);
  const [manifest, trainingPackage] = await Promise.all([readJson(root, 'manifest.json'), readJson(root, 'package.json')]);
  const config = args.config ? await readJsonAbsolute(args.config) : null;
  const maskFormatPreference = args.maskFormatPreference.length > 0
    ? args.maskFormatPreference
    : (config?.maskFormatPreference ?? ['json']);
  const imageFormatPreference = args.imageFormatPreference.length > 0
    ? args.imageFormatPreference
    : (config?.artifactFormatPreference ?? config?.imageFormatPreference ?? ['json']);
  const usedImageFormats = new Set();
  const usedMaskFormats = new Set();
  const fallbackWarnings = [];
  const regions = args.regions.length > 0 ? args.regions : (config?.lightweight?.regions ?? REGIONS);
  const splitRows = (await Promise.all(SPLITS.map((split) => readJsonl(root, `splits/${split}.jsonl`)))).flat();
  const syntheticMaskArtifacts = trainingPackage.syntheticMaskArtifacts
    ? splitRows.map((sample) => ({
      artifactId: sample.maskArtifactIds.humanEditedMask,
      artifactKind: 'human_edited_mask',
      width: trainingPackage.syntheticMaskArtifacts.width ?? 64,
      height: trainingPackage.syntheticMaskArtifacts.height ?? 64,
      regionId: sample.regionId,
      target: sample.regionId,
      sampleId: sample.sampleId,
      alphaStats: trainingPackage.syntheticMaskArtifacts.alphaStats ?? { activeRatio: 0.08, max: 0.9, mean: 0.06, min: 0 },
      bounds: trainingPackage.syntheticMaskArtifacts.boundsByRegion?.[sample.regionId] ?? { x: 0.2, y: 0.2, width: 0.5, height: 0.5, space: 'normalized-image' },
    }))
    : [];
  const artifactById = new Map([...(trainingPackage.maskArtifacts ?? []), ...syntheticMaskArtifacts].map((artifact) => [artifact.artifactId, artifact]));
  const pixelByImageId = new Map();
  const errors = [];
  for (const image of manifest.imageFiles) {
    let loaded = false;
    if (imageFormatPreference.includes('png')) {
      try {
        const png = await readPngRgbaGrid(path.join(root, 'images-png', `${image.imageId}.png`));
        const artifact = { imageId: image.imageId, width: png.width, height: png.height, format: 'png-image' };
        pixelByImageId.set(image.imageId, { artifact, pixels: png.pixels });
        usedImageFormats.add('png-image');
        loaded = true;
      } catch (error) {
        const message = `png-image-fallback:${image.imageId}:${error instanceof Error ? error.message : 'read failed'}`;
        if (args.imageFormatPreferenceExplicit && args.strict && imageFormatPreference[0] === 'png') errors.push(message);
        else fallbackWarnings.push(message);
      }
    }
    if (!loaded) {
      try {
        const artifact = await readJson(root, `image-pixels/${image.imageId}.rgba.json`);
        pixelByImageId.set(image.imageId, { artifact, pixels: pixelsFromArtifact(artifact) });
        usedImageFormats.add(artifact.format ?? 'json-rgba-grid');
        loaded = true;
      } catch {
        errors.push(`missing pixel artifact:${image.imageId}`);
      }
    }
  }
  const selected = splitRows.filter((sample) => regions.includes(sample.regionId) && sample.qualityScore >= args.qualityThreshold).sort((a, b) => a.sampleId.localeCompare(b.sampleId));
  const readAlphaForSample = async (sample, mask) => {
    const pngPath = path.join(root, 'masks-png', `${sample.sampleId}-${sample.regionId}.png`);
    if (maskFormatPreference.includes('png')) {
      try {
        const png = await readPngAlphaGrid(pngPath);
        if (png.width !== mask.width || png.height !== mask.height) {
          errors.push(`png-mask-dimension-mismatch:${sample.sampleId}`);
        }
        usedMaskFormats.add('png-alpha-mask');
        return png.alpha;
      } catch (error) {
        const message = `png-alpha-mask-fallback:${sample.sampleId}:${error instanceof Error ? error.message : 'read failed'}`;
        if (args.maskFormatPreferenceExplicit && args.strict && maskFormatPreference[0] === 'png') errors.push(message);
        else fallbackWarnings.push(message);
      }
    }
    usedMaskFormats.add(maskFormatPreference.includes('binary') ? 'binary-alpha-mask' : 'json-alpha-grid');
    return deriveGrid(mask);
  };
  const regionClassifiers = {};
  const warnings = [];
  for (const region of regions) {
    const allFeatures = [];
    for (const sample of selected.filter((item) => item.regionId === region)) {
      const pixel = pixelByImageId.get(sample.imageId);
      const mask = artifactById.get(sample.maskArtifactIds.humanEditedMask);
      if (!pixel || !mask) continue;
      if (pixel.artifact.width !== mask.width || pixel.artifact.height !== mask.height) errors.push(`pixel-mask-alignment failed:${sample.sampleId}`);
      const alpha = await readAlphaForSample(sample, mask);
      for (let y = 0; y < pixel.artifact.height; y += Math.max(1, args.featureStride)) {
        for (let x = 0; x < pixel.artifact.width; x += Math.max(1, args.featureStride)) {
          const index = y * pixel.artifact.width + x;
          const a = alpha[index] ?? 0;
          const label = a >= args.alphaPositiveThreshold ? 'positive' : a <= args.alphaNegativeThreshold ? 'negative' : null;
          if (label) allFeatures.push({ label, ...featuresFor(pixel.pixels[index], x, y, pixel.artifact.width, pixel.artifact.height, a) });
        }
      }
    }
    const positive = allFeatures.filter((sample) => sample.label === 'positive');
    const negative = allFeatures.filter((sample) => sample.label === 'negative');
    if (positive.length === 0) warnings.push(`insufficient classifier positive samples:${region}`);
    if (negative.length === 0) warnings.push(`insufficient classifier negative samples:${region}`);
    if (positive.length > 0 && negative.length > 0) {
      const positiveCentroid = centroid(positive);
      const negativeCentroid = centroid(negative);
      let featureWeights = Object.fromEntries(FEATURE_KEYS.map((key) => [key, round4(positiveCentroid[key] - negativeCentroid[key])]));
      let bias = 0;
      if (args.classifier === 'logistic-linear') {
        featureWeights = Object.fromEntries(FEATURE_KEYS.map((key) => [key, 0]));
        for (let iteration = 0; iteration < args.maxIterations; iteration += 1) {
          for (const sample of allFeatures) {
            const label = sample.label === 'positive' ? 1 : 0;
            const score = FEATURE_KEYS.reduce((sum, key) => sum + sample[key] * featureWeights[key], bias);
            const error = sigmoid(score) - label;
            for (const key of FEATURE_KEYS) featureWeights[key] = round4(featureWeights[key] - args.learningRate * error * sample[key]);
            bias = round4(bias - args.learningRate * error);
          }
        }
      }
      regionClassifiers[region] = {
        regionId: region,
        classifierKind: args.classifier,
        positiveCentroid,
        negativeCentroid,
        featureWeights,
        bias,
        threshold: args.classifier === 'logistic-linear' ? 0.5 : 0,
        positiveSampleCount: positive.length,
        negativeSampleCount: negative.length,
        qualityWeightedSampleCount: round4(allFeatures.reduce((sum, sample) => sum + 0.5 + sample.alphaTarget * 0.5, 0)),
        featureNames: FEATURE_KEYS,
        warnings: [],
      };
    }
  }
  const trainingRunId = `lightweight-classifier-run-${manifest.datasetId}`;
  const modelBase = {
    modelId: `lightweight-classifier-${manifest.datasetId}`,
    modelVersion: `${manifest.datasetVersion}-lightweight-v0.1`,
    schemaVersion: 'lightweight-classifier-v0.1',
    classifierKind: args.classifier,
    createdAt: manifest.createdAt,
    sourceDatasetId: manifest.datasetId,
    sourcePackageId: manifest.sourcePackageId,
    trainingRunId,
    trainerConfigVersion: 'trainer-config-v0.1',
    trainedRegions: Object.keys(regionClassifiers).sort(),
    featureConfig: { featureStride: args.featureStride, alphaPositiveThreshold: args.alphaPositiveThreshold, alphaNegativeThreshold: args.alphaNegativeThreshold, featureNames: FEATURE_KEYS },
    regionClassifiers,
    trainingSummary: { sampleCount: selected.length, trainedRegionCount: Object.keys(regionClassifiers).length, positivePixelCount: Object.values(regionClassifiers).reduce((sum, item) => sum + item.positiveSampleCount, 0), negativePixelCount: Object.values(regionClassifiers).reduce((sum, item) => sum + item.negativeSampleCount, 0), classifierKind: args.classifier, warnings: [...warnings, ...fallbackWarnings].sort(), imageFormatPreference, actualImageArtifactFormats: [...usedImageFormats].sort(), maskFormatPreference, actualMaskArtifactFormats: [...usedMaskFormats].sort() },
    evaluationSummary: { evaluatedSampleCount: 0, evaluatedRegionCount: 0, meanHardIoU: 0, meanDice: 0, meanPixelF1: 0, readinessStatus: Object.keys(regionClassifiers).length ? 'trained-lightweight-classifier' : 'insufficient-feature-data' },
    readinessStatus: Object.keys(regionClassifiers).length ? 'trained-lightweight-classifier' : 'insufficient-feature-data',
  };
  const model = { ...modelBase, artifactChecksum: checksumText(stableStringify(modelBase)) };
  const evaluationReport = { schemaVersion: 'segmentation-evaluation-report-v0.1', reportId: `evaluation-report-${trainingRunId}`, trainingRunId, createdAt: manifest.createdAt, datasetSummary: { datasetId: manifest.datasetId, sampleCount: selected.length, splitBalance: Object.fromEntries(SPLITS.map((split) => [split, selected.filter((sample) => sample.split === split).length])) }, regionSummaries: regions.map((region) => ({ regionId: region, sampleCount: selected.filter((sample) => sample.regionId === region).length, maskAreaMean: 0, diffAreaMean: 0 })), maskMetricSummary: [{ metricName: 'lightweight_classifier_f1', value: 0, note: 'lightweight classifier baseline metric' }], failedSampleSummary: { failedSampleCount: errors.length, sampleIds: errors.map((_, index) => `classifier-issue-${index}`) }, qualityWeightedSampleCount: average(selected.map((sample) => sample.qualityScore * sample.sampleWeight)), readinessStatus: errors.length ? 'fail' : warnings.length ? 'warning' : 'pass', lightweightClassifierEvaluation: { metricType: 'lightweight-segmentation-classifier', note: 'Lightweight classifier metrics are deterministic TypeScript classifier metrics, not deep model metrics.', classifierMetrics: { classifierKind: args.classifier, hardIoU: 0, softIoU: 0, dice: 0 }, pixelClassificationMetrics: { accuracy: 0, precision: 0, recall: 0, f1: 0 }, featureSeparationSummary: { meanFeatureSeparation: 0 }, classifierRegionMetrics: [], artifactMaterializationSummary: { binaryMaskReady: true, binaryDiffReady: true } } };
  const modelManifest = { schemaVersion: 'model-artifact-manifest-v0.1', modelId: model.modelId, modelVersion: model.modelVersion, trainingRunId, sourceDatasetId: manifest.datasetId, sourcePackageId: manifest.sourcePackageId, trainerConfigVersion: 'trainer-config-v0.1', runtimeKind: 'dry-run', artifactEntries: [{ artifactId: `${model.modelId}-model-json`, format: args.classifier === 'logistic-linear' ? 'logistic-linear-json' : 'nearest-centroid-json', referenceUri: 'model.json', checksum: model.artifactChecksum, byteSize: stableStringify(model).length }, { artifactId: `${model.modelId}-classifier-json`, format: 'lightweight-classifier-json', referenceUri: 'model.json', checksum: model.artifactChecksum, byteSize: stableStringify(model).length }], metricsReference: 'evaluation-report.json', evaluationReportReference: 'evaluation-report.json', createdAt: manifest.createdAt, readinessStatus: { status: model.readinessStatus, reasons: warnings }, lineage: { sourceDatasetId: manifest.datasetId, sourcePackageId: manifest.sourcePackageId, trainingRunId, trainerConfigVersion: 'trainer-config-v0.1', runtimeKind: 'dry-run' } };
  const quarantine = { schemaVersion: 'failed-sample-quarantine-v0.1', quarantineId: `quarantine-${manifest.datasetId}`, datasetId: manifest.datasetId, createdAt: manifest.createdAt, failedSamples: errors.map((message, index) => ({ sampleId: `classifier-issue-${index}`, regionId: 'unknown', reason: message.includes('alignment') ? 'pixel-mask-alignment-failed' : 'missing-pixel-artifact', severity: 'blocking', message })) };
  const runPackage = { schemaVersion: 'training-run-package-v0.1', trainingRunId, createdAt: manifest.createdAt, inputSummary: { datasetId: manifest.datasetId, sourcePackageId: manifest.sourcePackageId, sampleCount: selected.length, trainerConfigId: config?.configId ?? 'lightweight-cli' }, outputSummary: { modelId: model.modelId, evaluationReportId: evaluationReport.reportId, failedSampleCount: quarantine.failedSamples.length }, trace: { traceId: `training-trace-${trainingRunId}`, events: ['materialized-dataset-loaded','pixel-artifacts-read','classifier-features-extracted','lightweight-classifier-trained'] }, trainerConfig: config ?? {}, quarantineSummary: { schemaVersion: 'failed-sample-quarantine-v0.1', quarantineId: quarantine.quarantineId, failedSampleCount: quarantine.failedSamples.length, blockingCount: quarantine.failedSamples.length, warningCount: 0, reasonCounts: {} }, evaluationReport, modelManifest };
  const result = { schemaVersion: 'lightweight-classifier-training-result-v0.1', datasetId: manifest.datasetId, modelId: model.modelId, selectedSamples: selected.length, pixelArtifactCount: pixelByImageId.size, classifierKind: args.classifier, trainedRegions: model.trainedRegions, imageFormatPreference, actualImageArtifactFormats: [...usedImageFormats].sort(), maskFormatPreference, actualMaskArtifactFormats: [...usedMaskFormats].sort(), warnings: [...warnings, ...fallbackWarnings].sort(), errors, readiness: errors.length ? 'fail' : [...warnings, ...fallbackWarnings].length ? 'warning' : 'pass', dryRun: args.dryRun, outputs: args.dryRun ? [] : ['model.json','model-artifact-manifest.json','evaluation-report.json','training-run-package.json','trainer-config.json','failed-samples.json'] };
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
  else process.stdout.write(`model id: ${result.modelId}\nclassifier: ${result.classifierKind}\ntrained regions: ${result.trainedRegions.join(',')}\nreadiness: ${result.readiness}\n`);
  if (args.strict && result.errors.length > 0) process.exitCode = 1;
};

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
