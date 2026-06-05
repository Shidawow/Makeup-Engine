import type { MakeupPhotoInput } from '../../image-input';
import type {
  FaceMeshLandmark,
  NormalizedBoundingBox,
  NormalizedPolygon,
  VisionProvider,
  VisionProviderResult,
  VisionSegmentationMask,
} from '../types';

const box: NormalizedBoundingBox = {
  x: 0.24,
  y: 0.12,
  width: 0.52,
  height: 0.72,
  space: 'normalized-image',
};

const landmark = (
  index: number,
  x: number,
  y: number,
  confidence = 0.95,
): FaceMeshLandmark => ({
  index,
  point: { x, y, space: 'normalized-image' },
  confidence,
});

const polygon = (points: Array<[number, number]>): NormalizedPolygon => ({
  points: points.map(([x, y]) => ({ x, y, space: 'normalized-image' })),
  space: 'normalized-image',
});

const createLandmarks = (): FaceMeshLandmark[] => [
  landmark(10, 0.5, 0.12),
  landmark(152, 0.5, 0.84),
  landmark(234, 0.24, 0.46),
  landmark(454, 0.76, 0.46),
  landmark(1, 0.5, 0.43),
  landmark(61, 0.42, 0.68),
  landmark(146, 0.44, 0.7),
  landmark(91, 0.47, 0.715),
  landmark(181, 0.5, 0.72),
  landmark(84, 0.53, 0.715),
  landmark(17, 0.56, 0.7),
  landmark(291, 0.58, 0.68),
  landmark(308, 0.56, 0.66),
  landmark(324, 0.53, 0.65),
  landmark(318, 0.5, 0.645),
  landmark(402, 0.47, 0.65),
  landmark(317, 0.44, 0.66),
  landmark(33, 0.34, 0.36),
  landmark(160, 0.38, 0.335),
  landmark(158, 0.43, 0.34),
  landmark(133, 0.47, 0.36),
  landmark(153, 0.43, 0.385),
  landmark(144, 0.38, 0.385),
  landmark(362, 0.53, 0.36),
  landmark(385, 0.58, 0.335),
  landmark(387, 0.63, 0.34),
  landmark(263, 0.67, 0.36),
  landmark(373, 0.63, 0.385),
  landmark(380, 0.58, 0.385),
  landmark(70, 0.33, 0.305),
  landmark(63, 0.38, 0.285),
  landmark(105, 0.44, 0.292),
  landmark(66, 0.48, 0.315),
  landmark(336, 0.52, 0.315),
  landmark(296, 0.56, 0.292),
  landmark(334, 0.62, 0.285),
  landmark(293, 0.67, 0.305),
];

const createMasks = (imageId: string): VisionSegmentationMask[] => [
  {
    id: `${imageId}-mask-lips`,
    label: 'lips',
    polygon: polygon([
      [0.42, 0.68],
      [0.5, 0.64],
      [0.58, 0.68],
      [0.5, 0.72],
    ]),
    confidence: 0.93,
  },
  {
    id: `${imageId}-mask-eye-band`,
    label: 'eyes',
    polygon: polygon([
      [0.32, 0.32],
      [0.68, 0.32],
      [0.68, 0.4],
      [0.32, 0.4],
    ]),
    confidence: 0.91,
  },
  {
    id: `${imageId}-mask-cheeks`,
    label: 'blush',
    polygon: polygon([
      [0.3, 0.5],
      [0.7, 0.5],
      [0.66, 0.62],
      [0.34, 0.62],
    ]),
    confidence: 0.86,
  },
];

export const createMockVisionProvider = (): VisionProvider => ({
  id: 'mock-vision-provider',
  kind: 'mock',
  capabilities: [
    'face-detection',
    'face-landmarks',
    'face-mesh',
    'segmentation',
    'cosmetic-region-analysis',
  ],
  analyze: async (image: MakeupPhotoInput): Promise<VisionProviderResult> => {
    const faceId = `${image.id}-face-0`;

    return {
      imageId: image.id,
      providerId: 'mock-vision-provider',
      faceDetection: {
        imageId: image.id,
        faceId,
        detected: true,
        confidence: 0.96,
        box,
      },
      faceMesh: {
        imageId: image.id,
        faceId,
        landmarks: createLandmarks(),
        boundingBox: box,
        confidence: 0.95,
      },
      segmentationMasks: createMasks(image.id),
      debug: [
        {
          stage: 'face-detection',
          label: 'Mock central face box',
          data: { confidence: 0.96, faceCount: 1 },
        },
        {
          stage: 'landmarks',
          label: 'Mock normalized FaceMesh subset',
          data: { landmarkCount: createLandmarks().length },
        },
      ],
    };
  },
});

