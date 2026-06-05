import type { StyleTaxonomyProfile } from '../../templates/schema';
import type { FaceDetectionResult } from '../face-detection';
import type { FaceLandmarks } from '../landmarks';
import type { MakeupPhotoInput } from '../image-input';
import type { SegmentedMakeupRegion } from '../segmentation';

export interface CosmeticAnalysisResult {
  imageId: string;
  faceDetected: boolean;
  faceShapeHint: string;
  makeupSignals: string[];
  styleClues: string[];
  confidence: number;
}

export const analyzeCosmeticSignals = async (
  image: MakeupPhotoInput,
  faceDetection: FaceDetectionResult,
  landmarks: FaceLandmarks,
  segmentedRegions: SegmentedMakeupRegion[],
  style: StyleTaxonomyProfile,
): Promise<CosmeticAnalysisResult> => ({
  imageId: image.id,
  faceDetected: faceDetection.detected,
  faceShapeHint:
    landmarks.eyes[0][0] < 200 ? 'round-leaning' : style.family === 'western' ? 'structured' : 'balanced',
  makeupSignals: segmentedRegions.map((region) => `${region.region}:${region.maskDescription}`),
  styleClues: style.signatureTraits,
  confidence: 0.9,
});
