import type { ImagePixelArtifact, ImagePixelData } from '../schema';
import type { PngImageSidecarMetadata } from '../schema/png-image-codec.schema';
import {
  PNG_IMAGE_CODEC_VERSION,
  PNG_IMAGE_SIDECAR_SCHEMA_VERSION,
} from '../schema/png-image-codec.schema';
import { normalizeImagePixelData, validateImagePixelArtifact } from './imagePixelResolver';
import { readRawRgbaBinaryArtifact, rawRgbaBinaryToImagePixelData, validateRawRgbaBinaryArtifact } from './rawRgbaImageMaterializer';

export type ImageDecoderKind =
  | 'json-rgba-grid'
  | 'raw-rgba-binary'
  | 'png-image'
  | 'png-image-placeholder'
  | 'jpeg-image-placeholder';

export interface ImageDecoderCapabilities {
  kind: ImageDecoderKind;
  supportsDecode: boolean;
  supportsEncode: boolean;
  dependencyFree: boolean;
}

export interface ImageDecodeInput {
  kind: ImageDecoderKind;
  artifact?: ImagePixelArtifact;
  content?: string;
  imageId?: string;
}

export interface ImageDecodeIssue {
  severity: 'error' | 'warning';
  code: string;
  message: string;
}

export interface DecodedImagePixelGrid extends ImagePixelData {
  imageId: string;
  decoderKind: ImageDecoderKind;
}

export interface ImageDecodeValidationResult {
  valid: boolean;
  issues: ImageDecodeIssue[];
}

export interface ImageDecodeResult {
  decoded: DecodedImagePixelGrid | null;
  validation: ImageDecodeValidationResult;
}

export type ImageCodecIssue = ImageDecodeIssue;

export interface PngImageDecodeOptions {
  strict?: boolean;
  sourceUri?: string;
  imageId?: string;
  sidecarMetadata?: PngImageSidecarMetadata;
}

export interface PngImageDecodeResult extends ImageDecodeResult {
  codec: 'png-image';
  sourceUri?: string;
  support?: PngCodecSupportSummary;
}

export interface ImageCodecSummary {
  codec: ImageDecoderKind | 'png-image' | 'jpeg-image';
  supported: boolean;
  issueCodes: string[];
}

export interface PngCodecSupportSummary {
  bitDepth: number;
  colorType: number;
  interlaceMethod: number;
  compressionMethod: number;
  filterMethod: number;
  supported: boolean;
  issueCodes: string[];
  filterTypesSeen: number[];
}

const error = (code: string, message: string): ImageDecodeIssue => ({
  severity: 'error',
  code,
  message,
});

const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10] as const;
const textEncoder = new TextEncoder();

const concatBytes = (chunks: readonly Uint8Array[]): Uint8Array => {
  const output = new Uint8Array(chunks.reduce((sum, chunk) => sum + chunk.length, 0));
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return output;
};

const readUint32 = (bytes: Uint8Array, offset: number): number =>
  (((bytes[offset] ?? 0) << 24) |
    ((bytes[offset + 1] ?? 0) << 16) |
    ((bytes[offset + 2] ?? 0) << 8) |
    (bytes[offset + 3] ?? 0)) >>> 0;

const writeUint32 = (value: number): Uint8Array =>
  new Uint8Array([(value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff]);

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    table[index] = value >>> 0;
  }
  return table;
})();

const crc32 = (bytes: Uint8Array): number => {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = (crc >>> 8) ^ (crcTable[(crc ^ byte) & 0xff] ?? 0);
  return (crc ^ 0xffffffff) >>> 0;
};

const adler32 = (bytes: Uint8Array): number => {
  let a = 1;
  let b = 0;
  for (const byte of bytes) {
    a = (a + byte) % 65521;
    b = (b + a) % 65521;
  }
  return ((b << 16) | a) >>> 0;
};

const checksumBytes = (bytes: Uint8Array): string => crc32(bytes).toString(16).padStart(8, '0');

export const decodePngIdatChunks = (stream: Uint8Array): Uint8Array => {
  if (stream.length < 6) throw new Error('PNG IDAT zlib stream is too short');
  let offset = 2;
  const chunks: Uint8Array[] = [];
  let final = 0;
  while (final === 0) {
    const header = stream[offset];
    if (header === undefined) throw new Error('PNG IDAT deflate block header is missing');
    final = header & 1;
    if (((header >>> 1) & 0x03) !== 0) throw new Error('PNG image codec only supports stored deflate blocks');
    offset += 1;
    const length = (stream[offset] ?? 0) | ((stream[offset + 1] ?? 0) << 8);
    const inverse = (stream[offset + 2] ?? 0) | ((stream[offset + 3] ?? 0) << 8);
    if (((length ^ 0xffff) & 0xffff) !== inverse) throw new Error('PNG IDAT stored block length checksum mismatch');
    offset += 4;
    chunks.push(stream.slice(offset, offset + length));
    offset += length;
  }
  const raw = concatBytes(chunks);
  if (adler32(raw) !== readUint32(stream, stream.length - 4)) throw new Error('PNG IDAT Adler-32 checksum mismatch');
  return raw;
};

const inflateStored = decodePngIdatChunks;

const createChunk = (type: string, data: Uint8Array): Uint8Array => {
  const typeBytes = textEncoder.encode(type);
  return concatBytes([writeUint32(data.length), typeBytes, data, writeUint32(crc32(concatBytes([typeBytes, data])))]);
};

const deflateStored = (raw: Uint8Array): Uint8Array => {
  const chunks: Uint8Array[] = [new Uint8Array([0x78, 0x01])];
  for (let offset = 0; offset < raw.length; offset += 65535) {
    const length = Math.min(65535, raw.length - offset);
    chunks.push(new Uint8Array([
      offset + length >= raw.length ? 1 : 0,
      length & 0xff,
      (length >>> 8) & 0xff,
      (~length) & 0xff,
      ((~length) >>> 8) & 0xff,
    ]));
    chunks.push(raw.slice(offset, offset + length));
  }
  chunks.push(writeUint32(adler32(raw)));
  return concatBytes(chunks);
};

export const encodeRgbaPngImage = (input: {
  width: number;
  height: number;
  rgba: readonly number[];
  filterType?: 0 | 1 | 2 | 3 | 4;
}): Uint8Array => {
  const bytesPerPixel = 4;
  const scanlines = new Uint8Array((input.width * bytesPerPixel + 1) * input.height);
  const filterType = input.filterType ?? 0;
  for (let y = 0; y < input.height; y += 1) {
    const rowOffset = y * (input.width * bytesPerPixel + 1);
    scanlines[rowOffset] = filterType;
    for (let x = 0; x < input.width; x += 1) {
      const sourceOffset = (y * input.width + x) * 4;
      const targetOffset = rowOffset + 1 + x * 4;
      for (let channel = 0; channel < bytesPerPixel; channel += 1) {
        const rawValue = channel === 3 ? input.rgba[sourceOffset + channel] ?? 255 : input.rgba[sourceOffset + channel] ?? 0;
        const left = x === 0 ? 0 : input.rgba[sourceOffset + channel - bytesPerPixel] ?? (channel === 3 ? 255 : 0);
        const up = y === 0 ? 0 : input.rgba[sourceOffset + channel - input.width * bytesPerPixel] ?? (channel === 3 ? 255 : 0);
        const upLeft =
          x === 0 || y === 0
            ? 0
            : input.rgba[sourceOffset + channel - input.width * bytesPerPixel - bytesPerPixel] ?? (channel === 3 ? 255 : 0);
        const predictor =
          filterType === 1 ? left :
          filterType === 2 ? up :
          filterType === 3 ? Math.floor((left + up) / 2) :
          filterType === 4 ? paethPredictor(left, up, upLeft) :
          0;
        scanlines[targetOffset + channel] = (rawValue - predictor + 256) & 0xff;
      }
    }
  }
  const ihdr = new Uint8Array(13);
  ihdr.set(writeUint32(input.width), 0);
  ihdr.set(writeUint32(input.height), 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return concatBytes([
    new Uint8Array(PNG_SIGNATURE),
    createChunk('IHDR', ihdr),
    createChunk('IDAT', deflateStored(scanlines)),
    createChunk('IEND', new Uint8Array()),
  ]);
};

const paethPredictor = (left: number, up: number, upLeft: number): number => {
  const p = left + up - upLeft;
  const pa = Math.abs(p - left);
  const pb = Math.abs(p - up);
  const pc = Math.abs(p - upLeft);
  if (pa <= pb && pa <= pc) return left;
  if (pb <= pc) return up;
  return upLeft;
};

export const applyPngFilterReconstruction = (input: {
  filterType: number;
  current: Uint8Array;
  previous?: Uint8Array;
  bytesPerPixel: number;
}): Uint8Array => {
  const output = new Uint8Array(input.current.length);
  for (let index = 0; index < input.current.length; index += 1) {
    const raw = input.current[index] ?? 0;
    const left = index < input.bytesPerPixel ? 0 : output[index - input.bytesPerPixel] ?? 0;
    const up = input.previous?.[index] ?? 0;
    const upLeft = index < input.bytesPerPixel ? 0 : input.previous?.[index - input.bytesPerPixel] ?? 0;
    const predictor =
      input.filterType === 0 ? 0 :
      input.filterType === 1 ? left :
      input.filterType === 2 ? up :
      input.filterType === 3 ? Math.floor((left + up) / 2) :
      input.filterType === 4 ? paethPredictor(left, up, upLeft) :
      Number.NaN;
    if (!Number.isFinite(predictor)) throw new Error(`PNG filter type unsupported:${input.filterType}`);
    output[index] = (raw + predictor) & 0xff;
  }
  return output;
};

export const reconstructPngScanlines = (input: {
  raw: Uint8Array;
  width: number;
  height: number;
  channels: number;
  bytesPerPixel: number;
}): { rows: Uint8Array[]; filterTypesSeen: number[] } => {
  const rowLength = input.width * input.channels + 1;
  if (input.raw.length !== rowLength * input.height) throw new Error('PNG scanline length does not match dimensions');
  const rows: Uint8Array[] = [];
  const filterTypesSeen: number[] = [];
  for (let y = 0; y < input.height; y += 1) {
    const rowOffset = y * rowLength;
    const filterType = input.raw[rowOffset] ?? 0;
    if (!filterTypesSeen.includes(filterType)) filterTypesSeen.push(filterType);
    const current = input.raw.slice(rowOffset + 1, rowOffset + rowLength);
    rows.push(applyPngFilterReconstruction({
      filterType,
      current,
      previous: rows[y - 1],
      bytesPerPixel: input.bytesPerPixel,
    }));
  }
  return { rows, filterTypesSeen: filterTypesSeen.sort((left, right) => left - right) };
};

export const convertPngColorToRgba = (input: {
  rows: readonly Uint8Array[];
  width: number;
  height: number;
  colorType: number;
}): ImagePixelData['pixels'] => {
  const channels = input.colorType === 6 ? 4 : input.colorType === 2 ? 3 : 1;
  const pixels: ImagePixelData['pixels'] = [];
  for (let y = 0; y < input.height; y += 1) {
    const row = input.rows[y] ?? new Uint8Array();
    for (let x = 0; x < input.width; x += 1) {
      const pixelOffset = x * channels;
      if (input.colorType === 0) {
        const value = (row[pixelOffset] ?? 0) / 255;
        pixels.push({ r: value, g: value, b: value, a: 1 });
      } else {
        pixels.push({
          r: (row[pixelOffset] ?? 0) / 255,
          g: (row[pixelOffset + 1] ?? 0) / 255,
          b: (row[pixelOffset + 2] ?? 0) / 255,
          a: input.colorType === 6 ? (row[pixelOffset + 3] ?? 255) / 255 : 1,
        });
      }
    }
  }
  return pixels;
};

export const validatePngDecodeSupport = (input: {
  bitDepth: number;
  colorType: number;
  compressionMethod: number;
  filterMethod: number;
  interlaceMethod: number;
  filterTypesSeen?: readonly number[];
}): ImageDecodeIssue[] => [
  ...(input.bitDepth !== 8 ? [error('png-bit-depth-unsupported', `PNG bit depth unsupported:${input.bitDepth}`)] : []),
  ...(![0, 2, 6].includes(input.colorType) ? [error('png-color-type-unsupported', `PNG color type unsupported:${input.colorType}`)] : []),
  ...(input.compressionMethod !== 0 ? [error('png-compression-unsupported', `PNG compression method unsupported:${input.compressionMethod}`)] : []),
  ...(input.filterMethod !== 0 ? [error('png-filter-method-unsupported', `PNG filter method unsupported:${input.filterMethod}`)] : []),
  ...(input.interlaceMethod !== 0 ? [error('png-interlace-unsupported', `PNG interlace method unsupported:${input.interlaceMethod}`)] : []),
  ...((input.filterTypesSeen ?? []).filter((filterType) => filterType < 0 || filterType > 4)
    .map((filterType) => error('png-filter-unsupported', `PNG filter type unsupported:${filterType}`))),
];

export const summarizePngCodecSupport = (summary: PngCodecSupportSummary): string =>
  `png-support:bitDepth=${summary.bitDepth}:colorType=${summary.colorType}:interlace=${summary.interlaceMethod}:filters=${summary.filterTypesSeen.join(',') || 'none'}:${summary.supported ? 'ready' : summary.issueCodes.join(',')}`;

const decodePngPixels = (content: Uint8Array): { width: number; height: number; pixels: ImagePixelData['pixels']; colorType: number; support: PngCodecSupportSummary } => {
  for (let index = 0; index < PNG_SIGNATURE.length; index += 1) {
    if (content[index] !== PNG_SIGNATURE[index]) throw new Error('File is not a PNG');
  }
  let offset = PNG_SIGNATURE.length;
  let width = 0;
  let height = 0;
  let colorType = 6;
  let bitDepth = 8;
  let compressionMethod = 0;
  let filterMethod = 0;
  let interlaceMethod = 0;
  const idatChunks: Uint8Array[] = [];
  while (offset < content.length) {
    const length = readUint32(content, offset);
    offset += 4;
    const type = String.fromCharCode(...content.slice(offset, offset + 4));
    offset += 4;
    const data = content.slice(offset, offset + length);
    offset += length;
    const expectedCrc = readUint32(content, offset);
    offset += 4;
    if (crc32(concatBytes([textEncoder.encode(type), data])) !== expectedCrc) throw new Error(`PNG chunk CRC mismatch:${type}`);
    if (type === 'IHDR') {
      width = readUint32(data, 0);
      height = readUint32(data, 4);
      bitDepth = data[8] ?? 0;
      colorType = data[9] ?? 6;
      compressionMethod = data[10] ?? 0;
      filterMethod = data[11] ?? 0;
      interlaceMethod = data[12] ?? 0;
      const supportIssues = validatePngDecodeSupport({ bitDepth, colorType, compressionMethod, filterMethod, interlaceMethod });
      if (supportIssues.length > 0) throw new Error(supportIssues.map((issue) => issue.message).join('; '));
    } else if (type === 'IDAT') {
      idatChunks.push(data);
    } else if (type === 'IEND') {
      break;
    }
  }
  const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : 1;
  const raw = inflateStored(concatBytes(idatChunks));
  const bytesPerPixel = channels;
  const reconstructed = reconstructPngScanlines({ raw, width, height, channels, bytesPerPixel });
  const supportIssues = validatePngDecodeSupport({
    bitDepth,
    colorType,
    compressionMethod,
    filterMethod,
    interlaceMethod,
    filterTypesSeen: reconstructed.filterTypesSeen,
  });
  if (supportIssues.length > 0) throw new Error(supportIssues.map((issue) => issue.message).join('; '));
  const support = {
    bitDepth,
    colorType,
    interlaceMethod,
    compressionMethod,
    filterMethod,
    supported: true,
    issueCodes: [] as string[],
    filterTypesSeen: reconstructed.filterTypesSeen,
  };
  return { width, height, pixels: convertPngColorToRgba({ rows: reconstructed.rows, width, height, colorType }), colorType, support };
};

export const createImageDecoderBoundary = (): ImageDecoderCapabilities[] => [
  { kind: 'json-rgba-grid', supportsDecode: true, supportsEncode: true, dependencyFree: true },
  { kind: 'raw-rgba-binary', supportsDecode: true, supportsEncode: true, dependencyFree: true },
  { kind: 'png-image', supportsDecode: true, supportsEncode: true, dependencyFree: true },
  { kind: 'png-image-placeholder', supportsDecode: true, supportsEncode: false, dependencyFree: true },
  { kind: 'jpeg-image-placeholder', supportsDecode: false, supportsEncode: false, dependencyFree: true },
];

export const validateDecodedImagePixelGrid = (
  grid: DecodedImagePixelGrid,
): ImageDecodeValidationResult => {
  const issues = [
    ...(grid.width <= 0 || grid.height <= 0 ? [error('decoded-image-size-invalid', 'decoded image dimensions must be positive')] : []),
    ...(grid.pixels.length !== grid.width * grid.height
      ? [error('decoded-image-pixel-count-invalid', 'decoded pixel count must match width * height')]
      : []),
  ];
  return { valid: issues.length === 0, issues };
};

export const decodeJsonRgbaImageArtifact = (
  artifact: ImagePixelArtifact,
): ImageDecodeResult => {
  const validation = validateImagePixelArtifact(artifact);
  if (!validation.valid) {
    return {
      decoded: null,
      validation: {
        valid: false,
        issues: validation.errors.map((message) => error('json-rgba-invalid', message)),
      },
    };
  }
  const decoded = {
    ...normalizeImagePixelData(artifact),
    imageId: artifact.imageId,
    decoderKind: 'json-rgba-grid' as const,
  };
  const gridValidation = validateDecodedImagePixelGrid(decoded);
  return { decoded, validation: gridValidation };
};

export const decodeRawRgbaImageArtifact = (
  content: string,
  imageId = 'raw-rgba-image',
): ImageDecodeResult => {
  const raw = readRawRgbaBinaryArtifact(content);
  const errors = validateRawRgbaBinaryArtifact(raw);
  if (errors.length > 0) {
    return {
      decoded: null,
      validation: { valid: false, issues: errors.map((message) => error('raw-rgba-invalid', message)) },
    };
  }
  const decoded = {
    ...rawRgbaBinaryToImagePixelData(raw),
    imageId,
    decoderKind: 'raw-rgba-binary' as const,
  };
  return { decoded, validation: validateDecodedImagePixelGrid(decoded) };
};

export const decodePngImagePlaceholder = (): ImageDecodeResult => ({
  decoded: null,
  validation: {
    valid: false,
    issues: [error('png-image-unsupported', 'PNG image decoding is an explicit Phase 6F boundary and is not implemented')],
  },
});

export const createPngImageSidecarMetadata = (input: {
  imageId: string;
  sampleId?: string;
  width: number;
  height: number;
  checksum: string;
  source?: 'training-fixture' | 'materialized-image-reference';
}): PngImageSidecarMetadata => ({
  schemaVersion: PNG_IMAGE_SIDECAR_SCHEMA_VERSION,
  imageId: input.imageId,
  sampleId: input.sampleId,
  width: input.width,
  height: input.height,
  channels: 4,
  colorSpace: 'srgb',
  alphaMode: 'straight-alpha',
  codecKind: 'png',
  codecVersion: PNG_IMAGE_CODEC_VERSION,
  checksum: input.checksum,
  source: input.source ?? 'training-fixture',
});

export const decodePngImageArtifact = (
  content: string | Uint8Array,
  options: PngImageDecodeOptions = {},
): PngImageDecodeResult => {
  try {
    const bytes = typeof content === 'string' ? Uint8Array.from([...content].map((char) => char.charCodeAt(0) & 0xff)) : content;
    const decoded = decodePngPixels(bytes);
    const imageId = options.imageId ?? options.sidecarMetadata?.imageId ?? 'png-image';
    const grid: DecodedImagePixelGrid = {
      width: decoded.width,
      height: decoded.height,
      colorSpace: 'srgb',
      pixels: decoded.pixels,
      imageId,
      decoderKind: 'png-image',
    };
    const validation = {
      valid: true,
      issues: [
        ...(options.sidecarMetadata && options.sidecarMetadata.width !== decoded.width
          ? [error('png-image-dimension-mismatch', 'PNG sidecar width does not match decoded image')]
          : []),
        ...(options.sidecarMetadata && options.sidecarMetadata.height !== decoded.height
          ? [error('png-image-dimension-mismatch', 'PNG sidecar height does not match decoded image')]
          : []),
      ],
    };
    return {
      codec: 'png-image',
      sourceUri: options.sourceUri,
      support: decoded.support,
      decoded: grid,
      validation: { valid: validation.issues.length === 0, issues: validation.issues },
    };
  } catch (decodeError) {
    return {
      codec: 'png-image',
      sourceUri: options.sourceUri,
      support: {
        bitDepth: 0,
        colorType: -1,
        interlaceMethod: -1,
        compressionMethod: -1,
        filterMethod: -1,
        supported: false,
        issueCodes: ['png-image-decode-failed'],
        filterTypesSeen: [],
      },
      decoded: null,
      validation: {
        valid: false,
        issues: [error('png-image-decode-failed', decodeError instanceof Error ? decodeError.message : 'PNG image decode failed')],
      },
    };
  }
};

export const validatePngImageArtifact = (
  result: PngImageDecodeResult,
): ImageDecodeValidationResult => result.validation;

export const convertDecodedPngToImagePixelData = (
  result: PngImageDecodeResult,
): ImagePixelData | null => result.decoded;

export const convertPngImageToJsonRgbaGrid = (
  content: Uint8Array,
  options: PngImageDecodeOptions & { artifactId?: string; createdAt?: string } = {},
): ImagePixelArtifact | null => {
  const result = decodePngImageArtifact(content, options);
  if (!result.decoded) return null;
  return {
    artifactId: options.artifactId ?? `${result.decoded.imageId}-png-json-rgba`,
    schemaVersion: 'image-pixel-artifact-v0.1',
    imageId: result.decoded.imageId,
    width: result.decoded.width,
    height: result.decoded.height,
    format: 'json-rgba-grid',
    colorSpace: 'srgb',
    pixels: {
      width: result.decoded.width,
      height: result.decoded.height,
      channels: 4,
      values: result.decoded.pixels.flatMap((pixel) => [pixel.r, pixel.g, pixel.b, pixel.a]),
    },
    checksum: checksumBytes(content),
    sourceImageReference: options.sourceUri ?? 'png-image',
    createdAt: options.createdAt ?? '2026-05-30T00:00:00.000Z',
    metadata: { source: 'synthetic-fixture', notes: ['decoded from png-image'] },
  };
};

export const convertPngImageToRawRgbaBinary = (
  content: Uint8Array,
  options: PngImageDecodeOptions = {},
): { magic: 'MEARGBA'; version: 1; width: number; height: number; channels: 4; colorSpace: 'srgb'; values: number[] } | null => {
  const result = decodePngImageArtifact(content, options);
  if (!result.decoded) return null;
  return {
    magic: 'MEARGBA',
    version: 1,
    width: result.decoded.width,
    height: result.decoded.height,
    channels: 4,
    colorSpace: 'srgb',
    values: result.decoded.pixels.flatMap((pixel) => [
      Math.round(pixel.r * 255),
      Math.round(pixel.g * 255),
      Math.round(pixel.b * 255),
      Math.round(pixel.a * 255),
    ]),
  };
};

export const assertPngImageDecodeRoundTrip = (input: {
  width: number;
  height: number;
  rgba: readonly number[];
  imageId?: string;
}): { passed: boolean; maxChannelDelta: number; meanChannelDelta: number; issues: ImageDecodeIssue[] } => {
  const png = encodeRgbaPngImage(input);
  const decoded = decodePngImageArtifact(png, { imageId: input.imageId });
  const actual = decoded.decoded?.pixels.flatMap((pixel) => [
    Math.round(pixel.r * 255),
    Math.round(pixel.g * 255),
    Math.round(pixel.b * 255),
    Math.round(pixel.a * 255),
  ]) ?? [];
  const deltas = input.rgba.map((value, index) => Math.abs(value - (actual[index] ?? -1)));
  const maxChannelDelta = deltas.length ? Math.max(...deltas) : 0;
  const meanChannelDelta = deltas.length ? deltas.reduce((sum, value) => sum + value, 0) / deltas.length : 0;
  const issues = [
    ...decoded.validation.issues,
    ...(maxChannelDelta > 0 ? [error('png-image-roundtrip-failed', 'PNG image channel round-trip changed values')] : []),
  ];
  return { passed: issues.length === 0, maxChannelDelta, meanChannelDelta, issues };
};

export const summarizePngDecodeResult = (
  result: PngImageDecodeResult,
): string =>
  result.decoded
    ? `png-image:${result.decoded.width}x${result.decoded.height}:decoded`
    : `png-image:failed:${result.validation.issues.map((issue) => issue.code).join(',')}`;

export const summarizeImageCodecResult = (
  result: ImageDecodeResult,
  codec: ImageCodecSummary['codec'],
): ImageCodecSummary => ({
  codec,
  supported: result.validation.valid,
  issueCodes: result.validation.issues.map((issue) => issue.code).sort(),
});

export const decodeJpegImagePlaceholder = (): ImageDecodeResult => ({
  decoded: null,
  validation: {
    valid: false,
    issues: [error('jpeg-image-unsupported', 'JPEG image decoding is an explicit Phase 6F boundary and is not implemented')],
  },
});

export const summarizeImageDecodeResult = (result: ImageDecodeResult): string =>
  result.decoded
    ? `decoded:${result.decoded.decoderKind}:${result.decoded.width}x${result.decoded.height}`
    : `decode-failed:${result.validation.issues.map((issue) => issue.code).join(',')}`;
