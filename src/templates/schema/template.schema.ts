import type {
  ContourDesign,
  EyeDesign,
  FaceStrategy,
  LipDesign,
  MakeupRegion,
  MakeupStep,
} from './technique.schema';
import type { FaceSuitabilitySchema } from './face-suitability.schema';
import type { StyleTaxonomyProfile } from './style.schema';
import type {
  HumanVerificationStatus,
  TemplateEvidence,
} from './evidence.schema';

export const TEMPLATE_STATUSES = ['draft', 'validated', 'deprecated'] as const;

export type TemplateStatus = (typeof TEMPLATE_STATUSES)[number];

export interface MakeupTemplateSource {
  imageId: string;
  fileName: string;
  sourceType: 'admin-upload' | 'fixture' | 'import';
}

export interface MakeupTemplateRegionEvidence {
  region: MakeupRegion;
  detected: boolean;
  confidence: number;
  cues: string[];
}

export interface MakeupTemplateMetadata {
  version: '0.1';
  status: TemplateStatus;
  createdAt: string;
  createdBy: string;
  source: MakeupTemplateSource;
  styleTags: string[];
  visionMetrics?: {
    opacityConfidence?: number;
    edgeSoftness?: number;
    diffusionQuality?: number;
    skinRelativeIntensity?: number;
  };
  visionEvidence?: {
    source: 'ai-only' | 'human-verified';
    maskEditCount: number;
    adjustedRegions: string[];
    evidenceNotes: string[];
  };
  correctionConfidence?: number;
  humanAdjustedRegions?: string[];
  analysisVersion?: string;
  humanVerificationStatus?: HumanVerificationStatus;
  evidenceId?: string;
  semanticEnrichment?: {
    providerId: string;
    makeupStyleName: string;
    professionalDescription: string;
    qaSuggestions: string[];
    reviewerHints: string[];
    userFacingExplanation: string;
  };
}

export interface MakeupTemplate {
  id: string;
  name: string;
  goals: string[];
  faceStrategy: FaceStrategy;
  style: StyleTaxonomyProfile;
  faceSuitability: FaceSuitabilitySchema;
  regions: MakeupTemplateRegionEvidence[];
  eyeDesign: EyeDesign;
  lipDesign: LipDesign;
  contourDesign: ContourDesign;
  steps: MakeupStep[];
  metadata: MakeupTemplateMetadata;
  evidence?: TemplateEvidence;
  notes?: string[];
}

export interface TemplateValidationIssue {
  path: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface TemplateValidationResult {
  valid: boolean;
  issues: TemplateValidationIssue[];
}
