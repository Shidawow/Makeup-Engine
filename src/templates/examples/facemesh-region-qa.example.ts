import { evaluateFaceMeshRegionQa, type FaceMeshGeometry } from '../../vision';

export const createFaceMeshQaExampleGeometry = (
  overrides: Partial<FaceMeshGeometry> = {},
): FaceMeshGeometry => ({
  imageId: 'phase-10a-example-image',
  faceId: 'phase-10a-example-face',
  confidence: 0.92,
  boundingBox: {
    x: 0.18,
    y: 0.08,
    width: 0.64,
    height: 0.82,
    space: 'normalized-image',
  },
  landmarks: Array.from({ length: 478 }, (_, index) => ({
    index,
    confidence: 0.92,
    point: {
      x: 0.2 + (index % 24) * 0.025,
      y: 0.12 + (Math.floor(index / 24) % 20) * 0.038,
      z: 0,
      space: 'normalized-image',
    },
  })),
  ...overrides,
});

export const faceMeshRegionQaReadyExample = evaluateFaceMeshRegionQa({
  faceMesh: createFaceMeshQaExampleGeometry(),
  providerId: 'mediapipe-face-mesh',
});

export const faceMeshRegionQaBlockedExample = evaluateFaceMeshRegionQa({
  faceMesh: createFaceMeshQaExampleGeometry({
    confidence: 0.31,
    landmarks: [],
  }),
  providerId: 'mediapipe-face-mesh',
});
