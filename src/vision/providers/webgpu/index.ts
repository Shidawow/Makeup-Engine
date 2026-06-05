import type { VisionProviderCapability, VisionProviderKind } from '../types';

export const WEBGPU_PROVIDER_KIND: VisionProviderKind = 'webgpu';

export const WEBGPU_TARGET_CAPABILITIES: VisionProviderCapability[] = [
  'segmentation',
  'cosmetic-region-analysis',
];

