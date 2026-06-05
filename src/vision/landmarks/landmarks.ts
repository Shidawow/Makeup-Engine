import type { MakeupPhotoInput } from '../image-input';

export interface FaceLandmarks {
  imageId: string;
  eyes: [number, number][];
  brows: [number, number][];
  lips: [number, number][];
  nose: [number, number][];
  confidence: number;
}

export const detectLandmarks = async (
  image: MakeupPhotoInput,
): Promise<FaceLandmarks> => ({
  imageId: image.id,
  eyes: [
    [176, 168],
    [336, 168],
  ],
  brows: [
    [168, 142],
    [344, 142],
  ],
  lips: [
    [238, 358],
    [274, 366],
    [306, 358],
  ],
  nose: [[256, 228]],
  confidence: 0.91,
});
