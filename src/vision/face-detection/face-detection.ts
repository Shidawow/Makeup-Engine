import type { MakeupPhotoInput } from '../image-input';

export interface FaceDetectionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FaceDetectionResult {
  imageId: string;
  detected: boolean;
  confidence: number;
  box: FaceDetectionBox;
  rationale: string[];
}

export const detectFace = async (
  image: MakeupPhotoInput,
): Promise<FaceDetectionResult> => ({
  imageId: image.id,
  detected: true,
  confidence: 0.93,
  box: { x: 128, y: 84, width: 256, height: 324 },
  rationale: ['Local face detection fixture recognized the central face area.'],
});
