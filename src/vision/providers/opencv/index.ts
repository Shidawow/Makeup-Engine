import type { VisionProviderCapability, VisionProviderKind } from '../types';

export const OPENCV_PROVIDER_KIND: VisionProviderKind = 'opencv';

export const OPENCV_TARGET_CAPABILITIES: VisionProviderCapability[] = [
  'face-detection',
  'segmentation',
];

