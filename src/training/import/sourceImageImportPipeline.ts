import { stableStringify } from '../../templates/storage/datasetExport';
import { readBinaryFileFromPath, type BinaryFileKind, type BinaryFileReadResult } from '../artifacts/binaryFileReader';
import { decodePngImageArtifact, encodeRgbaPngImage } from '../artifacts/imageDecoderBoundary';
import { decodeJpegImageArtifact } from '../artifacts/jpegImageDecoderBoundary';
import type {
  ImagePixelData,
  SourceImageArtifactLink,
  SourceImageEntry,
  SourceImageManifest,
  SourceImagePackage,
} from '../schema';
import { SOURCE_IMAGE_PACKAGE_SCHEMA_VERSION } from '../schema';
import { createSourceImageQuarantine } from '../quarantine/sourceImageQuarantine';
import { evaluateSourceImageQuality } from '../validation/sourceImageQualityGate';

export interface SourceImageImportOptions {
  outDir?: string;
  dryRun?: boolean;
  materializeNormalizedPng?: boolean;
  materializeRawRgba?: boolean;
  materializeJsonRgba?: boolean;
  qualityGate?: boolean;
  strict?: boolean;
  createdAt?: string;
}

export interface SourceImageImportResult {
  entry: SourceImageEntry;
  decoded: ImagePixelData | null;
  plannedArtifacts: SourceImageArtifactLink[];
}

const createdAtDefault = '2026-05-30T00:00:00.000Z';
const dynamicImport = (specifier: string): Promise<unknown> =>
  (0, eval)(`import(${JSON.stringify(specifier)})`) as Promise<unknown>;

interface DirentLike {
  name: string;
  isFile(): boolean;
}

interface NodeFsPromisesLike {
  readdir(path: string, options: { withFileTypes: true }): Promise<DirentLike[]>;
}

interface NodePathLike {
  join(...parts: string[]): string;
  basename(path: string): string;
}

const slug = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'source-image';

const checksumText = (content: string): string => {
  let hash = 0x811c9dc5;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};

const imagePixelsToValues = (image: ImagePixelData): number[] =>
  image.pixels.flatMap((pixel) => [pixel.r, pixel.g, pixel.b, pixel.a]);

const rawRgbaValues = (image: ImagePixelData): number[] =>
  image.pixels.flatMap((pixel) => [
    Math.round(pixel.r * 255),
    Math.round(pixel.g * 255),
    Math.round(pixel.b * 255),
    Math.round(pixel.a * 255),
  ]);

export const normalizeSourceImageToArtifacts = (input: {
  image: ImagePixelData;
  sourceImageId: string;
  options?: SourceImageImportOptions;
}): { links: SourceImageArtifactLink[]; files: Array<{ uri: string; content: string | Uint8Array }> } => {
  const links: SourceImageArtifactLink[] = [];
  const files: Array<{ uri: string; content: string | Uint8Array }> = [];
  const options = input.options ?? {};
  if (options.materializeNormalizedPng) {
    const rgba = rawRgbaValues(input.image);
    const png = encodeRgbaPngImage({ width: input.image.width, height: input.image.height, rgba });
    const uri = `normalized-png/${input.sourceImageId}.png`;
    files.push({ uri, content: png });
    links.push({ kind: 'normalized-png', uri, checksum: checksumText(String.fromCharCode(...png)), width: input.image.width, height: input.image.height, format: 'png-image' });
  }
  if (options.materializeRawRgba) {
    const raw = {
      magic: 'MEARGBA',
      version: 1,
      width: input.image.width,
      height: input.image.height,
      channels: 4,
      colorSpace: 'srgb',
      values: rawRgbaValues(input.image),
    };
    const content = stableStringify(raw);
    const uri = `raw-rgba/${input.sourceImageId}.rgba.bin.json`;
    files.push({ uri, content });
    links.push({ kind: 'raw-rgba', uri, checksum: checksumText(content), width: input.image.width, height: input.image.height, format: 'raw-rgba-binary' });
  }
  if (options.materializeJsonRgba) {
    const artifact = {
      artifactId: `${input.sourceImageId}-json-rgba`,
      schemaVersion: 'image-pixel-artifact-v0.1',
      imageId: input.sourceImageId,
      width: input.image.width,
      height: input.image.height,
      format: 'json-rgba-grid',
      colorSpace: 'srgb',
      pixels: { width: input.image.width, height: input.image.height, channels: 4, values: imagePixelsToValues(input.image) },
      checksum: checksumText(stableStringify(imagePixelsToValues(input.image))),
      sourceImageReference: input.sourceImageId,
      createdAt: options.createdAt ?? createdAtDefault,
      metadata: { source: 'source-image-import', notes: ['normalized from admin source image'] },
    };
    const content = stableStringify(artifact);
    const uri = `json-rgba/${input.sourceImageId}.rgba.json`;
    files.push({ uri, content });
    links.push({ kind: 'json-rgba', uri, checksum: checksumText(content), width: input.image.width, height: input.image.height, format: 'json-rgba-grid' });
  }
  return { links, files };
};

const decodeSourceImage = (read: BinaryFileReadResult): {
  image: ImagePixelData | null;
  width: number;
  height: number;
  orientation: SourceImageEntry['orientation'];
  issueCodes: string[];
  pngReady: SourceImageEntry['codecReport']['pngCodecReadiness'];
  jpegStatus: SourceImageEntry['codecReport']['jpegBoundaryStatus'];
} => {
  if (read.metadata.detectedKind === 'png') {
    const decoded = decodePngImageArtifact(read.bytes, { imageId: slug(read.metadata.fileName) });
    return {
      image: decoded.decoded,
      width: decoded.decoded?.width ?? 0,
      height: decoded.decoded?.height ?? 0,
      orientation: 'missing',
      issueCodes: decoded.validation.issues.map((issue) => issue.code),
      pngReady: decoded.validation.valid ? 'ready' : 'blocked',
      jpegStatus: 'not-applicable',
    };
  }
  if (read.metadata.detectedKind === 'jpeg') {
    const decoded = decodeJpegImageArtifact(read.bytes, { imageId: slug(read.metadata.fileName) });
    return {
      image: null,
      width: decoded.width ?? 0,
      height: decoded.height ?? 0,
      orientation: decoded.orientation,
      issueCodes: decoded.validation.issues.map((issue) => issue.code),
      pngReady: 'not-applicable',
      jpegStatus: 'metadata-only',
    };
  }
  return {
    image: null,
    width: 0,
    height: 0,
    orientation: 'missing',
    issueCodes: read.issues.map((entry) => entry.code),
    pngReady: 'not-applicable',
    jpegStatus: 'not-applicable',
  };
};

export const importSourceImageFile = async (
  filePath: string,
  options: SourceImageImportOptions = {},
): Promise<SourceImageImportResult> => {
  const read = await readBinaryFileFromPath(filePath, { allowUnknown: false });
  const sourceImageId = slug(read.metadata.fileName.replace(/\.[^.]+$/, ''));
  const decoded = decodeSourceImage(read);
  const qualityReport = decoded.image && options.qualityGate !== false
    ? evaluateSourceImageQuality(decoded.image)
    : {
      readiness: decoded.image ? 'ready' as const : 'blocked' as const,
      qualityScore: decoded.image ? 1 : 0,
      width: decoded.width,
      height: decoded.height,
      brightness: 0,
      contrast: 0,
      colorVariance: 0,
      alphaCoverage: decoded.image ? 1 : 0,
      issueCodes: decoded.image ? [] : ['source-image-quality-blocked'],
    };
  const artifacts = decoded.image ? normalizeSourceImageToArtifacts({ image: decoded.image, sourceImageId, options }) : { links: [], files: [] };
  const codecIssueCodes = [...new Set([...read.issues.map((entry) => entry.code), ...decoded.issueCodes])].sort();
  const importStatus: SourceImageEntry['importStatus'] =
    codecIssueCodes.length > 0 ? (read.metadata.detectedKind === 'jpeg' ? 'blocked_by_codec' : 'failed') :
    qualityReport.readiness === 'blocked' ? 'blocked_by_quality' :
    artifacts.links.length > 0 ? 'ready_for_template_analysis' :
    'normalized';
  const entry: SourceImageEntry = {
    sourceImageId,
    originalFileName: read.metadata.fileName,
    originalFileChecksum: read.metadata.checksum,
    originalFileKind: read.metadata.detectedKind as BinaryFileKind,
    decodedWidth: decoded.width,
    decodedHeight: decoded.height,
    colorSpace: decoded.image ? 'srgb' : 'unknown',
    channels: decoded.image ? 4 : 0,
    orientation: decoded.orientation,
    normalizedArtifactLinks: [
      { kind: 'original', uri: `originals/${read.metadata.fileName}`, checksum: read.metadata.checksum, format: read.metadata.detectedKind },
      ...artifacts.links,
      { kind: 'report', uri: `reports/${sourceImageId}.json`, format: 'source-image-report' },
    ],
    codecReport: {
      originalKind: read.metadata.detectedKind as BinaryFileKind,
      pngCodecReadiness: decoded.pngReady,
      jpegBoundaryStatus: decoded.jpegStatus,
      decoded: Boolean(decoded.image),
      issueCodes: codecIssueCodes,
    },
    qualityReport,
    lineage: {
      importedBy: 'source-image-import-pipeline',
      sourceUri: filePath.replace(/\\/g, '/'),
      normalizedFromChecksum: read.metadata.checksum,
    },
    importStatus,
    createdAt: options.createdAt ?? createdAtDefault,
  };
  return { entry, decoded: decoded.image, plannedArtifacts: entry.normalizedArtifactLinks };
};

export const createSourceImageManifest = (input: {
  packageId: string;
  entries: readonly SourceImageEntry[];
  createdAt?: string;
}): SourceImageManifest => {
  const issueCodes = [...new Set(input.entries.flatMap((entry) => [...entry.codecReport.issueCodes, ...entry.qualityReport.issueCodes]))].sort();
  return {
    schemaVersion: SOURCE_IMAGE_PACKAGE_SCHEMA_VERSION,
    packageId: input.packageId,
    createdAt: input.createdAt ?? createdAtDefault,
    entries: [...input.entries].sort((left, right) => left.sourceImageId.localeCompare(right.sourceImageId)),
    readiness: input.entries.some((entry) => entry.importStatus === 'ready_for_template_analysis')
      ? (issueCodes.length ? 'warning' : 'ready')
      : 'blocked',
    issueCodes,
  };
};

export const validateSourceImagePackage = (manifest: SourceImageManifest): string[] => [
  ...(manifest.schemaVersion !== SOURCE_IMAGE_PACKAGE_SCHEMA_VERSION ? ['source-image-manifest-invalid'] : []),
  ...(manifest.entries.length === 0 ? ['source-image-manifest-empty'] : []),
  ...manifest.entries.flatMap((entry) => entry.importStatus === 'ready_for_template_analysis' ? [] : [`source-image-not-ready:${entry.sourceImageId}`]),
];

export const importSourceImageDirectory = async (
  inputDir: string,
  options: SourceImageImportOptions = {},
): Promise<SourceImagePackage> => {
  const fs = await dynamicImport('node:fs/promises') as NodeFsPromisesLike;
  const path = await dynamicImport('node:path') as NodePathLike;
  const entries = (await fs.readdir(inputDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(inputDir, entry.name))
    .filter((filePath) => /\.(png|jpg|jpeg|json|bin)$/i.test(filePath))
    .sort();
  const results = await Promise.all(entries.map((filePath) => importSourceImageFile(filePath, options)));
  const packageId = `source-image-package-${slug(path.basename(inputDir))}`;
  const manifest = createSourceImageManifest({ packageId, entries: results.map((result) => result.entry), createdAt: options.createdAt });
  return {
    schemaVersion: SOURCE_IMAGE_PACKAGE_SCHEMA_VERSION,
    packageId,
    rootDir: options.outDir ?? inputDir,
    createdAt: options.createdAt ?? createdAtDefault,
    manifestPath: 'source-image-manifest.json',
    checksumsPath: 'checksums.json',
    reportPath: 'import-report.json',
    quarantinePath: 'import-quarantine.json',
    manifest,
  };
};

export const summarizeSourceImageImport = (pkg: SourceImagePackage): string =>
  `source-image-package:${pkg.packageId}:entries=${pkg.manifest.entries.length}:readiness=${pkg.manifest.readiness}`;

export const createSourceImageImportQuarantine = (pkg: SourceImagePackage) =>
  createSourceImageQuarantine({ packageId: pkg.packageId, entries: pkg.manifest.entries, createdAt: pkg.createdAt });
