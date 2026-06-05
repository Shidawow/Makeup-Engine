import type { VisionProviderCapability, VisionProviderKind } from '../types';

export const ONNX_PROVIDER_KIND: VisionProviderKind = 'onnx';

export const ONNX_TARGET_CAPABILITIES: VisionProviderCapability[] = [
  'face-detection',
  'face-landmarks',
  'segmentation',
  'cosmetic-region-analysis',
];

