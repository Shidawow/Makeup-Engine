import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  BrowserMediaPipeFaceMeshRuntime,
  formatMediaPipeLocalAssetRecoveryMessage,
  isMediaPipeLocalAssetMissingError,
  MediaPipeLocalAssetMissingError,
  shouldUseMediaPipeDevelopmentFallback,
} from '../src/vision';

const stubBrowser = (hostname = 'localhost') => {
  vi.stubGlobal('window', {
    location: {
      hostname,
      origin: `http://${hostname}:5173`,
    },
  });
  vi.stubGlobal('document', {});
};

describe('MediaPipe local asset readiness', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('identifies missing public/mediapipe assets before loading MediaPipe', async () => {
    stubBrowser();
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: false }) as Response),
    );

    const runtime = new BrowserMediaPipeFaceMeshRuntime();

    await expect(runtime.initialize()).rejects.toMatchObject({
      name: 'MediaPipeLocalAssetMissingError',
      assetPath: '/mediapipe/face_landmarker.task',
    });
    expect(runtime.state).toBe('idle');
  });

  it('formats recovery instructions and allows localhost mock fallback only', () => {
    const error = new MediaPipeLocalAssetMissingError('/mediapipe/face_landmarker.task');

    stubBrowser('localhost');
    expect(isMediaPipeLocalAssetMissingError(error)).toBe(true);
    expect(shouldUseMediaPipeDevelopmentFallback(error)).toBe(true);
    expect(formatMediaPipeLocalAssetRecoveryMessage(error)).toContain('public/mediapipe');
    expect(formatMediaPipeLocalAssetRecoveryMessage(error)).toContain('/mediapipe/wasm/vision_wasm_internal.js');
    expect(formatMediaPipeLocalAssetRecoveryMessage(error)).toContain('mock vision provider');
    expect(formatMediaPipeLocalAssetRecoveryMessage(error)).toContain('请把 MediaPipe model/wasm 文件放回 public/mediapipe');

    stubBrowser('example.com');
    expect(shouldUseMediaPipeDevelopmentFallback(error)).toBe(false);
  });
});
