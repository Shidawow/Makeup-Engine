import { stableStringify } from '../../templates/storage/datasetExport';
import type { ImagePixelArtifact, ImagePixelData } from '../schema';
import { createImagePixelArtifactFromRgbaGrid, normalizeImagePixelData } from './imagePixelResolver';

export const RAW_RGBA_MAGIC = 'MEARGBA' as const;

export interface RawRgbaBinaryArtifact {
  magic: typeof RAW_RGBA_MAGIC;
  version: 1;
  width: number;
  height: number;
  channels: 4;
  colorSpace: 'srgb';
  values: number[];
}

export interface RawRgbaImageArtifactMetadata {
  artifactId: string;
  imageId: string;
  format: 'raw-rgba-binary';
  width: number;
  height: number;
  channels: 4;
  relativePath: string;
  portableUri: string;
  checksum: string;
  sourceJsonArtifactId: string;
}

const checksumText = (content: string): string => {
  let hash = 0x811c9dc5;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};

export const convertJsonRgbaToRawRgbaBinary = (
  artifact: ImagePixelArtifact,
): RawRgbaBinaryArtifact => {
  const data = normalizeImagePixelData(artifact);
  return {
    magic: RAW_RGBA_MAGIC,
    version: 1,
    width: data.width,
    height: data.height,
    channels: 4,
    colorSpace: 'srgb',
    values: data.pixels.flatMap((pixel) => [
      Math.round(Math.max(0, Math.min(1, pixel.r)) * 255),
      Math.round(Math.max(0, Math.min(1, pixel.g)) * 255),
      Math.round(Math.max(0, Math.min(1, pixel.b)) * 255),
      Math.round(Math.max(0, Math.min(1, pixel.a ?? 1)) * 255),
    ]),
  };
};

export const writeRawRgbaBinaryArtifact = (
  artifact: RawRgbaBinaryArtifact,
): string => `${stableStringify(artifact)}\n`;

export const readRawRgbaBinaryArtifact = (
  content: string,
): RawRgbaBinaryArtifact => JSON.parse(content) as RawRgbaBinaryArtifact;

export const validateRawRgbaBinaryArtifact = (
  artifact: RawRgbaBinaryArtifact,
): string[] => [
  ...(artifact.magic !== RAW_RGBA_MAGIC ? ['raw rgba magic must be MEARGBA'] : []),
  ...(artifact.width <= 0 || artifact.height <= 0 ? ['raw rgba dimensions must be positive'] : []),
  ...(artifact.channels !== 4 ? ['raw rgba channels must be 4'] : []),
  ...(artifact.values.length !== artifact.width * artifact.height * artifact.channels
    ? ['raw rgba values length must match width * height * 4']
    : []),
  ...(artifact.values.some((value) => value < 0 || value > 255 || !Number.isInteger(value))
    ? ['raw rgba values must be uint8']
    : []),
];

export const summarizeRawRgbaBinaryArtifact = (
  artifact: RawRgbaBinaryArtifact,
): string =>
  `raw-rgba:${artifact.width}x${artifact.height}:values=${artifact.values.length}`;

export const createRawRgbaImageArtifactMetadata = (input: {
  source: ImagePixelArtifact;
  relativePath?: string;
}): RawRgbaImageArtifactMetadata => {
  const binary = convertJsonRgbaToRawRgbaBinary(input.source);
  const content = writeRawRgbaBinaryArtifact(binary);
  const artifactId = `${input.source.artifactId}-raw-rgba`;
  const relativePath = input.relativePath ?? `image-pixels-raw/${input.source.imageId}.rgba.bin.json`;
  return {
    artifactId,
    imageId: input.source.imageId,
    format: 'raw-rgba-binary',
    width: binary.width,
    height: binary.height,
    channels: 4,
    relativePath,
    portableUri: `materialized://${relativePath}`,
    checksum: checksumText(content),
    sourceJsonArtifactId: input.source.artifactId,
  };
};

export const rawRgbaBinaryToImagePixelData = (
  artifact: RawRgbaBinaryArtifact,
): ImagePixelData => ({
  width: artifact.width,
  height: artifact.height,
  colorSpace: artifact.colorSpace,
  pixels: Array.from({ length: artifact.width * artifact.height }, (_, index) => {
    const offset = index * 4;
    return {
      r: artifact.values[offset] / 255,
      g: artifact.values[offset + 1] / 255,
      b: artifact.values[offset + 2] / 255,
      a: artifact.values[offset + 3] / 255,
    };
  }),
});

export const rawRgbaBinaryToImagePixelArtifact = (input: {
  artifact: RawRgbaBinaryArtifact;
  artifactId: string;
  imageId: string;
  sourceImageReference: string;
  createdAt: string;
}): ImagePixelArtifact =>
  createImagePixelArtifactFromRgbaGrid({
    artifactId: input.artifactId,
    imageId: input.imageId,
    width: input.artifact.width,
    height: input.artifact.height,
    values: input.artifact.values.map((value) => value / 255),
    sourceImageReference: input.sourceImageReference,
    createdAt: input.createdAt,
  });
