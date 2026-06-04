import type {
  CosmeticSegmentationMask,
  CosmeticSegmentationTarget,
  MakeupPixelAnalysis,
  MakeupSemanticAnalysis,
} from '../../vision';
import type { MaskDiffArtifact } from '../../vision/segmentation/editing/maskDiff';
import type { HumanVerificationStatus } from './evidence.schema';

export const HUMAN_CORRECTION_DATASET_SCHEMA_VERSION =
  'human-correction-dataset-v0.1' as const;

export type HumanCorrectionSampleKind = 'mask-correction' | 'template-correction';

export interface HumanCorrectionEditorMetadata {
  editorId: string;
  tool: 'template-studio';
  sessionId: string;
  editedAt: string;
  notes: string[];
}

export interface HumanCorrectionSampleBase {
  schemaVersion: typeof HUMAN_CORRECTION_DATASET_SCHEMA_VERSION;
  sampleId: string;
  sampleKind: HumanCorrectionSampleKind;
  imageId: string;
  templateId: string;
  regionId: CosmeticSegmentationTarget;
  originalSegmentationMask: CosmeticSegmentationMask;
  humanEditedMask: CosmeticSegmentationMask;
  maskDiff: MaskDiffArtifact;
  originalPixelAnalysis: MakeupPixelAnalysis | null;
  updatedPixelAnalysis: MakeupPixelAnalysis | null;
  originalSemantics: MakeupSemanticAnalysis | null;
  updatedSemantics: MakeupSemanticAnalysis | null;
  editorMetadata: HumanCorrectionEditorMetadata;
  correctionReason: string;
  correctionConfidence: number;
  exportedAt: string;
  humanVerificationStatus: HumanVerificationStatus;
}

export interface HumanMaskCorrectionSample extends HumanCorrectionSampleBase {
  sampleKind: 'mask-correction';
  editCount: number;
}

export interface HumanTemplateCorrectionSample extends HumanCorrectionSampleBase {
  sampleKind: 'template-correction';
  templateDiffSummary: string[];
}

export type HumanCorrectionSample =
  | HumanMaskCorrectionSample
  | HumanTemplateCorrectionSample;

export interface HumanCorrectionDataset {
  schemaVersion: typeof HUMAN_CORRECTION_DATASET_SCHEMA_VERSION;
  datasetId: string;
  templateId: string;
  imageId: string;
  createdAt: string;
  exportedAt: string;
  sampleCount: number;
  humanVerificationStatus: HumanVerificationStatus;
  samples: HumanCorrectionSample[];
  summary: {
    regions: CosmeticSegmentationTarget[];
    averageCorrectionConfidence: number;
    readyForTraining: boolean;
    notes: string[];
  };
}
