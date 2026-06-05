import type { MakeupPhotoInput } from '../../../image-input';
import type { MediaPipeFaceMeshResult } from '../faceMeshAdapter';

export type MediaPipeRuntimeState =
  | 'idle'
  | 'initializing'
  | 'ready'
  | 'disposed';

export interface MediaPipeFaceMeshRuntimeConfig {
  wasmBaseUrl?: string;
  modelAssetPath?: string;
  minFaceDetectionConfidence?: number;
  minFacePresenceConfidence?: number;
  minTrackingConfidence?: number;
}

export interface MediaPipeFaceMeshRuntime {
  readonly state: MediaPipeRuntimeState;
  initialize(): Promise<void>;
  warmup(): Promise<void>;
  detect(image: MakeupPhotoInput): Promise<MediaPipeFaceMeshResult | null>;
  dispose(): void;
}

