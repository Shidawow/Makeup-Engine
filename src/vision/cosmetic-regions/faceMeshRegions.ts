import type {
  CosmeticRegionBuildContext,
  CosmeticRegionKind,
  CosmeticRegionMask,
  CosmeticRegionParameter,
} from './types';
import type {
  FaceMeshGeometry,
  FaceMeshLandmark,
  NormalizedPoint,
  NormalizedPolygon,
  VisionSegmentationMask,
} from '../providers';

const regionLandmarkIndices: Record<CosmeticRegionKind, number[]> = {
  lips: [61, 146, 91, 181, 84, 17, 291, 308, 324, 318, 402, 317],
  eyes: [33, 160, 158, 133, 153, 144, 362, 385, 387, 263, 373, 380],
  brows: [70, 63, 105, 66, 336, 296, 334, 293],
  blush: [234, 33, 61, 291, 263, 454],
  contour: [234, 10, 454, 152],
  highlight: [1, 33, 263, 10],
};

const fallbackPolygons: Record<CosmeticRegionKind, Array<[number, number]>> = {
  lips: [
    [0.42, 0.67],
    [0.5, 0.64],
    [0.58, 0.67],
    [0.5, 0.72],
  ],
  eyes: [
    [0.32, 0.32],
    [0.68, 0.32],
    [0.68, 0.4],
    [0.32, 0.4],
  ],
  brows: [
    [0.31, 0.27],
    [0.69, 0.27],
    [0.69, 0.33],
    [0.31, 0.33],
  ],
  blush: [
    [0.28, 0.48],
    [0.72, 0.48],
    [0.66, 0.61],
    [0.34, 0.61],
  ],
  contour: [
    [0.24, 0.42],
    [0.76, 0.42],
    [0.6, 0.82],
    [0.4, 0.82],
  ],
  highlight: [
    [0.42, 0.34],
    [0.58, 0.34],
    [0.56, 0.56],
    [0.44, 0.56],
  ],
};

const toPoint = ([x, y]: [number, number]): NormalizedPoint => ({
  x,
  y,
  space: 'normalized-image',
});

const toPolygon = (points: Array<[number, number]>): NormalizedPolygon => ({
  points: points.map(toPoint),
  space: 'normalized-image',
});

const findLandmark = (
  faceMesh: FaceMeshGeometry,
  index: number,
): FaceMeshLandmark | undefined =>
  faceMesh.landmarks.find((landmark) => landmark.index === index);

const polygonFromLandmarks = (
  faceMesh: FaceMeshGeometry,
  kind: CosmeticRegionKind,
): NormalizedPolygon => {
  const points = regionLandmarkIndices[kind]
    .map((index) => findLandmark(faceMesh, index))
    .filter((landmark): landmark is FaceMeshLandmark => Boolean(landmark))
    .map((landmark) => landmark.point);

  if (points.length < 3) {
    return toPolygon(fallbackPolygons[kind]);
  }

  return {
    points,
    space: 'normalized-image',
  };
};

const confidenceFromLandmarks = (
  faceMesh: FaceMeshGeometry,
  kind: CosmeticRegionKind,
): number => {
  const landmarks = regionLandmarkIndices[kind]
    .map((index) => findLandmark(faceMesh, index))
    .filter((landmark): landmark is FaceMeshLandmark => Boolean(landmark));

  if (landmarks.length === 0) {
    return Number((faceMesh.confidence * 0.7).toFixed(3));
  }

  const total = landmarks.reduce(
    (sum, landmark) => sum + landmark.confidence,
    0,
  );
  return Number((total / landmarks.length).toFixed(3));
};

const maskFor = (
  kind: CosmeticRegionKind,
  polygon: NormalizedPolygon,
  segmentationMasks: VisionSegmentationMask[],
): CosmeticRegionMask => {
  const segmentationMask = segmentationMasks.find((mask) => mask.label === kind);

  return {
    kind: 'polygon',
    polygon: segmentationMask?.polygon ?? polygon,
    feather: kind === 'contour' || kind === 'blush' ? 0.18 : 0.08,
    opacity: kind === 'highlight' ? 0.55 : 0.7,
  };
};

export const buildCosmeticRegionsFromFaceMesh = (
  context: CosmeticRegionBuildContext,
): CosmeticRegionParameter[] => {
  const { imageId, faceMesh, segmentationMasks } = context;

  const createBase = (kind: CosmeticRegionKind, label: string) => {
    const polygon = polygonFromLandmarks(faceMesh, kind);
    return {
      id: `${imageId}-${kind}`,
      label,
      polygon,
      mask: maskFor(kind, polygon, segmentationMasks),
      confidence: confidenceFromLandmarks(faceMesh, kind),
      source: 'landmarks' as const,
      editable: true as const,
      debug: [
        `Built ${kind} polygon from normalized FaceMesh landmarks.`,
        `Polygon point count: ${polygon.points.length}.`,
      ],
    };
  };

  return [
    {
      ...createBase('lips', 'Lips'),
      kind: 'lips',
      parameters: {
        coverage: 'center-gradient',
        colorFamily: 'pink',
        edgeSoftness: 0.72,
        glossLevel: 0.35,
      },
    },
    {
      ...createBase('eyes', 'Eyes'),
      kind: 'eyes',
      parameters: {
        eyelinerWeight: 0.42,
        eyeshadowSpread: 0.38,
        lashEmphasis: 0.48,
        liftAngle: 8,
      },
    },
    {
      ...createBase('brows', 'Brows'),
      kind: 'brows',
      parameters: {
        definition: 0.46,
        archLift: 0.28,
        density: 0.58,
      },
    },
    {
      ...createBase('blush', 'Blush'),
      kind: 'blush',
      parameters: {
        placement: 'high-cheek',
        saturation: 0.36,
        diffusion: 0.78,
      },
    },
    {
      ...createBase('contour', 'Contour'),
      kind: 'contour',
      parameters: {
        cheekDepth: 0.34,
        jawDefinition: 0.24,
        noseDefinition: 0.2,
        blendSoftness: 0.82,
      },
    },
    {
      ...createBase('highlight', 'Highlight'),
      kind: 'highlight',
      parameters: {
        glowIntensity: 0.44,
        placement: 'multi-point',
        particleShimmer: 0.16,
      },
    },
  ];
};

