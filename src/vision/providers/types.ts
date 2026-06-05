import type { MakeupPhotoInput } from '../image-input';

export type VisionProviderKind =
  | 'mediapipe'
  | 'opencv'
  | 'onnx'
  | 'webgpu'
  | 'mock';

export type VisionProviderCapability =
  | 'face-detection'
  | 'face-landmarks'
  | 'face-mesh'
  | 'segmentation'
  | 'cosmetic-region-analysis';

export type NormalizedCoordinateSpace = 'normalized-image';

export interface NormalizedPoint {
  x: number;
  y: number;
  z?: number;
  space: NormalizedCoordinateSpace;
}

export interface NormalizedPolygon {
  points: NormalizedPoint[];
  space: NormalizedCoordinateSpace;
}

export interface NormalizedBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  space: NormalizedCoordinateSpace;
}

export interface VisionFaceDetection {
  imageId: string;
  faceId: string;
  detected: boolean;
  confidence: number;
  box: NormalizedBoundingBox;
}

export interface FaceMeshLandmark {
  index: number;
  point: NormalizedPoint;
  confidence: number;
}

export interface FaceMeshGeometry {
  imageId: string;
  faceId: string;
  landmarks: FaceMeshLandmark[];
  boundingBox: NormalizedBoundingBox;
  confidence: number;
}

export interface VisionSegmentationMask {
  id: string;
  label: string;
  polygon: NormalizedPolygon;
  confidence: number;
}

export interface VisionDebugArtifact {
  stage:
    | 'face-detection'
    | 'landmarks'
    | 'segmentation'
    | 'cosmetic-regions'
    | 'makeup-analysis';
  label: string;
  data: Record<string, string | number | boolean>;
}

export interface VisionProviderResult {
  imageId: string;
  providerId: string;
  faceDetection: VisionFaceDetection;
  faceMesh: FaceMeshGeometry;
  segmentationMasks: VisionSegmentationMask[];
  debug: VisionDebugArtifact[];
}

export interface VisionProvider {
  id: string;
  kind: VisionProviderKind;
  capabilities: VisionProviderCapability[];
  analyze(image: MakeupPhotoInput): Promise<VisionProviderResult>;
}

