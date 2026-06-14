export type VisionAnalysisErrorCode =
  | 'missing_mediapipe_assets'
  | 'facemesh_runtime_unavailable'
  | 'image_decode_failed'
  | 'canvas_read_failed'
  | 'no_face_landmarks_detected'
  | 'unsupported_image_format'
  | 'unknown_vision_analysis_error';

export interface VisionAnalysisErrorDetails {
  code: VisionAnalysisErrorCode;
  message: string;
  assetPath?: string;
  originalMessage?: string;
  recoveryHint?: string;
  fallbackAvailableInDevelopment?: boolean;
}

export class VisionAnalysisError extends Error {
  readonly code: VisionAnalysisErrorCode;
  readonly assetPath?: string;
  readonly recoveryHint?: string;
  readonly fallbackAvailableInDevelopment: boolean;

  constructor(details: VisionAnalysisErrorDetails) {
    super(details.message);
    this.name = 'VisionAnalysisError';
    this.code = details.code;
    this.assetPath = details.assetPath;
    this.recoveryHint = details.recoveryHint;
    this.fallbackAvailableInDevelopment =
      details.fallbackAvailableInDevelopment ?? false;
  }
}

export const MEDIA_PIPE_LOCAL_MODEL_ASSET_PATH = '/mediapipe/face_landmarker.task';
export const MEDIA_PIPE_LOCAL_WASM_READY_PATH =
  '/mediapipe/wasm/vision_wasm_internal.js';

export const MEDIA_PIPE_REQUIRED_LOCAL_ASSETS = [
  MEDIA_PIPE_LOCAL_MODEL_ASSET_PATH,
  MEDIA_PIPE_LOCAL_WASM_READY_PATH,
] as const;

export const VISION_ANALYSIS_LOCAL_FALLBACK_HOSTS = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
] as const;

const GENERIC_VISION_FAILURE_MESSAGES = new Set([
  '分析失败',
  'FaceMesh 分析失败。',
  'FaceMesh 分析失败：未返回具体错误原因。',
  '模板工作台分析失败。',
]);

export const getVisionAnalysisRecoveryHint = (assetPath?: string): string =>
  [
    assetPath ? `MediaPipe 本地资源缺失：${assetPath}` : null,
    '缺少本地 MediaPipe 资源，真实 FaceMesh 无法启动。',
    '需要检查：',
    `* ${MEDIA_PIPE_LOCAL_MODEL_ASSET_PATH}`,
    `* ${MEDIA_PIPE_LOCAL_WASM_READY_PATH}`,
    '本地 localhost 环境会 fallback 到 mock vision provider，方便继续调试图片与蒙版页面。',
    '如果需要真实 FaceMesh，请把 MediaPipe model/wasm 文件放回 public/mediapipe。',
  ]
    .filter(Boolean)
    .join('\n');

export const createMissingMediaPipeAssetsError = (
  assetPath = MEDIA_PIPE_LOCAL_MODEL_ASSET_PATH,
): VisionAnalysisError =>
  new VisionAnalysisError({
    code: 'missing_mediapipe_assets',
    message: `MediaPipe local asset is missing: ${assetPath}. public/mediapipe must be prepared before running real FaceMesh.`,
    assetPath,
    recoveryHint: getVisionAnalysisRecoveryHint(assetPath),
    fallbackAvailableInDevelopment: true,
  });

export const isMissingMediaPipeAssetsError = (
  error: unknown,
): error is VisionAnalysisError & { assetPath: string } =>
  (error instanceof VisionAnalysisError &&
    error.code === 'missing_mediapipe_assets') ||
  (error instanceof Error &&
    error.name === 'MediaPipeLocalAssetMissingError' &&
    typeof (error as { assetPath?: unknown }).assetPath === 'string') ||
  (typeof error === 'object' &&
    error !== null &&
    (error as { code?: unknown }).code === 'missing_mediapipe_assets' &&
    typeof (error as { assetPath?: unknown }).assetPath === 'string');

export const isVisionAnalysisDevelopmentFallbackAllowed = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return VISION_ANALYSIS_LOCAL_FALLBACK_HOSTS.includes(
    window.location.hostname as (typeof VISION_ANALYSIS_LOCAL_FALLBACK_HOSTS)[number],
  );
};

export const shouldUseVisionAnalysisDevelopmentFallback = (
  error: unknown,
): boolean =>
  isMissingMediaPipeAssetsError(error) &&
  isVisionAnalysisDevelopmentFallbackAllowed();

export const getVisionAnalysisErrorDetails = (
  error: unknown,
): VisionAnalysisErrorDetails => {
  if (isMissingMediaPipeAssetsError(error)) {
    const assetPath = (error as { assetPath: string }).assetPath;

    return {
      code: 'missing_mediapipe_assets',
      message: '缺少本地 MediaPipe 资源，真实 FaceMesh 无法启动。',
      assetPath,
      originalMessage: error instanceof Error ? error.message : undefined,
      recoveryHint: getVisionAnalysisRecoveryHint(assetPath),
      fallbackAvailableInDevelopment: true,
    };
  }

  const message = error instanceof Error ? error.message.trim() : '';

  if (message.includes('did not detect a face')) {
    return {
      code: 'no_face_landmarks_detected',
      message: '没有检测到可用的人脸关键点，请换一张清晰正脸或半侧脸照片后重试。',
      originalMessage: message,
    };
  }

  if (message.includes('canvas') || message.includes('ImageData')) {
    return {
      code: 'canvas_read_failed',
      message: '浏览器无法读取图片像素，请确认图片可以正常显示后重试。',
      originalMessage: message,
    };
  }

  if (message.includes('decode') || message.includes('unsupported image')) {
    return {
      code: 'image_decode_failed',
      message: '图片解码失败，请换用 PNG 或浏览器可读取的图片后重试。',
      originalMessage: message,
    };
  }

  if (message && !GENERIC_VISION_FAILURE_MESSAGES.has(message)) {
    return {
      code: 'unknown_vision_analysis_error',
      message: `视觉分析无法完成：${message}`,
      originalMessage: message,
    };
  }

  return {
    code: 'unknown_vision_analysis_error',
    message: getVisionAnalysisRecoveryHint(),
    recoveryHint: getVisionAnalysisRecoveryHint(),
  };
};

export const formatVisionAnalysisErrorForUser = (error: unknown): string => {
  const details = getVisionAnalysisErrorDetails(error);

  return details.recoveryHint ?? details.message;
};
