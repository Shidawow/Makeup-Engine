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

const LOCAL_WASM_READY_CHECK_PATH = '/vision_wasm_internal.js';

export const MEDIA_PIPE_LOCAL_ASSET_RECOVERY_STEPS = [
  '确认仓库根目录下存在 public/mediapipe/。',
  '确认 public/mediapipe/face_landmarker.task 存在。',
  '确认 public/mediapipe/wasm/ 内存在 MediaPipe Tasks Vision wasm/js 文件。',
  '重新运行 npm run dev 并刷新浏览器页面。',
] as const;

export class MediaPipeLocalAssetMissingError extends Error {
  readonly assetPath: string;
  readonly recoverySteps = MEDIA_PIPE_LOCAL_ASSET_RECOVERY_STEPS;
  readonly fallbackAvailableInDevelopment = true;

  constructor(assetPath: string) {
    super(
      `MediaPipe local asset is missing: ${assetPath}. public/mediapipe must be prepared before running real FaceMesh.`,
    );
    this.name = 'MediaPipeLocalAssetMissingError';
    this.assetPath = assetPath;
  }
}

export const isMediaPipeLocalAssetMissingError = (
  error: unknown,
): error is MediaPipeLocalAssetMissingError =>
  error instanceof MediaPipeLocalAssetMissingError ||
  (error instanceof Error && error.name === 'MediaPipeLocalAssetMissingError');

export const formatMediaPipeLocalAssetRecoveryMessage = (error: unknown): string => {
  if (!isMediaPipeLocalAssetMissingError(error)) {
    return error instanceof Error ? error.message : 'FaceMesh 分析失败。';
  }

  return [
    `MediaPipe 本地资源缺失：${error.assetPath}`,
    '原因：public/mediapipe 未准备或没有被本地 dev server 提供，真实 FaceMesh 无法启动。',
    `恢复说明：${error.recoverySteps.join(' ')}`,
    '开发环境说明：localhost/127.0.0.1 会自动 fallback 到 mock vision provider，方便继续调试页面；非本地环境不会自动 fallback。',
  ].join('\n');
};

export const isMediaPipeDevelopmentFallbackAllowed = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return ['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(window.location.hostname);
};

export const shouldUseMediaPipeDevelopmentFallback = (error: unknown): boolean =>
  isMediaPipeLocalAssetMissingError(error) && isMediaPipeDevelopmentFallbackAllowed();

const toAbsoluteAssetUrl = (assetPath: string): string => {
  if (/^https?:\/\//.test(assetPath)) {
    return assetPath;
  }

  return new URL(assetPath, window.location.origin).toString();
};

const assertAssetReachable = async (assetPath: string): Promise<void> => {
  let response: Response;

  try {
    response = await fetch(toAbsoluteAssetUrl(assetPath), {
      method: 'HEAD',
      cache: 'no-store',
    });
  } catch {
    throw new MediaPipeLocalAssetMissingError(assetPath);
  }

  if (!response.ok) {
    throw new MediaPipeLocalAssetMissingError(assetPath);
  }
};

const assertLocalMediaPipeAssetsAvailable = async (
  config: MediaPipeFaceMeshRuntimeConfig,
): Promise<void> => {
  const wasmBaseUrl = config.wasmBaseUrl ?? LOCAL_WASM_BASE_URL;
  const modelAssetPath = config.modelAssetPath ?? LOCAL_MODEL_ASSET_PATH;

  await assertAssetReachable(modelAssetPath);
  await assertAssetReachable(`${wasmBaseUrl}${LOCAL_WASM_READY_CHECK_PATH}`);
};

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
    if (this.config.checkLocalAssets !== false) {
      await assertLocalMediaPipeAssetsAvailable(this.config);
    }

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
