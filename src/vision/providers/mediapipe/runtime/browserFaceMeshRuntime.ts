import type { FaceLandmarker } from '@mediapipe/tasks-vision';
import type { MakeupPhotoInput } from '../../../image-input';
import type { MediaPipeFaceMeshResult } from '../faceMeshAdapter';
import type {
  MediaPipeFaceMeshRuntime,
  MediaPipeFaceMeshRuntimeConfig,
  MediaPipeRuntimeState,
} from './types';

const LOCAL_WASM_BASE_URL = '/mediapipe/wasm';

const LOCAL_MODEL_ASSET_PATH = '/mediapipe/face_landmarker.task';

const assertBrowserRuntime = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('MediaPipe FaceMesh runtime requires a browser environment.');
  }
};

const loadImageElement = async (image: MakeupPhotoInput): Promise<HTMLImageElement> => {
  if (!image.imageUrl) {
    throw new Error(`Image ${image.id} is missing imageUrl for FaceMesh analysis.`);
  }

  const element = document.createElement('img');
  element.decoding = 'async';
  element.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    element.onload = () => resolve();
    element.onerror = () =>
      reject(new Error(`Failed to load image for FaceMesh analysis: ${image.fileName}`));
    element.src = image.imageUrl ?? '';
  });

  return element;
};

const createWarmupCanvas = (): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = 8;
  canvas.height = 8;
  const context = canvas.getContext('2d');

  if (context) {
    context.fillStyle = '#f7d7c8';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  return canvas;
};

export class BrowserMediaPipeFaceMeshRuntime implements MediaPipeFaceMeshRuntime {
  private landmarker: FaceLandmarker | null = null;
  private initializePromise: Promise<void> | null = null;
  private runtimeState: MediaPipeRuntimeState = 'idle';

  constructor(private readonly config: MediaPipeFaceMeshRuntimeConfig = {}) {}

  get state(): MediaPipeRuntimeState {
    return this.runtimeState;
  }

  async initialize(): Promise<void> {
    assertBrowserRuntime();

    if (this.runtimeState === 'ready') {
      return;
    }

    if (this.initializePromise) {
      return this.initializePromise;
    }

    this.runtimeState = 'initializing';
    this.initializePromise = this.loadLandmarker();

    try {
      await this.initializePromise;
      this.runtimeState = 'ready';
    } catch (error) {
      this.initializePromise = null;
      this.runtimeState = 'idle';
      throw error;
    }
  }

  async warmup(): Promise<void> {
    await this.initialize();
    this.landmarker?.detect(createWarmupCanvas());
  }

  async detect(image: MakeupPhotoInput): Promise<MediaPipeFaceMeshResult | null> {
    await this.initialize();

    if (!this.landmarker) {
      throw new Error('MediaPipe FaceMesh runtime is not initialized.');
    }

    const element = await loadImageElement(image);
    const result = this.landmarker.detect(element);
    const landmarks = result.faceLandmarks[0];

    if (!landmarks) {
      return null;
    }

    return {
      landmarks: landmarks.map((landmark) => ({
        x: landmark.x,
        y: landmark.y,
        z: landmark.z,
        visibility: landmark.visibility,
      })),
      confidence: 0.95,
    };
  }

  dispose(): void {
    this.landmarker?.close();
    this.landmarker = null;
    this.initializePromise = null;
    this.runtimeState = 'disposed';
  }

  private async loadLandmarker(): Promise<void> {
    const { FaceLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');
    const vision = await FilesetResolver.forVisionTasks(
      this.config.wasmBaseUrl ?? LOCAL_WASM_BASE_URL,
    );

    this.landmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: this.config.modelAssetPath ?? LOCAL_MODEL_ASSET_PATH,
        delegate: 'GPU',
      },
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: false,
      runningMode: 'IMAGE',
      numFaces: 1,
      minFaceDetectionConfidence: this.config.minFaceDetectionConfidence ?? 0.5,
      minFacePresenceConfidence: this.config.minFacePresenceConfidence ?? 0.5,
      minTrackingConfidence: this.config.minTrackingConfidence ?? 0.5,
    });
  }
}

export const createBrowserMediaPipeFaceMeshRuntime = (
  config?: MediaPipeFaceMeshRuntimeConfig,
): MediaPipeFaceMeshRuntime => new BrowserMediaPipeFaceMeshRuntime(config);
