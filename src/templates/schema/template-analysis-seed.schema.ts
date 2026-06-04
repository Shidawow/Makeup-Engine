import type {
  SourceImageCodecReport,
  SourceImageLineage,
  SourceImageQualityReport,
} from '../../training/schema';
import type {
  BrowserArtifactResource,
  SourceImageArtifactBindingIssue,
  SourceImageArtifactBindingStatus,
} from './source-image-artifact-binding.schema';

export const TEMPLATE_ANALYSIS_SEED_SCHEMA_VERSION =
  'template-analysis-seed-v0.1' as const;

export type TemplateAnalysisSeedArtifactPreference =
  | 'normalized-png'
  | 'raw-rgba'
  | 'json-rgba';

export type TemplateAnalysisSeedReadiness =
  | 'ready_for_vision_analysis'
  | 'blocked_by_source_image_quality'
  | 'blocked_by_codec'
  | 'blocked_by_missing_artifact'
  | 'failed';

export interface TemplateAnalysisSeedIssue {
  severity: 'error' | 'warning';
  code: string;
  message: string;
  source:
    | 'source-image-manifest'
    | 'source-image-entry'
    | 'artifact-resolution'
    | 'browser-boundary'
    | 'studio-session';
}

export interface TemplateAnalysisSeedArtifactLink {
  kind: TemplateAnalysisSeedArtifactPreference | 'original' | 'report';
  uri: string;
  checksum?: string;
  width?: number;
  height?: number;
  format?: string;
  browserReadable: boolean;
  notes?: readonly string[];
}

export interface TemplateAnalysisSeedSource {
  sourceType: 'source-image-package';
  packageId: string;
  manifestReference: string;
  entryStatus: string;
  createdBy: 'template-studio-source-image-intake';
}

export interface TemplateAnalysisSeed {
  schemaVersion: typeof TEMPLATE_ANALYSIS_SEED_SCHEMA_VERSION;
  seedId: string;
  source: TemplateAnalysisSeedSource;
  sourceImageId: string;
  sourceImagePackageId: string;
  sourceImageManifestPath?: string;
  sourceImageManifestReference?: string;
  originalFileName: string;
  selectedArtifactPreference: TemplateAnalysisSeedArtifactPreference;
  normalizedPngReference?: TemplateAnalysisSeedArtifactLink;
  rawRgbaReference?: TemplateAnalysisSeedArtifactLink;
  jsonRgbaReference?: TemplateAnalysisSeedArtifactLink;
  imageWidth: number;
  imageHeight: number;
  colorSpace: 'srgb' | 'unknown';
  qualityReport: SourceImageQualityReport;
  codecReport: SourceImageCodecReport;
  sourceImageLineage: SourceImageLineage;
  readiness: TemplateAnalysisSeedReadiness;
  issues: readonly TemplateAnalysisSeedIssue[];
  createdAt: string;
  imageReferenceUri?: string;
  jsonRgbaUri?: string;
  normalizedPngUri?: string;
  width?: number;
  height?: number;
  lineageChecksum?: string;
  boundArtifactResource?: BrowserArtifactResource;
  artifactBindingId?: string;
  browserPreviewUrl?: string;
  imageDataReference?: string;
  artifactBindingStatus?: SourceImageArtifactBindingStatus;
  artifactBindingIssues?: readonly SourceImageArtifactBindingIssue[];
}

export interface TemplateAnalysisSeedValidationResult {
  valid: boolean;
  readiness: TemplateAnalysisSeedReadiness;
  issues: readonly TemplateAnalysisSeedIssue[];
}
