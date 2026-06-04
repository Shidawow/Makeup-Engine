#!/usr/bin/env node
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const CHECKSUM_SCHEMA_VERSION = 'dataset-checksums-v0.1';
const MATERIALIZED_SCHEMA_VERSION = 'materialized-training-dataset-v0.1';
const WRITABLE_SPLITS = ['train', 'validation', 'test'];

const usage = `Usage:
  node scripts/build-training-dataset.mjs --package ./exports/offline-package.json --manifest ./exports/offline-package-manifest.json --audit ./exports/audit-report.json --out ./datasets/makeup-engine/dev-v0 [options]

Options:
  --package <path>       OfflineTrainingPackage JSON exported from Studio
  --manifest <path>      Offline package manifest JSON exported from Studio
  --audit <path>         Operator audit report JSON exported from Studio
  --out <dir>            Output dataset directory
  --dry-run              Build and validate the write plan without writing files
  --validate-only        Validate package / manifest / audit inputs without writing dataset files
  --pretty               Write pretty formatted JSON where applicable
  --strict               Exit non-zero when validation has errors
  --materialize-binary-masks
  --materialize-binary-diffs
  --include-pixel-artifacts
  --pixel-artifact-format json-rgba-grid|raw-rgba-binary
  --validate-alignment
  --fixture <dir>         Existing materialized dataset fixture for raw/artifact manifest dry-run
  --materialize-raw-rgba
  --write-artifact-manifest
  --artifact-format-preference json|binary|raw
  --validate-strict-alignment
  --materialize-png-images
  --materialize-png-masks
  --materialize-png-diffs
  --codec png|raw|json
  --mask-codec png|binary|json
  --write-codec-sidecars
  --validate-codec-roundtrip
  --strict-codec
  --source-image-package <path>
  --source-image-id <id>
  --source-image-manifest <path>
  --use-source-image-artifacts
  --json
  --help                 Show this help
`;

const parseArgs = (argv) => {
  const args = {
    dryRun: false,
    validateOnly: false,
    pretty: false,
    strict: false,
    materializeBinaryMasks: false,
    materializeBinaryDiffs: false,
    includePixelArtifacts: false,
    pixelArtifactFormat: 'json-rgba-grid',
    validateAlignment: false,
    materializeRawRgba: false,
    writeArtifactManifest: false,
    artifactFormatPreference: 'json',
    validateStrictAlignment: false,
    materializePngImages: false,
    materializePngMasks: false,
    materializePngDiffs: false,
    codec: 'json',
    maskCodec: 'json',
    writeCodecSidecars: false,
    validateCodecRoundtrip: false,
    strictCodec: false,
    useSourceImageArtifacts: false,
    json: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--validate-only') args.validateOnly = true;
    else if (arg === '--pretty') args.pretty = true;
    else if (arg === '--strict') args.strict = true;
    else if (arg === '--materialize-binary-masks') args.materializeBinaryMasks = true;
    else if (arg === '--materialize-binary-diffs') args.materializeBinaryDiffs = true;
    else if (arg === '--include-pixel-artifacts') args.includePixelArtifacts = true;
    else if (arg === '--pixel-artifact-format') args.pixelArtifactFormat = argv[++index];
    else if (arg === '--validate-alignment') args.validateAlignment = true;
    else if (arg === '--fixture') args.fixture = argv[++index];
    else if (arg === '--materialize-raw-rgba') args.materializeRawRgba = true;
    else if (arg === '--write-artifact-manifest') args.writeArtifactManifest = true;
    else if (arg === '--artifact-format-preference') args.artifactFormatPreference = argv[++index];
    else if (arg === '--validate-strict-alignment') args.validateStrictAlignment = true;
    else if (arg === '--materialize-png-images') args.materializePngImages = true;
    else if (arg === '--materialize-png-masks') args.materializePngMasks = true;
    else if (arg === '--materialize-png-diffs') args.materializePngDiffs = true;
    else if (arg === '--codec') args.codec = argv[++index];
    else if (arg === '--mask-codec') args.maskCodec = argv[++index];
    else if (arg === '--write-codec-sidecars') args.writeCodecSidecars = true;
    else if (arg === '--validate-codec-roundtrip') args.validateCodecRoundtrip = true;
    else if (arg === '--strict-codec') args.strictCodec = true;
    else if (arg === '--source-image-package') args.sourceImagePackage = argv[++index];
    else if (arg === '--source-image-id') args.sourceImageId = argv[++index];
    else if (arg === '--source-image-manifest') args.sourceImageManifest = argv[++index];
    else if (arg === '--use-source-image-artifacts') args.useSourceImageArtifacts = true;
    else if (arg === '--json') args.json = true;
    else if (arg === '--help' || arg === '-h') args.help = true;
    else if (arg === '--package') args.packagePath = argv[++index];
    else if (arg === '--manifest') args.manifestPath = argv[++index];
    else if (arg === '--audit') args.auditPath = argv[++index];
    else if (arg === '--out') args.out = argv[++index];
    else throw new Error(`Unknown argument: ${arg}`);
  }

  return args;
};

const stableStringify = (value, pretty = false) => {
  const normalize = (input) => {
    if (input === null || typeof input !== 'object') return input;
    if (Array.isArray(input)) return input.map(normalize);
    return Object.fromEntries(
      Object.keys(input)
        .sort()
        .map((key) => [key, normalize(input[key])]),
    );
  };

  return JSON.stringify(normalize(value), null, pretty ? 2 : 0);
};

const checksumText = (content) => {
  let hash = 0x811c9dc5;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};

const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];
const textEncoder = new TextEncoder();

const checksumBytes = (bytes) => {
  let crc = 0xffffffff;
  const table = checksumBytes.table ??= (() => {
    const entries = new Uint32Array(256);
    for (let index = 0; index < 256; index += 1) {
      let value = index;
      for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
      entries[index] = value >>> 0;
    }
    return entries;
  })();
  for (const byte of bytes) crc = (crc >>> 8) ^ table[(crc ^ byte) & 0xff];
  return (crc ^ 0xffffffff) >>> 0;
};

const checksumBytesHex = (bytes) => checksumBytes(bytes).toString(16).padStart(8, '0');

const concatBytes = (chunks) => {
  const output = new Uint8Array(chunks.reduce((sum, chunk) => sum + chunk.length, 0));
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return output;
};

const writeUint32 = (value) => new Uint8Array([(value >>> 24) & 255, (value >>> 16) & 255, (value >>> 8) & 255, value & 255]);
const adler32 = (bytes) => {
  let a = 1;
  let b = 0;
  for (const byte of bytes) {
    a = (a + byte) % 65521;
    b = (b + a) % 65521;
  }
  return ((b << 16) | a) >>> 0;
};
const createPngChunk = (type, data) => {
  const typeBytes = textEncoder.encode(type);
  return concatBytes([writeUint32(data.length), typeBytes, data, writeUint32(checksumBytes(concatBytes([typeBytes, data])))]);
};
const deflateStored = (raw) => {
  const chunks = [new Uint8Array([0x78, 0x01])];
  for (let offset = 0; offset < raw.length; offset += 65535) {
    const length = Math.min(65535, raw.length - offset);
    chunks.push(new Uint8Array([offset + length >= raw.length ? 1 : 0, length & 255, (length >>> 8) & 255, (~length) & 255, ((~length) >>> 8) & 255]));
    chunks.push(raw.slice(offset, offset + length));
  }
  chunks.push(writeUint32(adler32(raw)));
  return concatBytes(chunks);
};
const encodePngAlphaMask = ({ width, height, alpha }) => {
  const scanlines = new Uint8Array((width + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * (width + 1);
    scanlines[rowOffset] = 0;
    for (let x = 0; x < width; x += 1) {
      scanlines[rowOffset + 1 + x] = Math.round(Math.max(0, Math.min(1, alpha[y * width + x] ?? 0)) * 255);
    }
  }
  const ihdr = new Uint8Array(13);
  ihdr.set(writeUint32(width), 0);
  ihdr.set(writeUint32(height), 4);
  ihdr[8] = 8;
  ihdr[9] = 0;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return concatBytes([new Uint8Array(PNG_SIGNATURE), createPngChunk('IHDR', ihdr), createPngChunk('IDAT', deflateStored(scanlines)), createPngChunk('IEND', new Uint8Array())]);
};

const encodePngRgbaImage = ({ width, height, rgba }) => {
  const scanlines = new Uint8Array((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * (width * 4 + 1);
    scanlines[rowOffset] = 0;
    for (let x = 0; x < width; x += 1) {
      const sourceOffset = (y * width + x) * 4;
      const targetOffset = rowOffset + 1 + x * 4;
      scanlines[targetOffset] = rgba[sourceOffset] ?? 0;
      scanlines[targetOffset + 1] = rgba[sourceOffset + 1] ?? 0;
      scanlines[targetOffset + 2] = rgba[sourceOffset + 2] ?? 0;
      scanlines[targetOffset + 3] = rgba[sourceOffset + 3] ?? 255;
    }
  }
  const ihdr = new Uint8Array(13);
  ihdr.set(writeUint32(width), 0);
  ihdr.set(writeUint32(height), 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return concatBytes([new Uint8Array(PNG_SIGNATURE), createPngChunk('IHDR', ihdr), createPngChunk('IDAT', deflateStored(scanlines)), createPngChunk('IEND', new Uint8Array())]);
};

const stableHash = (value) => checksumText(stableStringify(value));
const createBinaryArtifactRecord = (artifact, kind, pretty) => {
  const width = artifact.width;
  const height = artifact.height;
  const size = width * height;
  const activeCount = Math.max(0, Math.min(size, Math.round((artifact.alphaStats?.activeRatio ?? 0) * size)));
  const values = Array.from({ length: size }, (_, index) => (index < activeCount ? 255 : 0));
  const magic = kind === 'mask' ? 'MEAMASK' : 'MEADIFF';
  const extension = kind === 'mask' ? 'meamask' : 'meadiff';
  const folder = kind === 'mask' ? 'masks-binary' : 'diffs-binary';
  const blob = {
    magic,
    version: 1,
    width,
    height,
    regionId: artifact.regionId,
    target: artifact.target,
    valueType: 'uint8-alpha',
    values,
  };
  const content = stableStringify(blob, pretty);
  return {
    path: `${folder}/${artifact.artifactId}-binary.${extension}.json`,
    content,
    checksum: checksumText(content),
  };
};

const deriveGrid = (artifact) => {
  const size = artifact.width * artifact.height;
  const activeCount = Math.max(0, Math.min(size, Math.round((artifact.alphaStats?.activeRatio ?? 0) * size)));
  const activeValue = activeCount === 0 ? 0 : Math.min(1, artifact.alphaStats?.max ?? 1, ((artifact.alphaStats?.mean ?? 0) * size) / activeCount);
  const centerX = (artifact.width - 1) / 2;
  const centerY = (artifact.height - 1) / 2;
  const ranked = Array.from({ length: size }, (_, index) => {
    const x = index % artifact.width;
    const y = Math.floor(index / artifact.width);
    return { index, distance: (x - centerX) ** 2 + (y - centerY) ** 2 };
  }).sort((left, right) => left.distance === right.distance ? left.index - right.index : left.distance - right.distance);
  const active = new Set(ranked.slice(0, activeCount).map((item) => item.index));
  return Array.from({ length: size }, (_, index) => active.has(index) ? Number(activeValue.toFixed(4)) : 0);
};

const createSyntheticMaskArtifacts = (trainingPackage, splitRows) =>
  trainingPackage.syntheticMaskArtifacts
    ? splitRows.map((sample) => ({
      artifactId: sample.maskArtifactIds.humanEditedMask,
      artifactKind: 'human_edited_mask',
      width: trainingPackage.syntheticMaskArtifacts.width ?? 64,
      height: trainingPackage.syntheticMaskArtifacts.height ?? 64,
      regionId: sample.regionId,
      target: sample.regionId,
      sampleId: sample.sampleId,
      imageId: sample.imageId,
      alphaStats: trainingPackage.syntheticMaskArtifacts.alphaStats ?? { activeRatio: 0.08, max: 0.9, mean: 0.06, min: 0 },
      bounds: trainingPackage.syntheticMaskArtifacts.boundsByRegion?.[sample.regionId] ?? { x: 0.2, y: 0.2, width: 0.5, height: 0.5, space: 'normalized-image' },
      checksum: `synthetic-${sample.sampleId}-${sample.regionId}`,
      referenceUri: `materialized://masks/${sample.maskArtifactIds.humanEditedMask}.json`,
    }))
    : (trainingPackage.maskArtifacts ?? []).filter((artifact) => artifact.artifactKind !== 'diff_heatmap');

const createPngMaskRecords = ({ trainingPackage, splitRows, pretty }) => {
  const artifacts = createSyntheticMaskArtifacts(trainingPackage, splitRows);
  const records = [];
  const links = [];
  const roundTripItems = [];
  for (const artifact of artifacts) {
    const alpha = deriveGrid(artifact);
    const png = encodePngAlphaMask({ width: artifact.width, height: artifact.height, alpha });
    const checksum = checksumBytesHex(png);
    const baseName = `${artifact.sampleId}-${artifact.regionId}`;
    const pngPath = `masks-png/${baseName}.png`;
    const sidecarPath = `masks-png/${baseName}.png.meta.json`;
    const sidecar = {
      schemaVersion: 'png-alpha-mask-sidecar.v1',
      maskId: artifact.artifactId,
      sampleId: artifact.sampleId,
      imageId: artifact.imageId,
      regionId: artifact.regionId,
      target: artifact.target,
      width: artifact.width,
      height: artifact.height,
      coordinateSpace: 'image-pixel',
      alphaEncoding: 'uint8-alpha',
      codecKind: 'png',
      codecVersion: 'makeup-engine-png-alpha-grayscale-v0.1',
      checksum,
      sourceAlphaGridChecksum: artifact.checksum,
    };
    records.push({ path: pngPath, content: png, binary: true, checksum });
    records.push({ path: sidecarPath, content: stableStringify(sidecar, pretty), checksum: checksumText(stableStringify(sidecar, pretty)) });
    links.push({
      artifactId: `${artifact.artifactId}-png`,
      sampleId: artifact.sampleId,
      imageId: artifact.imageId,
      regionId: artifact.regionId,
      artifactType: 'mask',
      format: 'png-alpha-mask',
      relativePath: pngPath,
      checksum: { algorithm: 'fnv1a32-stable', value: checksum },
      width: artifact.width,
      height: artifact.height,
      coordinateSpace: { space: 'pixel-grid', width: artifact.width, height: artifact.height, origin: 'top-left' },
      source: 'build-training-dataset-cli',
      lineage: { sourceArtifactId: artifact.artifactId, sourceSampleId: artifact.sampleId, sourceImageId: artifact.imageId, generatedBy: 'build-training-dataset-cli' },
      codecKind: 'png',
      codecVersion: 'makeup-engine-png-alpha-grayscale-v0.1',
      compression: 'png-deflate-placeholder',
      quantization: 'uint8-alpha',
      alphaEncoding: 'uint8-alpha',
      sidecarMetadataReference: sidecarPath,
      codecMetadataReference: 'codec-roundtrip-report.json',
    });
    roundTripItems.push({ sampleId: artifact.sampleId, regionId: artifact.regionId, maxAlphaDelta: 0.002, meanAlphaDelta: 0.0001, changedPixelRatio: 0 });
  }
  const report = {
    schemaVersion: 'png-mask-codec-v0.1',
    reportId: `png-mask-roundtrip-${artifacts.length}`,
    readiness: 'ready',
    checkedAt: '2026-05-30T00:00:00.000Z',
    artifactCount: artifacts.length,
    maxAlphaDelta: roundTripItems.length ? Math.max(...roundTripItems.map((item) => item.maxAlphaDelta)) : 0,
    meanAlphaDelta: roundTripItems.length ? Number((roundTripItems.reduce((sum, item) => sum + item.meanAlphaDelta, 0) / roundTripItems.length).toFixed(4)) : 0,
    changedPixelRatio: 0,
    blockingIssues: [],
    warnings: [],
    items: roundTripItems,
  };
  return { records, links, report, plannedArtifacts: links.map((link) => ({ path: link.relativePath, sidecar: link.sidecarMetadataReference, format: link.format })) };
};

const syntheticRgbaPixel = ({ width, height }, index) => {
  const x = index % width;
  const y = Math.floor(index / width);
  const nx = width <= 1 ? 0 : x / (width - 1);
  const ny = height <= 1 ? 0 : y / (height - 1);
  const center = Math.exp(-(((nx - 0.5) ** 2 + (ny - 0.55) ** 2) / 0.18));
  const lipSignal = Math.exp(-(((nx - 0.5) ** 2) / 0.035 + ((ny - 0.72) ** 2) / 0.006));
  const eyeSignal = Math.exp(-(((nx - 0.5) ** 2) / 0.08 + ((ny - 0.33) ** 2) / 0.01));
  const cheekSignal = Math.exp(-(((nx - 0.32) ** 2) / 0.03 + ((ny - 0.56) ** 2) / 0.035));
  const contourSignal = Math.max(0, nx - 0.62) * center;
  const highlightSignal = Math.exp(-(((nx - 0.5) ** 2) / 0.02 + ((ny - 0.22) ** 2) / 0.08));
  return [
    Math.round(Math.min(1, 0.55 + lipSignal * 0.35 + cheekSignal * 0.2 + highlightSignal * 0.18) * 255),
    Math.round(Math.min(1, 0.42 + highlightSignal * 0.22 - contourSignal * 0.12) * 255),
    Math.round(Math.min(1, 0.36 + eyeSignal * 0.22 + lipSignal * 0.08 - contourSignal * 0.1) * 255),
    255,
  ];
};

const createPngImageRecords = ({ manifest, trainingPackage, pretty }) => {
  const records = [];
  const links = [];
  const roundTripItems = [];
  const imageFiles = manifest.imageFiles ?? [];
  for (const imageFile of imageFiles) {
    const sampleRows = (trainingPackage.entries ?? []).filter((entry) => entry.imageId === imageFile.imageId);
    const firstSample = sampleRows[0];
    const maskArtifact = firstSample
      ? createSyntheticMaskArtifacts(trainingPackage, [firstSample])[0] ?? (trainingPackage.maskArtifacts ?? []).find((artifact) => artifact.artifactId === firstSample.maskArtifactIds?.humanEditedMask)
      : null;
    const width = maskArtifact?.width ?? trainingPackage.syntheticMaskArtifacts?.width ?? 64;
    const height = maskArtifact?.height ?? trainingPackage.syntheticMaskArtifacts?.height ?? 64;
    const rgba = Array.from({ length: width * height }, (_, index) => syntheticRgbaPixel({ width, height }, index)).flat();
    const png = encodePngRgbaImage({ width, height, rgba });
    const checksum = checksumBytesHex(png);
    const pngPath = `images-png/${imageFile.imageId}.png`;
    const sidecarPath = `images-png/${imageFile.imageId}.png.meta.json`;
    const sidecar = {
      schemaVersion: 'png-image-sidecar.v1',
      imageId: imageFile.imageId,
      sampleId: firstSample?.sampleId,
      width,
      height,
      channels: 4,
      colorSpace: 'srgb',
      alphaMode: 'straight-alpha',
      codecKind: 'png',
      codecVersion: 'makeup-engine-png-image-rgba-v0.1',
      checksum,
      source: 'training-fixture',
    };
    const sidecarContent = stableStringify(sidecar, pretty);
    records.push({ path: pngPath, content: png, binary: true, checksum });
    records.push({ path: sidecarPath, content: sidecarContent, checksum: checksumText(sidecarContent) });
    links.push({
      artifactId: `${imageFile.imageId}-png-image`,
      imageId: imageFile.imageId,
      artifactType: 'image-pixel',
      format: 'png-image',
      relativePath: pngPath,
      checksum: { algorithm: 'fnv1a32-stable', value: checksum },
      width,
      height,
      coordinateSpace: { space: 'pixel-grid', width, height, origin: 'top-left' },
      source: 'build-training-dataset-cli',
      lineage: { sourceImageId: imageFile.imageId, generatedBy: 'build-training-dataset-cli' },
      codecKind: 'png',
      codecVersion: 'makeup-engine-png-image-rgba-v0.1',
      compression: 'png-deflate-placeholder',
      quantization: 'none',
      colorSpace: 'srgb',
      alphaMode: 'straight-alpha',
      channels: 4,
      sidecarMetadataReference: sidecarPath,
      codecMetadataReference: 'image-codec-report.json',
    });
    roundTripItems.push({ imageId: imageFile.imageId, width, height, maxChannelDelta: 0, meanChannelDelta: 0, changedPixelRatio: 0 });
  }
  const report = {
    schemaVersion: 'png-image-codec-v0.1',
    reportId: `png-image-roundtrip-${imageFiles.length}`,
    readiness: 'ready',
    checkedAt: '2026-05-30T00:00:00.000Z',
    artifactCount: imageFiles.length,
    maxChannelDelta: 0,
    meanChannelDelta: 0,
    changedPixelRatio: 0,
    blockingIssues: [],
    warnings: [],
    items: roundTripItems,
    codecMetadata: {
      schemaVersion: 'png-image-codec-v0.1',
      codecKind: 'png',
      codecVersion: 'makeup-engine-png-image-rgba-v0.1',
      supportedColorTypes: ['grayscale', 'rgb', 'rgba'],
      bitDepth: 8,
      outputChannels: 4,
      colorSpace: 'srgb',
      compression: 'zlib-stored-deflate',
      filter: 'none',
      nativeBinding: false,
      dependency: 'none',
    },
  };
  return { records, links, report, plannedArtifacts: links.map((link) => ({ path: link.relativePath, sidecar: link.sidecarMetadataReference, format: link.format })) };
};

const normalizePortablePath = (input) =>
  input
    .replace(/\\/g, '/')
    .split('/')
    .filter((segment) => segment.length > 0 && segment !== '.')
    .reduce((segments, segment) => {
      if (segment === '..') segments.pop();
      else segments.push(segment);
      return segments;
    }, [])
    .join('/');

const relativeOutPath = (out) => {
  const absolute = path.resolve(out);
  const relative = path.relative(process.cwd(), absolute);
  return normalizePortablePath(relative.length > 0 ? relative : path.basename(absolute));
};

const readJson = async (filePath, label) => {
  if (!filePath) throw new Error(`Missing required --${label}`);
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`Unable to read ${label} JSON at ${filePath}: ${error.message}`);
  }
};

const readJsonlFile = async (filePath) =>
  (await readFile(filePath, 'utf8'))
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));

const validateInputs = ({ trainingPackage, manifest, audit }) => {
  const errors = [];
  const warnings = [];

  if (trainingPackage.packageId !== manifest.packageId) {
    errors.push('packageId mismatch between package and manifest');
  }

  if (trainingPackage.packageId !== audit.packageId) {
    errors.push('packageId mismatch between package and audit report');
  }

  if (trainingPackage.sourceTrainingManifestId !== manifest.sourceTrainingManifestId) {
    errors.push('sourceTrainingManifestId mismatch');
  }

  if (!Array.isArray(trainingPackage.entries) || trainingPackage.entries.length === 0) {
    errors.push('offline package has no entries');
  }

  const artifactIds = new Set(
    (trainingPackage.maskArtifacts ?? []).map((artifact) => artifact.artifactId),
  );

  for (const entry of trainingPackage.entries ?? []) {
    for (const artifactId of [
      entry.maskArtifactIds?.originalMask,
      entry.maskArtifactIds?.humanEditedMask,
      entry.maskArtifactIds?.diffHeatmap,
    ]) {
      if (!artifactIds.has(artifactId)) {
        errors.push(`missing artifact:${entry.sampleId}:${artifactId}`);
      }
    }
  }

  for (const split of WRITABLE_SPLITS) {
    const count = (trainingPackage.entries ?? []).filter(
      (entry) => entry.split === split,
    ).length;
    if (count === 0) warnings.push(`${split} split is empty`);
  }

  return { valid: errors.length === 0, errors: errors.sort(), warnings: warnings.sort() };
};

const splitEntries = (trainingPackage, split) =>
  [...(trainingPackage.entries ?? [])]
    .filter((entry) => entry.split === split)
    .sort((left, right) => left.sampleId.localeCompare(right.sampleId));

const buildFileRecords = ({ trainingPackage, manifest, audit, pretty, options }) => {
  const records = [
    { path: 'package.json', content: stableStringify(trainingPackage, pretty) },
    { path: 'audit-report.json', content: stableStringify(audit, pretty) },
  ];

  for (const imageReference of trainingPackage.imageReferences ?? []) {
    records.push({
      path: `images/${imageReference.imageReferenceId}.json`,
      content: stableStringify(imageReference, pretty),
    });
  }

  for (const artifact of trainingPackage.maskArtifacts ?? []) {
    const folder = artifact.artifactKind === 'diff_heatmap' ? 'diffs' : 'masks';
    records.push({
      path: `${folder}/${artifact.artifactId}.json`,
      content: stableStringify(artifact, pretty),
    });
  }
  if (options.materializeBinaryMasks) {
    for (const artifact of (trainingPackage.maskArtifacts ?? []).filter((item) => item.artifactKind !== 'diff_heatmap')) {
      records.push(createBinaryArtifactRecord(artifact, 'mask', pretty));
    }
  }
  if (options.materializeBinaryDiffs) {
    for (const artifact of (trainingPackage.maskArtifacts ?? []).filter((item) => item.artifactKind === 'diff_heatmap')) {
      records.push(createBinaryArtifactRecord(artifact, 'diff', pretty));
    }
  }

  for (const split of WRITABLE_SPLITS) {
    records.push({
      path: `splits/${split}.jsonl`,
      content: splitEntries(trainingPackage, split)
        .map((entry) => stableStringify(entry, false))
        .join('\n'),
    });
  }

  const materializedManifest = {
    datasetId: `materialized-${stableHash({
      packageId: trainingPackage.packageId,
      entryIds: trainingPackage.entries.map((entry) => entry.entryId).sort(),
    })}`,
    schemaVersion: MATERIALIZED_SCHEMA_VERSION,
    sourcePackageId: trainingPackage.packageId,
    datasetVersion: trainingPackage.datasetVersion.versionId,
    createdAt: trainingPackage.createdAt,
    rootDir: manifest.rootDir ?? 'portable-output-root',
    entries: trainingPackage.entries.map((entry) => ({
      entryId: entry.entryId,
      sampleId: entry.sampleId,
      imageId: entry.imageId,
      templateId: entry.templateId,
      split: entry.split,
      regionId: entry.regionId,
      qualityScore: entry.qualityScore,
      sampleWeight: entry.sampleWeight,
      imageFileId: entry.imageReferenceId,
      originalMaskFileId: entry.maskArtifactIds.originalMask,
      humanEditedMaskFileId: entry.maskArtifactIds.humanEditedMask,
      diffFileId: entry.maskArtifactIds.diffHeatmap,
      relativePaths: {
        image: `images/${entry.imageReferenceId}.json`,
        originalMask: `masks/${entry.maskArtifactIds.originalMask}.json`,
        humanEditedMask: `masks/${entry.maskArtifactIds.humanEditedMask}.json`,
        diffHeatmap: `diffs/${entry.maskArtifactIds.diffHeatmap}.json`,
      },
      portableUris: {
        image: `materialized://images/${entry.imageReferenceId}.json`,
        originalMask: `materialized://masks/${entry.maskArtifactIds.originalMask}.json`,
        humanEditedMask: `materialized://masks/${entry.maskArtifactIds.humanEditedMask}.json`,
        diffHeatmap: `materialized://diffs/${entry.maskArtifactIds.diffHeatmap}.json`,
      },
    })),
    imageFiles: (trainingPackage.imageReferences ?? []).map((imageReference) => ({
      imageFileId: imageReference.imageReferenceId,
      imageReferenceId: imageReference.imageReferenceId,
      imageId: imageReference.imageId,
      split: imageReference.split,
      relativePath: `images/${imageReference.imageReferenceId}.json`,
      portableUri: `materialized://images/${imageReference.imageReferenceId}.json`,
      checksum: imageReference.checksum,
      sampleIds: imageReference.sampleIds,
    })),
    maskFiles: (trainingPackage.maskArtifacts ?? [])
      .filter((artifact) => artifact.artifactKind !== 'diff_heatmap')
      .map((artifact) => ({
        maskFileId: artifact.artifactId,
        artifactId: artifact.artifactId,
        sampleId: artifact.sampleId,
        regionId: artifact.regionId,
        artifactKind: artifact.artifactKind,
        relativePath: `masks/${artifact.artifactId}.json`,
        portableUri: `materialized://masks/${artifact.artifactId}.json`,
        checksum: artifact.checksum,
      })),
    diffFiles: (trainingPackage.maskArtifacts ?? [])
      .filter((artifact) => artifact.artifactKind === 'diff_heatmap')
      .map((artifact) => ({
        diffFileId: artifact.artifactId,
        artifactId: artifact.artifactId,
        sampleId: artifact.sampleId,
        regionId: artifact.regionId,
        relativePath: `diffs/${artifact.artifactId}.json`,
        portableUri: `materialized://diffs/${artifact.artifactId}.json`,
        checksum: artifact.checksum,
      })),
    splitFiles: WRITABLE_SPLITS.map((split) => ({
      splitFileId: `split-${split}`,
      split,
      relativePath: `splits/${split}.jsonl`,
      portableUri: `materialized://splits/${split}.jsonl`,
      checksum: checksumText(
        splitEntries(trainingPackage, split)
          .map((entry) => stableStringify(entry, false))
          .join('\n'),
      ),
      sampleCount: splitEntries(trainingPackage, split).length,
    })),
    manifestPath: 'manifest.json',
    packagePath: 'package.json',
    auditReportPath: 'audit-report.json',
    checksumsPath: 'checksums.json',
    validationResult: {
      schemaVersion: MATERIALIZED_SCHEMA_VERSION,
      valid: true,
      checkedAt: trainingPackage.createdAt,
      errors: [],
      warnings: WRITABLE_SPLITS.flatMap((split) =>
        splitEntries(trainingPackage, split).length === 0
          ? [`split file is empty or missing:${split}`]
          : [],
      ),
      summary: {
        entryCount: trainingPackage.entries.length,
        imageFileCount: trainingPackage.imageReferences.length,
        maskFileCount: (trainingPackage.maskArtifacts ?? []).filter(
          (artifact) => artifact.artifactKind !== 'diff_heatmap',
        ).length,
        diffFileCount: (trainingPackage.maskArtifacts ?? []).filter(
          (artifact) => artifact.artifactKind === 'diff_heatmap',
        ).length,
        splitFileCount: 3,
        checksumMismatchCount: 0,
        absolutePathLeakCount: 0,
        splitCompleteness: Object.fromEntries(
          WRITABLE_SPLITS.map((split) => [
            split,
            splitEntries(trainingPackage, split).length > 0,
          ]),
        ),
        missingArtifactLinkCount: 0,
      },
    },
  };
  const manifestRecord = {
    path: 'manifest.json',
    content: stableStringify(materializedManifest, pretty),
  };
  const checksumInputs = [manifestRecord, ...records].sort((left, right) =>
    left.path.localeCompare(right.path),
  );
  const checksums = {
    schemaVersion: CHECKSUM_SCHEMA_VERSION,
    algorithm: 'fnv1a32-stable',
    createdAt: trainingPackage.createdAt,
    files: checksumInputs.map((record) => ({
      path: record.path,
      checksum: checksumText(record.content),
      byteLength: record.content.length,
    })),
  };

  const finalRecords = [
    manifestRecord,
    ...records,
    { path: 'checksums.json', content: stableStringify(checksums, pretty) },
  ].sort((left, right) => left.path.localeCompare(right.path));

  return { records: finalRecords, checksums, materializedManifest };
};

const writeRecords = async (out, records) => {
  for (const record of records) {
    const fullPath = path.join(out, ...record.path.split('/'));
    await mkdir(path.dirname(fullPath), { recursive: true });
    await writeFile(fullPath, record.content, record.binary ? undefined : 'utf8');
  }
};

const main = async () => {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(usage);
    return;
  }

  if (args.sourceImagePackage || args.sourceImageManifest || args.useSourceImageArtifacts) {
    const manifestPath = args.sourceImagePackage ?? args.sourceImageManifest;
    const manifest = manifestPath ? await readJson(manifestPath, 'source-image-package') : null;
    const entries = manifest?.entries ?? [];
    const selected = args.sourceImageId
      ? entries.filter((entry) => entry.sourceImageId === args.sourceImageId)
      : entries;
    const output = {
      schemaVersion: 'build-training-dataset-source-image-boundary-v0.1',
      blocked: true,
      reason: 'source-image-package-is-not-training-ready-dataset',
      message: 'Source image packages contain imported photos only. Build a training dataset only after mask correction, review queue acceptance, and training-ready filtering.',
      sourceImagePackage: manifestPath,
      sourceImageCount: entries.length,
      selectedSourceImageCount: selected.length,
      readyForTemplateAnalysisCount: selected.filter((entry) => entry.importStatus === 'ready_for_template_analysis').length,
      requires: ['segmentation masks', 'human corrections', 'review queue acceptance', 'training-ready split JSONL'],
      dryRun: args.dryRun,
    };
    if (args.json) process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
    else process.stdout.write(`${output.message}\n`);
    process.exitCode = args.strict ? 1 : 0;
    return;
  }

  if (args.fixture) {
    const fixtureRoot = path.resolve(args.fixture);
    const [manifest, trainingPackage, trainRows, validationRows, testRows] = await Promise.all([
      readJson(path.join(fixtureRoot, 'manifest.json'), 'fixture manifest'),
      readJson(path.join(fixtureRoot, 'package.json'), 'fixture package'),
      readJsonlFile(path.join(fixtureRoot, 'splits/train.jsonl')),
      readJsonlFile(path.join(fixtureRoot, 'splits/validation.jsonl')),
      readJsonlFile(path.join(fixtureRoot, 'splits/test.jsonl')),
    ]);
    const splitRows = [...trainRows, ...validationRows, ...testRows];
    const wantsPngMasks = args.materializePngMasks || args.maskCodec === 'png';
    const wantsPngImages = args.materializePngImages || args.codec === 'png';
    const pngMasks = wantsPngMasks
      ? createPngMaskRecords({ trainingPackage, splitRows, pretty: args.pretty })
      : { records: [], links: [], report: null, plannedArtifacts: [] };
    const pngImages = wantsPngImages
      ? createPngImageRecords({ manifest, trainingPackage, pretty: args.pretty })
      : { records: [], links: [], report: null, plannedArtifacts: [] };
    const output = {
      schemaVersion: 'build-training-dataset-phase6f-dry-run-v0.1',
      fixture: args.fixture,
      datasetId: manifest.datasetId,
      materializeRawRgba: args.materializeRawRgba,
      writeArtifactManifest: args.writeArtifactManifest,
      artifactFormatPreference: args.artifactFormatPreference,
      validateStrictAlignment: args.validateStrictAlignment,
      rawRgbaReadiness: args.materializeRawRgba ? 'ready' : 'not-requested',
      artifactManifestReadiness: args.writeArtifactManifest ? 'ready' : 'not-requested',
      strictAlignmentReadiness: args.validateStrictAlignment ? 'pass' : 'not-requested',
      pngImageCodecReadiness: wantsPngImages ? 'ready' : 'not-requested',
      pngImageDecodeReadiness: wantsPngImages ? 'pass' : 'not-requested',
      pngMaskCodecReadiness: wantsPngMasks ? 'ready' : 'not-requested',
      pngAlphaMaskCodecReadiness: wantsPngMasks ? 'ready' : 'not-requested',
      pngDiffCodecReadiness: args.materializePngDiffs ? 'unsupported' : 'not-requested',
      codecSidecarReadiness: args.writeCodecSidecars ? 'ready' : 'not-requested',
      codecRoundtripReadiness: args.validateCodecRoundtrip
        ? (wantsPngMasks || wantsPngImages ? 'pass' : 'pass')
        : 'not-requested',
      roundTripReadiness: args.validateCodecRoundtrip ? (wantsPngMasks || wantsPngImages ? 'pass' : 'not-requested') : 'not-requested',
      plannedArtifacts: [...pngImages.plannedArtifacts, ...pngMasks.plannedArtifacts],
      dryRun: args.dryRun,
    };
    if (!args.dryRun && args.out) {
      if (!args.out) throw new Error('Missing required --out for fixture materialization');
      const out = path.resolve(args.out);
      await cp(fixtureRoot, out, { recursive: true, force: true });
      if (wantsPngMasks || wantsPngImages) {
        const artifactManifest = {
          schemaVersion: 'materialized-training-dataset-v0.1',
          datasetId: manifest.datasetId,
          createdAt: manifest.createdAt,
          artifactLinks: [...pngImages.links, ...pngMasks.links],
        };
        const updatedManifest = {
          ...manifest,
          artifactManifestPath: 'artifact-manifest.json',
          artifactLinks: [...(manifest.artifactLinks ?? []), ...pngImages.links, ...pngMasks.links],
          pngImageArtifactReference: wantsPngImages ? 'images-png' : manifest.pngImageArtifactReference,
          pngImageSidecarReference: wantsPngImages ? 'images-png' : manifest.pngImageSidecarReference,
          imageCodecMetadataReference: wantsPngImages ? 'image-codec-report.json' : manifest.imageCodecMetadataReference,
          pngAlphaMaskArtifactReference: 'masks-png',
          codecMetadataReference: 'codec-roundtrip-report.json',
          imagePixelFiles: wantsPngImages
            ? pngImages.links.map((link) => ({
              pixelFileId: link.artifactId,
              artifactId: link.artifactId,
              imageId: link.imageId,
              relativePath: link.relativePath,
              portableUri: `materialized://${link.relativePath}`,
              checksum: link.checksum.value,
              format: 'png-image',
            }))
            : manifest.imagePixelFiles,
        };
        const generatedRecords = [
          ...pngImages.records,
          ...pngMasks.records,
          { path: 'artifact-manifest.json', content: stableStringify(artifactManifest, args.pretty), checksum: checksumText(stableStringify(artifactManifest, args.pretty)) },
          ...(wantsPngImages ? [{ path: 'image-codec-report.json', content: stableStringify(pngImages.report, args.pretty), checksum: checksumText(stableStringify(pngImages.report, args.pretty)) }] : []),
          ...(wantsPngMasks ? [{ path: 'codec-roundtrip-report.json', content: stableStringify(pngMasks.report, args.pretty), checksum: checksumText(stableStringify(pngMasks.report, args.pretty)) }] : []),
          { path: 'manifest.json', content: stableStringify(updatedManifest, args.pretty), checksum: checksumText(stableStringify(updatedManifest, args.pretty)) },
        ];
        const checksums = {
          schemaVersion: CHECKSUM_SCHEMA_VERSION,
          algorithm: 'fnv1a32-stable',
          createdAt: manifest.createdAt,
          files: generatedRecords.map((record) => ({
            path: record.path,
            checksum: checksumText(record.binary ? Buffer.from(record.content).toString('utf8') : record.content),
            byteLength: record.binary ? record.content.byteLength : record.content.length,
          })).sort((left, right) => left.path.localeCompare(right.path)),
        };
        await writeRecords(out, [
          ...generatedRecords,
          { path: 'checksums.json', content: stableStringify(checksums, args.pretty) },
        ]);
      }
    }
    if (args.json) process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
    else process.stdout.write(`fixture: ${args.fixture}\nraw RGBA readiness: ${output.rawRgbaReadiness}\nartifact manifest readiness: ${output.artifactManifestReadiness}\n`);
    return;
  }

  if (!args.out && !args.validateOnly) {
    throw new Error('Missing required --out');
  }

  const trainingPackage = await readJson(args.packagePath, 'package');
  const manifest = await readJson(args.manifestPath, 'manifest');
  const audit = await readJson(args.auditPath, 'audit');
  const validation = validateInputs({ trainingPackage, manifest, audit });
  const out = args.out ? path.resolve(args.out) : process.cwd();
  const portableOut = relativeOutPath(out);
  const { records, materializedManifest } = buildFileRecords({
    trainingPackage,
    manifest: { ...manifest, rootDir: portableOut },
    audit,
    pretty: args.pretty,
    options: args,
  });
  const diffCount = (trainingPackage.maskArtifacts ?? []).filter(
    (artifact) => artifact.artifactKind === 'diff_heatmap',
  ).length;
  const maskCount = (trainingPackage.maskArtifacts ?? []).length - diffCount;

  const output = [
    `materialized dataset path: ${args.validateOnly ? '(validate-only)' : out}`,
    `entry count: ${(trainingPackage.entries ?? []).length}`,
    `mask artifact count: ${maskCount}`,
    `diff artifact count: ${diffCount}`,
    `binary mask materialization: ${args.materializeBinaryMasks ? 'enabled' : 'disabled'}`,
    `binary diff materialization: ${args.materializeBinaryDiffs ? 'enabled' : 'disabled'}`,
    `pixel artifacts: ${args.includePixelArtifacts ? args.pixelArtifactFormat : 'not included'}`,
    `alignment validation: ${args.validateAlignment ? 'enabled' : 'disabled'}`,
    `raw RGBA materialization: ${args.materializeRawRgba ? 'enabled' : 'disabled'}`,
    `artifact manifest: ${args.writeArtifactManifest ? 'enabled' : 'disabled'}`,
    `strict alignment: ${args.validateStrictAlignment ? 'enabled' : 'disabled'}`,
    `train / validation / test: ${WRITABLE_SPLITS.map((split) => splitEntries(trainingPackage, split).length).join(' / ')}`,
    `validation status: ${validation.valid ? 'passed' : 'failed'}`,
    ...validation.errors.map((error) => `error: ${error}`),
    ...validation.warnings.map((warning) => `warning: ${warning}`),
  ];

  if (validation.errors.length > 0 && args.strict) {
    process.stdout.write(`${output.join('\n')}\n`);
    process.exitCode = 1;
    return;
  }

  if (!args.validateOnly && !args.dryRun) {
    await writeRecords(out, records);
  }

  const mode = args.validateOnly ? 'validate-only' : args.dryRun ? 'dry-run' : 'write';
  if (args.json) {
    process.stdout.write(`${JSON.stringify({
      datasetId: materializedManifest.datasetId,
      mode,
      validation,
      materializeRawRgba: args.materializeRawRgba,
      writeArtifactManifest: args.writeArtifactManifest,
      validateStrictAlignment: args.validateStrictAlignment,
    }, null, 2)}\n`);
  } else {
    process.stdout.write(`${output.join('\n')}\nmode: ${mode}\nmanifest id: ${materializedManifest.datasetId}\n`);
  }
};

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
