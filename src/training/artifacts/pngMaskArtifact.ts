import type { CosmeticSegmentationTarget } from '../../vision';
import type { PngMaskSidecarMetadata } from '../schema/png-mask-codec.schema';
import {
  PNG_MASK_CODEC_SCHEMA_VERSION,
  PNG_MASK_CODEC_VERSION,
  PNG_MASK_SIDECAR_SCHEMA_VERSION,
} from '../schema/png-mask-codec.schema';
import type { TrainingBridgeValidationIssue } from '../schema';
import type { BinaryMaskBlob } from './maskMaterializer';
import { binaryMaskToTrainingMaskPayload, convertJsonAlphaGridToBinaryMask } from './maskMaterializer';
import type { TrainingMaskArtifactPayload } from './maskArtifactIO';

export interface PngAlphaMaskArtifact {
  artifactId: string;
  sampleId: string;
  imageId?: string;
  regionId: CosmeticSegmentationTarget;
  target: CosmeticSegmentationTarget;
  format: 'png-alpha-mask';
  width: number;
  height: number;
  referenceUri: string;
  checksum: string;
  alphaEncoding: 'uint8-alpha';
  codecKind: 'png';
  codecVersion: typeof PNG_MASK_CODEC_VERSION;
  coordinateSpace: 'image-pixel';
  sidecarMetadata?: PngMaskSidecarMetadata;
}

export interface PngAlphaMaskReadOptions {
  strict?: boolean;
  referenceUri?: string;
  sidecarMetadata?: PngMaskSidecarMetadata;
}

export interface PngAlphaMaskWriteOptions {
  artifactId?: string;
  sampleId: string;
  imageId?: string;
  regionId: CosmeticSegmentationTarget;
  target?: CosmeticSegmentationTarget;
  referenceUri: string;
  coordinateSpace?: 'image-pixel';
}

export interface PngAlphaMaskDecodeResult {
  artifact: PngAlphaMaskArtifact | null;
  payload: TrainingMaskArtifactPayload | null;
  alpha: number[];
  issues: TrainingBridgeValidationIssue[];
}

export interface PngAlphaMaskEncodeResult {
  artifact: PngAlphaMaskArtifact | null;
  content: Uint8Array | null;
  sidecarMetadata: PngMaskSidecarMetadata | null;
  issues: TrainingBridgeValidationIssue[];
}

const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10] as const;
const MAX_QUANTIZATION_DELTA = 1 / 255;

const issue = (
  code: string,
  message: string,
  severity: TrainingBridgeValidationIssue['severity'] = 'error',
): TrainingBridgeValidationIssue => ({ code, message, severity });

const clamp01 = (value: number): number =>
  Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));

const round4 = (value: number): number => Number(value.toFixed(4));

const textEncoder = new TextEncoder();

const concatBytes = (chunks: readonly Uint8Array[]): Uint8Array => {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const output = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return output;
};

const writeUint32 = (value: number): Uint8Array =>
  new Uint8Array([
    (value >>> 24) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 8) & 0xff,
    value & 0xff,
  ]);

const readUint32 = (bytes: Uint8Array, offset: number): number =>
  (((bytes[offset] ?? 0) << 24) |
    ((bytes[offset + 1] ?? 0) << 16) |
    ((bytes[offset + 2] ?? 0) << 8) |
    (bytes[offset + 3] ?? 0)) >>> 0;

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }
  return table;
})();

const crc32 = (bytes: Uint8Array): number => {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc = (crc >>> 8) ^ (crcTable[(crc ^ byte) & 0xff] ?? 0);
  }
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

const checksumBytes = (bytes: Uint8Array): string =>
  crc32(bytes).toString(16).padStart(8, '0');

const createChunk = (type: string, data: Uint8Array): Uint8Array => {
  const typeBytes = textEncoder.encode(type);
  const crcInput = concatBytes([typeBytes, data]);
  return concatBytes([
    writeUint32(data.length),
    typeBytes,
    data,
    writeUint32(crc32(crcInput)),
  ]);
};

const deflateStored = (raw: Uint8Array): Uint8Array => {
  const chunks: Uint8Array[] = [new Uint8Array([0x78, 0x01])];
  for (let offset = 0; offset < raw.length; offset += 65535) {
    const length = Math.min(65535, raw.length - offset);
    const final = offset + length >= raw.length ? 1 : 0;
    chunks.push(new Uint8Array([
      final,
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

const inflateStored = (stream: Uint8Array): Uint8Array => {
  if (stream.length < 6) throw new Error('PNG IDAT zlib stream is too short');
  let offset = 2;
  const chunks: Uint8Array[] = [];
  let final = 0;
  while (final === 0) {
    const header = stream[offset];
    if (header === undefined) throw new Error('PNG IDAT deflate block header is missing');
    final = header & 1;
    const blockType = (header >>> 1) & 0x03;
    if (blockType !== 0) throw new Error('PNG alpha mask codec only supports stored deflate blocks');
    offset += 1;
    const length = (stream[offset] ?? 0) | ((stream[offset + 1] ?? 0) << 8);
    const inverse = (stream[offset + 2] ?? 0) | ((stream[offset + 3] ?? 0) << 8);
    if (((length ^ 0xffff) & 0xffff) !== inverse) {
      throw new Error('PNG IDAT stored block length checksum mismatch');
    }
    offset += 4;
    chunks.push(stream.slice(offset, offset + length));
    offset += length;
  }
  const raw = concatBytes(chunks);
  const expected = readUint32(stream, stream.length - 4);
  if (adler32(raw) !== expected) throw new Error('PNG IDAT Adler-32 checksum mismatch');
  return raw;
};

const encodeGrayscalePng = (input: {
  width: number;
  height: number;
  alpha: readonly number[];
}): Uint8Array => {
  const scanlines = new Uint8Array((input.width + 1) * input.height);
  for (let y = 0; y < input.height; y += 1) {
    const rowOffset = y * (input.width + 1);
    scanlines[rowOffset] = 0;
    for (let x = 0; x < input.width; x += 1) {
      const alpha = clamp01(input.alpha[y * input.width + x] ?? 0);
      scanlines[rowOffset + 1 + x] = Math.round(alpha * 255);
    }
  }
  const ihdr = new Uint8Array(13);
  ihdr.set(writeUint32(input.width), 0);
  ihdr.set(writeUint32(input.height), 4);
  ihdr[8] = 8;
  ihdr[9] = 0;
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

const decodeGrayscalePng = (bytes: Uint8Array): {
  width: number;
  height: number;
  alpha: number[];
} => {
  for (let index = 0; index < PNG_SIGNATURE.length; index += 1) {
    if (bytes[index] !== PNG_SIGNATURE[index]) throw new Error('File is not a PNG');
  }
  let offset = PNG_SIGNATURE.length;
  let width = 0;
  let height = 0;
  const idatChunks: Uint8Array[] = [];
  while (offset < bytes.length) {
    const length = readUint32(bytes, offset);
    offset += 4;
    const type = String.fromCharCode(...bytes.slice(offset, offset + 4));
    offset += 4;
    const data = bytes.slice(offset, offset + length);
    offset += length;
    const expectedCrc = readUint32(bytes, offset);
    offset += 4;
    const actualCrc = crc32(concatBytes([textEncoder.encode(type), data]));
    if (actualCrc !== expectedCrc) throw new Error(`PNG chunk CRC mismatch:${type}`);
    if (type === 'IHDR') {
      width = readUint32(data, 0);
      height = readUint32(data, 4);
      if (data[8] !== 8 || data[9] !== 0 || data[10] !== 0 || data[11] !== 0 || data[12] !== 0) {
        throw new Error('PNG alpha mask codec only supports 8-bit grayscale non-interlaced PNG');
      }
    } else if (type === 'IDAT') {
      idatChunks.push(data);
    } else if (type === 'IEND') {
      break;
    }
  }
  if (width <= 0 || height <= 0) throw new Error('PNG IHDR is missing or invalid');
  const raw = inflateStored(concatBytes(idatChunks));
  const expectedLength = (width + 1) * height;
  if (raw.length !== expectedLength) throw new Error('PNG scanline length does not match dimensions');
  const alpha: number[] = [];
  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * (width + 1);
    if (raw[rowOffset] !== 0) throw new Error('PNG alpha mask codec only supports filter type 0');
    for (let x = 0; x < width; x += 1) {
      alpha.push(round4((raw[rowOffset + 1 + x] ?? 0) / 255));
    }
  }
  return { width, height, alpha };
};

const alphaStats = (alpha: readonly number[]): TrainingMaskArtifactPayload['alphaStats'] => ({
  min: alpha.length ? round4(Math.min(...alpha)) : 0,
  max: alpha.length ? round4(Math.max(...alpha)) : 0,
  mean: alpha.length ? round4(alpha.reduce((sum, value) => sum + value, 0) / alpha.length) : 0,
  activeRatio: alpha.length ? round4(alpha.filter((value) => value > 0).length / alpha.length) : 0,
});

export const createPngAlphaMaskSidecarMetadata = (input: {
  maskId: string;
  sampleId: string;
  imageId?: string;
  regionId: CosmeticSegmentationTarget;
  target: CosmeticSegmentationTarget;
  width: number;
  height: number;
  checksum: string;
  sourceAlphaGridChecksum?: string;
  sourceBinaryMaskChecksum?: string;
}): PngMaskSidecarMetadata => ({
  schemaVersion: PNG_MASK_SIDECAR_SCHEMA_VERSION,
  maskId: input.maskId,
  sampleId: input.sampleId,
  imageId: input.imageId,
  regionId: input.regionId,
  target: input.target,
  width: input.width,
  height: input.height,
  coordinateSpace: 'image-pixel',
  alphaEncoding: 'uint8-alpha',
  codecKind: 'png',
  codecVersion: PNG_MASK_CODEC_VERSION,
  checksum: input.checksum,
  sourceAlphaGridChecksum: input.sourceAlphaGridChecksum,
  sourceBinaryMaskChecksum: input.sourceBinaryMaskChecksum,
});

export const writePngAlphaMaskArtifact = (
  payload: TrainingMaskArtifactPayload,
  options: PngAlphaMaskWriteOptions,
): PngAlphaMaskEncodeResult => {
  const alpha = payload.alphaGrid?.alpha;
  const issues = [
    ...(payload.width <= 0 || payload.height <= 0
      ? [issue('png-alpha-mask-dimension-invalid', 'PNG alpha mask width and height must be positive')]
      : []),
    ...(!alpha || alpha.length !== payload.width * payload.height
      ? [issue('png-alpha-mask-alpha-grid-invalid', 'PNG alpha mask requires alpha grid length equal to width * height')]
      : []),
  ];
  if (issues.length > 0 || !alpha) return { artifact: null, content: null, sidecarMetadata: null, issues };
  const content = encodeGrayscalePng({ width: payload.width, height: payload.height, alpha });
  const checksum = checksumBytes(content);
  const artifactId = options.artifactId ?? `${payload.checksum}-png`;
  const sidecarMetadata = createPngAlphaMaskSidecarMetadata({
    maskId: artifactId,
    sampleId: options.sampleId,
    imageId: options.imageId,
    regionId: options.regionId,
    target: options.target ?? options.regionId,
    width: payload.width,
    height: payload.height,
    checksum,
    sourceAlphaGridChecksum: payload.checksum,
  });
  return {
    artifact: {
      artifactId,
      sampleId: options.sampleId,
      imageId: options.imageId,
      regionId: options.regionId,
      target: options.target ?? options.regionId,
      format: 'png-alpha-mask',
      width: payload.width,
      height: payload.height,
      referenceUri: options.referenceUri,
      checksum,
      alphaEncoding: 'uint8-alpha',
      codecKind: 'png',
      codecVersion: PNG_MASK_CODEC_VERSION,
      coordinateSpace: options.coordinateSpace ?? 'image-pixel',
      sidecarMetadata,
    },
    content,
    sidecarMetadata,
    issues: [],
  };
};

export const readPngAlphaMaskArtifact = (
  content: Uint8Array,
  options: PngAlphaMaskReadOptions = {},
): PngAlphaMaskDecodeResult => {
  try {
    const decoded = decodeGrayscalePng(content);
    const sidecar = options.sidecarMetadata;
    const regionId = sidecar?.regionId ?? 'lips';
    const checksum = checksumBytes(content);
    const payload: TrainingMaskArtifactPayload = {
      format: 'json-alpha-grid',
      width: decoded.width,
      height: decoded.height,
      regionId,
      target: sidecar?.target ?? regionId,
      alphaGrid: {
        width: decoded.width,
        height: decoded.height,
        alpha: decoded.alpha,
      },
      alphaStats: alphaStats(decoded.alpha),
      bounds: null,
      checksum,
      sourceArtifactUri: options.referenceUri ?? sidecar?.maskId ?? 'png-alpha-mask',
    };
    const artifact: PngAlphaMaskArtifact = {
      artifactId: sidecar?.maskId ?? checksum,
      sampleId: sidecar?.sampleId ?? 'unknown-sample',
      imageId: sidecar?.imageId,
      regionId,
      target: sidecar?.target ?? regionId,
      format: 'png-alpha-mask',
      width: decoded.width,
      height: decoded.height,
      referenceUri: options.referenceUri ?? `materialized://masks-png/${checksum}.png`,
      checksum,
      alphaEncoding: 'uint8-alpha',
      codecKind: 'png',
      codecVersion: PNG_MASK_CODEC_VERSION,
      coordinateSpace: 'image-pixel',
      sidecarMetadata: sidecar,
    };
    return { artifact, payload, alpha: decoded.alpha, issues: [] };
  } catch (error) {
    return {
      artifact: null,
      payload: null,
      alpha: [],
      issues: [
        issue(
          'png-alpha-mask-decode-failed',
          error instanceof Error ? error.message : 'PNG alpha mask decode failed',
        ),
      ],
    };
  }
};

export const convertJsonAlphaGridToPngAlphaMask = writePngAlphaMaskArtifact;

export const convertPngAlphaMaskToJsonAlphaGrid = readPngAlphaMaskArtifact;

export const convertBinaryAlphaMaskToPngAlphaMask = (
  blob: BinaryMaskBlob,
  options: PngAlphaMaskWriteOptions,
): PngAlphaMaskEncodeResult =>
  writePngAlphaMaskArtifact(
    binaryMaskToTrainingMaskPayload(blob, options.artifactId ?? blob.regionId, options.referenceUri),
    options,
  );

export const convertPngAlphaMaskToBinaryAlphaMask = (
  content: Uint8Array,
  options: PngAlphaMaskReadOptions = {},
): { blob: BinaryMaskBlob | null; issues: TrainingBridgeValidationIssue[] } => {
  const decoded = readPngAlphaMaskArtifact(content, options);
  if (!decoded.payload) return { blob: null, issues: decoded.issues };
  return { blob: convertJsonAlphaGridToBinaryMask(decoded.payload), issues: [] };
};

export const validatePngAlphaMaskArtifact = (
  artifact: PngAlphaMaskArtifact | null,
): TrainingBridgeValidationIssue[] => [
  ...(!artifact ? [issue('png-alpha-mask-missing', 'PNG alpha mask artifact is missing')] : []),
  ...(artifact && artifact.width <= 0 ? [issue('png-mask-dimension-mismatch', 'PNG alpha mask width must be positive')] : []),
  ...(artifact && artifact.height <= 0 ? [issue('png-mask-dimension-mismatch', 'PNG alpha mask height must be positive')] : []),
  ...(artifact && artifact.format !== 'png-alpha-mask'
    ? [issue('png-alpha-mask-format-invalid', 'PNG alpha mask artifact format must be png-alpha-mask')]
    : []),
  ...(artifact && artifact.alphaEncoding !== 'uint8-alpha'
    ? [issue('png-alpha-mask-encoding-invalid', 'PNG alpha mask alphaEncoding must be uint8-alpha')]
    : []),
];

export const assertPngAlphaMaskRoundTrip = (input: {
  payload: TrainingMaskArtifactPayload;
  options: PngAlphaMaskWriteOptions;
  maxAllowedDelta?: number;
}): {
  passed: boolean;
  maxAlphaDelta: number;
  meanAlphaDelta: number;
  issues: TrainingBridgeValidationIssue[];
} => {
  const encoded = writePngAlphaMaskArtifact(input.payload, input.options);
  if (!encoded.content) {
    return { passed: false, maxAlphaDelta: 1, meanAlphaDelta: 1, issues: encoded.issues };
  }
  const decoded = readPngAlphaMaskArtifact(encoded.content, { sidecarMetadata: encoded.sidecarMetadata ?? undefined });
  const source = input.payload.alphaGrid?.alpha ?? [];
  const target = decoded.payload?.alphaGrid?.alpha ?? [];
  const deltas = source.map((value, index) => Math.abs(clamp01(value) - (target[index] ?? 0)));
  const maxAlphaDelta = deltas.length ? Math.max(...deltas) : 0;
  const meanAlphaDelta = deltas.length ? deltas.reduce((sum, value) => sum + value, 0) / deltas.length : 0;
  const limit = input.maxAllowedDelta ?? MAX_QUANTIZATION_DELTA + 0.0001;
  const issues = [
    ...decoded.issues,
    ...(maxAlphaDelta > limit
      ? [issue('png-alpha-mask-roundtrip-failed', `PNG alpha mask round-trip exceeded max delta ${limit}`)]
      : []),
  ];
  return {
    passed: issues.length === 0,
    maxAlphaDelta: round4(maxAlphaDelta),
    meanAlphaDelta: round4(meanAlphaDelta),
    issues,
  };
};

export const summarizePngAlphaMaskArtifact = (
  artifact: PngAlphaMaskArtifact | null,
): string =>
  artifact
    ? `png-alpha-mask:${artifact.regionId}:${artifact.width}x${artifact.height}:checksum=${artifact.checksum}`
    : 'png-alpha-mask:missing';

export const summarizePngMaskCodec = (): string =>
  `${PNG_MASK_CODEC_SCHEMA_VERSION}:${PNG_MASK_CODEC_VERSION}:grayscale-uint8:stored-deflate`;
