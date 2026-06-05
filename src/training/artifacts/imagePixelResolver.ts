import type {
  ImagePixelArtifact,
  ImagePixelArtifactFormat,
  ImagePixelArtifactReference,
  ImagePixelArtifactValidationResult,
  ImagePixelData,
} from '../schema';
import { IMAGE_PIXEL_ARTIFACT_SCHEMA_VERSION } from '../schema';
import type { TrainingDatasetFileReader } from '../loaders';
import type { PngImageSidecarMetadata } from '../schema/png-image-codec.schema';
import { decodePngImageArtifact } from './imageDecoderBoundary';

const checksumText = (content: string): string => {
  let hash = 0x811c9dc5;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};

export const normalizeImagePixelData = (
  artifact: ImagePixelArtifact,
): ImagePixelData => {
  if (!artifact.pixels) {
    return { width: artifact.width, height: artifact.height, colorSpace: 'srgb', pixels: [] };
  }
  const channels = artifact.pixels.channels;
  const pixels = Array.from(
    { length: artifact.pixels.width * artifact.pixels.height },
    (_, index) => {
      const offset = index * channels;
      return {
        r: artifact.pixels?.values[offset] ?? 0,
        g: artifact.pixels?.values[offset + 1] ?? 0,
        b: artifact.pixels?.values[offset + 2] ?? 0,
        a: channels === 4 ? artifact.pixels?.values[offset + 3] ?? 1 : 1,
      };
    },
  );
  return {
    width: artifact.pixels.width,
    height: artifact.pixels.height,
    colorSpace: artifact.colorSpace,
    pixels,
  };
};

export const validateImagePixelArtifact = (
  artifact: ImagePixelArtifact,
): ImagePixelArtifactValidationResult => {
  const unsupported =
    artifact.format === 'png-image-placeholder' ||
    artifact.format === 'jpeg-image-placeholder' ||
    artifact.format === 'browser-image-data-placeholder';
  const expectedValues =
    artifact.pixels && artifact.pixels.width * artifact.pixels.height * artifact.pixels.channels;
  const errors = [
    ...(artifact.schemaVersion !== IMAGE_PIXEL_ARTIFACT_SCHEMA_VERSION
      ? ['invalid image pixel artifact schemaVersion']
      : []),
    ...(artifact.width <= 0 || artifact.height <= 0
      ? ['image pixel dimensions must be positive']
      : []),
    ...(unsupported ? [`unsupported image pixel artifact format:${artifact.format}`] : []),
    ...(!unsupported && artifact.format !== 'png-image' && !artifact.pixels ? ['json image pixel artifact requires pixels'] : []),
    ...(artifact.pixels && artifact.pixels.values.length !== expectedValues
      ? ['pixel value count does not match width * height * channels']
      : []),
  ];
  return {
    valid: errors.length === 0,
    errors,
    warnings: unsupported ? ['PNG/JPEG/browser image placeholder decoding is not implemented'] : [],
  };
};

export const readJsonImagePixelArtifact = async (
  reader: TrainingDatasetFileReader,
  relativePath: string,
): Promise<ImagePixelArtifact> =>
  JSON.parse(await reader.readText(relativePath)) as ImagePixelArtifact;

export const resolveImagePixelArtifact = async (input: {
  reader: TrainingDatasetFileReader;
  relativePath: string;
}): Promise<{ artifact: ImagePixelArtifact; data: ImagePixelData; validation: ImagePixelArtifactValidationResult }> => {
  const artifact = await readJsonImagePixelArtifact(input.reader, input.relativePath);
  const validation = validateImagePixelArtifact(artifact);
  return {
    artifact,
    data: normalizeImagePixelData(artifact),
    validation,
  };
};

const bytesFromBinaryString = (content: string): Uint8Array =>
  Uint8Array.from([...content].map((char) => char.charCodeAt(0) & 0xff));

export const loadImagePixelDataFromPng = async (input: {
  reader: TrainingDatasetFileReader;
  relativePath: string;
  sidecarPath?: string;
  imageId?: string;
}): Promise<{ data: ImagePixelData | null; validation: ImagePixelArtifactValidationResult; sidecar?: PngImageSidecarMetadata }> => {
  let sidecar: PngImageSidecarMetadata | undefined;
  if (input.sidecarPath) {
    try {
      sidecar = JSON.parse(await input.reader.readText(input.sidecarPath)) as PngImageSidecarMetadata;
    } catch {
      return { data: null, validation: { valid: false, errors: ['png image sidecar missing'], warnings: [] } };
    }
  }
  const result = decodePngImageArtifact(bytesFromBinaryString(await input.reader.readText(input.relativePath)), {
    imageId: input.imageId,
    sidecarMetadata: sidecar,
    sourceUri: `materialized://${input.relativePath}`,
  });
  return {
    data: result.decoded,
    validation: {
      valid: result.validation.valid,
      errors: result.validation.issues.filter((issue) => issue.severity === 'error').map((issue) => issue.code),
      warnings: result.validation.issues.filter((issue) => issue.severity === 'warning').map((issue) => issue.code),
    },
    sidecar,
  };
};

export const loadImagePixelDataFromJsonRgba = async (input: {
  reader: TrainingDatasetFileReader;
  relativePath: string;
}): Promise<{ artifact: ImagePixelArtifact; data: ImagePixelData; validation: ImagePixelArtifactValidationResult }> =>
  resolveImagePixelArtifact(input);

export const resolvePreferredImagePixelArtifact = async (input: {
  reader: TrainingDatasetFileReader;
  imageId: string;
  preferences: readonly ('png' | 'raw' | 'json')[];
}): Promise<{ data: ImagePixelData | null; format: ImagePixelArtifactFormat | 'raw-rgba-binary' | null; validation: ImagePixelArtifactValidationResult }> => {
  for (const preference of input.preferences) {
    if (preference === 'png') {
      const pngPath = `images-png/${input.imageId}.png`;
      if (await input.reader.exists(pngPath)) {
        const resolved = await loadImagePixelDataFromPng({
          reader: input.reader,
          relativePath: pngPath,
          sidecarPath: `images-png/${input.imageId}.png.meta.json`,
          imageId: input.imageId,
        });
        if (resolved.validation.valid) return { data: resolved.data, format: 'png-image', validation: resolved.validation };
      }
    }
    if (preference === 'json') {
      const jsonPath = `image-pixels/${input.imageId}.rgba.json`;
      if (await input.reader.exists(jsonPath)) {
        const resolved = await resolveImagePixelArtifact({ reader: input.reader, relativePath: jsonPath });
        if (resolved.validation.valid) return { data: resolved.data, format: resolved.artifact.format, validation: resolved.validation };
      }
    }
  }
  return {
    data: null,
    format: null,
    validation: { valid: false, errors: [`no preferred image pixel artifact found:${input.imageId}`], warnings: [] },
  };
};

export const createImagePixelArtifactFromRgbaGrid = (input: {
  artifactId: string;
  imageId: string;
  width: number;
  height: number;
  values: readonly number[];
  sourceImageReference: string;
  createdAt: string;
}): ImagePixelArtifact => {
  const contentIdentity = {
    imageId: input.imageId,
    width: input.width,
    height: input.height,
    values: input.values,
  };
  return {
    artifactId: input.artifactId,
    schemaVersion: IMAGE_PIXEL_ARTIFACT_SCHEMA_VERSION,
    imageId: input.imageId,
    width: input.width,
    height: input.height,
    format: 'json-rgba-grid',
    colorSpace: 'srgb',
    pixels: {
      width: input.width,
      height: input.height,
      channels: 4,
      values: [...input.values],
    },
    checksum: checksumText(JSON.stringify(contentIdentity)),
    sourceImageReference: input.sourceImageReference,
    createdAt: input.createdAt,
    metadata: { source: 'synthetic-fixture', notes: [] },
  };
};

export const createImagePixelArtifactReference = (
  artifact: ImagePixelArtifact,
  relativePath: string,
): ImagePixelArtifactReference => ({
  artifactId: artifact.artifactId,
  imageId: artifact.imageId,
  relativePath,
  portableUri: `materialized://${relativePath}`,
  checksum: artifact.checksum,
  format: artifact.format,
});

export const summarizeImagePixelArtifact = (artifact: ImagePixelArtifact): string =>
  `${artifact.format}:${artifact.imageId}:${artifact.width}x${artifact.height}:checksum=${artifact.checksum}`;

export type { ImagePixelArtifactFormat };
