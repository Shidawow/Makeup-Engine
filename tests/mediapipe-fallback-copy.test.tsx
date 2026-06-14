import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  formatVisionAnalysisFailureMessage,
  VisionAnalysisDemo,
} from '../src/components/demo/vision-analysis-demo/VisionAnalysisDemo';
import { TemplateStudio } from '../src/components/template-studio/TemplateStudio';
import { MediaPipeLocalAssetMissingError } from '../src/vision';

describe('MediaPipe fallback copy', () => {
  it('explains public/mediapipe recovery and development fallback in Template Studio', () => {
    const html = renderToStaticMarkup(<TemplateStudio />);

    expect(html).toContain('MediaPipe 本地资源要求');
    expect(html).toContain('public/mediapipe/face_landmarker.task');
    expect(html).toContain('public/mediapipe/wasm/');
    expect(html).toContain('自动 fallback 到 mock vision provider');
  });

  it('explains public/mediapipe recovery and development fallback in the vision demo', () => {
    const html = renderToStaticMarkup(<VisionAnalysisDemo />);

    expect(html).toContain('真实 FaceMesh 需要');
    expect(html).toContain('public/mediapipe/face_landmarker.task');
    expect(html).toContain('public/mediapipe/wasm/vision_wasm_internal.js');
    expect(html).toContain('localhost 开发环境会自动 fallback 到 mock vision provider');
    expect(html).toContain('MediaPipe model/wasm 文件放回 public/mediapipe');
  });

  it('shows a recovery hint for missing MediaPipe assets instead of generic failure', () => {
    const message = formatVisionAnalysisFailureMessage(
      new MediaPipeLocalAssetMissingError('/mediapipe/face_landmarker.task'),
    );

    expect(message).toContain('MediaPipe 本地资源缺失');
    expect(message).toContain('/mediapipe/face_landmarker.task');
    expect(message).toContain('/mediapipe/wasm/vision_wasm_internal.js');
    expect(message).toContain('localhost/127.0.0.1 会自动 fallback 到 mock vision provider');
    expect(message).toContain('MediaPipe model/wasm 文件放回 public/mediapipe');
    expect(message).not.toBe('FaceMesh 分析失败。');
  });

  it('uses an actionable mask-panel fallback when no error details are available', () => {
    const message = formatVisionAnalysisFailureMessage(undefined);

    expect(message).toContain('缺少本地 MediaPipe 资源');
    expect(message).toContain('/mediapipe/face_landmarker.task');
    expect(message).toContain('/mediapipe/wasm/vision_wasm_internal.js');
    expect(message).toContain('localhost 环境会 fallback 到 mock vision provider');
    expect(message).not.toBe('FaceMesh 分析失败。');
  });
});
