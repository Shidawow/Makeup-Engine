import type { PngMaskRoundTripReport, PngMaskSidecarMetadata } from '../schema/png-mask-codec.schema';
import { PNG_MASK_CODEC_SCHEMA_VERSION } from '../schema/png-mask-codec.schema';
import type { TrainingBridgeValidationIssue } from '../schema';
import type { BinaryMaskBlob } from '../artifacts/maskMaterializer';
import type { TrainingMaskArtifactPayload } from '../artifacts/maskArtifactIO';
import {
  assertPngAlphaMaskRoundTrip,
  convertPngAlphaMaskToBinaryAlphaMask,
  readPngAlphaMaskArtifact,
} from '../artifacts/pngMaskArtifact';

const issue = (
  code: string,
  message: string,
  severity: TrainingBridgeValidationIssue['severity'] = 'error',
): TrainingBridgeValidationIssue => ({ code, message, severity });

const round4 = (value: number): number => Number(value.toFixed(4));

export const validatePngMaskSidecar = (
  sidecar: PngMaskSidecarMetadata | null,
  expected?: Partial<PngMaskSidecarMetadata>,
): TrainingBridgeValidationIssue[] => [
  ...(!sidecar ? [issue('codec-sidecar-missing', 'PNG mask sidecar metadata is missing')] : []),
  ...(sidecar && sidecar.schemaVersion !== 'png-alpha-mask-sidecar.v1'
    ? [issue('codec-sidecar-mismatch', 'PNG mask sidecar schemaVersion is invalid')]
    : []),
  ...(sidecar && expected?.sampleId && sidecar.sampleId !== expected.sampleId
    ? [issue('codec-sidecar-mismatch', 'PNG mask sidecar sampleId does not match')]
    : []),
  ...(sidecar && expected?.imageId && sidecar.imageId !== expected.imageId
    ? [issue('codec-sidecar-mismatch', 'PNG mask sidecar imageId does not match')]
    : []),
  ...(sidecar && expected?.regionId && sidecar.regionId !== expected.regionId
    ? [issue('png-mask-lineage-mismatch', 'PNG mask sidecar regionId does not match')]
    : []),
  ...(sidecar && expected?.width && sidecar.width !== expected.width
    ? [issue('png-mask-dimension-mismatch', 'PNG mask sidecar width does not match')]
    : []),
  ...(sidecar && expected?.height && sidecar.height !== expected.height
    ? [issue('png-mask-dimension-mismatch', 'PNG mask sidecar height does not match')]
    : []),
  ...(sidecar && sidecar.coordinateSpace !== 'image-pixel'
    ? [issue('png-mask-coordinate-space-mismatch', 'PNG mask coordinateSpace must be image-pixel')]
    : []),
];

export const validatePngMaskAgainstAlphaGrid = (input: {
  pngBytes: Uint8Array;
  sidecar: PngMaskSidecarMetadata;
  payload: TrainingMaskArtifactPayload;
  maxAllowedDelta?: number;
}): PngMaskRoundTripReport => {
  const decoded = readPngAlphaMaskArtifact(input.pngBytes, { sidecarMetadata: input.sidecar });
  const source = input.payload.alphaGrid?.alpha ?? [];
  const target = decoded.payload?.alphaGrid?.alpha ?? [];
  const deltas = source.map((value, index) => Math.abs(value - (target[index] ?? 0)));
  const maxAlphaDelta = deltas.length ? Math.max(...deltas) : 0;
  const meanAlphaDelta = deltas.length ? deltas.reduce((sum, value) => sum + value, 0) / deltas.length : 0;
  const changedPixelRatio = deltas.length
    ? deltas.filter((value) => value > (input.maxAllowedDelta ?? 1 / 255 + 0.0001)).length / deltas.length
    : 0;
  const blockingIssues = [
    ...decoded.issues,
    ...validatePngMaskSidecar(input.sidecar, {
      sampleId: input.sidecar.sampleId,
      imageId: input.sidecar.imageId,
      regionId: input.payload.regionId,
      width: input.payload.width,
      height: input.payload.height,
    }),
    ...(changedPixelRatio > 0
      ? [issue('png-alpha-mask-roundtrip-failed', 'PNG alpha mask alpha grid round-trip exceeded threshold')]
      : []),
  ];
  return createPngMaskRoundTripReport({
    artifactCount: 1,
    maxAlphaDelta,
    meanAlphaDelta,
    changedPixelRatio,
    blockingIssues,
    warnings: [],
  });
};

export const validatePngMaskAgainstBinaryMask = (input: {
  pngBytes: Uint8Array;
  sidecar: PngMaskSidecarMetadata;
  binaryMask: BinaryMaskBlob;
  maxAllowedDelta?: number;
}): PngMaskRoundTripReport => {
  const converted = convertPngAlphaMaskToBinaryAlphaMask(input.pngBytes, { sidecarMetadata: input.sidecar });
  const source = input.binaryMask.values;
  const target = converted.blob?.values ?? [];
  const deltas = source.map((value, index) => Math.abs(value - (target[index] ?? -1)) / 255);
  const maxAlphaDelta = deltas.length ? Math.max(...deltas) : 0;
  const meanAlphaDelta = deltas.length ? deltas.reduce((sum, value) => sum + value, 0) / deltas.length : 0;
  const changedPixelRatio = deltas.length
    ? deltas.filter((value) => value > (input.maxAllowedDelta ?? 1 / 255 + 0.0001)).length / deltas.length
    : 0;
  const blockingIssues = [
    ...converted.issues,
    ...(changedPixelRatio > 0
      ? [issue('png-alpha-mask-roundtrip-failed', 'PNG alpha mask binary round-trip exceeded threshold')]
      : []),
  ];
  return createPngMaskRoundTripReport({
    artifactCount: 1,
    maxAlphaDelta,
    meanAlphaDelta,
    changedPixelRatio,
    blockingIssues,
    warnings: [],
  });
};

export const validatePngMaskRoundTrip = (input: {
  payload: TrainingMaskArtifactPayload;
  options: Parameters<typeof assertPngAlphaMaskRoundTrip>[0]['options'];
}): PngMaskRoundTripReport => {
  const result = assertPngAlphaMaskRoundTrip(input);
  return createPngMaskRoundTripReport({
    artifactCount: 1,
    maxAlphaDelta: result.maxAlphaDelta,
    meanAlphaDelta: result.meanAlphaDelta,
    changedPixelRatio: result.passed ? 0 : 1,
    blockingIssues: result.issues,
    warnings: [],
  });
};

export const createPngMaskRoundTripReport = (input: {
  artifactCount: number;
  maxAlphaDelta: number;
  meanAlphaDelta: number;
  changedPixelRatio: number;
  blockingIssues: TrainingBridgeValidationIssue[];
  warnings: TrainingBridgeValidationIssue[];
}): PngMaskRoundTripReport => ({
  schemaVersion: PNG_MASK_CODEC_SCHEMA_VERSION,
  reportId: `png-mask-roundtrip-${input.artifactCount}-${round4(input.maxAlphaDelta)}`,
  readiness: input.blockingIssues.length > 0 ? 'blocked' : input.warnings.length > 0 ? 'warning' : 'ready',
  checkedAt: '2026-05-30T00:00:00.000Z',
  artifactCount: input.artifactCount,
  maxAlphaDelta: round4(input.maxAlphaDelta),
  meanAlphaDelta: round4(input.meanAlphaDelta),
  changedPixelRatio: round4(input.changedPixelRatio),
  blockingIssues: input.blockingIssues,
  warnings: input.warnings,
});

export const summarizePngMaskRoundTrip = (
  report: PngMaskRoundTripReport,
): string =>
  `png-mask-roundtrip:${report.readiness}:artifacts=${report.artifactCount}:maxDelta=${report.maxAlphaDelta}:changed=${report.changedPixelRatio}`;
