import type { FaceFeatures } from '../../intelligence/types';

export interface FaceInput {
  features: FaceFeatures;
  imageId?: string;
  source?: 'manual' | 'cv' | 'api' | 'import';
}

export interface FaceInputContext {
  input: FaceInput;
  receivedAt: string;
}
