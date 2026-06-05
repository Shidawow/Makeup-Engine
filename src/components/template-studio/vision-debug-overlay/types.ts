import type {
  CosmeticRegionKind,
  CosmeticRegionParameter,
} from '../../../vision/cosmetic-regions';
import type {
  FaceMeshGeometry,
  NormalizedBoundingBox,
} from '../../../vision/providers';
import type { OverlayCoordinateMapping } from '../../../vision/geometry';
import type { CosmeticSegmentationResult } from '../../../vision/segmentation';
import type {
  CosmeticSegmentationTarget,
  EditableCosmeticMask,
  MaskBrushPoint,
} from '../../../vision';
import type { TemplateConvergenceDiffItem } from '../../../template-engine/convergence';

export interface VisionDebugOverlayLayers {
  faceBox: boolean;
  landmarks: boolean;
  lips: boolean;
  eyes: boolean;
  brows: boolean;
  blush: boolean;
  contour: boolean;
  highlight: boolean;
  segmentationMasks: boolean;
  alphaHeatmap: boolean;
  blendedMask: boolean;
  weightedSampling: boolean;
  skinBaseline: boolean;
  edgeRings: boolean;
  editableMasks: boolean;
  userCorrections: boolean;
  recomputeRegions: boolean;
  convergenceDiff: boolean;
  brushCursor: boolean;
  activeRegionHighlight: boolean;
  beforeAfter: boolean;
}

export type OverlayBeforeAfterMode = 'before' | 'after';

export interface VisionDebugBrushCursor {
  point: MaskBrushPoint;
  radius: number;
  strength: number;
  visible: boolean;
}

export interface VisionDebugOverlayData {
  faceBox: NormalizedBoundingBox;
  faceMesh: FaceMeshGeometry;
  cosmeticRegions: CosmeticRegionParameter[];
  cosmeticSegmentation?: CosmeticSegmentationResult;
  aiOnlySegmentation?: CosmeticSegmentationResult;
  editableMasks?: readonly EditableCosmeticMask[];
  userCorrections?: readonly string[];
  recomputeRegions?: readonly CosmeticSegmentationTarget[];
  convergenceDiff?: readonly CosmeticSegmentationTarget[];
  convergenceDiffItems?: readonly TemplateConvergenceDiffItem[];
  brushCursor?: VisionDebugBrushCursor | null;
  activeRegion?: CosmeticSegmentationTarget;
  beforeAfterMode?: OverlayBeforeAfterMode;
}

export interface VisionDebugOverlayDrawOptions {
  width: number;
  height: number;
  opacity: number;
  zoom: number;
  layers: VisionDebugOverlayLayers;
  mapping?: OverlayCoordinateMapping;
}

export interface VisionDebugOverlayRenderInput {
  data: VisionDebugOverlayData;
  options: VisionDebugOverlayDrawOptions;
}

export type OverlayRegionLayer = Exclude<
  CosmeticRegionKind,
  'contour' | 'highlight'
> | 'contour' | 'highlight';
