import type { MakeupAnalysisPipelineResult } from '../src/vision';
import type { SourceImageArtifactBinding } from '../src/templates/schema';
import { createSourceImageArtifactBinding } from '../src/templates/storage';
import { encodeRgbaPngImage } from '../src/training/artifacts';
import type { SourceImageEntry, SourceImageManifest } from '../src/training/schema';

const createdAt = '2026-05-31T00:00:00.000Z';

const readyEntry = (sourceImageId: string, fileName: string): SourceImageEntry => ({
  sourceImageId,
  originalFileName: fileName,
  originalFileChecksum: `${sourceImageId}-checksum`,
  originalFileKind: 'png',
  decodedWidth: 2,
  decodedHeight: 2,
  colorSpace: 'srgb',
  channels: 4,
  orientation: 'missing',
  normalizedArtifactLinks: [
    {
      kind: 'normalized-png',
      uri: `normalized-png/${fileName}`,
      width: 2,
      height: 2,
      format: 'png-image',
    },
    {
      kind: 'json-rgba',
      uri: `json-rgba/${sourceImageId}.rgba.json`,
      width: 2,
      height: 2,
      format: 'json-rgba-grid',
    },
  ],
  codecReport: {
    originalKind: 'png',
    pngCodecReadiness: 'ready',
    jpegBoundaryStatus: 'not-applicable',
    decoded: true,
    issueCodes: [],
  },
  qualityReport: {
    readiness: 'ready',
    qualityScore: 0.95,
    width: 2,
    height: 2,
    brightness: 0.55,
    contrast: 0.2,
    colorVariance: 0.12,
    alphaCoverage: 1,
    issueCodes: [],
  },
  lineage: {
    importedBy: 'source-image-import-cli',
    sourceUri: fileName,
    normalizedFromChecksum: `${sourceImageId}-checksum`,
  },
  importStatus: 'ready_for_template_analysis',
  createdAt,
});

const blockedEntry = (): SourceImageEntry => ({
  ...readyEntry('blocked-codec', 'blocked-codec.jpg'),
  originalFileKind: 'jpeg',
  decodedWidth: 0,
  decodedHeight: 0,
  channels: 0,
  colorSpace: 'unknown',
  normalizedArtifactLinks: [],
  codecReport: {
    originalKind: 'jpeg',
    pngCodecReadiness: 'not-applicable',
    jpegBoundaryStatus: 'metadata-only',
    decoded: false,
    issueCodes: ['jpeg-pixel-decode-unsupported'],
  },
  qualityReport: {
    readiness: 'blocked',
    qualityScore: 0,
    width: 0,
    height: 0,
    brightness: 0,
    contrast: 0,
    colorVariance: 0,
    alphaCoverage: 0,
    issueCodes: ['source-image-not-decoded'],
  },
  importStatus: 'blocked_by_codec',
});

const failedEntry = (): SourceImageEntry => ({
  ...readyEntry('failed-import', 'failed-import.png'),
  normalizedArtifactLinks: [],
  codecReport: {
    originalKind: 'png',
    pngCodecReadiness: 'blocked',
    jpegBoundaryStatus: 'not-applicable',
    decoded: false,
    issueCodes: ['png-decode-failed'],
  },
  qualityReport: {
    readiness: 'blocked',
    qualityScore: 0,
    width: 0,
    height: 0,
    brightness: 0,
    contrast: 0,
    colorVariance: 0,
    alphaCoverage: 0,
    issueCodes: ['source-image-import-failed'],
  },
  importStatus: 'failed',
});

export const createTemplateProductionTestManifest = (): SourceImageManifest => ({
  schemaVersion: 'source-image-package-v0.1',
  packageId: 'phase-6i-test-package',
  createdAt,
  readiness: 'warning',
  issueCodes: ['test-fixture'],
  entries: [
    readyEntry('ready-without-binding', 'ready-without-binding.png'),
    readyEntry('ready-with-binding', 'ready-with-binding.png'),
    blockedEntry(),
    failedEntry(),
  ],
});

const createTestFile = (bytes: Uint8Array, name: string, type: string): File =>
  ({
    name,
    size: bytes.byteLength,
    type,
    arrayBuffer: async () =>
      bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
    text: async () => new TextDecoder().decode(bytes),
  }) as File;

export const createReadySourceImageBinding = async (
  manifest = createTemplateProductionTestManifest(),
): Promise<SourceImageArtifactBinding> => {
  const entry = manifest.entries.find((candidate) => candidate.sourceImageId === 'ready-with-binding');

  if (!entry) {
    throw new Error('test fixture missing ready-with-binding');
  }

  return createSourceImageArtifactBinding({
    sourceImageId: entry.sourceImageId,
    sourceImagePackageId: manifest.packageId,
    manifestArtifactReference: entry.normalizedArtifactLinks[0]!,
    file: createTestFile(
      encodeRgbaPngImage({
        width: 2,
        height: 2,
        rgba: [
          255, 0, 0, 255, 0, 0, 255, 255,
          0, 255, 0, 255, 255, 255, 255, 255,
        ],
      }),
      entry.originalFileName,
      'image/png',
    ),
    objectUrlApi: {
      createObjectURL: () => 'blob:phase-6i-test-binding',
      revokeObjectURL: () => undefined,
    },
  });
};

export const createMemoryStorage = (): Storage => {
  const values = new Map<string, string>();

  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key: string) => values.get(key) ?? null,
    key: (index: number) => Array.from(values.keys())[index] ?? null,
    removeItem: (key: string) => values.delete(key),
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
};

export const createTemplateProductionAnalysisResult = (): MakeupAnalysisPipelineResult =>
  ({
    imageId: 'phase-6i-image',
    providerId: 'test-provider',
    faceDetection: {
      detected: true,
      confidence: 0.9,
      box: { x: 0.1, y: 0.1, width: 0.8, height: 0.8, space: 'normalized-image' },
      landmarks: [],
    },
    faceMesh: {
      landmarks: [],
      triangles: [],
      bounds: { x: 0.1, y: 0.1, width: 0.8, height: 0.8, space: 'normalized-image' },
    },
    segmentationMasks: [],
    cosmeticRegions: [],
    cosmeticSegmentation: {
      imageId: 'phase-6i-image',
      masks: [],
      summary: { totalMasks: 0, averageConfidence: 0 },
    },
    parameters: { regions: [] },
    trace: ['image-input', 'face-detection', 'cosmetic-segmentation'],
    debug: [],
  }) as MakeupAnalysisPipelineResult;
