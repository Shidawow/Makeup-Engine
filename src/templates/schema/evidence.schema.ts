export const TEMPLATE_EVIDENCE_SCHEMA_VERSION = 'template-evidence-v0.1' as const;

export const HUMAN_VERIFICATION_STATUSES = [
  'ai_generated',
  'human_corrected',
  'human_verified',
  'ready_for_dataset',
  'rejected',
] as const;

export type HumanVerificationStatus = (typeof HUMAN_VERIFICATION_STATUSES)[number];

export type TemplateEvidenceSource =
  | 'source-image'
  | 'facemesh'
  | 'cosmetic-segmentation'
  | 'weighted-sampling'
  | 'skin-baseline'
  | 'edge-analysis'
  | 'semantic-analysis'
  | 'human-correction'
  | 'template-convergence'
  | 'quality-gate';

export interface TemplateEvidenceBase {
  source: TemplateEvidenceSource;
  confidence: number;
  version: typeof TEMPLATE_EVIDENCE_SCHEMA_VERSION;
  createdAt: string;
  regionIds: string[];
  debugReferences: string[];
  notes: string[];
}

export interface SourceImageEvidence extends TemplateEvidenceBase {
  source: 'source-image';
  imageId: string;
  fileName: string;
  sourceType: 'admin-upload' | 'fixture' | 'import';
}

export interface FaceGeometryEvidence extends TemplateEvidenceBase {
  source: 'facemesh';
  faceId: string;
  landmarkCount: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface SegmentationEvidence extends TemplateEvidenceBase {
  source: 'cosmetic-segmentation';
  providerId: string;
  maskCount: number;
  maskIds: string[];
}

export interface WeightedSamplingEvidence extends TemplateEvidenceBase {
  source: 'weighted-sampling';
  sampleGroups: string[];
  heatmapReferences: string[];
}

export interface SkinBaselineEvidence extends TemplateEvidenceBase {
  source: 'skin-baseline';
  differenceTargets: string[];
}

export interface EdgeAnalysisEvidence extends TemplateEvidenceBase {
  source: 'edge-analysis';
  edgeTargets: string[];
}

export interface SemanticEvidence extends TemplateEvidenceBase {
  source: 'semantic-analysis';
  labels: string[];
  explanations: string[];
}

export interface HumanCorrectionEvidence extends TemplateEvidenceBase {
  source: 'human-correction';
  correctionRecordIds: string[];
  adjustedRegions: string[];
  editCount: number;
}

export interface ConvergenceEvidence extends TemplateEvidenceBase {
  source: 'template-convergence';
  humanVerificationStatus: HumanVerificationStatus;
  correctionConfidence: number;
  evidenceNotes: string[];
}

export interface QualityEvidence extends TemplateEvidenceBase {
  source: 'quality-gate';
  humanVerificationStatus: HumanVerificationStatus;
  readyForDataset: boolean;
  rejectionReasons: string[];
}

export interface TemplateEvidence {
  schemaVersion: typeof TEMPLATE_EVIDENCE_SCHEMA_VERSION;
  evidenceId: string;
  templateId: string;
  createdAt: string;
  sourceImageEvidence: SourceImageEvidence;
  faceGeometryEvidence: FaceGeometryEvidence;
  segmentationEvidence: SegmentationEvidence;
  weightedSamplingEvidence: WeightedSamplingEvidence;
  skinBaselineEvidence: SkinBaselineEvidence;
  edgeAnalysisEvidence: EdgeAnalysisEvidence;
  semanticEvidence: SemanticEvidence;
  humanCorrectionEvidence: HumanCorrectionEvidence;
  convergenceEvidence: ConvergenceEvidence;
  qualityEvidence: QualityEvidence;
}
