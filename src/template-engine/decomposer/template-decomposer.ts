import type { CosmeticAnalysisResult } from '../../vision/cosmetic-analysis';
import type { FaceDetectionResult } from '../../vision/face-detection';
import type { FaceLandmarks } from '../../vision/landmarks';
import type { SegmentedMakeupRegion } from '../../vision/segmentation';
import type { MakeupRegion } from '../../templates/schema';

export interface TemplateDecomposition {
  detectedRegions: MakeupRegion[];
  faceShapeHint: string;
  makeupSignals: string[];
  rationale: string[];
}

export const decomposeMakeupPhoto = (
  faceDetection: FaceDetectionResult,
  landmarks: FaceLandmarks,
  segmentedRegions: SegmentedMakeupRegion[],
  cosmeticAnalysis: CosmeticAnalysisResult,
): TemplateDecomposition => ({
  detectedRegions: segmentedRegions.filter((region) => region.confidence >= 0.8).map((region) => region.region),
  faceShapeHint: cosmeticAnalysis.faceShapeHint,
  makeupSignals: cosmeticAnalysis.makeupSignals,
  rationale: [
    `Face detected at ${faceDetection.box.width}x${faceDetection.box.height}.`,
    `Landmarks confidence ${landmarks.confidence}.`,
    ...segmentedRegions.map((region) => `${region.region} detected with ${region.confidence}.`),
  ],
});
