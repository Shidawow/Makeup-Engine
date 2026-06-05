import type {
  FaceMeshGeometry,
  NormalizedPolygon,
  VisionSegmentationMask,
} from '../providers';

export type CosmeticRegionKind =
  | 'lips'
  | 'eyes'
  | 'brows'
  | 'blush'
  | 'contour'
  | 'highlight';

export type EditableParameterSource =
  | 'landmarks'
  | 'segmentation'
  | 'inference'
  | 'admin-edit';

export interface CosmeticRegionMask {
  kind: 'polygon';
  polygon: NormalizedPolygon;
  feather: number;
  opacity: number;
}

export interface CosmeticRegionBase {
  id: string;
  kind: CosmeticRegionKind;
  label: string;
  polygon: NormalizedPolygon;
  mask: CosmeticRegionMask;
  confidence: number;
  source: EditableParameterSource;
  editable: true;
  debug: string[];
}

export interface LipsParameters {
  coverage: 'center-gradient' | 'full-lip' | 'overlined';
  colorFamily: 'nude' | 'pink' | 'coral' | 'red' | 'berry';
  edgeSoftness: number;
  glossLevel: number;
}

export interface EyesParameters {
  eyelinerWeight: number;
  eyeshadowSpread: number;
  lashEmphasis: number;
  liftAngle: number;
}

export interface BrowsParameters {
  definition: number;
  archLift: number;
  density: number;
}

export interface BlushParameters {
  placement: 'apple' | 'high-cheek' | 'under-eye' | 'temple-draped';
  saturation: number;
  diffusion: number;
}

export interface ContourParameters {
  cheekDepth: number;
  jawDefinition: number;
  noseDefinition: number;
  blendSoftness: number;
}

export interface HighlightParameters {
  glowIntensity: number;
  placement: 'cheekbone' | 'nose-bridge' | 'inner-corner' | 'multi-point';
  particleShimmer: number;
}

export type CosmeticRegionParameter =
  | (CosmeticRegionBase & { kind: 'lips'; parameters: LipsParameters })
  | (CosmeticRegionBase & { kind: 'eyes'; parameters: EyesParameters })
  | (CosmeticRegionBase & { kind: 'brows'; parameters: BrowsParameters })
  | (CosmeticRegionBase & { kind: 'blush'; parameters: BlushParameters })
  | (CosmeticRegionBase & { kind: 'contour'; parameters: ContourParameters })
  | (CosmeticRegionBase & { kind: 'highlight'; parameters: HighlightParameters });

export interface CosmeticRegionBuildContext {
  imageId: string;
  faceMesh: FaceMeshGeometry;
  segmentationMasks: VisionSegmentationMask[];
}

