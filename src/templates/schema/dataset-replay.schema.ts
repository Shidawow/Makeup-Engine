import type {
  CosmeticSegmentationMask,
  MakeupPixelAnalysis,
  MakeupSemanticAnalysis,
  SegmentationMaskGrid,
} from '../../vision';
import type { DatasetEvidenceSummary } from './dataset-review.schema';

export const DATASET_REPLAY_SCHEMA_VERSION = 'dataset-replay-v0.1' as const;

export interface DatasetReplayTemplateSummary {
  templateId: string;
  name: string;
  status: string;
  styleTags: string[];
  stepCount: number;
  evidenceId?: string;
}

export interface DatasetReplayPayload {
  schemaVersion: typeof DATASET_REPLAY_SCHEMA_VERSION;
  replayId: string;
  sampleId: string;
  imageId: string;
  templateId: string;
  regionId: string;
  originalMask: CosmeticSegmentationMask;
  humanEditedMask: CosmeticSegmentationMask;
  diffHeatmap: SegmentationMaskGrid;
  originalPixelAnalysis: MakeupPixelAnalysis | null;
  updatedPixelAnalysis: MakeupPixelAnalysis | null;
  originalSemantics: MakeupSemanticAnalysis | null;
  updatedSemantics: MakeupSemanticAnalysis | null;
  templateBefore: DatasetReplayTemplateSummary | null;
  templateAfter: DatasetReplayTemplateSummary | null;
  evidenceSummary: DatasetEvidenceSummary;
}
