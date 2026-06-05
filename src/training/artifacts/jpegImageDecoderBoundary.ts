import type { ImagePixelData } from '../schema';
import { readExifOrientationFromJpegBytes, summarizeExifOrientation, type JpegExifOrientation } from './exifOrientation';

export interface JpegImageDecodeIssue {
  severity: 'error' | 'warning';
  code: string;
  message: string;
}

export interface JpegImageSidecarMetadata {
  imageId: string;
  width?: number;
  height?: number;
  checksum?: string;
  orientation?: JpegExifOrientation;
}

export interface JpegImageCodecReadiness {
  codec: 'jpeg-image';
  ready: false;
  boundary: 'metadata-only';
  issueCodes: string[];
  orientation: JpegExifOrientation;
}

export interface JpegDecodeOptions {
  imageId?: string;
  strict?: boolean;
  sidecarMetadata?: JpegImageSidecarMetadata;
}

export interface JpegImageDecodeResult {
  decoded: ImagePixelData | null;
  width?: number;
  height?: number;
  orientation: JpegExifOrientation;
  validation: {
    valid: boolean;
    issues: JpegImageDecodeIssue[];
  };
  readiness: JpegImageCodecReadiness;
}

const issue = (code: string, message: string, severity: JpegImageDecodeIssue['severity'] = 'error'): JpegImageDecodeIssue => ({
  severity,
  code,
  message,
});

const readJpegDimensions = (bytes: Uint8Array): { width?: number; height?: number } => {
  let offset = 2;
  while (offset + 8 < bytes.length) {
    if (bytes[offset] !== 0xff) break;
    const marker = bytes[offset + 1] ?? 0;
    const length = ((bytes[offset + 2] ?? 0) << 8) | (bytes[offset + 3] ?? 0);
    if ([0xc0, 0xc1, 0xc2].includes(marker)) {
      return {
        height: ((bytes[offset + 5] ?? 0) << 8) | (bytes[offset + 6] ?? 0),
        width: ((bytes[offset + 7] ?? 0) << 8) | (bytes[offset + 8] ?? 0),
      };
    }
    if (length < 2) break;
    offset += 2 + length;
  }
  return {};
};

export const readJpegExifOrientation = (bytes: Uint8Array): JpegExifOrientation =>
  readExifOrientationFromJpegBytes(bytes);

export const normalizeJpegOrientation = (orientation: JpegExifOrientation): JpegExifOrientation =>
  orientation === 'unsupported' ? 'unsupported' : orientation;

export const decodeJpegImageArtifact = (
  bytes: Uint8Array,
  options: JpegDecodeOptions = {},
): JpegImageDecodeResult => {
  const validSignature = bytes[0] === 0xff && bytes[1] === 0xd8;
  const orientation = validSignature ? readJpegExifOrientation(bytes) : 'unsupported';
  const dimensions = validSignature ? readJpegDimensions(bytes) : {};
  const issues = [
    ...(!validSignature ? [issue('jpeg-signature-invalid', 'File is not a JPEG image')] : []),
    issue('jpeg-decode-unsupported', 'JPEG decode is a metadata-only boundary in this phase; convert to PNG/JSON RGBA before training'),
    ...(orientation === 'unsupported'
      ? [issue('exif-orientation-unsupported', 'JPEG EXIF orientation is unsupported')]
      : []),
  ];
  return {
    decoded: null,
    width: options.sidecarMetadata?.width ?? dimensions.width,
    height: options.sidecarMetadata?.height ?? dimensions.height,
    orientation,
    validation: { valid: false, issues },
    readiness: {
      codec: 'jpeg-image',
      ready: false,
      boundary: 'metadata-only',
      issueCodes: issues.map((entry) => entry.code).sort(),
      orientation,
    },
  };
};

export const validateJpegImageArtifact = (result: JpegImageDecodeResult): JpegImageDecodeIssue[] =>
  result.validation.issues;

export const convertDecodedJpegToImagePixelData = (result: JpegImageDecodeResult): ImagePixelData | null =>
  result.decoded;

export const summarizeJpegDecodeResult = (result: JpegImageDecodeResult): string =>
  `jpeg-boundary:${result.width ?? 'unknown'}x${result.height ?? 'unknown'}:orientation=${summarizeExifOrientation(result.orientation).orientation}:issues=${result.validation.issues.map((entry) => entry.code).join(',')}`;
