import type { CosmeticRegionParameter } from '../../cosmetic-regions';
import type { MakeupPhotoInput } from '../../image-input';
import type { ImagePixelData } from '../../pixel-analysis';
import type { FaceMeshGeometry } from '../../providers';
import type { CosmeticSegmentationResult, CosmeticSegmentationTarget } from '../masks';

export type SegmentationProviderKind =
  | 'baseline'
  | 'mock'
  | 'mediapipe'
  | 'onnx'
  | 'webgpu'
  | 'remote';

export interface SegmentationProviderInput {
  image: MakeupPhotoInput;
  faceMesh: FaceMeshGeometry;
  cosmeticRegions: CosmeticRegionParameter[];
  pixelData?: ImagePixelData;
  targets?: CosmeticSegmentationTarget[];
}

export interface SegmentationProvider {
  id: string;
  kind: SegmentationProviderKind;
  targets: CosmeticSegmentationTarget[];
  initialize(): Promise<void>;
  warmup(): Promise<void>;
  segment(input: SegmentationProviderInput): Promise<CosmeticSegmentationResult>;
  dispose(): void;
}
