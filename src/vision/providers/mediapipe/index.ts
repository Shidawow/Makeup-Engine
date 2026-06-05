import type { MakeupPhotoInput } from '../../image-input';
import type { VisionProvider, VisionProviderResult } from '../types';
import {
  adaptMediaPipeFaceMesh,
  type MediaPipeFaceMeshResult,
} from './faceMeshAdapter';
import {
  createBrowserMediaPipeFaceMeshRuntime,
  type MediaPipeFaceMeshRuntime,
  type MediaPipeFaceMeshRuntimeConfig,
} from './runtime';

export interface MediaPipeFaceMeshDetector {
  estimateFaceMesh(image: MakeupPhotoInput): Promise<MediaPipeFaceMeshResult | null>;
}

export interface MediaPipeFaceMeshProviderOptions {
  runtime?: MediaPipeFaceMeshRuntime;
  runtimeConfig?: MediaPipeFaceMeshRuntimeConfig;
}

export interface MediaPipeFaceMeshProvider extends VisionProvider {
  initialize(): Promise<void>;
  warmup(): Promise<void>;
  dispose(): void;
}

const createRuntimeFromOptions = (
  options: MediaPipeFaceMeshProviderOptions = {},
): MediaPipeFaceMeshRuntime =>
  options.runtime ?? createBrowserMediaPipeFaceMeshRuntime(options.runtimeConfig);

export const createMediaPipeFaceMeshProvider = (
  options: MediaPipeFaceMeshProviderOptions = {},
): MediaPipeFaceMeshProvider => {
  const runtime = createRuntimeFromOptions(options);

  return {
    id: 'mediapipe-facemesh',
    kind: 'mediapipe',
    capabilities: ['face-detection', 'face-landmarks', 'face-mesh'],
    initialize: () => runtime.initialize(),
    warmup: () => runtime.warmup(),
    dispose: () => runtime.dispose(),
    analyze: async (image): Promise<VisionProviderResult> => {
      const startedAt = performance.now();
      const result = await runtime.detect(image);

      if (!result) {
        throw new Error(`MediaPipe FaceMesh did not detect a face for ${image.id}.`);
      }

    const faceId = `${image.id}-face-0`;
    const faceMesh = adaptMediaPipeFaceMesh(image.id, faceId, result);
      const durationMs = Math.round(performance.now() - startedAt);

      return {
        imageId: image.id,
        providerId: 'mediapipe-facemesh',
        faceDetection: {
          imageId: image.id,
          faceId,
          detected: true,
          confidence: faceMesh.confidence,
          box: faceMesh.boundingBox,
        },
        faceMesh,
        segmentationMasks: [],
        debug: [
          {
            stage: 'face-detection',
            label: 'MediaPipe FaceMesh face bounds',
            data: {
              confidence: faceMesh.confidence,
              x: Number(faceMesh.boundingBox.x.toFixed(4)),
              y: Number(faceMesh.boundingBox.y.toFixed(4)),
              width: Number(faceMesh.boundingBox.width.toFixed(4)),
              height: Number(faceMesh.boundingBox.height.toFixed(4)),
            },
          },
          {
            stage: 'landmarks',
            label: 'MediaPipe FaceMesh landmarks',
            data: {
              landmarkCount: faceMesh.landmarks.length,
              confidence: faceMesh.confidence,
              durationMs,
            },
          },
        ],
      };
    },
  };
};

export * from './faceMeshAdapter';
export * from './runtime';
