import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  MediaPipeLocalAssetMissingError,
  createMissingMediaPipeAssetsError,
  formatVisionAnalysisErrorForUser,
  getVisionAnalysisErrorDetails,
  isMissingMediaPipeAssetsError,
  shouldUseVisionAnalysisDevelopmentFallback,
} from '../src/vision';

const stubBrowserHost = (hostname: string) => {
  vi.stubGlobal('window', {
    location: {
      hostname,
      origin: `http://${hostname}:5173`,
    },
  });
};

describe('vision analysis error handling', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('classifies missing MediaPipe assets with a reusable error code', () => {
    const error = createMissingMediaPipeAssetsError('/mediapipe/face_landmarker.task');
    const details = getVisionAnalysisErrorDetails(error);

    expect(isMissingMediaPipeAssetsError(error)).toBe(true);
    expect(details.code).toBe('missing_mediapipe_assets');
    expect(details.assetPath).toBe('/mediapipe/face_landmarker.task');
    expect(formatVisionAnalysisErrorForUser(error)).toContain('缺少本地 MediaPipe 资源');
    expect(formatVisionAnalysisErrorForUser(error)).toContain('/mediapipe/wasm/vision_wasm_internal.js');
  });

  it('allows development fallback only on local hosts', () => {
    const error = new MediaPipeLocalAssetMissingError('/mediapipe/face_landmarker.task');

    stubBrowserHost('localhost');
    expect(shouldUseVisionAnalysisDevelopmentFallback(error)).toBe(true);

    stubBrowserHost('127.0.0.1');
    expect(shouldUseVisionAnalysisDevelopmentFallback(error)).toBe(true);

    stubBrowserHost('0.0.0.0');
    expect(shouldUseVisionAnalysisDevelopmentFallback(error)).toBe(true);

    stubBrowserHost('::1');
    expect(shouldUseVisionAnalysisDevelopmentFallback(error)).toBe(true);

    stubBrowserHost('example.com');
    expect(shouldUseVisionAnalysisDevelopmentFallback(error)).toBe(false);
  });

  it('does not return old bare generic analysis failure copy', () => {
    expect(formatVisionAnalysisErrorForUser(undefined)).not.toBe('FaceMesh 分析失败。');
    expect(formatVisionAnalysisErrorForUser(undefined)).not.toBe('模板工作台分析失败。');
    expect(formatVisionAnalysisErrorForUser(new Error('FaceMesh 分析失败。'))).toContain(
      '缺少本地 MediaPipe 资源',
    );
    expect(formatVisionAnalysisErrorForUser(new Error('模板工作台分析失败。'))).toContain(
      '缺少本地 MediaPipe 资源',
    );
  });

  it('maps known runtime messages to user-readable vision codes', () => {
    const details = getVisionAnalysisErrorDetails(
      new Error('MediaPipe FaceMesh did not detect a face for photo-1.'),
    );

    expect(details.code).toBe('no_face_landmarks_detected');
    expect(formatVisionAnalysisErrorForUser(new Error('canvas read failed'))).toContain(
      '浏览器无法读取图片像素',
    );
  });
});
