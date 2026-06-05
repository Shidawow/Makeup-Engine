import type {
  FaceMeshGeometry,
  FaceMeshLandmark,
  NormalizedBoundingBox,
  NormalizedPoint,
} from '../types';

export interface MediaPipeFaceMeshLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface MediaPipeFaceMeshResult {
  landmarks: MediaPipeFaceMeshLandmark[];
  confidence?: number;
}

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const toNormalizedPoint = (
  landmark: MediaPipeFaceMeshLandmark,
): NormalizedPoint => ({
  x: clamp01(landmark.x),
  y: clamp01(landmark.y),
  z: landmark.z,
  space: 'normalized-image',
});

const calculateBoundingBox = (
  landmarks: FaceMeshLandmark[],
): NormalizedBoundingBox => {
  const xs = landmarks.map((landmark) => landmark.point.x);
  const ys = landmarks.map((landmark) => landmark.point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
    space: 'normalized-image',
  };
};

export const adaptMediaPipeFaceMesh = (
  imageId: string,
  faceId: string,
  result: MediaPipeFaceMeshResult,
): FaceMeshGeometry => {
  const landmarks = result.landmarks.map<FaceMeshLandmark>(
    (landmark, index) => ({
      index,
      point: toNormalizedPoint(landmark),
      confidence: landmark.visibility ?? result.confidence ?? 0.9,
    }),
  );

  return {
    imageId,
    faceId,
    landmarks,
    boundingBox: calculateBoundingBox(landmarks),
    confidence: result.confidence ?? 0.9,
  };
};

