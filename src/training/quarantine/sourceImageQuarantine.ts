import { stableStringify } from '../../templates/storage/datasetExport';
import type {
  QuarantinedSourceImage,
  SourceImageEntry,
  SourceImageQuarantine,
  SourceImageQuarantineReason,
} from '../schema';
import { SOURCE_IMAGE_QUARANTINE_SCHEMA_VERSION } from '../schema';

const REASON_MAP: Record<string, SourceImageQuarantineReason> = {
  'binary-read-failed': 'binary-read-failed',
  'unknown-file-kind': 'unknown-file-kind',
  'png-image-decode-failed': 'png-decode-failed',
  'png-decode-failed': 'png-decode-failed',
  'png-filter-unsupported': 'png-filter-unsupported',
  'png-color-type-unsupported': 'png-color-type-unsupported',
  'png-interlace-unsupported': 'png-interlace-unsupported',
  'jpeg-decode-unsupported': 'jpeg-decode-unsupported',
  'jpeg-decode-failed': 'jpeg-decode-failed',
  'exif-orientation-unsupported': 'exif-orientation-unsupported',
  'source-image-too-small': 'source-image-too-small',
  'source-image-too-dark': 'source-image-too-dark',
  'source-image-too-bright': 'source-image-too-bright',
  'source-image-low-contrast': 'source-image-low-contrast',
  'source-image-blank': 'source-image-blank',
  'source-image-transparent': 'source-image-transparent',
  'source-image-quality-blocked': 'source-image-quality-blocked',
  'source-image-manifest-invalid': 'source-image-manifest-invalid',
};

export const classifySourceImageIssue = (code: string): SourceImageQuarantineReason =>
  REASON_MAP[code] ?? 'source-image-manifest-invalid';

export const quarantineFailedSourceImage = (input: {
  sourceImageId: string;
  fileName: string;
  checksum?: string;
  issueCodes: readonly string[];
  blocking?: boolean;
}): QuarantinedSourceImage => ({
  sourceImageId: input.sourceImageId,
  fileName: input.fileName,
  checksum: input.checksum,
  reasons: [...new Set(input.issueCodes.map(classifySourceImageIssue))].sort(),
  severity: input.blocking === false ? 'warning' : 'blocking',
  notes: ['source image is not ready for template analysis'],
});

export const createSourceImageQuarantine = (input: {
  packageId: string;
  entries: readonly SourceImageEntry[];
  createdAt?: string;
}): SourceImageQuarantine => {
  const items = input.entries
    .filter((entry) => entry.importStatus !== 'ready_for_template_analysis')
    .map((entry) => quarantineFailedSourceImage({
      sourceImageId: entry.sourceImageId,
      fileName: entry.originalFileName,
      checksum: entry.originalFileChecksum,
      issueCodes: [...entry.codecReport.issueCodes, ...entry.qualityReport.issueCodes],
      blocking: entry.importStatus === 'failed' || entry.importStatus.startsWith('blocked'),
    }));
  return {
    schemaVersion: SOURCE_IMAGE_QUARANTINE_SCHEMA_VERSION,
    packageId: input.packageId,
    createdAt: input.createdAt ?? '2026-05-30T00:00:00.000Z',
    items,
    blockingCount: items.filter((item) => item.severity === 'blocking').length,
    warningCount: items.filter((item) => item.severity === 'warning').length,
  };
};

export const summarizeSourceImageQuarantine = (quarantine: SourceImageQuarantine): string =>
  `source-image-quarantine:${quarantine.packageId}:blocking=${quarantine.blockingCount}:warning=${quarantine.warningCount}`;

export const exportSourceImageQuarantineJson = (quarantine: SourceImageQuarantine): string =>
  stableStringify(quarantine);
